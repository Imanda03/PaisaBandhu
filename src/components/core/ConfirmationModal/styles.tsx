import { StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../../utils/colors';
import { scale } from '../../../utils/responsive';

export const createStyles = () => {
  const { theme } = useTheme();
  return StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.52)',
      padding: scale(24),
    },
    modalContainer: {
      width: '100%',
      maxWidth: 400,
      backgroundColor: theme.BACKGROUND_LIGHT || theme.BACKGROUND,
      borderRadius: scale(24),
      paddingHorizontal: scale(24),
      paddingTop: scale(28),
      paddingBottom: scale(24),
      borderLeftWidth: 4,
      borderLeftColor: theme.ERROR,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.18,
          shadowRadius: 24,
        },
        android: { elevation: 16 },
      }),
    },
    iconWrapper: {
      width: scale(56),
      height: scale(56),
      borderRadius: scale(28),
      backgroundColor: theme.ERROR + '18',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: scale(20),
    },
    title: {
      fontSize: scale(20),
      fontWeight: '800',
      marginBottom: scale(12),
      color: theme.TEXT,
      textAlign: 'center',
      letterSpacing: 0.2,
    },
    description: {
      fontSize: scale(15),
      lineHeight: scale(22),
      marginBottom: scale(24),
      color: theme.LIGHT_TEXT || theme.TEXT,
      textAlign: 'center',
      paddingHorizontal: scale(4),
    },
    confirmInputContainer: {
      marginBottom: scale(24),
      paddingHorizontal: scale(4),
    },
    confirmInputLabel: {
      fontSize: scale(14),
      marginBottom: scale(10),
      color: theme.TEXT,
      fontWeight: '600',
    },
    confirmTextHighlight: {
      fontWeight: '800',
      color: theme.ERROR,
    },
    confirmInput: {
      borderWidth: 2,
      borderColor: theme.BORDER_COLOR,
      borderRadius: scale(14),
      paddingHorizontal: scale(16),
      paddingVertical: scale(14),
      fontSize: scale(16),
      color: theme.TEXT,
      backgroundColor: theme.INPUT_BACKGROUND,
      fontWeight: '600',
      letterSpacing: 1,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'stretch',
      alignItems: 'center',
      gap: scale(12),
    },
    cancelButton: {
      flex: 1,
      paddingVertical: scale(14),
      paddingHorizontal: scale(20),
      borderRadius: scale(14),
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: theme.BORDER_COLOR,
      backgroundColor: 'transparent',
    },
    cancelText: {
      color: theme.TEXT,
      fontSize: scale(16),
      fontWeight: '700',
      letterSpacing: 0.3,
    },
    confirmButton: {
      flex: 1,
      paddingVertical: scale(14),
      paddingHorizontal: scale(20),
      borderRadius: scale(14),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.ERROR,
      ...Platform.select({
        ios: {
          shadowColor: theme.ERROR,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 8,
        },
        android: { elevation: 6 },
      }),
    },
    confirmButtonDisabled: {
      opacity: 0.45,
      ...Platform.select({
        ios: { shadowOpacity: 0 },
        android: { elevation: 0 },
      }),
    },
    confirmText: {
      color: '#FFFFFF',
      fontSize: scale(16),
      fontWeight: '800',
      letterSpacing: 0.4,
    },
  });
};
