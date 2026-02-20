import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../utils/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function OfflineBanner() {
  const { theme } = useTheme();
  const isDark = theme.HEADER_BACKGROUND === '#0F1012';

  const styles = useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: isDark ? 'rgba(0,0,0,0.92)' : 'rgba(15,17,20,0.94)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 32,
          zIndex: 9999,
        },
        card: {
          backgroundColor: theme.BACKGROUND_LIGHT,
          borderRadius: 28,
          padding: 36,
          maxWidth: 340,
          width: '100%',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: isDark ? 'rgba(198, 165, 107, 0.2)' : 'rgba(198, 165, 107, 0.15)',
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 16 },
              shadowOpacity: 0.35,
              shadowRadius: 32,
            },
            android: { elevation: 16 },
          }),
        },
        iconWrap: {
          width: 88,
          height: 88,
          borderRadius: 44,
          backgroundColor: theme.ERROR + '18',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 24,
        },
        title: {
          fontSize: 24,
          fontWeight: '800',
          color: theme.TEXT,
          marginBottom: 12,
          textAlign: 'center',
        },
        message: {
          fontSize: 16,
          color: theme.LIGHT_TEXT,
          textAlign: 'center',
          lineHeight: 24,
          opacity: 0.95,
        },
      }),
    [theme, isDark]
  );

  return (
    <View style={styles.overlay} pointerEvents="auto">
      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <MaterialIcons name="wifi-off" size={48} color={theme.ERROR} />
        </View>
        <Text style={styles.title}>You're offline</Text>
        <Text style={styles.message}>
          Check your connection and try again. Your data is saved locally and will sync when you're back online.
        </Text>
      </View>
    </View>
  );
}
