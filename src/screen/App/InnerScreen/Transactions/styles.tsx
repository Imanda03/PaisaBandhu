import { StyleSheet } from "react-native"
import { useTheme } from "../../../../utils/colors"

export const createStyles = () => {

    const { theme, isDark } = useTheme()
    return StyleSheet.create({
        root: {
            flex: 1,
            backgroundColor: theme.PURPLE,
            paddingTop: '10%',
        },
        container: {
            flex: 1,
            paddingHorizontal: '5%',
            marginTop: '8%'
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
            borderRadius: 16,
            // paddingVertical: 20,
            paddingHorizontal: 16,
            marginBottom: 5,
        },
        totalInner: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginBottom: '5%'
        },
        totalText: {
            fontSize: 24,
            color: theme.SECONDARY,
            fontWeight: 500,
            fontFamily: 'Inter',
            lineHeight: 22
        },
        price: {
            fontSize: 32,
            fontWeight: 600,
            color: theme.SECONDARY,
            lineHeight: 22
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
            marginTop: '5%',
        },
        typeContainer: {
            backgroundColor: theme.BACKGROUND,
            width: '46%',
            borderRadius: 15,
            padding: 15,
            gap: 10,
        },
        typeText: {
            fontSize: 16,
            fontWeight: 600,
            lineHeight: 24,
            color: isDark ? theme.SECONDARY : theme.PURPLE
        },
        typeInnerContainer: {
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center'
        },
        typePrice: {
            fontSize: 18,
            fontWeight: 600
        },
        content: {
            flex: 2,
            backgroundColor: theme.BACKGROUND,
            marginTop: '5%',
            marginHorizontal: '-5%',
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            paddingTop: 20,
            paddingHorizontal: '5%',
        },
        flatList: {
            flex: 1,
            backgroundColor: theme.BACKGROUND,
            marginHorizontal: '-5%',
            padding: 5,
            marginTop: 3,
            // borderTopLeftRadius: 50,
            // borderTopRightRadius: 50
        },
        emptyState: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '20%',
        },
        emptyText: {
            fontSize: 18,
            fontWeight: '500',
            marginTop: 10,
        },
        fabWrapper: {
            position: 'absolute',
            bottom: 30,
            right: 16,
            zIndex: 9999,
            elevation: 10
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
            shadowColor: '#171717',
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
            opacity: 0.8
        },
        btnContent: {
            color: theme.DARK_TEXT,
            fontWeight: 800,
            letterSpacing: 0.8
        },
    })
}