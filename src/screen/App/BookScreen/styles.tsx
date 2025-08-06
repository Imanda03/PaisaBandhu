import { StyleSheet } from "react-native"
import { useTheme } from "../../../utils/colors"

export const createStyles = () => {
    const { theme } = useTheme()
    return StyleSheet.create({
        root: {
            flex: 1,
            backgroundColor: theme.PURPLE,
            paddingTop: '15%',
            paddingHorizontal: '5%',
        },
        headerText: {
            color: theme.SECONDARY,
            fontSize: 24,
            fontWeight: '700',
            fontFamily: 'Open Sans',
        },
        content: {
            flex: 1,
            backgroundColor: theme.BACKGROUND,
            marginTop: '5%',
            marginHorizontal: '-5%',
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            paddingTop: 20,
        },
        emptyState: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '30%',
            paddingHorizontal: 20,
        },
        emptyText: {
            fontSize: 18,
            fontWeight: '500',
            marginTop: 15,
            marginBottom: 5,
            textAlign: 'center',
            color: theme.TEXT,
        },
        actionText: {
            fontSize: 14,
            fontWeight: '400',
            textAlign: 'center',
            marginTop: 10,
            fontStyle: 'italic',
            color: theme.LIGHT_TEXT,
        },
        addButton: {
            backgroundColor: theme.SECONDARY,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 5,
        },
        headerContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
        },
        modalContent: {
            paddingHorizontal: 10,
            paddingVertical: 10,
            justifyContent: 'space-between',
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
