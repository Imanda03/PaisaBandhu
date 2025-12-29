import { StyleSheet, Dimensions, Platform } from 'react-native';
import { useTheme } from '../../../utils/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const createStyles = () => {
  const { theme } = useTheme();
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.PURPLE,
    },
    headerSection: {
      paddingTop: Platform.OS === 'ios' ? '15%' : '10%',
      paddingHorizontal: 20,
      paddingBottom: 12,
      backgroundColor: theme.PURPLE,
    },
    chartSection: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    scrollContent: {
      flexGrow: 1,
    },
    draggablePanel: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.BACKGROUND,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      borderWidth: 1,
      borderColor: theme.BORDER_COLOR + '15',
      borderBottomWidth: 0,
      // Premium shadow for elevation
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -10 },
          shadowOpacity: 0.3,
          shadowRadius: 25,
        },
        android: {
          elevation: 25,
        },
      }),
    },
    dragHandleContainer: {
      alignItems: 'center',
      paddingTop: 10,
      //   paddingBottom: 12,
      backgroundColor: 'transparent',
    },
    dragHandle: {
      width: 52,
      height: 5,
      borderRadius: 3,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.TEXT + '15',
    },
    dragHandleBar: {
      width: 52,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.TEXT,
      opacity: 0.35,
    },
    panelHeader: {
      paddingHorizontal: 20,
      paddingTop: 4,
      paddingBottom: 12,
      borderBottomWidth: 1.5,
      borderBottomColor: theme.BORDER_COLOR + '25',
      marginBottom: 6,
      backgroundColor: 'transparent',
    },
    transactionsList: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 4,
    },
    separator: {
      height: 0,
    },
    flatList: {
      flex: 1,
      backgroundColor: theme.BACKGROUND,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      marginTop: 20,
      paddingTop: 16,
      paddingHorizontal: 16,
      // Premium shadow for elevation
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: SCREEN_HEIGHT * 0.15,
      paddingHorizontal: 40,
    },
    emptyIconContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: theme.BACKGROUND_LIGHT,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
      // Soft shadow
      ...Platform.select({
        ios: {
          shadowColor: theme.SHADOW,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 16,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    emptyText: {
      fontSize: 20,
      fontWeight: '700',
      marginTop: 16,
      marginBottom: 8,
      letterSpacing: 0.3,
    },
    emptySubText: {
      fontSize: 15,
      fontWeight: '400',
      textAlign: 'center',
      lineHeight: 22,
      opacity: 0.7,
    },
    listContentContainer: {
      paddingBottom: 100,
      paddingTop: 4,
      flexGrow: 1,
    },
    pullIndicatorContainer: {
      alignItems: 'center',
      paddingTop: 8,
      paddingBottom: 12,
    },
    pullIndicator: {
      width: 36,
      height: 4,
      borderRadius: 2,
      opacity: 0.3,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 6,
      marginBottom: 4,
    },
    sectionTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      flex: 1,
    },
    titleWithHint: {
      flexDirection: 'column',
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '800',
      letterSpacing: 0.5,
      color: theme.TEXT,
    },
    dragHint: {
      fontSize: 10,
      fontWeight: '400',
      opacity: 0.5,
      marginTop: 2,
      textTransform: 'lowercase',
    },
    countBadge: {
      backgroundColor: theme.PURPLE,
      paddingHorizontal: 14,
      paddingVertical: 5,
      borderRadius: 25,
      minWidth: 36,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.PURPLE,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 4,
    },
    countText: {
      fontSize: 15,
      fontWeight: '800',
      color: theme.SECONDARY,
    },

    transactionItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.BORDER_COLOR,
    },
    // New drag indicator styles
    dragIndicatorContainer: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: [{ translateX: -50 }, { translateY: -50 }],
      alignItems: 'center',
      zIndex: 20,
    },
    dragIndicator: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 8,
      shadowColor: theme.SHADOW,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
    },
    dragText: {
      marginTop: 8,
      fontSize: 14,
      fontWeight: '600',
      textAlign: 'center',
    },
    swipeableContainer: {
      marginVertical: 2,
    },
    actionBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 12,
      marginHorizontal: 16,
    },
    actionContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
    },
    leftAction: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    rightAction: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionText: {
      color: theme.SECONDARY,
      fontSize: 12,
      fontWeight: '600',
      marginTop: 4,
    },
  });
};
