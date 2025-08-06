import { StyleSheet } from 'react-native';
import { useTheme } from '../../../utils/colors';

export const createStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 60,
      borderRadius: 10,
      backgroundColor: theme.INPUT_BACKGROUND,
      marginVertical: 10,
      borderWidth: 0.5,
      borderColor: theme.BORDER_COLOR,
      paddingHorizontal: 5,
      justifyContent: 'space-between',
    },
    input: {
      // flex: 1,
      height: '100%',
      width: '100%',
      padding: 10,
      color: theme.TEXT,
      fontWeight: '500',
    },
    eyeIcon: {
      padding: 15,
    },
    inputError: {
      borderColor: theme.ERROR,
      borderWidth: 1,
    },
    errorText: {
      color: theme.ERROR,
      fontSize: 12,
      marginTop: 4,
      marginLeft: 4,
    },
    label: {
      color: theme.TEXT,
      fontSize: 14,
      marginBottom: 6,
      fontWeight: '600',
    },
  });
};
