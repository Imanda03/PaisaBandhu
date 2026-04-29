import axios from 'axios';
import { DEBUG_FORCE_APP_UPDATE_MODAL } from '../config/appUpdate';
import { APP_VERSION } from '../constants/appVersion';
import { API_URL } from '../utils/helper';

export const DEFAULT_PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.paisebandhu';

export type AppConfigPayload = {
  updateRequired: boolean;
  forceUpdate: boolean;
  message: string;
  androidStoreUrl: string;
  /** Server’s store / target version (for reference). */
  storeAppVersion?: string;
};

/** DB / JSON often sends booleans as strings; `Boolean("false")` is wrongly `true` in JS. */
function parseAppBool(value: unknown): boolean {
  if (value === true || value === 1) {
    return true;
  }
  if (value === false || value === 0 || value == null) {
    return false;
  }
  if (typeof value === 'string') {
    const s = value.trim().toLowerCase();
    if (s === 'false' || s === '0' || s === 'no' || s === '') {
      return false;
    }
    if (s === 'true' || s === '1' || s === 'yes') {
      return true;
    }
  }
  return false;
}

function pickStr(...vals: unknown[]): string {
  for (const v of vals) {
    if (v == null) {
      continue;
    }
    const s = String(v).trim();
    if (s.length > 0) {
      return s;
    }
  }
  return '';
}

/** Numeric semver segments (handles "2.1.0", "2.1.0+build"). */
function versionParts(v: string): number[] {
  const head = v.trim().split(/[-+]/)[0] ?? '';
  return head.split('.').map(part => parseInt(part.replace(/^\D+/g, ''), 10) || 0);
}

/** True if current < target (both treated as x.y.z). */
function isVersionLess(current: string, target: string): boolean {
  if (!current.trim() || !target.trim()) {
    return false;
  }
  const a = versionParts(current);
  const b = versionParts(target);
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const x = a[i] ?? 0;
    const y = b[i] ?? 0;
    if (x < y) {
      return true;
    }
    if (x > y) {
      return false;
    }
  }
  return false;
}

/** API / Mongo often wrap the document: `{ data: { doc: { ... } } }`. */
const CONFIG_NEST_KEYS = [
  'data',
  'config',
  'result',
  'appConfig',
  'payload',
  'document',
  'doc',
  'record',
  'item',
  'value',
  'attributes',
] as const;

/**
 * Store target for updates: only `storeAppVersion` / `store_app_version` on the envelope
 * (and one shallow unwrap of `data` / `result`). Ignores `latest_version` etc. here so stale
 * nested Mongo fields cannot override the real store line from curl/DB.
 */
function getAuthoritativeStoreVersion(body: Record<string, unknown>): string {
  const from = (o: Record<string, unknown>) =>
    pickStr(o.storeAppVersion, o.store_app_version);

  const top = from(body);
  if (top) {
    return top;
  }
  for (const key of ['data', 'result'] as const) {
    const inner = body[key];
    if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
      const s = from(inner as Record<string, unknown>);
      if (s) {
        return s;
      }
    }
  }
  return '';
}

/** Same envelope rules as store version — deep merge must not wipe a good top-level message. */
function getAuthoritativeMessage(body: Record<string, unknown>): string {
  const from = (o: Record<string, unknown>) =>
    pickStr(o.message, o.updateMessage, o.update_message);

  const top = from(body);
  if (top) {
    return top;
  }
  for (const key of ['data', 'result'] as const) {
    const inner = body[key];
    if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
      const s = from(inner as Record<string, unknown>);
      if (s) {
        return s;
      }
    }
  }
  return '';
}

/** Fallback when no explicit store fields exist anywhere (legacy APIs). */
function pickStoreVersionFromMerged(p: Record<string, unknown>): string {
  return pickStr(
    p.storeAppVersion,
    p.store_app_version,
    p.latestVersion,
    p.latest_version,
    p.playStoreVersion,
    p.play_store_version,
  );
}

function mergeNestedConfigLayers(root: Record<string, unknown>): Record<string, unknown> {
  let fromNested: Record<string, unknown> = {};
  const visited = new Set<object>();

  const visitNested = (node: Record<string, unknown>) => {
    if (visited.has(node)) {
      return;
    }
    visited.add(node);
    for (const key of CONFIG_NEST_KEYS) {
      const inner = node[key];
      if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
        fromNested = { ...fromNested, ...(inner as Record<string, unknown>) };
        visitNested(inner as Record<string, unknown>);
      }
    }
  };

  visitNested(root);
  // Root / envelope fields win over nested `data.doc` so stale inner JSON cannot override flat config.
  return { ...fromNested, ...root };
}

