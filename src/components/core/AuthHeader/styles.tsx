import { StyleSheet } from 'react-native';
import { useTheme } from '../../../utils/colors';
import { fontSize } from '../../../utils/responsive';

export const createStyles = (compact?: boolean) => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      paddingHorizontal: compact ? 16 : 20,
      paddingVertical: compact ? 6 : 12,
      minHeight: compact ? 44 : 56,
    },
    title: {
      color: theme.SECONDARY,
      fontWeight: 'bold',
      fontSize: compact ? fontSize(17) : fontSize(20),
      ...(compact
        ? { flex: 1, textAlign: 'center' as const, marginHorizontal: 8 }
        : {}),
    },
  });
};
