import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { createStyles } from './styles'
import { AntDesignIcon, EntypoIcon } from '../../../../../utils/Icons'
import { useTheme } from '../../../../../utils/colors'

const Header = () => {
    const styles = createStyles();

    const { theme, isDark, setTheme } = useTheme()
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Expense Mate</Text>
            <TouchableOpacity onPress={() =>
                setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
            }>
                <EntypoIcon name={isDark ? 'light-up' : 'light-down'} size={isDark ? 26 : 36} color={theme.SECONDARY} />
            </TouchableOpacity>
        </View>
    )
}

export default Header