import { StyleSheet } from "react-native";
import { useTheme } from "../../utils/colors";

export const createStyles = () => {
    const { theme } = useTheme();

    return StyleSheet.create({
        transactionItem: {
            paddingHorizontal: 0,
            paddingVertical: 0,
        },
        container: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 12,
            paddingHorizontal: 14,
            backgroundColor: theme.BACKGROUND_LIGHT,
            borderRadius: 16,
            marginVertical: 4,
            borderWidth: 1,
            borderColor: theme.BORDER_COLOR + '30',
            shadowColor: theme.SHADOW,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.08,
            shadowRadius: 10,
            elevation: 2,
        },
        leftContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            marginRight: 10,
        },
        iconContainer: {
            width: 44,
            height: 44,
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
            backgroundColor: theme.LIGHT_PURPLE,
            borderWidth: 1.5,
            borderColor: theme.PURPLE + '40',
            shadowColor: theme.PURPLE,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.12,
            shadowRadius: 6,
            elevation: 2,
        },
        rightActionWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: 10,
            gap: 8,
            backgroundColor: 'transparent',
        },
        actionButton: {
            padding: 10,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            width: 44,
            height: 44,
        },

        viewButton: {
            backgroundColor: theme.PURPLE, // Purple
        },

        deleteButton: {
            backgroundColor: theme.ERROR, // Red
        },

        icon: {
            fontSize: 22,
        },
        titleContainer: {
            justifyContent: 'center',
            flex: 1,
        },
        text: {
            fontSize: 15,
            fontWeight: '700',
            color: theme.TEXT,
            letterSpacing: 0.1,
            marginBottom: 4,
            lineHeight: 20,
        },
        bottomText: {
            fontSize: 11.5,
            fontWeight: '500',
            color: theme.TEXT,
            opacity: 0.65,
            marginTop: 0,
        },
        categoryRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            marginTop: 2,
        },
        categoryBadge: {
            backgroundColor: theme.PURPLE + '18',
            borderRadius: 8,
            paddingHorizontal: 8,
            paddingVertical: 3,
            overflow: 'hidden',
        },
        categoryText: {
            fontSize: 10.5,
            fontWeight: '700',
            color: theme.PURPLE,
            letterSpacing: 0.2,
        },
        price: {
            fontSize: 17,
            fontWeight: '800',
            letterSpacing: 0.3,
            marginBottom: 4,
            lineHeight: 22,
        },
        priceContainer: {
            alignItems: 'flex-end',
            justifyContent: 'center',
            minWidth: 90,
        },
        priceWrapper: {
            alignItems: 'flex-end',
        },
        bar: {
            display: 'none', // Hide the bar since we're using card style now
        },
        friendName: {
            fontSize: 10.5,
            color: theme.TEXT,
            opacity: 0.7,
            marginTop: 3,
            fontWeight: '600',
            backgroundColor: theme.BACKGROUND + '80',
            paddingHorizontal: 7,
            paddingVertical: 2,
            borderRadius: 6,
            overflow: 'hidden',
        },
        leftActionWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            backgroundColor: 'transparent',
            paddingLeft: 10,
        },
    });
};
