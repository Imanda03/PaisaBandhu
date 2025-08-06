import { StyleSheet } from "react-native"
import { useTheme } from "../../../../../utils/colors"

export const createStyles = () => {

    const { theme } = useTheme()
    return StyleSheet.create({
        container: {
            backgroundColor: theme.LIGHT_PURPLE,
            marginVertical: '4%',
            padding: '5%',
            borderRadius: 10
        },
        innerContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        greetText: {
            fontSize: 24,
            fontWeight: 600,
            color: theme.SECONDARY,
            lineHeight: 32
        },
        dateText: {
            fontSize: 18,
            marginTop: 5,
            fontWeight: 400,
            color: theme.SECONDARY,
            lineHeight: 32
        },
        avatar: {
            backgroundColor: theme.SECONDARY,
            height: 36,
            width: 36,
            borderRadius: 36,
            textAlign: 'center',
            justifyContent: 'center',
            fontSize: 30,
            fontWeight: 600
        }
    })
}