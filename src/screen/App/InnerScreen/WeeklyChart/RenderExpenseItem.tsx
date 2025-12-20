import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../../../utils/colors';

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
}

interface FriendExpensesProps {
  data: FriendExpenseData[];
}

const { width } = Dimensions.get('window');

// Compact expense item component
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
          {item.type === 'income' ? '+' : '-'}₹
          {item.amount.toLocaleString('en-IN', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
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
              Total
            </Text>
            <Text
              style={[
                styles.totalAmount,
                {
                  color: item.total >= 0 ? theme.SUCCESS : theme.EXPENSE_PIE,
                },
              ]}
            >
              ₹
              {Math.abs(item.total).toLocaleString('en-IN', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </Text>
          </View>
        </View>

        {/* Expenses List */}
        <View style={styles.expensesList}>
          <FlatList
            data={item.expenses}
            renderItem={({ item: expense, index: idx }) => (
              <ExpenseItem item={expense} index={idx} theme={theme} />
            )}
            keyExtractor={(expense, idx) => `expense-${index}-${idx}`}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
          />
        </View>
      </View>
    </Animated.View>
  );
};

export const FriendExpenses: React.FC<FriendExpensesProps> = ({ data }) => {
  const { theme } = useTheme();

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

  return (
    <View style={styles.container}>
      {/* Compact Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.TEXT }]}>
          Friend Expenses
        </Text>
        <Text style={[styles.subtitle, { color: theme.LIGHT_TEXT }]}>
          {data.length} {data.length === 1 ? 'friend' : 'friends'} • Track group
          spending
        </Text>
      </View>

      {/* Friends List */}
      <FlatList
        data={data}
        renderItem={({ item, index }) => (
          <FriendCard
            item={item}
            index={index}
            theme={theme}
            avatarColor={getAvatarColor(index)}
          />
        )}
        keyExtractor={(item, index) => `friend-${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 16,
  },
  friendCard: {
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  friendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  expenseCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  totalRight: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  expensesList: {
    marginTop: 0,
  },
  expenseCard: {
    borderRadius: 10,
    padding: 10,
  },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIndicator: {
    width: 3,
    height: 32,
    borderRadius: 2,
    marginRight: 10,
  },
  expenseContent: {
    flex: 1,
    marginRight: 8,
  },
  expenseTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.1,
  },
  expenseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '500',
  },
  dotSeparator: {
    fontSize: 11,
    marginHorizontal: 4,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '500',
  },
  amountText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
