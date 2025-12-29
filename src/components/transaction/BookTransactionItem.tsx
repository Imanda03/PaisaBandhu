import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Swipeable } from 'react-native-gesture-handler';
import { formatTimeAgo, ICONS } from '../../utils/helper';
import { createStyles } from './BookTransactionItem.styles';
import { useTheme } from '../../utils/colors';
import { EntypoIcon, FeatherIcon, MaterialIcons } from '../../utils/Icons';
import { useDeleteTransactionBook } from '../../ReactQueryHook/transaction.hook';
import CustomConfirmationModal from '../core/ConfirmationModal';

type Props = {
    _id?: string;
    icon: string;
    title: string;
    date: string;
    type: 'income' | 'expense';
    price: string;
    categoryId: {
        icon: string;
        title: string;
    };
    bookId?: string;
    friendId: {
        name: string;
    };
    onEdit?: () => void;
};

const BookTransactionItem = ({
    _id,
    icon,
    title,
    date,
    type,
    price,
    categoryId,
    bookId,
    friendId,
    onEdit,
}: Props) => {
    const selectedIcon = ICONS.find(i => i.value === categoryId?.icon)?.name || '💰';
    const styles = createStyles();
    const { theme } = useTheme();
    const { mutate: deleteFinancialBook, isLoading: isDeleting } = useDeleteTransactionBook(title);
    const [isModalVisible, setModalVisible] = useState(false);

    const confirmDelete = () => {
        deleteFinancialBook(_id, {
            onSuccess: () => {
                setModalVisible(false);
            },
        });
    };

    const onDelete = () => {
        setModalVisible(true);
    };

    const renderRightActions = () => (
        <View style={styles.rightActionWrapper}>
            <TouchableOpacity 
                onPress={onEdit} 
                style={[styles.actionButton, styles.viewButton]}
                activeOpacity={0.7}
            >
                <FeatherIcon name="eye" size={18} color={theme.SECONDARY} />
            </TouchableOpacity>
            <TouchableOpacity 
                onPress={onDelete} 
                style={[styles.actionButton, styles.deleteButton]}
                activeOpacity={0.7}
            >
                <FeatherIcon name="trash-2" size={18} color={theme.SECONDARY} />
            </TouchableOpacity>
        </View>
    );

    const isIncome = type === 'income';
    const typeColor = isIncome ? theme.SUCCESS : theme.ERROR;
    const typeLightColor = isIncome ? theme.SUCCESS_LIGHT : theme.ERROR_LIGHT;

    const content = (
        <TouchableOpacity 
            style={styles.transactionItem}
            activeOpacity={0.95}
            onPress={onEdit}
        >
            <View style={styles.container}>
                {/* Icon with gradient-like background */}
                <View style={[
                    styles.iconWrapper,
                    { backgroundColor: typeLightColor }
                ]}>
                    <View style={[styles.iconContainer, { borderColor: typeColor + '30' }]}>
                        <Text style={styles.icon}>{selectedIcon}</Text>
                    </View>
                </View>

                {/* Main Content */}
                <View style={styles.contentWrapper}>
                    {/* Title Row */}
                    <View style={styles.titleRow}>
                        <Text style={styles.title} numberOfLines={1}>
                            {title}
                        </Text>
                    </View>

                    {/* Meta Row */}
                    <View style={styles.metaRow}>
                        {categoryId?.title && (
                            <View style={styles.categoryBadge}>
                                <Text style={styles.categoryText}>{categoryId.title}</Text>
                            </View>
                        )}
                        <View style={styles.metaItem}>
                            <MaterialIcons 
                                name="schedule" 
                                size={11} 
                                color={theme.LIGHT_TEXT} 
                                style={styles.metaIcon}
                            />
                            <Text style={styles.dateText}>{formatTimeAgo(date)}</Text>
                        </View>
                        {friendId?.name && (
                            <View style={styles.metaItem}>
                                <MaterialIcons 
                                    name="person-outline" 
                                    size={11} 
                                    color={theme.LIGHT_TEXT}
                                    style={styles.metaIcon}
                                />
                                <Text style={styles.friendText}>{friendId.name}</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Price Section */}
                <View style={styles.priceWrapper}>
                    <View style={[styles.priceContainer, { backgroundColor: typeLightColor }]}>
                        <EntypoIcon
                            name={isIncome ? 'chevron-up' : 'chevron-down'}
                            size={14}
                            color={typeColor}
                            style={styles.priceIcon}
                        />
                        <Text style={[styles.price, { color: typeColor }]}>
                            Rs. {price}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <>
            <Swipeable renderRightActions={renderRightActions}>
                {content}
            </Swipeable>

            <CustomConfirmationModal
                visible={isModalVisible}
                title="Delete Transaction?"
                description="Are you sure you want to delete this transaction?"
                onConfirm={confirmDelete}
                onCancel={() => setModalVisible(false)}
                loading={isDeleting}
            />
        </>
    );
};

export default BookTransactionItem;
