import { StyleSheet } from 'react-native';
import { useTheme } from '../../../../../utils/colors';

export const createStyles = () => {
  const { theme } = useTheme();
  return StyleSheet.create({
    container: {
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 20,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
      shadowColor: theme.SHADOW,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 5,
    },
    innerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      //   marginBottom: 12,
    },
    textContainer: {
      flex: 1,
      marginRight: 12,
    },
    greetText: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.SECONDARY,
      letterSpacing: 0.4,
      marginBottom: 4,
    },
    subText: {
      fontSize: 14,
      fontWeight: '400',
      color: theme.SECONDARY,
      opacity: 0.7,
    },
    dateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    dateText: {
      fontSize: 15,
      fontWeight: '500',
      color: theme.SECONDARY,
      opacity: 0.8,
    },
    avatar: {
      height: 50,
      width: 50,
      borderRadius: 28,
      backgroundColor: theme.PURPLE,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'rgba(255, 255, 255, 0.3)',
      shadowColor: theme.PURPLE,
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 8,
    },
    avatarText: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.SECONDARY,
      textAlign: 'center',
    },
  });
};
