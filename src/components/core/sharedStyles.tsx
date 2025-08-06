import {StyleSheet} from 'react-native';
import {useTheme} from '../../utils/colors';

export const createStyles = () => {
  const {theme} = useTheme();

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
      paddingHorizontal: 20,
      justifyContent: 'space-between',
    },
    input: {
      flex: 1,
      color: theme.TEXT,
      fontSize: 16,
      fontWeight: '600',
    },
    textAreaContainer: {
      height: 120,
      alignItems: 'flex-start',
    },
    textArea: {
      height: '100%',
      paddingTop: 15,
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
    dateText: {
      color: theme.TEXT,
      fontSize: 16,
      fontWeight: '600',
    },
    placeholderText: {
      color: theme.PLACEHOLDER_COLOR,
      fontSize: 16,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: 20,
    },
    optionItem: {
      padding: 15,
      backgroundColor: '#fff',
      marginBottom: 10,
      borderRadius: 8,
    },
    optionText: {
      fontSize: 16,
      color: '#333',
    },
  });
};
