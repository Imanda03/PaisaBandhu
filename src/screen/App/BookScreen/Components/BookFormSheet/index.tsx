import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { createStyles } from '../../styles';
import BottomSheet from '../../../../../components/BottomSheet';
import { MaterialIcons } from '../../../../../utils/Icons';
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

const rimMetallic = (isDark: boolean) =>
  isDark
    ? ['#4A4438', '#2E2E32', '#C6A56B', '#2E2E32', '#4A4438']
    : ['#D8CAB0', '#FFFFFF', '#C6A56B', '#FFFFFF', '#D8CAB0'];

const goldCTA = ['#F2E6D2', '#E8CF9E', '#C6A56B', '#A8894F'] as const;

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
  const [nameFocused, setNameFocused] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const { mutate: createFinancialBook, isLoading: isCreating } =
    useCreateFinancialBook();
  const { mutate: updateFinancialBook, isLoading: isUpdating } =
    useUpdateFinancialBook();
  const { mutate: deleteFinancialBook, isLoading: isDeleting } =
    useDeleteFinancialBook(selectedBook.title);

  const styles = createStyles();
  const { theme, isDark } = useTheme();
  const { showToast } = useToast();

  const rim = useMemo(() => rimMetallic(isDark), [isDark]);

  const heroFaceColors = useMemo(
    () =>
      isDark ? ['#1c1a17', '#1A1B1F'] : ['#FAF6EF', '#FFFFFF'],
    [isDark],
  );

  const resetForm = () => {
    setNewBookTitle('');
    setSelectedBookType('single');
    setNameFocused(false);
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

  const transactionCount = selectedBook.transactionCount || 0;

  const confirmDelete = () => {
    const bookId = (selectedBook as any).id || (selectedBook as any)._id;

    if (!bookId) {
      showToast('Book ID is missing. Cannot delete.', 'error');
      setIsDeleteModalVisible(false);
      return;
    }

    const forceDelete = transactionCount > 0;

    deleteFinancialBook(
      { id: bookId, force: forceDelete },
      {
        onSuccess: () => {
          setIsDeleteModalVisible(false);
          onClose();
          resetForm();
        },
        onError: (_error: any) => {
          setIsDeleteModalVisible(false);
        },
      },
    );
  };

  const deleteTitle = 'Delete Book?';
  const deleteDescription =
    transactionCount === 0
      ? `Are you sure you want to delete "${selectedBook.title}"? This book has no transactions and can be safely removed.`
      : `Are you sure you want to delete "${selectedBook.title}"? This book contains ${transactionCount} ${transactionCount === 1 ? 'transaction' : 'transactions'}. This action cannot be undone.`;

  const saving = isCreating || isUpdating;
  const titleLen = newBookTitle.length;
  const maxLen = 30;

  const chipText = isAddMode ? 'NEW LEDGER' : 'EDIT LEDGER';
  const heroTitle = isAddMode ? 'Create a book' : 'Refine this book';
  const heroSubtitle = isAddMode
    ? 'Name it once — track spending, income, and shared tabs in one place.'
    : 'Update the title or switch how this ledger works for you.';

  const renderSegment = (
    type: 'single' | 'group',
    icon: 'person' | 'group',
    label: string,
  ) => {
    const selected = selectedBookType === type;
    return (
      <TouchableOpacity
        style={styles.segmentCell}
        onPress={() => setSelectedBookType(type)}
        activeOpacity={0.92}
        accessibilityRole="button"
        accessibilityState={{ selected }}
      >
        {selected ? (
          <LinearGradient
            colors={[...goldCTA]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.segmentGradientFill}
          >
            <View style={styles.segmentCellInner}>
              <MaterialIcons
                name={icon}
                size={22}
                color={theme.NAVBAR_ACTIVE_TEXT}
              />
              <Text style={[styles.segmentLabel, styles.segmentLabelOnGold]}>
                {label}
              </Text>
            </View>
          </LinearGradient>
        ) : (
          <View style={[styles.segmentCellInner, styles.segmentCellIdle]}>
            <MaterialIcons name={icon} size={22} color={theme.LIGHT_TEXT} />
            <Text style={[styles.segmentLabel, styles.segmentLabelMuted]}>
              {label}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <BottomSheet
      isVisible={isVisible}
      onClose={handleClose}
      title={isAddMode ? 'New book' : 'Edit book'}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 72 : 0}
        style={styles.modalContent}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.bookFormScrollContent}
        >
          <LinearGradient colors={rim} style={styles.bookFormHeroOuter}>
            <LinearGradient
              colors={heroFaceColors}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.bookFormHeroInner}
            >
              <View style={styles.bookFormHeroTop}>
                <LinearGradient
                  colors={['#F0E0C4', '#C6A56B', '#A8894F']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.bookFormHeroChip}
                >
                  <Text
                    style={[
                      styles.bookFormHeroChipText,
                      { color: theme.NAVBAR_ACTIVE_TEXT },
                    ]}
                  >
                    {chipText}
                  </Text>
                </LinearGradient>
                <Text style={styles.bookFormHeroCharCount}>
                  {titleLen}/{maxLen}
                </Text>
              </View>
              <Text style={styles.bookFormHeroTitle}>{heroTitle}</Text>
              <Text style={styles.bookFormHeroSubtitle}>{heroSubtitle}</Text>
            </LinearGradient>
          </LinearGradient>

          <LinearGradient colors={rim} style={styles.formSectionOuter}>
            <View style={styles.formSectionInner}>
              <View style={styles.nameFieldHeaderRow}>
                <Text style={styles.fieldLabel}>Book name</Text>
              </View>
              <TextInput
                style={[styles.input, nameFocused && styles.inputFocused]}
                value={newBookTitle}
                placeholder="Personal, Trip, Home…"
                placeholderTextColor={theme.PLACEHOLDER_COLOR}
                maxLength={maxLen}
                onChangeText={setNewBookTitle}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
              />
            </View>
          </LinearGradient>

          <LinearGradient colors={rim} style={styles.bookTypeSectionOuter}>
            <View style={styles.bookTypeSectionInner}>
              <Text style={styles.bookTypeHeader}>Ledger type</Text>
              <Text style={styles.bookTypeHelper}>
                Solo keeps it private. Group unlocks shared expenses and splits.
              </Text>

              <View style={styles.segmentTrack}>
                {renderSegment('single', 'person', 'Solo')}
                {renderSegment('group', 'group', 'Group')}
              </View>
            </View>
          </LinearGradient>

          <View style={styles.modalButtonContainer}>
            {!isAddMode && !selectedBook.isShared && (
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={onDelete}
                activeOpacity={0.85}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.modalButtonPrimary}
              onPress={onSubmit}
              activeOpacity={0.92}
              disabled={saving}
            >
              <LinearGradient
                colors={[...goldCTA]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.modalButtonPrimaryInner}
              >
                {saving ? (
                  <ActivityIndicator color={theme.NAVBAR_ACTIVE_TEXT} />
                ) : (
                  <Text style={styles.modalButtonText}>
                    {isAddMode ? 'Create book' : 'Save changes'}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
