import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '../../../utils/colors';
import ButtonIconComponent from '../../../components/core/ButtonIcon';
import Header from './components/Header';
import { createStyles } from './styles';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    Easing,
} from 'react-native-reanimated';

const LandingScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    // Animation values
    const imageOpacity = useSharedValue(0);
    const imageTranslateY = useSharedValue(-40);

    const textScale = useSharedValue(0.8);
    const textOpacity = useSharedValue(0);

    const descOpacity = useSharedValue(0);
    const descTranslateY = useSharedValue(20);

    const buttonTranslateY = useSharedValue(40);
    const buttonOpacity = useSharedValue(0);

    useEffect(() => {
        imageOpacity.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.exp) });
        imageTranslateY.value = withTiming(0, { duration: 700, easing: Easing.out(Easing.exp) });


        textScale.value = withDelay(
            400,
            withTiming(1, { duration: 500, easing: Easing.out(Easing.exp) })
        );
        textOpacity.value = withDelay(
            400,
            withTiming(1, { duration: 500, easing: Easing.out(Easing.exp) })
        );

        // Description fade and slide up after text
        descOpacity.value = withDelay(
            900,
            withTiming(1, { duration: 500, easing: Easing.out(Easing.exp) })
        );
        descTranslateY.value = withDelay(
            900,
            withTiming(0, { duration: 500, easing: Easing.out(Easing.exp) })
        );

        // Buttons fade and slide up last
        buttonOpacity.value = withDelay(
            1300,
            withTiming(1, { duration: 500, easing: Easing.out(Easing.exp) })
        );
        buttonTranslateY.value = withDelay(
            1300,
            withTiming(0, { duration: 500, easing: Easing.out(Easing.exp) })
        );
    }, []);

    const animatedImageStyle = useAnimatedStyle(() => ({
        opacity: imageOpacity.value,
        transform: [{ translateY: imageTranslateY.value }],
    }));

    const animatedTextStyle = useAnimatedStyle(() => ({
        opacity: textOpacity.value,
        transform: [{ scale: textScale.value }],
    }));

    const animatedDescStyle = useAnimatedStyle(() => ({
        opacity: descOpacity.value,
        transform: [{ translateY: descTranslateY.value }],
    }));

    const animatedButtonStyle = useAnimatedStyle(() => ({
        opacity: buttonOpacity.value,
        transform: [{ translateY: buttonTranslateY.value }],
    }));

    return (
        <View style={styles.root}>
            <Header />
            <View style={styles.body}>
                <ScrollView
                    contentContainerStyle={styles.bodyContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Animated.Image
                        source={require('../../../assets/Image/splashbg.png')}
                        style={[styles.image, animatedImageStyle]}
                        resizeMode="contain"
                    />

                    <Animated.View style={[styles.textContainer, animatedTextStyle]}>
                        <Text style={styles.text}>Take Control </Text>
                        <Text style={styles.text}>of Your</Text>
                    </Animated.View>

                    <Text style={[styles.text, { alignSelf: 'center' }]}>Finance Today</Text>

                    <Animated.Text style={[styles.textDescription, animatedDescStyle]}>
                        From chai to checkout, track every expense effortlessly.
                        Manage your personal and group finances, split bills, and save smarter —
                        all in one easy-to-use app designed for your everyday needs.
                    </Animated.Text>

                    <Animated.View style={[styles.ButtonContainer, animatedButtonStyle]}>
                        <ButtonIconComponent
                            title="Login"
                            onPress={() => navigation.navigate('SignIn')}
                            iconName="login"
                        />
                        <ButtonIconComponent
                            title="Register"
                            onPress={() => navigation.navigate('SignUp')}
                            iconName="arrow-with-circle-right"
                        />
                    </Animated.View>
                </ScrollView>
            </View>
        </View>
    );
};

export default LandingScreen;
