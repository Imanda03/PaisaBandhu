import React, { useCallback, useEffect, useMemo } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { createStyles } from './styles';
import InputComponent from '../../../../components/core/Input';
import Select from '../../../../components/core/Select';
import DatePicker from '../../../../components/core/DatePicker';
import TextArea from '../../../../components/core/TextArea';
import AuthHeader from '../../../../components/core/AuthHeader';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFetchCategories } from '../../../../ReactQueryHook/category.hook';
import { useCreateTransaction, useUpdateTransaction } from '../../../../ReactQueryHook/transaction.hook';
import { CategoryFormData } from '../../../../utils/types';
import { useFetchFriend } from '../../../../ReactQueryHook/friend.hook';
import { useTheme } from '../../../../utils/colors';
import { MaterialIcons } from '../../../../utils/Icons';

type FormData = {
  price: string;
  categoryId: string;
  date: Date;
  description: string;
  title: string;
  friendId: string;
};

const rimMetallic = (isDark: boolean) =>
  isDark
    ? ['#4A4438', '#2E2E32', '#C6A56B', '#2E2E32', '#4A4438']
    : ['#D8CAB0', '#FFFFFF', '#C6A56B', '#FFFFFF', '#D8CAB0'];

const goldCTA = ['#F2E6D2', '#E8CF9E', '#C6A56B', '#A8894F'] as const;

type SectionStyles = ReturnType<typeof createStyles>;

const TransactionFormSection: React.FC<{
  isDark: boolean;
  styles: SectionStyles;
  children: React.ReactNode;
}> = ({ isDark, styles, children }) => (
  <LinearGradient
    colors={rimMetallic(isDark)}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.section}
  >
    <View style={styles.sectionInner}>{children}</View>
  </LinearGradient>
);

