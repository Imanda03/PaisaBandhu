import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    Keyboard,
    TextStyle,
    KeyboardTypeOptions,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { createStyles } from './styles';
import ButtonIconComponent from '../../../components/core/ButtonIcon';
import Input from '../../../components/core/Input';
import { useToast } from '../../../context/ToastContext';
import AuthHeader from '../../../components/core/AuthHeader';
import { userDataProps } from '../../../utils/types';
import { useUserRegister } from '../../../ReactQueryHook/auth.hook';
import { getFormFields } from '../../../utils/fields.helper';

interface SignUpProps {
    navigation: {
        replace: (screen: string) => void;
    };
}

const SignUp: React.FC<SignUpProps> = ({ navigation }) => {
    const styles = createStyles();
    const { showToast } = useToast();
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);


    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        setError,
    } = useForm<userDataProps>({
        defaultValues: {
            fullName: '',
            email: '',
            phoneNumber: '',
            password: '',
            confirmPassword: '',
        },
    });

    const { mutate: registerUser, isLoading, error } = useUserRegister(setError);

    useEffect(() => {
        const show = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardVisible(true));
        const hide = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardVisible(false));
        return () => {
            show.remove();
            hide.remove();
        };
    }, []);

    const onSubmit: SubmitHandler<userDataProps> = (data: userDataProps): void => {
        registerUser(data)
    };

    const formFields = getFormFields(watch);

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                {!isKeyboardVisible && (
                    <>
                        <AuthHeader title="Register" />
                        <Text style={styles.title as TextStyle}>
                            Create Your Account – Start Your Journey to Smarter Finances!
                        </Text>
                    </>
                )}
            </View>

            <View style={styles.content}>
                <ScrollView
                    contentContainerStyle={[
                        styles.scrollContent,
                        { paddingBottom: isKeyboardVisible ? 20 : 40 },
                    ]}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.loginField}>
                        {formFields.map((field) => (
                            <Controller
                                key={field.name}
                                control={control}
                                name={field.name as keyof userDataProps}
                                rules={field.rules}
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        value={value}
                                        onChangeText={onChange}
                                        placeholder={field.placeholder}
                                        error={errors[field.name as keyof userDataProps]?.message}
                                        secureTextEntry={field.secureTextEntry}
                                        keyboardType={field.keyboardType}
                                    />
                                )}
                            />
                        ))}

                        <ButtonIconComponent
                            marginTop={20}
                            title="Register"
                            onPress={handleSubmit(onSubmit)}
                            loading={isLoading}
                        />
                        <View style={styles.forgotPassword}>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => navigation.replace('SignIn')}
                            >
                                <Text style={styles.forgetText as TextStyle}>
                                    Already have account?
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>

    );
};

export default SignUp;
