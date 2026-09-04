import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { createStyles } from './styles';
import AuthHeader from '../../../../components/core/AuthHeader';
import { useTheme } from '../../../../utils/colors';
import { MaterialIcons } from '../../../../utils/Icons';
import { FilterBar } from '../../../../components/FilterBar';
import BookTransactionItem from '../../../../components/transaction/BookTransactionItem';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  FadeInDown,
  FadeIn,
} from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFetchTransaction } from '../../../../ReactQueryHook/transaction.hook';
import { useFetchFriend } from '../../../../ReactQueryHook/friend.hook';
import { getPositiveNumber } from '../../../../utils/helper';
import ShareBookSheet from '../../BookScreen/Components/ShareBookSheet';
import { SkeletonTransactionRow } from '../../../../components/skeleton';
import { scale } from '../../../../utils/responsive';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedPressable = Animated.createAnimatedComponent(TouchableOpacity);

/** Vertical stack above main + FAB (bottom offset per satellite). */
const FAB_MAIN_SIZE = scale(58);
const FAB_STACK_GAP = scale(8);
const FAB_STEP = scale(44) + scale(7);
const fabStackBottom = (index: number) =>
  FAB_MAIN_SIZE + FAB_STACK_GAP + (index - 1) * FAB_STEP;

const Transactions = () => {
  const styles = createStyles();
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState('all');
  const route: any = useRoute();
  const navigation: any = useNavigation();

  const bookTitle: string = route?.params?.title;
  const bookType: 'single' | 'group' = route?.params?.type;
  const bookId: string = route?.params?.bookId;
  const isSharedBook: boolean = route?.params?.isShared === true;

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

  const filteredTransactions = useMemo(() =>
    filter === 'all'
      ? transactionData?.transactions
      : transactionData?.transactions?.filter(
          (transaction: any) => transaction.type === filter,
        ), [filter, transactionData?.transactions]);

  const overviewTotals = useMemo(() => {
    const income = Number(transactionData?.totals?.income ?? 0);
    const expense = Number(transactionData?.totals?.expense ?? 0);
    const totalFlow = income + expense;
    const incomePct = totalFlow > 0 ? (income / totalFlow) * 100 : 0;
    const expensePct = totalFlow > 0 ? (expense / totalFlow) * 100 : 0;
    const showFlowBar = totalFlow > 0;
    return { income, expense, incomePct, expensePct, showFlowBar };
  }, [transactionData?.totals?.income, transactionData?.totals?.expense]);

  const renderRecentTransaction = useCallback(({ item, index }: any) => {
    return (
      <AnimatedView
        entering={FadeInDown.delay(index * 50)
          .springify()
          .damping(15)}
      >
        <BookTransactionItem
          {...item}
          bookId={bookId}
          canEdit={true}
          onEdit={() => {
            navigation.navigate('AddTransaction', {
              type: item.type,
              bookType,
              bookId,
              transactionId: item._id || item.id,
              transaction: item,
            });
          }}
        />
      </AnimatedView>
    );
  }, [navigation, bookId, bookType]);

  const EmptyListComponent = useCallback(() => {
    if (refreshing || fetching) {
      return (
        <AnimatedView
          entering={FadeIn.delay(200).springify()}
          style={styles.emptyState}
        >
          {[0, 1, 2].map(index => (
            <AnimatedView
              key={index}
              entering={FadeInDown.delay(250 + index * 80).springify()}
            >
              <SkeletonTransactionRow theme={theme} />
            </AnimatedView>
          ))}
        </AnimatedView>
      );
    }

    return (
      <AnimatedView
        entering={FadeIn.delay(300).springify()}
        style={styles.emptyState}
      >
        <AnimatedView
          entering={FadeInDown.delay(400).springify()}
          style={styles.emptyIconContainer}
        >
          <MaterialIcons name="receipt-long" size={72} color={theme.ICON_COLOR} />
        </AnimatedView>
        <Text style={[styles.emptyText, { color: theme.TEXT }]}>
          No recent transactions found
        </Text>
        <Text style={[styles.emptySubText, { color: theme.TEXT }]}>
          Add your first transaction to get started
        </Text>
      </AnimatedView>
    );
  // styles.* are stable enough for empty state; theme drives colors
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshing, fetching, theme]);

  const isExpanded = useSharedValue(false);

  const handlePress = useCallback(() => {
    if (bookType === 'group') {
      return navigation.navigate('AddTransaction', {
        type: 'expense',
        bookType,
        bookId,
      });
    }
    isExpanded.value = !isExpanded.value;
  // isExpanded is a Reanimated shared ref
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookType, bookId, navigation]);

  const viewFriend = useCallback(() => {
    navigation.navigate('Friends', { bookId, isShared: isSharedBook });
  }, [navigation, bookId, isSharedBook]);

  const keyExtractor = useCallback((item: any, index: number) =>
    item?._id || item?.id || `transaction-${index}`, []);

  const plusIconStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: withTiming(isExpanded.value ? '45deg' : '0deg') },
    ],
  }));

  const FloatingActionButton = ({
    isExpanded,
    index,
    buttonLetter,
    type,
  }: any) => {
    const animatedStyles = useAnimatedStyle(() => {
      const delay = index * 100;
      const scaleValue = isExpanded.value ? 1 : 0;

      return {
        transform: [
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
        case 'income':
          return theme.SUCCESS;
        case 'expense':
          return theme.ERROR;
        default:
          return theme.PURPLE;
      }
    };

    return (
      <AnimatedPressable
        onPress={handleNavigation}
        style={[
          animatedStyles,
          styles.fabExpandedShadow,
          styles.fabExpandedButton,
          {
            backgroundColor: getButtonColor(),
            bottom: fabStackBottom(index),
          },
        ]}
      >
        <View style={styles.fabExpandedInner}>
          <MaterialIcons
            name={type === 'income' ? 'trending-up' : 'trending-down'}
            size={16}
            color="#FFFFFF"
          />
          <Animated.Text style={styles.fabExpandedLabel} numberOfLines={1}>
            {buttonLetter}
          </Animated.Text>
        </View>
      </AnimatedPressable>
    );
  };

  const [shareSheetVisible, setShareSheetVisible] = React.useState(false);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={
          isDark
            ? [theme.HEADER_BACKGROUND, theme.HEADER_BACKGROUND, theme.SECONDARY + '10']
            : [theme.HEADER_BACKGROUND, theme.HEADER_BACKGROUND, theme.SECONDARY + '08']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
          style={[
          styles.headerWrapper,
          {
            paddingTop: insets.top,
          },
        ]}
      >
        <AuthHeader
          compact
          title={bookTitle ? `${bookTitle}'s Transactions` : 'Transactions'}
          showRightIcon={true}
          rightIconName={'chart-bar'}
          rightIconSize={isSharedBook ? 18 : 26}
          onRightIconPress={
           () =>
                  navigation.navigate('InnerScreen', {
                    screen: 'TransactionChart',
                    params: { bookId },
                  })
          }
        />
      </LinearGradient>
      <View style={styles.container}>
        <View style={styles.topSection}>
          <AnimatedView
            entering={FadeInDown.delay(100).springify()}
            style={styles.innerTop}
          >
            {bookType === 'group' && (
              <View style={styles.groupOverviewWrap}>
                <View style={styles.overviewBalanceCard}>
                  <LinearGradient
                    colors={
                      isDark
                        ? [
                            'rgba(198,165,107,0.14)',
                            'rgba(255,255,255,0.03)',
                            'transparent',
                          ]
                        : [
                            'rgba(198,165,107,0.12)',
                            'rgba(255,255,255,0.65)',
                            'rgba(255,255,255,0.2)',
                          ]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.overviewBalanceGradient}
                  />
                  <View style={styles.overviewBalanceInner}>
                    <View
                      style={[
                        styles.overviewBalanceIconRing,
                        {
                          borderColor: isDark
                            ? 'rgba(198, 165, 107, 0.45)'
                            : theme.SECONDARY + '40',
                          backgroundColor: isDark
                            ? 'rgba(198, 165, 107, 0.12)'
                            : theme.SECONDARY + '14',
                        },
                      ]}
                    >
                      <MaterialIcons
                        name="groups"
                        size={22}
                        color={theme.SECONDARY}
                      />
                    </View>
                    <View style={styles.overviewBalanceCopy}>
                      <Text style={styles.overviewBalanceEyebrow}>
                        Group balance
                      </Text>
                      <Text
                        style={styles.overviewBalanceText}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        minimumFontScale={0.75}
                      >
                        Rs. {getPositiveNumber(transactionData?.totals?.balance)}
                      </Text>
                      <View
                        style={[
                          styles.overviewBalanceUnderline,
                          { backgroundColor: theme.SECONDARY },
                        ]}
                      />
                    </View>
                  </View>
                </View>
              </View>
            )}
          </AnimatedView>
          {bookType === 'single' && (
            <AnimatedView
              entering={FadeInDown.delay(150).springify()}
              style={styles.overviewColumn}
            >
              <View style={styles.overviewBalanceCard}>
                <LinearGradient
                  colors={
                    isDark
                      ? [
                          'rgba(198,165,107,0.14)',
                          'rgba(255,255,255,0.03)',
                          'transparent',
                        ]
                      : [
                          'rgba(198,165,107,0.12)',
                          'rgba(255,255,255,0.65)',
                          'rgba(255,255,255,0.2)',
                        ]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.overviewBalanceGradient}
                />
                <View style={styles.overviewBalanceInner}>
                  <View
                    style={[
                      styles.overviewBalanceIconRing,
                      {
                        borderColor: isDark
                          ? 'rgba(198, 165, 107, 0.45)'
                          : theme.SECONDARY + '40',
                        backgroundColor: isDark
                          ? 'rgba(198, 165, 107, 0.12)'
                          : theme.SECONDARY + '14',
                      },
                    ]}
                  >
                    <MaterialIcons
                      name="account-balance-wallet"
                      size={22}
                      color={theme.SECONDARY}
                    />
                  </View>
                  <View style={styles.overviewBalanceCopy}>
                    <Text style={styles.overviewBalanceEyebrow}>
                      Book balance
                    </Text>
                    <Text
                      style={styles.overviewBalanceText}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.72}
                    >
                      Rs. {transactionData?.totals?.balance ?? '0'}
                    </Text>
                    <View
                      style={[
                        styles.overviewBalanceUnderline,
                        { backgroundColor: theme.SECONDARY },
                      ]}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.overviewStatRow}>
                <View
                  style={[
                    styles.overviewStatCard,
                    styles.overviewStatCardIncome,
                  ]}
                >
                  <View
                    style={[
                      styles.overviewStatIcon,
                      { backgroundColor: theme.SUCCESS + '26' },
                    ]}
                  >
                    <MaterialIcons
                      name="trending-up"
                      size={17}
                      color={theme.SUCCESS}
                    />
                  </View>
                  <View style={styles.overviewStatTextBlock}>
                    <Text style={styles.overviewStatLabel}>Income</Text>
                    <Text
                      style={[
                        styles.overviewStatValue,
                        { color: theme.SUCCESS },
                      ]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.78}
                    >
                      Rs. {transactionData?.totals?.income ?? '0'}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.overviewStatCard,
                    styles.overviewStatCardExpense,
                  ]}
                >
                  <View
                    style={[
                      styles.overviewStatIcon,
                      { backgroundColor: theme.ERROR + '26' },
                    ]}
                  >
                    <MaterialIcons
                      name="trending-down"
                      size={17}
                      color={theme.ERROR}
                    />
                  </View>
                  <View style={styles.overviewStatTextBlock}>
                    <Text style={styles.overviewStatLabel}>Expenses</Text>
                    <Text
                      style={[
                        styles.overviewStatValue,
                        { color: theme.ERROR },
                      ]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.78}
                    >
                      Rs. {transactionData?.totals?.expense ?? '0'}
                    </Text>
                  </View>
                </View>
              </View>
              {overviewTotals.showFlowBar && (
                <View style={styles.overviewFlowTrack}>
                  <View
                    style={[
                      styles.overviewFlowSegment,
                      {
                        width: `${Math.max(
                          0,
                          Math.round(overviewTotals.incomePct),
                        )}%`,
                        backgroundColor: theme.SUCCESS,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.overviewFlowSegment,
                      {
                        width: `${Math.max(
                          0,
                          Math.round(overviewTotals.expensePct),
                        )}%`,
                        backgroundColor: theme.ERROR,
                      },
                    ]}
                  />
                </View>
              )}
            </AnimatedView>
          )}
        </View>
        <View style={styles.content}>
          {bookType === 'single' ? (
            <FilterBar
              filter={filter}
              setFilter={setFilter}
              key="filter-bar"
            />
          ) : (
            <View style={styles.friendsStatsRow}>
              <View style={styles.friendsStats}>
                <Text style={styles.friendsMainStat}>Group</Text>
                <Text style={styles.friendsSubStat}>{`(${friendData?.length ?? 0} members)`}</Text>
              </View>
              <TouchableOpacity onPress={viewFriend}>
                <Text style={styles.seeFriendText}>See Friend</Text>
              </TouchableOpacity>
            </View>
          )}
          <AnimatedView
            entering={FadeInDown.delay(180).springify()}
            style={styles.helperRow}
          >
            <MaterialIcons
              name="swipe"
              size={18}
              color={theme.LIGHT_TEXT}
            />
            <Text style={styles.helperText}>
              Slide a transaction left to edit or delete
            </Text>
          </AnimatedView>
          <FlatList
            data={filteredTransactions}
            renderItem={renderRecentTransaction}
            keyExtractor={keyExtractor}
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
                colors={[theme.SECONDARY]}
                tintColor={theme.SECONDARY}
              />
            }
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            ListFooterComponent={<View style={{ height: 100 }} />}
          />
        </View>
      </View>
      <View
        style={[styles.fabWrapper, { bottom: Math.max(insets.bottom, 12) + 8 }]}
        pointerEvents="box-none"
      >
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
          buttonLetter="Income"
          type="income"
        />
        <FloatingActionButton
          isExpanded={isExpanded}
          index={1}
          buttonLetter="Expense"
          type="expense"
        />
      </View>
      {isSharedBook && (
        <ShareBookSheet
          isVisible={shareSheetVisible}
          onClose={() => setShareSheetVisible(false)}
          bookId={bookId}
          bookTitle={bookTitle}
        />
      )}
    </View>
  );
};

export default Transactions;
