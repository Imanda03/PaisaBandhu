import { StyleSheet, Platform, StatusBar } from 'react-native';
import { useTheme } from '../../../../utils/colors';

const STATUS_BAR_HEIGHT =
  Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

export const createStyles = () => {
  const { theme, isDark } = useTheme();
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.PURPLE,
    },
    headerWrapper: {
      paddingTop: Platform.OS === 'ios' ? '10%' : STATUS_BAR_HEIGHT + 12,
      paddingBottom: 12,
      backgroundColor: theme.PURPLE,
    },
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 5,
    },
    topSection: {
      flexShrink: 0,
    },
    innerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
      // marginBottom: 10,
    },

    card: {
      flex: 1,
      borderRadius: 24,
      paddingVertical: 24,
      paddingHorizontal: 24,
      marginBottom: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
      shadowColor: theme.SHADOW,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 8,
    },
    totalInner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 12,
    },
    totalText: {
      fontSize: 16,
      color: theme.SECONDARY,
      fontWeight: '600',
      letterSpacing: 0.5,
      opacity: 0.95,
    },
    price: {
      fontSize: 36,
      fontWeight: '800',
      color: theme.SECONDARY,
      letterSpacing: 0.5,
    },
    friendsStatsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: 10,
      marginTop: 4,
    },

    friendsStats: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    friendsMainStat: {
      fontSize: 20,
      fontWeight: '700',
      color: isDark ? theme.SECONDARY : theme.PURPLE,
    },

    friendsSubStat: {
      fontSize: 16,
      fontWeight: '700',
      color: isDark ? theme.SECONDARY : theme.PURPLE,
      marginLeft: 6,
    },

    seeFriendText: {
      fontSize: 14,
      color: isDark ? theme.SECONDARY : theme.PURPLE,
      textDecorationLine: 'underline',
      fontWeight: '600',
    },

    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
      gap: 12,
    },
    typeContainer: {
      flex: 1,
      backgroundColor: theme.BACKGROUND_LIGHT,
      borderRadius: 20,
      padding: 20,
      gap: 12,
      borderWidth: 1.5,
      borderColor: theme.BORDER_COLOR + '50',
      shadowColor: theme.SHADOW,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 5,
      ...Platform.select({
        ios: {
          shadowColor: theme.SHADOW,
          shadowOpacity: 0.15,
        },
        android: {
          elevation: 5,
        },
      }),
    },
    typeText: {
      fontSize: 13,
      fontWeight: '700',
      lineHeight: 18,
      color: theme.LIGHT_TEXT,
      textTransform: 'uppercase',
      letterSpacing: 1,
      opacity: 0.8,
    },
    typeInnerContainer: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
      marginTop: 4,
    },
    typePrice: {
      fontSize: 20,
      fontWeight: '800',
      letterSpacing: 0.3,
    },
    content: {
      flex: 2,
      backgroundColor: theme.BACKGROUND,
      marginTop: 24,
      marginHorizontal: -20,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      paddingTop: 24,
      paddingHorizontal: 20,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
        },
        android: {
          elevation: 15,
        },
      }),
    },
    flatList: {
      flex: 1,
      backgroundColor: theme.BACKGROUND,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 80,
      paddingHorizontal: 40,
    },
    emptyIconContainer: {
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: theme.BACKGROUND_LIGHT,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 32,
      ...Platform.select({
        ios: {
          shadowColor: theme.SHADOW,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    emptyText: {
      fontSize: 22,
      fontWeight: '700',
      marginTop: 16,
      marginBottom: 8,
      textAlign: 'center',
      color: theme.TEXT,
      letterSpacing: 0.3,
    },
    emptySubText: {
      fontSize: 15,
      fontWeight: '400',
      textAlign: 'center',
      lineHeight: 22,
      opacity: 0.7,
    },
    fabWrapper: {
      position: 'absolute',
      bottom: 30,
      right: 16,
      zIndex: 9999,
      elevation: 10,
    },
    mainButton: {
      zIndex: 1,
      height: 56,
      width: 56,
      borderRadius: 100,
      backgroundColor: theme.PURPLE,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    shadow: {
      shadowColor: theme.SHADOW,
      shadowOffset: { width: -0.5, height: 3.5 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    mainButtonContent: {
      fontSize: 24,
      color: theme.SECONDARY,
    },
    button: {
      width: '150%',
      height: '70%',
      marginLeft: '-80%',
      padding: 5,
      // backgroundColor: theme.DARK_BG,
      position: 'absolute',
      borderRadius: 50,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: -2,
      flexDirection: 'row',
      opacity: 0.8,
    },
    btnContent: {
      color: theme.DARK_TEXT,
      fontWeight: 800,
      letterSpacing: 0.8,
    },
  });
};
