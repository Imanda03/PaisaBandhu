import { StyleSheet, Platform } from 'react-native';
import { ThemeColors } from '../../../utils/colors';
import {
  scale,
  verticalScale,
  fontSize,
  spacing,
} from '../../../utils/responsive';

export const createStyles = (theme: ThemeColors) => {
  const isDark = theme.HEADER_BACKGROUND === '#0F1012';

  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.BACKGROUND,
    },

    // Header - seamless gradient into body with rounded bottom
    headerWrapper: {
      paddingHorizontal: spacing(24),
      paddingBottom: verticalScale(36),
      borderBottomLeftRadius: scale(28),
      borderBottomRightRadius: scale(28),
      overflow: 'hidden',
      minHeight: verticalScale(160),
    },
    headerSection: {},

    scrollView: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    scrollContent: {
      paddingTop: verticalScale(20),
      paddingHorizontal: spacing(20),
      flexGrow: 1,
    },

    // Balance hero - premium floating card
    balanceCard: {
      borderRadius: scale(24),
      padding: spacing(26),
      marginBottom: verticalScale(24),
      backgroundColor: theme.BACKGROUND_LIGHT,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: isDark
        ? 'rgba(198, 165, 107, 0.15)'
        : 'rgba(198, 165, 107, 0.2)',
      ...Platform.select({
        ios: {
          shadowColor: isDark ? '#000' : theme.PURPLE,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: isDark ? 0.5 : 0.1,
          shadowRadius: 24,
        },
        android: { elevation: 10 },
      }),
    },
    balanceTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: verticalScale(22),
    },
    balanceLabel: {
      fontSize: fontSize(12),
      fontWeight: '600',
      letterSpacing: 1,
      textTransform: 'uppercase',
      opacity: 0.75,
      marginBottom: verticalScale(6),
    },
    balanceAmount: {
      fontSize: fontSize(40),
      fontWeight: '800',
      letterSpacing: -1.5,
    },
    refreshBtn: {
      width: 46,
      height: 46,
      borderRadius: 23,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark
        ? 'rgba(198, 165, 107, 0.12)'
        : 'rgba(198, 165, 107, 0.1)',
      borderWidth: 1,
      borderColor: 'rgba(198, 165, 107, 0.25)',
    },

    incomeExpenseShell: {
      flexDirection: 'row',
      alignItems: 'stretch',
      borderRadius: scale(18),
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
    },
    incomeExpenseItem: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing(14),
      paddingHorizontal: spacing(14),
      gap: spacing(10),
    },
    incomeExpenseDivider: {
      width: StyleSheet.hairlineWidth * 2,
      alignSelf: 'stretch',
      marginVertical: spacing(12),
    },
    incomeExpenseIcon: {
      width: 36,
      height: 36,
      borderRadius: 11,
      justifyContent: 'center',
      alignItems: 'center',
    },
    incomeExpenseContent: {
      flex: 1,
    },
    incomeExpenseLabel: {
      fontSize: fontSize(11),
      fontWeight: '600',
      letterSpacing: 0.3,
      textTransform: 'uppercase',
      opacity: 0.8,
      marginBottom: 4,
    },
    incomeExpenseValue: {
      fontSize: fontSize(16),
      fontWeight: '800',
      letterSpacing: 0.15,
    },

    // Quick actions - compact row
    quickActionsGrid: {
      flexDirection: 'row',
      gap: spacing(10),
      marginBottom: verticalScale(24),
    },
    quickActionItem: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: spacing(14),
      paddingHorizontal: spacing(8),
      borderRadius: scale(14),
      backgroundColor: theme.BACKGROUND_LIGHT,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.2 : 0.05,
          shadowRadius: 10,
        },
        android: { elevation: 4 },
      }),
    },
    quickActionIconWrap: {
      width: 40,
      height: 40,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing(6),
    },
    quickActionLabel: {
      fontSize: fontSize(11),
      fontWeight: '600',
      letterSpacing: 0.2,
      textAlign: 'center',
    },

    chartWrapper: {
      marginBottom: verticalScale(28),
    },

  });
};
