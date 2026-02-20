import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../../utils/colors';
import { MaterialIcons, IoniconsIcon } from '../../../../utils/Icons';
import { useFetchLatestTransaction, useFetchTransactionOverview, useFetchChartTransaction } from '../../../../ReactQueryHook/transaction.hook';
import { createStyles } from './styles';

const AnimatedView = Animated.createAnimatedComponent(View);

const Reports = () => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: overviewData,
    isLoading: isLoadingOverview,
    refetch: refetchOverview,
  } = useFetchTransactionOverview();

  const {
    data: latestTransactions,
    isLoading: isLoadingTransactions,
    refetch: refetchTransactions,
  } = useFetchLatestTransaction();

  // Current month date range for real-time "This Month" data
  const { startDate: monthStart, endDate: monthEnd } = useMemo(() => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };
  }, []);

  const {
    data: monthlyBalance,
    refetch: refetchMonthlyBalance,
  } = useFetchChartTransaction({ startDate: monthStart, endDate: monthEnd });

  // Animation values
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-30);

  useEffect(() => {
    // Header animation
    headerOpacity.value = withTiming(1, { duration: 600 });
    headerTranslateY.value = withSpring(0, {
      damping: 15,
      stiffness: 100,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchOverview(), refetchTransactions(), refetchMonthlyBalance()]);
    setRefreshing(false);
  }, [refetchOverview, refetchTransactions, refetchMonthlyBalance]);

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const formatCurrency = useCallback((amount: number) =>
    `₹${Math.abs(amount).toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`, []);

  const incomeData = overviewData?.overview?.find((item: any) => item.type === 'income') || { total: 0, count: 0 };
  const expenseData = overviewData?.overview?.find((item: any) => item.type === 'expense') || { total: 0, count: 0 };
  const monthlyTrend = Array.isArray(overviewData?.monthlyTrend) ? overviewData.monthlyTrend : [];
  const monthlyIncomeItem = monthlyTrend.find((item: any) => item.type === 'income');
  const monthlyExpenseItem = monthlyTrend.find((item: any) => item.type === 'expense');
  const currentMonth = overviewData?.currentMonth ?? overviewData?.thisMonth ?? overviewData?.month;
  const fromOverview =
    monthlyIncomeItem?.total ?? monthlyIncomeItem?.amount
    ?? overviewData?.monthlyIncome ?? currentMonth?.income ?? currentMonth?.totalIncome ?? 0;
  const expenseFromOverview =
    monthlyExpenseItem?.total ?? monthlyExpenseItem?.amount
    ?? overviewData?.monthlyExpense ?? currentMonth?.expense ?? currentMonth?.totalExpense ?? 0;
  // Use balance API for real-time "This Month" when overview monthly data is missing
  const monthlyIncome = fromOverview || (monthlyBalance?.income ?? 0);
  const monthlyExpense = expenseFromOverview || (monthlyBalance?.expense ?? 0);

  const totalIncome = incomeData.total || 0;
  const totalExpense = expenseData.total || 0;
  const balance = totalIncome - totalExpense;
  const totalTransactions = (incomeData.count || 0) + (expenseData.count || 0);

  const StatCard = ({
    label,
    value,
    icon,
    color,
    delay = 0,
  }: {
    label: string;
    value: string;
    icon: string;
    color: string;
    delay?: number;
  }) => {
    return (
      <AnimatedView
        entering={FadeInDown.delay(delay).springify()}
        style={[styles.statCard, { backgroundColor: theme.BACKGROUND_LIGHT }]}
      >
        <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
          <MaterialIcons name={icon as any} size={24} color={color} />
        </View>
        <View style={styles.statContent}>
          <Text style={[styles.statLabel, { color: theme.LIGHT_TEXT }]}>
            {label}
          </Text>
          <Text style={[styles.statValue, { color: theme.TEXT }]}>{value}</Text>
        </View>
      </AnimatedView>
    );
  };

  return (
    <View style={styles.root}>
      {/* Animated Header */}
      <AnimatedView style={[styles.headerContainer, headerAnimatedStyle]}>
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
              name="insights"
              size={28}
              color={theme.SECONDARY}
            />
            <Text style={styles.headerText}>Reports & Summary</Text>
          </View>
        </View>
      </AnimatedView>

      {/* Content Area */}
      <View style={styles.content}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.SECONDARY || '#C6A56B']}
              tintColor={theme.SECONDARY || '#C6A56B'}
            />
          }
        >
        {/* Summary Cards */}
        <View style={styles.summarySection}>
          <Text style={[styles.sectionTitle, { color: theme.TEXT }]}>
            Overview
          </Text>
          <View style={styles.statGrid}>
            <StatCard
              label="Total Income"
              value={formatCurrency(totalIncome)}
              icon="trending-up"
              color={theme.SUCCESS}
              delay={100}
            />
            <StatCard
              label="Total Expense"
              value={formatCurrency(totalExpense)}
              icon="trending-down"
              color={theme.ERROR}
              delay={200}
            />
            <StatCard
              label="Balance"
              value={formatCurrency(balance)}
              icon="account-balance-wallet"
              color={theme.ICON_COLOR}
              delay={300}
            />
            <StatCard
              label="Transactions"
              value={totalTransactions.toString()}
              icon="receipt-long"
              color={theme.LIGHT_PURPLE}
              delay={400}
            />
          </View>
        </View>

        {/* This Month */}
        <View style={styles.summarySection}>
          <Text style={[styles.sectionTitle, { color: theme.TEXT }]}>
            This Month
          </Text>
          <AnimatedView
            entering={FadeInDown.delay(500).springify()}
            style={[styles.monthlyCard, { backgroundColor: theme.BACKGROUND_LIGHT }]}
          >
            <View style={styles.monthlyRow}>
              <View style={styles.monthlyItem}>
                <MaterialIcons name="arrow-upward" size={20} color={theme.SUCCESS} />
                <Text style={[styles.monthlyLabel, { color: theme.LIGHT_TEXT }]}>
                  Income
                </Text>
                <Text style={[styles.monthlyValue, { color: theme.SUCCESS }]}>
                  {formatCurrency(monthlyIncome)}
                </Text>
              </View>
              <View style={styles.monthlyItem}>
                <MaterialIcons name="arrow-downward" size={20} color={theme.ERROR} />
                <Text style={[styles.monthlyLabel, { color: theme.LIGHT_TEXT }]}>
                  Expense
                </Text>
                <Text style={[styles.monthlyValue, { color: theme.ERROR }]}>
                  {formatCurrency(monthlyExpense)}
                </Text>
              </View>
            </View>
            <View style={[styles.monthlyDivider, { backgroundColor: theme.BORDER_COLOR + '30' }]} />
            <View style={styles.monthlyRow}>
              <Text style={[styles.monthlyLabel, { color: theme.LIGHT_TEXT }]}>
                Monthly Balance
              </Text>
              <Text style={[styles.monthlyValue, { color: theme.TEXT }]}>
                {formatCurrency(monthlyIncome - monthlyExpense)}
              </Text>
            </View>
          </AnimatedView>
        </View>

        {/* Percentages */}
        {overviewData?.percentages && (
          <View style={styles.summarySection}>
            <Text style={[styles.sectionTitle, { color: theme.TEXT }]}>
              Distribution
            </Text>
            <AnimatedView
              entering={FadeInDown.delay(600).springify()}
              style={[styles.percentageCard, { backgroundColor: theme.BACKGROUND_LIGHT }]}
            >
              <View style={styles.percentageRow}>
                <View style={styles.percentageItem}>
                  <View
                    style={[
                      styles.percentageBar,
                      {
                        width: `${overviewData.percentages.income}%`,
                        backgroundColor: theme.SUCCESS,
                      },
                    ]}
                  />
                  <Text style={[styles.percentageLabel, { color: theme.TEXT }]}>
                    Income: {overviewData.percentages.income.toFixed(1)}%
                  </Text>
                </View>
                <View style={styles.percentageItem}>
                  <View
                    style={[
                      styles.percentageBar,
                      {
                        width: `${overviewData.percentages.expense}%`,
                        backgroundColor: theme.ERROR,
                      },
                    ]}
                  />
                  <Text style={[styles.percentageLabel, { color: theme.TEXT }]}>
                    Expense: {overviewData.percentages.expense.toFixed(1)}%
                  </Text>
                </View>
              </View>
            </AnimatedView>
          </View>
        )}

        {/* Recent Transactions Summary */}
        {latestTransactions && latestTransactions.length > 0 && (
          <View style={styles.summarySection}>
            <Text style={[styles.sectionTitle, { color: theme.TEXT }]}>
              Recent Activity
            </Text>
            <AnimatedView
              entering={FadeInDown.delay(700).springify()}
              style={[styles.recentCard, { backgroundColor: theme.BACKGROUND_LIGHT }]}
            >
              <Text style={[styles.recentText, { color: theme.LIGHT_TEXT }]}>
                {latestTransactions.length} recent transactions
              </Text>
              <Text style={[styles.recentSubText, { color: theme.LIGHT_TEXT }]}>
                View all transactions in the Transactions tab
              </Text>
            </AnimatedView>
          </View>
        )}
        </ScrollView>
      </View>
    </View>
  );
};

export default Reports;

