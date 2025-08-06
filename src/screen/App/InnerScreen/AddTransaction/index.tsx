import React, { useEffect } from 'react';
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
import { useCreateTransaction } from '../../../../ReactQueryHook/transaction.hook';
import { CategoryFormData } from '../../../../utils/types';
import { useFetchFriend } from '../../../../ReactQueryHook/friend.hook';



type FormData = {
    price: string;
    categoryId: string;
    date: Date;
    description: string;
    title: string;
    friendId: string
};

const AddTransaction: React.FC<any> = () => {
    const styles = createStyles();
    const route: any = useRoute();
    const type = route.params?.type
    const bookType: 'single' | 'group' = route.params?.bookType
    const bookId: string = route?.params?.bookId

    const navigation: any = useNavigation()
    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
        reset,
    } = useForm<FormData>();

    const { data: categoriesData, isLoading: isFetchingCategory } = useFetchCategories()
    const { data: friendList, refetch: refetchFriend } = useFetchFriend(bookId)
    const { mutate: createTransaction, isLoading: isCreating } = useCreateTransaction(setError)

    const formReset = {
        price: '',
        categoryId: '',
        date: new Date(),
        description: '',
        title: '',
        friendId: ''
    };

    useEffect(() => {
        reset(formReset);
    }, [type, reset]);


    const onSubmit = (data: FormData) => {
        const submitData = {
            ...data,
            type: type,
            bookId: bookId
        };
        console.log("submit data", submitData)
        createTransaction(submitData, {
            onSuccess: () => {
                navigation.goBack()
            }
        })
    };

    const filteredCategories: any = (categoriesData as CategoryFormData[])?.filter(
        category => category.type === type,
    );

    return (
        <View style={styles.root}>
            <AuthHeader title={`Add ${type === 'income' ? 'Income' : 'Expense'}`} />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
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

                        {bookType === 'group' && <Controller
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
                        />}

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
                            title="Save Transaction"
                            onPress={handleSubmit(onSubmit)}
                            loading={isCreating}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

export default React.memo(AddTransaction);
