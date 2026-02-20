import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
} from 'react-native';
import { MaterialIcons } from '../../../utils/Icons';
import { useTheme } from '../../../utils/colors';
import { useModal } from '../../../context/ModalContext';
import { savingsGoalService, SavingsGoal } from '../../../services/SavingsGoalService';
import Animated, { FadeInDown } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

const SavingsGoalsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { showAlert } = useModal();
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetAmount: '',
    targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isGroup: false,
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = useCallback(async () => {
    try {
      const data = await savingsGoalService.getGoals({ status: 'active' });
      setGoals(data);
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadGoals();
  }, [loadGoals]);

  const handleCreateGoal = useCallback(async () => {
    if (!newGoal.title || !newGoal.targetAmount) {
      await showAlert('Error', 'Please fill all required fields', 'error');
      return;
    }

    const goal = await savingsGoalService.createGoal({
      title: newGoal.title,
      description: newGoal.description,
      targetAmount: parseFloat(newGoal.targetAmount),
      targetDate: newGoal.targetDate,
    });

    if (goal) {
      setShowCreateModal(false);
      setNewGoal({
        title: '',
        description: '',
        targetAmount: '',
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isGroup: false,
      });
      loadGoals();
    }
  }, [newGoal, showAlert, loadGoals]);

  const renderGoal = useCallback(({ item, index }: { item: SavingsGoal; index: number }) => {
    const progress = (item.currentAmount / item.targetAmount) * 100;
    const remaining = item.targetAmount - item.currentAmount;
    const daysLeft = Math.ceil(
      (new Date(item.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );

    return (
      <Animated.View entering={FadeInDown.delay(index * 50)}>
        <TouchableOpacity
          style={[styles.goalCard, { backgroundColor: theme.BACKGROUND_LIGHT }]}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[theme.PURPLE, theme.LIGHT_PURPLE]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.goalHeader}
          >
            <Text style={styles.goalEmoji}>{item.isGroup ? '👥' : '💰'}</Text>
            <View style={styles.goalHeaderContent}>
              <Text style={styles.goalTitle}>{item.title}</Text>
              <Text style={styles.goalSubtitle}>{item.description}</Text>
            </View>
          </LinearGradient>

          <View style={styles.goalBody}>
            <View style={styles.amountRow}>
              <View>
                <Text style={[styles.amountLabel, { color: theme.LIGHT_TEXT }]}>Saved</Text>
                <Text style={[styles.currentAmount, { color: theme.PURPLE }]}>
                  ₹{item.currentAmount.toLocaleString()}
                </Text>
              </View>
              <View style={styles.targetContainer}>
                <Text style={[styles.amountLabel, { color: theme.LIGHT_TEXT }]}>Target</Text>
                <Text style={[styles.targetAmount, { color: theme.TEXT }]}>
                  ₹{item.targetAmount.toLocaleString()}
                </Text>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(progress, 100)}%`,
                      backgroundColor: progress >= 100 ? theme.SUCCESS : theme.PURPLE,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.progressText, { color: theme.TEXT }]}>
                {progress.toFixed(0)}% Complete
              </Text>
            </View>

            <View style={styles.footer}>
              <View style={styles.infoItem}>
                <MaterialIcons name="schedule" size={16} color={theme.ICON_MUTED} />
                <Text style={[styles.infoText, { color: theme.LIGHT_TEXT }]}>
                  {daysLeft > 0 ? `${daysLeft} days left` : 'Goal reached!'}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <MaterialIcons name="people" size={16} color={theme.ICON_MUTED} />
                <Text style={[styles.infoText, { color: theme.LIGHT_TEXT }]}>
                  {item.participants.length} {item.participants.length === 1 ? 'person' : 'people'}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }, [theme]);

  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: theme.TEXT }]}>Savings Goals</Text>
          <Text style={[styles.headerSubtitle, { color: theme.LIGHT_TEXT }]}>
            Save together, achieve more
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: theme.PURPLE }]}
          onPress={() => setShowCreateModal(true)}
        >
          <MaterialIcons name="add" size={24} color={theme.NAVBAR_ACTIVE_TEXT} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={goals}
        renderItem={renderGoal}
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
            <MaterialIcons name="savings" size={64} color={theme.ICON_COLOR} />
            <Text style={[styles.emptyText, { color: theme.TEXT }]}>No savings goals yet</Text>
            <Text style={[styles.emptySubtext, { color: theme.LIGHT_TEXT }]}>
              Create a goal and start saving!
            </Text>
          </View>
        }
      />

      {/* Create Goal Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.BACKGROUND_LIGHT }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.TEXT }]}>Create Savings Goal</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <MaterialIcons name="close" size={24} color={theme.TEXT} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={[styles.input, { color: theme.TEXT, borderColor: theme.BORDER_COLOR }]}
              placeholder="Goal title"
              placeholderTextColor={theme.LIGHT_TEXT}
              value={newGoal.title}
              onChangeText={text => setNewGoal({ ...newGoal, title: text })}
            />

            <TextInput
              style={[styles.input, styles.textArea, { color: theme.TEXT, borderColor: theme.BORDER_COLOR }]}
              placeholder="Description (optional)"
              placeholderTextColor={theme.LIGHT_TEXT}
              value={newGoal.description}
              onChangeText={text => setNewGoal({ ...newGoal, description: text })}
              multiline
            />

            <TextInput
              style={[styles.input, { color: theme.TEXT, borderColor: theme.BORDER_COLOR }]}
              placeholder="Target amount"
              placeholderTextColor={theme.LIGHT_TEXT}
              value={newGoal.targetAmount}
              onChangeText={text => setNewGoal({ ...newGoal, targetAmount: text })}
              keyboardType="numeric"
            />

            <TouchableOpacity
              style={[styles.createButton, styles.submitButton, { backgroundColor: theme.PURPLE }]}
              onPress={handleCreateGoal}
            >
              <Text style={[styles.submitButtonText, { color: theme.SECONDARY }]}>
                Create Goal
              </Text>
            </TouchableOpacity>
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
      backgroundColor: theme.BACKGROUND,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      paddingTop: 60,
      borderBottomWidth: 1,
      borderBottomColor: theme.BORDER_COLOR,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '700',
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 14,
    },
    createButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    listContent: {
      padding: 16,
    },
    goalCard: {
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: 16,
      ...theme.shadow && {
        shadowColor: theme.SHADOW,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      },
    },
    goalHeader: {
      flexDirection: 'row',
      padding: 16,
      alignItems: 'center',
    },
    goalEmoji: {
      fontSize: 40,
      marginRight: 12,
    },
    goalHeaderContent: {
      flex: 1,
    },
    goalTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#FFFFFF',
      marginBottom: 4,
    },
    goalSubtitle: {
      fontSize: 14,
      color: '#FFFFFF',
      opacity: 0.9,
    },
    goalBody: {
      padding: 16,
    },
    amountRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    amountLabel: {
      fontSize: 12,
      marginBottom: 4,
    },
    currentAmount: {
      fontSize: 24,
      fontWeight: '700',
    },
    targetContainer: {
      alignItems: 'flex-end',
    },
    targetAmount: {
      fontSize: 20,
      fontWeight: '700',
    },
    progressContainer: {
      marginBottom: 12,
    },
    progressBar: {
      height: 10,
      backgroundColor: theme.BACKGROUND,
      borderRadius: 5,
      overflow: 'hidden',
      marginBottom: 8,
    },
    progressFill: {
      height: '100%',
      borderRadius: 5,
    },
    progressText: {
      fontSize: 14,
      fontWeight: '600',
    },
    footer: {
      flexDirection: 'row',
      gap: 16,
    },
    infoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    infoText: {
      fontSize: 12,
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
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: '700',
    },
    input: {
      borderWidth: 1,
      borderRadius: 12,
      padding: 14,
      fontSize: 16,
      marginBottom: 16,
    },
    textArea: {
      minHeight: 100,
      textAlignVertical: 'top',
    },
    submitButton: {
      marginTop: 8,
      padding: 16,
      alignItems: 'center',
    },
    submitButtonText: {
      fontSize: 18,
      fontWeight: '700',
    },
  });

export default SavingsGoalsScreen;

