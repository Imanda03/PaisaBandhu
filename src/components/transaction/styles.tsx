import { StyleSheet } from "react-native";
import { useTheme } from "../../utils/colors";

export const createStyles = () => {
    const { theme } = useTheme();

    return StyleSheet.create({
        transactionItem: {
            // marginBottom: 8,
            paddingHorizontal: 10,
        },
        container: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 5,
        },
        leftContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },
        iconContainer: {
            padding: 10,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
        },
        rightActionWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: 10,
            // paddingLeft: 25,
            gap: 10,
            backgroundColor: 'transparent', // transparent background
        },
        actionButton: {
            padding: 12,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
        },

        viewButton: {
            backgroundColor: theme.PURPLE, // Purple
        },

        deleteButton: {
            backgroundColor: theme.ERROR, // Red
        },

        icon: {
            fontSize: 24,
        },
        titleContainer: {
            justifyContent: 'center',
        },
        text: {
            fontSize: 16,
            fontWeight: '700',
            color: theme.TEXT,
        },
        bottomText: {
            fontSize: 13,
            fontWeight: '500',
            color: theme.TEXT,
            opacity: 0.7,
            marginTop: 2,
        },
        categoryRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },

        categoryIcon: {
            fontSize: 16,
        },

        categoryText: {
            fontSize: 14,
            color: theme.TEXT, // or theme.SECONDARY
        },
        price: {
            fontSize: 16,
            fontWeight: '700',
        },
        bar: {
            height: 1.5,
            backgroundColor: theme.BORDER_COLOR || '#E0E0E0',
            // marginLeft: 60,
            // marginTop: 5,
            borderRadius: 2,
        },
        friendName: {
            fontSize: 12,
            color: theme.TEXT,
            opacity: 0.6,
            marginTop: 2,
            fontWeight: 500
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
