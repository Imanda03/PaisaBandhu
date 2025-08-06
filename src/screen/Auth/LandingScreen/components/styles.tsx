import { StyleSheet } from "react-native"
import { ThemeColors, useTheme } from "../../../../utils/colors"

export const createStyles = (theme: ThemeColors) => {

    return StyleSheet.create({
        container: {
            backgroundColor: theme.PURPLE,
            height: '18%',
            padding: '10%',
        },
        heading: {
            color: theme.SECONDARY,
            marginTop: '8%',
            textAlign: 'center',
            fontSize: 32,
            fontWeight: 600
        },
        body: {
            color: theme.SECONDARY,
            textAlign: 'center',
            marginTop: '2%'
        }
    })
}