import { StyleSheet } from 'react-native';
import { useTheme } from '../../utils/colors';
export const createStyles = (focused?: boolean) => {
  const { theme } = useTheme();

  return StyleSheet.create({
    tabBar: {
      position: 'absolute',
      bottom: 8,
      left: 10,
      right: 10,
      elevation: 5,
      backgroundColor: theme.NAVBAR_BACKGROUND,
      borderRadius: 30,
      height: 70,
      marginHorizontal: 20,
    },
    tabBarItem: {
      padding: 5,
    },
    // tabBarIcon: {
    //   marginTop: 10,
    // },
    tabLabel: {
      fontSize: 12,
      textAlign: 'center',
      width: 60,
      marginBottom: 10,
      fontWeight: 'bold',
    },
    tabBarButtonContainer: {
      flex: 1,
      alignItems: 'center',
    },
    tabBarButton: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      // paddingVertical: 8,
      // paddingHorizontal: 12,
    },
    tabBarButtonActive: {
      backgroundColor: theme.NAVBAR_ACTIVE_BACKGROUND,
      borderRadius: 30,
      marginHorizontal: 10,
      padding: 5,
      opacity: 0.9,
    },
  });
};
