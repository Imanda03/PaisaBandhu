import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Pressable,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../../utils/colors';
import { useModal } from '../../../../context/ModalContext';
import { MaterialIcons, IoniconsIcon } from '../../../../utils/Icons';
import { ICONS } from '../../../../utils/helper';
import { useFetchCategories, useDeleteCategory } from '../../../../ReactQueryHook/category.hook';
import PressableScale from '../../../../components/PressableScale';
import { fontSize, scale, spacing } from '../../../../utils/responsive';

const AnimatedView = Animated.createAnimatedComponent(View);

type SegmentKey = 'all' | 'income' | 'expense';

type CategoryItem = {
  id?: string;
  _id?: string;
  title: string;
  icon?: string;
  type: 'income' | 'expense';
};

const goldCTA = ['#F2E6D2', '#E8CF9E', '#C6A56B', '#A8894F'] as const;

function getIconEmoji(iconValue: string) {
  const match = ICONS.find(i => i.value === iconValue || i.name === iconValue);
  return match?.name ?? iconValue;
}

const Categories = () => {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation: any = useNavigation();
  const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);
  const { showConfirm } = useModal();
  const { mutate: deleteCategory } = useDeleteCategory();

  const { data: categoriesData, isLoading, refetch } = useFetchCategories();
  const categories: CategoryItem[] = categoriesData ?? [];

  const [segment, setSegment] = useState<SegmentKey>('all');

  const filtered = useMemo(() => {
    if (segment === 'all') return categories;
    return categories.filter(c => c.type === segment);
  }, [categories, segment]);

  const counts = useMemo(() => {
    const income = categories.filter(c => c.type === 'income').length;
    const expense = categories.filter(c => c.type === 'expense').length;
    return { all: categories.length, income, expense };
  }, [categories]);

  const openAddCategory = useCallback(() => {
    navigation.push('AddCategories');
  }, [navigation]);

  const handleDeleteCategory = useCallback(
    (category: CategoryItem) => {
      const id = category._id || category.id;
      if (!id) return;
      showConfirm(
        'Delete Category',
        `Are you sure you want to delete "${category.title}"? Transactions using this category may be affected.`,
        () => deleteCategory(id),
      );
    },
    [deleteCategory, showConfirm],
  );

  const segments: { key: SegmentKey; label: string; icon: string }[] = [
    { key: 'all', label: 'All', icon: 'category' },
    { key: 'income', label: 'Income', icon: 'north-east' },
    { key: 'expense', label: 'Expense', icon: 'south-west' },
  ];

  const segmentInactiveColor = isDark ? '#B8B8C0' : '#4B5563';
  const segmentInactiveIcon = isDark ? '#9A9AA0' : '#6B7280';

  const renderEmpty = () => (
    <View style={styles.emptyWrap}>
      <View style={[styles.emptyCard, { backgroundColor: theme.BACKGROUND_LIGHT, borderColor: theme.BORDER_COLOR }]}>
        <View style={[styles.emptyIcon, { backgroundColor: theme.SECONDARY + '22' }]}>
          <MaterialIcons name="category" size={36} color={theme.SECONDARY} />
        </View>
        <Text style={[styles.emptyTitle, { color: theme.TEXT }]}>
          {isLoading ? 'Loading categories…' : 'No categories yet'}
        </Text>
        <Text style={[styles.emptyBody, { color: segmentInactiveColor }]}>
          {isLoading ? 'Please wait a moment' : 'Tap + above to add your first category'}
        </Text>
      </View>
    </View>
  );

  const renderItem = useCallback(
    ({ item, index }: { item: CategoryItem; index: number }) => {
      const isIncome = item.type === 'income';
      const accentColor = isIncome ? theme.SUCCESS : theme.ERROR;
      const tintBg = isIncome ? theme.SUCCESS_LIGHT : theme.ERROR_LIGHT;
      const icon = getIconEmoji(item.icon || '');

      return (
        <AnimatedView entering={FadeInDown.delay(Math.min(index * 35, 280)).springify()}>
          <Pressable
            onLongPress={() => handleDeleteCategory(item)}
            delayLongPress={400}
            style={({ pressed }) => [
              styles.rowCard,
              {
                backgroundColor: theme.BACKGROUND_LIGHT,
                borderColor: pressed ? theme.SECONDARY + '88' : theme.BORDER_COLOR,
              },
            ]}
          >
            <View style={[styles.rowIconWrap, { backgroundColor: tintBg }]}>
              <Text style={styles.rowIcon}>{icon}</Text>
            </View>

            <View style={styles.rowBody}>
              <Text style={[styles.rowTitle, { color: theme.TEXT }]} numberOfLines={1}>
                {item.title}
              </Text>
              <View style={styles.rowMeta}>
                <View style={[styles.rowDot, { backgroundColor: accentColor }]} />
                <Text style={[styles.rowType, { color: segmentInactiveColor }]}>
                  {isIncome ? 'Income' : 'Expense'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => handleDeleteCategory(item)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={[styles.deleteBtn, { borderColor: theme.BORDER_COLOR }]}
            >
              <MaterialIcons name="delete-outline" size={20} color={theme.ERROR} />
            </TouchableOpacity>
          </Pressable>
        </AnimatedView>
      );
    },
    [handleDeleteCategory, segmentInactiveColor, styles, theme],
  );

  const listHeader = (
    <View style={styles.filterBlock}>
      <Text style={[styles.filterLabel, { color: isDark ? theme.LIGHT_TEXT : '#374151' }]}>
        Filter
      </Text>
      <View
        style={[
          styles.segmentTrack,
          {
            backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#E8EAED',
            borderColor: theme.BORDER_COLOR,
          },
        ]}
      >
        {segments.map(s => {
          const active = segment === s.key;
          const count = counts[s.key];
          return (
            <PressableScale
              key={s.key}
              onPress={() => setSegment(s.key)}
              style={[
                styles.segmentBtn,
                active && styles.segmentBtnActive,
                active && { backgroundColor: theme.BACKGROUND_LIGHT },
              ]}
            >
              {active ? (
                <LinearGradient
                  colors={[...goldCTA]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[StyleSheet.absoluteFill, { borderRadius: scale(11) }]}
                />
              ) : null}
              <MaterialIcons
                name={s.icon as any}
                size={14}
                color={active ? theme.NAVBAR_ACTIVE_TEXT : segmentInactiveIcon}
              />
              <Text
                style={[
                  styles.segmentText,
                  {
                    color: active ? theme.NAVBAR_ACTIVE_TEXT : segmentInactiveColor,
                    fontWeight: active ? '800' : '700',
                  },
                ]}
              >
                {s.label}
              </Text>
              <View
                style={[
                  styles.segmentCount,
                  {
                    backgroundColor: active
                      ? 'rgba(26,26,30,0.2)'
                      : isDark
                        ? 'rgba(255,255,255,0.08)'
                        : 'rgba(0,0,0,0.08)',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.segmentCountText,
                    { color: active ? theme.NAVBAR_ACTIVE_TEXT : segmentInactiveColor },
                  ]}
                >
                  {count}
                </Text>
              </View>
            </PressableScale>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: theme.HEADER_GRADIENT[0] }]}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={[...theme.HEADER_GRADIENT]}
        style={[styles.headerGrad, { paddingTop: insets.top + spacing(12) }]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <View style={styles.headerRow}>
          <PressableScale onPress={() => navigation.goBack()} style={styles.backBtn}>
            <IoniconsIcon name="arrow-back" size={24} color={theme.SECONDARY} />
          </PressableScale>

          <View style={styles.headerCenter}>
            <LinearGradient colors={[...goldCTA]} style={styles.headerIconRing}>
              <MaterialIcons name="category" size={22} color={theme.NAVBAR_ACTIVE_TEXT} />
            </LinearGradient>
            <View style={styles.headerCopy}>
              <Text style={styles.headerOverline}>Organize spending</Text>
              <Text style={styles.headerTitle}>Categories</Text>
            </View>
          </View>

          <PressableScale onPress={openAddCategory} style={styles.addBtnWrap}>
            <LinearGradient colors={[...goldCTA]} style={styles.addBtn}>
              <IoniconsIcon name="add" size={28} color={theme.NAVBAR_ACTIVE_TEXT} />
            </LinearGradient>
          </PressableScale>
        </View>
      </LinearGradient>

      <View style={[styles.sheet, { backgroundColor: theme.BACKGROUND }]}>
        <FlatList
          data={filtered}
          keyExtractor={(item, index) => item._id || item.id || `category-${index}`}
          renderItem={renderItem}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            filtered.length === 0 && styles.listContentEmpty,
          ]}
          ItemSeparatorComponent={() => <View style={styles.rowGap} />}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              colors={[theme.SECONDARY]}
              tintColor={theme.SECONDARY}
            />
          }
        />
      </View>
    </View>
  );
};

