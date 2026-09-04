import { StyleSheet, Dimensions, Platform } from 'react-native';
import { ThemeColors } from '../../utils/colors';
import { fontSize, scale, spacing, verticalScale } from '../../utils/responsive';

const { height } = Dimensions.get('window');

export const createStyles = (theme: ThemeColors, isDark: boolean) =>
  StyleSheet.create({
    fab: {
      position: 'absolute',
      right: spacing(18),
      width: scale(54),
      height: scale(54),
      borderRadius: scale(27),
      backgroundColor: isDark ? '#2A2A30' : '#1E1E24',
      borderWidth: 1.5,
      borderColor: theme.SECONDARY,
      alignItems: 'center',
      justifyContent: 'center',
      ...Platform.select({
        ios: {
          shadowColor: '#C6A56B',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.28,
          shadowRadius: 14,
        },
        android: { elevation: 10 },
      }),
    },

    sheetRoot: {
      height: height * 0.91,
      borderTopLeftRadius: scale(24),
      borderTopRightRadius: scale(24),
      overflow: 'hidden',
      backgroundColor: isDark ? '#16161A' : '#F4F2EE',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.22,
          shadowRadius: 20,
        },
        android: { elevation: 22 },
      }),
    },
    handle: {
      alignSelf: 'center',
      width: scale(36),
      height: 4,
      borderRadius: 2,
      backgroundColor: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(30,30,36,0.14)',
      marginTop: verticalScale(8),
      marginBottom: verticalScale(4),
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing(16),
      paddingVertical: verticalScale(12),
      backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.55)',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: isDark ? 'rgba(198,165,107,0.18)' : 'rgba(198,165,107,0.22)',
    },
    headerAvatar: {
      width: scale(36),
      height: scale(36),
      borderRadius: scale(12),
      backgroundColor: isDark ? 'rgba(198,165,107,0.16)' : '#1E1E24',
      borderWidth: 1,
      borderColor: 'rgba(198,165,107,0.4)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing(10),
    },
    headerCopy: {
      flex: 1,
      minWidth: 0,
    },
    headerTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing(7),
    },
    headerTitle: {
      fontSize: fontSize(16),
      fontWeight: '700',
      color: theme.TEXT,
      letterSpacing: -0.2,
    },
    statusDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: '#5BA56B',
    },
    headerSubtitle: {
      marginTop: 2,
      fontSize: fontSize(12),
      color: theme.LIGHT_TEXT,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing(2),
    },
    iconBtn: {
      width: scale(34),
      height: scale(34),
      borderRadius: scale(17),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(30,30,36,0.04)',
    },

    body: {
      flex: 1,
    },
    messageList: {
      flex: 1,
    },
    messageListContent: {
      paddingHorizontal: spacing(14),
      paddingTop: verticalScale(14),
      paddingBottom: verticalScale(14),
      flexGrow: 1,
    },

    welcome: {
      flex: 1,
      paddingTop: verticalScale(8),
    },
    welcomeHero: {
      marginBottom: verticalScale(20),
      paddingHorizontal: spacing(2),
      paddingVertical: verticalScale(14),
      paddingLeft: spacing(14),
      borderRadius: scale(16),
      backgroundColor: isDark ? 'rgba(198,165,107,0.08)' : 'rgba(198,165,107,0.1)',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(198,165,107,0.18)' : 'rgba(198,165,107,0.22)',
    },
    welcomeTitle: {
      fontSize: fontSize(20),
      fontWeight: '700',
      color: theme.TEXT,
      letterSpacing: -0.3,
      marginBottom: verticalScale(6),
    },
    welcomeBody: {
      fontSize: fontSize(14),
      lineHeight: fontSize(20),
      color: theme.LIGHT_TEXT,
    },
    sectionLabel: {
      fontSize: fontSize(11),
      fontWeight: '700',
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      color: theme.LIGHT_TEXT,
      marginBottom: verticalScale(10),
      marginLeft: spacing(2),
    },
    actionList: {
      gap: spacing(8),
    },
    actionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: verticalScale(13),
      paddingHorizontal: spacing(12),
      borderRadius: scale(14),
      backgroundColor: isDark ? 'rgba(255,255,255,0.045)' : '#FFFFFF',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(30,30,36,0.06)',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: isDark ? 0.2 : 0.05,
          shadowRadius: 8,
        },
        android: { elevation: isDark ? 0 : 2 },
      }),
    },
    actionIcon: {
      width: scale(36),
      height: scale(36),
      borderRadius: scale(11),
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing(11),
    },
    actionCopy: {
      flex: 1,
      minWidth: 0,
    },
    actionTitle: {
      fontSize: fontSize(14),
      fontWeight: '600',
      color: theme.TEXT,
    },
    actionDesc: {
      marginTop: 2,
      fontSize: fontSize(12),
      color: theme.LIGHT_TEXT,
    },

    bubbleRow: {
      flexDirection: 'row',
      marginBottom: verticalScale(14),
      alignItems: 'flex-end',
    },
    bubbleRowUser: {
      justifyContent: 'flex-end',
    },
    bubbleRowAssistant: {
      justifyContent: 'flex-start',
    },
    avatar: {
      width: scale(26),
      height: scale(26),
      borderRadius: scale(9),
      backgroundColor: isDark ? 'rgba(198,165,107,0.18)' : '#1E1E24',
      borderWidth: 1,
      borderColor: 'rgba(198,165,107,0.35)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing(8),
    },
    bubble: {
      maxWidth: '85%',
      paddingHorizontal: spacing(14),
      paddingVertical: verticalScale(11),
      borderRadius: scale(16),
    },
    userBubble: {
      backgroundColor: isDark ? theme.SECONDARY : '#1E1E24',
      borderBottomRightRadius: scale(5),
      ...Platform.select({
        ios: {
          shadowColor: isDark ? '#C6A56B' : '#000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: isDark ? 0.25 : 0.12,
          shadowRadius: 8,
        },
        android: { elevation: 2 },
      }),
    },
    assistantBubble: {
      backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#FFFFFF',
      borderBottomLeftRadius: scale(5),
      borderWidth: 1,
      borderColor: isDark ? 'rgba(198,165,107,0.14)' : 'rgba(30,30,36,0.05)',
      minWidth: '52%',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.22 : 0.05,
          shadowRadius: 10,
        },
        android: { elevation: 1 },
      }),
    },

    composerWrap: {
      paddingHorizontal: spacing(12),
      paddingTop: verticalScale(12),
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(30,30,36,0.06)',
      backgroundColor: isDark ? 'rgba(22,22,26,0.98)' : 'rgba(244,242,238,0.98)',
    },
    composerBar: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: spacing(10),
      padding: spacing(8),
      borderRadius: scale(22),
      backgroundColor: isDark ? '#1C1C22' : '#FFFFFF',
      borderWidth: 1.5,
      borderColor: isDark ? 'rgba(198,165,107,0.28)' : 'rgba(198,165,107,0.32)',
      ...Platform.select({
        ios: {
          shadowColor: '#C6A56B',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: isDark ? 0.22 : 0.14,
          shadowRadius: 18,
        },
        android: { elevation: 6 },
      }),
    },
    composerBarFocused: {
      borderColor: theme.SECONDARY,
      ...Platform.select({
        ios: {
          shadowOpacity: isDark ? 0.35 : 0.22,
          shadowRadius: 22,
        },
        android: { elevation: 8 },
      }),
    },
    inputShell: {
      flex: 1,
      minHeight: verticalScale(52),
      maxHeight: verticalScale(130),
      borderRadius: scale(16),
      paddingHorizontal: spacing(12),
      paddingVertical: Platform.OS === 'ios' ? verticalScale(13) : verticalScale(11),
      backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F7F5F0',
      justifyContent: 'center',
    },
    input: {
      fontSize: fontSize(16),
      lineHeight: fontSize(22),
      color: theme.TEXT,
      maxHeight: verticalScale(104),
      padding: 0,
      margin: 0,
      fontWeight: '500',
    },
    sendBtn: {
      width: scale(52),
      height: scale(52),
      borderRadius: scale(16),
      backgroundColor: theme.SECONDARY,
      alignItems: 'center',
      justifyContent: 'center',
      ...Platform.select({
        ios: {
          shadowColor: '#C6A56B',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 8,
        },
        android: { elevation: 4 },
      }),
    },
    sendBtnIdle: {
      backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(30,30,36,0.08)',
      ...Platform.select({
        ios: { shadowOpacity: 0 },
        android: { elevation: 0 },
      }),
    },
  });
