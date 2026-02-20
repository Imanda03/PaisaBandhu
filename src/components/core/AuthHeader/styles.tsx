import { StyleSheet } from 'react-native';
import { useTheme } from '../../../utils/colors';
import { fontSize } from '../../../utils/responsive';

export const createStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      // backgroundColor: theme.BACKGROUND,
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 12,
      minHeight: 56,
    },
    title: {
      color: theme.SECONDARY,
      fontWeight: 'bold',
      fontSize: fontSize(20),
    },
  });
};
