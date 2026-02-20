import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Dimensions,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const emptyBook: BookInterfaceProps = { id: '', title: '', type: 'single' };

const BookScreen = () => {
  const styles = createStyles();
  const { theme, isDark } = useTheme();
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
    navigation.navigate('InnerScreen', {
      screen: 'Transactions',
      params: { bookId: book.id, type: book.type, title: book.title, isShared: book.isShared },
    });
  }, [navigation]);

  const openAddBookModal = useCallback(() => {
    setIsAddMode(true);
    setBottomSheetVisible(true);
  }, []);

  const openEditBookModal = useCallback((bookItem: BookInterfaceProps) => {
    setIsAddMode(false);
    setBottomSheetVisible(true);
    setSelectedBook(bookItem);
  }, []);

  const renderBookList = useCallback(({ item, index }: any) => (
    <AnimatedView
      entering={FadeInDown.delay(index * 100)
        .springify()
        .damping(15)}
    >
      <BookListItem
        item={item}
        onEditPress={() => openEditBookModal(item)}
        onPress={() => handleBookPress(item)}
      />
    </AnimatedView>
  ), [handleBookPress, openEditBookModal]);

  const handleCloseSheet = useCallback(() => {
    setBottomSheetVisible(false);
    setSelectedBook({ id: '', title: '', type: 'single' });
  }, []);

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

  const EmptyListComponent = () => (
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
          {fetchLoading ? 'Loading books...' : 'No financial books yet'}
        </Text>
        <Text style={[styles.emptySubText, { color: theme.TEXT }]}>
          {fetchLoading
            ? 'Please wait while we fetch your data'
            : 'Start organizing your finances by creating your first book'}
        </Text>
      </AnimatedView>
    </AnimatedView>
  );
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
            <AnimatedTouchableOpacity
              style={[styles.addButton, fabAnimatedStyle]}
              onPress={openAddBookModal}
              activeOpacity={0.7}
            >
              <IoniconsIcon name="add" size={28} color={theme.NAVBAR_ACTIVE_TEXT} />
            </AnimatedTouchableOpacity>
          </View>
        </View>
      </AnimatedView>

      {/* Content Area */}
      <View style={styles.content}>
        <AnimatedFlatList
          data={financialBook}
          renderItem={renderBookList}
          keyExtractor={(item: any) => String(item.id)}
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
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListFooterComponent={<View style={styles.listFooter} />}
        />
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
