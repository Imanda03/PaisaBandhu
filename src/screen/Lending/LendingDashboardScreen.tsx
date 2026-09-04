import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLendings } from '../../ReactQueryHook/lending.hook';
import { fontSize, scale, spacing, verticalScale } from '../../utils/responsive';
import { MaterialIcons, IoniconsIcon } from '../../utils/Icons';
import { Lending } from '../../services/LendingService';
import LendingSummaryCards from './components/LendingSummaryCards';
import LendingCard from './components/LendingCard';
import AnimatedListItem from '../../components/AnimatedListItem';
import PressableScale from '../../components/PressableScale';
import { useLendingChrome } from './lendingTheme';
import BannerAdView from '../../components/ads/BannerAdView';
import {
  ShimmerBox,
  SkeletonLendingCardRow,
  SkeletonLendingSegmentTabs,
  SkeletonLendingSummaryBlock,
} from '../../components/skeleton';

type Segment = 'lent' | 'borrowed' | 'settled';

const AnimatedView = Animated.createAnimatedComponent(View);

const LendingDashboardScreen: React.FC = () => {
  const { theme, isDark, rim, rimMetallic, goldCTA } = useLendingChrome();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [segment, setSegment] = useState<Segment>('lent');
  const { data, isLoading, isError, refetch, isRefetching } = useLendings();

  const lendings = data ?? [];

  const filtered = useMemo(() => {
    if (segment === 'settled') {
      return lendings.filter(l => l.status === 'settled');
    }
    return lendings.filter(l => l.type === segment && l.status !== 'settled');
  }, [lendings, segment]);

  const segments: { key: Segment; label: string; icon: string }[] = [
    { key: 'lent', label: 'Lent', icon: 'north-east' },
    { key: 'borrowed', label: 'Borrowed', icon: 'south-west' },
    { key: 'settled', label: 'Settled', icon: 'verified' },
  ];

  const segmentSubtitle =
    segment === 'lent'
      ? 'Money others owe you'
      : segment === 'borrowed'
        ? 'Money you need to return'
        : 'Closed lending records';

  const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);

  return (
    <View style={[styles.root, { backgroundColor: theme.HEADER_GRADIENT[0] }]}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={[...theme.HEADER_GRADIENT]}
        style={[styles.headerGrad, { paddingTop: insets.top + spacing(12) }]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTitleContainer}>
            <LinearGradient
              colors={[...goldCTA]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerIconRing}
            >
              <MaterialIcons name="account-balance-wallet" size={24} color={theme.NAVBAR_ACTIVE_TEXT} />
            </LinearGradient>
            <View style={styles.headerTextBlock}>
              <Text style={styles.headerOverline}>Private ledger</Text>
              <Text style={styles.headerText}>Lending Vault</Text>
              <Text style={styles.headerSub}>Track money lent & borrowed</Text>
            </View>
          </View>

          <PressableScale
            onPress={() => navigation.navigate('AddLending' as never)}
            style={styles.addButtonWrap}
          >
            <LinearGradient
              colors={[...goldCTA]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.addButton}
            >
              <IoniconsIcon name="add" size={28} color={theme.NAVBAR_ACTIVE_TEXT} />
            </LinearGradient>
          </PressableScale>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {isLoading ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.list,
              { paddingBottom: insets.bottom + spacing(88) },
            ]}
          >
            <SkeletonLendingSummaryBlock theme={theme} />
            <SkeletonLendingSegmentTabs theme={theme} />
            <View style={styles.listHeader}>
              <View>
                <ShimmerBox
                  theme={theme}
                  height={scale(17)}
                  borderRadius={scale(8)}
                  style={{ width: '48%', marginBottom: spacing(6) }}
                />
                <ShimmerBox
                  theme={theme}
                  height={scale(12)}
                  borderRadius={scale(6)}
                  style={{ width: '62%' }}
                />
              </View>
              <ShimmerBox
                theme={theme}
                width={scale(36)}
                height={scale(36)}
                borderRadius={scale(12)}
              />
            </View>
            {[0, 1, 2, 3, 4].map(i => (
              <SkeletonLendingCardRow key={i} theme={theme} />
            ))}
          </ScrollView>
        ) : isError ? (
          <View style={styles.center}>
            <View style={[styles.errorIcon, { borderColor: rim }]}>
              <MaterialIcons name="error-outline" size={36} color={theme.ERROR} />
            </View>
            <Text style={[styles.err, { color: theme.ERROR }]}>
              Could not load your lending vault
            </Text>
            <PressableScale
              onPress={() => refetch()}
              style={[styles.retry, { borderColor: theme.SECONDARY }]}
            >
              <Text style={[styles.retryText, { color: theme.SECONDARY }]}>Try again</Text>
            </PressableScale>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item: Lending) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.list,
              { paddingBottom: insets.bottom + spacing(88) },
            ]}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                colors={[theme.SECONDARY]}
                tintColor={theme.SECONDARY}
              />
            }
            ListHeaderComponent={
              <>
                <LendingSummaryCards lendings={lendings} />

                <View style={[styles.segmentTrack, { borderColor: rim }]}>
                  {segments.map(s => {
                    const active = segment === s.key;
                    return (
                      <PressableScale
                        key={s.key}
                        onPress={() => setSegment(s.key)}
                        style={styles.segmentBtn}
                      >
                        {active ? (
                          <LinearGradient
                            colors={[...goldCTA]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={StyleSheet.absoluteFill}
                          />
                        ) : null}
                        <MaterialIcons
                          name={s.icon as 'north-east'}
                          size={15}
                          color={active ? theme.NAVBAR_ACTIVE_TEXT : theme.LIGHT_TEXT}
                        />
                        <Text
                          style={[
                            styles.segmentText,
                            {
                              color: active ? theme.NAVBAR_ACTIVE_TEXT : theme.LIGHT_TEXT,
                              fontWeight: active ? '800' : '600',
                            },
                          ]}
                        >
                          {s.label}
                        </Text>
                      </PressableScale>
                    );
                  })}
                </View>

                <View style={styles.listHeader}>
                  <View>
                    <Text style={[styles.listTitle, { color: theme.TEXT }]}>
                      {segments.find(s => s.key === segment)?.label} records
                    </Text>
                    <Text style={[styles.listSub, { color: theme.LIGHT_TEXT }]}>
                      {segmentSubtitle}
                    </Text>
                  </View>
                  <View style={[styles.countBadge, { borderColor: rim }]}>
                    <Text style={[styles.countText, { color: theme.SECONDARY }]}>
                      {filtered.length}
                    </Text>
                  </View>
                </View>
              </>
            }
            ListEmptyComponent={
              <AnimatedView
                entering={FadeInDown.delay(80).springify()}
                style={[styles.emptyVault, { borderColor: rim }]}
              >
                <LinearGradient colors={rimMetallic} style={styles.emptyRim}>
                  <LinearGradient
                    colors={
                      isDark
                        ? ['rgba(198,165,107,0.14)', 'rgba(30,30,36,0.95)']
                        : ['rgba(198,165,107,0.2)', 'rgba(255,255,255,0.98)']
                    }
                    style={styles.emptyInner}
                  >
                    <LinearGradient
                      colors={[...goldCTA]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.emptyIconGrad}
                    >
                      <MaterialIcons
                        name="savings"
                        size={30}
                        color={theme.NAVBAR_ACTIVE_TEXT}
                      />
                    </LinearGradient>
                    <Text style={[styles.emptyTitle, { color: theme.TEXT }]}>
                      Vault is empty here
                    </Text>
                    <Text style={[styles.emptyBody, { color: theme.LIGHT_TEXT }]}>
                      No {segment} records yet. Add your first entry to start tracking
                      repayments with clarity.
                    </Text>
                    <PressableScale
                      onPress={() => navigation.navigate('AddLending' as never)}
                      style={styles.emptyCtaWrap}
                    >
                      <LinearGradient
                        colors={[...goldCTA]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.emptyCta}
                      >
                        <MaterialIcons
                          name="add"
                          size={18}
                          color={theme.NAVBAR_ACTIVE_TEXT}
                        />
                        <Text style={[styles.emptyCtaText, { color: theme.NAVBAR_ACTIVE_TEXT }]}>
                          Add lending
                        </Text>
                      </LinearGradient>
                    </PressableScale>
                  </LinearGradient>
                </LinearGradient>
              </AnimatedView>
            }
            renderItem={({ item, index }) => (
              <AnimatedListItem index={index}>
                <LendingCard
                  item={item}
                  onPress={() =>
                    navigation.navigate('LendingDetail' as never, { id: item.id } as never)
                  }
                />
              </AnimatedListItem>
            )}
          />
        )}
        <BannerAdView placement="home" />
      </View>
    </View>
  );
};

