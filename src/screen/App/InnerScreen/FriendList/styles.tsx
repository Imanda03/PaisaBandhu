import { StyleSheet } from "react-native"
import { useTheme } from "../../../../utils/colors"

export const createStyles = () => {
    const { theme } = useTheme()

    return StyleSheet.create({
        root: {
            flex: 1,
            backgroundColor: theme.HEADER_BACKGROUND,
            paddingTop: '10%',
        },
        container: {
            flex: 2,
            backgroundColor: theme.BACKGROUND,
            marginTop: '5%',
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            paddingTop: 20,
            paddingHorizontal: '5%',
        }
    })
}