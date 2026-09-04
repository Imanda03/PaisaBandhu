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
      alignItems: 'flex-start',
      marginBottom: spacing(18),
    },
    titleBlock: {
      flex: 1,
      marginRight: spacing(10),
      minWidth: 0,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing(12),
    },
    titleIconWrap: {
      width: scale(44),
      height: scale(44),
      borderRadius: scale(14),
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleTextCol: {
      flex: 1,
      minWidth: 0,
    },
    titleMain: {
      fontSize: fontSize(18),
      fontWeight: '800',
      letterSpacing: -0.35,
    },
    titleSub: {
      fontSize: fontSize(11),
      fontWeight: '600',
      letterSpacing: 0.2,
      marginTop: 3,
      opacity: 0.88,
    },
    periodButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing(12),
      paddingVertical: spacing(9),
      borderRadius: scale(14),
      gap: 5,
      borderWidth: 1,
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
      alignItems: 'stretch',
      justifyContent: 'flex-start',
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
    stateBox: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing(32),
      gap: spacing(12),
    },
    stateText: {
      fontSize: fontSize(14),
      textAlign: 'center',
    },
    retryBtn: {
      paddingHorizontal: spacing(16),
      paddingVertical: spacing(8),
      borderRadius: scale(12),
      borderWidth: 1,
    },
    retryText: {
      fontSize: fontSize(14),
      fontWeight: '600',
    },
  });
};
