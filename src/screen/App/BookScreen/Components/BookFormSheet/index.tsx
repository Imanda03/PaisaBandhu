import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { createStyles } from '../../styles';
import BottomSheet from '../../../../../components/BottomSheet';
import { IoniconsIcon, MaterialIcons } from '../../../../../utils/Icons';
import { useTheme } from '../../../../../utils/colors';
import {
  useCreateFinancialBook,
  useDeleteFinancialBook,
  useUpdateFinancialBook,
} from '../../../../../ReactQueryHook/book.hook';
import { BookInterfaceProps } from '../../../../../utils/types';
import { useToast } from '../../../../../context/ToastContext';
import CustomConfirmationModal from '../../../../../components/core/ConfirmationModal';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  isAddMode: boolean;
  selectedBook: BookInterfaceProps;
};

const BookFormSheet: React.FC<Props> = ({
  isVisible,
  onClose,
  isAddMode,
  selectedBook,
}) => {
  const [newBookTitle, setNewBookTitle] = useState('');
  const [selectedBookType, setSelectedBookType] = useState<'single' | 'group'>(
    'single',
  );
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const { mutate: createFinancialBook, isLoading: isCreating } =
    useCreateFinancialBook();
  const { mutate: updateFinancialBook, isLoading: isUpdating } =
    useUpdateFinancialBook();
  const { mutate: deleteFinancialBook, isLoading: isDeleting } = useDeleteFinancialBook(
    selectedBook.title,
  );

  const styles = createStyles();
  const { theme } = useTheme();
  const { showToast } = useToast();

  const resetForm = () => {
    setNewBookTitle('');
    setSelectedBookType('single');
  };

  useEffect(() => {
    setNewBookTitle(selectedBook.title);
    setSelectedBookType(selectedBook.type);
  }, [selectedBook]);

  const onSubmit = () => {
    if (!newBookTitle.trim()) {
      showToast('Book title cannot be empty', 'error');
      return;
    }

    const data = {
      title: newBookTitle,
      type: selectedBookType,
    };

    if (isAddMode) {
      createFinancialBook(data, {
        onSuccess: () => {
          resetForm();
          onClose();
        },
      });
    } else {
      const bookId = (selectedBook as any).id || (selectedBook as any)._id;
      if (!bookId) {
        showToast('Book ID is missing. Cannot update.', 'error');
        return;
      }
      updateFinancialBook(
        { id: bookId, ...data },
        {
          onSuccess: () => {
            resetForm();
            onClose();
          },
        },
      );
    }
  };

  const handleClose = () => {
    resetForm();
    setIsDeleteModalVisible(false);
    onClose();
  };

  const onDelete = () => {
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    // Handle both id and _id from API
    const bookId = (selectedBook as any).id || (selectedBook as any)._id;
    
    if (!bookId) {
      showToast('Book ID is missing. Cannot delete.', 'error');
      setIsDeleteModalVisible(false);
      return;
    }

    // Force delete if there are transactions (user typed CONFIRM)
    const forceDelete = transactionCount > 0;

    deleteFinancialBook(
      { id: bookId, force: forceDelete },
      {
        onSuccess: () => {
          setIsDeleteModalVisible(false);
          onClose();
          resetForm();
        },
        onError: (error: any) => {
          setIsDeleteModalVisible(false);
          // Error is already handled in the mutation hook
        },
      }
    );
  };

  const transactionCount = selectedBook.transactionCount || 0;
  const deleteTitle = 'Delete Book?';
  const deleteDescription = transactionCount === 0
    ? `Are you sure you want to delete "${selectedBook.title}"? This book has no transactions and can be safely removed.`
    : `Are you sure you want to delete "${selectedBook.title}"? This book contains ${transactionCount} ${transactionCount === 1 ? 'transaction' : 'transactions'}. This action cannot be undone.`;

  return (
    <BottomSheet
      isVisible={isVisible}
      onClose={handleClose}
      title={isAddMode ? 'Add Financial Book' : 'Edit Financial Book'}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalContent}
      >
        <TextInput
          style={styles.input}
          value={newBookTitle}
          placeholder="Book Name"
          placeholderTextColor="gray"
          maxLength={30}
          onChangeText={setNewBookTitle}
        />

        <Text style={styles.bookTypeHeader}>Book Type</Text>

        <View style={styles.bookTypeContainer}>
          <TouchableOpacity
            style={[
              styles.bookTypeCard,
              selectedBookType === 'single' && styles.bookTypeSelected,
            ]}
            onPress={() => setSelectedBookType('single')}
          >
            <MaterialIcons
              name="insert-chart"
              size={32}
              color={selectedBookType === 'single' ? theme.PURPLE : theme.TEXT}
              style={styles.bookTypeIcon}
            />
            <Text
              style={[
                styles.bookTypeTitle,
                selectedBookType === 'single' && styles.bookTypeTitleSelected,
              ]}
            >
              Single
            </Text>
            <Text style={styles.bookTypeSubtitle}>Personal tracking</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.bookTypeCard,
              selectedBookType === 'group' && styles.bookTypeSelected,
            ]}
            onPress={() => setSelectedBookType('group')}
          >
            <MaterialIcons
              name="group"
              size={32}
              color={selectedBookType === 'group' ? theme.PURPLE : theme.TEXT}
              style={styles.bookTypeIcon}
            />
            <Text
              style={[
                styles.bookTypeTitle,
                selectedBookType === 'group' && styles.bookTypeTitleSelected,
              ]}
            >
              Group
            </Text>
            <Text style={styles.bookTypeSubtitle}>Shared expenses</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.modalButtonContainer}>
          {!isAddMode && !selectedBook.isShared && (
            <TouchableOpacity
              style={[styles.modalButton, styles.deleteButton]}
              onPress={onDelete}
            >
              <Text style={styles.modalButtonText}>Delete</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.modalButton} onPress={onSubmit}>
            {isCreating || isUpdating ? (
              <Text>
                <ActivityIndicator />{' '}
                <Text style={[styles.modalButtonText, { marginLeft: 10 }]}>
                  Saving...
                </Text>
              </Text>
            ) : (
              <Text style={styles.modalButtonText}>
                {isAddMode ? 'Add Book' : 'Save Changes'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <CustomConfirmationModal
        visible={isDeleteModalVisible}
        title={deleteTitle}
        description={deleteDescription}
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        loading={isDeleting}
        requireConfirmText={transactionCount > 0 ? 'CONFIRM' : undefined}
      />
    </BottomSheet>
  );
};

export default BookFormSheet;
