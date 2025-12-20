import { StyleSheet } from 'react-native';
import { useTheme } from '../../../../../utils/colors';

export const createStyles = () => {
  const { theme } = useTheme();
  return StyleSheet.create({
    container: {
      backgroundColor: theme.LIGHT_PURPLE,
      marginVertical: '2%',
      paddingHorizontal: '5%',
      paddingVertical: '5%',
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
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
      fontSize: 20,
      fontWeight: '700',
      color: theme.SECONDARY,
      letterSpacing: 0.3,
      //   marginBottom: 4,
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
      height: 48,
      width: 48,
      borderRadius: 26,
      backgroundColor: '#667eea',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#667eea',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 5,
    },
    avatarText: {
      fontSize: 22,
      fontWeight: '700',
      color: '#FFFFFF',
      textAlign: 'center',
    },
  });
};