/** Unwrap nested envelopes; merge snake_case + camelCase. */
function normalizeConfigBody(body: unknown): AppConfigPayload {
  if (typeof body === 'string') {
    try {
      return normalizeConfigBody(JSON.parse(body) as unknown);
    } catch {
      return {
        updateRequired: false,
        forceUpdate: false,
        message: '',
        androidStoreUrl: DEFAULT_PLAY_STORE_URL,
      };
    }
  }

  if (Array.isArray(body)) {
    const first = body.find(
      (x): x is Record<string, unknown> =>
        x != null && typeof x === 'object' && !Array.isArray(x),
    );
    if (first) {
      return normalizeConfigBody(first);
    }
  }

  const root =
    body && typeof body === 'object' && !Array.isArray(body)
      ? (body as Record<string, unknown>)
      : {};

  const p = mergeNestedConfigLayers(root);

  const authoritativeStore = getAuthoritativeStoreVersion(root);
  const storeAppVersion =
    authoritativeStore || pickStoreVersionFromMerged(p);

  const apiUpdateFlag = parseAppBool(
    p.updateRequired ?? p.update_required ?? p.needsUpdate ?? p.needs_update,
  );
  const apiForceFlag = parseAppBool(
    p.forceUpdate ?? p.force_update ?? p.force ?? p.force_update_required,
  );

  const message =
    getAuthoritativeMessage(root) ||
    pickStr(p.message, p.updateMessage, p.update_message);
  const androidStoreUrl = pickStr(
    p.androidStoreUrl,
    p.android_store_url,
    p.playStoreUrl,
    p.play_store_url,
  );
  const minSupportedVersion = pickStr(
    p.minSupportedVersion,
    p.minimum_version,
    p.minAppVersion,
    p.min_app_version,
    p.minVersion,
    p.min_version,
  );

  const belowMinSupported =
    Boolean(minSupportedVersion) &&
    isVersionLess(APP_VERSION, minSupportedVersion);

  const behindStore =
    Boolean(storeAppVersion) && isVersionLess(APP_VERSION, storeAppVersion);

  let updateRequired: boolean;
  let forceUpdate: boolean;

  if (belowMinSupported) {
    updateRequired = true;
    forceUpdate = true;
  } else if (storeAppVersion) {
    // When server sends a store version, semver is the source of truth (avoids bad API flags).
    updateRequired = behindStore;
    forceUpdate = apiForceFlag && updateRequired;
  } else {
    updateRequired = apiUpdateFlag;
    forceUpdate = apiForceFlag;
  }

  // Belt-and-suspenders: never block users who already meet the chosen store/min version.
  if (
    !belowMinSupported &&
    storeAppVersion &&
    !isVersionLess(APP_VERSION, storeAppVersion)
  ) {
    updateRequired = false;
    forceUpdate = false;
  }

  const normalized: AppConfigPayload = {
    updateRequired,
    forceUpdate,
    message,
    androidStoreUrl: androidStoreUrl || DEFAULT_PLAY_STORE_URL,
    storeAppVersion: storeAppVersion || undefined,
  };

  if (__DEV__) {
    const rawTopStore = pickStr(root.storeAppVersion, root.store_app_version);
    // eslint-disable-next-line no-console
    console.log('[AppConfig]', {
      appVersion: APP_VERSION,
      rawKeys: Object.keys(p),
      /** If this differs from MongoDB, the HTTP response is not the DB row (API bug, wrong doc, or cache). */
      rawResponseStoreVersion: rawTopStore || '(none at JSON root — check data/result wrap)',
      normalized,
    });
  }

  return normalized;
}

export async function getAppConfig(): Promise<AppConfigPayload> {
  const { data } = await axios.get(`${API_URL}/app/config`, {
    params: { appVersion: APP_VERSION, _t: Date.now() },
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
  });
  const normalized = normalizeConfigBody(data);

  if (__DEV__ && DEBUG_FORCE_APP_UPDATE_MODAL) {
    return {
      ...normalized,
      updateRequired: true,
      forceUpdate: false,
      message:
        normalized.message ||
        '(Dev) Forced update modal — set DEBUG_FORCE_APP_UPDATE_MODAL to false in src/config/appUpdate.ts',
      storeAppVersion: normalized.storeAppVersion || '9.9.9',
      androidStoreUrl: normalized.androidStoreUrl || DEFAULT_PLAY_STORE_URL,
    };
  }

  return normalized;
}
