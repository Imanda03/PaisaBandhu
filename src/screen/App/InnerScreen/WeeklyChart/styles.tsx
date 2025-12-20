import { StyleSheet } from 'react-native';
import { useTheme } from '../../../../utils/colors';

export const createStyles = () => {
  const { theme } = useTheme();
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.PURPLE,
      paddingTop: '10%',
      paddingHorizontal: '5%',
    },
    container: {
      flex: 2,
      backgroundColor: theme.BACKGROUND,
      marginTop: '5%',
      marginHorizontal: '-6%',
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      paddingTop: 20,
      paddingHorizontal: '5%',
    },
    chartWrapper: {
      marginVertical: 12,
      backgroundColor: 'transparent',
      borderRadius: 16,
      overflow: 'hidden',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 50,
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: theme.SECONDARY,
      opacity: 0.7,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 80,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.SECONDARY,
      marginBottom: 8,
    },
    emptySubtext: {
      fontSize: 14,
      color: theme.SECONDARY,
      opacity: 0.6,
    },
    friendExpensesContainer: {
      backgroundColor: theme.BACKGROUND,
      borderRadius: 20,
      // padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 4,
    },

    friendExpensesTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.TEXT,
      marginBottom: 4,
    },
    friendExpensesSubtitle: {
      fontSize: 14,
      color: theme.TEXT,
      opacity: 0.6,
      marginBottom: 20,
    },
    friendCard: {
      backgroundColor: theme.SHADOW,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      // // shadowColor: '#000',
      // shadowOffset: {
      //   width: 0,
      //   height: 2,
      // },
      // shadowOpacity: 0.1,
      // shadowRadius: 4,
      // elevation: 2,
    },
    friendHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    friendAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#667eea',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    friendAvatarText: {
      fontSize: 20,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    friendInfo: {
      flex: 1,
    },
    friendName: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.TEXT,
      marginBottom: 4,
    },
    friendTotal: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.PURPLE,
    },
    expenseItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(0,0,0,0.03)',
    },
    expenseLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      marginRight: 12,
    },
    expenseTypeBadge: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    incomeBadge: {
      backgroundColor: 'rgba(52, 211, 153, 0.15)',
    },
    expenseBadge: {
      backgroundColor: 'rgba(239, 68, 68, 0.15)',
    },
    expenseTypeText: {
      fontSize: 16,
      fontWeight: '700',
    },
    expenseDetails: {
      flex: 1,
    },
    expenseTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.SECONDARY,
      marginBottom: 2,
    },
    expenseCategory: {
      fontSize: 12,
      color: theme.SECONDARY,
      opacity: 0.6,
    },
    expenseRight: {
      alignItems: 'flex-end',
    },
    expenseAmount: {
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 2,
    },
    incomeAmount: {
      color: '#10b981',
    },
    expenseAmountStyle: {
      color: '#ef4444',
    },
    expenseDate: {
      fontSize: 11,
      color: theme.SECONDARY,
      opacity: 0.5,
    },
  });
};
