import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { MaterialIcons, IoniconsIcon } from '../../../utils/Icons';
import { useTheme } from '../../../utils/colors';
import { useNavigation } from '@react-navigation/native';
import { Challenge } from '../../../services/ChallengeService';
import ChallengeCard from '../../../components/ChallengeCard';
import Animated, {
  FadeInDown,
  FadeIn,
  SlideInDown,
  withSpring,
} from 'react-native-reanimated';
import {
  useFetchChallenges,
  useCreateChallenge,
  useUpdateChallenge,
  useFetchMyChallengeProgress,
  useDeleteChallenge,
} from '../../../ReactQueryHook/challenge.hook';
import { useAuth } from '../../../context/AuthContext';
import { useFetchUserDetails } from '../../../ReactQueryHook/auth.hook';
import { useModal } from '../../../context/ModalContext';
import DatePicker from '../../../components/core/DatePicker';
import Select from '../../../components/core/Select';
import { useFetchCategories } from '../../../ReactQueryHook/category.hook';
import { CategoryFormData } from '../../../utils/types';
import InputComponent from '../../../components/core/Input';
import TextAreaComponent from '../../../components/core/TextArea';
import InputNumberComponent from '../../../components/core/InputNumber';
import BannerAdView from '../../../components/ads/BannerAdView';
import { SkeletonChallengeCard } from '../../../components/skeleton';

const ChallengesScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { userId } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [challengeFilter, setChallengeFilter] = useState<'active' | 'old'>('active');
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null,
  );
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    type: 'save_amount' as Challenge['type'],
    targetAmount: '',
    targetCategory: '',
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  const challengeStatus =
    challengeFilter === 'active'
      ? 'active'
      : ['completed', 'failed', 'cancelled'];
  const {
    data: challenges = [],
    isLoading: loading,
    refetch,
    isRefetching: refreshing,
  } = useFetchChallenges({ status: challengeStatus, limit: 50 });
  const { mutate: createChallenge, isLoading: isCreating } =
    useCreateChallenge();
  const { mutate: updateChallenge, isLoading: isUpdating } =
    useUpdateChallenge();
  const { data: myProgress } = useFetchMyChallengeProgress(
    selectedChallenge?.id || '',
  );
  const { mutate: deleteChallenge, isLoading: isDeleting } =
    useDeleteChallenge();
  const { data: categoriesData } = useFetchCategories();
  const { data: currentUserData } = useFetchUserDetails();
  const { showAlert, showConfirm } = useModal();

  // Get userId from currentUser API response - backend returns user object with _id
  const currentUserId = currentUserData?._id || currentUserData?.id || userId;

  // Helper to check if user is creator
  const isUserCreator = (challenge: Challenge | null): boolean => {
    if (!challenge || !currentUserId) return false;
    const creatorId =
      typeof challenge.createdBy === 'object'
        ? (challenge.createdBy as any)?._id || (challenge.createdBy as any)?.id
        : challenge.createdBy;
    if (!creatorId) return false;
    return String(creatorId) === String(currentUserId);
  };

  const handleRefresh = useCallback(() => refetch(), [refetch]);

  const resetChallengeForm = useCallback(() => {
    setEditingChallenge(null);
    setNewChallenge({
      title: '',
      description: '',
      type: 'save_amount',
      targetAmount: '',
      targetCategory: '',
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
  }, []);

  const openEditModal = useCallback((challenge: Challenge) => {
    setEditingChallenge(challenge);
    setNewChallenge({
      title: challenge.title || '',
      description: challenge.description || '',
      type: challenge.type || 'save_amount',
      targetAmount: challenge.targetAmount?.toString() || '',
      targetCategory: challenge.targetCategory || '',
      endDate: challenge.endDate
        ? new Date(challenge.endDate)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    setSelectedChallenge(null);
    setShowCreateModal(true);
  }, []);

  const handleCreateChallenge = useCallback(async () => {
    if (!newChallenge.title || !newChallenge.description) {
      await showAlert('Error', 'Please fill all required fields', 'error');
      return;
    }

    if (
      newChallenge.type === 'category_limit' &&
      !newChallenge.targetCategory
    ) {
      await showAlert(
        'Error',
        'Please select a category for category limit challenge',
        'error',
      );
      return;
    }

    const payload = {
      title: newChallenge.title,
      description: newChallenge.description,
      type: newChallenge.type,
      targetAmount: newChallenge.targetAmount
        ? parseFloat(newChallenge.targetAmount)
        : undefined,
      targetCategory: newChallenge.targetCategory || undefined,
      endDate: newChallenge.endDate,
    };

    if (editingChallenge) {
      updateChallenge(
        { challengeId: editingChallenge.id, data: payload },
        {
          onSuccess: () => {
            setShowCreateModal(false);
            resetChallengeForm();
          },
        },
      );
    } else {
      createChallenge(payload, {
        onSuccess: () => {
          setShowCreateModal(false);
          resetChallengeForm();
        },
      });
    }
  }, [createChallenge, updateChallenge, newChallenge, editingChallenge, showAlert]);

  const handleChallengePress = useCallback((challenge: Challenge) => {
    setSelectedChallenge(challenge);
  }, []);

  const handleDeleteChallenge = useCallback((challengeId: string) => {
    showConfirm(
      'Delete Challenge',
      'Are you sure you want to delete this challenge? This action cannot be undone.',
      () => {
        deleteChallenge(challengeId, {
          onSuccess: () => {
            if (selectedChallenge?.id === challengeId) {
              setSelectedChallenge(null);
            }
          },
        });
      },
    );
  }, [deleteChallenge, selectedChallenge, showConfirm]);

  const renderChallenge = useCallback(({
    item,
    index,
  }: {
    item: Challenge;
    index: number;
  }) => {
    const progress = item.userProgress?.progress || 0;
    const canDelete = isUserCreator(item);

    return (
      <Animated.View entering={FadeInDown.delay(index * 50)}>
        <ChallengeCard
          challenge={item}
          progress={progress}
          onPress={() => handleChallengePress(item)}
          onDelete={
            canDelete ? () => handleDeleteChallenge(item.id) : undefined
          }
        />
      </Animated.View>
    );
  }, [handleChallengePress, handleDeleteChallenge, isUserCreator]);

  const challengeTypes = useMemo((): Array<{ id: Challenge['type']; title: string; description: string }> => [
    {
      id: 'save_amount',
      title: 'Save Amount',
      description: 'Save a specific amount',
    },
    {
      id: 'spend_less',
      title: 'Spend Less',
      description: 'Spend less than previous period',
    },
    {
      id: 'no_purchases',
      title: 'No Purchases',
      description: 'Avoid making purchases',
    },
    {
      id: 'category_limit',
      title: 'Category Limit',
      description: 'Limit spending in a category',
    },
  ], []);

  const filteredCategories = useMemo(() =>
    (categoriesData as CategoryFormData[])
      ?.filter(category => category.type === 'expense')
      .map(category => ({
        id: category.id || (category as any)._id || '',
        title: category.title,
        icon: category.icon,
        type: category.type,
      }))
      .filter(category => category.id) || [], [categoriesData]);

  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <View style={styles.headerTitleContainer}>
            <MaterialIcons
              name="emoji-events"
              size={28}
              color={theme.SECONDARY}
            />
            <Text style={styles.headerText}>Challenges</Text>
          </View>
          <TouchableOpacity
            style={[styles.createButton, { backgroundColor: theme.SECONDARY }]}
            onPress={() => setShowCreateModal(true)}
          >
            <MaterialIcons name="add" size={24} color={theme.NAVBAR_ACTIVE_TEXT} />
          </TouchableOpacity>
        </View>
        <View style={[styles.filterRow, { backgroundColor: theme.INPUT_BACKGROUND || theme.BACKGROUND }]}>
          <TouchableOpacity
            style={[
              styles.filterTab,
              challengeFilter === 'active' && styles.filterTabActive,
              challengeFilter === 'active' && {
                backgroundColor: theme.SECONDARY,
                shadowColor: theme.SECONDARY,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.35,
                shadowRadius: 6,
                elevation: 4,
              },
            ]}
            onPress={() => setChallengeFilter('active')}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name="bolt"
              size={18}
              color={challengeFilter === 'active' ? theme.NAVBAR_ACTIVE_TEXT : theme.LIGHT_TEXT}
            />
            <Text
              style={[
                styles.filterTabText,
                {
                  color: challengeFilter === 'active'
                    ? theme.NAVBAR_ACTIVE_TEXT
                    : theme.LIGHT_TEXT,
                  fontWeight: challengeFilter === 'active' ? '700' : '600',
                },
              ]}
            >
              Active
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterTab,
              challengeFilter === 'old' && styles.filterTabActive,
              challengeFilter === 'old' && {
                backgroundColor: theme.PURPLE,
                shadowColor: theme.PURPLE,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.35,
                shadowRadius: 6,
                elevation: 4,
              },
            ]}
            onPress={() => setChallengeFilter('old')}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name="history"
              size={18}
              color={challengeFilter === 'old' ? '#FFFFFF' : theme.LIGHT_TEXT}
            />
            <Text
              style={[
                styles.filterTabText,
                {
                  color: challengeFilter === 'old'
                    ? '#FFFFFF'
                    : theme.LIGHT_TEXT,
                  fontWeight: challengeFilter === 'old' ? '700' : '600',
                },
              ]}
            >
              Old
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {loading && challenges.length === 0 ? (
          <View style={styles.listContent}>
            {[0, 1, 2].map(index => (
              <Animated.View
                key={index}
                entering={FadeInDown.delay(150 + index * 80).springify()}
              >
                <SkeletonChallengeCard theme={theme} />
              </Animated.View>
            ))}
          </View>
        ) : (
          <FlatList
            data={challenges}
            renderItem={renderChallenge}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[theme.SECONDARY]}
                tintColor={theme.SECONDARY}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MaterialIcons
                  name="emoji-events"
                  size={64}
                  color={theme.ICON_COLOR}
                />
                <Text style={[styles.emptyText, { color: theme.TEXT }]}>
                  {challengeFilter === 'active'
                    ? 'No active challenges'
                    : 'No old challenges'}
                </Text>
                <Text style={[styles.emptySubtext, { color: theme.LIGHT_TEXT }]}>
                  {challengeFilter === 'active'
                    ? 'Create a challenge to track your financial goals!'
                    : 'Completed, failed, or cancelled challenges will appear here.'}
                </Text>
              </View>
            }
          />
        )}
        <BannerAdView placement="challenges" />
      </View>

      {/* Create Challenge Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCreateModal(false)}
        statusBarTranslucent
      >
        <View style={styles.modalOverlay} pointerEvents="box-none">
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => {
              setShowCreateModal(false);
              resetChallengeForm();
            }}
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalKeyboardWrap}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
          >
            <View style={styles.modalContentTouchable} collapsable={false}>
              <View
                style={[
                  styles.modalContent,
                  { backgroundColor: theme.BACKGROUND_LIGHT },
                ]}
              >
                <View style={styles.modalScrollWrapper}>
                  <ScrollView
                    style={styles.modalScrollView}
                    showsVerticalScrollIndicator={true}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.scrollContent}
                    bounces={true}
                    nestedScrollEnabled={true}
                    keyboardDismissMode="on-drag"
                  >
                  {/* Header */}
                  <View style={styles.modalHeader}>
                    <View>
                      <Text style={[styles.modalTitle, { color: theme.TEXT }]}>
                        {editingChallenge ? 'Edit Challenge' : 'Create Challenge'}
                      </Text>
                      <Text
                        style={[
                          styles.modalSubtitle,
                          { color: theme.LIGHT_TEXT },
                        ]}
                      >
                        {editingChallenge ? 'Update your challenge' : 'Set your financial goal'}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        setShowCreateModal(false);
                        resetChallengeForm();
                      }}
                      style={[
                        styles.closeButton,
                        { backgroundColor: theme.BACKGROUND },
                      ]}
                    >
                      <MaterialIcons
                        name="close"
                        size={20}
                        color={theme.TEXT}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Title Input */}
                  <View>
                    <Text style={[styles.label, { color: theme.TEXT }]}>
                      Challenge Title{' '}
                      <Text style={{ color: theme.ERROR }}>*</Text>
                    </Text>
                    <InputComponent
                      placeholder="e.g., Save ₹5000 this month"
                      value={newChallenge.title}
                      onChangeText={text =>
                        setNewChallenge({ ...newChallenge, title: text })
                      }
                    />
                  </View>

                  {/* Description Input */}
                  <View>
                    <Text style={[styles.label, { color: theme.TEXT }]}>
                      Description <Text style={{ color: theme.ERROR }}>*</Text>
                    </Text>
                    <TextAreaComponent
                      placeholder="Describe your challenge goal and motivation..."
                      value={newChallenge.description}
                      onChangeText={text =>
                        setNewChallenge({ ...newChallenge, description: text })
                      }
                      numberOfLines={4}
                    />
                  </View>

                  {/* Challenge Type Selector */}
                  <View>
                    <Text style={[styles.label, { color: theme.TEXT }]}>
                      Challenge Type{' '}
                      <Text style={{ color: theme.ERROR }}>*</Text>
                    </Text>
                    <View style={styles.typeContainer}>
                      {challengeTypes.map((type, index) => {
                        const isSelected = newChallenge.type === type.id;
                        const icons = {
                          save_amount: '💰',
                          spend_less: '📉',
                          no_purchases: '🚫',
                          category_limit: '🎯',
                        };
                        return (
                          <View key={type.id}>
                            <TouchableOpacity
                              style={[
                                styles.typeOption,
                                {
                                  backgroundColor: isSelected
                                    ? theme.PURPLE
                                    : theme.BACKGROUND,
                                  borderColor: isSelected
                                    ? theme.PURPLE
                                    : theme.BORDER_COLOR,
                                  borderWidth: isSelected ? 2 : 1,
                                  shadowColor: isSelected
                                    ? theme.PURPLE
                                    : 'transparent',
                                  shadowOffset: { width: 0, height: 2 },
                                  shadowOpacity: isSelected ? 0.3 : 0,
                                  shadowRadius: 4,
                                  elevation: isSelected ? 4 : 0,
                                },
                              ]}
                              onPress={() =>
                                setNewChallenge({
                                  ...newChallenge,
                                  type: type.id,
                                  targetCategory: '',
                                })
                              }
                              activeOpacity={0.7}
                            >
                              <View style={styles.typeOptionContent}>
                                <Text style={styles.typeIcon}>
                                  {icons[type.id as keyof typeof icons]}
                                </Text>
                                <View style={styles.typeOptionTextContainer}>
                                  <Text
                                    style={[
                                      styles.typeOptionText,
                                      {
                                        color: isSelected
                                          ? theme.SECONDARY
                                          : theme.TEXT,
                                      },
                                    ]}
                                  >
                                    {type.title}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.typeOptionDesc,
                                      {
                                        color: isSelected
                                          ? theme.SECONDARY + 'CC'
                                          : theme.LIGHT_TEXT,
                                      },
                                    ]}
                                  >
                                    {type.description}
                                  </Text>
                                </View>
                                {isSelected && (
                                  <View
                                    style={[
                                      styles.checkIcon,
                                      { backgroundColor: theme.SECONDARY },
                                    ]}
                                  >
                                    <MaterialIcons
                                      name="check"
                                      size={16}
                                      color={theme.PURPLE}
                                    />
                                  </View>
                                )}
                              </View>
                            </TouchableOpacity>
                          </View>
                        );
                      })}
                    </View>
                  </View>

                  {/* Conditional Fields */}
                  {(newChallenge.type === 'save_amount' ||
                    newChallenge.type === 'category_limit') && (
                    <View>
                      <Text style={[styles.label, { color: theme.TEXT }]}>
                        Target Amount{' '}
                        {newChallenge.type === 'save_amount' && (
                          <Text
                            style={{ color: theme.LIGHT_TEXT, fontSize: 12 }}
                          >
                            (optional)
                          </Text>
                        )}
                        {newChallenge.type === 'category_limit' && (
                          <Text style={{ color: theme.ERROR }}>*</Text>
                        )}
                      </Text>
                      <InputNumberComponent
                        placeholder="Enter target amount"
                        value={newChallenge.targetAmount}
                        onChangeText={text =>
                          setNewChallenge({
                            ...newChallenge,
                            targetAmount: text,
                          })
                        }
                      />
                    </View>
                  )}

                  {newChallenge.type === 'category_limit' && (
                    <View>
                      <Text style={[styles.label, { color: theme.TEXT }]}>
                        Category <Text style={{ color: theme.ERROR }}>*</Text>
                      </Text>
                      <Select
                        value={newChallenge.targetCategory}
                        onPress={value =>
                          setNewChallenge({
                            ...newChallenge,
                            targetCategory: value,
                          })
                        }
                        placeholder="Select category"
                        options={filteredCategories}
                        bookId=""
                      />
                    </View>
                  )}

                  {/* End Date */}
                  <View>
                    <Text style={[styles.label, { color: theme.TEXT }]}>
                      End Date <Text style={{ color: theme.ERROR }}>*</Text>
                    </Text>
                    <DatePicker
                      value={newChallenge.endDate}
                      onChanged={date =>
                        setNewChallenge({ ...newChallenge, endDate: date })
                      }
                      placeholder="Select end date"
                    />
                  </View>

                  {/* Submit Button */}
                  <View>
                    <TouchableOpacity
                      style={[
                        styles.submitButton,
                        {
                          backgroundColor: theme.PURPLE,
                          opacity: isCreating || isUpdating ? 0.6 : 1,
                          shadowColor: theme.PURPLE,
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.3,
                          shadowRadius: 8,
                          elevation: 6,
                        },
                      ]}
                      onPress={handleCreateChallenge}
                      disabled={isCreating || isUpdating}
                      activeOpacity={0.8}
                    >
                      {isCreating || isUpdating ? (
                        <View style={styles.loadingContainer}>
                          <Text
                            style={[
                              styles.submitButtonText,
                              { color: theme.SECONDARY },
                            ]}
                          >
                            {editingChallenge ? 'Updating...' : 'Creating...'}
                          </Text>
                        </View>
                      ) : (
                        <View style={styles.buttonContent}>
                          <MaterialIcons
                            name={editingChallenge ? 'save' : 'add-circle-outline'}
                            size={20}
                            color={theme.SECONDARY}
                          />
                          <Text
                            style={[
                              styles.submitButtonText,
                              { color: theme.SECONDARY },
                            ]}
                          >
                            {editingChallenge ? 'Update Challenge' : 'Create Challenge'}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Challenge Detail Modal */}
      <Modal
        visible={selectedChallenge !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedChallenge(null)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.detailModalContent,
              { backgroundColor: theme.BACKGROUND_LIGHT },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text
                style={[styles.modalTitle, { color: theme.TEXT }]}
                numberOfLines={1}
              >
                {selectedChallenge?.title}
              </Text>
              <View style={styles.modalHeaderActions}>
                {selectedChallenge &&
                  isUserCreator(selectedChallenge) &&
                  selectedChallenge.status === 'active' && (
                  <>
                    <TouchableOpacity
                      onPress={() => openEditModal(selectedChallenge)}
                      style={[
                        styles.deleteButtonHeader,
                        { backgroundColor: theme.PURPLE + '20' },
                      ]}
                      activeOpacity={0.7}
                    >
                      <MaterialIcons
                        name="edit"
                        size={20}
                        color={theme.PURPLE}
                      />
                      <Text
                        style={[styles.deleteButtonText, { color: theme.PURPLE }]}
                      >
                        Edit
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteChallenge(selectedChallenge.id)}
                      style={[
                        styles.deleteButtonHeader,
                        { backgroundColor: theme.ERROR + '15' },
                      ]}
                      activeOpacity={0.7}
                    >
                      <MaterialIcons
                        name="delete-outline"
                        size={20}
                        color={theme.ERROR}
                      />
                      <Text
                        style={[styles.deleteButtonText, { color: theme.ERROR }]}
                      >
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
                <TouchableOpacity
                  onPress={() => setSelectedChallenge(null)}
                  style={[
                    styles.closeButtonHeader,
                    { backgroundColor: theme.BACKGROUND },
                  ]}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="close" size={20} color={theme.TEXT} />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.detailSection}>
                <Text style={[styles.detailLabel, { color: theme.LIGHT_TEXT }]}>
                  Description
                </Text>
                <Text style={[styles.detailValue, { color: theme.TEXT }]}>
                  {selectedChallenge?.description}
                </Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={[styles.detailLabel, { color: theme.LIGHT_TEXT }]}>
                  Type
                </Text>
                <View
                  style={[
                    styles.typeBadge,
                    { backgroundColor: theme.PURPLE + '20' },
                  ]}
                >
                  <Text style={[styles.typeBadgeText, { color: theme.PURPLE }]}>
                    {selectedChallenge?.type.replace('_', ' ').toUpperCase()}
                  </Text>
                </View>
              </View>

              {selectedChallenge?.targetAmount && (
                <View style={styles.detailSection}>
                  <Text
                    style={[styles.detailLabel, { color: theme.LIGHT_TEXT }]}
                  >
                    Target Amount
                  </Text>
                  <Text
                    style={[
                      styles.detailValue,
                      { color: theme.PURPLE, fontSize: 20, fontWeight: '700' },
                    ]}
                  >
                    ₹{selectedChallenge.targetAmount.toLocaleString('en-IN')}
                  </Text>
                </View>
              )}

              {selectedChallenge?.targetCategory && (
                <View style={styles.detailSection}>
                  <Text
                    style={[styles.detailLabel, { color: theme.LIGHT_TEXT }]}
                  >
                    Target Category
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.TEXT }]}>
                    {(() => {
                      const category = filteredCategories.find(
                        cat => cat.id === selectedChallenge.targetCategory,
                      );
                      return (
                        category?.title || selectedChallenge.targetCategory
                      );
                    })()}
                  </Text>
                </View>
              )}

              <View style={styles.detailSection}>
                <Text style={[styles.detailLabel, { color: theme.LIGHT_TEXT }]}>
                  Start Date
                </Text>
                <Text style={[styles.detailValue, { color: theme.TEXT }]}>
                  {selectedChallenge?.startDate
                    ? new Date(selectedChallenge.startDate).toLocaleDateString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        },
                      )
                    : 'N/A'}
                </Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={[styles.detailLabel, { color: theme.LIGHT_TEXT }]}>
                  End Date
                </Text>
                <Text style={[styles.detailValue, { color: theme.TEXT }]}>
                  {selectedChallenge?.endDate
                    ? new Date(selectedChallenge.endDate).toLocaleDateString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        },
                      )
                    : 'N/A'}
                </Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={[styles.detailLabel, { color: theme.LIGHT_TEXT }]}>
                  Status
                </Text>
                <View
                  style={[
                    styles.statusBadgeDetail,
                    {
                      backgroundColor:
                        selectedChallenge?.status === 'completed'
                          ? theme.SUCCESS + '20'
                          : selectedChallenge?.status === 'cancelled'
                          ? theme.ERROR + '20'
                          : theme.PURPLE + '20',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeTextDetail,
                      {
                        color:
                          selectedChallenge?.status === 'completed'
                            ? theme.SUCCESS
                            : selectedChallenge?.status === 'cancelled'
                            ? theme.ERROR
                            : theme.PURPLE,
                      },
                    ]}
                  >
                    {selectedChallenge?.status?.toUpperCase() || 'ACTIVE'}
                  </Text>
                </View>
              </View>

              {/* Show progress - prioritize userProgress from challenge, then myProgress */}
              {(() => {
                const progressData =
                  selectedChallenge?.userProgress || myProgress;
                const progress = progressData?.progress || 0;
                const currentAmount = progressData?.currentAmount;

                return progressData ? (
                  <View style={styles.detailSection}>
                    <Text
                      style={[styles.detailLabel, { color: theme.LIGHT_TEXT }]}
                    >
                      Your Progress
                    </Text>
                    <View style={styles.progressContainer}>
                      <View
                        style={[
                          styles.progressBar,
                          { backgroundColor: theme.BACKGROUND },
                        ]}
                      >
                        <View
                          style={[
                            styles.progressFill,
                            {
                              width: `${Math.min(progress, 100)}%`,
                              backgroundColor: theme.PURPLE,
                            },
                          ]}
                        />
                      </View>
                      <View style={styles.progressInfo}>
                        <Text
                          style={[
                            styles.progressText,
                            { color: theme.TEXT, fontWeight: '700' },
                          ]}
                        >
                          {progress.toFixed(0)}% Complete
                        </Text>
                      </View>
                      {currentAmount !== undefined && (
                        <Text
                          style={[
                            styles.progressText,
                            {
                              color: theme.LIGHT_TEXT,
                              fontSize: 12,
                              marginTop: 4,
                            },
                          ]}
                        >
                          Current: ₹{currentAmount.toLocaleString('en-IN')}
                        </Text>
                      )}
                    </View>
                  </View>
                ) : null;
              })()}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.HEADER_BACKGROUND,
    },
    headerContainer: {
      paddingTop: Platform.OS === 'ios' ? '15%' : '10%',
      paddingHorizontal: 20,
      paddingBottom: 20,
      backgroundColor: theme.HEADER_BACKGROUND,
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    filterRow: {
      flexDirection: 'row',
      marginTop: 18,
      padding: 5,
      borderRadius: 16,
      gap: 6,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    filterTab: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 12,
      gap: 8,
    },
    filterTabActive: {},
    filterTabText: {
      fontSize: 15,
      letterSpacing: 0.3,
    },
    headerTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerText: {
      color: theme.SECONDARY,
      fontSize: 26,
      fontWeight: '800',
      letterSpacing: 0.5,
    },
    content: {
      flex: 1,
      backgroundColor: theme.BACKGROUND,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      paddingTop: 24,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
        },
        android: {
          elevation: 15,
        },
      }),
    },
    createButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.SECONDARY,
      justifyContent: 'center',
      alignItems: 'center',
      ...Platform.select({
        ios: {
          shadowColor: theme.SECONDARY,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        android: {
          elevation: 6,
        },
      }),
    },
    listContent: {
      padding: 16,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: '600',
      marginTop: 16,
    },
    emptySubtext: {
      fontSize: 14,
      marginTop: 8,
      textAlign: 'center',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'transparent',
      justifyContent: 'flex-end',
      alignItems: 'stretch',
    },
    modalBackdrop: {
      flex: 1,
      minHeight: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalKeyboardWrap: {
      width: '100%',
      maxHeight: '92%',
      height: Dimensions.get('window').height * 0.88,
      minHeight: Dimensions.get('window').height * 0.88,
    },
    modalContentTouchable: {
      width: '100%',
      flex: 1,
      minHeight: 280,
    },
    modalContent: {
      width: Dimensions.get('window').width,
      alignSelf: 'stretch',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 0,
      flex: 1,
      minHeight: 0,
      overflow: 'hidden',
      ...Platform.select({
        android: { elevation: 10 },
      }),
    },
    modalScrollWrapper: {
      flex: 1,
      minHeight: 0,
    },
    modalScrollView: {
      flex: 1,
      minHeight: 0,
    },
    scrollContent: {
      padding: 24,
      paddingBottom: 40,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 28,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.BORDER_COLOR,
    },
    modalSubtitle: {
      fontSize: 14,
      marginTop: 4,
    },
    closeButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalHeaderActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    deleteButtonHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      gap: 6,
    },
    deleteButtonText: {
      fontSize: 14,
      fontWeight: '600',
    },
    closeButtonHeader: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 28,
      fontWeight: '700',
      flex: 1,
      letterSpacing: -0.5,
    },
    label: {
      fontSize: 15,
      fontWeight: '700',
      marginBottom: 10,
      marginTop: 8,
      letterSpacing: 0.2,
    },
    typeContainer: {
      marginBottom: 20,
      gap: 12,
    },
    typeOption: {
      borderRadius: 16,
      padding: 18,
      marginBottom: 0,
    },
    typeOptionContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    typeIcon: {
      fontSize: 32,
    },
    typeOptionTextContainer: {
      flex: 1,
    },
    typeOptionText: {
      fontSize: 17,
      fontWeight: '700',
      marginBottom: 4,
      letterSpacing: 0.2,
    },
    typeOptionDesc: {
      fontSize: 13,
      lineHeight: 18,
    },
    checkIcon: {
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    typeBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      marginTop: 4,
    },
    typeBadgeText: {
      fontSize: 12,
      fontWeight: '700',
    },
    submitButton: {
      marginTop: 24,
      padding: 18,
      borderRadius: 16,
      alignItems: 'center',
      marginBottom: 20,
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    submitButtonText: {
      fontSize: 18,
      fontWeight: '700',
      letterSpacing: 0.3,
    },
    detailModalContent: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      maxHeight: '90%',
    },
    detailSection: {
      marginBottom: 24,
    },
    detailLabel: {
      fontSize: 12,
      fontWeight: '600',
      marginBottom: 8,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    detailValue: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 24,
    },
    progressContainer: {
      marginTop: 8,
    },
    progressBar: {
      height: 10,
      borderRadius: 5,
      overflow: 'hidden',
      marginBottom: 8,
    },
    progressFill: {
      height: '100%',
      borderRadius: 5,
    },
    progressInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    progressText: {
      fontSize: 14,
      fontWeight: '600',
    },
    leaderboardItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.BORDER_COLOR,
    },
    rankBadge: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    rankText: {
      fontSize: 14,
      fontWeight: '700',
    },
    participantName: {
      flex: 1,
      fontSize: 16,
      fontWeight: '600',
    },
    participantProgress: {
      fontSize: 16,
      fontWeight: '700',
    },
    statusBadgeDetail: {
      alignSelf: 'flex-start',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      marginTop: 4,
    },
    statusBadgeTextDetail: {
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    rankBadgeDetail: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
  });

export default ChallengesScreen;
