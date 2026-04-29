import { StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../utils/colors';
import type { NavBarLayout } from '../../utils/responsive';

export const createTabBarStyles = (nav: NavBarLayout) => {
  const { theme } = useTheme();

  return StyleSheet.create({
    /**
     * Outer chrome: position + shadow only. Fill comes from LinearGradient in FlowingTabBar.
     */
    tabBarDock: {
      position: 'absolute',
      bottom: nav.bottomOffset,
      left: nav.horizontalInset,
      right: nav.horizontalInset,
      height: nav.dockHeight,
      borderRadius: nav.rimBorderRadius,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.18,
          shadowRadius: 24,
        },
        android: {
          elevation: 14,
        },
      }),
    },
    tabBarRim: {
      flex: 1,
      borderRadius: nav.rimBorderRadius,
      padding: nav.rimPadding,
      overflow: 'hidden',
    },
    tabBarInner: {
      flex: 1,
      borderRadius: nav.innerBorderRadius,
      overflow: 'hidden',
    },
    /** Merged onto nested BottomTabBar only */
    tabBarNavigatorInner: {
      position: 'relative',
      flex: 1,
      width: '100%',
      height: '100%',
      marginHorizontal: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
      marginTop: 0,
      paddingBottom: 0,
      paddingTop: 0,
      paddingHorizontal: 0,
      backgroundColor: 'transparent',
      borderWidth: 0,
      borderTopWidth: 0,
      borderBottomWidth: 0,
      elevation: 0,
      shadowOpacity: 0,
      shadowRadius: 0,
    },
    dockTrack: {
      flex: 1,
      flexDirection: 'row',
      position: 'relative',
      alignItems: 'center',
      paddingHorizontal: nav.dockTrackPaddingH,
      paddingTop: nav.dockTrackPaddingTop,
      paddingBottom: nav.dockTrackPaddingBottom,
    },
    /** Sliding gold accent — sits above bottom inset */
    accentRailWrap: {
      position: 'absolute',
      bottom: nav.accentBottom,
      left: 0,
      height: nav.accentHeight,
      borderRadius: Math.max(2, Math.round(nav.accentHeight / 2)),
      overflow: 'hidden',
      zIndex: 0,
      ...Platform.select({
        ios: {
          shadowColor: '#C6A56B',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.55,
          shadowRadius: 8,
        },
        android: { elevation: 0 },
      }),
    },
    dockItemsLayer: {
      flex: 1,
      zIndex: 2,
      elevation: 2,
    },
    tabBarItem: {
      paddingVertical: nav.tabBarItemPaddingV,
      paddingHorizontal: 2,
    },
    tabLabel: {
      textAlign: 'center',
      maxWidth: nav.tabLabelWidth,
      width: nav.tabLabelWidth,
      marginTop: Math.round(nav.dockTrackPaddingTop * 0.5),
      fontWeight: '600',
    },
    tabBarButtonContainer: {
      flex: 1,
      alignItems: 'center',
    },
    tabBarButton: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabBarButtonActive: {
      backgroundColor: theme.NAVBAR_ACTIVE_BACKGROUND,
      borderRadius: nav.activeButtonRadius,
      marginHorizontal: nav.activeButtonMarginH,
      paddingVertical: nav.activeButtonPaddingV,
      paddingHorizontal: nav.activeButtonPaddingH,
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
