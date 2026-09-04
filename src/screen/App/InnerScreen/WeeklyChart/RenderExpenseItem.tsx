import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useTheme } from '../../../../utils/colors';
import { scale, fontSize, spacing } from '../../../../utils/responsive';
import { MaterialIcons } from '../../../../utils/Icons';
import { formatCurrency, formatSignedCurrency } from '../../../../utils/currency';

interface Expense {
  title: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  category: string;
}

interface FriendExpenseData {
  friendName: string;
  expenses: Expense[];
  total: number;
  share: number;
  netContribution: number;
}

interface Settlement {
  from: string;
  to: string;
  amount: number;
}

interface FriendExpensesProps {
  data: FriendExpenseData[];
  totalExpense: number;
  perPersonShare: number;
  participantCount: number;
  settlements: Settlement[];
}

const ExpenseItem: React.FC<{
  item: Expense;
  index: number;
  theme: any;
}> = ({ item, index, theme }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: index * 50,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.expenseCard,
        {
          backgroundColor: theme.BACKGROUND_LIGHT,
          opacity: fadeAnim,
        },
      ]}
    >
      <View style={styles.expenseRow}>
        {/* Type indicator */}
        <View
          style={[
            styles.typeIndicator,
            {
              backgroundColor:
                item.type === 'income' ? theme.SUCCESS : theme.EXPENSE_PIE,
            },
          ]}
        />

        {/* Content */}
        <View style={styles.expenseContent}>
          <Text
            style={[styles.expenseTitle, { color: theme.TEXT }]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <View style={styles.expenseMeta}>
            <Text style={[styles.categoryText, { color: theme.LIGHT_TEXT }]}>
              {item.category}
            </Text>
            <Text style={[styles.dotSeparator, { color: theme.LIGHT_TEXT }]}>
              •
            </Text>
            <Text style={[styles.dateText, { color: theme.LIGHT_TEXT }]}>
              {item.date}
            </Text>
          </View>
        </View>

        {/* Amount */}
        <Text
          style={[
            styles.amountText,
            {
              color: item.type === 'income' ? theme.SUCCESS : theme.EXPENSE_PIE,
            },
          ]}
        >
          {formatSignedCurrency(item.type === 'income' ? item.amount : -item.amount)}
        </Text>
      </View>
    </Animated.View>
  );
};

