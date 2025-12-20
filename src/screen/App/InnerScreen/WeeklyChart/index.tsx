import { useTheme } from '../../../../utils/colors';
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
import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
import { createStyles } from './styles';
import AuthHeader from '../../../../components/core/AuthHeader';
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
import { useMemo } from 'react';
import { FriendExpenses } from './RenderExpenseItem';

export const WeeklyChart = ({ route }: any) => {
  const { theme } = useTheme();
  const styles = createStyles();
  const { bookId } = route?.params || {};

  // Fetch book and transaction data
  const { data: booksData, isLoading: booksLoading } = useFetchFinancialBook();
  const { data: transactionsData, isLoading: transactionsLoading } =
    useFetchTransaction(bookId);

  // Find current book
  const currentBook = useMemo(() => {
    return booksData?.find((book: any) => book.id === bookId);
  }, [booksData, bookId]);

  const isGroupBook = currentBook?.type === 'group';
  const isLoading = booksLoading || transactionsLoading;

  // Process transactions data
  const { monthlyRevenue, donutData, spendingData, friendExpenses } =
    useMemo(() => {
      if (!transactionsData?.transactions) {
        return {
          monthlyRevenue: [],
          donutData: [],
          spendingData: [],
          friendExpenses: [],
        };
      }

      const transactions = transactionsData.transactions;

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
        [key: string]: Array<{
          title: string;
          amount: number;
          date: string;
          type: string;
          category: string;
        }>;
      } = {};

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
          const friendName = txn.friendId?.name || 'Unknown Friend';
          if (!friendData[friendName]) {
            friendData[friendName] = [];
          }
          friendData[friendName].push({
            title: txn.title,
            amount: amount,
            date: date.toLocaleDateString(),
            type: txn.type,
            category: categoryName,
          });
        }
      });

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
        ([friendName, expenses]) => ({
          friendName,
          expenses,
          total: expenses.reduce((sum, exp) => sum + exp.amount, 0),
        }),
      );

      return {
        monthlyRevenue,
        donutData: donutChartData,
        spendingData: spendingTrackerData,
        friendExpenses: friendExpensesList,
      };
    }, [transactionsData]);

  return (
    <View style={styles.root}>
      <AuthHeader title={`${currentBook?.title || 'Transaction'}'s Chart`} />
      <ScrollView
        style={[styles.container]}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.PURPLE} />
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

                {friendExpenses.length > 0 && (
                  <View style={styles.chartWrapper}>
                    <FriendExpenses data={friendExpenses as any} />
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
  );
};
