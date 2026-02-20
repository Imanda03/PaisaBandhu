import { StyleSheet, Platform } from 'react-native';
import { ThemeColors } from '../../utils/colors';
import { scale, fontSize, spacing } from '../../utils/responsive';

export const createStyles = (theme: ThemeColors) => {
  const isDark = theme.HEADER_BACKGROUND === '#0F1012';
  return StyleSheet.create({
    cardContainer: {
      flexDirection: 'row',
      backgroundColor: theme.BACKGROUND_LIGHT,
      borderRadius: scale(24),
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(198, 165, 107, 0.1)' : 'rgba(198, 165, 107, 0.15)',
      ...Platform.select({
        ios: {
          shadowColor: isDark ? '#000' : theme.PURPLE,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: isDark ? 0.35 : 0.12,
          shadowRadius: 24,
        },
        android: { elevation: 10 },
      }),
    },
    accentStrip: {
      width: 4,
      borderTopLeftRadius: 4,
      borderBottomLeftRadius: 4,
    },
    contentWrapper: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: spacing(20),
      paddingLeft: spacing(24),
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: spacing(18),
    },
    iconContainer: {
      width: scale(60),
      height: scale(60),
      borderRadius: scale(18),
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
      ...Platform.select({
        ios: {
          shadowColor: isDark ? '#000' : theme.SECONDARY,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isDark ? 0.12 : 0.06,
          shadowRadius: 12,
        },
        android: { elevation: 4 },
      }),
    },
    textContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    title: {
      fontSize: fontSize(19),
      fontWeight: '800',
      marginBottom: spacing(4),
      letterSpacing: 0.25,
      color: theme.TEXT,
    },
    subtitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing(6),
    },
    subtitle: {
      fontSize: fontSize(13),
      fontWeight: '600',
      color: theme.LIGHT_TEXT,
      opacity: 0.85,
    },
    sharedBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      marginTop: spacing(6),
      marginBottom: spacing(4),
      paddingHorizontal: spacing(10),
      paddingVertical: spacing(4),
      borderRadius: scale(10),
      backgroundColor: theme.SECONDARY + '18',
      borderWidth: 1,
      borderColor: theme.SECONDARY + '35',
    },
    sharedBadgeText: {
      fontSize: fontSize(11),
      fontWeight: '700',
      color: theme.SECONDARY,
      letterSpacing: 0.3,
    },
    sharedCard: {
      borderColor: isDark ? 'rgba(198, 165, 107, 0.2)' : 'rgba(198, 165, 107, 0.25)',
    },
    rightSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing(10),
    },
    typeBadge: {
      paddingHorizontal: spacing(12),
      paddingVertical: spacing(6),
      borderRadius: scale(12),
      minWidth: scale(72),
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
    },
    typeText: {
      fontSize: fontSize(10),
      fontWeight: '800',
      letterSpacing: 1,
    },
    editButton: {
      width: scale(44),
      height: scale(44),
      borderRadius: scale(22),
      backgroundColor: isDark ? 'rgba(198, 165, 107, 0.1)' : 'rgba(198, 165, 107, 0.08)',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.SECONDARY + '30',
      ...Platform.select({
        ios: {
          shadowColor: theme.SECONDARY,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        android: { elevation: 2 },
      }),
    },
    chevronContainer: {
      paddingLeft: spacing(4),
    },
  });
};
