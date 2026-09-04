import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  FadeInDown,
} from 'react-native-reanimated';
import { FeatherIcon, IoniconsIcon, MaterialIcons } from '../../../utils/Icons';
import { useTheme } from '../../../utils/colors';
import { createStyles } from './styles';
import { spacing } from '../../../utils/responsive';
import {
  useFetchUserDetails,
  useUserLogout,
} from '../../../ReactQueryHook/auth.hook';
import EditInformation from '../../../components/EditInformation';
import TermsModal from '../../../components/TermsModal';
import { useNavigation } from '@react-navigation/native';
import { useFetchChallenges } from '../../../ReactQueryHook/challenge.hook';
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
  styles: ReturnType<typeof createStyles>;
};

const InfoRow: React.FC<InfoRowProps> = ({
  icon,
  label,
  value,
  index,
  onPress,
  styles,
}) => {
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
  const { isDark, setTheme, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [termsModalVisible, setTermsModalVisible] = useState<boolean>(false);
  const navigation: any = useNavigation();

  const { mutate: UserLogout } = useUserLogout();
  const { data: UserDetails, isFetching, refetch } = useFetchUserDetails();
  const { data: allChallenges } = useFetchChallenges();
  const { data: referralStats, isLoading: loadingReferralStats } =
    useFetchReferralStats();

  // Calculate challenge statistics
  const challengeStats = React.useMemo(() => {
    if (!allChallenges) return { completed: 0, cancelled: 0 };

    const completed = allChallenges.filter(
      c => c.status === 'completed',
    ).length;
    const cancelled = allChallenges.filter(c => c.status === 'cancelled').length;

    return { completed, cancelled };
  }, [allChallenges]);

  const referralCount = referralStats?.totalReferrals || 0;
  const loadingStats = loadingReferralStats;

  const avatarScale = useSharedValue(0);

  useEffect(() => {
    avatarScale.value = withDelay(100, withSpring(1, { damping: 12 }));
  }, []);

  const avatarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }],
  }));

  const handleThemeToggle = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, [setTheme]);

  const handleLogout = useCallback(() => UserLogout(), [UserLogout]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: 0 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            colors={[theme.SECONDARY]}
            tintColor={theme.SECONDARY}
          />
        }
      >
        <LinearGradient
          colors={
            isDark
              ? [theme.HEADER_GRADIENT[1], theme.HEADER_GRADIENT[2], theme.BACKGROUND]
              : [theme.HEADER_GRADIENT[2], theme.HEADER_GRADIENT[3], theme.BACKGROUND]
          }
          locations={[0, 0.45, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[
            styles.heroGradient,
            {
              paddingTop: insets.top + spacing(8),
              marginHorizontal: -spacing(20),
              paddingHorizontal: spacing(20),
            },
          ]}
        >
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
                <FeatherIcon name="edit-3" size={18} color={theme.ICON_COLOR} />
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </AnimatedView>
          </AnimatedView>
        </LinearGradient>

        {/* Information Card */}
        <AnimatedView
          entering={FadeInDown.delay(250).springify()}
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <MaterialIcons
              name="person-outline"
              size={22}
              color={theme.ICON_COLOR}
            />
            <Text style={styles.cardTitle}>Personal Information</Text>
          </View>

          <View style={styles.infoSection}>
            <InfoRow
              icon={
                <MaterialIcons name="badge" size={20} color={theme.ICON_COLOR} />
              }
              label="Full Name"
              value={UserDetails?.fullName}
              index={0}
              styles={styles}
            />
            <InfoRow
              icon={
                <MaterialIcons name="phone" size={20} color={theme.ICON_COLOR} />
              }
              label="Phone Number"
              value={UserDetails?.phoneNumber}
              index={1}
              styles={styles}
            />
            <InfoRow
              icon={
                <MaterialIcons name="email" size={20} color={theme.ICON_COLOR} />
              }
              label="Email Address"
              value={UserDetails?.email}
              index={2}
              styles={styles}
            />
          </View>
        </AnimatedView>

        {/* Challenge Statistics Card */}
        <AnimatedView
          entering={FadeInDown.delay(300).springify()}
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <MaterialIcons name="emoji-events" size={22} color={theme.ICON_COLOR} />
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
                <Text style={styles.statValue}>{challengeStats.cancelled}</Text>
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
            <MaterialIcons name="star-outline" size={22} color={theme.ICON_COLOR} />
            <Text style={styles.cardTitle}>Features</Text>
          </View>

          <View style={styles.infoSection}>
            <InfoRow
              icon={
                <IoniconsIcon name="medal" size={20} color={theme.ICON_COLOR} />
              }
              label="Challenges"
              value="View challenges"
              index={3}
              onPress={() => {
                navigation.navigate('Challenges');
              }}
              styles={styles}
            />
            <InfoRow
              icon={
                <MaterialIcons
                  name="card-giftcard"
                  size={20}
                  color={theme.ICON_COLOR}
                />
              }
              label="Referrals"
              value={loadingStats ? 'Loading...' : `${referralCount} referrals`}
              index={4}
              onPress={() => navigation.navigate('Referral')}
              styles={styles}
            />
          </View>
        </AnimatedView>

        {/* Settings Card */}
        <AnimatedView
          entering={FadeInDown.delay(500).springify()}
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <MaterialIcons name="settings" size={22} color={theme.ICON_COLOR} />
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
                thumbColor={ theme.SECONDARY}
                ios_backgroundColor={theme.BORDER_COLOR + '50'}
              />
            </AnimatedView>

            <TouchableOpacity
              onPress={() => navigation.navigate('Permissions')}
              style={styles.settingRow}
              activeOpacity={0.8}
            >
              <View style={styles.settingLeft}>
                <View
                  style={[
                    styles.settingIconContainer,
                    { backgroundColor: theme.SUCCESS_LIGHT },
                  ]}
                >
                  <FeatherIcon
                    name="shield"
                    size={20}
                    color={theme.SUCCESS}
                  />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingLabel}>App permissions</Text>
                  <Text style={styles.settingDescription}>
                    Notifications, storage & more
                  </Text>
                </View>
              </View>
              <FeatherIcon name="chevron-right" size={22} color={theme.LIGHT_TEXT} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setTermsModalVisible(true)}
              style={styles.settingRow}
              activeOpacity={0.8}
            >
              <View style={styles.settingLeft}>
                <View
                  style={[
                    styles.settingIconContainer,
                    { backgroundColor: theme.SECONDARY + '25' },
                  ]}
                >
                  <FeatherIcon
                    name="file-text"
                    size={20}
                    color={theme.SECONDARY}
                  />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingLabel}>Terms and Conditions</Text>
                  <Text style={styles.settingDescription}>
                    App terms & conditions
                  </Text>
                </View>
              </View>
              <FeatherIcon name="chevron-right" size={22} color={theme.LIGHT_TEXT} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('privacy-policies')}
              style={styles.settingRow}
              activeOpacity={0.8}
            >
              <View style={styles.settingLeft}>
                <View
                  style={[
                    styles.settingIconContainer,
                    { backgroundColor: theme.SECONDARY + '25' },
                  ]}
                >
                  <FeatherIcon
                    name="shield"
                    size={20}
                    color={theme.SECONDARY}
                  />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingLabel}>Privacy Policy</Text>
                  <Text style={styles.settingDescription}>
                    How we protect your data
                  </Text>
                </View>
              </View>
              <FeatherIcon name="chevron-right" size={22} color={theme.LIGHT_TEXT} />
            </TouchableOpacity>
          </View>
        </AnimatedView>

        <TermsModal
          visible={termsModalVisible}
          onClose={() => setTermsModalVisible(false)}
        />

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
