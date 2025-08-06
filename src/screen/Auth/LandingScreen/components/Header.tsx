import { View, Text } from 'react-native'
import React from 'react'
import { createStyles } from './styles'
import { useTheme } from '../../../../utils/colors';

const Header = () => {
    const { theme } = useTheme()

    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Expense Mate</Text>
            <Text style={styles.body}>From Chiya to Checkout — Track It All</Text>
        </View>
    )
}

export default Header