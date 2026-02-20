import { StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../../../utils/colors';
import { scale, verticalScale, fontSize, spacing } from '../../../../utils/responsive';

export const createStyles = () => {
  const { theme } = useTheme();
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.HEADER_BACKGROUND,
    },
    headerContainer: {
      paddingTop: Platform.OS === 'ios' ? '15%' : '10%',
      paddingHorizontal: spacing(20),
      paddingBottom: verticalScale(20),
      backgroundColor: theme.HEADER_BACKGROUND,
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
    backButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
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
    categoryCountBadge: {
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
    categoryCountText: {
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
      borderTopLeftRadius: scale(32),
      borderTopRightRadius: scale(32),
      paddingTop: verticalScale(24),
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
      paddingBottom: verticalScale(100),
      paddingHorizontal: spacing(16),
    },
    categoryCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderRadius: 16,
      ...Platform.select({
        ios: {
          shadowColor: theme.SHADOW,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    categoryLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: 16,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconText: {
      fontSize: 24,
    },
    categoryInfo: {
      flex: 1,
    },
    categoryName: {
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 4,
      letterSpacing: 0.3,
    },
    categoryType: {
      fontSize: 13,
      fontWeight: '500',
      opacity: 0.7,
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
      paddingVertical: verticalScale(60),
      paddingHorizontal: spacing(40),
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
  });
};

