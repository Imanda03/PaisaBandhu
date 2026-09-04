import React, { useEffect } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import BottomSheet from '../BottomSheet';
import EditableBox from '../core/EditableBox';
import ButtonIconComponent from '../core/ButtonIcon';
import {
  useFetchUserDetails,
  useUpdateProfile,
} from '../../ReactQueryHook/auth.hook';
import { currentUserPayload } from '../../utils/types';
import { useToast } from '../../context/ToastContext';

interface Props {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

const EditInformation: React.FC<Props> = ({ isVisible, setIsVisible }) => {
  const { data, isFetching } = useFetchUserDetails();
  const { mutate: updateProfile, isLoading } = useUpdateProfile();
  const { showToast } = useToast();
  const { control, handleSubmit, reset } = useForm<currentUserPayload>({
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: undefined,
    },
  });

  // Populate form with fetched user data when available
  useEffect(() => {
    if (data) {
      reset({
        fullName: data.fullName || '',
        email: data.email || '',
        phoneNumber: data.phoneNumber || '',
      });
    }
  }, [data, reset]);

  const onSubmit = (formData: any) => {
    updateProfile(formData, {
      onSuccess: response => {
        showToast(response.message, 'success');
        setIsVisible(false);
      },
      onError: error => {
        showToast('Unable to update profile', 'error');
      },
    });
  };

  return (
    <BottomSheet
      isVisible={isVisible}
      onClose={() => setIsVisible(false)}
      title="Edit Your Information"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 10, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, value } }) => (
              <EditableBox label="Name" value={value} onChangeText={onChange} />
            )}
          />

          <Controller
            control={control}
            name="phoneNumber"
            render={({ field: { onChange, value } }) => (
              <EditableBox
                label="Contact"
                value={String(value)}
                onChangeText={onChange}
                keyboardType="phone-pad"
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <EditableBox
                label="Email"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                editable={false}
              />
            )}
          />
          <ButtonIconComponent
            marginTop={14}
            title="Save"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </BottomSheet>
  );
};

export default React.memo(EditInformation);
