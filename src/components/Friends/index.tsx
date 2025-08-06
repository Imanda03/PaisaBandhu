import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createStyles } from './styles';
import { useTheme } from '../../utils/colors';
import { capitalizeFirstLetter } from '../../utils/helper';
import { useCreateFriend, useDeleteFriend } from '../../ReactQueryHook/friend.hook';
import FriendModal from '../FriendModal';
import CustomConfirmationModal from '../core/ConfirmationModal';
import { useToast } from '../../context/ToastContext';

interface FriendProps {
    name: string;
    email: string;
    id: string;
}

export const Friend: React.FC<FriendProps> = ({
    name,
    email,
    id,
}) => {
    const [isConfirmation, setIsConfirmation] = useState<boolean>(false)
    const { mutate: deleteMember } = useDeleteFriend()
    const { theme } = useTheme();
    const styles = createStyles();
    const { showToast } = useToast()


    const handleDelete = () => {
        deleteMember(id, {
            onSuccess: () => {
                setIsConfirmation(false);
                showToast(" Friend Successfully Added", "success");
            }
        })
    };
    return (
        <View style={styles.container}>
            <View style={styles.leftContent}>
                <View style={{ gap: 5 }}>
                    <Text style={styles.title}>{name}</Text>
                    <Text
                        style={styles.subTitle}>
                        {email}
                    </Text>
                </View>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => setIsConfirmation(true)} style={styles.deleteButton}>
                    <Icon name="delete" size={20} color={theme.ERROR} />
                </TouchableOpacity>
            </View>
            <CustomConfirmationModal visible={isConfirmation} onConfirm={handleDelete}
                onCancel={() => setIsConfirmation(false)}
                description='You want to delete the member. This cannot be undo'
            />
        </View>
    );
};

export const AddFriend: React.FC<{ bookId: string }> = ({ bookId }) => {
    const { theme, isDark } = useTheme();
    const styles = createStyles();
    const [isFriendModal, setIsFriendModal] = useState<boolean>(false);
    const onPress = () => {
        setIsFriendModal(true);
    };
    const onClose = () => {
        setIsFriendModal(false)
    }
    return (
        <>
            <TouchableOpacity
                style={[styles.addButton, { borderColor: isDark ? theme.SECONDARY : theme.PURPLE }]}
                onPress={onPress}>
                <Icon name="add" size={24} color={isDark ? theme.SECONDARY : theme.PURPLE} />
                <Text style={[styles.addText, { color: isDark ? theme.SECONDARY : theme.PURPLE }]}>Add Member</Text>
            </TouchableOpacity>
            <FriendModal isVisible={isFriendModal} onClose={onClose} bookId={bookId} />
        </>
    );
};