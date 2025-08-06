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
      height: '100%',
      width: '85%',
      padding: 20,
      color: theme.TEXT,
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
      fontSize: 13,
      // marginTop: 4,
      marginLeft: 4,
      fontWeight: '500',
    },
  });
};
