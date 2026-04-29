import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '../../../../utils/Icons';
import { useTheme } from '../../../../utils/colors';
import { formatTimeAgo, ICONS } from '../../../../utils/helper';
import { scale, fontSize, spacing } from '../../../../utils/responsive';

const AnimatedView = Animated.createAnimatedComponent(View);

type Tx = {
  _id?: string;
  id?: string;
  title?: string;
  date?: string;
  type?: 'income' | 'expense';
  price?: string | number;
  categoryId?: { icon?: string; title?: string };
  friendId?: { name?: string };
};

function compactLedgerDate(raw: string) {
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: '2-digit',
  });
}

function formatLedgerAmount(
  price: string | number | undefined,
  type: 'income' | 'expense',
) {
  const raw =
    typeof price === 'string' ? price.replace(/,/g, '') : String(price ?? 0);
  const n = Math.abs(Number(raw)) || 0;
  const formatted = n.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const sign = type === 'income' ? '+' : '−';
  return { sign, formatted };
}

function LedgerRow({
  item,
  index,
  rim,
  hairline,
  monoFill,
  isLast,
}: {
  item: Tx;
  index: number;
  rim: string;
  hairline: string;
  monoFill: string;
  isLast: boolean;
}) {
  const { theme } = useTheme();
  const type = item.type === 'income' ? 'income' : 'expense';
  const { sign, formatted } = formatLedgerAmount(item.price, type);
  const emoji =
    ICONS.find(i => i.value === item.categoryId?.icon)?.name ?? '💳';
  const categoryTitle = item.categoryId?.title?.trim();
  const title = (item.title || 'Transaction').trim();
  const dateStr = item.date || '';
  const accent =
    type === 'income'
      ? (['#6BC77E', theme.INCOME_PIE] as const)
      : (['#FF9A9A', theme.EXPENSE_PIE] as const);

  return (
    <AnimatedView
      entering={FadeInDown.delay(40 + index * 45).springify()}
      style={[
        styles.row,
        !isLast && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: hairline,
        },
      ]}
    >
      <LinearGradient
        colors={[theme.SECONDARY, accent[1], theme.SECONDARY]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.rail}
      />

      <LinearGradient
        colors={[accent[0], accent[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconRing}
      >
        <View style={[styles.iconInner, { backgroundColor: monoFill }]}>
          <Text style={styles.iconEmoji}>{emoji}</Text>
        </View>
      </LinearGradient>

      <View style={styles.mid}>
        <Text
          style={[styles.rowTitle, { color: theme.TEXT }]}
          numberOfLines={1}
        >
          {title}
        </Text>
        <View style={styles.metaRow}>
          <Text style={[styles.dateText, { color: theme.LIGHT_TEXT }]}>
            {compactLedgerDate(dateStr)}
          </Text>
          <Text style={[styles.dot, { color: theme.LIGHT_TEXT }]}>·</Text>
          <Text style={[styles.agoText, { color: theme.LIGHT_TEXT }]}>
            {formatTimeAgo(dateStr)}
          </Text>
        </View>
        {categoryTitle ? (
          <View style={[styles.catPill, { borderColor: rim }]}>
            <Text style={[styles.catPillText, { color: theme.SECONDARY }]}>
              {categoryTitle}
            </Text>
          </View>
        ) : null}
        {item.friendId?.name ? (
          <Text
            style={[styles.sharedHint, { color: theme.LIGHT_TEXT }]}
            numberOfLines={1}
          >
            Shared · {item.friendId.name}
          </Text>
        ) : null}
      </View>

      <View style={styles.rightCol}>
        <Text
          style={[
            styles.flowTag,
            {
              color: type === 'income' ? theme.INCOME_PIE : theme.EXPENSE_PIE,
            },
          ]}
        >
          {type === 'income' ? 'Inflow' : 'Outflow'}
        </Text>
        <Text
          style={[
            styles.amount,
            {
              color: type === 'income' ? theme.INCOME_PIE : theme.EXPENSE_PIE,
            },
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.78}
        >
          {sign}₹{formatted}
        </Text>
      </View>
    </AnimatedView>
  );
}

type Props = {
  transactions?: Tx[] | null;
};

const RecentActivity: React.FC<Props> = ({ transactions }) => {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation();

  const rim = isDark
    ? 'rgba(198, 165, 107, 0.22)'
    : 'rgba(198, 165, 107, 0.35)';
  const hairline = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const monoFill = isDark ? '#1C1C20' : '#FFFFFF';
  const innerBg = isDark ? 'rgba(255,255,255,0.035)' : 'rgba(255,255,255,0.5)';

  const slice = useMemo(
    () => (Array.isArray(transactions) ? transactions.slice(0, 5) : []),
    [transactions],
  );
  const hasRows = slice.length > 0;

  const onViewAll = () => {
    (navigation as any).navigate('InnerScreen', { screen: 'Transactions' });
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={
          isDark
            ? ['rgba(198, 165, 107, 0.45)', 'rgba(198, 165, 107, 0.08)']
            : ['rgba(198, 165, 107, 0.55)', 'rgba(198, 165, 107, 0.12)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.topAccent}
      />

      <View style={[styles.rim, { borderColor: rim }]}>
        <LinearGradient
          colors={
            isDark
              ? ['#1E1E22', '#25252C', '#1A1A1E']
              : ['#FFFFFF', '#FAFAFB', '#F3F4F6']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.innerShell}
        >
          <View style={[styles.innerPad, { backgroundColor: innerBg }]}>
            <View style={styles.headerRow}>
              <View style={styles.headerLeft}>
                <View
                  style={[
                    styles.headerIconWrap,
                    {
                      backgroundColor: theme.SECONDARY + (isDark ? '22' : '18'),
                    },
                  ]}
                >
                  <MaterialIcons
                    name="receipt-long"
                    size={18}
                    color={theme.SECONDARY}
                  />
                </View>
                <View style={styles.headerTitles}>
                  <Text style={[styles.overline, { color: theme.SECONDARY }]}>
                    Ledger
                  </Text>
                  <Text style={[styles.title, { color: theme.TEXT }]}>
                    Recent activity
                  </Text>
                  <Text style={[styles.subtitle, { color: theme.LIGHT_TEXT }]}>
                    Your latest movements, polished.
                  </Text>
                </View>
              </View>
              {/* {hasRows ? (
                <TouchableOpacity
                  onPress={onViewAll}
                  style={[styles.viewAllBtn, { borderColor: rim }]}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.viewAllText, { color: theme.SECONDARY }]}>
                    View all
                  </Text>
                  <MaterialIcons
                    name="chevron-right"
                    size={18}
                    color={theme.SECONDARY}
                  />
                </TouchableOpacity>
              ) : null} */}
            </View>

            {hasRows ? (
              <View style={[styles.listShell, { borderColor: hairline }]}>
                {slice.map((item, index) => (
                  <LedgerRow
                    key={String(item._id || item.id || index)}
                    item={item}
                    index={index}
                    rim={rim}
                    hairline={hairline}
                    monoFill={monoFill}
                    isLast={index === slice.length - 1}
                  />
                ))}
              </View>
            ) : (
              <AnimatedView
                entering={FadeInDown.delay(80).springify()}
                style={[styles.emptyVault, { borderColor: rim }]}
              >
                <LinearGradient
                  colors={
                    isDark
                      ? [
                          'rgba(198, 165, 107, 0.12)',
                          'rgba(198, 165, 107, 0.03)',
                        ]
                      : [
                          'rgba(198, 165, 107, 0.18)',
                          'rgba(198, 165, 107, 0.05)',
                        ]
                  }
                  style={styles.emptyIconGrad}
                >
                  <MaterialIcons
                    name="post-add"
                    size={32}
                    color={theme.SECONDARY}
                  />
                </LinearGradient>
                <Text style={[styles.emptyTitle, { color: theme.TEXT }]}>
                  Your ledger is ready
                </Text>
                <Text style={[styles.emptyBody, { color: theme.LIGHT_TEXT }]}>
                  Record a transaction — it will appear here with a clean,
                  statement-style layout.
                </Text>
                <TouchableOpacity
                  onPress={onViewAll}
                  style={[
                    styles.emptyCta,
                    { borderColor: theme.SECONDARY + '55' },
                  ]}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[styles.emptyCtaText, { color: theme.SECONDARY }]}
                  >
                    Open transactions
                  </Text>
                </TouchableOpacity>
              </AnimatedView>
            )}
          </View>
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
  },
  topAccent: {
    height: scale(3),
    borderRadius: scale(2),
    marginBottom: spacing(14),
    opacity: 0.95,
  },
  rim: {
    borderRadius: scale(22),
    borderWidth: 1,
    padding: scale(1.5),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.14,
        shadowRadius: 22,
      },
      android: { elevation: 6 },
    }),
  },
  innerShell: {
    borderRadius: scale(20),
    overflow: 'hidden',
  },
  innerPad: {
    padding: spacing(18),
    paddingBottom: spacing(16),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing(16),
    gap: spacing(10),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    minWidth: 0,
    gap: spacing(12),
  },
  headerIconWrap: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(14),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitles: {
    flex: 1,
    minWidth: 0,
  },
  overline: {
    fontSize: fontSize(10),
    fontWeight: '800',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    marginBottom: 4,
    opacity: 0.95,
  },
  title: {
    fontSize: fontSize(18),
    fontWeight: '800',
    letterSpacing: -0.35,
  },
  subtitle: {
    fontSize: fontSize(11),
    fontWeight: '600',
    letterSpacing: 0.2,
    marginTop: 4,
    opacity: 0.88,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: spacing(10),
    borderRadius: scale(12),
    borderWidth: 1,
    gap: 2,
  },
  viewAllText: {
    fontSize: fontSize(12),
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  listShell: {
    borderRadius: scale(16),
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing(14),
    paddingHorizontal: spacing(12),
    gap: spacing(12),
  },
  rail: {
    width: scale(3),
    alignSelf: 'stretch',
    borderRadius: scale(2),
    minHeight: scale(52),
    opacity: 0.95,
  },
  iconRing: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    padding: scale(2.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconInner: {
    width: '100%',
    height: '100%',
    borderRadius: scale(21),
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconEmoji: {
    fontSize: fontSize(22),
  },
  mid: {
    flex: 1,
    minWidth: 0,
  },
  rowTitle: {
    fontSize: fontSize(15),
    fontWeight: '800',
    letterSpacing: -0.1,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 6,
  },
  dateText: {
    fontSize: fontSize(11),
    fontWeight: '600',
    letterSpacing: 0.15,
  },
  dot: {
    fontSize: fontSize(11),
    fontWeight: '700',
    opacity: 0.5,
  },
  agoText: {
    fontSize: fontSize(11),
    fontWeight: '600',
    letterSpacing: 0.1,
    opacity: 0.85,
  },
  catPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing(10),
    paddingVertical: 4,
    borderRadius: scale(8),
    borderWidth: 1,
    marginTop: 2,
  },
  catPillText: {
    fontSize: fontSize(10),
    fontWeight: '800',
    letterSpacing: 0.35,
    textTransform: 'uppercase',
  },
  sharedHint: {
    fontSize: fontSize(10),
    fontWeight: '600',
    marginTop: 6,
    letterSpacing: 0.15,
    opacity: 0.9,
  },
  rightCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: scale(100),
    maxWidth: '36%',
  },
  flowTag: {
    fontSize: fontSize(9),
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    marginBottom: 4,
    opacity: 0.95,
  },
  amount: {
    fontSize: fontSize(16),
    fontWeight: '800',
    letterSpacing: -0.35,
  },
  emptyVault: {
    borderWidth: 1,
    borderRadius: scale(18),
    padding: spacing(22),
    alignItems: 'center',
  },
  emptyIconGrad: {
    width: scale(72),
    height: scale(72),
    borderRadius: scale(22),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing(16),
  },
  emptyTitle: {
    fontSize: fontSize(17),
    fontWeight: '800',
    letterSpacing: -0.2,
    marginBottom: spacing(8),
    textAlign: 'center',
  },
  emptyBody: {
    fontSize: fontSize(13),
    lineHeight: Math.round(fontSize(13) * 1.45),
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: spacing(18),
    paddingHorizontal: spacing(8),
  },
  emptyCta: {
    paddingVertical: spacing(12),
    paddingHorizontal: spacing(22),
    borderRadius: scale(14),
    borderWidth: 1.5,
  },
  emptyCtaText: {
    fontSize: fontSize(13),
    fontWeight: '800',
    letterSpacing: 0.4,
  },
});

export default RecentActivity;
