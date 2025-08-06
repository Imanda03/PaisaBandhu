import { View, Text } from 'react-native'
import React from 'react'
import { createStyles } from './styles'
import { getFormattedDate, getGreeting } from '../../../../../utils/helper'

const SecondHeader = () => {
    const styles = createStyles()
    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <Text style={styles.greetText}>Hi  Anish,</Text>
                <Text style={styles.avatar}>A</Text>
            </View>
            <Text style={styles.dateText}>{getFormattedDate()}</Text>
        </View>
    )
}

export default SecondHeader