/* eslint-disable @typescript-eslint/no-require-imports */
const pkg = require('../../package.json') as { version: string };

/** Installed app version (from package.json). Bump package.json each release. */
export const APP_VERSION = pkg.version;
