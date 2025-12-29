import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { MaterialIcons, IoniconsIcon } from '../../../utils/Icons';
import { useTheme } from '../../../utils/colors';
import { useFetchAchievements } from '../../../ReactQueryHook/achievement.hook';
import AchievementBadge from '../../../components/AchievementBadge';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

const AchievementsScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Use React Query hook for dynamic data fetching
  const {
    data: achievements,
    isLoading: loading,
    refetch,
    isRefetching,
  } = useFetchAchievements();

  const handleRefresh = () => {
    refetch();
  };

  const refreshing = isRefetching;

  const categories = [
    { id: null, name: 'All', icon: '🎯' },
    { id: 'streak', name: 'Streaks', icon: '🔥' },
    { id: 'transaction', name: 'Transactions', icon: '📝' },
    { id: 'savings', name: 'Savings', icon: '💰' },
    { id: 'social', name: 'Social', icon: '👥' },
    { id: 'milestone', name: 'Milestones', icon: '⭐' },
  ];

  const filteredAchievements =
    achievements?.achievements?.filter(
      a => !selectedCategory || a.category === selectedCategory,
    ) || [];

  const renderAchievement = ({ item, index }: { item: any; index: number }) => {
    const progressPercentage =
      item.target > 0 ? Math.min((item.progress / item.target) * 100, 100) : 0;

    return (
      <Animated.View entering={FadeInDown.delay(index * 30)}>
        <TouchableOpacity
          style={[
            styles.achievementItem,
            { backgroundColor: theme.BACKGROUND_LIGHT },
          ]}
          activeOpacity={0.8}
        >
          <AchievementBadge
            achievement={item}
            size="medium"
            showProgress={!item.unlocked}
          />
          <View style={styles.achievementInfo}>
            <View style={styles.achievementHeader}>
              <Text style={[styles.achievementTitle, { color: theme.TEXT }]}>
                {item.title}
              </Text>
              {item.unlocked && (
                <View
                  style={[
                    styles.unlockedBadge,
                    { backgroundColor: theme.SUCCESS + '20' },
                  ]}
                >
                  <Text
                    style={[styles.unlockedBadgeText, { color: theme.SUCCESS }]}
                  >
                    ✓
                  </Text>
                </View>
              )}
            </View>
            <Text style={[styles.achievementDesc, { color: theme.LIGHT_TEXT }]}>
              {item.description}
            </Text>
            {!item.unlocked &&
              item.progress !== undefined &&
              item.target !== undefined && (
                <View style={styles.progressSection}>
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${progressPercentage}%`,
                          backgroundColor: theme.PURPLE,
                        },
                      ]}
                    />
                  </View>
                  <Text
                    style={[styles.progressText, { color: theme.LIGHT_TEXT }]}
                  >
                    {item.progress} / {item.target}
                  </Text>
                </View>
              )}
            {item.unlocked && item.unlockedAt && (
              <Text style={[styles.unlockedDate, { color: theme.LIGHT_TEXT }]}>
                Unlocked {new Date(item.unlockedAt).toLocaleDateString()}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const styles = createStyles(theme);

  if (loading && !achievements) {
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
              <Text style={styles.headerText}>Achievements</Text>
            </View>
          </View>
        </View>
        <View style={styles.emptyContainer}>
          <MaterialIcons name="emoji-events" size={64} color={theme.PURPLE} />
          <Text style={[styles.emptyText, { color: theme.TEXT }]}>
            Loading achievements...
          </Text>
        </View>
      </View>
    );
  }

  // Handle case when achievements is null (API error or not available)
  if (!achievements) {
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
              <Text style={styles.headerText}>Achievements</Text>
            </View>
          </View>
        </View>
        <View style={styles.emptyContainer}>
          <MaterialIcons name="emoji-events" size={64} color={theme.PURPLE} />
          <Text style={[styles.emptyText, { color: theme.TEXT }]}>
            No achievements available
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.LIGHT_TEXT }]}>
            Start using the app to unlock achievements!
          </Text>
        </View>
      </View>
    );
  }

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
            <Text style={styles.headerText}>Achievements</Text>
          </View>
          {achievements.totalUnlocked !== undefined && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{achievements.totalUnlocked}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Content Area */}
      <View style={styles.content}>
        {/* Recent Unlocks */}
        {achievements.recentUnlocks &&
          achievements.recentUnlocks.length > 0 && (
            <View style={styles.recentSection}>
              <Text style={[styles.sectionTitle, { color: theme.TEXT }]}>
                Recent Unlocks
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.recentScroll}
              >
                {achievements.recentUnlocks.map((achievement, index) => (
                  <Animated.View
                    key={achievement.id}
                    entering={FadeInDown.delay(index * 50)}
                    style={styles.recentBadge}
                  >
                    <AchievementBadge achievement={achievement} size="large" />
                  </Animated.View>
                ))}
              </ScrollView>
            </View>
          )}

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category.id || 'all'}
              style={[
                styles.categoryChip,
                {
                  backgroundColor:
                    selectedCategory === category.id
                      ? theme.PURPLE
                      : theme.BACKGROUND_LIGHT,
                },
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text
                style={[
                  styles.categoryText,
                  {
                    color:
                      selectedCategory === category.id
                        ? theme.SECONDARY
                        : theme.TEXT,
                  },
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Achievements List */}
        <FlatList
          data={filteredAchievements}
          renderItem={renderAchievement}
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
                No achievements yet
              </Text>
            </View>
          }
        />
      </View>
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
    badgeContainer: {
      backgroundColor: theme.SECONDARY,
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 6,
      minWidth: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeText: {
      color: theme.PURPLE,
      fontSize: 16,
      fontWeight: '800',
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
    recentSection: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.BORDER_COLOR,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 12,
    },
    recentScroll: {
      marginHorizontal: -20,
      paddingHorizontal: 20,
    },
    recentBadge: {
      marginRight: 16,
    },
    categoryScroll: {
      maxHeight: 60,
    },
    categoryContainer: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      gap: 8,
    },
    categoryChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      gap: 6,
    },
    categoryIcon: {
      fontSize: 16,
    },
    categoryText: {
      fontSize: 14,
      fontWeight: '600',
    },
    listContent: {
      padding: 16,
    },
    achievementItem: {
      flexDirection: 'row',
      padding: 16,
      borderRadius: 16,
      marginBottom: 12,
      alignItems: 'center',
      ...(theme.shadow && {
        shadowColor: theme.SHADOW,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }),
    },
    achievementInfo: {
      flex: 1,
      marginLeft: 16,
    },
    achievementTitle: {
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 4,
    },
    achievementDesc: {
      fontSize: 14,
      marginBottom: 4,
    },
    unlockedDate: {
      fontSize: 12,
      marginTop: 4,
    },
    achievementHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    unlockedBadge: {
      width: 20,
      height: 20,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    unlockedBadgeText: {
      fontSize: 12,
      fontWeight: '700',
    },
    progressSection: {
      marginTop: 8,
    },
    progressBarContainer: {
      height: 6,
      backgroundColor: theme.BACKGROUND,
      borderRadius: 3,
      overflow: 'hidden',
      marginBottom: 4,
    },
    progressBarFill: {
      height: '100%',
      borderRadius: 3,
    },
    progressText: {
      fontSize: 11,
      fontWeight: '600',
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
  });

export default AchievementsScreen;
