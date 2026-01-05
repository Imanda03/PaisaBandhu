import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { createStyles } from './styles';
import { useTheme } from '../../../../../utils/colors';
import { useFetchChartTransaction } from '../../../../../ReactQueryHook/transaction.hook';
import { MaterialIcons } from '../../../../../utils/Icons';
import {
  AnimatedDonutChart,
  DonutChartData,
} from '../../../../../components/AnimatedChart/DonutChart';

const Chart = () => {
  const { theme } = useTheme();
  const styles = createStyles();
  const [showTooltip, setShowTooltip] = useState(false);

  const { data: chartData, isLoading: refreshing } = useFetchChartTransaction();
  const income = chartData?.income;
  const expense = chartData?.expense;
  const total = income + expense;
  const hasNoData = total === 0;

  const data = {
    overview: [{ total: income }, { total: expense }],
  };

  const donutData: DonutChartData[] = [
    { value: chartData?.income, label: 'Income' },
    { value: chartData?.expense, label: 'Expense' },
  ];

  const formatAmount = (value: number) => {
    if (!value) return '0';
    return value.toLocaleString('en-IN'); // formats like: 7,500
  };

  const renderCenterLabel = () => {
    if (hasNoData) {
      return (
        <View style={styles.centerLabelContainer}>
          <Text style={[styles.statusText, { color: theme.DARK_TEXT }]}>
            No Data
          </Text>
          <Text style={[styles.noDataText, { color: theme.DARK_TEXT }]}>
            Add transactions
          </Text>
        </View>
      );
    }

    // Calculate savings percentage
    // If income is 0, show -100% if there are expenses (overspending), otherwise 0%
    let savingsPercentage = 0;
    if (income > 0) {
      savingsPercentage = ((income - expense) / income) * 100;
    } else if (expense > 0) {
      // No income but has expenses = overspending
      savingsPercentage = -100;
    }

    // Cap the value between -100 and 100
    savingsPercentage = Math.max(
      Math.min(Math.round(savingsPercentage), 100),
      -100,
    );

    let savingsMessage = 'Needs Improvement';
    if (savingsPercentage >= 20) {
      savingsMessage = 'Excellent';
    } else if (savingsPercentage >= 10) {
      savingsMessage = 'Good';
    } else if (savingsPercentage > 0) {
      savingsMessage = 'Fair';
    }

    return (
      <View style={styles.centerLabelContainer}>
        <Text style={[styles.percentageText, { color: theme.SECONDARY }]}>
          {savingsPercentage}%
        </Text>
        <Text style={[styles.statusText, { color: theme.SECONDARY }]}>
          {savingsMessage}
        </Text>
      </View>
    );
  };

  const renderCenterLabelText = () => {
    if (hasNoData) {
      return 'No Data - Add transactions';
    }

    // Calculate savings percentage
    // If income is 0, show -100% if there are expenses (overspending), otherwise 0%
    let savingsPercentage = 0;
    if (income > 0) {
      savingsPercentage = ((income - expense) / income) * 100;
    } else if (expense > 0) {
      // No income but has expenses = overspending
      savingsPercentage = -100;
    }

    savingsPercentage = Math.max(
      Math.min(Math.round(savingsPercentage), 100),
      -100,
    );

    let savingsMessage = 'Needs Improvement';
    if (savingsPercentage >= 20) {
      savingsMessage = 'Excellent';
    } else if (savingsPercentage >= 10) {
      savingsMessage = 'Good';
    } else if (savingsPercentage > 0) {
      savingsMessage = 'Fair';
    }

    return `${savingsPercentage}% - ${savingsMessage}`;
  };

  return (
    <View
      style={[
        styles.container,
        {
          shadowColor: theme.SHADOW,
        },
      ]}
    >
      <View style={styles.infoWrapper}>
        <TouchableOpacity onPress={() => setShowTooltip(!showTooltip)}>
          <MaterialIcons
            name="info-outline"
            size={24}
            color={theme.SECONDARY}
          />
        </TouchableOpacity>

        {showTooltip && (
          <View style={styles.tooltipContainer}>
            <Text style={styles.tooltipText}>
              Group transactions are not included in this chart.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.chartContainer}>
        <AnimatedDonutChart
          data={donutData}
          title="Financial Overview"
          showLabels={true}
          showPercentages={true}
          centerText={renderCenterLabelText()}
          animationDuration={1200}
        />
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <View
              style={[styles.colorDot, { backgroundColor: theme.INCOME_PIE }]}
            />
            <Text style={[styles.detailText]}>
              Income: Rs {formatAmount(data?.overview?.[0]?.total)}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <View
              style={[styles.colorDot, { backgroundColor: theme.EXPENSE_PIE }]}
            />
            <Text style={[styles.detailText]}>
              Expense: Rs {formatAmount(data?.overview?.[1]?.total)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Chart;
