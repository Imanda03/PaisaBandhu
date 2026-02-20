import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { formatReadableDate, formatTimeAgo, ICONS } from '../../utils/helper';
import { createStyles } from './styles';
import { useTheme } from '../../utils/colors';
import { EntypoIcon, FeatherIcon } from '../../utils/Icons';
import { useDeleteTransactionBook } from '../../ReactQueryHook/transaction.hook';
import CustomConfirmationModal from '../core/ConfirmationModal';

type Props = {
    _id?: string
    icon: string;
    title: string;
    date: string;
    type: 'income' | 'expense';
    price: string;
    isGesture?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    categoryId: {
        icon: string;
        title: string;
    };
    bookId?: string;
    friendId: {
        name: string
    }
};

const TransactionListItem = ({
    _id,
    icon,
    title,
    date,
    type,
    price,
    isGesture = false,
    onEdit,
    // onDelete,
    categoryId,
    bookId,
    friendId
}: Props) => {
    const selectedIcon = ICONS.find(i => i.value === categoryId?.icon)?.name || '❓';
    const styles = createStyles();
    const { theme } = useTheme();
    const { mutate: deleteFinancialBook, isLoading: isDeleting } = useDeleteTransactionBook(title,)
    const [isModalVisible, setModalVisible] = useState(false);
    console.log("id", _id)
    const confirmDelete = () => {
        deleteFinancialBook(_id, {
            onSuccess: () => {
                setModalVisible(false);
            }
        });
    };

    const onDelete = () => {
        setModalVisible(true);
    };

    const renderRightActions = () => (
        <View style={styles.rightActionWrapper}>
            <TouchableOpacity onPress={onEdit} style={[styles.actionButton, styles.viewButton]}>
                <FeatherIcon name="eye" size={20} color={theme.SECONDARY} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete} style={[styles.actionButton, styles.deleteButton]}>
                <FeatherIcon name="trash-2" size={20} color={theme.SECONDARY} />
            </TouchableOpacity>
        </View>
    );

    const content = (
        <View style={[
            styles.transactionItem,
            isGesture && { paddingVertical: 6, paddingHorizontal: 14, gap: 5 }
        ]}>
            <View style={styles.container}>
                <View style={styles.leftContainer}>
                    <View style={styles.iconContainer}>
                        <Text style={styles.icon}>{selectedIcon}</Text>
                    </View>
                    <View style={styles.titleContainer}>
                        <Text style={styles.text} numberOfLines={1}>{title}</Text>
                        {categoryId?.title && (
                            <View style={styles.categoryRow}>
                                <View style={styles.categoryBadge}>
                                    <Text style={styles.categoryText}>{categoryId.title}</Text>
                                </View>
                                <Text style={styles.bottomText}> • {formatTimeAgo(date)}</Text>
                            </View>
                        )}
                    </View>
                </View>
                <View style={styles.priceContainer}>
                    <View style={styles.priceWrapper}>
                        <Text
                            style={[
                                styles.price,
                                { color: type === 'income' ? theme.SUCCESS : theme.PRICE_ERROR },
                            ]}
                        >
                            <EntypoIcon
                                name={type === 'income' ? 'chevron-up' : 'chevron-down'}
                                size={18}
                                color={type === 'income' ? theme.SUCCESS : theme.PRICE_ERROR}
                            />{' '}
                            Rs.{price}
                        </Text>
                        {friendId?.name && (
                            <Text style={styles.friendName}>
                                {friendId?.name}
                            </Text>
                        )}
                    </View>
                </View>

            </View>
        </View>
    );

    return (
        <>
            {isGesture ? (
                <Swipeable
                    renderRightActions={renderRightActions}
                // renderLeftActions={renderLeftActions}
                >
                    {content}
                </Swipeable>
            ) : (
                content
            )}

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

export default TransactionListItem;
