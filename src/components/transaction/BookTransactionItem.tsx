import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
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
    /** When false, user can only add transactions - no edit/delete (e.g. shared book recipient) */
    canEdit?: boolean;
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
    canEdit = true,
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
    const isDark = theme.HEADER_BACKGROUND === '#0F1012';
    const typeBgColor = isDark
      ? typeColor + '30'
      : (isIncome ? theme.SUCCESS_LIGHT : theme.ERROR_LIGHT);

    const content = (
        <TouchableOpacity 
            style={styles.transactionItem}
            activeOpacity={canEdit ? 0.95 : 1}
            onPress={canEdit ? onEdit : undefined}
            disabled={!canEdit}
        >
            <View style={styles.container}>
                {/* Icon with gradient-like background */}
                <View style={[
                    styles.iconWrapper,
                    { backgroundColor: typeBgColor }
                ]}>
                    <View style={[styles.iconContainer, { borderColor: typeColor + '40' }]}>
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
                                color={theme.ICON_MUTED} 
                                style={styles.metaIcon}
                            />
                            <Text style={styles.dateText}>{formatTimeAgo(date)}</Text>
                        </View>
                        {friendId?.name && (
                            <View style={styles.metaItem}>
                                <MaterialIcons 
                                    name="person-outline" 
                                    size={11} 
                                    color={theme.ICON_MUTED}
                                    style={styles.metaIcon}
                                />
                                <Text style={styles.friendText}>{friendId.name}</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Price Section */}
                <View style={styles.priceWrapper}>
                    <View style={[styles.priceContainer, { backgroundColor: typeBgColor }]}>
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
            {canEdit ? (
                <Swipeable renderRightActions={renderRightActions}>
                    {content}
                </Swipeable>
            ) : (
                content
            )}

            {canEdit && (
            <CustomConfirmationModal
                visible={isModalVisible}
                title="Delete Transaction?"
                description="Are you sure you want to delete this transaction?"
                onConfirm={confirmDelete}
                onCancel={() => setModalVisible(false)}
                loading={isDeleting}
            />
            )}
        </>
    );
};

export default BookTransactionItem;
