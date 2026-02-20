import { StyleSheet, Platform } from 'react-native';
import { ThemeColors } from '../../../../../utils/colors';
import { scale, fontSize, spacing } from '../../../../../utils/responsive';

export const createStyles = (theme: ThemeColors) => {
  const isDark = theme.HEADER_BACKGROUND === '#0F1012';
  return StyleSheet.create({
    container: {
      backgroundColor: theme.BACKGROUND_LIGHT,
      borderRadius: scale(24),
      padding: spacing(20),
      marginBottom: spacing(16),
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
      ...Platform.select({
        ios: {
          shadowColor: isDark ? '#000' : theme.PURPLE,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: isDark ? 0.3 : 0.08,
          shadowRadius: 20,
        },
        android: { elevation: 8 },
      }),
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing(20),
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      flex: 1,
    },
    title: {
      fontSize: fontSize(18),
      fontWeight: '700',
      letterSpacing: 0.3,
    },
    periodButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing(14),
      paddingVertical: spacing(8),
      borderRadius: scale(16),
      gap: 6,
      borderWidth: 1.5,
      borderColor: theme.BORDER_COLOR + '40',
      ...Platform.select({
        ios: {
          shadowColor: theme.SHADOW,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    periodButtonText: {
      fontSize: fontSize(14),
      fontWeight: '600',
      letterSpacing: 0.2,
    },
    chartContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    centerLabelContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    percentageText: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    statusText: {
      fontSize: 16,
      opacity: 0.7,
    },
    noDataText: {
      fontSize: 12,
      opacity: 0.5,
    },
    detailsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginTop: spacing(16),
      paddingTop: spacing(16),
      borderTopWidth: 1,
      borderTopColor: theme.BORDER_COLOR + '30',
    },
    detailItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    colorDot: {
      width: scale(10),
      height: scale(10),
      borderRadius: scale(5),
      marginRight: spacing(8),
    },
    detailText: {
      fontSize: fontSize(14),
      fontWeight: '600',
      letterSpacing: 0.2,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingTop: 20,
      paddingBottom: Platform.OS === 'ios' ? 40 : 20,
      maxHeight: '60%',
      ...Platform.select({
        ios: {
          shadowColor: theme.SHADOW,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.25,
          shadowRadius: 20,
        },
        android: {
          elevation: 20,
        },
      }),
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.BORDER_COLOR + '30',
      marginBottom: 12,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '700',
      letterSpacing: 0.3,
    },
    modalOptions: {
      paddingHorizontal: 20,
    },
    periodOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderRadius: 16,
      marginBottom: 12,
      borderWidth: 1.5,
    },
    periodOptionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
    },
    periodIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    periodOptionText: {
      fontSize: 16,
      letterSpacing: 0.2,
    },
  });
};
