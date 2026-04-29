import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  FadeInDown,
  SlideInDown,
} from 'react-native-reanimated';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStyles } from './styles';
import Header from './components/Header';
import SecondHeader from './components/SecondHeader';
import Chart from './components/Chart';
import { MaterialIcons } from '../../../utils/Icons';
import { useTheme } from '../../../utils/colors';
import RecentActivity from './components/RecentActivity';
import {
  useFetchLatestTransaction,
  useFetchChartTransaction,
} from '../../../ReactQueryHook/transaction.hook';
import { getItem } from '../../../assets/storage';
import { useGuideTour } from '../../../context/GuideTourContext';
import HelpModal from '../../../components/HelpModal';
import BannerAdView from '../../../components/ads/BannerAdView';
import { useNavBarLayout, verticalScale } from '../../../utils/responsive';

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const HomeScreen = React.memo(() => {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const tabBarHeight = useBottomTabBarHeight();
  const navLayout = useNavBarLayout();
  const scrollBottomInset = useMemo(
    () =>
      Math.max(
        navLayout.dockHeight + navLayout.bottomOffset + verticalScale(28),
        tabBarHeight + navLayout.bottomOffset + verticalScale(28),
      ),
    [navLayout.bottomOffset, navLayout.dockHeight, tabBarHeight],
  );

  const incomeOnCard = isDark ? '#A8E8BC' : theme.SUCCESS;
  const expenseOnCard = isDark ? '#FFB4B4' : theme.ERROR;
  const incomeExpenseLabelColor = isDark
    ? 'rgba(247, 247, 248, 0.9)'
    : theme.LIGHT_TEXT;
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const { startTour } = useGuideTour();

  const {
    data: transactionData,
    refetch: refetchTransactions,
  } = useFetchLatestTransaction();
  const {
    data: chartData,
    refetch: refetchChart,
  } = useFetchChartTransaction();

  const fadeAnim = useSharedValue(1);
  const slideAnim = useSharedValue(0);

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 500 });
    slideAnim.value = withSpring(0, { damping: 22 });
  // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only intro animation
  }, []);

  useEffect(() => {
    let mounted = true;
    const checkGuide = async () => {
      try {
        const seen = await getItem('GUIDE_TOUR_SEEN');
        if (mounted && seen !== 'true') {
          setTimeout(() => startTour(), 800);
        }
      } catch {
        if (mounted) startTour();
      }
    };
    checkGuide();
    return () => {
      mounted = false;
    };
  }, [startTour]);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }));

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchTransactions(), refetchChart()]);
    setRefreshing(false);
  }, [refetchTransactions, refetchChart]);

  const income = chartData?.income || 0;
  const expense = chartData?.expense || 0;
  const balance = income - expense;

  const formatCurrency = useCallback(
    (amount: number) =>
      `₹${Math.abs(amount).toLocaleString('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`,
    [],
  );

  const quickActions = useMemo(
    () => [
      {
        icon: 'category' as const,
        label: 'Categories',
        color: theme.SECONDARY,
        onPress: () => {
          // @ts-ignore
          navigation.navigate('InnerScreen', { screen: 'Categories' });
        },
      },
      {
        icon: 'book' as const,
        label: 'Books',
        color: theme.SUCCESS,
        onPress: () => {
          // @ts-ignore
          navigation.navigate('Tabs', { screen: 'Book' });
        },
      },
      {
        icon: 'insights' as const,
        label: 'Reports',
        color: theme.WARNING,
        onPress: () => {
          // @ts-ignore
          navigation.navigate('InnerScreen', { screen: 'Reports' });
        },
      },
    ],
    [theme, navigation],
  );

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.HEADER_BACKGROUND}
      />

      {/* Header gradient - flows seamlessly into body */}
      <LinearGradient
        colors={[...theme.HEADER_GRADIENT]}
        style={[styles.headerWrapper, { paddingTop: insets.top + 12 }]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <AnimatedView style={[styles.headerSection, headerStyle]}>
          <Header onHelpPress={() => setHelpModalVisible(true)} />
          <SecondHeader />
        </AnimatedView>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: scrollBottomInset },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.SECONDARY]}
            tintColor={theme.SECONDARY}
          />
        }
      >
        {/* Balance hero */}
        <AnimatedView
          entering={SlideInDown.delay(60).springify()}
          style={styles.balanceCard}
        >
          <View style={styles.balanceTopRow}>
            <View>
              <Text style={[styles.balanceLabel, { color: theme.LIGHT_TEXT }]}>
                Total Balance
              </Text>
              <Text style={[styles.balanceAmount, { color: theme.TEXT }]}>
                {formatCurrency(balance)}
              </Text>
            </View>
            <TouchableOpacity style={styles.refreshBtn} onPress={handleRefresh}>
              <MaterialIcons
                name="refresh"
                size={24}
                color={theme.SECONDARY}
                style={{ transform: [{ rotate: refreshing ? '180deg' : '0deg' }] }}
              />
            </TouchableOpacity>
          </View>

          {/* Income & expense — single segmented strip */}
          <View style={styles.incomeExpenseShell}>
            <AnimatedView
              entering={FadeInDown.delay(120).springify()}
              style={[
                styles.incomeExpenseItem,
                {
                  backgroundColor: isDark
                    ? 'rgba(91, 165, 107, 0.22)'
                    : theme.SUCCESS_LIGHT + 'AA',
                },
              ]}
            >
              <View
                style={[
                  styles.incomeExpenseIcon,
                  {
                    backgroundColor: isDark
                      ? 'rgba(91, 165, 107, 0.35)'
                      : theme.SUCCESS + '26',
                  },
                ]}
              >
                <MaterialIcons
                  name="trending-up"
                  size={20}
                  color={incomeOnCard}
                />
              </View>
              <View style={styles.incomeExpenseContent}>
                <Text
                  style={[
                    styles.incomeExpenseLabel,
                    {
                      color: incomeExpenseLabelColor,
                      ...(isDark ? { opacity: 1 } : null),
                    },
                  ]}
                >
                  Income
                </Text>
                <Text
                  style={[styles.incomeExpenseValue, { color: incomeOnCard }]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.7}
                >
                  {formatCurrency(income)}
                </Text>
              </View>
            </AnimatedView>
            <View
              style={[styles.incomeExpenseDivider, { backgroundColor: theme.BORDER_COLOR + '45' }]}
            />
            <AnimatedView
              entering={FadeInDown.delay(160).springify()}
              style={[
                styles.incomeExpenseItem,
                {
                  backgroundColor: isDark
                    ? 'rgba(212, 93, 93, 0.22)'
                    : theme.ERROR_LIGHT + 'AA',
                },
              ]}
            >
              <View
                style={[
                  styles.incomeExpenseIcon,
                  {
                    backgroundColor: isDark
                      ? 'rgba(212, 93, 93, 0.35)'
                      : theme.ERROR + '26',
                  },
                ]}
              >
                <MaterialIcons
                  name="trending-down"
                  size={20}
                  color={expenseOnCard}
                />
              </View>
              <View style={styles.incomeExpenseContent}>
                <Text
                  style={[
                    styles.incomeExpenseLabel,
                    {
                      color: incomeExpenseLabelColor,
                      ...(isDark ? { opacity: 1 } : null),
                    },
                  ]}
                >
                  Expense
                </Text>
                <Text
                  style={[styles.incomeExpenseValue, { color: expenseOnCard }]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.7}
                >
                  {formatCurrency(expense)}
                </Text>
              </View>
            </AnimatedView>
          </View>
        </AnimatedView>

        {/* Quick actions grid */}
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <AnimatedTouchable
              key={action.label}
              entering={FadeInDown.delay(200 + index * 60).springify()}
              style={styles.quickActionItem}
              onPress={action.onPress}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.quickActionIconWrap,
                  { backgroundColor: action.color + '1A' },
                ]}
              >
                <MaterialIcons name={action.icon} size={20} color={action.color} />
              </View>
              <Text style={[styles.quickActionLabel, { color: theme.TEXT }]}>
                {action.label}
              </Text>
            </AnimatedTouchable>
          ))}
        </View>

        {/* Chart */}
        <AnimatedView
          entering={FadeInDown.delay(420).springify()}
          style={styles.chartWrapper}
        >
          <Chart />
        </AnimatedView>

        {/* Recent activity — premium ledger (see RecentActivity.tsx) */}
        <AnimatedView entering={FadeInDown.delay(480).springify()}>
          <RecentActivity transactions={transactionData} />
        </AnimatedView>
      </ScrollView>

      <HelpModal
        visible={helpModalVisible}
        onClose={() => setHelpModalVisible(false)}
      />
      <BannerAdView placement="home" />
    </View>
  );
});

HomeScreen.displayName = 'HomeScreen';
export default HomeScreen;
