import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    StatusBar,
    StatusBarStyle,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    runOnJS,
} from 'react-native-reanimated';
import { getItem } from '../assets/storage';

const { width } = Dimensions.get('window');

const themes: Record<
    'light' | 'dark',
    {
        BACKGROUND: string;
        TEXT: string;
        PURPLE: string;
        PROGRESS_BG: string;
        PROGRESS_FILL: string;
        STATUS: StatusBarStyle;
    }
> = {
    light: {
        BACKGROUND: '#f9f9f9',
        TEXT: '#1A1A1A',
        PURPLE: '#723FEB',
        PROGRESS_BG: '#e0e0e0',
        PROGRESS_FILL: '#6C4AB6',
        STATUS: 'dark-content',
    },
    dark: {
        BACKGROUND: '#121212',
        TEXT: '#ffffff',
        PURPLE: '#723FEB',
        PROGRESS_BG: '#2e2e2e',
        PROGRESS_FILL: '#9F7AEA',
        STATUS: 'light-content',
    },
};

const LoadingScreen = ({ onFinish }: { onFinish?: () => void }) => {
    const [theme, setTheme] = useState(themes.light);
    const [progressText, setProgressText] = useState(0);

    const progress = useSharedValue(0);
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(20);

    useEffect(() => {
        const loadTheme = async () => {
            const saved = await getItem('theme');
            setTheme(saved === 'dark' ? themes.dark : themes.light);
        };
        loadTheme();

        // Animate fade in and slide up once
        opacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.exp) });
        translateY.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.exp) });

        let step = 0;
        const interval = setInterval(() => {
            step += 10;
            progress.value = withTiming(step, { duration: 200 });
            runOnJS(setProgressText)(step);
            if (step >= 100) {
                if (onFinish) {
                    runOnJS(onFinish)();
                }
                clearInterval(interval);
            }
        }, 200);


        return () => clearInterval(interval);
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    const progressAnimatedStyle = useAnimatedStyle(() => ({
        width: `${progress.value}%`,
    }));

    return (
        <View style={[styles.container, { backgroundColor: theme.BACKGROUND }]}>
            <StatusBar backgroundColor={theme.BACKGROUND} barStyle={theme.STATUS} />
            <Animated.View style={[styles.content, animatedStyle]}>
                <Text style={[styles.logo, { color: theme.PURPLE }]}>Kharcha</Text>
                <Text style={[styles.subtitle, { color: theme.TEXT }]}>
                    Managing your finances...
                </Text>

                <View style={[styles.progressBar, { backgroundColor: theme.PROGRESS_BG }]}>
                    <Animated.View
                        style={[
                            styles.progressFill,
                            { backgroundColor: theme.PROGRESS_FILL },
                            progressAnimatedStyle,
                        ]}
                    />
                </View>

                <Text style={[styles.loadingText, { color: theme.TEXT }]}>
                    {progressText < 100 ? 'Loading...' : 'Ready'}
                </Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    content: {
        width: '100%',
        maxWidth: 360,
        alignItems: 'center',
    },
    logo: {
        fontSize: 38,
        fontWeight: '700',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        opacity: 0.85,
        textAlign: 'center',
        marginBottom: 28,
    },
    progressBar: {
        width: width * 0.65,
        height: 10,
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 16,
    },
    progressFill: {
        height: '100%',
        borderRadius: 5,
    },
    loadingText: {
        fontSize: 14,
        opacity: 0.7,
    },
});

export default LoadingScreen;
