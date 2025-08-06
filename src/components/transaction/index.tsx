import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Swipeable } from 'react-native-gesture-handler';
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
                <FeatherIcon name="eye" size={24} color={theme.SECONDARY} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete} style={[styles.actionButton, styles.deleteButton]}>
                <FeatherIcon name="trash-2" size={24} color={theme.SECONDARY} />
            </TouchableOpacity>
        </View>
    );

    const content = (
        <View style={[
            styles.transactionItem,
            isGesture && { paddingVertical: 6, paddingHorizontal: 14, gap: 5 }
        ]} key={_id}>
            <View style={styles.container}>
                <View style={styles.leftContainer}>
                    <View style={[styles.iconContainer, { backgroundColor: theme.DARK_TEXT }]}>
                        <Text style={styles.icon}>{selectedIcon}</Text>
                    </View>
                    <View style={[styles.titleContainer, { gap: isGesture ? 4 : '' }]}>
                        <Text style={[styles.text, isGesture && { fontSize: 18 }]}>{title}</Text>
                        {/* <Text style={styles.bottomText}>{formatTimeAgo(date)}</Text> */}
                        {categoryId?.title && (
                            <View style={styles.categoryRow}>
                                <Text style={styles.categoryText}>{categoryId.title}</Text>
                                <Text style={styles.bottomText}> • {formatTimeAgo(date)}</Text>
                            </View>
                        )}

                    </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text
                        style={[
                            styles.price,
                            { color: type === 'income' ? theme.SUCCESS : theme.PRICE_ERROR },
                        ]}
                    >
                        <EntypoIcon
                            name={type === 'income' ? 'chevron-up' : 'chevron-down'}
                            size={16}
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
            <View style={styles.bar} />
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
