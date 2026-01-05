import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '../../utils/Icons';
import { useTheme } from '../../utils/colors';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface CalendarDay {
  date: Date;
  amount: number;
  transactions: number;
  category?: string;
}

interface ExpenseCalendarProps {
  transactions: any[];
  onDatePress?: (date: Date) => void;
}

const ExpenseCalendar: React.FC<ExpenseCalendarProps> = ({
  transactions,
  onDatePress,
}) => {
  const { theme } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Group transactions by date
  const getCalendarData = (): CalendarDay[] => {
    const days: Record<string, CalendarDay> = {};
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Initialize all days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const key = date.toDateString();
      days[key] = {
        date,
        amount: 0,
        transactions: 0,
      };
    }

    // Add transaction data
    transactions.forEach(t => {
      const date = new Date(t.date);
      if (
        date.getFullYear() === year &&
        date.getMonth() === month
      ) {
        const key = date.toDateString();
        if (days[key]) {
          days[key].amount += parseFloat(t.price || 0);
          days[key].transactions += 1;
          if (!days[key].category && t.category) {
            days[key].category = t.category;
          }
        }
      }
    });

    return Object.values(days);
  };

  const calendarData = getCalendarData();
  const maxAmount = Math.max(...calendarData.map(d => d.amount), 1);

  const getDayColor = (amount: number) => {
    if (amount === 0) return theme.BACKGROUND;
    const intensity = Math.min(amount / maxAmount, 1);
    if (intensity > 0.7) return theme.EXPENSE_PIE;
    if (intensity > 0.4) return '#FFA500';
    return theme.INCOME_PIE;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentMonth);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentMonth(newDate);
  };

  const styles = createStyles(theme);

  return (
    <View style={[styles.container, { backgroundColor: theme.BACKGROUND_LIGHT }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigateMonth('prev')}>
          <MaterialIcons name="chevron-left" size={24} color={theme.TEXT} />
        </TouchableOpacity>
        <Text style={[styles.monthTitle, { color: theme.TEXT }]}>
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </Text>
        <TouchableOpacity onPress={() => navigateMonth('next')}>
          <MaterialIcons name="chevron-right" size={24} color={theme.TEXT} />
        </TouchableOpacity>
      </View>

      <View style={styles.calendarGrid}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <View key={day} style={styles.dayHeader}>
            <Text style={[styles.dayHeaderText, { color: theme.LIGHT_TEXT }]}>{day}</Text>
          </View>
        ))}

        {calendarData.map((day, index) => {
          const dayOfWeek = day.date.getDay();
          const isFirstWeek = index < 7;
          const marginLeft = isFirstWeek && dayOfWeek > 0 ? dayOfWeek * (100 / 7) : 0;

          return (
            <Animated.View
              key={day.date.toDateString()}
              entering={FadeInDown.delay(index * 10)}
              style={[
                styles.dayCell,
                {
                  backgroundColor: getDayColor(day.amount),
                  marginLeft: `${marginLeft}%`,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.dayButton}
                onPress={() => onDatePress?.(day.date)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dayNumber,
                    {
                      color: day.amount > 0 ? '#FFFFFF' : theme.LIGHT_TEXT,
                      fontWeight: day.amount > 0 ? '700' : '400',
                    },
                  ]}
                >
                  {day.date.getDate()}
                </Text>
                {day.amount > 0 && (
                  <Text style={styles.dayAmount}>₹{day.amount.toFixed(0)}</Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: theme.BACKGROUND }]} />
          <Text style={[styles.legendText, { color: theme.LIGHT_TEXT }]}>No spending</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: theme.INCOME_PIE }]} />
          <Text style={[styles.legendText, { color: theme.LIGHT_TEXT }]}>Low</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#FFA500' }]} />
          <Text style={[styles.legendText, { color: theme.LIGHT_TEXT }]}>Medium</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: theme.EXPENSE_PIE }]} />
          <Text style={[styles.legendText, { color: theme.LIGHT_TEXT }]}>High</Text>
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      borderRadius: 16,
      padding: 16,
      margin: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    monthTitle: {
      fontSize: 18,
      fontWeight: '700',
    },
    calendarGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    dayHeader: {
      width: '14.28%',
      alignItems: 'center',
      paddingVertical: 8,
    },
    dayHeaderText: {
      fontSize: 12,
      fontWeight: '600',
    },
    dayCell: {
      width: '14.28%',
      aspectRatio: 1,
      borderRadius: 8,
      marginBottom: 4,
      overflow: 'hidden',
    },
    dayButton: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 4,
    },
    dayNumber: {
      fontSize: 12,
      marginBottom: 2,
    },
    dayAmount: {
      fontSize: 8,
      color: '#FFFFFF',
      fontWeight: '600',
    },
    legend: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: theme.BORDER_COLOR,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    legendColor: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    legendText: {
      fontSize: 12,
    },
  });

export default ExpenseCalendar;

