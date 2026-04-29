import { StyleSheet, Platform } from 'react-native';
import { ThemeColors } from '../../../../utils/colors';
import { scale, verticalScale, fontSize, spacing } from '../../../../utils/responsive';

export const createStyles = (theme: ThemeColors) => {
  const isDark = theme.HEADER_BACKGROUND === '#0F1012';

  const headerBg = theme.HEADER_BACKGROUND ?? theme.PURPLE;

  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: headerBg,
    },
    headerContainer: {
      paddingHorizontal: spacing(20),
      paddingBottom: verticalScale(20),
      backgroundColor: headerBg,
      
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing(12),
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerText: {
      color: theme.SECONDARY,
      fontSize: fontSize(18),
      fontWeight: '800',
      letterSpacing: 0.35,
      flex: 1,
    },
    content: {
      flex: 1,
      backgroundColor: theme.BACKGROUND,
      borderTopLeftRadius: scale(32),
      borderTopRightRadius: scale(32),
      overflow: 'hidden',
      paddingTop: verticalScale(24),
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
        },
        android: { elevation: 15 },
      }),
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingTop: verticalScale(20),
      paddingHorizontal: spacing(20),
      paddingBottom: verticalScale(120),
    },
    chartWrapper: {
      marginBottom: verticalScale(20),
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: verticalScale(60),
    },
    loadingText: {
      marginTop: spacing(16),
      fontSize: fontSize(16),
      color: theme.SECONDARY,
      opacity: 0.8,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: verticalScale(80),
    },
    emptyText: {
      fontSize: fontSize(18),
      fontWeight: '700',
      color: theme.TEXT,
      marginBottom: spacing(8),
      textAlign: 'center',
    },
    emptySubtext: {
      fontSize: fontSize(14),
      color: theme.LIGHT_TEXT,
      opacity: 0.7,
      textAlign: 'center',
    },
    emptyChartContainer: {
      marginBottom: verticalScale(20),
      borderRadius: scale(24),
      padding: spacing(32),
      backgroundColor: theme.BACKGROUND_LIGHT,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: verticalScale(200),
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isDark ? 0.25 : 0.06,
          shadowRadius: 20,
        },
        android: { elevation: 6 },
      }),
    },
    emptyChartText: {
      fontSize: fontSize(18),
      fontWeight: '700',
      color: theme.TEXT,
      marginTop: spacing(16),
      marginBottom: spacing(8),
      textAlign: 'center',
    },
    emptyChartSubtext: {
      fontSize: fontSize(14),
      color: theme.LIGHT_TEXT,
      opacity: 0.7,
      textAlign: 'center',
      lineHeight: fontSize(20),
    },
    friendExpensesContainer: {
      backgroundColor: theme.BACKGROUND_LIGHT,
      borderRadius: scale(24),
      padding: spacing(22),
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isDark ? 0.25 : 0.06,
          shadowRadius: 20,
        },
        android: { elevation: 6 },
      }),
    },
    friendExpensesTitle: {
      fontSize: fontSize(22),
      fontWeight: '800',
      color: theme.TEXT,
      marginBottom: 4,
      letterSpacing: 0.3,
    },
    friendExpensesSubtitle: {
      fontSize: fontSize(14),
      color: theme.LIGHT_TEXT,
      opacity: 0.8,
      marginBottom: spacing(20),
    },
    friendCard: {
      backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
      borderRadius: scale(16),
      padding: spacing(18),
      marginBottom: spacing(16),
      borderWidth: 1,
      borderColor: theme.BORDER_COLOR + '30',
    },
    friendHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing(16),
      paddingBottom: spacing(16),
      borderBottomWidth: 1,
      borderBottomColor: theme.BORDER_COLOR + '30',
    },
    friendAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.SECONDARY,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing(12),
    },
    friendAvatarText: {
      fontSize: fontSize(20),
      fontWeight: '700',
      color: theme.PURPLE,
    },
    friendInfo: {
      flex: 1,
    },
    friendName: {
      fontSize: fontSize(18),
      fontWeight: '700',
      color: theme.TEXT,
      marginBottom: 4,
    },
    friendTotal: {
      fontSize: fontSize(16),
      fontWeight: '700',
      color: theme.SECONDARY,
    },
    expenseItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing(12),
      borderBottomWidth: 1,
      borderBottomColor: theme.BORDER_COLOR + '20',
    },
    expenseLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      marginRight: spacing(12),
    },
    expenseTypeBadge: {
      width: 36,
      height: 36,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing(12),
    },
    incomeBadge: {
      backgroundColor: 'rgba(91, 165, 107, 0.15)',
    },
    expenseBadge: {
      backgroundColor: 'rgba(212, 93, 93, 0.15)',
    },
    expenseTypeText: {
      fontSize: fontSize(16),
      fontWeight: '700',
    },
    expenseDetails: {
      flex: 1,
    },
    expenseTitle: {
      fontSize: fontSize(15),
      fontWeight: '600',
      color: theme.TEXT,
      marginBottom: 2,
    },
    expenseCategory: {
      fontSize: fontSize(12),
      color: theme.LIGHT_TEXT,
      opacity: 0.8,
    },
    expenseRight: {
      alignItems: 'flex-end',
    },
    expenseAmount: {
      fontSize: fontSize(16),
      fontWeight: '700',
      marginBottom: 2,
    },
    incomeAmount: {
      color: theme.SUCCESS,
    },
    expenseAmountStyle: {
      color: theme.ERROR,
    },
    expenseDate: {
      fontSize: fontSize(11),
      color: theme.LIGHT_TEXT,
      opacity: 0.7,
    },
  });
};
