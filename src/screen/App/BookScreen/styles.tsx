import { StyleSheet, Platform, Dimensions } from 'react-native';
import { useTheme } from '../../../utils/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const createStyles = () => {
  const { theme } = useTheme();
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.PURPLE,
    },
    headerContainer: {
      paddingTop: Platform.OS === 'ios' ? '15%' : '10%',
      paddingHorizontal: 20,
      paddingBottom: 20,
      backgroundColor: theme.PURPLE,
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    headerText: {
      color: theme.SECONDARY,
      fontSize: 26,
      fontWeight: '800',
      letterSpacing: 0.5,
    },
    headerRightContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    bookCountBadge: {
      backgroundColor: theme.SECONDARY,
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 5,
      minWidth: 30,
      alignItems: 'center',
      justifyContent: 'center',
      ...Platform.select({
        ios: {
          shadowColor: theme.SECONDARY,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        android: {
          elevation: 6,
        },
      }),
    },
    bookCountText: {
      color: theme.PURPLE,
      fontSize: 16,
      fontWeight: '800',
    },
    addButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.SECONDARY,
      justifyContent: 'center',
      alignItems: 'center',
      ...Platform.select({
        ios: {
          shadowColor: theme.SECONDARY,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        android: {
          elevation: 6,
        },
      }),
    },
    content: {
      flex: 1,
      backgroundColor: theme.BACKGROUND,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      paddingTop: 24,
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
    listContent: {
      paddingBottom: 100,
      paddingHorizontal: 16,
    },
    separator: {
      height: 10,
    },
    listFooter: {
      height: 100,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: SCREEN_WIDTH * 0.3,
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
      marginTop: 8,
    },
    input: {
      borderWidth: 1.5,
      borderColor: theme.BORDER_COLOR,
      borderRadius: 15,
      padding: 15,
      marginBottom: 20,
      color: theme.TEXT,
      fontSize: 16,
      backgroundColor: theme.INPUT_BACKGROUND,
    },
    modalButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      // marginBottom: 20,
      gap: 5,
    },
    modalButton: {
      backgroundColor: theme.PURPLE,
      borderRadius: 15,
      paddingVertical: 15,
      alignItems: 'center',
      flex: 1,
      marginHorizontal: 5,
    },
    deleteButton: {
      backgroundColor: theme.ERROR,
    },
    modalButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '700',
    },
    bookTypeHeader: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.TEXT,
      marginBottom: 8,
      marginLeft: 4,
    },
    bookTypeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 24,
      gap: 20,
    },
    bookTypeCard: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 15,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.BORDER_COLOR,
      backgroundColor: theme.INPUT_BACKGROUND,
      shadowColor: theme.SHADOW,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },

    bookTypeSelected: {
      borderColor: theme.SECONDARY,
      backgroundColor: theme.SECONDARY,
      shadowColor: theme.TEXT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 5,
      elevation: 8,
    },
    bookTypeIcon: {
      marginBottom: 4,
    },
    bookTypeTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.TEXT,
    },
    bookTypeSubtitle: {
      fontSize: 12,
      color: theme.LIGHT_TEXT,
      marginTop: 4,
    },
    bookTypeTitleSelected: {
      color: theme.PURPLE,
    },
  });
};
