import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '../../../utils/Icons';
import { createStyles } from './styles';
import { useTheme } from '../../../utils/colors';
import { scale } from '../../../utils/responsive';

type Props = {
  visible: boolean;
  title?: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  requireConfirmText?: string;
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
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalContainer}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.iconWrapper}>
              <MaterialIcons
                name="delete-outline"
                size={scale(28)}
                color={theme.ERROR}
              />
            </View>
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
              <TouchableOpacity
                onPress={onCancel}
                style={styles.cancelButton}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onConfirm}
                style={[
                  styles.confirmButton,
                  !canConfirm && styles.confirmButtonDisabled,
                ]}
                disabled={!canConfirm || loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.confirmText}>Delete</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CustomConfirmationModal;
