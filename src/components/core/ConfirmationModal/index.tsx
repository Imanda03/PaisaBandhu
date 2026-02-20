import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { createStyles } from './styles';
import { useTheme } from '../../../utils/colors';

type Props = {
    visible: boolean;
    title?: string;
    description?: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
    requireConfirmText?: string; // If provided, user must type this exact text to confirm
};

const CustomConfirmationModal = ({
    visible,
    title = 'Are you sure?',
    description = 'This action cannot be undone.',
    onConfirm,
    onCancel,
    loading = false,
    requireConfirmText,
}: Props) => {
    const { theme } = useTheme();
    const styles = createStyles();
    const [confirmText, setConfirmText] = useState('');
    const canConfirm = !requireConfirmText || confirmText === requireConfirmText;

    useEffect(() => {
        if (!visible) {
            setConfirmText('');
        }
    }, [visible]);

    return (
        <Modal transparent animationType="fade" visible={visible}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.description}>{description}</Text>
                    {requireConfirmText && (
                        <View style={styles.confirmInputContainer}>
                            <Text style={styles.confirmInputLabel}>
                                Type <Text style={styles.confirmTextHighlight}>{requireConfirmText}</Text> to confirm:
                            </Text>
                            <TextInput
                                style={styles.confirmInput}
                                value={confirmText}
                                onChangeText={setConfirmText}
                                placeholder={requireConfirmText}
                                placeholderTextColor={theme.PLACEHOLDER_COLOR}
                                autoCapitalize="characters"
                                editable={!loading}
                            />
                        </View>
                    )}
                    <View style={styles.buttonRow}>
                        <TouchableOpacity onPress={onCancel} style={styles.cancelButton} disabled={loading}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={onConfirm} 
                            style={[
                                styles.confirmButton,
                                !canConfirm && styles.confirmButtonDisabled
                            ]}
                            disabled={!canConfirm || loading}
                        >
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
