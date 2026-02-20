import { StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../../utils/colors';

export const createStyles = (iconName?: string) => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      backgroundColor: theme.PURPLE,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: iconName ? 'space-between' : 'center',
      flexDirection: 'row',
      paddingHorizontal: 24,
      paddingVertical: 16,
      ...Platform.select({
        ios: {
          shadowColor: theme.PURPLE,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 12,
        },
        android: { elevation: 8 },
      }),
    },
    text: {
      color: theme.SECONDARY,
      fontSize: 17,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    icon: {
      justifyContent: 'flex-end',
    },
  });
};
