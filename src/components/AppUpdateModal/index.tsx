import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AppState,
  Modal,
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Platform,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../utils/colors';
import {
  scale,
  verticalScale,
  fontSize,
  spacing,
} from '../../utils/responsive';
import { MaterialIcons } from '../../utils/Icons';
import { APP_VERSION } from '../../constants/appVersion';
import { useAppConfig } from '../../ReactQueryHook/app-config.hook';

const DEFAULT_MESSAGE =
  'A new version is available. Update from the Play Store for the best experience.';

const AppUpdateModal = () => {
  const { theme } = useTheme();
  const { data, refetch, isError, error } = useAppConfig();
  console.log('data', data);
  const [softDismissed, setSoftDismissed] = useState(false);
  const [checkAgainLoading, setCheckAgainLoading] = useState(false);
  const configSnapRef = useRef<{
    updateRequired?: boolean;
    storeVersion?: string;
  }>({});

  useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') {
        refetch();
      }
    });
    return () => sub.remove();
  }, [refetch]);

  useEffect(() => {
    if (__DEV__ && isError) {
      // eslint-disable-next-line no-console
      console.warn(
        '[AppUpdateModal] /app/config failed — modal cannot show:',
        error,
      );
    }
  }, [isError, error]);

  useEffect(() => {
    const ur = !!data?.updateRequired;
    const sv = data?.storeAppVersion?.trim() ?? '';
    const forced = !!data?.forceUpdate;
    const prev = configSnapRef.current;
    if (forced) {
      setSoftDismissed(false);
    } else if (
      ur &&
      (prev.updateRequired !== true || sv !== (prev.storeVersion ?? ''))
    ) {
      // Re-open after a new nudge (e.g. UR was off then on) or store target changed — not only when version string changes.
      setSoftDismissed(false);
    }

    configSnapRef.current = { updateRequired: ur, storeVersion: sv };
  }, [data?.updateRequired, data?.storeAppVersion, data?.forceUpdate]);

  const visible = useMemo(() => {
    if (!data?.updateRequired) {
      return false;
    }
    if (data.forceUpdate) {
      return true;
    }
    return !softDismissed;
  }, [data?.updateRequired, data?.forceUpdate, softDismissed]);

  const message = data?.message?.trim() ? data.message.trim() : DEFAULT_MESSAGE;
  const storeUrl = data?.androidStoreUrl || '';
  const storeVer = data?.storeAppVersion?.trim();
  const versionHint =
    storeVer && storeVer.length > 0
      ? `You are on v${APP_VERSION}. Latest is v${storeVer}.`
      : null;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        backdrop: {
          flex: 1,
          backgroundColor: 'rgba(10, 10, 12, 0.72)',
          justifyContent: 'center',
          paddingHorizontal: spacing(20),
        },
        card: {
          backgroundColor: theme.BACKGROUND,
          borderRadius: scale(20),
          padding: spacing(20),
          borderWidth: 1,
          borderColor: theme.BORDER_COLOR,
          ...(Platform.OS === 'ios'
            ? {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.25,
                shadowRadius: 24,
              }
            : { elevation: 12 }),
        },
        iconWrap: {
          alignSelf: 'center',
          width: scale(56),
          height: scale(56),
          borderRadius: scale(28),
          backgroundColor: theme.BACKGROUND_LIGHT,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: verticalScale(16),
        },
        title: {
          fontSize: fontSize(20),
          fontWeight: '700',
          color: theme.TEXT,
          textAlign: 'center',
          marginBottom: verticalScale(8),
        },
        body: {
          fontSize: fontSize(15),
          lineHeight: Math.max(fontSize(15) * 1.35, fontSize(20)),
          color: theme.TEXT,
          opacity: 0.88,
          textAlign: 'center',
          marginBottom: verticalScale(22),
        },
        primaryBtn: {
          backgroundColor: theme.SECONDARY,
          paddingVertical: verticalScale(14),
          borderRadius: scale(14),
          alignItems: 'center',
          marginBottom: verticalScale(10),
        },
        primaryLabel: {
          color: theme.NAVBAR_ACTIVE_TEXT,
          fontSize: fontSize(16),
          fontWeight: '600',
        },
        secondaryBtn: {
          paddingVertical: verticalScale(12),
          alignItems: 'center',
        },
        secondaryLabel: {
          color: theme.LIGHT_TEXT,
          fontSize: fontSize(15),
          fontWeight: '500',
        },
        secondaryRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: scale(10),
        },
      }),
    [theme],
  );

  const openStore = useCallback(() => {
    if (storeUrl) {
      Linking.openURL(storeUrl).catch(() => {});
    }
  }, [storeUrl]);

  const handleCheckAgain = useCallback(async () => {
    setCheckAgainLoading(true);
    try {
      await refetch();
    } finally {
      setCheckAgainLoading(false);
    }
  }, [refetch]);

  const force = Boolean(data?.forceUpdate);

  // Keep Modal mounted (visible=false) so refetches / cache never "lose" the gate; avoids Android mount quirks.
  return (
    <Modal
      visible={visible && !!data}
      animationType="fade"
      transparent
      onRequestClose={() => {
        if (!force) {
          setSoftDismissed(true);
        }
      }}
    >
      <Pressable
        style={styles.backdrop}
        onPress={() => {
          if (!force) {
            setSoftDismissed(true);
          }
        }}
      >
        <Pressable style={styles.card} onPress={e => e.stopPropagation()}>
          <View style={styles.iconWrap}>
            <MaterialIcons
              name="system-update"
              size={scale(30)}
              color={theme.PRIMARY}
            />
          </View>
          <Text style={styles.title}>Update available</Text>
          <Text style={styles.body}>{message}</Text>
          {versionHint ? (
            <Text
              style={[
                styles.body,
                {
                  marginTop: -verticalScale(12),
                  fontSize: fontSize(13),
                  opacity: 0.8,
                  marginBottom: verticalScale(16),
                },
              ]}
            >
              {versionHint}
            </Text>
          ) : null}
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={openStore}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryLabel}>Update on Play Store</Text>
          </TouchableOpacity>
          {!force && (
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => setSoftDismissed(true)}
              activeOpacity={0.75}
            >
              <Text style={styles.secondaryLabel}>Later</Text>
            </TouchableOpacity>
          )}
          {force && (
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => void handleCheckAgain()}
              activeOpacity={0.75}
              disabled={checkAgainLoading}
            >
              <View style={styles.secondaryRow}>
                {checkAgainLoading ? (
                  <ActivityIndicator size="small" color={theme.SECONDARY} />
                ) : null}
                <Text
                  style={[
                    styles.secondaryLabel,
                    checkAgainLoading && { opacity: 0.85 },
                  ]}
                >
                  {checkAgainLoading ? 'Checking…' : 'Check again'}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default AppUpdateModal;
