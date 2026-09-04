import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Controller, useForm } from 'react-hook-form';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AuthHeader from '../../../components/core/AuthHeader';
import InputComponent from '../../../components/core/Input';
import DatePicker from '../../../components/core/DatePicker';
import TextArea from '../../../components/core/TextArea';
import SuccessOverlay, { SuccessOverlayRef } from '../../../components/SuccessOverlay';
import { useCreateLending, useLending, useUpdateLending } from '../../../ReactQueryHook/lending.hook';
import { useTheme } from '../../../utils/colors';
import { MaterialIcons } from '../../../utils/Icons';
import { LendingType } from '../../../services/LendingService';
import { CURRENCY_SYMBOL } from '../../../utils/currency';
import { createStyles } from './styles';

type FormData = {
  personName: string;
  amount: string;
  date: Date;
  dueDate?: Date;
  personContact: string;
  description: string;
};

const rimMetallic = (isDark: boolean) =>
  isDark
    ? ['#4A4438', '#2E2E32', '#C6A56B', '#2E2E32', '#4A4438']
    : ['#D8CAB0', '#FFFFFF', '#C6A56B', '#FFFFFF', '#D8CAB0'];

const goldCTA = ['#F2E6D2', '#E8CF9E', '#C6A56B', '#A8894F'] as const;

type SectionStyles = ReturnType<typeof createStyles>;

