import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm, Controller, } from 'react-hook-form';
import { useTheme } from '../../utils/colors';
import { createStyles } from './styles';
import { ICONS } from '../../utils/helper';
import { useToast } from '../../context/ToastContext';
import ButtonIconComponent from '../core/ButtonIcon';
import { useQueryClient } from 'react-query';
import { useCreateCategory } from '../../ReactQueryHook/category.hook';
import { categoryFormFields } from '../../utils/fields.helper';




export const AddCategoryForm = () => {
    const { theme, isDark } = useTheme();
    const route: any = useRoute();
    const type = route.params?.type
    const { mutate: createCategory, isLoading } = useCreateCategory();
    const navigation: any = useNavigation()

    const defaultValues: any = {
        title: '',
        icon: ICONS[0].value,
        type: type || 'expense',
    };

    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
        reset,
        setValue,
        watch
    } = useForm<any>({
        defaultValues,
    });

    const onSubmit = (data: any) => {
        createCategory(data, {
            onSuccess: () => {
                reset();
                navigation.goBack()
            }
        })
    };

    const styles = createStyles();

    return (
        <View style={styles.container}>
            <View>
                <Text style={[styles.label, { color: theme.TEXT }]}>Type</Text>
                <Controller
                    control={control}
                    name="type"
                    rules={categoryFormFields.type.rules}
                    render={({ field: { onChange, value } }) => (
                        <>
                            <View style={styles.typeContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.typeButton,
                                        {
                                            backgroundColor:
                                                value === 'expense'
                                                    ? theme.PURPLE
                                                    : theme.INPUT_BACKGROUND,
                                        },
                                    ]}
                                    onPress={() => onChange('expense')}>
                                    <Text
                                        style={[
                                            styles.typeText,
                                            {
                                                color:
                                                    value === 'expense' ? theme.SECONDARY : theme.TEXT,
                                            },
                                        ]}>
                                        Expense
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.typeButton,
                                        {
                                            backgroundColor:
                                                value === 'income'
                                                    ? theme.PURPLE
                                                    : theme.INPUT_BACKGROUND,
                                        },
                                    ]}
                                    onPress={() => onChange('income')}>
                                    <Text
                                        style={[
                                            styles.typeText,
                                            {
                                                color:
                                                    value === 'income' ? theme.SECONDARY : theme.TEXT,
                                            },
                                        ]}>
                                        Income
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            {/* {errors.type && (
                                <Text style={styles.errorText}>{errors.type.message}</Text>
                            )} */}
                        </>
                    )}
                />

                <Text style={[styles.label, { color: theme.TEXT }]}>Icon</Text>
                <Controller
                    control={control}
                    name="icon"
                    rules={categoryFormFields.icon.rules}
                    render={({ field: { onChange, value } }) => {
                        const selectedIcon = ICONS.find(icon => icon.value === value);

                        return (
                            <>
                                {selectedIcon && (
                                    <Text style={[styles.selectedIconLabel, { color: isDark ? theme.TEXT : theme.PURPLE }]}>
                                        Selected: {selectedIcon.name} ({selectedIcon.value.charAt(0).toUpperCase() + selectedIcon.value.slice(1)})
                                    </Text>
                                )}
                                <View style={styles.iconGrid}>
                                    {ICONS.map(icon => (
                                        <TouchableOpacity
                                            key={icon.id}
                                            style={[
                                                styles.iconButton,
                                                {
                                                    backgroundColor: theme.INPUT_BACKGROUND,
                                                    borderColor:
                                                        value === icon.value ? theme.PURPLE : 'transparent',
                                                },
                                            ]}
                                            onPress={() => {
                                                onChange(icon.value);
                                                setValue('title', icon.value.charAt(0).toUpperCase() + icon.value.slice(1));
                                                // Automatically set the title to the icon value
                                                // Using reset to update the title
                                                reset({
                                                    title: icon.value,
                                                    icon: icon.value,
                                                    type: watch('type'),
                                                });
                                            }}>
                                            <Text style={styles.iconText}>{icon.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </>
                        );
                    }}
                />

            </View>
            <ButtonIconComponent
                title="Create Category"
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
            />
        </View>
    );
};

export default AddCategoryForm;
