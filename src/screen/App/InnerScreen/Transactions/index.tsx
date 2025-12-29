import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import React, { useState } from 'react';
import { createStyles } from './styles';
import AuthHeader from '../../../../components/core/AuthHeader';
import { useTheme } from '../../../../utils/colors';
import {
  FeatherIcon,
  FontAwesome5Icon,
  MaterialCommunityIcon,
  MaterialIcons,
} from '../../../../utils/Icons';
import { FilterBar } from '../../../../components/FilterBar';
import TransactionList from '../../../../components/transaction';
import BookTransactionItem from '../../../../components/transaction/BookTransactionItem';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
  FadeInDown,
  FadeIn,
} from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFetchTransaction } from '../../../../ReactQueryHook/transaction.hook';
import { useFetchFriend } from '../../../../ReactQueryHook/friend.hook';
import { getPositiveNumber } from '../../../../utils/helper';

const AnimatedPressable = Animated.createAnimatedComponent(TouchableOpacity);

const SPRING_CONFIG = {
  duration: 1200,
  overshootClamping: true,
  dampingRatio: 0.8,
};

const OFFSET = 60;

const Transactions = () => {
  const styles = createStyles();
  const { theme } = useTheme();
  const [filter, setFilter] = useState('all');
  const route: any = useRoute();
  const navigation: any = useNavigation();

  const bookTitle: string = route?.params?.title;
  const bookType: 'single' | 'group' = route?.params?.type;
  const bookId: string = route?.params?.bookId;

  const {
    data: transactionData,
    isLoading: refreshing,
    refetch,
  } = useFetchTransaction(bookId);
  const {
    data: friendData,
    refetch: friendRefetch,
    isLoading: fetching,
  } = useFetchFriend(bookId);
  console.log('transaction ==>', transactionData);
  const IncomeExpense = [
    {
      type: 'income',
      total: transactionData?.totals?.income,
    },
    {
      type: 'Expenses',
      total: transactionData?.totals?.expense,
    },
  ];

  const filteredTransactions =
    filter === 'all'
      ? transactionData?.transactions
      : transactionData?.transactions?.filter(
          (transaction: any) => transaction.type === filter,
        );

  const renderRecentTransaction = ({ item, index }: any) => {
    return (
      <AnimatedView
        entering={FadeInDown.delay(index * 50)
          .springify()
          .damping(15)}
      >
        <BookTransactionItem
          {...item}
          bookId={bookId}
          onEdit={() => {
            // Handle edit action
            console.log('Edit transaction', item);
          }}
        />
      </AnimatedView>
    );
  };

  const EmptyListComponent = () => (
    <AnimatedView
      entering={FadeIn.delay(300).springify()}
      style={styles.emptyState}
    >
      <AnimatedView
        entering={FadeInDown.delay(400).springify()}
        style={styles.emptyIconContainer}
      >
        <MaterialIcons name="receipt-long" size={72} color={theme.PURPLE} />
      </AnimatedView>
      <Text style={[styles.emptyText, { color: theme.TEXT }]}>
        {refreshing
          ? 'Loading transactions...'
          : 'No recent transactions found'}
      </Text>
      <Text style={[styles.emptySubText, { color: theme.TEXT }]}>
        {refreshing
          ? 'Please wait while we fetch your data'
          : 'Add your first transaction to get started'}
      </Text>
    </AnimatedView>
  );

  const isExpanded = useSharedValue(false);

  const handlePress = () => {
    if (bookType === 'group') {
      return navigation.navigate('AddTransaction', {
        type: 'expense',
        bookType,
        bookId,
      });
    }
    isExpanded.value = !isExpanded.value;
  };

  const plusIconStyle = useAnimatedStyle(() => {
    const moveValue = interpolate(Number(isExpanded.value), [0, 1], [0, 2]);
    const translateValue = withTiming(moveValue);
    const rotateValue = isExpanded.value ? '45deg' : '0deg';

    return {
      transform: [
        { translateX: translateValue },
        { rotate: withTiming(rotateValue) },
      ],
    };
  });

  const FloatingActionButton = ({
    isExpanded,
    index,
    buttonLetter,
    type,
  }: any) => {
    const animatedStyles = useAnimatedStyle(() => {
      const moveValue = isExpanded.value ? OFFSET * index : 0;
      const translateValue = withSpring(-moveValue, SPRING_CONFIG);
      const delay = index * 100;

      const scaleValue = isExpanded.value ? 1 : 0;

      return {
        transform: [
          { translateY: translateValue },
          {
            scale: withDelay(delay, withTiming(scaleValue)),
          },
        ],
      };
    });

    const handleNavigation = () => {
      isExpanded.value = 0;
      // if (type === 'category') {
      //     return navigation.navigate('Categories');
      // }
      navigation.navigate('AddTransaction', { type: type, bookType, bookId });
    };

    const getButtonColor = () => {
      switch (type) {
        // case 'income':
        //     return theme.SUCCESS;
        // case 'expense':
        //     return theme.ERROR;
        // case 'category':
        //     return theme.PURPLE;
        // case 'friend':
        //     return theme.NAVBAR_BACKGROUND
        default:
          return theme.DARK_BG;
      }
    };

    return (
      <AnimatedPressable
        onPress={handleNavigation}
        style={[
          animatedStyles,
          styles.shadow,
          styles.button,
          { backgroundColor: getButtonColor() },
        ]}
      >
        <Animated.Text style={styles.btnContent}>{buttonLetter}</Animated.Text>
      </AnimatedPressable>
    );
  };

  const viewFriend = () => {
    navigation.navigate('Friends', { bookId });
  };

  const keyExtractor = 1;
  return (
    <View style={styles.root}>
      <View style={styles.headerWrapper}>
        <AuthHeader
          title={`${bookTitle}'s Transactions`}
          showRightIcon={true}
          rightIconName="chart-bar"
          onRightIconPress={() =>
            navigation.navigate('InnerScreen', {
              screen: 'TransactionChart',
              params: { bookId },
            })
          }
        />
      </View>
      <View style={styles.container}>
        <View style={styles.topSection}>
          <AnimatedView
            entering={FadeInDown.delay(100).springify()}
            style={styles.innerTop}
          >
            {bookType === 'group' && (
              <View style={styles.card}>
                <View style={styles.totalInner}>
                  <MaterialIcons
                    name="account-balance-wallet"
                    size={24}
                    color={theme.SECONDARY}
                  />
                  <Text style={styles.totalText}>Total Balance</Text>
                </View>
                <Text
                  style={[
                    styles.price,
                    { fontSize: bookType === 'group' ? 28 : 32 },
                  ]}
                >
                  Rs.{' '}
                  {bookType === 'group'
                    ? getPositiveNumber(transactionData?.totals?.balance)
                    : transactionData?.totals?.balance}
                </Text>
              </View>
            )}
          </AnimatedView>
          {bookType === 'single' && (
            <AnimatedView
              entering={FadeInDown.delay(150).springify()}
              style={styles.row}
            >
              {IncomeExpense.map(
                (finance: { type: string; total: string }, index: number) => (
                  <AnimatedView
                    entering={FadeInDown.delay(200 + index * 50).springify()}
                    style={styles.typeContainer}
                    key={finance.type}
                  >
                    <Text style={styles.typeText}>
                      {finance.type.charAt(0).toUpperCase() +
                        finance.type.slice(1)}
                    </Text>
                    <View style={styles.typeInnerContainer}>
                      <FeatherIcon
                        size={22}
                        color={
                          finance.type.toLowerCase() === 'income'
                            ? theme.SUCCESS
                            : theme.ERROR
                        }
                        name={
                          finance.type.toLowerCase() === 'income'
                            ? 'arrow-up'
                            : 'arrow-down'
                        }
                      />
                      <Text
                        style={[
                          styles.typePrice,
                          {
                            color:
                              finance.type.toLowerCase() === 'income'
                                ? theme.SUCCESS
                                : theme.ERROR,
                          },
                        ]}
                      >
                        Rs. {finance.total}
                      </Text>
                    </View>
                  </AnimatedView>
                ),
              )}
            </AnimatedView>
          )}
        </View>
        <View style={styles.content}>
          {bookType === 'single' ? (
            <FilterBar
              key={keyExtractor}
              filter={filter}
              setFilter={setFilter}
            />
          ) : (
            <View style={styles.friendsStatsRow}>
              <View style={styles.friendsStats}>
                <Text style={styles.friendsMainStat}>Group</Text>
                <Text style={styles.friendsSubStat}>{`( ${
                  friendData?.length ?? 0
                } members)`}</Text>
              </View>

              <TouchableOpacity onPress={viewFriend}>
                <Text style={styles.seeFriendText}>See Friend</Text>
              </TouchableOpacity>
            </View>
          )}
          <FlatList
            data={filteredTransactions}
            renderItem={renderRecentTransaction}
            keyExtractor={(item, index) =>
              item?._id || item?.id || `transaction-${index}`
            }
            showsVerticalScrollIndicator={false}
            style={styles.flatList}
            scrollEnabled={true}
            bounces={true}
            ListEmptyComponent={EmptyListComponent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing || fetching}
                onRefresh={() => {
                  friendRefetch();
                  refetch();
                }}
                colors={[theme.PRIMARY]}
                tintColor={theme.PURPLE}
                progressBackgroundColor={theme.SECONDARY}
              />
            }
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            ListFooterComponent={<View style={{ height: 100 }} />}
          />
        </View>
      </View>
      <View style={styles.fabWrapper} pointerEvents="box-none">
        <AnimatedPressable
          onPress={handlePress}
          style={[styles.shadow, styles.mainButton]}
        >
          <Animated.Text style={[plusIconStyle, styles.mainButtonContent]}>
            +
          </Animated.Text>
        </AnimatedPressable>
        <FloatingActionButton
          isExpanded={isExpanded}
          index={2}
          buttonLetter="+ Income"
          type="income"
        />
        <FloatingActionButton
          isExpanded={isExpanded}
          index={1}
          buttonLetter="- Expense"
          type="expense"
        />
      </View>
    </View>
  );
};

export default Transactions;
