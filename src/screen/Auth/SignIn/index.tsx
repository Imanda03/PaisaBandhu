import {
    View,
    Text,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    TextStyle,
} from 'react-native';
import React, { useCallback, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Keyboard } from 'react-native';
import AuthHeader from '../../../components/core/AuthHeader';
import { createStyles } from './styles';
import Input from '../../../components/core/Input';
import ButtonIconComponent from '../../../components/core/ButtonIcon';
import { useToast } from '../../../context/ToastContext';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolate,
    Extrapolate,
    Easing,
    withDelay,
} from 'react-native-reanimated';
import { loginFields } from '../../../utils/fields.helper';
import { useUserLogin } from '../../../ReactQueryHook/auth.hook';
import { LoginData } from '../../../utils/types';



const FormInput = React.memo(({ field, fieldConfig, error }: any) => (
    <Input
        value={field.value}
        onChangeText={field.onChange}
        placeholder={fieldConfig.placeholder}
        secureTextEntry={fieldConfig.secureTextEntry}
        error={error}
    />
));

const SignIn = React.memo(({ navigation }: any) => {
    const styles = createStyles();
    const { showToast } = useToast();


    const keyboardVisible = useSharedValue(0);
    const screenLoaded = useSharedValue(0);

    const {
        control,
        handleSubmit,
        formState: { errors },
        setError
    } = useForm<any>({
        defaultValues: {
            email: '',
            password: '',
        },
    });
    const { mutate, error, isLoading } = useUserLogin(setError)

    useEffect(() => {
        // Animate screen content on mount (fade in + slide up)
        screenLoaded.value = withTiming(1, {
            duration: 400,
            easing: Easing.out(Easing.quad),
        });

        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            keyboardVisible.value = withTiming(1, {
                duration: 300,
                easing: Easing.inOut(Easing.cubic),
            });
        });

        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            keyboardVisible.value = withTiming(0, {
                duration: 300,
                easing: Easing.inOut(Easing.cubic),
            });
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, [keyboardVisible, screenLoaded]);

    // Animate header: padding vertical and slight scale on mount + keyboard
    const animatedHeaderStyle = useAnimatedStyle(() => {
        const padding = interpolate(
            keyboardVisible.value,
            [0, 1],
            [40, 12],
            Extrapolate.CLAMP
        );
        const scale = interpolate(
            screenLoaded.value,
            [0, 1],
            [0.95, 1],
            Extrapolate.CLAMP
        );
        return {
            paddingVertical: withTiming(padding, { duration: 250 }),
            transform: [{ scale: withTiming(scale, { duration: 400 }) }],
        };
    });

    // Animate title text opacity + scale on mount for polish
    const animatedTitleStyle = useAnimatedStyle(() => {
        const opacity = interpolate(screenLoaded.value, [0, 1], [0, 1]);
        const scale = interpolate(screenLoaded.value, [0, 1], [0.9, 1]);
        return {
            opacity: withTiming(opacity, { duration: 400 }),
            transform: [{ scale: withTiming(scale, { duration: 400 }) }],
        };
    });

    // Animate welcome image container: fade, slide up, scale + hide on keyboard open
    const animatedWelcomeStyle = useAnimatedStyle(() => {
        const opacity = interpolate(keyboardVisible.value, [0, 1], [1, 0], Extrapolate.CLAMP);
        const height = interpolate(keyboardVisible.value, [0, 1], [180, 0], Extrapolate.CLAMP);
        const translateY = interpolate(keyboardVisible.value, [0, 1], [0, -20], Extrapolate.CLAMP);
        const scale = interpolate(keyboardVisible.value, [0, 1], [1, 0.95], Extrapolate.CLAMP);

        // Also fade in on screen load
        const fadeInOpacity = interpolate(screenLoaded.value, [0, 1], [0, opacity]);

        return {
            opacity: withTiming(fadeInOpacity, { duration: 300 }),
            height: withTiming(height, { duration: 200 }),
            overflow: 'hidden',
            transform: [{ translateY }, { scale }],
        };
    });

    // Animate login field container: fade + slide up on mount
    const animatedLoginFieldStyle = useAnimatedStyle(() => {
        const opacity = interpolate(screenLoaded.value, [0, 1], [0, 1]);
        const translateY = interpolate(screenLoaded.value, [0, 1], [20, 0]);
        return {
            opacity: withDelay(150, withTiming(opacity, { duration: 400 })),
            transform: [{ translateY: withDelay(150, withTiming(translateY, { duration: 400 })) }],
        };
    });

    // Animate Login button scaling on keyboard open (small scale down)
    const animatedButtonStyle = useAnimatedStyle(() => {
        const scale = interpolate(keyboardVisible.value, [0, 1], [1, 0.95], Extrapolate.CLAMP);
        return {
            transform: [{ scale: withTiming(scale, { duration: 250 }) }],
        };
    });

    const onSubmit = useCallback(
        (data: LoginData) => {
            mutate(data)
        },
        []
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={0}
        >
            <Animated.View style={[styles.header, animatedHeaderStyle]}>
                <AuthHeader title="Login" />
                <Animated.Text style={[styles.title as TextStyle, animatedTitleStyle]}>
                    Track, Save, Succeed – Log In to Own Your Finances!
                </Animated.Text>
            </Animated.View>

            <View style={styles.content}>
                <ScrollView
                    contentContainerStyle={[styles.scrollContent, { paddingBottom: 20 }]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                >
                    <Animated.View style={[styles.welcomeSection, animatedWelcomeStyle]}>
                        <View style={styles.imageContainer}>
                            <View style={styles.shadowContainer} />
                            <Image
                                source={require('../../../assets/Image/login.png')}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        </View>
                    </Animated.View>

                    <Animated.View style={[styles.loginField, animatedLoginFieldStyle]}>
                        <Text style={[styles.loginTitle]}>Login</Text>
                        {loginFields.map((field) => (
                            <Controller
                                key={field.name}
                                control={control}
                                name={field.name}
                                rules={field.rules}
                                render={({ field: fieldProps }) => (
                                    <FormInput
                                        field={fieldProps}
                                        fieldConfig={field}
                                        error={errors[field.name]?.message}
                                    />
                                )}
                            />
                        ))}
                        <Animated.View style={animatedButtonStyle}>
                            <ButtonIconComponent loading={isLoading} marginTop={15} title="Login" onPress={handleSubmit(onSubmit)} />
                        </Animated.View>
                        <View style={styles.forgotPassword}>
                            <TouchableOpacity>
                                <Text style={styles.forgetText}>Forgot Password?</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.replace('SignUp')}>
                                <Text style={styles.forgetText}>Create new account?</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
});

export default SignIn;
