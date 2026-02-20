import { useTheme } from '../../../../utils/colors';
import { useMemo } from 'react';
import {
  AnimatedBarChart,
  BarChartData,
} from '../../../../components/AnimatedChart/BarChart';
import {
  AnimatedLineChart,
  LineChartData,
} from '../../../../components/AnimatedChart/LineChart';
import {
  AnimatedDonutChart,
  DonutChartData,
} from '../../../../components/AnimatedChart/DonutChart';
import {
  AnimatedAreaChart,
  AreaChartData,
} from '../../../../components/AnimatedChart/AreaChart';
import {
  AnimatedRadialChart,
  RadialChartData,
} from '../../../../components/AnimatedChart/RadialProgrssChart';
import { ScrollView, View, Text, ActivityIndicator, StatusBar, Platform, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, IoniconsIcon } from '../../../../utils/Icons';
import { createStyles } from './styles';
import {
  AnimatedSpendingTracker,
  SpendingData,
} from '../../../../components/AnimatedChart/SpendingTrackerChart';
import {
  AnimatedHabitTracker,
  HabitTrackerData,
} from '../../../../components/AnimatedChart/HabitTrackingChart';
import {
  AnimatedMoodTracker,
  MoodData,
} from '../../../../components/AnimatedChart/MoodTrackingChart';
import {
  AnimatedCalendarHeatmap,
  CalendarData,
} from '../../../../components/AnimatedChart/CalendarProgressChart';
import {
  AnimatedFitnessChart,
  FitnessMetric,
} from '../../../../components/AnimatedChart/FitnessProgressChart';
import { useFetchTransaction } from '../../../../ReactQueryHook/transaction.hook';
import { useFetchFinancialBook } from '../../../../ReactQueryHook/book.hook';
import { FriendExpenses } from './RenderExpenseItem';
import { useFetchFriend } from '../../../../ReactQueryHook/friend.hook';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

