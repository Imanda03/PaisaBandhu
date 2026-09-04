import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Share,
  TextInput,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import { MaterialIcons } from '../../../utils/Icons';
import { useTheme } from '../../../utils/colors';
import {
  useFetchMyReferral,
  useFetchReferralStats,
  useFetchReferralFriends,
  useReferralCode,
} from '../../../ReactQueryHook/referral.hook';
import Animated, { 
  FadeInDown, 
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { useModal } from '../../../context/ModalContext';
import { useNavigation } from '@react-navigation/native';
import { IoniconsIcon } from '../../../utils/Icons';

const ReferralScreen: React.FC = () => {
  const { theme } = useTheme();
  const { showAlert } = useModal();
  const navigation = useNavigation();
  const [useCodeInput, setUseCodeInput] = useState('');

  // Use React Query hooks for dynamic data fetching
  const {
    data: referral,
    isLoading: loadingReferral,
    refetch: refetchReferral,
  } = useFetchMyReferral();
  const {
    data: stats,
    isLoading: loadingStats,
    refetch: refetchStats,
  } = useFetchReferralStats();
  const {
    data: referralFriendsData,
    isLoading: loadingFriends,
    refetch: refetchFriends,
  } = useFetchReferralFriends();
  const { mutate: useReferralCodeMutation, isLoading: usingCode } =
    useReferralCode();

  const loading =
    loadingReferral || loadingStats || loadingFriends;

  const handleShareReferral = useCallback(async () => {
    if (!referral || !referral.code) return;

    try {
      const message = `Join me on Kharcha Split! Use my referral code: ${referral.code}\n\nTrack expenses, split bills, and save money together! 🎉`;
      await Share.share({
        message,
        title: 'Join Kharcha Split',
      });
    } catch {
      // Share cancelled or failed
    }
  }, [referral]);

  const handleUseCode = useCallback(async () => {
    if (!useCodeInput.trim()) {
      await showAlert('Error', 'Please enter a referral code', 'error');
      return;
    }

    useReferralCodeMutation(useCodeInput.trim(), {
      onSuccess: () => {
        setUseCodeInput('');
      },
    });
  }, [useCodeInput, useReferralCodeMutation, showAlert]);

  const styles = useMemo(() => createStyles(theme), [theme]);

  // Loading animation values
  const pulseScale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    if (loading) {
      // Pulse animation
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );

      // Rotation animation
      rotation.value = withRepeat(
        withTiming(360, { duration: 2000, easing: Easing.linear }),
        -1,
        false
      );

      // Opacity animation
      opacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.5, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }
  }, [loading]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const rotationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const opacityStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (loading) {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <View style={styles.headerTitleContainer}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <IoniconsIcon
                  name="arrow-back"
                  color={theme.SECONDARY}
                  size={24}
                />
              </TouchableOpacity>
              <MaterialIcons name="people" size={28} color={theme.ICON_COLOR} />
              <Text style={styles.headerText}>Referrals</Text>
            </View>
          </View>
        </View>

        {/* Loading Content */}
        <View style={styles.content}>
          <View style={styles.loadingContainer}>
            {/* Animated Icon */}
            <Animated.View style={[styles.loadingIconContainer, pulseStyle]}>
              <Animated.View style={rotationStyle}>
                <LinearGradient
                  colors={[theme.PURPLE, theme.LIGHT_PURPLE]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.loadingIconGradient}
                >
                  <MaterialIcons name="people" size={48} color="#FFFFFF" />
                </LinearGradient>
              </Animated.View>
            </Animated.View>

            {/* Loading Text */}
            <Animated.View style={opacityStyle}>
              <Text style={[styles.loadingTitle, { color: theme.TEXT }]}>
                Loading Referrals
              </Text>
              <Text style={[styles.loadingSubtitle, { color: theme.LIGHT_TEXT }]}>
                Fetching your referral data...
              </Text>
            </Animated.View>

            {/* Activity Indicator */}
            <ActivityIndicator
              size="large"
              color={theme.SECONDARY}
              style={styles.activityIndicator}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <View style={styles.headerTitleContainer}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <IoniconsIcon
                name="arrow-back"
                color={theme.SECONDARY}
                size={24}
              />
            </TouchableOpacity>
            <MaterialIcons name="people" size={28} color={theme.ICON_COLOR} />
            <Text style={styles.headerText}>Referrals</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { flexGrow: 1, paddingBottom: 32 }]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {/* My Referral Code */}
          {referral && referral.code && (
            <Animated.View entering={FadeInDown}>
              <LinearGradient
                colors={[theme.PURPLE, theme.LIGHT_PURPLE]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.referralCard}
              >
                <Text style={styles.cardTitle}>Your Referral Code</Text>
                <Animated.View entering={ZoomIn.delay(200)}>
                  <Text style={styles.referralCode}>
                    {referral.code || 'N/A'}
                  </Text>
                </Animated.View>
                <Text style={styles.cardSubtitle}>
                  Share with friends and earn rewards!
                </Text>
                <TouchableOpacity
                  style={[
                    styles.shareButton,
                    { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                  ]}
                  onPress={handleShareReferral}
                >
                  <MaterialIcons name="share" size={20} color="#FFFFFF" />
                  <Text style={styles.shareButtonText}>Share Code</Text>
                </TouchableOpacity>
              </LinearGradient>
            </Animated.View>
          )}

          {/* Stats */}
          {stats && (
            <View style={styles.statsContainer}>
              <View
                style={[
                  styles.statCard,
                  { backgroundColor: theme.BACKGROUND_LIGHT },
                ]}
              >
                <Text style={[styles.statValue, { color: theme.PURPLE }]}>
                  {stats.totalReferrals || 0}
                </Text>
                <Text style={[styles.statLabel, { color: theme.TEXT }]}>
                  Total Referrals
                </Text>
              </View>
              <View
                style={[
                  styles.statCard,
                  { backgroundColor: theme.BACKGROUND_LIGHT },
                ]}
              >
                <Text style={[styles.statValue, { color: theme.PURPLE }]}>
                  {stats.activeReferrals || 0}
                </Text>
                <Text style={[styles.statLabel, { color: theme.TEXT }]}>
                  Active
                </Text>
              </View>
              <View
                style={[
                  styles.statCard,
                  { backgroundColor: theme.BACKGROUND_LIGHT },
                ]}
              >
                <Text style={[styles.statValue, { color: theme.PURPLE }]}>
                  {stats.rewardsUnlocked || 0}
                </Text>
                <Text style={[styles.statLabel, { color: theme.TEXT }]}>
                  Rewards
                </Text>
              </View>
            </View>
          )}

          {/* Use Referral Code */}
          <View
            style={[
              styles.section,
              { backgroundColor: theme.BACKGROUND_LIGHT },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: theme.TEXT }]}>
              Use Referral Code
            </Text>
            <Text style={[styles.sectionSubtitle, { color: theme.LIGHT_TEXT }]}>
              Enter a friend's code to unlock rewards
            </Text>
            <View style={styles.codeInputContainer}>
              <TextInput
                style={[
                  styles.codeInput,
                  { color: theme.TEXT, borderColor: theme.BORDER_COLOR },
                ]}
                placeholder="Enter referral code"
                placeholderTextColor={theme.LIGHT_TEXT}
                value={useCodeInput}
                onChangeText={setUseCodeInput}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={[styles.useButton, { backgroundColor: theme.PURPLE }]}
                onPress={handleUseCode}
              >
                <Text
                  style={[styles.useButtonText, { color: theme.SECONDARY }]}
                >
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Rewards */}
          {referral && referral.rewards && referral.rewards.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.TEXT }]}>
                Your Rewards
              </Text>
              {referral.rewards.map((reward, index) => (
                <Animated.View
                  key={reward?.id || `reward-${index}`}
                  entering={FadeInDown.delay(index * 50)}
                  style={[
                    styles.rewardCard,
                    { backgroundColor: theme.BACKGROUND_LIGHT },
                  ]}
                >
                  <View style={styles.rewardContent}>
                    <MaterialIcons
                      name={reward?.unlocked ? 'check-circle' : 'lock'}
                      size={24}
                      color={
                        reward?.unlocked ? theme.SUCCESS : theme.LIGHT_TEXT
                      }
                    />
                    <View style={styles.rewardInfo}>
                      <Text style={[styles.rewardTitle, { color: theme.TEXT }]}>
                        {reward?.title || 'Reward'}
                      </Text>
                      <Text
                        style={[styles.rewardDesc, { color: theme.LIGHT_TEXT }]}
                      >
                        {reward?.description || ''}
                      </Text>
                    </View>
                  </View>
                </Animated.View>
              ))}
            </View>
          )}

          {/* Referral Friends */}
          {referralFriendsData &&
            referralFriendsData.referralFriends.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.TEXT }]}>
                  Referral Friends ({referralFriendsData.totalFriends})
                </Text>
                <Text
                  style={[styles.sectionSubtitle, { color: theme.LIGHT_TEXT }]}
                >
                  People who joined using your code
                </Text>
                {referralFriendsData.referralFriends.map((friend, index) => (
                  <Animated.View
                    key={friend.id}
                    entering={FadeInDown.delay(index * 50)}
                    style={[
                      styles.friendCard,
                      { backgroundColor: theme.BACKGROUND_LIGHT },
                    ]}
                  >
                    <View style={styles.friendContent}>
                      <View
                        style={[
                          styles.friendAvatar,
                          { backgroundColor: theme.PURPLE + '20' },
                        ]}
                      >
                        {friend.avatar ? (
                          <Text style={styles.friendAvatarText}>
                            {friend.name[0]?.toUpperCase()}
                          </Text>
                        ) : (
                          <Text
                            style={[
                              styles.friendAvatarText,
                              { color: theme.PURPLE },
                            ]}
                          >
                            {friend.name[0]?.toUpperCase() || 'U'}
                          </Text>
                        )}
                      </View>
                      <View style={styles.friendInfo}>
                        <Text
                          style={[styles.friendName, { color: theme.TEXT }]}
                        >
                          {friend.name}
                        </Text>
                        <Text
                          style={[
                            styles.friendEmail,
                            { color: theme.LIGHT_TEXT },
                          ]}
                        >
                          {friend.email}
                        </Text>
                        <View style={styles.friendStats}>
                          <View style={styles.friendStatItem}>
                            <MaterialIcons
                              name="receipt"
                              size={14}
                              color={theme.ICON_MUTED}
                            />
                            <Text
                              style={[
                                styles.friendStatText,
                                { color: theme.LIGHT_TEXT },
                              ]}
                            >
                              {friend.stats.transactions} transactions
                            </Text>
                          </View>
                          <View style={styles.friendStatItem}>
                            <MaterialIcons
                              name="people"
                              size={14}
                              color={theme.ICON_MUTED}
                            />
                            <Text
                              style={[
                                styles.friendStatText,
                                { color: theme.LIGHT_TEXT },
                              ]}
                            >
                              {friend.stats.referrals} referrals
                            </Text>
                          </View>
                        </View>
                        <Text
                          style={[
                            styles.friendJoined,
                            { color: theme.LIGHT_TEXT },
                          ]}
                        >
                          Joined{' '}
                          {new Date(friend.joinedAt).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                  </Animated.View>
                ))}
              </View>
            )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const createStyles = (theme: any) => {
  const headerBg = theme.HEADER_BACKGROUND ?? theme.PURPLE;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: headerBg,
    },
    headerContainer: {
      paddingTop: Platform.OS === 'ios' ? '15%' : '10%',
      paddingHorizontal: 20,
      paddingBottom: 20,
      backgroundColor: headerBg,
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
    scrollContent: {
      paddingBottom: 20,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
    },
    loadingIconContainer: {
      marginBottom: 32,
    },
    loadingIconGradient: {
      width: 100,
      height: 100,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.PURPLE,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10,
    },
    loadingTitle: {
      fontSize: 24,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: 8,
      letterSpacing: 0.5,
    },
    loadingSubtitle: {
      fontSize: 16,
      textAlign: 'center',
      opacity: 0.7,
      marginBottom: 32,
    },
    activityIndicator: {
      marginTop: 16,
    },
    referralCard: {
      margin: 20,
      padding: 24,
      borderRadius: 20,
      alignItems: 'center',
    },
    cardTitle: {
      fontSize: 16,
      color: '#FFFFFF',
      opacity: 0.9,
      marginBottom: 12,
    },
    referralCode: {
      fontSize: 36,
      fontWeight: '800',
      color: '#FFFFFF',
      letterSpacing: 4,
      marginBottom: 8,
    },
    cardSubtitle: {
      fontSize: 14,
      color: '#FFFFFF',
      opacity: 0.8,
      marginBottom: 20,
      textAlign: 'center',
    },
    shareButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 12,
      gap: 8,
    },
    shareButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    statsContainer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      gap: 12,
      marginBottom: 20,
    },
    statCard: {
      flex: 1,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    statValue: {
      fontSize: 28,
      fontWeight: '700',
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      textAlign: 'center',
    },
    section: {
      padding: 20,
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      marginBottom: 8,
    },
    sectionSubtitle: {
      fontSize: 14,
      marginBottom: 16,
    },
    codeInputContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    codeInput: {
      flex: 1,
      borderWidth: 1,
      borderRadius: 12,
      padding: 14,
      fontSize: 16,
    },
    useButton: {
      paddingHorizontal: 24,
      paddingVertical: 14,
      borderRadius: 12,
      justifyContent: 'center',
    },
    useButtonText: {
      fontSize: 16,
      fontWeight: '700',
    },
    rewardCard: {
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
    },
    rewardContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rewardInfo: {
      flex: 1,
      marginLeft: 12,
    },
    rewardTitle: {
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 4,
    },
    rewardDesc: {
      fontSize: 14,
    },
    friendCard: {
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
    },
    friendContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    friendAvatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    friendAvatarText: {
      fontSize: 20,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    friendInfo: {
      flex: 1,
    },
    friendName: {
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 4,
    },
    friendEmail: {
      fontSize: 12,
      marginBottom: 8,
    },
    friendStats: {
      flexDirection: 'row',
      gap: 16,
      marginBottom: 4,
    },
    friendStatItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    friendStatText: {
      fontSize: 11,
    },
    friendJoined: {
      fontSize: 10,
      marginTop: 4,
    },
  });
};

export default ReferralScreen;