function createStyles(theme: ReturnType<typeof useTheme>['theme'], isDark: boolean) {
  return StyleSheet.create({
    root: { flex: 1 },
    headerGrad: {
      paddingHorizontal: spacing(20),
      paddingBottom: spacing(16),
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing(10),
    },
    backBtn: {
      width: scale(44),
      height: scale(44),
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerCenter: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing(12),
      minWidth: 0,
    },
    headerIconRing: {
      width: scale(48),
      height: scale(48),
      borderRadius: scale(16),
      alignItems: 'center',
      justifyContent: 'center',
      ...Platform.select({
        ios: {
          shadowColor: '#C6A56B',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 10,
        },
        android: { elevation: 6 },
      }),
    },
    headerCopy: { flex: 1, minWidth: 0 },
    headerOverline: {
      color: theme.SECONDARY,
      fontSize: fontSize(10),
      fontWeight: '800',
      letterSpacing: 1.8,
      textTransform: 'uppercase',
    },
    headerTitle: {
      color: theme.SECONDARY,
      fontSize: fontSize(22),
      fontWeight: '800',
      letterSpacing: -0.2,
      marginTop: spacing(2),
    },
    addBtnWrap: { borderRadius: scale(26), overflow: 'hidden' },
    addBtn: {
      width: scale(52),
      height: scale(52),
      borderRadius: scale(26),
      alignItems: 'center',
      justifyContent: 'center',
      ...Platform.select({
        ios: {
          shadowColor: '#C6A56B',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 12,
        },
        android: { elevation: 8 },
      }),
    },
    sheet: {
      flex: 1,
      borderTopLeftRadius: scale(28),
      borderTopRightRadius: scale(28),
      marginTop: -spacing(8),
      overflow: 'hidden',
    },
    listContent: {
      paddingHorizontal: spacing(20),
      paddingBottom: spacing(28),
    },
    listContentEmpty: { flexGrow: 1 },
    filterBlock: {
      paddingTop: spacing(18),
      paddingBottom: spacing(14),
    },
    filterLabel: {
      fontSize: fontSize(11),
      fontWeight: '800',
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      marginBottom: spacing(10),
    },
    segmentTrack: {
      flexDirection: 'row',
      borderRadius: scale(14),
      borderWidth: 1,
      padding: spacing(4),
      gap: spacing(4),
    },
    segmentBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing(5),
      paddingVertical: spacing(10),
      paddingHorizontal: spacing(6),
      borderRadius: scale(11),
      overflow: 'hidden',
    },
    segmentBtnActive: {
      ...Platform.select({
        ios: {
          shadowColor: '#C6A56B',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 6,
        },
        android: { elevation: 3 },
      }),
    },
    segmentText: { fontSize: fontSize(12) },
    segmentCount: {
      minWidth: scale(20),
      height: scale(20),
      borderRadius: scale(10),
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing(5),
    },
    segmentCountText: { fontSize: fontSize(10), fontWeight: '800' },
    rowGap: { height: spacing(10) },
    rowCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing(14),
      borderRadius: scale(16),
      borderWidth: 1,
      gap: spacing(12),
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.12 : 0.06,
          shadowRadius: 8,
        },
        android: { elevation: isDark ? 2 : 1 },
      }),
    },
    rowIconWrap: {
      width: scale(48),
      height: scale(48),
      borderRadius: scale(14),
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowIcon: { fontSize: fontSize(24) },
    rowBody: { flex: 1, minWidth: 0 },
    rowTitle: {
      fontSize: fontSize(16),
      fontWeight: '700',
      letterSpacing: -0.2,
      marginBottom: spacing(4),
    },
    rowMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing(6) },
    rowDot: { width: scale(6), height: scale(6), borderRadius: scale(3) },
    rowType: {
      fontSize: fontSize(12),
      fontWeight: '600',
    },
    deleteBtn: {
      width: scale(40),
      height: scale(40),
      borderRadius: scale(12),
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
    },
    emptyWrap: {
      flex: 1,
      justifyContent: 'center',
      paddingVertical: spacing(32),
    },
    emptyCard: {
      alignItems: 'center',
      padding: spacing(28),
      borderRadius: scale(20),
      borderWidth: 1,
    },
    emptyIcon: {
      width: scale(72),
      height: scale(72),
      borderRadius: scale(22),
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing(16),
    },
    emptyTitle: {
      fontSize: fontSize(18),
      fontWeight: '800',
      marginBottom: spacing(8),
      textAlign: 'center',
    },
    emptyBody: {
      fontSize: fontSize(14),
      lineHeight: Math.round(fontSize(14) * 1.45),
      textAlign: 'center',
    },
  });
}

export default Categories;
