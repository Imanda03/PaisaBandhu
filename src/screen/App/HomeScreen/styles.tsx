import { StyleSheet } from "react-native"
import { useTheme } from "../../../utils/colors"

export const createStyles = () => {
    const { theme } = useTheme()
    return StyleSheet.create({
        root: {
            flex: 1,
            backgroundColor: theme.PURPLE,
            paddingTop: '13%',
            paddingHorizontal: '5%',
        },
        flatList: {
            flex: 1,
            backgroundColor: theme.BACKGROUND,
            marginHorizontal: '-5%',
            padding: 5,
            marginTop: 10,
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50
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
        pullIndicatorContainer: {
            alignItems: 'center',
            paddingTop: 10,
            paddingBottom: 20,
        },
        pullIndicator: {
            width: 40,
            height: 5,
            borderRadius: 3,
            opacity: 0.5,
        },
        transactionItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 15,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
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
            shadowColor: '#000',
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
            color: '#FFFFFF',
            fontSize: 12,
            fontWeight: '600',
            marginTop: 4,
        },
    })
}