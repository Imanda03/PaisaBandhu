import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  findNodeHandle,
  UIManager,
  Dimensions,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  FadeInDown,
  FadeIn,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useTheme } from '../../../utils/colors';
import { createStyles } from './styles';
import { IoniconsIcon, MaterialIcons } from '../../../utils/Icons';
import BookListItem from '../../../components/books';
import BottomSheet from '../../../components/BottomSheet';
import { useNavigation } from '@react-navigation/native';
import BookFormSheet from './Components/BookFormSheet';
import { useFetchFinancialBook } from '../../../ReactQueryHook/book.hook';
import { BookInterfaceProps } from '../../../utils/types';
import { useGuideTour } from '../../../context/GuideTourContext';
import BannerAdView from '../../../components/ads/BannerAdView';
import { SkeletonBookCardRow } from '../../../components/skeleton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const emptyBook: BookInterfaceProps = { id: '', title: '', type: 'single' };

const BookScreen = () => {
  const styles = createStyles();
  const { theme, isDark } = useTheme();
  const { tourStep, setTargetLayout, goNextStep, finishTour } = useGuideTour();
  const fabRef = useRef<View>(null);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [selectedBook, setSelectedBook] =
    useState<BookInterfaceProps>(emptyBook);

  const navigation: any = useNavigation();

  const {
    data: financialBook,
    refetch,
    isLoading: fetchLoading,
  } = useFetchFinancialBook();

  // Animation values
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-30);
  const fabScale = useSharedValue(0);
  const fabRotation = useSharedValue(0);

  useEffect(() => {
    // Header animation
    headerOpacity.value = withTiming(1, { duration: 600 });
    headerTranslateY.value = withSpring(0, {
      damping: 15,
      stiffness: 100,
    });

    // FAB animation with pulse
    fabScale.value = withSpring(1, {
      damping: 12,
      stiffness: 150,
    });

    // Continuous rotation pulse for FAB
    fabRotation.value = withRepeat(
      withSequence(
        withTiming(5, { duration: 2000 }),
        withTiming(-5, { duration: 2000 }),
      ),
      -1,
      true,
    );
  }, []);

  const handleBookPress = useCallback((book: BookInterfaceProps) => {
    if (tourStep === 3) finishTour();
    navigation.navigate('InnerScreen', {
      screen: 'Transactions',
      params: { bookId: book.id, type: book.type, title: book.title, isShared: book.isShared },
    });
  }, [navigation, tourStep, finishTour]);

  const openAddBookModal = useCallback(() => {
    if (tourStep === 2) goNextStep();
    setIsAddMode(true);
    setBottomSheetVisible(true);
  }, [tourStep, goNextStep]);

  const openEditBookModal = useCallback((bookItem: BookInterfaceProps) => {
    setIsAddMode(false);
    setBottomSheetVisible(true);
    setSelectedBook(bookItem);
  }, []);

  const bookColumnCount =
    financialBook && financialBook.length > 0 ? 2 : 1;

  const booksGridData = useMemo(() => {
    const raw = financialBook ?? [];
    if (raw.length % 2 === 1) {
      return [...raw, null];
    }
    return raw;
  }, [financialBook]);

  const flatListData =
    bookColumnCount === 2 ? booksGridData : financialBook ?? [];

  const renderBookList = useCallback(
    ({ item, index }: any) => {
      if (item == null) {
        return <View style={styles.bookGridCell} />;
      }
      return (
        <AnimatedView
          style={bookColumnCount === 2 ? styles.bookGridCell : undefined}
          entering={FadeInDown.delay((index % 6) * 45)
            .springify()
            .damping(15)}
        >
          <BookListItem
            layout={bookColumnCount === 2 ? 'grid' : 'list'}
            listIndex={index}
            item={item}
            onEditPress={() => openEditBookModal(item)}
            onPress={() => handleBookPress(item)}
          />
        </AnimatedView>
      );
    },
    [handleBookPress, openEditBookModal, bookColumnCount, styles.bookGridCell],
  );

  const handleCloseSheet = useCallback(() => {
    setBottomSheetVisible(false);
    setSelectedBook({ id: '', title: '', type: 'single' });
  }, []);

  useEffect(() => {
    if (tourStep === 2 && fabRef.current) {
      const tag = findNodeHandle(fabRef.current);
      if (tag != null) {
        UIManager.measureInWindow(tag, (x, y, width, height) => {
          setTargetLayout({ x, y, width, height }, 'Tap + to create your first book');
        });
      }
      return () => setTargetLayout(null, '');
    }
  }, [tourStep, setTargetLayout]);

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const fabAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: fabScale.value },
      { rotate: `${fabRotation.value}deg` },
    ],
  }));

  const EmptyListComponent = () => {
    if (fetchLoading) {
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
              <SkeletonBookCardRow theme={theme} />
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
          <MaterialIcons name="menu-book" size={80} color={theme.ICON_COLOR} />
        </AnimatedView>
        <AnimatedView entering={FadeInDown.delay(500).springify()}>
          <Text style={[styles.emptyText, { color: theme.TEXT }]}>
            No financial books yet
          </Text>
          <Text style={[styles.emptySubText, { color: theme.TEXT }]}>
            Start organizing your finances by creating your first book
          </Text>
        </AnimatedView>
      </AnimatedView>
    );
  };
  return (
    <View style={styles.root}>
      {/* Animated Header */}
      <AnimatedView style={[styles.headerContainer, headerAnimatedStyle]}>
        <View style={styles.headerContent}>
          <View style={styles.headerTitleContainer}>
            <MaterialIcons
              name="auto-stories"
              size={28}
              color={theme.SECONDARY}
            />
            <Text style={styles.headerText}>Financial Books</Text>
          </View>
          <View style={styles.headerRightContainer}>
            {financialBook && financialBook.length > 0 && (
              <View style={styles.bookCountBadge}>
                <Text style={styles.bookCountText}>{financialBook.length}</Text>
              </View>
            )}
            <View ref={fabRef} collapsable={false}>
            <AnimatedTouchableOpacity
              style={[styles.addButton, fabAnimatedStyle]}
              onPress={openAddBookModal}
              activeOpacity={0.7}
            >
              <IoniconsIcon name="add" size={28} color={theme.NAVBAR_ACTIVE_TEXT} />
            </AnimatedTouchableOpacity>
            </View>
          </View>
        </View>
      </AnimatedView>

      {/* Content Area */}
      <View style={styles.content}>
        <AnimatedView
          entering={FadeInDown.delay(80).springify()}
          style={styles.helperRow}
        >
          <MaterialIcons
            name="lightbulb-outline"
            size={22}
            color={theme.SECONDARY}
          />
          <Text style={styles.helperText}>
            Open a book to add income, expenses, and keep balances in sync.
          </Text>
        </AnimatedView>
        <AnimatedFlatList
          data={flatListData}
          renderItem={renderBookList}
          keyExtractor={(item: any, index: number) =>
            item == null ? `book-grid-spacer-${index}` : String(item.id)
          }
          numColumns={bookColumnCount}
          key={bookColumnCount === 2 ? 'grid' : 'list'}
          columnWrapperStyle={
            bookColumnCount === 2 ? styles.bookGridRow : undefined
          }
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          bounces={true}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={EmptyListComponent}
          refreshControl={
            <RefreshControl
              refreshing={fetchLoading}
              onRefresh={refetch}
              colors={[theme.SECONDARY || '#C6A56B']}
              tintColor={theme.SECONDARY || '#C6A56B'}
            />
          }
          ListFooterComponent={<View style={styles.listFooter} />}
        />
        <BannerAdView placement="books" />
      </View>

      <BookFormSheet
        isVisible={isBottomSheetVisible}
        onClose={handleCloseSheet}
        isAddMode={isAddMode}
        selectedBook={selectedBook}
      />
    </View>
  );
};

export default BookScreen;
