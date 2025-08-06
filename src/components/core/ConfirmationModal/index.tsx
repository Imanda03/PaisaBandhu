import React from 'react';
import { Modal, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { createStyles } from './styles'; // Create custom styles here

type Props = {
    visible: boolean;
    title?: string;
    description?: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
};

const CustomConfirmationModal = ({
    visible,
    title = 'Are you sure?',
    description = 'This action cannot be undone.',
    onConfirm,
    onCancel,
    loading = false,
}: Props) => {
    const styles = createStyles();

    return (
        <Modal transparent animationType="fade" visible={visible}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.description}>{description}</Text>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity onPress={onCancel} style={styles.cancelButton} disabled={loading}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onConfirm} style={styles.confirmButton}>
                            {loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.confirmText}>Delete</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default CustomConfirmationModal;