const LendingFormSection: React.FC<{
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

const AddLendingScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const styles = createStyles();
  const { theme, isDark } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const editId = (route.params as { id?: string } | undefined)?.id;
  const isEditMode = !!editId;

  const [type, setType] = useState<LendingType>('lent');
  const overlayRef = useRef<SuccessOverlayRef>(null);
  const { mutate: createLending, isLoading: isCreating } = useCreateLending();
  const { mutate: updateLending, isLoading: isUpdating } = useUpdateLending(editId ?? '');
  const { data: existingLending, isLoading: loadingExisting } = useLending(editId);
  const isLoading = isCreating || isUpdating;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      personName: '',
      amount: '',
      date: new Date(),
      personContact: '',
      description: '',
    },
  });

  useEffect(() => {
    if (!isEditMode || !existingLending) return;
    setType(existingLending.type);
    reset({
      personName: existingLending.personName,
      amount: String(existingLending.amount),
      date: new Date(existingLending.date),
      dueDate: existingLending.dueDate
        ? new Date(existingLending.dueDate)
        : undefined,
      personContact: existingLending.personContact ?? '',
      description: existingLending.description ?? '',
    });
  }, [isEditMode, existingLending, reset]);

  const isLent = type === 'lent';

  const heroFaceColors = useMemo(
    () =>
      isLent
        ? isDark
          ? ['#152820', '#1e2228']
          : ['#E8F5EC', '#FFFFFF']
        : isDark
          ? ['#281018', '#1e2228']
          : ['#FCEFF1', '#FFFFFF'],
    [isLent, isDark],
  );

  const heroAccentColors = useMemo(
    () =>
      isLent
        ? isDark
          ? ['#1b4332', '#52b788']
          : ['#40916c', '#95d5b2']
        : isDark
          ? ['#6a040f', '#e01e37']
          : ['#e11d48', '#fda4af'],
    [isLent, isDark],
  );

  const chipText = isLent ? 'LENT' : 'BORROWED';
  const heroTitle = isEditMode ? 'Edit lending entry' : 'New lending entry';
  const heroSubtitle = isEditMode
    ? 'Update person, amount, dates, or notes for this record.'
    : isLent
      ? 'Record money you gave someone — track when they pay you back.'
      : 'Record money you took — track repayments until settled.';

  const onSubmit = (data: FormData) => {
    const payload = {
      type,
      personName: data.personName,
      amount: Number(data.amount),
      date: data.date,
      dueDate: data.dueDate,
      personContact: data.personContact || undefined,
      description: data.description || undefined,
    };

    const onSuccess = () => {
      overlayRef.current?.show(() => navigation.goBack());
    };

    if (isEditMode) {
      updateLending(payload, { onSuccess });
    } else {
      createLending(payload, { onSuccess });
    }
  };

  if (isEditMode && loadingExisting) {
    return (
      <View style={[styles.root, styles.centered]}>
        <ActivityIndicator color={theme.SECONDARY} size="large" />
      </View>
    );
  }
  const primaryDateLabel = isLent ? 'When you lent money' : 'When you borrowed';
  const primaryDateHint = isLent
    ? 'The day you gave them the amount.'
    : 'The day you received the amount.';
  const dueDateLabel = isLent ? 'When they should pay back' : 'When you plan to repay';
  const dueDateHint = isLent
    ? 'Optional reminder for expected repayment.'
    : 'Optional target date to settle what you owe.';

  return (
    <View style={styles.root}>
      <SuccessOverlay ref={overlayRef} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={[styles.topSafe, { paddingTop: insets.top }]}>
          <AuthHeader title={isEditMode ? 'Edit Lending' : 'Add Lending'} />
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
            {/* Hero — type + amount */}
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
                    {(['lent', 'borrowed'] as LendingType[]).map(t => {
                      const active = type === t;
                      return (
                        <TouchableOpacity
                          key={t}
                          activeOpacity={0.85}
                          onPress={() => setType(t)}
                          style={[
                            styles.typePill,
                            !active && styles.typePillInactive,
                          ]}
                        >
                          {active ? (
                            <LinearGradient
                              colors={['#F0E0C4', '#C6A56B', '#A8894F']}
                              start={{ x: 0, y: 0.5 }}
                              end={{ x: 1, y: 0.5 }}
                              style={StyleSheet.absoluteFill}
                            />
                          ) : null}
                          <Text
                            style={[
                              styles.typePillText,
                              {
                                color: active
                                  ? theme.NAVBAR_ACTIVE_TEXT
                                  : theme.LIGHT_TEXT,
                              },
                            ]}
                          >
                            {t === 'lent' ? 'I Lent' : 'I Borrowed'}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <LinearGradient
                    colors={['#F0E0C4', '#C6A56B', '#A8894F']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.typeChip}
                  >
                    <Text style={[styles.typeChipText, { color: theme.NAVBAR_ACTIVE_TEXT }]}>
                      {chipText}
                    </Text>
                  </LinearGradient>

                  <Text style={styles.heroTitle}>{heroTitle}</Text>
                  <Text style={styles.heroSubtitle}>{heroSubtitle}</Text>

                  <Text style={styles.amountLabel}>Amount</Text>
                  <Controller
                    control={control}
                    name="amount"
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
                          <Text style={styles.amountRupeePrefix}>{CURRENCY_SYMBOL}</Text>
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
                                const [, dec = ''] = t.split('.');
                                t =
                                  t.split('.')[0] +
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
                        {errors.amount?.message ? (
                          <Text style={styles.amountErrorText}>
                            {errors.amount.message}
                          </Text>
                        ) : null}
                      </View>
                    )}
                  />
                </View>
              </LinearGradient>
            </LinearGradient>

            {/* Person */}
            <LendingFormSection isDark={isDark} styles={styles}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionIconWrap}>
                  <MaterialIcons name="person" size={20} color={theme.SECONDARY} />
                </View>
                <Text style={styles.sectionLabel}>Person</Text>
                <Text style={styles.sectionHint}>Required</Text>
              </View>
              <View style={styles.fieldGap}>
                <Controller
                  control={control}
                  name="personName"
                  rules={{ required: 'Person name is required' }}
                  render={({ field: { onChange, value } }) => (
                    <InputComponent
                      placeholder="Who is this with?"
                      value={value}
                      onChangeText={onChange}
                      error={errors.personName?.message}
                    />
                  )}
                />
              </View>
              <Controller
                control={control}
                name="personContact"
                render={({ field: { onChange, value } }) => (
                  <InputComponent
                    placeholder="Phone or email (optional)"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="default"
                  />
                )}
              />
            </LendingFormSection>

            {/* Dates */}
            <LendingFormSection isDark={isDark} styles={styles}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionIconWrap}>
                  <MaterialIcons name="event" size={20} color={theme.SECONDARY} />
                </View>
                <Text style={styles.sectionLabel}>Timeline</Text>
              </View>

              <View style={styles.fieldGap}>
                <Text style={styles.fieldLabel}>{primaryDateLabel}</Text>
                <Text style={styles.fieldHelper}>{primaryDateHint}</Text>
                <Controller
                  control={control}
                  name="date"
                  rules={{ required: 'Date is required' }}
                  render={({ field: { onChange, value } }) => (
                    <DatePicker
                      value={value}
                      onChanged={onChange}
                      error={errors.date?.message}
                      placeholder="Pick lending date"
                    />
                  )}
                />
              </View>

              <View>
                <Text style={styles.fieldLabel}>{dueDateLabel}</Text>
                <Text style={styles.fieldHelper}>{dueDateHint}</Text>
                <Controller
                  control={control}
                  name="dueDate"
                  render={({ field: { onChange, value } }) => (
                    <DatePicker
                      value={value}
                      onChanged={onChange}
                      placeholder="No due date set — tap to add"
                    />
                  )}
                />
              </View>
            </LendingFormSection>

            {/* Note */}
            <LendingFormSection isDark={isDark} styles={styles}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionIconWrap}>
                  <MaterialIcons name="sticky-note-2" size={20} color={theme.SECONDARY} />
                </View>
                <Text style={styles.sectionLabel}>Note</Text>
                <Text style={styles.sectionHint}>Optional</Text>
              </View>
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, value } }) => (
                  <TextArea
                    placeholder="Context — reason, agreement, reminders…"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
            </LendingFormSection>
          </View>

          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              style={[styles.primaryCta, isLoading && styles.primaryCtaDisabled]}
              activeOpacity={0.92}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              <LinearGradient
                colors={[...goldCTA]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryCtaInner}
              >
                {isLoading ? (
                  <ActivityIndicator color={theme.NAVBAR_ACTIVE_TEXT} />
                ) : (
                  <Text style={styles.primaryCtaText}>
                    {isEditMode ? 'Update lending' : 'Save lending'}
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

export default AddLendingScreen;
