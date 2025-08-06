import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../utils/colors';
import { createStyles } from './styles';
import { FontAwesome6Icons, MaterialIcons } from '../../utils/Icons';

export const FilterBar = ({
    filter,
    setFilter,
    dateRange,
    setDateRange,
    showFromPicker,
    setShowFromPicker,
    showToPicker,
    setShowToPicker,
    style,
}: any) => {
    const { theme } = useTheme();
    const styles = createStyles();
    const [showDateFilters, setShowDateFilters] = useState(false);


    const handleDateChange = (
        event: any,
        selectedDate: Date | undefined,
        type: string,
    ) => {
        if (type === 'from') {
            setShowFromPicker(false);
            if (selectedDate) {
                // For "from" date, ensure it's not after the "to" date
                if (selectedDate <= dateRange.to) {
                    setDateRange((prev: any) => ({ ...prev, from: selectedDate }));
                    setShowDateFilters(true);
                } else {
                    // If selected date is after "to" date, set both dates to the selected date
                    setDateRange((prev: any) => ({
                        from: selectedDate,
                        to: selectedDate,
                    }));
                }
            }
        } else {
            setShowToPicker(false);
            if (selectedDate) {
                // For "to" date, ensure it's not before the "from" date
                if (selectedDate >= dateRange.from) {
                    setDateRange((prev: any) => ({ ...prev, to: selectedDate }));
                    setShowDateFilters(true);
                } else {
                    // If selected date is before "from" date, set both dates to the selected date
                    setDateRange((prev: any) => ({
                        from: selectedDate,
                        to: selectedDate,
                    }));
                }
            }
        }
    };

    // Get maximum date for "from" picker (cannot be after "to" date)
    const getFromPickerMaxDate = () => {
        return dateRange.to;
    };

    // Get minimum date for "to" picker (cannot be before "from" date)
    const getToPickerMinDate = () => {
        return dateRange.from;
    };
    return (
        <View style={[styles.container, style]}>
            <View style={styles.filterSection}>
                <View style={styles.typeFilters}>
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            {
                                backgroundColor:
                                    filter === 'all' ? theme.PURPLE : theme.INPUT_BACKGROUND,
                            },
                        ]}
                        onPress={() => setFilter('all')}>
                        <MaterialIcons
                            name="list"
                            size={20}
                            color={filter === 'all' ? theme.SECONDARY : theme.TEXT}
                        />
                        <Text
                            style={[
                                styles.buttonText,
                                { color: filter === 'all' ? theme.SECONDARY : theme.TEXT },
                            ]}>
                            All
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            {
                                backgroundColor:
                                    filter === 'income' ? theme.SUCCESS : theme.INPUT_BACKGROUND,
                            },
                        ]}
                        onPress={() => setFilter('income')}>
                        <MaterialIcons
                            name="trending-up"
                            size={20}
                            color={filter === 'income' ? theme.SECONDARY : theme.TEXT}
                        />
                        <Text
                            style={[
                                styles.buttonText,
                                { color: filter === 'income' ? theme.SECONDARY : theme.TEXT },
                            ]}>
                            Income
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            {
                                backgroundColor:
                                    filter === 'expense' ? theme.ERROR : theme.INPUT_BACKGROUND,
                            },
                        ]}
                        onPress={() => setFilter('expense')}>
                        <MaterialIcons
                            name="trending-down"
                            size={20}
                            color={filter === 'expense' ? theme.SECONDARY : theme.TEXT}
                        />
                        <Text
                            style={[
                                styles.buttonText,
                                { color: filter === 'expense' ? theme.SECONDARY : theme.TEXT },
                            ]}>
                            Expense
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};