function createStyles(
  theme: ReturnType<typeof useLendingChrome>['theme'],
  isDark: boolean,
) {
  return StyleSheet.create({
    root: { flex: 1 },
    headerGrad: {
      paddingHorizontal: spacing(20),
      paddingBottom: spacing(22),
      marginBottom: -spacing(2),
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing(14),
      flex: 1,
    },
    headerIconRing: {
      width: scale(52),
      height: scale(52),
      borderRadius: scale(18),
      alignItems: 'center',
      justifyContent: 'center',
      ...Platform.select({
        ios: {
          shadowColor: '#C6A56B',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.35,
          shadowRadius: 12,
        },
        android: { elevation: 6 },
      }),
    },
    headerTextBlock: { flex: 1 },
    headerOverline: {
      color: theme.SECONDARY,
      fontSize: fontSize(10),
      fontWeight: '800',
      letterSpacing: 2,
      textTransform: 'uppercase',
      marginBottom: spacing(2),
      opacity: 0.9,
    },
    headerText: {
      color: theme.SECONDARY,
      fontSize: fontSize(26),
      fontWeight: '800',
      letterSpacing: -0.3,
    },
    headerSub: {
      color: theme.LIGHT_TEXT,
      fontSize: fontSize(12),
      fontWeight: '600',
      marginTop: spacing(3),
      opacity: 0.92,
    },
    addButtonWrap: { borderRadius: scale(26), overflow: 'hidden' },
    addButton: {
      width: scale(52),
      height: scale(52),
      borderRadius: scale(26),
      alignItems: 'center',
      justifyContent: 'center',
      ...Platform.select({
        ios: {
          shadowColor: '#C6A56B',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.4,
          shadowRadius: 14,
        },
        android: { elevation: 8 },
      }),
    },
    content: {
      flex: 1,
      backgroundColor: theme.BACKGROUND,
      borderTopLeftRadius: scale(32),
      borderTopRightRadius: scale(32),
      overflow: 'hidden',
      marginTop: -spacing(10),
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -10 },
          shadowOpacity: isDark ? 0.35 : 0.1,
          shadowRadius: 22,
        },
        android: { elevation: 12 },
      }),
    },
    center: {
      alignItems: 'center',
      marginTop: spacing(56),
      gap: spacing(14),
      paddingHorizontal: spacing(28),
    },
    errorIcon: {
      width: scale(72),
      height: scale(72),
      borderRadius: scale(22),
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    err: { fontSize: fontSize(15), fontWeight: '700', textAlign: 'center' },
    retry: {
      paddingHorizontal: spacing(22),
      paddingVertical: spacing(12),
      borderRadius: scale(14),
      borderWidth: 1.5,
    },
    retryText: { fontSize: fontSize(14), fontWeight: '800' },
    list: { paddingHorizontal: spacing(20), paddingTop: spacing(22) },
    segmentTrack: {
      flexDirection: 'row',
      borderRadius: scale(16),
      borderWidth: StyleSheet.hairlineWidth,
      padding: spacing(4),
      marginBottom: spacing(18),
      gap: spacing(4),
      backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
    },
    segmentBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing(5),
      paddingVertical: spacing(11),
      borderRadius: scale(12),
      overflow: 'hidden',
    },
    segmentText: { fontSize: fontSize(11) },
    listHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing(14),
    },
    listTitle: { fontSize: fontSize(17), fontWeight: '800', letterSpacing: -0.2 },
    listSub: { fontSize: fontSize(12), fontWeight: '600', marginTop: spacing(2) },
    countBadge: {
      minWidth: scale(36),
      height: scale(36),
      borderRadius: scale(12),
      borderWidth: StyleSheet.hairlineWidth,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing(10),
    },
    countText: { fontSize: fontSize(14), fontWeight: '800' },
    emptyVault: {
      borderWidth: 1,
      borderRadius: scale(22),
      overflow: 'hidden',
      marginTop: spacing(4),
    },
    emptyRim: { padding: scale(1.5) },
    emptyInner: {
      borderRadius: scale(20),
      padding: spacing(28),
      alignItems: 'center',
    },
    emptyIconGrad: {
      width: scale(68),
      height: scale(68),
      borderRadius: scale(22),
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing(18),
    },
    emptyTitle: {
      fontSize: fontSize(18),
      fontWeight: '800',
      marginBottom: spacing(8),
      textAlign: 'center',
    },
    emptyBody: {
      fontSize: fontSize(13),
      lineHeight: Math.round(fontSize(13) * 1.5),
      textAlign: 'center',
      marginBottom: spacing(20),
    },
    emptyCtaWrap: { borderRadius: scale(14), overflow: 'hidden' },
    emptyCta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing(6),
      paddingVertical: spacing(13),
      paddingHorizontal: spacing(22),
    },
    emptyCtaText: { fontSize: fontSize(14), fontWeight: '800' },
  });
}

export default LendingDashboardScreen;
