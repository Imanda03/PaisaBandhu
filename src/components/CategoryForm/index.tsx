import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { useTheme } from '../../utils/colors';
import { createStyles } from './styles';
import { ICONS } from '../../utils/helper';
import { useCreateCategory } from '../../ReactQueryHook/category.hook';
import { categoryFormFields } from '../../utils/fields.helper';
import PressableScale from '../PressableScale';
import { MaterialIcons } from '../../utils/Icons';
import { scale } from '../../utils/responsive';

const goldCTA = ['#F2E6D2', '#E8CF9E', '#C6A56B', '#A8894F'] as const;

const rimMetallic = (isDark: boolean) =>
  isDark
    ? ['#4A4438', '#2E2E32', '#C6A56B', '#2E2E32', '#4A4438']
    : ['#D8CAB0', '#FFFFFF', '#C6A56B', '#FFFFFF', '#D8CAB0'];

const formatIconLabel = (value: string) =>
  value
    .split('_')
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');

type FormValues = {
  title: string;
  icon: string;
  type: 'income' | 'expense';
};

export const AddCategoryForm = () => {
  const { theme, isDark } = useTheme();
  const route: any = useRoute();
  const initialType = route.params?.type as 'income' | 'expense' | undefined;
  const { mutate: createCategory, isLoading } = useCreateCategory();
  const navigation: any = useNavigation();
  const styles = createStyles();

  const firstIcon = ICONS[0];

  const { control, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      title: formatIconLabel(firstIcon.value),
      icon: firstIcon.value,
      type:
        initialType === 'income' || initialType === 'expense' ? initialType : 'expense',
    },
  });

  useFocusEffect(
    useCallback(() => {
      if (initialType === 'income' || initialType === 'expense') {
        setValue('type', initialType);
      }
    }, [initialType, setValue]),
  );

  const watchedIcon = watch('icon');
  const watchedType = watch('type');

  const segmentInactiveColor = isDark ? '#B8B8C0' : '#374151';
  const segmentInactiveIcon = isDark ? '#9A9AA0' : '#6B7280';
  const typeTrackBg = isDark ? 'rgba(255,255,255,0.06)' : '#E8EAED';

  const selectedIcon = ICONS.find(i => i.value === watchedIcon) ?? firstIcon;
  const displayName = formatIconLabel(selectedIcon.value);
  const isIncome = watchedType === 'income';

  const onSubmit = (data: FormValues) => {
    createCategory(
      {
        type: data.type,
        icon: data.icon,
        title: formatIconLabel(data.icon),
      },
      {
        onSuccess: () => navigation.goBack(),
      },
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={[styles.lead, { color: isDark ? theme.LIGHT_TEXT : '#4B5563' }]}>
          Choose expense or income, pick an icon, then tap{' '}
          <Text style={{ fontWeight: '800', color: theme.SECONDARY }}>Save category</Text>.
        </Text>

        <View style={styles.typeBlock}>
          <Text style={[styles.typeLabel, { color: isDark ? theme.SECONDARY : '#374151' }]}>
            Category type
          </Text>
          <Controller
            control={control}
            name="type"
            rules={categoryFormFields.type.rules}
            render={({ field: { onChange, value } }) => (
              <View
                style={[
                  styles.typeTrack,
                  {
                    backgroundColor: typeTrackBg,
                    borderColor: theme.BORDER_COLOR,
                  },
                ]}
              >
                {(['expense', 'income'] as const).map(t => {
                  const active = value === t;
                  const isExp = t === 'expense';
                  return (
                    <Pressable
                      key={t}
                      style={({ pressed }) => [
                        styles.typeBtn,
                        active && styles.typeBtnActive,
                        active && { backgroundColor: theme.BACKGROUND_LIGHT },
                        pressed && !active && { opacity: 0.88 },
                      ]}
                      onPress={() => onChange(t)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}
                    >
                      {active ? (
                        <LinearGradient
                          pointerEvents="none"
                          colors={
                            isExp
                              ? ['#FCEFF1', '#FDA4AF', '#E11D48']
                              : ['#E8F5EC', '#95D5B2', '#40916C']
                          }
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={[StyleSheet.absoluteFill, { borderRadius: scale(11) }]}
                        />
                      ) : null}
                      <MaterialIcons
                        name={isExp ? 'south-west' : 'north-east'}
                        size={18}
                        color={active ? theme.NAVBAR_ACTIVE_TEXT : segmentInactiveIcon}
                      />
                      <Text
                        style={[
                          styles.typeBtnText,
                          {
                            color: active ? theme.NAVBAR_ACTIVE_TEXT : segmentInactiveColor,
                          },
                        ]}
                      >
                        {isExp ? 'Expense' : 'Income'}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          />
        </View>
      </View>

      <View
        style={[
          styles.iconSectionRim,
          { borderColor: isDark ? 'rgba(198,165,107,0.22)' : 'rgba(198,165,107,0.35)' },
        ]}
      >
        <LinearGradient colors={rimMetallic(isDark)} style={styles.iconRimInner}>
          <View style={[styles.iconSectionFace, { backgroundColor: theme.BACKGROUND_LIGHT }]}>
            <View style={styles.iconHeaderRow}>
              <Text style={[styles.sectionLabel, { color: theme.SECONDARY }]}>Choose icon</Text>
              <View style={[styles.selectedChip, { borderColor: theme.BORDER_COLOR }]}>
                <Text style={styles.chipEmoji}>{selectedIcon.name}</Text>
                <Text style={[styles.chipLabel, { color: theme.TEXT }]} numberOfLines={1}>
                  {displayName}
                </Text>
              </View>
            </View>
            <ScrollView
              style={styles.iconScroll}
              contentContainerStyle={styles.iconScrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Controller
                control={control}
                name="icon"
                rules={categoryFormFields.icon.rules}
                render={({ field: { onChange, value } }) => (
                  <View style={styles.iconGrid}>
                    {ICONS.map(icon => {
                      const isSelected = value === icon.value;
                      return (
                        <TouchableOpacity
                          key={icon.id}
                          style={[
                            styles.iconCell,
                            {
                              borderColor: isSelected ? theme.SECONDARY : 'transparent',
                              backgroundColor: isSelected
                                ? theme.SECONDARY + '18'
                                : theme.BACKGROUND,
                            },
                          ]}
                          onPress={() => {
                            onChange(icon.value);
                            setValue('title', formatIconLabel(icon.value));
                          }}
                          activeOpacity={0.75}
                        >
                          <Text style={styles.iconEmoji}>{icon.name}</Text>
                          <Text
                            style={[
                              styles.iconCellLabel,
                              { color: isSelected ? theme.TEXT : theme.LIGHT_TEXT },
                            ]}
                            numberOfLines={1}
                          >
                            {formatIconLabel(icon.value)}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              />
            </ScrollView>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.fixedBottom}>
        <View
          style={[
            styles.previewCard,
            { borderColor: theme.BORDER_COLOR, backgroundColor: theme.BACKGROUND_LIGHT },
          ]}
        >
          <MaterialIcons name="preview" size={18} color={theme.SECONDARY} />
          <Text style={[styles.previewText, { color: theme.TEXT }]} numberOfLines={1}>
            <Text style={{ fontWeight: '800' }}>{selectedIcon.name} </Text>
            {displayName}
            <Text style={{ color: theme.LIGHT_TEXT }}> · {isIncome ? 'Income' : 'Expense'}</Text>
          </Text>
        </View>

        <PressableScale onPress={handleSubmit(onSubmit)} disabled={isLoading} style={styles.ctaWrap}>
          <LinearGradient
            colors={[...goldCTA]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaBtn}
          >
            {isLoading ? (
              <ActivityIndicator color={theme.NAVBAR_ACTIVE_TEXT} />
            ) : (
              <>
                <MaterialIcons name="check-circle" size={22} color={theme.NAVBAR_ACTIVE_TEXT} />
                <Text style={[styles.ctaText, { color: theme.NAVBAR_ACTIVE_TEXT }]}>
                  Save category
                </Text>
              </>
            )}
          </LinearGradient>
        </PressableScale>
      </View>
    </View>
  );
};

export default AddCategoryForm;
