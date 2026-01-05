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
    withRepeat,
    withSequence,
    Easing,
    runOnJS,
    interpolate,
} from 'react-native-reanimated';
import { getItem } from '../assets/storage';

const { width, height } = Dimensions.get('window');

const themes: Record<
    'light' | 'dark',
    {
        BACKGROUND: string;
        TEXT: string;
        PRIMARY: string;
        ACCENT: string;
        SECONDARY: string;
        PROGRESS_BG: string;
        PROGRESS_FILL: string;
        STATUS: StatusBarStyle;
    }
> = {
    light: {
        BACKGROUND: '#E3E3E3',
        TEXT: '#1B3C53',
        PRIMARY: '#1B3C53',
        ACCENT: '#234C6A',
        SECONDARY: '#456882',
        PROGRESS_BG: '#D0D0D0',
        PROGRESS_FILL: '#234C6A',
        STATUS: 'dark-content',
    },
    dark: {
        BACKGROUND: '#152532',
        TEXT: '#E3E3E3',
        PRIMARY: '#1B3C53',
        ACCENT: '#234C6A',
        SECONDARY: '#456882',
        PROGRESS_BG: '#1B3C53',
        PROGRESS_FILL: '#456882',
        STATUS: 'light-content',
    },
};

const LoadingScreen = ({ onFinish }: { onFinish?: () => void }) => {
    const [theme, setTheme] = useState(themes.light);
    const [progressText, setProgressText] = useState(0);

    const progress = useSharedValue(0);
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(30);
    const scale = useSharedValue(0.8);
    const logoRotation = useSharedValue(0);
    const pulseScale = useSharedValue(1);
    const shimmer = useSharedValue(0);

    useEffect(() => {
        const loadTheme = async () => {
            const saved = await getItem('theme');
            setTheme(saved === 'dark' ? themes.dark : themes.light);
        };
        loadTheme();

        // Animate fade in and slide up with scale
        opacity.value = withTiming(1, { 
            duration: 1000, 
            easing: Easing.out(Easing.exp) 
        });
        translateY.value = withTiming(0, { 
            duration: 1000, 
            easing: Easing.out(Easing.exp) 
        });
        scale.value = withTiming(1, { 
            duration: 1000, 
            easing: Easing.out(Easing.back(1.2)) 
        });

        // Continuous logo rotation
        logoRotation.value = withRepeat(
            withTiming(360, { 
                duration: 3000, 
                easing: Easing.linear 
            }),
            -1,
            false
        );

        // Pulsing animation
        pulseScale.value = withRepeat(
            withSequence(
                withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            false
        );

        // Shimmer effect
        shimmer.value = withRepeat(
            withTiming(1, { duration: 2000, easing: Easing.linear }),
            -1,
            false
        );

        // Progress animation
        let step = 0;
        const interval = setInterval(() => {
            step += Math.random() * 8 + 2; // Variable speed for more natural feel
            if (step > 100) step = 100;
            progress.value = withTiming(step, { 
                duration: 300,
                easing: Easing.out(Easing.quad)
            });
            runOnJS(setProgressText)(Math.floor(step));
            if (step >= 100) {
                setTimeout(() => {
                    if (onFinish) {
                        runOnJS(onFinish)();
                    }
                }, 500);
                clearInterval(interval);
            }
        }, 150);

        return () => clearInterval(interval);
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [
            { translateY: translateY.value },
            { scale: scale.value }
        ],
    }));

    const logoAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            { rotate: `${logoRotation.value}deg` },
            { scale: pulseScale.value }
        ],
    }));

    const progressAnimatedStyle = useAnimatedStyle(() => ({
        width: `${progress.value}%`,
    }));

    const shimmerAnimatedStyle = useAnimatedStyle(() => {
        const translateX = interpolate(
            shimmer.value,
            [0, 1],
            [-width, width]
        );
        return {
            transform: [{ translateX }],
        };
    });

    return (
        <View style={[styles.container, { backgroundColor: theme.BACKGROUND }]}>
            <StatusBar backgroundColor={theme.BACKGROUND} barStyle={theme.STATUS} />
            
            {/* Animated background circles */}
            <View style={styles.backgroundCircles}>
                <View style={[styles.circle, styles.circle1, { backgroundColor: theme.ACCENT + '15' }]} />
                <View style={[styles.circle, styles.circle2, { backgroundColor: theme.SECONDARY + '10' }]} />
                <View style={[styles.circle, styles.circle3, { backgroundColor: theme.PRIMARY + '08' }]} />
            </View>

            <Animated.View style={[styles.content, animatedStyle]}>
                {/* Logo container with animated icon */}
                <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
                    <View style={[styles.logoCircle, { backgroundColor: theme.ACCENT }]}>
                        <Text style={styles.logoIcon}>💰</Text>
                    </View>
                </Animated.View>

                <Text style={[styles.logo, { color: theme.PRIMARY }]}>PaisaBandhu</Text>
                <Text style={[styles.subtitle, { color: theme.TEXT }]}>
                    Your Financial Companion
                </Text>

                {/* Progress bar container */}
                <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { backgroundColor: theme.PROGRESS_BG }]}>
                        <Animated.View
                            style={[
                                styles.progressFill,
                                { backgroundColor: theme.PROGRESS_FILL },
                                progressAnimatedStyle,
                            ]}
                        >
                            <Animated.View 
                                style={[
                                    styles.shimmer,
                                    shimmerAnimatedStyle,
                                    { backgroundColor: 'rgba(255, 255, 255, 0.3)' }
                                ]} 
                            />
                        </Animated.View>
                    </View>
                    <Text style={[styles.progressText, { color: theme.SECONDARY }]}>
                        {progressText}%
                    </Text>
                </View>

                <Text style={[styles.loadingText, { color: theme.TEXT }]}>
                    {progressText < 30 ? 'Initializing...' : 
                     progressText < 60 ? 'Loading data...' : 
                     progressText < 90 ? 'Almost ready...' : 
                     progressText < 100 ? 'Finalizing...' : 'Ready!'}
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
        position: 'relative',
        overflow: 'hidden',
    },
    backgroundCircles: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    circle: {
        position: 'absolute',
        borderRadius: 1000,
    },
    circle1: {
        width: 300,
        height: 300,
        top: -100,
        right: -100,
    },
    circle2: {
        width: 200,
        height: 200,
        bottom: -50,
        left: -50,
    },
    circle3: {
        width: 150,
        height: 150,
        top: height * 0.3,
        right: width * 0.2,
    },
    content: {
        width: '100%',
        maxWidth: 360,
        alignItems: 'center',
        zIndex: 1,
    },
    logoContainer: {
        marginBottom: 24,
    },
    logoCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 12,
    },
    logoIcon: {
        fontSize: 50,
    },
    logo: {
        fontSize: 42,
        fontWeight: '800',
        marginBottom: 8,
        letterSpacing: 1.5,
    },
    subtitle: {
        fontSize: 17,
        opacity: 0.8,
        textAlign: 'center',
        marginBottom: 40,
        fontWeight: '500',
        letterSpacing: 0.5,
    },
    progressContainer: {
        width: width * 0.75,
        marginBottom: 20,
    },
    progressBar: {
        width: '100%',
        height: 8,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    progressFill: {
        height: '100%',
        borderRadius: 10,
        position: 'relative',
        overflow: 'hidden',
    },
    shimmer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: 50,
    },
    progressText: {
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
        letterSpacing: 1,
    },
    loadingText: {
        fontSize: 15,
        opacity: 0.7,
        fontWeight: '500',
        letterSpacing: 0.5,
    },
});

export default LoadingScreen;