const AddTransaction: React.FC<any> = () => {
  const insets = useSafeAreaInsets();
  const styles = createStyles();
  const { theme, isDark } = useTheme();
  const route: any = useRoute();
  const type = route.params?.type;
  const isIncome = type === 'income';
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

  const { data: categoriesData } = useFetchCategories();
  const { data: friendList } = useFetchFriend(bookId);
  const { mutate: createTransaction, isLoading: isCreating } =
    useCreateTransaction(setError);
  const { mutate: updateTransaction, isLoading: isUpdating } =
    useUpdateTransaction(setError);

  const formReset = useMemo(
    () => ({
      price: '',
      categoryId: '',
      date: new Date(),
      description: '',
      title: '',
      friendId: '',
    }),
    [],
  );

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
  }, [type, reset, isEditMode, transaction, formReset]);

  const onSubmit = useCallback(
    (data: FormData) => {
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
    },
    [
      createTransaction,
      updateTransaction,
      type,
      bookId,
      navigation,
      isEditMode,
      transactionId,
    ],
  );

  const filteredCategories: any = useMemo(
    () =>
      (categoriesData as CategoryFormData[])?.filter(
        category => category.type === type,
      ) || [],
    [categoriesData, type],
  );

  const heroFaceColors = useMemo(
    () =>
      isIncome
        ? isDark
          ? ['#152820', '#1e2228']
          : ['#E8F5EC', '#FFFFFF']
        : isDark
          ? ['#281018', '#1e2228']
          : ['#FCEFF1', '#FFFFFF'],
    [isIncome, isDark],
  );

  const heroAccentColors = useMemo(
    () =>
      isIncome
        ? isDark
          ? ['#1b4332', '#52b788']
          : ['#40916c', '#95d5b2']
        : isDark
          ? ['#6a040f', '#e01e37']
          : ['#e11d48', '#fda4af'],
    [isIncome, isDark],
  );

  const chipText = isIncome ? 'INCOME' : 'EXPENSE';
  const heroSubtitle = isIncome
    ? 'Record money coming in — salary, refunds, gifts, and more.'
    : 'Record spending — bills, purchases, and everyday costs.';

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
      >
        <View style={[styles.topSafe, { paddingTop: insets.top }]}>
          <AuthHeader
            title={
              isEditMode
                ? `Edit ${isIncome ? 'Income' : 'Expense'}`
                : `Add ${isIncome ? 'Income' : 'Expense'}`
            }
          />
        </View>
        <ScrollView
          style={styles.sheet}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.sheetHandleWrap}>
            <View style={styles.sheetHandle} />
          </View>

          <View style={styles.innerContainer}>
            <LinearGradient
              colors={rimMetallic(isDark)}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroCard}
            >
              <LinearGradient
                colors={heroFaceColors}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.heroInner}
              >
                <LinearGradient
                  colors={heroAccentColors}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.heroAccentBar}
                />
                <View style={styles.heroBody}>
                  <View style={styles.heroTopRow}>
                    <LinearGradient
                      colors={['#F0E0C4', '#C6A56B', '#A8894F']}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={styles.typeChip}
                    >
                      <Text
                        style={[
                          styles.typeChipText,
                          { color: theme.NAVBAR_ACTIVE_TEXT },
                        ]}
                      >
                        {chipText}
                      </Text>
                    </LinearGradient>
                  </View>
                  <Text style={styles.heroTitle}>
                    {isEditMode ? 'Update entry' : 'New entry'}
                  </Text>
                  <Text style={styles.heroSubtitle}>{heroSubtitle}</Text>
                  <Text style={styles.amountLabel}>Amount</Text>
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
                      <View>
                        <View style={styles.amountFieldRow}>
                          <Text style={styles.amountRupeePrefix}>₹</Text>
                          <TextInput
                            style={styles.amountTextInput}
                            value={value}
                            onChangeText={text => {
                              let t = text.replace(/[^0-9.]/g, '');
                              const dot = t.indexOf('.');
                              if (dot !== -1) {
                                t =
                                  t.slice(0, dot + 1) +
                                  t.slice(dot + 1).replace(/\./g, '');
                                const [intPart, dec = ''] = t.split('.');
                                t =
                                  intPart +
                                  (t.includes('.')
                                    ? '.' + dec.replace(/\D/g, '').slice(0, 2)
                                    : '');
                              }
                              onChange(t);
                            }}
                            placeholder="0.00"
                            placeholderTextColor={theme.PLACEHOLDER_COLOR}
                            keyboardType="decimal-pad"
                            returnKeyType="done"
                          />
                        </View>
                        {errors.price?.message ? (
                          <Text style={styles.amountErrorText}>
                            {errors.price.message}
                          </Text>
                        ) : null}
                      </View>
                    )}
                  />
                </View>
              </LinearGradient>
            </LinearGradient>

            <TransactionFormSection isDark={isDark} styles={styles}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionIconWrap}>
                  <MaterialIcons
                    name="edit-note"
                    size={20}
                    color={theme.SECONDARY}
                  />
                </View>
                <Text style={styles.sectionLabel}>Details</Text>
                <Text style={styles.sectionHint}>Required</Text>
              </View>
              <View style={styles.fieldGap}>
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
                      placeholder="What was this for?"
                    />
                  )}
                />
              </View>
            </TransactionFormSection>

            <TransactionFormSection isDark={isDark} styles={styles}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionIconWrap}>
                  <MaterialIcons
                    name="category"
                    size={20}
                    color={theme.SECONDARY}
                  />
                </View>
                <Text style={styles.sectionLabel}>Category & date</Text>
              </View>
              <View style={styles.fieldGap}>
                <Controller
                  control={control}
                  name="categoryId"
                  rules={{ required: 'Category is required' }}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      value={value}
                      onPress={onChange}
                      error={errors.categoryId?.message}
                      placeholder={`Choose ${type} category`}
                      options={filteredCategories}
                      type={type}
                      bookId={bookId}
                    />
                  )}
                />
              </View>

              {bookType === 'group' && (
                <View style={styles.fieldGap}>
                  <Controller
                    control={control}
                    name="friendId"
                    rules={{ required: 'Friend is required' }}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        value={value}
                        onPress={onChange}
                        error={errors.friendId?.message}
                        placeholder="Who is this for?"
                        options={friendList}
                        isFriend={true}
                        bookId={bookId}
                      />
                    )}
                  />
                </View>
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
            </TransactionFormSection>

            <TransactionFormSection isDark={isDark} styles={styles}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionIconWrap}>
                  <MaterialIcons
                    name="sticky-note-2"
                    size={20}
                    color={theme.SECONDARY}
                  />
                </View>
                <Text style={styles.sectionLabel}>Note</Text>
                <Text style={styles.sectionHint}>Required</Text>
              </View>
              <Controller
                control={control}
                name="description"
                rules={{ required: 'Note is required' }}
                render={({ field: { onChange, value } }) => (
                  <TextArea
                    value={value}
                    onChangeText={onChange}
                    placeholder="Add context — merchant, split details, or reminders."
                    error={errors.description?.message}
                  />
                )}
              />
            </TransactionFormSection>
          </View>

          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              style={[
                styles.primaryCta,
                (isCreating || isUpdating) && styles.primaryCtaDisabled,
              ]}
              activeOpacity={0.92}
              onPress={handleSubmit(onSubmit)}
              disabled={isCreating || isUpdating}
            >
              <LinearGradient
                colors={[...goldCTA]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryCtaInner}
              >
                {isCreating || isUpdating ? (
                  <ActivityIndicator color={theme.NAVBAR_ACTIVE_TEXT} />
                ) : (
                  <Text style={styles.primaryCtaText}>
                    {isEditMode ? 'Save changes' : 'Save transaction'}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default React.memo(AddTransaction);
