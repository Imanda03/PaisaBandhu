import React, { useCallback, useEffect, useMemo } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { createStyles } from './styles';
import { useQuery, useQueryClient } from 'react-query';
import { useToast } from '../../../../context/ToastContext';
import InputComponent from '../../../../components/core/Input';
import InputNumber from '../../../../components/core/InputNumber';
import Select from '../../../../components/core/Select';
import DatePicker from '../../../../components/core/DatePicker';
import TextArea from '../../../../components/core/TextArea';
import ButtonIconComponent from '../../../../components/core/ButtonIcon';
import AuthHeader from '../../../../components/core/AuthHeader';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFetchCategories } from '../../../../ReactQueryHook/category.hook';
import { useCreateTransaction, useUpdateTransaction } from '../../../../ReactQueryHook/transaction.hook';
import { CategoryFormData } from '../../../../utils/types';
import { useFetchFriend } from '../../../../ReactQueryHook/friend.hook';

type FormData = {
  price: string;
  categoryId: string;
  date: Date;
  description: string;
  title: string;
  friendId: string;
};

const AddTransaction: React.FC<any> = () => {
  const styles = createStyles();
  const route: any = useRoute();
  const type = route.params?.type;
  const bookType: 'single' | 'group' = route.params?.bookType;
  const bookId: string = route?.params?.bookId;
  const transactionId = route.params?.transactionId;
  const transaction = route.params?.transaction;
  const isEditMode = !!transactionId && !!transaction;

  const navigation: any = useNavigation();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<FormData>();

  const { data: categoriesData, isLoading: isFetchingCategory } =
    useFetchCategories();
  const { data: friendList, refetch: refetchFriend } = useFetchFriend(bookId);
  const { mutate: createTransaction, isLoading: isCreating } =
    useCreateTransaction(setError);
  const { mutate: updateTransaction, isLoading: isUpdating } =
    useUpdateTransaction(setError);

  const formReset = {
    price: '',
    categoryId: '',
    date: new Date(),
    description: '',
    title: '',
    friendId: '',
  };

  useEffect(() => {
    if (isEditMode && transaction) {
      reset({
        title: transaction.title || '',
        price: transaction.price?.toString() || transaction.amount?.toString() || '',
        categoryId: transaction.categoryId?._id || transaction.categoryId?.id || transaction.categoryId || '',
        date: transaction.date ? new Date(transaction.date) : new Date(),
        description: transaction.description || transaction.title || '',
        friendId: transaction.friendId?._id || transaction.friendId?.id || transaction.friendId || '',
      });
    } else {
      reset(formReset);
    }
  }, [type, reset, isEditMode, transaction]);

  const onSubmit = useCallback((data: FormData) => {
    if (isEditMode && transactionId) {
      updateTransaction(
        {
          id: transactionId,
          data: {
            ...data,
            type,
            bookId,
            price: data.price,
            categoryId: data.categoryId,
            date: data.date?.toISOString?.() || new Date().toISOString(),
            title: data.title,
            description: data.description,
            friendId: data.friendId || undefined,
          } as any,
        },
        { onSuccess: () => navigation.goBack() },
      );
    } else {
      createTransaction(
        { ...data, type, bookId },
        { onSuccess: () => navigation.goBack() },
      );
    }
  }, [createTransaction, updateTransaction, type, bookId, navigation, isEditMode, transactionId]);

  const filteredCategories:any = useMemo(() =>
    (categoriesData as CategoryFormData[])?.filter(category => category.type === type) || [],
    [categoriesData, type],
  );

  return (
    <View style={styles.root}>
      <AuthHeader title={isEditMode ? `Edit ${type === 'income' ? 'Income' : 'Expense'}` : `Add ${type === 'income' ? 'Income' : 'Expense'}`} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.innerContainer}>
          <View>
            <Controller
              control={control}
              name="title"
              rules={{
                required: 'Title is required',
              }}
              render={({ field: { onChange, value } }) => (
                <InputComponent
                  value={value}
                  onChangeText={onChange}
                  error={errors.title?.message}
                  placeholder={`Add title`}
                />
              )}
            />
            <Controller
              control={control}
              name="price"
              rules={{
                required: 'Amount is required',
                pattern: {
                  value: /^\d+(\.\d{0,2})?$/,
                  message: 'Please enter a valid amount',
                },
              }}
              render={({ field: { onChange, value } }) => (
                <InputNumber
                  value={value}
                  onChangeText={onChange}
                  error={errors.price?.message}
                  placeholder={`Enter ${type} amount`}
                />
              )}
            />

            <Controller
              control={control}
              name="categoryId"
              rules={{ required: 'Category is required' }}
              render={({ field: { onChange, value } }) => (
                <Select
                  value={value}
                  onPress={onChange}
                  error={errors.categoryId?.message}
                  placeholder={`Select ${type} category`}
                  options={filteredCategories}
                  type={type}
                  bookId={bookId}
                />
              )}
            />

            {bookType === 'group' && (
              <Controller
                control={control}
                name="friendId"
                rules={{ required: 'Friend is required' }}
                render={({ field: { onChange, value } }) => (
                  <Select
                    value={value}
                    onPress={onChange}
                    error={errors.friendId?.message}
                    placeholder={`Select friend`}
                    options={friendList}
                    isFriend={true}
                    bookId={bookId}
                  />
                )}
              />
            )}

            <Controller
              control={control}
              name="date"
              rules={{ required: 'Date is required' }}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  value={value}
                  onChanged={onChange}
                  error={errors.date?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="description"
              rules={{ required: 'Note is required' }}
              render={({ field: { onChange, value } }) => (
                <TextArea
                  value={value}
                  onChangeText={onChange}
                  placeholder="Add a note"
                  error={errors.description?.message}
                />
              )}
            />
          </View>

          <View style={styles.buttonWrapper}>
            <ButtonIconComponent
              title={isEditMode ? 'Update Transaction' : 'Save Transaction'}
              onPress={handleSubmit(onSubmit)}
              loading={isCreating || isUpdating}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default React.memo(AddTransaction);
