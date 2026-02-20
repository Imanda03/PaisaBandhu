import React, { useMemo, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  PermissionsAndroid,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../utils/colors';
import { scale, verticalScale, fontSize, spacing } from '../../../utils/responsive';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

type PermissionItem = {
  id: 'notifications' | 'storage';
  title: string;
  description: string;
  icon: string;
  android: string | null;
};

const getAndroidVersion = (): number => {
  if (Platform.OS !== 'android') return 0;
  const version = Platform.Version;
  return typeof version === 'number' ? version : parseInt(String(version), 10) || 0;
};

// Helper to get permissions list based on Android version
const getPermissionsList = (androidVersion: number): PermissionItem[] => [
  {
    id: 'notifications',
    title: 'Notifications',
    description: Platform.OS === 'android' && androidVersion >= 33
      ? 'Send you reminders and updates about your expenses and challenges. (Android 13+)'
      : 'Send you reminders and updates about your expenses and challenges.',
    icon: 'notifications-active',
    android: androidVersion >= 33 ? PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS : null,
  },
  {
    id: 'storage',
    title: 'Storage',
    description: Platform.OS === 'android' && androidVersion < 33
      ? 'Save reports and export PDF files to your device. (Android 12 and below)'
      : 'Save reports and export data. (Android 13+ uses scoped storage)',
    icon: 'folder',
    android: androidVersion < 33 ? PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE : null,
  },
];

export default function PermissionsScreen({ onComplete }: { onComplete: () => void }) {
  const { theme } = useTheme();
  const [granted, setGranted] = useState<Record<string, boolean>>({});
  const isDark = theme.HEADER_BACKGROUND === '#0F1012';
  const insets = useSafeAreaInsets();
  const androidVersion = getAndroidVersion();
  const PERMISSIONS_LIST = useMemo(() => getPermissionsList(androidVersion), [androidVersion]);

  // Function to check current permission status
  const checkPermissions = useCallback(async () => {
    if (Platform.OS !== 'android') return;

    const currentStatus: Record<string, boolean> = {};

    // Check notifications permission (Android 13+)
    if (androidVersion >= 33) {
      try {
        const status = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        currentStatus.notifications = status === true;
        console.log('Notification permission status:', status);
      } catch (error) {
        console.error('Error checking notification permission:', error);
        currentStatus.notifications = false;
      }
    } else {
      // Android 12 and below - notifications don't need runtime permission
      currentStatus.notifications = true;
    }

    // Check storage permissions (Android 12 and below)
    if (androidVersion < 33) {
      try {
        const readStatus = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        const writeStatus = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        currentStatus.storage = readStatus && writeStatus;
      } catch {
        currentStatus.storage = false;
      }
    } else {
      // Android 13+ uses scoped storage - no permission needed
      currentStatus.storage = true;
    }

    setGranted(currentStatus);
  }, [androidVersion]);

  // Check current permission status on mount
  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.BACKGROUND,
          paddingHorizontal: spacing(24),
          paddingTop: verticalScale(24),
        },
        title: {
          fontSize: fontSize(26),
          fontWeight: '800',
          color: theme.TEXT,
          marginBottom: spacing(12),
          textAlign: 'center',
        },
        subtitle: {
          fontSize: fontSize(16),
          color: theme.LIGHT_TEXT,
          textAlign: 'center',
          marginBottom: verticalScale(36),
          lineHeight: 24,
        },
        card: {
          backgroundColor: theme.BACKGROUND_LIGHT,
          borderRadius: scale(20),
          padding: spacing(22),
          marginBottom: spacing(18),
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: isDark ? 'rgba(198, 165, 107, 0.12)' : 'rgba(198, 165, 107, 0.08)',
        },
        iconWrap: {
          width: scale(52),
          height: scale(52),
          borderRadius: scale(26),
          backgroundColor: theme.SECONDARY + '18',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: spacing(18),
        },
        cardContent: {
          flex: 1,
        },
        cardTitle: {
          fontSize: fontSize(17),
          fontWeight: '700',
          color: theme.TEXT,
          marginBottom: 4,
        },
        cardDesc: {
          fontSize: fontSize(14),
          color: theme.LIGHT_TEXT,
          lineHeight: 20,
        },
        allowBtn: {
          paddingHorizontal: spacing(16),
          paddingVertical: spacing(10),
          borderRadius: scale(12),
          backgroundColor: theme.SECONDARY + '25',
        },
        allowBtnText: {
          fontSize: fontSize(14),
          fontWeight: '700',
          color: theme.SECONDARY,
        },
        doneBtn: {
          marginTop: verticalScale(24),
          borderRadius: scale(16),
          overflow: 'hidden',
          minHeight: scale(54),
          justifyContent: 'center',
          alignItems: 'center',
        },
        doneBtnText: {
          fontSize: fontSize(17),
          fontWeight: '700',
          color: theme.PRIMARY,
        },
      }),
    [theme, isDark]
  );

  const requestPermission = useCallback(
    async (perm: PermissionItem) => {
      if (Platform.OS !== 'android') {
        // iOS handles permissions differently - show info message
        return;
      }

      try {
        let result: string;
        
        // Handle notifications permission
        if (perm.id === 'notifications') {
          // Check Android version for POST_NOTIFICATIONS (Android 13+)
          if (androidVersion >= 33) {
            try {
              // First check if already granted
              const currentStatus = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
              );
              
              if (currentStatus) {
                setGranted((g) => ({ ...g, [perm.id]: true }));
                return;
              }
              
              // Request permission
              result = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
                {
                  title: 'Notification Permission',
                  message: 'Kharcha Split needs notification permission to send you reminders and updates about your expenses and challenges.',
                  buttonNeutral: 'Ask Me Later',
                  buttonNegative: 'Cancel',
                  buttonPositive: 'OK',
                }
              );
              
              console.log(`Notification permission request result: ${result}`);
              // Check both string comparison and constant comparison for compatibility
              const isGranted = result === 'granted' || result === PermissionsAndroid.RESULTS.GRANTED;
              console.log(`Notification permission granted: ${isGranted}`);
              setGranted((g) => ({ ...g, [perm.id]: isGranted }));
              
              // Re-check permissions after a short delay to ensure state is updated
              setTimeout(() => {
                checkPermissions();
              }, 500);
            } catch (error) {
              console.error('Error requesting notification permission:', error);
              setGranted((g) => ({ ...g, [perm.id]: false }));
            }
          } else {
            // Android 12 and below - notifications don't require runtime permission
            setGranted((g) => ({ ...g, [perm.id]: true }));
          }
          return;
        }

        // Handle storage permission
        if (perm.id === 'storage') {
          // Only request for Android 12 and below (API 32)
          if (androidVersion < 33 && perm.android) {
            // Request both read and write permissions for older Android
            const readResult = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
            );
            const writeResult = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
            );
            const isGranted = readResult === 'granted' && writeResult === 'granted';
            setGranted((g) => ({ ...g, [perm.id]: isGranted }));
          } else {
            // Android 13+ uses scoped storage - permission granted automatically
            setGranted((g) => ({ ...g, [perm.id]: true }));
          }
          return;
        }

        // Handle other permissions
        if (perm.android && typeof perm.android === 'string') {
          result = await PermissionsAndroid.request(perm.android as any);
          setGranted((g) => ({ ...g, [perm.id]: result === 'granted' }));
        }
      } catch (error) {
        console.error(`Error requesting ${perm.id} permission:`, error);
        setGranted((g) => ({ ...g, [perm.id]: false }));
      }
    },
    [androidVersion, checkPermissions]
  );

  const handleDone = useCallback(() => {
    onComplete();
  }, [onComplete]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: verticalScale(48) }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.iconWrap, { alignSelf: 'center', marginBottom: spacing(20) }]}>
        <MaterialIcons name="security" size={40} color={theme.SECONDARY} />
      </View>
      <Text style={styles.title}>Permissions we need</Text>
      <Text style={styles.subtitle}>
        To give you the best experience, we need access to the following. You can change these later in device settings.
      </Text>

      {PERMISSIONS_LIST.map((perm) => (
        <View key={perm.id} style={styles.card}>
          <View style={styles.iconWrap}>
            <MaterialIcons name={perm.icon as any} size={28} color={theme.SECONDARY} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{perm.title}</Text>
            <Text style={styles.cardDesc}>{perm.description}</Text>
          </View>
          {Platform.OS === 'android' ? (
            (() => {
              // Check if permission is applicable for this Android version
              const isApplicable = 
                (perm.id === 'notifications' && androidVersion >= 33) ||
                (perm.id === 'storage' && androidVersion < 33) ||
                (perm.android !== null);
              
              if (!isApplicable) {
                // Show info icon for permissions not needed on this Android version
                return (
                  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialIcons name="info" size={24} color={theme.LIGHT_TEXT} />
                    <Text style={{ fontSize: 10, color: theme.LIGHT_TEXT, marginTop: 2 }}>
                      N/A
                    </Text>
                  </View>
                );
              }
              
              const isGranted = granted[perm.id] === true;
              
              if (isGranted) {
                return (
                  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialIcons name="check-circle" size={28} color={theme.SUCCESS} />
                  </View>
                );
              }
              
              return (
                <TouchableOpacity
                  style={styles.allowBtn}
                  onPress={() => {
                    console.log(`Requesting ${perm.id} permission for Android ${androidVersion}`);
                    requestPermission(perm);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.allowBtnText}>Allow</Text>
                </TouchableOpacity>
              );
            })()
          ) : (
            // iOS - show info that permissions are handled by system
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <MaterialIcons name="info" size={24} color={theme.LIGHT_TEXT} />
            </View>
          )}
        </View>
      ))}

      <TouchableOpacity onPress={handleDone} activeOpacity={0.85}>
        <LinearGradient
          colors={[theme.SECONDARY, theme.SECONDARY + 'E6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.doneBtn}
        >
          <Text style={styles.doneBtnText}>Continue</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}