export const WeeklyChart = ({ route }: any) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { bookId } = route?.params || {};

  // Fetch book and transaction data
  const { data: booksData, isLoading: booksLoading } = useFetchFinancialBook();
  const { data: transactionsData, isLoading: transactionsLoading } =
    useFetchTransaction(bookId);
  const { data: friendsData, isLoading: friendsLoading } =
    useFetchFriend(bookId);

  // Find current book
  const currentBook = useMemo(() => {
    return booksData?.find((book: any) => book.id === bookId);
  }, [booksData, bookId]);

  const isGroupBook = currentBook?.type === 'group';
  const isLoading = booksLoading || transactionsLoading || friendsLoading;

  // Process transactions data
  const {
    monthlyRevenue,
    donutData,
    spendingData,
    friendExpenses,
    totalGroupExpense,
    perPersonShare,
    participantCount,
    settlements,
  } = useMemo(() => {
    if (!transactionsData?.transactions) {
      return {
        monthlyRevenue: [],
        donutData: [],
        spendingData: [],
        friendExpenses: [],
        totalGroupExpense: 0,
        perPersonShare: 0,
        participantCount: friendsData?.length || 0,
        settlements: [],
      };
    }

    const transactions = transactionsData.transactions;
    const friendsList = friendsData || [];
    const friendLookup = new Map(
      friendsList.map((friend: any) => [
        friend.id || friend._id || friend.friendId || friend.email,
        friend.name || friend.fullName || 'Friend',
      ]),
    );

    // Group transactions by month for bar chart
    const monthlyData: {
      [key: string]: { income: number; expense: number };
    } = {};

    // Group by category for spending tracker
    const categoryData: {
      [key: string]: { spent: number; budget: number; count: number };
    } = {};

    // Group by friend for group books
    const friendData: {
      [key: string]: {
        friendName: string;
        expenses: Array<{
          title: string;
          amount: number;
          date: string;
          type: string;
          category: string;
        }>;
        totalExpense: number;
        totalIncome: number;
      };
    } = {};

    const ensureFriendEntry = (key: string, friendName: string) => {
      if (!friendData[key]) {
        friendData[key] = {
          friendName,
          expenses: [],
          totalExpense: 0,
          totalIncome: 0,
        };
      }
      return friendData[key];
    };

    transactions.forEach((txn: any) => {
      const date = new Date(txn.date);
      const monthKey = date.toLocaleString('default', { month: 'short' });
      const amount = Number(txn.price) || 0;

      // Monthly revenue data
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expense: 0 };
      }
      if (txn.type === 'income') {
        monthlyData[monthKey].income += amount;
      } else {
        monthlyData[monthKey].expense += amount;
      }

      // Category spending data
      const categoryName = txn.categoryId?.title || 'Other';
      if (!categoryData[categoryName]) {
        categoryData[categoryName] = { spent: 0, budget: 0, count: 0 };
      }
      if (txn.type === 'expense') {
        categoryData[categoryName].spent += amount;
        categoryData[categoryName].count += 1;
      }

      // Friend spending data (for group books)
      if (txn.friendId) {
        const friendKey =
          (typeof txn.friendId === 'string'
            ? txn.friendId
            : txn.friendId?._id ||
              txn.friendId?.id ||
              txn.friendId?.friendId) ||
          txn.friendId?.email ||
          txn.friendId?.name;
        const friendName =
          (typeof txn.friendId === 'object' &&
            (txn.friendId?.name || txn.friendId?.fullName)) ||
          (friendKey ? friendLookup.get(friendKey) : undefined) ||
          'Unknown Friend';

        const entry = ensureFriendEntry(friendKey || friendName, friendName);

        entry.expenses.push({
          title: txn.title,
          amount: amount,
          date: date.toLocaleDateString(),
          type: txn.type,
          category: categoryName,
        });

        if (txn.type === 'expense') {
          entry.totalExpense += amount;
        } else {
          entry.totalIncome += amount;
        }
      }
    });

    // Add friends with no transactions yet
    friendsList.forEach((friend: any) => {
      const friendKey =
        friend.id ||
        friend._id ||
        friend.friendId ||
        friend.email ||
        friend.name;
      const friendName = friend.name || friend.fullName || 'Friend';
      ensureFriendEntry(friendKey, friendName);
    });

    const totalGroupExpense = Object.values(friendData).reduce(
      (sum, entry) => sum + entry.totalExpense,
      0,
    );

    const participantCount = Math.max(
      friendsList.length,
      Object.keys(friendData).length,
    );
    const perPersonShare = participantCount
      ? totalGroupExpense / participantCount
      : 0;

    // Convert to chart data formats - separate bars for income and expense
    const monthlyRevenue: BarChartData[] = [];
    Object.entries(monthlyData).forEach(([month, data]) => {
      monthlyRevenue.push(
        {
          label: `${month} Inc`,
          value: data.income,
        },
        {
          label: `${month} Exp`,
          value: data.expense,
        },
      );
    });

    const donutChartData: DonutChartData[] = [
      { value: transactionsData.totals?.income || 0, label: 'Income' },
      { value: transactionsData.totals?.expense || 0, label: 'Expense' },
    ];

    // Sort categories by spending (highest first) and format
    const spendingTrackerData: SpendingData[] = Object.entries(categoryData)
      .filter(([_, data]) => data.spent > 0)
      .map(([category, data]) => ({
        category: `${category} (₹${data.spent.toFixed(0)})`,
        spent: data.spent,
        budget: data.spent * 1.2, // Estimate budget as 120% of spent
      }))
      .sort((a, b) => b.spent - a.spent);

    const friendExpensesList = Object.entries(friendData).map(
      ([_, friendValue]) => {
        const netContribution = friendValue.totalExpense - perPersonShare;
        return {
          friendName: friendValue.friendName,
          expenses: friendValue.expenses,
          total: friendValue.totalExpense,
          share: perPersonShare,
          netContribution,
        };
      },
    );

    const owes = friendExpensesList
      .filter(friend => friend.netContribution < -0.009)
      .map(friend => ({
        name: friend.friendName,
        amount: Math.abs(friend.netContribution),
      }))
      .sort((a, b) => b.amount - a.amount);

    const receives = friendExpensesList
      .filter(friend => friend.netContribution > 0.009)
      .map(friend => ({
        name: friend.friendName,
        amount: friend.netContribution,
      }))
      .sort((a, b) => b.amount - a.amount);

    const settlements: Array<{ from: string; to: string; amount: number }> = [];

    let oweIndex = 0;
    let receiveIndex = 0;

    while (oweIndex < owes.length && receiveIndex < receives.length) {
      const payer = owes[oweIndex];
      const receiver = receives[receiveIndex];
      const amount = Math.min(payer.amount, receiver.amount);

      settlements.push({ from: payer.name, to: receiver.name, amount });

      payer.amount -= amount;
      receiver.amount -= amount;

      if (payer.amount <= 0.01) oweIndex += 1;
      if (receiver.amount <= 0.01) receiveIndex += 1;
    }

    return {
      monthlyRevenue,
      donutData: donutChartData,
      spendingData: spendingTrackerData,
      friendExpenses: friendExpensesList,
      totalGroupExpense,
      perPersonShare,
      participantCount,
      settlements,
    };
  }, [transactionsData, friendsData]);

  const headerBg = theme.HEADER_BACKGROUND ?? theme.PURPLE;
  const headerPaddingTop = Platform.OS === 'ios' ? insets.top + 16 : STATUS_BAR_HEIGHT + 16;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={headerBg} />
      <View style={[styles.headerContainer, { paddingTop: headerPaddingTop }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerTitleContainer}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <IoniconsIcon name="arrow-back" color={theme.SECONDARY} size={24} />
            </TouchableOpacity>
            <MaterialIcons name="analytics" size={28} color={theme.SECONDARY} />
            <Text style={styles.headerText}>
              {currentBook?.title || 'Transaction'}'s Chart
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.content}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.ICON_COLOR} />
            <Text style={[styles.loadingText, { color: theme.SECONDARY }]}>
              Loading chart data...
            </Text>
          </View>
        ) : (
          <>
            {!isGroupBook ? (
              // Single Book Charts
              <>
                {monthlyRevenue.length > 0 && (
                  <View style={styles.chartWrapper}>
                    <AnimatedBarChart
                      data={monthlyRevenue}
                      title="Monthly Income & Expense"
                      showValues={true}
                      animationDuration={2000}
                    />
                  </View>
                )}

                {spendingData.length > 0 && (
                  <View style={styles.chartWrapper}>
                    <AnimatedSpendingTracker
                      data={spendingData}
                      title="Category-wise Spending"
                    />
                  </View>
                )}
              </>
            ) : (
              // Group Book Charts - NEW CLEAN DESIGN
              <>
                {spendingData.length > 0 && (
                  <View style={styles.chartWrapper}>
                    <AnimatedSpendingTracker
                      data={spendingData}
                      title="Monthly Budget Tracker"
                    />
                  </View>
                )}

                {(friendExpenses.length > 0 || participantCount > 0) && (
                  <View style={styles.chartWrapper}>
                    <FriendExpenses
                      data={friendExpenses as any}
                      totalExpense={totalGroupExpense}
                      perPersonShare={perPersonShare}
                      participantCount={participantCount}
                      settlements={settlements}
                    />
                  </View>
                )}
              </>
            )}

            {!isLoading &&
              monthlyRevenue.length === 0 &&
              donutData.length === 0 &&
              spendingData.length === 0 && (
                <View style={styles.emptyContainer}>
                  <Text style={[styles.emptyText, { color: theme.SECONDARY }]}>
                    No transaction data available
                  </Text>
                  <Text
                    style={[styles.emptySubtext, { color: theme.SECONDARY }]}
                  >
                    Add some transactions to see charts
                  </Text>
                </View>
              )}
          </>
        )}
        </ScrollView>
      </View>
    </View>
  );
};
