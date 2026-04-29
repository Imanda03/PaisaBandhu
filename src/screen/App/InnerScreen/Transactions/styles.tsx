import { StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../../../utils/colors';
import {
  scale,
  verticalScale,
  fontSize,
  spacing,
} from '../../../../utils/responsive';

export const createStyles = () => {
  const { theme, isDark } = useTheme();
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.HEADER_BACKGROUND,
    },
    headerWrapper: {
      paddingBottom: verticalScale(14),
      backgroundColor: 'transparent',
    },
    container: {
      flex: 1,
      paddingHorizontal: spacing(20),
      paddingTop: verticalScale(5),
    },
    topSection: {
      flexShrink: 0,
    },
    innerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 12,
    },
    groupOverviewWrap: {
      flex: 1,
      width: '100%',
      marginBottom: verticalScale(8),
    },

    overviewColumn: {
      gap: verticalScale(10),
      marginTop: verticalScale(4),
      marginBottom: verticalScale(4),
    },
    overviewBalanceCard: {
      borderRadius: scale(20),
      paddingVertical: verticalScale(16),
      paddingHorizontal: spacing(18),
      borderWidth: 1,
      backgroundColor: isDark
        ? 'rgba(32, 33, 37, 0.97)'
        : 'rgba(255, 255, 255, 0.99)',
      borderColor: isDark
        ? 'rgba(198, 165, 107, 0.28)'
        : 'rgba(198, 165, 107, 0.22)',
      overflow: 'hidden',
      ...Platform.select({
        ios: {
          shadowColor: isDark ? '#000' : theme.SECONDARY,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: isDark ? 0.35 : 0.11,
          shadowRadius: 18,
        },
        android: { elevation: 6 },
      }),
    },
    overviewBalanceGradient: {
      ...StyleSheet.absoluteFillObject,
    },
    overviewBalanceInner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing(14),
    },
    overviewBalanceIconRing: {
      width: scale(54),
      height: scale(54),
      borderRadius: scale(18),
      borderWidth: 1.5,
      justifyContent: 'center',
      alignItems: 'center',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.35 : 0.06,
          shadowRadius: 6,
        },
        android: { elevation: 2 },
      }),
    },
    overviewBalanceCopy: {
      flex: 1,
      minWidth: 0,
    },
    overviewBalanceEyebrow: {
      fontSize: fontSize(10),
      fontWeight: '800',
      color: theme.LIGHT_TEXT,
      letterSpacing: 1.25,
      textTransform: 'uppercase',
      opacity: 0.72,
      marginBottom: verticalScale(6),
    },
    overviewBalanceText: {
      fontSize: fontSize(26),
      fontWeight: '800',
      color: theme.SECONDARY,
      letterSpacing: 0.15,
      marginBottom: verticalScale(7),
    },
    overviewBalanceUnderline: {
      width: scale(40),
      height: scale(3),
      borderRadius: scale(2),
      opacity: 0.55,
    },
    overviewStatRow: {
      flexDirection: 'row',
      gap: spacing(10),
      alignItems: 'stretch',
    },
    overviewStatCard: {
      flex: 1,
      borderRadius: scale(16),
      paddingVertical: verticalScale(12),
      paddingHorizontal: spacing(12),
      borderWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing(10),
      minWidth: 0,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.2 : 0.05,
          shadowRadius: 8,
        },
        android: { elevation: 2 },
      }),
    },
    overviewStatCardIncome: {
      backgroundColor: isDark
        ? 'rgba(91, 165, 107, 0.18)'
        : 'rgba(240, 249, 241, 0.98)',
      borderColor: isDark
        ? 'rgba(91, 165, 107, 0.38)'
        : 'rgba(91, 165, 107, 0.22)',
    },
    overviewStatCardExpense: {
      backgroundColor: isDark
        ? 'rgba(212, 93, 93, 0.16)'
        : 'rgba(253, 242, 242, 0.98)',
      borderColor: isDark
        ? 'rgba(212, 93, 93, 0.38)'
        : 'rgba(212, 93, 93, 0.2)',
    },
    overviewStatIcon: {
      width: scale(34),
      height: scale(34),
      borderRadius: scale(11),
      justifyContent: 'center',
      alignItems: 'center',
    },
    overviewStatLabel: {
      fontSize: fontSize(10),
      fontWeight: '800',
      color: theme.LIGHT_TEXT,
      letterSpacing: 0.65,
      textTransform: 'uppercase',
      marginBottom: verticalScale(2),
      opacity: 0.84,
    },
    overviewStatValue: {
      fontSize: fontSize(14),
      fontWeight: '800',
      letterSpacing: 0.06,
    },
    overviewStatTextBlock: {
      flex: 1,
      minWidth: 0,
    },
    overviewFlowTrack: {
      flexDirection: 'row',
      height: scale(3),
      borderRadius: scale(2),
      overflow: 'hidden',
      backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
    },
    overviewFlowSegment: {
      height: '100%',
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
      color: isDark ? theme.TEXT : theme.LIGHT_TEXT,
      textTransform: 'uppercase',
      letterSpacing: 1,
      opacity: isDark ? 1 : 0.8,
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
      opacity: 1,
    },
    content: {
      flex: 2,
      backgroundColor: theme.BACKGROUND,
      marginTop: verticalScale(24),
      marginHorizontal: -spacing(20),
      borderTopLeftRadius: scale(32),
      borderTopRightRadius: scale(32),
      paddingTop: verticalScale(24),
      paddingHorizontal: spacing(20),
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
    helperRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing(6),
      marginBottom: spacing(4),
      marginTop: -spacing(4),
      paddingHorizontal: spacing(2),
    },
    helperText: {
      fontSize: fontSize(11),
      color: theme.LIGHT_TEXT,
    },
    flatList: {
      flex: 1,
      backgroundColor: theme.BACKGROUND,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: verticalScale(80),
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
    },
    fabExpandedShadow: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.22,
      shadowRadius: 8,
      elevation: 6,
    },
    fabExpandedButton: {
      position: 'absolute',
      right: 0,
      minWidth: scale(96),
      maxWidth: scale(132),
      paddingVertical: verticalScale(9),
      paddingHorizontal: spacing(12),
      borderRadius: scale(20),
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 0,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.35)',
    },
    fabExpandedInner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing(6),
    },
    fabExpandedLabel: {
      color: '#FFFFFF',
      fontWeight: '800',
      fontSize: fontSize(11),
      letterSpacing: 0.35,
    },
    fabWrapper: {
      position: 'absolute',
      right: spacing(18),
      zIndex: 9999,
      elevation: 12,
      overflow: 'visible',
    },
    mainButton: {
      zIndex: 3,
      height: scale(58),
      width: scale(58),
      borderRadius: 100,
      backgroundColor: isDark ? theme.SECONDARY : theme.PURPLE,
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
      color: isDark ? '#1A1A1E' : theme.SECONDARY,
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
