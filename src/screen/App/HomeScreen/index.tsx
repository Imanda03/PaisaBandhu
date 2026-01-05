import { View, Text, FlatList, RefreshControl, Dimensions } from 'react-native';
import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withTiming,
  withSpring,
  FadeInDown,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { createStyles } from './styles';
import Header from './components/Header';
import SecondHeader from './components/SecondHeader';
import Chart from './components/Chart';
import { MaterialIcons } from '../../../utils/Icons';
import { useTheme } from '../../../utils/colors';
import TransactionList from '../../../components/transaction';
import { useFetchLatestTransaction } from '../../../ReactQueryHook/transaction.hook';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

// Collapsed and expanded heights
const COLLAPSED_HEIGHT = SCREEN_HEIGHT * 0.35; // 35% of screen
const EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.85; // 85% of screen
const MIN_HEIGHT = SCREEN_HEIGHT * 0.25; // Minimum 25%

const HomeScreen = () => {
  const styles = createStyles();
  const { theme } = useTheme();
  const {
    data: transactionData,
    isLoading: refreshing,
    refetch,
  } = useFetchLatestTransaction();

  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);

  // Draggable panel animation values
  const translateY = useSharedValue(0);
  const panelHeight = useSharedValue(COLLAPSED_HEIGHT);
  const isExpanded = useSharedValue(false);

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 600 });
    slideAnim.value = withSpring(0, {
      damping: 15,
      stiffness: 100,
    });
    panelHeight.value = withSpring(COLLAPSED_HEIGHT, {
      damping: 20,
      stiffness: 100,
    });
  }, []);

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }));

  // Gesture handler for dragging
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startY = translateY.value;
      ctx.startHeight = panelHeight.value;
    },
    onActive: (event, ctx: any) => {
      // Calculate new height based on drag direction (negative = up)
      const newHeight = ctx.startHeight - event.translationY;
      const clampedHeight = Math.max(
        MIN_HEIGHT,
        Math.min(EXPANDED_HEIGHT, newHeight),
      );
      panelHeight.value = clampedHeight;
      translateY.value = event.translationY;
    },
    onEnd: event => {
      const currentHeight = panelHeight.value;
      const velocity = event.velocityY;

      // Determine target height based on velocity and current position
      let targetHeight = COLLAPSED_HEIGHT;
      const midPoint = (COLLAPSED_HEIGHT + EXPANDED_HEIGHT) / 2;

      if (velocity < -500 || (velocity < 0 && currentHeight > midPoint)) {
        // Fast upward swipe or already past midpoint - expand
        targetHeight = EXPANDED_HEIGHT;
        isExpanded.value = true;
      } else if (velocity > 500 || (velocity > 0 && currentHeight < midPoint)) {
        // Fast downward swipe or below midpoint - collapse
        targetHeight = COLLAPSED_HEIGHT;
        isExpanded.value = false;
      } else {
        // Snap to nearest position
        targetHeight =
          currentHeight > midPoint ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT;
        isExpanded.value = targetHeight === EXPANDED_HEIGHT;
      }

      panelHeight.value = withSpring(targetHeight, {
        damping: 20,
        stiffness: 100,
        mass: 0.8,
      });
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 100,
      });
    },
  });

  // Animated style for the draggable panel
  const panelAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      panelHeight.value,
      [COLLAPSED_HEIGHT, EXPANDED_HEIGHT],
      [0.95, 1],
      Extrapolation.CLAMP,
    );

    return {
      height: panelHeight.value,
      opacity,
      transform: [{ translateY: translateY.value }],
    };
  });

  // Animated style for the drag handle
  const handleAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      panelHeight.value,
      [COLLAPSED_HEIGHT, EXPANDED_HEIGHT],
      [1, 1.2],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ scale }],
    };
  });

  const EmptyListComponent = () => (
    <AnimatedView
      entering={FadeInDown.delay(200).springify()}
      style={styles.emptyState}
    >
      <View style={styles.emptyIconContainer}>
        <MaterialIcons name="receipt-long" size={56} color={theme.PURPLE} />
      </View>
      <Text style={[styles.emptyText, { color: theme.TEXT }]}>
        {refreshing ? 'Loading transactions...' : 'No transactions yet'}
      </Text>
      <Text style={[styles.emptySubText, { color: theme.TEXT }]}>
        {refreshing
          ? 'Please wait while we fetch your data'
          : 'Start tracking your expenses by adding your first transaction'}
      </Text>
    </AnimatedView>
  );

  const renderRecentTransaction = ({ item, index }: any) => {
    return (
      <AnimatedView entering={FadeInDown.delay(index * 50).springify()}>
        <TransactionList {...item} />
      </AnimatedView>
    );
  };

  return (
    <View style={styles.root}>
      {/* Header Section with smooth animation */}
      <AnimatedView style={[styles.headerSection, animatedHeaderStyle]}>
        <Header />
        <SecondHeader />
      </AnimatedView>

      {/* Chart Section with gap */}
      <AnimatedView
        entering={FadeInDown.delay(100).springify()}
        style={styles.chartSection}
      >
        <Chart />
      </AnimatedView>

      {/* Draggable Transactions Panel */}
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <AnimatedView style={[styles.draggablePanel, panelAnimatedStyle]}>
          {/* Drag Handle */}
          <View style={styles.dragHandleContainer}>
            <Animated.View style={[styles.dragHandle, handleAnimatedStyle]}>
              <View
                style={[styles.dragHandleBar, { backgroundColor: theme.TEXT }]}
              />
            </Animated.View>
          </View>

          {/* Section Header */}
          <AnimatedView
            entering={FadeInDown.delay(150).springify()}
            style={styles.panelHeader}
          >
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <MaterialIcons
                  name="receipt-long"
                  size={26}
                  color={theme.PURPLE}
                />
                <View style={styles.titleWithHint}>
                  <Text style={[styles.sectionTitle, { color: theme.TEXT }]}>
                    Latest Transactions
                  </Text>
                  <Text style={[styles.dragHint, { color: theme.TEXT }]}>
                    drag up
                  </Text>
                </View>
              </View>
              {transactionData && transactionData.length > 0 && (
                <View style={styles.countBadge}>
                  <Text style={[styles.countText, { color: theme.SECONDARY }]}>
                    {transactionData.length}
                  </Text>
                </View>
              )}
            </View>
          </AnimatedView>

          {/* Transactions List */}
          <AnimatedFlatList
            data={transactionData}
            renderItem={renderRecentTransaction}
            keyExtractor={(item: any, index) =>
              item?._id || item?.id || `transaction-${index}`
            }
            showsVerticalScrollIndicator={false}
            style={styles.transactionsList}
            scrollEnabled={true}
            bounces={true}
            contentContainerStyle={styles.listContentContainer}
            ListEmptyComponent={EmptyListComponent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refetch}
                colors={[theme.PURPLE]}
                tintColor={theme.PURPLE}
                progressBackgroundColor={theme.SECONDARY}
                progressViewOffset={20}
              />
            }
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </AnimatedView>
      </PanGestureHandler>
    </View>
  );
};

export default HomeScreen;
