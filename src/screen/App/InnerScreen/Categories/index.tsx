import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Pressable,
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import Animated, {
  FadeInDown,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useModal } from '../../../../context/ModalContext';
import { useTheme } from '../../../../utils/colors';
import { MaterialIcons, IoniconsIcon } from '../../../../utils/Icons';
import { ICONS } from '../../../../utils/helper';
import { useFetchCategories, useDeleteCategory } from '../../../../ReactQueryHook/category.hook';
import { createStyles } from './styles';

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

interface EmptyListComponentProps {
  isLoading: boolean;
  styles: ReturnType<typeof createStyles>;
  theme: ReturnType<typeof useTheme>['theme'];
}

const EmptyListComponent: React.FC<EmptyListComponentProps> = ({
  isLoading,
  styles,
  theme,
}) => (
  <AnimatedView
    entering={FadeIn.delay(300).springify()}
    style={styles.emptyState}
  >
    <AnimatedView
      entering={FadeInDown.delay(400).springify()}
      style={styles.emptyIconContainer}
    >
      <MaterialIcons name="category" size={80} color={theme.ICON_COLOR} />
    </AnimatedView>
    <AnimatedView entering={FadeInDown.delay(500).springify()}>
      <Text style={[styles.emptyText, { color: theme.TEXT }]}>
        {isLoading ? 'Loading categories...' : 'No categories yet'}
      </Text>
      <Text style={[styles.emptySubText, { color: theme.TEXT }]}>
        {isLoading
          ? 'Please wait while we fetch your data'
          : 'Start organizing your finances by creating your first category'}
      </Text>
    </AnimatedView>
  </AnimatedView>
);

interface ItemSeparatorProps {
  styles: ReturnType<typeof createStyles>;
}

const ItemSeparator: React.FC<ItemSeparatorProps> = ({ styles }) => (
  <View style={styles.separator} />
);

const Categories = () => {
  const { theme } = useTheme();
  const styles = createStyles();
  const navigation: any = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: categoriesData,
    isLoading,
    refetch,
  } = useFetchCategories();
  const { mutate: deleteCategory } = useDeleteCategory();
  const { showConfirm } = useModal();

  // Animation values
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-30);

  useEffect(() => {
    // Header animation
    headerOpacity.value = withTiming(1, { duration: 600 });
    headerTranslateY.value = withSpring(0, {
      damping: 15,
      stiffness: 100,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const getIconFromHelper = (iconValue: string) => {
    const match = ICONS.find(
      (i) => i.value === iconValue || i.name === iconValue,
    );
    return match?.name ?? iconValue;
  };

  const handleDeleteCategory = useCallback((category: any) => {
    const id = category._id || category.id;
    const title = category.title;
    showConfirm(
      'Delete Category',
      `Are you sure you want to delete "${title}"? Transactions using this category may be affected.`,
      () => deleteCategory(id),
    );
  }, [showConfirm, deleteCategory]);

  const renderCategory = ({ item, index }: any) => {
    const isIncome = item.type === 'income';
    const iconColor = isIncome ? theme.SUCCESS : theme.ERROR;
    const bgColor = isIncome ? theme.SUCCESS_LIGHT : theme.ERROR_LIGHT;
    const displayIcon = getIconFromHelper(item.icon || '');

    return (
      <Pressable
        onLongPress={() => handleDeleteCategory(item)}
        delayLongPress={400}
      >
        <AnimatedView
          entering={FadeInDown.delay(index * 50).springify()}
          style={[styles.categoryCard, { backgroundColor: theme.BACKGROUND_LIGHT }]}
        >
          <View style={styles.categoryLeft}>
            <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
              <Text style={[styles.iconText, { color: iconColor }]}>
                {displayIcon}
              </Text>
            </View>
            <View style={styles.categoryInfo}>
              <Text style={[styles.categoryName, { color: theme.TEXT }]}>
                {item.title}
              </Text>
              <Text style={[styles.categoryType, { color: theme.LIGHT_TEXT }]}>
                {item.type === 'income' ? 'Income' : 'Expense'}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <TouchableOpacity
              onPress={() => handleDeleteCategory(item)}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={{ padding: 4 }}
            >
              <MaterialIcons
                name="delete-outline"
                size={22}
                color={theme.ERROR}
              />
            </TouchableOpacity>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={theme.ICON_MUTED}
            />
          </View>
        </AnimatedView>
      </Pressable>
    );
  };

  // Group categories by type
  const incomeCategories =
    categoriesData?.filter((cat: any) => cat.type === 'income') || [];
  const expenseCategories =
    categoriesData?.filter((cat: any) => cat.type === 'expense') || [];

  const allCategories = [...incomeCategories, ...expenseCategories];

  const renderEmptyList = useCallback(
    () => <EmptyListComponent isLoading={isLoading} styles={styles} theme={theme} />,
    [isLoading, styles, theme],
  );

  const renderItemSeparator = useCallback(
    () => <ItemSeparator styles={styles} />,
    [styles],
  );

  const renderListFooter = useCallback(
    () => <View style={(styles as any).listFooter} />,
    [styles],
  );

  return (
    <View style={styles.root}>
      {/* Animated Header */}
      <AnimatedView style={[(styles as any).headerContainer, headerAnimatedStyle]}>
        <View style={(styles as any).headerContent}>
          <View style={(styles as any).headerTitleContainer}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={(styles as any).backButton}
            >
              <IoniconsIcon
                name="arrow-back"
                size={24}
                color={theme.SECONDARY}
              />
            </TouchableOpacity>
            <MaterialIcons
              name="category"
              size={28}
              color={theme.SECONDARY}
            />
            <Text style={(styles as any).headerText}>Categories</Text>
          </View>
          <View style={(styles as any).headerRightContainer}>
            {allCategories && allCategories.length > 0 && (
              <View style={(styles as any).categoryCountBadge}>
                <Text style={(styles as any).categoryCountText}>{allCategories.length}</Text>
              </View>
            )}
            <AnimatedTouchable
              style={(styles as any).addButton}
              onPress={() => {
                navigation.navigate('AddCategories');
              }}
              activeOpacity={0.7}
            >
              <IoniconsIcon name="add" size={28} color={theme.NAVBAR_ACTIVE_TEXT} />
            </AnimatedTouchable>
          </View>
        </View>
      </AnimatedView>

      {/* Content Area */}
      <View style={(styles as any).content}>
        <AnimatedFlatList
          data={allCategories}
          renderItem={renderCategory}
          keyExtractor={(item: any, index) =>
            item?.id || item?._id || `category-${index}`
          }
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          bounces={true}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.SECONDARY || '#C6A56B']}
              tintColor={theme.SECONDARY || '#C6A56B'}
            />
          }
          ItemSeparatorComponent={renderItemSeparator}
          ListFooterComponent={renderListFooter}
        />
      </View>
    </View>
  );
};

export default Categories;

