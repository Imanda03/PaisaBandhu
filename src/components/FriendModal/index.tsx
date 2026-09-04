import React from 'react';
import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useToast } from '../../context/ToastContext';
import createStyles from './styles';
import BottomSheet from '../BottomSheet';
import { useCreateFriend } from '../../ReactQueryHook/friend.hook';

interface FriendModalProps {
    isVisible: boolean;
    onClose: () => void;
    bookId: string | number;
}

type FormData = {
    name: string;
    email: string;
};

const FriendModal = ({ isVisible, onClose, bookId }: FriendModalProps) => {
    const styles = createStyles();
    const { showToast } = useToast();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            name: '',
            email: '',
        },
    });

    const { mutate: createFriend, isLoading: isCreating } = useCreateFriend();

    const onSubmit = (data: FormData) => {
        createFriend({ ...data, bookId }, {
            onSuccess: () => {
                showToast('Friend added (mock)', 'success');
                onClose();
                reset();
            }
        });
    };

    return (
        <BottomSheet
            isVisible={isVisible}
            onClose={() => {
                onClose();
                reset();
            }}
            title="Add Friend"
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                style={styles.modalContent}
            >
                <Controller
                    control={control}
                    name="name"
                    rules={{ required: 'Full name is required' }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={styles.input}
                            value={value}
                            placeholder="Friend Full Name"
                            placeholderTextColor="gray"
                            maxLength={30}
                            onChangeText={onChange}
                        />
                    )}
                />
                {errors.name && (
                    <Text style={styles.errorText}>{errors.name.message}</Text>
                )}

                <Controller
                    control={control}
                    name="email"
                    rules={{
                        required: 'Email is required',
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Enter a valid email address',
                        },
                    }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={styles.input}
                            value={value}
                            placeholder="Friend Email Address"
                            placeholderTextColor="gray"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            onChangeText={onChange}
                        />
                    )}
                />
                {errors.email && (
                    <Text style={styles.errorText}>{errors.email.message}</Text>
                )}
                <Text style={styles.helperText}>
                    * Email is required to share this with your friend.
                </Text>

                <View style={styles.modalButtonContainer}>
                    <TouchableOpacity
                        style={styles.modalButton}
                        onPress={handleSubmit(onSubmit)}
                        disabled={isCreating}
                    >
                        {isCreating ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.modalButtonText}>Add Friend</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </BottomSheet>
    );
};

export default FriendModal;
