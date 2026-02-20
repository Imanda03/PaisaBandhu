import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring
} from 'react-native-reanimated'
import { createStyles } from './styles'
import { EntypoIcon } from '../../../../../utils/Icons'
import { useTheme } from '../../../../../utils/colors'

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const Header = () => {
    const styles = createStyles();
    const { theme, isDark, setTheme } = useTheme()
    
    const scale = useSharedValue(1);
    
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePress = () => {
        scale.value = withSpring(0.9, { damping: 10 }, () => {
            scale.value = withSpring(1);
        });
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Kharcha Mate</Text>
            <View style={styles.rightActions}>
                <AnimatedTouchable 
                    onPress={handlePress}
                    style={[styles.themeButton, animatedStyle]}
                    activeOpacity={0.8}
                >
                    <EntypoIcon 
                        name={isDark ? 'light-up' : 'light-down'} 
                        size={24} 
                        color={theme.SECONDARY} 
                    />
                </AnimatedTouchable>
            </View>
        </View>
    )
}

export default Header