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
  FadeIn,
  SlideInDown,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStyles } from './styles';
import Header from './components/Header';
import SecondHeader from './components/SecondHeader';
import Chart from './components/Chart';
import { MaterialIcons } from '../../../utils/Icons';
import { useTheme } from '../../../utils/colors';
import { spacing } from '../../../utils/responsive';
import TransactionList from '../../../components/transaction';
import {
  useFetchLatestTransaction,
  useFetchChartTransaction,
} from '../../../ReactQueryHook/transaction.hook';

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const HomeScreen = React.memo(() => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

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
  }, []);

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
          <Header />
          <SecondHeader />
        </AnimatedView>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
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

          {/* Income & Expense */}
          <View style={styles.incomeExpenseRow}>
            <AnimatedView
              entering={FadeInDown.delay(120).springify()}
              style={[
                styles.incomeExpenseItem,
                { backgroundColor: theme.SUCCESS_LIGHT },
              ]}
            >
              <View
                style={[
                  styles.incomeExpenseIcon,
                  { backgroundColor: theme.SUCCESS + '22' },
                ]}
              >
                <MaterialIcons name="trending-up" size={22} color={theme.SUCCESS} />
              </View>
              <View style={styles.incomeExpenseContent}>
                <Text style={[styles.incomeExpenseLabel, { color: theme.LIGHT_TEXT }]}>
                  Income
                </Text>
                <Text
                  style={[styles.incomeExpenseValue, { color: theme.SUCCESS }]}
                  numberOfLines={1}
                >
                  {formatCurrency(income)}
                </Text>
              </View>
            </AnimatedView>
            <AnimatedView
              entering={FadeInDown.delay(160).springify()}
              style={[
                styles.incomeExpenseItem,
                { backgroundColor: theme.ERROR_LIGHT },
              ]}
            >
              <View
                style={[
                  styles.incomeExpenseIcon,
                  { backgroundColor: theme.ERROR + '22' },
                ]}
              >
                <MaterialIcons name="trending-down" size={22} color={theme.ERROR} />
              </View>
              <View style={styles.incomeExpenseContent}>
                <Text style={[styles.incomeExpenseLabel, { color: theme.LIGHT_TEXT }]}>
                  Expense
                </Text>
                <Text
                  style={[styles.incomeExpenseValue, { color: theme.ERROR }]}
                  numberOfLines={1}
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

        {/* Recent transactions */}
        <AnimatedView entering={FadeInDown.delay(480).springify()}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.TEXT }]}>
              Recent Transactions
            </Text>
          </View>

          {transactionData && transactionData.length > 0 ? (
            <View style={styles.transactionsCard}>
              {transactionData.slice(0, 5).map((item: any, index: number) => (
                <View
                  key={item?._id || item?.id || `tx-${index}`}
                  style={[
                    styles.transactionItem,
                    index === 4 && styles.transactionItemLast,
                  ]}
                >
                  <TransactionList {...item} />
                </View>
              ))}
            </View>
          ) : (
            <AnimatedView
              entering={FadeIn.delay(520).springify()}
              style={[styles.transactionsCard, styles.emptyState]}
            >
              <View style={styles.emptyIcon}>
                <MaterialIcons
                  name="receipt-long"
                  size={44}
                  color={theme.ICON_MUTED}
                />
              </View>
              <Text style={[styles.emptyTitle, { color: theme.TEXT }]}>
                No transactions yet
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.LIGHT_TEXT }]}>
                Add your first transaction to start tracking your finances
              </Text>
            </AnimatedView>
          )}
        </AnimatedView>
      </ScrollView>
    </View>
  );
});

HomeScreen.displayName = 'HomeScreen';
export default HomeScreen;
