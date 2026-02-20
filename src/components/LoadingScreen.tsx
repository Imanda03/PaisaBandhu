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
import LinearGradient from 'react-native-linear-gradient';
import { getItem } from '../assets/storage';

const { width, height } = Dimensions.get('window');

// Luxe Charcoal + Brushed Gold - matches app theme
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
        BACKGROUND: '#F8F9FA',
        TEXT: '#1A1A1E',
        PRIMARY: '#1E1E24',
        ACCENT: '#1E1E24',
        SECONDARY: '#C6A56B',
        PROGRESS_BG: '#E8EAED',
        PROGRESS_FILL: '#C6A56B',
        STATUS: 'dark-content',
    },
    dark: {
        BACKGROUND: '#1E1E24',
        TEXT: '#F7F7F8',
        PRIMARY: '#1E1E24',
        ACCENT: '#2A2A30',
        SECONDARY: '#C6A56B',
        PROGRESS_BG: '#2A2A30',
        PROGRESS_FILL: '#C6A56B',
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
    const gradientRotation = useSharedValue(0);
    const particle1 = useSharedValue(0);
    const particle2 = useSharedValue(0);
    const particle3 = useSharedValue(0);
    const glowOpacity = useSharedValue(0.3);

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

        // Gradient rotation animation
        gradientRotation.value = withRepeat(
            withTiming(360, { duration: 8000, easing: Easing.linear }),
            -1,
            false
        );

        // Floating particles animation
        particle1.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            false
        );
        particle2.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            false
        );
        particle3.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 3500, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration: 3500, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            false
        );

        // Glow pulsing effect
        glowOpacity.value = withRepeat(
            withSequence(
                withTiming(0.6, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
                withTiming(0.3, { duration: 1500, easing: Easing.inOut(Easing.ease) })
            ),
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

    const gradientAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${gradientRotation.value}deg` }],
    }));

    const particle1Style = useAnimatedStyle(() => {
        const translateY = interpolate(particle1.value, [0, 1], [0, -30]);
        const opacity = interpolate(particle1.value, [0, 0.5, 1], [0.3, 0.8, 0.3]);
        return {
            transform: [{ translateY }],
            opacity,
        };
    });

    const particle2Style = useAnimatedStyle(() => {
        const translateY = interpolate(particle2.value, [0, 1], [0, -40]);
        const opacity = interpolate(particle2.value, [0, 0.5, 1], [0.2, 0.7, 0.2]);
        return {
            transform: [{ translateY }],
            opacity,
        };
    });

    const particle3Style = useAnimatedStyle(() => {
        const translateY = interpolate(particle3.value, [0, 1], [0, -35]);
        const opacity = interpolate(particle3.value, [0, 0.5, 1], [0.25, 0.75, 0.25]);
        return {
            transform: [{ translateY }],
            opacity,
        };
    });

    const glowAnimatedStyle = useAnimatedStyle(() => ({
        opacity: glowOpacity.value,
    }));

    const isDark = theme.BACKGROUND === themes.dark.BACKGROUND;
    const gradientColors = isDark
        ? ['#1E1E24', '#2A2A30', '#1E1E24']
        : ['#F8F9FA', '#FFFFFF', '#F8F9FA'];
    const accentGradient = ['#C6A56B', '#D4B87A', '#C6A56B'];
    const progressGradient = ['#C6A56B', '#E8D4A8', '#C6A56B'];

    return (
        <View style={[styles.container, { backgroundColor: theme.BACKGROUND }]}>
            <StatusBar backgroundColor={theme.BACKGROUND} barStyle={theme.STATUS} />
            
            {/* Animated gradient background */}
            <Animated.View style={[styles.gradientBackground, gradientAnimatedStyle]}>
                <LinearGradient
                    colors={gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                />
            </Animated.View>

            {/* Animated background circles with gradients */}
            <View style={styles.backgroundCircles}>
                <LinearGradient
                    colors={[theme.SECONDARY + '20', theme.SECONDARY + '05', 'transparent']}
                    style={[styles.circle, styles.circle1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />
                <LinearGradient
                    colors={[theme.ACCENT + '15', theme.ACCENT + '05', 'transparent']}
                    style={[styles.circle, styles.circle2]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />
                <LinearGradient
                    colors={[theme.PRIMARY + '10', theme.PRIMARY + '03', 'transparent']}
                    style={[styles.circle, styles.circle3]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />
            </View>

            {/* Floating particles */}
            <Animated.View style={[styles.particle, styles.particle1, particle1Style]}>
                <View style={[styles.particleDot, { backgroundColor: theme.SECONDARY }]} />
            </Animated.View>
            <Animated.View style={[styles.particle, styles.particle2, particle2Style]}>
                <View style={[styles.particleDot, { backgroundColor: theme.SECONDARY }]} />
            </Animated.View>
            <Animated.View style={[styles.particle, styles.particle3, particle3Style]}>
                <View style={[styles.particleDot, { backgroundColor: theme.SECONDARY }]} />
            </Animated.View>

            <Animated.View style={[styles.content, animatedStyle]}>
                {/* Logo container with animated icon and glow */}
                <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
                    {/* Glow effect */}
                    <Animated.View style={[styles.logoGlow, glowAnimatedStyle]}>
                        <LinearGradient
                            colors={[theme.SECONDARY + '40', theme.SECONDARY + '10', 'transparent']}
                            style={styles.logoGlowGradient}
                        />
                    </Animated.View>
                    
                    {/* Logo circle with gradient */}
                    <LinearGradient
                        colors={accentGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.logoCircle}
                    >
                        <View style={styles.logoInner}>
                            <Text style={styles.logoIcon}>💰</Text>
                        </View>
                    </LinearGradient>
                </Animated.View>

                <Text style={[styles.logo, { color: theme.PRIMARY }]}>Kharcha Split</Text>
                <Text style={[styles.subtitle, { color: theme.TEXT }]}>
                    Your Financial Companion
                </Text>

                {/* Progress bar container */}
                <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { backgroundColor: theme.PROGRESS_BG }]}>
                        <Animated.View
                            style={[
                                styles.progressFill,
                                progressAnimatedStyle,
                            ]}
                        >
                            <LinearGradient
                                colors={progressGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={StyleSheet.absoluteFill}
                            />
                            <Animated.View 
                                style={[
                                    styles.shimmer,
                                    shimmerAnimatedStyle,
                                    { backgroundColor: 'rgba(255, 255, 255, 0.4)' }
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
        paddingHorizontal: 32,
        position: 'relative',
        overflow: 'hidden',
    },
    gradientBackground: {
        position: 'absolute',
        width: width * 2,
        height: height * 2,
        top: -height / 2,
        left: -width / 2,
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
        width: 400,
        height: 400,
        top: -150,
        right: -150,
    },
    circle2: {
        width: 280,
        height: 280,
        bottom: -80,
        left: -80,
    },
    circle3: {
        width: 200,
        height: 200,
        top: height * 0.25,
        right: width * 0.15,
    },
    particle: {
        position: 'absolute',
        zIndex: 2,
    },
    particle1: {
        top: height * 0.2,
        left: width * 0.15,
    },
    particle2: {
        top: height * 0.7,
        right: width * 0.2,
    },
    particle3: {
        top: height * 0.45,
        left: width * 0.7,
    },
    particleDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        opacity: 0.6,
    },
    content: {
        width: '100%',
        maxWidth: 380,
        alignItems: 'center',
        zIndex: 10,
    },
    logoContainer: {
        marginBottom: 36,
        position: 'relative',
    },
    logoGlow: {
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 70,
        top: -14,
        left: -14,
        zIndex: 0,
    },
    logoGlowGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 70,
    },
    logoCircle: {
        width: 112,
        height: 112,
        borderRadius: 56,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#C6A56B',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 16,
        zIndex: 1,
    },
    logoInner: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoIcon: {
        fontSize: 60,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    logo: {
        fontSize: 48,
        fontWeight: '800',
        marginBottom: 14,
        letterSpacing: 2,
        textShadowColor: 'rgba(0, 0, 0, 0.05)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    subtitle: {
        fontSize: 19,
        opacity: 0.9,
        textAlign: 'center',
        marginBottom: 52,
        fontWeight: '500',
        letterSpacing: 0.8,
    },
    progressContainer: {
        width: width * 0.78,
        marginBottom: 28,
    },
    progressBar: {
        width: '100%',
        height: 12,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 18,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 6,
    },
    progressFill: {
        height: '100%',
        borderRadius: 16,
        position: 'relative',
        overflow: 'hidden',
    },
    shimmer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: 80,
    },
    progressText: {
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        letterSpacing: 1.5,
        marginTop: 4,
    },
    loadingText: {
        fontSize: 17,
        opacity: 0.85,
        fontWeight: '500',
        letterSpacing: 0.8,
        marginTop: 8,
    },
});

export default LoadingScreen;
