import { StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../utils/colors';
import { scale, verticalScale, fontSize, spacing } from '../../utils/responsive';

export const createStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    tabBar: {
      position: 'absolute',
      bottom: verticalScale(16),
      left: spacing(16),
      right: spacing(16),
      elevation: 8,
      backgroundColor: theme.NAVBAR_BACKGROUND,
      borderRadius: scale(28),
      height: verticalScale(72),
      marginHorizontal: spacing(16),
      borderTopWidth: 0,
      borderWidth: 1,
      borderColor: theme.BORDER_COLOR,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 16,
        },
        android: { elevation: 8 },
      }),
    },
    tabBarItem: {
      padding: 5,
    },
    // tabBarIcon: {
    //   marginTop: 10,
    // },
    tabLabel: {
      fontSize: fontSize(12),
      textAlign: 'center',
      width: scale(60),
      marginBottom: verticalScale(10),
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
      borderRadius: scale(20),
      marginHorizontal: spacing(6),
      paddingVertical: spacing(10),
      paddingHorizontal: spacing(16),
      ...Platform.select({
        ios: {
          shadowColor: theme.NAVBAR_ACTIVE_BACKGROUND,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 12,
        },
        android: { elevation: 6 },
      }),
    },
  });
};
