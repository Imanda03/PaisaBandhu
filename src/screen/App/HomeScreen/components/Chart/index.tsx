import { View, Text, TouchableOpacity, Modal } from 'react-native';
import React, { useState, useMemo } from 'react';
import Animated, {
  FadeInDown,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { createStyles } from './styles';
import { useTheme } from '../../../../../utils/colors';
import {
  useFetchChartTransaction,
  useFetchLatestTransaction,
} from '../../../../../ReactQueryHook/transaction.hook';
import { MaterialIcons } from '../../../../../utils/Icons';
import SpendingFlowBoard from './SpendingFlowBoard';

type TimePeriod = 'today' | 'week' | 'month' | 'year' | 'all';

interface TimePeriodOption {
  label: string;
  value: TimePeriod;
  icon: string;
}

const timePeriods: TimePeriodOption[] = [
  { label: 'Today', value: 'today', icon: 'today' },
  { label: 'This Week', value: 'week', icon: 'view-week' },
  { label: 'This Month', value: 'month', icon: 'calendar-month' },
  { label: 'This Year', value: 'year', icon: 'calendar-today' },
  { label: 'All Time', value: 'all', icon: 'all-inclusive' },
];

function transactionInPeriod(
  dateStr: string,
  startISO?: string,
  endISO?: string,
) {
  if (!startISO || !endISO) return true;
  const t = new Date(dateStr).getTime();
  return (
    t >= new Date(startISO).getTime() && t <= new Date(endISO).getTime()
  );
}

const Chart = () => {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('month');
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const scaleAnim = useSharedValue(1);

  // Calculate date range based on selected period
  const { startDate, endDate } = useMemo(() => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const start = new Date();

    switch (selectedPeriod) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        break;
      case 'week':
        start.setDate(end.getDate() - 7);
        start.setHours(0, 0, 0, 0);
        break;
      case 'month':
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        break;
      case 'year':
        start.setMonth(0, 1);
        start.setHours(0, 0, 0, 0);
        break;
      case 'all':
      default:
        return { startDate: undefined, endDate: undefined };
    }

    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };
  }, [selectedPeriod]);

  const {
    data: chartData,
    refetch,
  } = useFetchChartTransaction(
    startDate && endDate ? { startDate, endDate } : undefined,
  );

  const { data: latestRaw } = useFetchLatestTransaction();

  const income = chartData?.income || 0;
  const expense = chartData?.expense || 0;
  const total = income + expense;
  const hasNoData = total === 0;

  const categorySpending = useMemo(() => {
    const list = Array.isArray(latestRaw) ? latestRaw : [];
    const map = new Map<string, number>();
    for (const t of list) {
      if (t?.type !== 'expense') continue;
      if (!transactionInPeriod(t.date, startDate, endDate)) continue;
      const name = t.categoryId?.title?.trim() || 'Other';
      const amt = Number(t.price) || 0;
      if (amt <= 0) continue;
      map.set(name, (map.get(name) || 0) + amt);
    }
    return Array.from(map.entries()).map(([category, spent]) => ({
      category,
      spent,
    }));
  }, [latestRaw, startDate, endDate]);

  const formatAmount = (value: number) => {
    if (!value) return '0';
    return value.toLocaleString('en-IN');
  };

  const selectedPeriodOption = timePeriods.find(
    p => p.value === selectedPeriod,
  );

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  const handlePeriodChange = (period: TimePeriod) => {
    setSelectedPeriod(period);
    setShowPeriodModal(false);
    scaleAnim.value = withSpring(0.95, {}, () => {
      scaleAnim.value = withSpring(1);
    });
    // Refetch data with new date range
    setTimeout(() => {
      refetch();
    }, 100);
  };

  const { insightPercent, insightTier } = useMemo(() => {
    if (hasNoData) {
      return { insightPercent: null as number | null, insightTier: 'No activity' };
    }
    let savingsPercentage = 0;
    if (income > 0) {
      savingsPercentage = ((income - expense) / income) * 100;
    } else if (expense > 0) {
      savingsPercentage = -100;
    }
    savingsPercentage = Math.max(
      Math.min(Math.round(savingsPercentage), 100),
      -100,
    );
    let tier = 'Needs attention';
    if (savingsPercentage >= 20) tier = 'Excellent';
    else if (savingsPercentage >= 10) tier = 'Strong';
    else if (savingsPercentage > 0) tier = 'Fair';
    else if (savingsPercentage === 0) tier = 'Break-even';
    else tier = 'Deficit';
    return { insightPercent: savingsPercentage, insightTier: tier };
  }, [hasNoData, income, expense]);

  return (
    <View
      style={[
        styles.container,
        {
          shadowColor: theme.SHADOW,
        },
      ]}
    >
      {/* Header with Time Period Filter */}
      <View style={styles.headerContainer}>
        <View style={styles.titleBlock}>
          <View style={styles.titleRow}>
            <View
              style={[
                styles.titleIconWrap,
                { backgroundColor: theme.SECONDARY + (isDark ? '22' : '18') },
              ]}
            >
              <MaterialIcons name="analytics" size={18} color={theme.SECONDARY} />
            </View>
            <View style={styles.titleTextCol}>
              <Text style={[styles.titleMain, { color: theme.TEXT }]}>
                Overview
              </Text>
              <Text style={[styles.titleSub, { color: theme.LIGHT_TEXT }]}>
                Inflow, outflow & where it goes
              </Text>
            </View>
          </View>
        </View>

        <Animated.View style={buttonAnimatedStyle}>
          <TouchableOpacity
            style={[
              styles.periodButton,
              {
                backgroundColor: isDark
                  ? 'rgba(255,255,255,0.04)'
                  : 'rgba(255,255,255,0.9)',
                borderColor: theme.SECONDARY + (isDark ? '35' : '40'),
              },
            ]}
            onPress={() => setShowPeriodModal(true)}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name={selectedPeriodOption?.icon as any}
              size={18}
              color={theme.ICON_COLOR}
            />
            <Text style={[styles.periodButtonText, { color: theme.TEXT }]}>
              {selectedPeriodOption?.label}
            </Text>
            <MaterialIcons
              name={showPeriodModal ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={20}
              color={theme.ICON_MUTED}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Flow chambers + category torches (replaces donut) */}
      <View style={styles.chartContainer}>
        <SpendingFlowBoard
          theme={theme}
          isDark={isDark}
          income={income}
          expense={expense}
          categories={categorySpending}
          formatAmount={formatAmount}
          insightPercent={insightPercent}
          insightTier={insightTier}
          hasFlowData={!hasNoData}
        />
      </View>

      {/* Time Period Modal */}
      <Modal
        visible={showPeriodModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPeriodModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPeriodModal(false)}
        >
          <Animated.View
            entering={FadeInDown.duration(200)}
            exiting={FadeOut.duration(150)}
            style={[styles.modalContent, { backgroundColor: theme.BACKGROUND_LIGHT }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.TEXT }]}>
                Select Time Period
              </Text>
              <TouchableOpacity onPress={() => setShowPeriodModal(false)}>
                <MaterialIcons name="close" size={24} color={theme.ICON_MUTED} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalOptions}>
              {timePeriods.map((period, index) => (
                <Animated.View
                  key={period.value}
                  entering={FadeInDown.delay(index * 50).duration(200)}
                >
                  <TouchableOpacity
                    style={[
                      styles.periodOption,
                      {
                        backgroundColor:
                          selectedPeriod === period.value
                            ? theme.PURPLE + '15'
                            : 'transparent',
                        borderColor:
                          selectedPeriod === period.value
                            ? theme.PURPLE
                            : theme.BORDER_COLOR + '30',
                      },
                    ]}
                    onPress={() => handlePeriodChange(period.value)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.periodOptionLeft}>
                      <View
                        style={[
                          styles.periodIconContainer,
                          {
                            backgroundColor:
                              selectedPeriod === period.value
                                ? theme.PURPLE + '20'
                                : theme.BACKGROUND + '80',
                          },
                        ]}
                      >
                        <MaterialIcons
                          name={period.icon as any}
                          size={20}
                          color={
                            selectedPeriod === period.value
                              ? theme.ICON_COLOR
                              : theme.ICON_MUTED
                          }
                        />
                      </View>
                      <Text
                        style={[
                          styles.periodOptionText,
                          {
                            color:
                              selectedPeriod === period.value
                                ? theme.TEXT
                                : theme.LIGHT_TEXT,
                            fontWeight: selectedPeriod === period.value ? '700' : '500',
                          },
                        ]}
                      >
                        {period.label}
                      </Text>
                    </View>
                    {selectedPeriod === period.value && (
                      <MaterialIcons
                        name="check-circle"
                        size={24}
                        color={theme.ICON_COLOR}
                      />
                    )}
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Chart;
