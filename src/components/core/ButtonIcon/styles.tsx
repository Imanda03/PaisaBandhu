import { StyleSheet } from 'react-native';
import { useTheme } from '../../../utils/colors';

export const createStyles = (iconName?: string) => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      backgroundColor: theme.DARK_PURPLE,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: iconName ? 'space-between' : 'center',
      //   gap: 30,
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 15,
    },
    text: {
      color: theme.SECONDARY,
      fontSize: 18,
      fontWeight: 'bold',
      letterSpacing: 0.6,
    },
    icon: {
      justifyContent: 'flex-end',
    },
  });
};
