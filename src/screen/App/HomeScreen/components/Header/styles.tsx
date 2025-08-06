import { StyleSheet } from "react-native"
import { useTheme } from "../../../../../utils/colors"

export const createStyles = () => {

    const { theme } = useTheme()
    return StyleSheet.create({
        container: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        header: {
            fontSize: 20,
            fontWeight: 600,
            color: theme.SECONDARY
        }
    })
}