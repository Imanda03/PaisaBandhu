import { StyleSheet, Platform } from 'react-native';
import { ThemeColors } from '../../../../utils/colors';
import { scale, verticalScale, fontSize, spacing } from '../../../../utils/responsive';

export const createStyles = (theme: ThemeColors) => {
  const isDark = theme.HEADER_BACKGROUND === '#0F1012';
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.HEADER_BACKGROUND,
    },
    headerContainer: {
      paddingTop: Platform.OS === 'ios' ? '15%' : '10%',
      paddingHorizontal: spacing(20),
      paddingBottom: verticalScale(20),
      backgroundColor: theme.HEADER_BACKGROUND,
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerText: {
      color: theme.SECONDARY,
      fontSize: 26,
      fontWeight: '800',
      letterSpacing: 0.5,
    },
    content: {
      flex: 1,
      backgroundColor: theme.BACKGROUND,
      borderTopLeftRadius: scale(32),
      borderTopRightRadius: scale(32),
      paddingTop: verticalScale(24),
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
        },
        android: {
          elevation: 15,
        },
      }),
    },
    scrollContent: {
      padding: spacing(20),
      paddingBottom: verticalScale(40),
    },
    summarySection: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: fontSize(22),
      fontWeight: '800',
      marginBottom: spacing(18),
      letterSpacing: 0.3,
    },
    statGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    statCard: {
      flex: 1,
      minWidth: '47%',
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing(18),
      borderRadius: scale(20),
      gap: spacing(14),
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
      ...Platform.select({
        ios: {
          shadowColor: isDark ? '#000' : theme.PURPLE,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isDark ? 0.25 : 0.08,
          shadowRadius: 16,
        },
        android: { elevation: 6 },
      }),
    },
    statIconContainer: {
      width: scale(52),
      height: scale(52),
      borderRadius: scale(14),
      justifyContent: 'center',
      alignItems: 'center',
    },
    statContent: {
      flex: 1,
    },
    statLabel: {
      fontSize: 12,
      fontWeight: '600',
      marginBottom: 4,
      opacity: 0.7,
    },
    statValue: {
      fontSize: fontSize(20),
      fontWeight: '800',
      letterSpacing: 0.3,
    },
    monthlyCard: {
      padding: spacing(24),
      borderRadius: scale(24),
      borderWidth: 1,
      borderColor: isDark ? 'rgba(198, 165, 107, 0.15)' : 'rgba(198, 165, 107, 0.2)',
      ...Platform.select({
        ios: {
          shadowColor: isDark ? '#000' : theme.PURPLE,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 20,
        },
        android: { elevation: 8 },
      }),
    },
    monthlyRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    monthlyItem: {
      flex: 1,
      alignItems: 'center',
      gap: 8,
    },
    monthlyLabel: {
      fontSize: 13,
      fontWeight: '600',
      opacity: 0.7,
    },
    monthlyValue: {
      fontSize: fontSize(22),
      fontWeight: '800',
      letterSpacing: 0.3,
    },
    monthlyDivider: {
      height: 1,
      marginVertical: 16,
    },
    percentageCard: {
      padding: spacing(24),
      borderRadius: scale(24),
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
      ...Platform.select({
        ios: {
          shadowColor: isDark ? '#000' : theme.PURPLE,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isDark ? 0.25 : 0.08,
          shadowRadius: 16,
        },
        android: { elevation: 6 },
      }),
    },
    percentageRow: {
      gap: 16,
    },
    percentageItem: {
      gap: 8,
    },
    percentageBar: {
      height: 8,
      borderRadius: 4,
      marginBottom: 4,
    },
    percentageLabel: {
      fontSize: 14,
      fontWeight: '600',
    },
    recentCard: {
      padding: spacing(24),
      borderRadius: scale(24),
      alignItems: 'center',
      gap: spacing(12),
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
      ...Platform.select({
        ios: {
          shadowColor: isDark ? '#000' : theme.PURPLE,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isDark ? 0.25 : 0.08,
          shadowRadius: 16,
        },
        android: { elevation: 6 },
      }),
    },
    recentText: {
      fontSize: 16,
      fontWeight: '700',
    },
    recentSubText: {
      fontSize: 13,
      opacity: 0.7,
      textAlign: 'center',
    },
  });
};

