import React, { useState } from 'react';
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

const ChallengesScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { userId } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
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

  const {
    data: challenges = [],
    isLoading: loading,
    refetch,
    isRefetching: refreshing,
  } = useFetchChallenges({ status: 'active' });
  const { mutate: createChallenge, isLoading: isCreating } =
    useCreateChallenge();
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

  const handleRefresh = () => {
    refetch();
  };

  const handleCreateChallenge = async () => {
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

    createChallenge(
      {
        title: newChallenge.title,
        description: newChallenge.description,
        type: newChallenge.type,
        targetAmount: newChallenge.targetAmount
          ? parseFloat(newChallenge.targetAmount)
          : undefined,
        targetCategory: newChallenge.targetCategory || undefined,
        endDate: newChallenge.endDate,
      },
      {
        onSuccess: () => {
          setShowCreateModal(false);
          setNewChallenge({
            title: '',
            description: '',
            type: 'save_amount',
            targetAmount: '',
            targetCategory: '',
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          });
        },
      },
    );
  };

  const handleChallengePress = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
  };

  const handleDeleteChallenge = (challengeId: string) => {
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
  };

  const renderChallenge = ({
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
  };

  const challengeTypes = [
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
  ];

  const filteredCategories =
    (categoriesData as CategoryFormData[])?.filter(
      category => category.type === 'expense',
    ) || [];

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <View style={styles.headerTitleContainer}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <IoniconsIcon
                name="arrow-back"
                size={24}
                color={theme.SECONDARY}
              />
            </TouchableOpacity>
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
            <MaterialIcons name="add" size={24} color={theme.PURPLE} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
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
              colors={[theme.PURPLE]}
              tintColor={theme.PURPLE}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons
                name="emoji-events"
                size={64}
                color={theme.PURPLE}
              />
              <Text style={[styles.emptyText, { color: theme.TEXT }]}>
                No active challenges
              </Text>
              <Text style={[styles.emptySubtext, { color: theme.LIGHT_TEXT }]}>
                Create a challenge to track your financial goals!
              </Text>
            </View>
          }
        />
      </View>

      {/* Create Challenge Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowCreateModal(false)}
          >
            <Animated.View
              entering={SlideInDown.springify().damping(15)}
              style={[
                styles.modalContent,
                { backgroundColor: theme.BACKGROUND_LIGHT },
              ]}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={e => e.stopPropagation()}
              >
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={styles.scrollContent}
                >
                  {/* Header */}
                  <Animated.View
                    entering={FadeIn.delay(100)}
                    style={styles.modalHeader}
                  >
                    <View>
                      <Text style={[styles.modalTitle, { color: theme.TEXT }]}>
                        Create Challenge
                      </Text>
                      <Text
                        style={[
                          styles.modalSubtitle,
                          { color: theme.LIGHT_TEXT },
                        ]}
                      >
                        Set your financial goal
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => setShowCreateModal(false)}
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
                  </Animated.View>

                  {/* Title Input */}
                  <Animated.View entering={FadeIn.delay(150)}>
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
                  </Animated.View>

                  {/* Description Input */}
                  <Animated.View entering={FadeIn.delay(200)}>
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
                  </Animated.View>

                  {/* Challenge Type Selector */}
                  <Animated.View entering={FadeIn.delay(250)}>
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
                          <Animated.View
                            key={type.id}
                            entering={FadeInDown.delay(300 + index * 50)}
                          >
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
                                  type: type.id as Challenge['type'],
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
                                  <Animated.View
                                    entering={FadeIn}
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
                                  </Animated.View>
                                )}
                              </View>
                            </TouchableOpacity>
                          </Animated.View>
                        );
                      })}
                    </View>
                  </Animated.View>

                  {/* Conditional Fields */}
                  {(newChallenge.type === 'save_amount' ||
                    newChallenge.type === 'category_limit') && (
                    <Animated.View entering={FadeIn.delay(400)}>
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
                    </Animated.View>
                  )}

                  {newChallenge.type === 'category_limit' && (
                    <Animated.View entering={FadeIn.delay(450)}>
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
                    </Animated.View>
                  )}

                  {/* End Date */}
                  <Animated.View entering={FadeIn.delay(500)}>
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
                  </Animated.View>

                  {/* Submit Button */}
                  <Animated.View entering={FadeIn.delay(550)}>
                    <TouchableOpacity
                      style={[
                        styles.submitButton,
                        {
                          backgroundColor: theme.PURPLE,
                          opacity: isCreating ? 0.6 : 1,
                          shadowColor: theme.PURPLE,
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.3,
                          shadowRadius: 8,
                          elevation: 6,
                        },
                      ]}
                      onPress={handleCreateChallenge}
                      disabled={isCreating}
                      activeOpacity={0.8}
                    >
                      {isCreating ? (
                        <View style={styles.loadingContainer}>
                          <Text
                            style={[
                              styles.submitButtonText,
                              { color: theme.SECONDARY },
                            ]}
                          >
                            Creating...
                          </Text>
                        </View>
                      ) : (
                        <View style={styles.buttonContent}>
                          <MaterialIcons
                            name="add-circle-outline"
                            size={20}
                            color={theme.SECONDARY}
                          />
                          <Text
                            style={[
                              styles.submitButtonText,
                              { color: theme.SECONDARY },
                            ]}
                          >
                            Create Challenge
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </Animated.View>
                </ScrollView>
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
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
                {selectedChallenge && isUserCreator(selectedChallenge) && (
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
      backgroundColor: theme.PURPLE,
    },
    headerContainer: {
      paddingTop: Platform.OS === 'ios' ? '15%' : '10%',
      paddingHorizontal: 20,
      paddingBottom: 20,
      backgroundColor: theme.PURPLE,
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
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
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 0,
      maxHeight: '92%',
      overflow: 'hidden',
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
