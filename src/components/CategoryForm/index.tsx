import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { useTheme } from '../../utils/colors';
import { createStyles } from './styles';
import { ICONS } from '../../utils/helper';
import { useCreateCategory } from '../../ReactQueryHook/category.hook';
import { categoryFormFields } from '../../utils/fields.helper';
import ButtonIconComponent from '../core/ButtonIcon';

const SECTION_LABEL_COLOR = 'LIGHT_TEXT';

const formatIconLabel = (value: string) =>
  value
    .split('_')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');

export const AddCategoryForm = () => {
  const { theme } = useTheme();
  const route: any = useRoute();
  const type = route.params?.type;
  const { mutate: createCategory, isLoading } = useCreateCategory();
  const navigation: any = useNavigation();

  const defaultValues: any = {
    title: ICONS[0].value,
    icon: ICONS[0].value,
    type: type || 'expense',
  };

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm<any>({
    defaultValues,
  });

  const onSubmit = (data: any) => {
    createCategory(data, {
      onSuccess: () => {
        reset();
        navigation.goBack();
      },
    });
  };

  const styles = createStyles();
  const sectionLabelColor = theme[SECTION_LABEL_COLOR as keyof typeof theme] as string;

  return (
    <View style={styles.container}>
      {/* Fixed top: type + choose icon header with selected chip */}
      <View style={styles.fixedTop}>
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: sectionLabelColor }]}>
            Category type
          </Text>
          <Controller
            control={control}
            name="type"
            rules={categoryFormFields.type.rules}
            render={({ field: { onChange, value } }) => (
              <View style={styles.typeWrapper}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    value === 'expense' && styles.typeButtonActive,
                    value === 'expense' && { backgroundColor: theme.PURPLE },
                    value !== 'expense' && { backgroundColor: 'transparent' },
                  ]}
                  onPress={() => onChange('expense')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.typeText,
                      value === 'expense'
                        ? [styles.typeTextActive, { color: theme.SECONDARY }]
                        : [styles.typeTextInactive, { color: theme.LIGHT_TEXT }],
                    ]}
                  >
                    Expense
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    value === 'income' && styles.typeButtonActive,
                    value === 'income' && { backgroundColor: theme.PURPLE },
                    value !== 'income' && { backgroundColor: 'transparent' },
                  ]}
                  onPress={() => onChange('income')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.typeText,
                      value === 'income'
                        ? [styles.typeTextActive, { color: theme.SECONDARY }]
                        : [styles.typeTextInactive, { color: theme.LIGHT_TEXT }],
                    ]}
                  >
                    Income
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

        <View style={styles.chooseIconRow}>
          <Text style={[styles.chooseIconLabel, { color: sectionLabelColor }]}>
            Choose icon
          </Text>
          <Controller
            control={control}
            name="icon"
            render={({ field: { value } }) => {
              const selectedIcon = ICONS.find((icon) => icon.value === value);
              if (!selectedIcon) return <View />;
              return (
                <View style={styles.selectedChip}>
                  <Text style={styles.selectedChipEmoji}>
                    {selectedIcon.name}
                  </Text>
                  <Text
                    style={[
                      styles.selectedChipLabel,
                      { color: theme.TEXT },
                    ]}
                  >
                    {formatIconLabel(selectedIcon.value)}
                  </Text>
                </View>
              );
            }}
          />
        </View>
      </View>

      {/* Only the icon grid scrolls */}
      <ScrollView
        style={styles.iconScrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Controller
          control={control}
          name="icon"
          rules={categoryFormFields.icon.rules}
          render={({ field: { onChange, value } }) => (
            <View style={styles.iconGrid}>
              {ICONS.map((icon) => {
                const isSelected = value === icon.value;
                return (
                  <TouchableOpacity
                    key={icon.id}
                    style={[
                      styles.iconButton,
                      isSelected
                        ? styles.iconButtonSelected
                        : styles.iconButtonUnselected,
                      isSelected && { borderColor: theme.SECONDARY },
                    ]}
                    onPress={() => {
                      onChange(icon.value);
                      setValue('title', formatIconLabel(icon.value));
                      reset({
                        title: icon.value,
                        icon: icon.value,
                        type: watch('type'),
                      });
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.iconEmoji}>{icon.name}</Text>
                    <Text
                      style={[
                        styles.iconLabel,
                        {
                          color: isSelected ? theme.TEXT : theme.LIGHT_TEXT,
                        },
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

      {/* Fixed bottom: submit */}
      <View style={styles.fixedBottom}>
        <ButtonIconComponent
          title="Create Category"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
        />
      </View>
    </View>
  );
};

export default AddCategoryForm;
