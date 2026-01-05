import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Platform,
  StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  FadeInDown,
  FadeIn,
} from 'react-native-reanimated';
import { FeatherIcon, IoniconsIcon, MaterialIcons } from '../../../utils/Icons';
import { useTheme } from '../../../utils/colors';
import { createStyles } from './styles';
import {
  useFetchUserDetails,
  useUserLogout,
} from '../../../ReactQueryHook/auth.hook';
import EditInformation from '../../../components/EditInformation';
import { useNavigation } from '@react-navigation/native';
import { useFetchChallenges } from '../../../ReactQueryHook/challenge.hook';
import { useFetchAchievements } from '../../../ReactQueryHook/achievement.hook';
import { useFetchReferralStats } from '../../../ReactQueryHook/referral.hook';

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

type InfoRowProps = {
  icon: React.ReactNode;
  label: string;
  value?: string;
  index: number;
  onPress?: () => void;
};

const InfoRow: React.FC<InfoRowProps> = ({
  icon,
  label,
  value,
  index,
  onPress,
}) => {
  const styles = createStyles();
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const content = (
    <AnimatedView
      entering={FadeInDown.delay(index * 80)
        .springify()
        .damping(15)}
      style={[styles.row, animatedStyle]}
    >
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.labelContainer}>
        <Text style={styles.labelText}>{label}</Text>
        <Text style={styles.valueText} numberOfLines={1}>
          {value || 'N/A'}
        </Text>
      </View>
    </AnimatedView>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const ProfileScreen: React.FC = () => {
  const styles = createStyles();
  const { isDark, setTheme, theme } = useTheme();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const navigation: any = useNavigation();

  const { mutate: UserLogout } = useUserLogout();
  const { data: UserDetails, isFetching, refetch } = useFetchUserDetails();
  const { data: allChallenges } = useFetchChallenges();
  const { data: achievements, isLoading: loadingAchievements } =
    useFetchAchievements();
  const { data: referralStats, isLoading: loadingReferralStats } =
    useFetchReferralStats();

  // Calculate challenge statistics
  const challengeStats = React.useMemo(() => {
    if (!allChallenges) return { completed: 0, failed: 0 };

    const completed = allChallenges.filter(
      c => c.status === 'completed',
    ).length;
    const failed = allChallenges.filter(c => c.status === 'failed').length;

    return { completed, failed };
  }, [allChallenges]);

  const achievementCount = achievements?.totalUnlocked || 0;
  const referralCount = referralStats?.totalReferrals || 0;
  const loadingStats = loadingAchievements || loadingReferralStats;

  const avatarScale = useSharedValue(0);
  const headerOpacity = useSharedValue(0);

  useEffect(() => {
    avatarScale.value = withDelay(100, withSpring(1, { damping: 12 }));
    headerOpacity.value = withTiming(1, { duration: 600 });
  }, []);

  const avatarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }],
  }));

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: (1 - headerOpacity.value) * -20 }],
  }));

  const handleThemeToggle = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    UserLogout();
  };

  return (
    <View style={styles.root}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      {/* Header Section */}
      <AnimatedView style={[styles.headerSection, headerAnimatedStyle]}>
        <View style={styles.headerContent}>
          <Text style={styles.headerText}>Profile</Text>
        </View>
      </AnimatedView>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            colors={[theme.SECONDARY]}
            tintColor={theme.SECONDARY}
            progressBackgroundColor={theme.PURPLE}
          />
        }
      >
        {/* Avatar Section */}
        <AnimatedView
          entering={FadeInDown.delay(150).springify()}
          style={styles.avatarSection}
        >
          <AnimatedView style={[styles.avatarWrapper, avatarAnimatedStyle]}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {UserDetails?.fullName?.[0]?.toUpperCase() || 'U'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={() => setIsVisible(true)}
              activeOpacity={0.8}
            >
              <FeatherIcon name="edit-2" size={16} color={theme.SECONDARY} />
            </TouchableOpacity>
          </AnimatedView>
          <AnimatedView
            entering={FadeInDown.delay(200).springify()}
            style={styles.nameSection}
          >
            <Text style={styles.userName}>
              {UserDetails?.fullName || 'User'}
            </Text>
            <TouchableOpacity
              onPress={() => setIsVisible(true)}
              style={styles.editButton}
              activeOpacity={0.7}
            >
              <FeatherIcon name="edit-3" size={18} color={theme.PURPLE} />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </AnimatedView>
        </AnimatedView>

        {/* Information Card */}
        <AnimatedView
          entering={FadeInDown.delay(250).springify()}
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <MaterialIcons
              name="person-outline"
              size={22}
              color={theme.PURPLE}
            />
            <Text style={styles.cardTitle}>Personal Information</Text>
          </View>

          <View style={styles.infoSection}>
            <InfoRow
              icon={
                <MaterialIcons name="badge" size={20} color={theme.PURPLE} />
              }
              label="Full Name"
              value={UserDetails?.fullName}
              index={0}
            />
            <InfoRow
              icon={
                <MaterialIcons name="phone" size={20} color={theme.PURPLE} />
              }
              label="Phone Number"
              value={UserDetails?.phoneNumber}
              index={1}
            />
            <InfoRow
              icon={
                <MaterialIcons name="email" size={20} color={theme.PURPLE} />
              }
              label="Email Address"
              value={UserDetails?.email}
              index={2}
            />
          </View>
        </AnimatedView>

        {/* Challenge Statistics Card */}
        <AnimatedView
          entering={FadeInDown.delay(300).springify()}
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <MaterialIcons name="emoji-events" size={22} color={theme.PURPLE} />
            <Text style={styles.cardTitle}>Challenge Statistics</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: theme.SUCCESS_LIGHT },
                ]}
              >
                <MaterialIcons
                  name="check-circle"
                  size={24}
                  color={theme.SUCCESS}
                />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{challengeStats.completed}</Text>
                <Text style={styles.statLabel}>Success</Text>
              </View>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: theme.ERROR_LIGHT },
                ]}
              >
                <MaterialIcons name="cancel" size={24} color={theme.ERROR} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{challengeStats.failed}</Text>
                <Text style={styles.statLabel}>Failed</Text>
              </View>
            </View>
          </View>
        </AnimatedView>

        {/* Features Card */}
        <AnimatedView
          entering={FadeInDown.delay(400).springify()}
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <MaterialIcons name="star-outline" size={22} color={theme.PURPLE} />
            <Text style={styles.cardTitle}>Features</Text>
          </View>

          <View style={styles.infoSection}>
            <InfoRow
              icon={
                <MaterialIcons
                  name="emoji-events"
                  size={20}
                  color={theme.PURPLE}
                />
              }
              label="Achievements"
              value={
                loadingStats ? 'Loading...' : `${achievementCount} unlocked`
              }
              index={3}
              onPress={() => navigation.navigate('Achievements')}
            />
            <InfoRow
              icon={
                <IoniconsIcon name="medal" size={20} color={theme.PURPLE} />
              }
              label="Challenges"
              value="View challenges"
              index={4}
              onPress={() => {
                // Navigate to Challenges tab - ProfileScreen is already in Tabs navigator
                navigation.navigate('Challenges');
              }}
            />
            <InfoRow
              icon={
                <MaterialIcons
                  name="card-giftcard"
                  size={20}
                  color={theme.PURPLE}
                />
              }
              label="Referrals"
              value={loadingStats ? 'Loading...' : `${referralCount} referrals`}
              index={5}
              onPress={() => navigation.navigate('Referral')}
            />
          </View>
        </AnimatedView>

        {/* Settings Card */}
        <AnimatedView
          entering={FadeInDown.delay(500).springify()}
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <MaterialIcons name="settings" size={22} color={theme.PURPLE} />
            <Text style={styles.cardTitle}>Settings</Text>
          </View>

          <View style={styles.settingsSection}>
            <AnimatedView
              entering={FadeInDown.delay(550).springify()}
              style={styles.settingRow}
            >
              <View style={styles.settingLeft}>
                <View
                  style={[
                    styles.settingIconContainer,
                    { backgroundColor: theme.WARNING_LIGHT },
                  ]}
                >
                  <FeatherIcon
                    name={isDark ? 'moon' : 'sun'}
                    size={20}
                    color={theme.WARNING}
                  />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingLabel}>Dark Mode</Text>
                  <Text style={styles.settingDescription}>
                    {isDark ? 'Dark theme enabled' : 'Light theme enabled'}
                  </Text>
                </View>
              </View>
              <Switch
                value={isDark}
                onValueChange={handleThemeToggle}
                trackColor={{
                  false: theme.BORDER_COLOR + '50',
                  true: theme.PURPLE + '80',
                }}
                thumbColor={isDark ? theme.PURPLE : theme.SECONDARY}
                ios_backgroundColor={theme.BORDER_COLOR + '50'}
              />
            </AnimatedView>
          </View>
        </AnimatedView>

        {/* Logout Button */}
        <AnimatedTouchableOpacity
          entering={FadeInDown.delay(600).springify()}
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <View style={styles.logoutButtonContent}>
            <FeatherIcon name="log-out" size={20} color={theme.ERROR} />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </View>
        </AnimatedTouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <EditInformation isVisible={isVisible} setIsVisible={setIsVisible} />
    </View>
  );
};

export default ProfileScreen;
