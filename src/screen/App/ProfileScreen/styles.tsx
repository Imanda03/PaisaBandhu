import { StyleSheet } from "react-native"
import { useTheme } from "../../../utils/colors"

export const createStyles = () => {
    const { theme } = useTheme()
    return StyleSheet.create({
        root: {
            flex: 1,
            backgroundColor: theme.PURPLE,
            paddingTop: '10%',
            paddingHorizontal: '5%',
        },
        headerText: {
            color: theme.SECONDARY,
            fontSize: 24,
            fontWeight: '700',
            fontFamily: 'Open Sans',
            marginBottom: 20,
        },
        headContainer: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        profileContainer: {
            flexDirection: 'row',
            gap: 10
        },
        profileText: {
            color: theme.SECONDARY, fontSize: 22, fontWeight: '600'
        },
        avatar: {
            backgroundColor: theme.SECONDARY,
            width: 70,
            height: 70,
            borderRadius: 40,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 10,
        },
        avatarText: {
            fontSize: 40,
            color: theme.PURPLE,
            fontWeight: 'bold',
        },
        card: {
            backgroundColor: theme.BACKGROUND,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            paddingVertical: 20,
            paddingHorizontal: 30,
            marginHorizontal: '-5%',
            marginTop: 20,
            flexGrow: 1,
            flex: 1
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: theme.BORDER_COLOR,
        },
        icon: {
            marginRight: 15,
        },
        labelContainer: {
            flex: 1,
        },
        valueText: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.TEXT
        },
        labelText: {
            fontSize: 12,
            color: theme.LIGHT_TEXT
        },
        logoutText: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.TEXT
        },
        switch: {
        }
    });
}