// Compact friend card component
const FriendCard: React.FC<{
  item: FriendExpenseData;
  index: number;
  theme: any;
  avatarColor: string;
}> = ({ item, index, theme, avatarColor }) => {
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 7,
      tension: 40,
      delay: index * 80,
      useNativeDriver: true,
    }).start();
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View
        style={[
          styles.friendCard,
          {
            backgroundColor: theme.LIST_BG,
          },
        ]}
      >
        {/* Compact Friend Header */}
        <View style={styles.friendHeader}>
          <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
            <Text style={styles.avatarText}>
              {getInitials(item.friendName)}
            </Text>
          </View>

          <View style={styles.friendInfo}>
            <Text style={[styles.friendName, { color: theme.TEXT }]}>
              {item.friendName}
            </Text>
            <Text style={[styles.expenseCount, { color: theme.LIGHT_TEXT }]}>
              {item.expenses.length} txn{item.expenses.length !== 1 ? 's' : ''}
            </Text>
          </View>

          <View style={styles.totalRight}>
            <Text style={[styles.totalLabel, { color: theme.LIGHT_TEXT }]}>
              Paid
            </Text>
            <Text
              style={[
                styles.totalAmount,
                {
                  color:
                    item.netContribution >= 0
                      ? theme.SUCCESS
                      : theme.EXPENSE_PIE,
                },
              ]}
            >
              {formatCurrency(item.total)}
            </Text>
            <Text style={[styles.shareText, { color: theme.LIGHT_TEXT }]}>
              Share {formatCurrency(item.share)}
            </Text>
            <View
              style={[
                styles.netPill,
                {
                  backgroundColor:
                    item.netContribution >= 0
                      ? 'rgba(16,185,129,0.12)'
                      : 'rgba(239,68,68,0.12)',
                },
              ]}
            >
              <Text
                style={[
                  styles.netText,
                  {
                    color:
                      item.netContribution >= 0
                        ? theme.SUCCESS
                        : theme.EXPENSE_PIE,
                  },
                ]}
              >
                {item.netContribution >= 0 ? 'Gets back' : 'Owes'}{' '}
                {formatCurrency(Math.abs(item.netContribution))}
              </Text>
            </View>
          </View>
        </View>

        {/* Expenses List */}
        <View style={styles.expensesList}>
          {item.expenses.map((expense, idx) => (
            <View key={`expense-${index}-${idx}`}>
              <ExpenseItem item={expense} index={idx} theme={theme} />
              {idx < item.expenses.length - 1 && (
                <View style={{ height: 6 }} />
              )}
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

export const FriendExpenses: React.FC<FriendExpensesProps> = ({
  data,
  totalExpense,
  perPersonShare,
  participantCount,
  settlements,
}) => {
  const { theme } = useTheme();
  const [showDetails, setShowDetails] = useState(true);

  const getAvatarColor = (index: number) => {
    const colors = [
      theme.PURPLE,
      theme.LIGHT_PURPLE,
      theme.SUCCESS,
      theme.WARNING,
      '#667eea',
      '#f093fb',
      '#4facfe',
      '#fa709a',
    ];
    return colors[index % colors.length];
  };

  const peopleCount = participantCount || data.length;

  const isDark = theme.HEADER_BACKGROUND === '#0F1012';
  const cardBorder = isDark ? 'rgba(198, 165, 107, 0.15)' : 'rgba(198, 165, 107, 0.2)';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerBadge}>
          <MaterialIcons name="group" size={22} color={theme.SECONDARY} />
          <Text style={[styles.title, { color: theme.TEXT }]}>Group Split</Text>
        </View>
        <Text style={[styles.subtitle, { color: theme.LIGHT_TEXT }]}>
          {peopleCount} {peopleCount === 1 ? 'person' : 'people'} • Tap to view
          who owes whom
        </Text>
      </View>

      <View
        style={[
          styles.summaryCard,
          {
            backgroundColor: theme.BACKGROUND_LIGHT,
            borderWidth: 1,
            borderColor: cardBorder,
            ...Platform.select({
              ios: {
                shadowColor: isDark ? '#000' : theme.PURPLE,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: isDark ? 0.3 : 0.1,
                shadowRadius: 16,
              },
              android: { elevation: 8 },
            }),
          },
        ]}
      >
        <View style={styles.summaryRow}>
          <View
            style={[
              styles.statPill,
              {
                backgroundColor: theme.SECONDARY + '18',
                borderWidth: 1,
                borderColor: theme.SECONDARY + '30',
              },
            ]}
          >
            <MaterialIcons name="account-balance-wallet" size={18} color={theme.SECONDARY} />
            <Text style={[styles.statLabel, { color: theme.LIGHT_TEXT }]}>
              Group total
            </Text>
            <Text style={[styles.statValue, { color: theme.TEXT }]}>
              {formatCurrency(totalExpense)}
            </Text>
          </View>

          <View
            style={[
              styles.statPill,
              {
                backgroundColor: theme.SECONDARY + '18',
                borderWidth: 1,
                borderColor: theme.SECONDARY + '30',
              },
            ]}
          >
            <MaterialIcons name="person" size={18} color={theme.SECONDARY} />
            <Text style={[styles.statLabel, { color: theme.LIGHT_TEXT }]}>
              Per person
            </Text>
            <Text style={[styles.statValue, { color: theme.TEXT }]}>
              {formatCurrency(perPersonShare || 0)}
            </Text>
          </View>

          <View
            style={[
              styles.statPill,
              styles.statPillLast,
              {
                backgroundColor: theme.SECONDARY + '18',
                borderWidth: 1,
                borderColor: theme.SECONDARY + '30',
              },
            ]}
          >
            <MaterialIcons name="groups" size={18} color={theme.SECONDARY} />
            <Text style={[styles.statLabel, { color: theme.LIGHT_TEXT }]}>
              People
            </Text>
            <Text style={[styles.statValue, { color: theme.TEXT }]}>
              {peopleCount}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setShowDetails(prev => !prev)}
          style={[
            styles.toggleButton,
            {
              backgroundColor: theme.SECONDARY,
              ...Platform.select({
                ios: {
                  shadowColor: theme.SECONDARY,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.35,
                  shadowRadius: 10,
                },
                android: { elevation: 6 },
              }),
            },
          ]}
        >
          <MaterialIcons
            name={showDetails ? 'expand-less' : 'expand-more'}
            size={22}
            color="#1A1A1E"
          />
          <Text style={styles.toggleButtonText}>
            {showDetails ? 'Hide split details' : 'View split details'}
          </Text>
        </TouchableOpacity>

        {showDetails && (
          <View style={styles.settlementContainer}>
            <View style={styles.settlementHeader}>
              <MaterialIcons name="swap-horiz" size={18} color={theme.SECONDARY} />
              <Text style={[styles.settlementTitle, { color: theme.TEXT }]}>
                Settlement plan
              </Text>
            </View>

            {settlements.length === 0 ? (
              <View style={styles.settlementEmptyCard}>
                <MaterialIcons name="check-circle" size={36} color={theme.SUCCESS} />
                <Text
                  style={[styles.settlementEmpty, { color: theme.LIGHT_TEXT }]}
                >
                  Everyone is balanced for now.
                </Text>
              </View>
            ) : (
              settlements.map((settlement, idx) => (
                <View
                  key={`${settlement.from}-${settlement.to}-${idx}`}
                  style={[
                    styles.settlementRow,
                    {
                      borderBottomColor: theme.BORDER_COLOR + '40',
                    },
                  ]}
                >
                  <View style={styles.settlementNames}>
                    <Text
                      style={[styles.settlementName, { color: theme.TEXT }]}
                      numberOfLines={1}
                    >
                      {settlement.from}
                    </Text>
                    <MaterialIcons
                      name="arrow-forward"
                      size={16}
                      color={theme.SECONDARY}
                      style={{ marginHorizontal: 8 }}
                    />
                    <Text
                      style={[styles.settlementName, { color: theme.TEXT }]}
                      numberOfLines={1}
                    >
                      {settlement.to}
                    </Text>
                  </View>
                  <View style={[styles.settlementAmountBadge, { backgroundColor: theme.ERROR + '20' }]}>
                    <Text
                      style={[
                        styles.settlementAmount,
                        { color: theme.ERROR },
                      ]}
                    >
                      {formatCurrency(settlement.amount)}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </View>

      <View style={styles.listContent}>
        {data.length === 0 ? (
          <Text style={[styles.settlementEmpty, { color: theme.LIGHT_TEXT }]}>
            Add a friend and record a shared expense to see the split.
          </Text>
        ) : (
          data.map((item, index) => (
            <View key={`friend-${index}`}>
              <FriendCard
                item={item}
                index={index}
                theme={theme}
                avatarColor={getAvatarColor(index)}
              />
              {index < data.length - 1 && (
                <View style={{ height: 12 }} />
              )}
            </View>
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing(10),
  },
  header: {
    marginBottom: spacing(20),
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(10),
    marginBottom: spacing(6),
  },
  title: {
    fontSize: fontSize(22),
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  subtitle: {
    fontSize: fontSize(14),
    fontWeight: '500',
    opacity: 0.9,
  },
  summaryCard: {
    borderRadius: scale(20),
    padding: spacing(20),
    marginBottom: spacing(20),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing(14),
  },
  statPill: {
    flex: 1,
    padding: spacing(14),
    borderRadius: scale(16),
    marginRight: spacing(10),
    gap: spacing(6),
    alignItems: 'center',
  },
  statPillLast: {
    marginRight: 0,
  },
  statLabel: {
    fontSize: fontSize(11),
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  statValue: {
    fontSize: fontSize(18),
    fontWeight: '800',
    marginTop: spacing(2),
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  toggleButton: {
    marginTop: spacing(8),
    borderRadius: scale(14),
    paddingVertical: spacing(14),
    paddingHorizontal: spacing(18),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing(10),
  },
  toggleButtonText: {
    color: '#1A1A1E',
    fontWeight: '800',
    letterSpacing: 0.5,
    fontSize: fontSize(15),
  },
  settlementContainer: {
    marginTop: spacing(16),
    paddingTop: spacing(12),
  },
  settlementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(8),
    marginBottom: spacing(12),
  },
  settlementTitle: {
    fontSize: fontSize(15),
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  settlementEmptyCard: {
    alignItems: 'center',
    paddingVertical: spacing(24),
    paddingHorizontal: spacing(20),
    borderRadius: scale(14),
    backgroundColor: 'rgba(91, 165, 107, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(91, 165, 107, 0.2)',
  },
  settlementEmpty: {
    fontSize: fontSize(14),
    fontWeight: '600',
    marginTop: spacing(10),
    textAlign: 'center',
  },
  settlementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing(12),
    borderBottomWidth: 1,
  },
  settlementNames: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing(12),
  },
  settlementName: {
    fontSize: fontSize(14),
    fontWeight: '700',
    flex: 1,
  },
  settlementAmountBadge: {
    paddingHorizontal: spacing(12),
    paddingVertical: spacing(6),
    borderRadius: scale(10),
  },
  settlementAmount: {
    fontSize: fontSize(14),
    fontWeight: '800',
  },
  listContent: {
    paddingBottom: spacing(24),
  },
  friendCard: {
    borderRadius: scale(20),
    padding: spacing(18),
    borderWidth: 1,
    borderColor: 'rgba(198, 165, 107, 0.12)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 14,
      },
      android: { elevation: 6 },
    }),
  },
  friendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing(14),
    paddingBottom: spacing(14),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(198, 165, 107, 0.12)',
  },
  avatar: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing(12),
  },
  avatarText: {
    fontSize: fontSize(17),
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: fontSize(16),
    fontWeight: '800',
    marginBottom: spacing(2),
    letterSpacing: 0.2,
  },
  expenseCount: {
    fontSize: fontSize(12),
    fontWeight: '600',
  },
  totalRight: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: fontSize(10),
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing(2),
  },
  totalAmount: {
    fontSize: fontSize(16),
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  shareText: {
    fontSize: fontSize(12),
    fontWeight: '600',
    marginTop: spacing(4),
  },
  netPill: {
    borderRadius: scale(12),
    paddingHorizontal: spacing(12),
    paddingVertical: spacing(8),
    marginTop: spacing(8),
  },
  netText: {
    fontSize: fontSize(12),
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  expensesList: {
    marginTop: spacing(8),
  },
  expenseCard: {
    borderRadius: scale(12),
    padding: spacing(12),
  },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIndicator: {
    width: 4,
    height: 36,
    borderRadius: 2,
    marginRight: spacing(12),
  },
  expenseContent: {
    flex: 1,
    marginRight: spacing(10),
  },
  expenseTitle: {
    fontSize: fontSize(14),
    fontWeight: '700',
    marginBottom: spacing(4),
    letterSpacing: 0.1,
  },
  expenseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: fontSize(11),
    fontWeight: '600',
  },
  dotSeparator: {
    fontSize: fontSize(11),
    marginHorizontal: spacing(4),
  },
  dateText: {
    fontSize: fontSize(11),
    fontWeight: '600',
  },
  amountText: {
    fontSize: fontSize(15),
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
