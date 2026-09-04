import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../../../utils/colors';
import { formatCurrency } from '../../../../utils/currency';
import { scale, fontSize, spacing } from '../../../../utils/responsive';

export type CategorySpendItem = { category: string; spent: number };

const PALETTE: [string, string][] = [
  ['#C6A56B', '#8A7140'],
  ['#A89878', '#6B5E48'],
  ['#8B9A8A', '#5A6658'],
  ['#9B8AA0', '#6B5A70'],
  ['#8A9BB0', '#5A6578'],
  ['#B0A08A', '#786858'],
];

function tintFor(name: string): [string, string] {
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i) * (i + 1);
  }
  return PALETTE[sum % PALETTE.length];
}

function initialOf(name: string) {
  const t = name.trim();
  return t ? t.charAt(0).toUpperCase() : '•';
}

const AnimatedView = Animated.createAnimatedComponent(View);

type RowProps = {
  item: CategorySpendItem;
  index: number;
  totalSpend: number;
  maxSpend: number;
  hairline: string;
  monoFill: string;
  isLast: boolean;
};

function VaultRow({
  item,
  index,
  totalSpend,
  maxSpend,
  hairline,
  monoFill,
  isLast,
}: RowProps) {
  const { theme } = useTheme();
  const [g0, g1] = tintFor(item.category);
  const pctOfAll =
    totalSpend > 0 ? Math.round((item.spent / totalSpend) * 100) : 0;
  const barPct = maxSpend > 0 ? (item.spent / maxSpend) * 100 : 0;

  return (
    <AnimatedView
      entering={FadeInDown.delay(50 + index * 55).springify()}
      style={[
        styles.row,
        !isLast && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: hairline,
        },
      ]}
    >
      <LinearGradient
        colors={[g0, g1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.monoRing}
      >
        <View style={[styles.monoCore, { backgroundColor: monoFill }]}>
          <Text style={[styles.monoLetter, { color: theme.SECONDARY }]}>
            {initialOf(item.category)}
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.mid}>
        <View style={styles.topLine}>
          <Text style={[styles.name, { color: theme.TEXT }]} numberOfLines={1}>
            {item.category}
          </Text>
          <Text style={[styles.amt, { color: theme.TEXT }]} numberOfLines={1}>
            {formatCurrency(item.spent)}
          </Text>
        </View>
        <View style={[styles.track, { backgroundColor: hairline }]}>
          <LinearGradient
            colors={[g0, g1]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={[styles.trackFill, { width: `${barPct}%` }]}
          />
        </View>
        <Text style={[styles.meta, { color: theme.LIGHT_TEXT }]}>
          {pctOfAll}% of book expense
        </Text>
      </View>
    </AnimatedView>
  );
}

type Props = {
  data: CategorySpendItem[];
  /** Single vs group book — only changes titles */
  variant?: 'single' | 'group';
};

const BookCategoryComposition: React.FC<Props> = ({
  data,
  variant = 'single',
}) => {
  const { theme, isDark } = useTheme();

  const rim = isDark ? 'rgba(198, 165, 107, 0.22)' : 'rgba(198, 165, 107, 0.35)';
  const hairline = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const monoFill = isDark ? '#1C1C20' : '#FFFFFF';
  const innerBg = isDark ? 'rgba(255,255,255,0.035)' : 'rgba(255,255,255,0.5)';

  const sorted = useMemo(
    () => [...data].sort((a, b) => b.spent - a.spent),
    [data],
  );

  const totalSpend = useMemo(
    () => sorted.reduce((s, x) => s + x.spent, 0),
    [sorted],
  );

  const maxSpend = useMemo(
    () => Math.max(...sorted.map(x => x.spent), 1),
    [sorted],
  );

  const title =
    variant === 'group' ? 'Group spend map' : 'Category vault';
  const subtitle =
    variant === 'group'
      ? 'Shared expenses, ranked and weighted.'
      : 'Every amount, sorted like a private ledger.';

  if (!sorted.length) return null;

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
              <View
                style={[
                  styles.headerIcon,
                  { backgroundColor: theme.SECONDARY + (isDark ? '22' : '18') },
                ]}
              >
                <Text style={[styles.headerGlyph, { color: theme.SECONDARY }]}>
                  ◈
                </Text>
              </View>
              <View style={styles.headerText}>
                <Text style={[styles.overline, { color: theme.SECONDARY }]}>
                  Composition
                </Text>
                <Text style={[styles.title, { color: theme.TEXT }]}>{title}</Text>
                <Text style={[styles.subtitle, { color: theme.LIGHT_TEXT }]}>
                  {subtitle}
                </Text>
              </View>
            </View>

            <View style={[styles.listRim, { borderColor: hairline }]}>
              {sorted.map((item, index) => (
                <VaultRow
                  key={`${item.category}-${index}`}
                  item={item}
                  index={index}
                  totalSpend={totalSpend}
                  maxSpend={maxSpend}
                  hairline={hairline}
                  monoFill={monoFill}
                  isLast={index === sorted.length - 1}
                />
              ))}
            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { width: '100%' },
  topAccent: {
    height: scale(3),
    borderRadius: scale(2),
    marginBottom: spacing(12),
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
  innerShell: { borderRadius: scale(20), overflow: 'hidden' },
  innerPad: { padding: spacing(18) },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing(12),
    marginBottom: spacing(16),
  },
  headerIcon: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(14),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerGlyph: {
    fontSize: fontSize(20),
    fontWeight: '700',
  },
  headerText: { flex: 1, minWidth: 0 },
  overline: {
    fontSize: fontSize(10),
    fontWeight: '800',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontSize: fontSize(18),
    fontWeight: '800',
    letterSpacing: -0.35,
  },
  subtitle: {
    fontSize: fontSize(11),
    fontWeight: '600',
    letterSpacing: 0.15,
    marginTop: 4,
    lineHeight: Math.round(fontSize(11) * 1.35),
    opacity: 0.9,
  },
  listRim: {
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
  monoRing: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    padding: scale(2.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  monoCore: {
    width: '100%',
    height: '100%',
    borderRadius: scale(21),
    justifyContent: 'center',
    alignItems: 'center',
  },
  monoLetter: {
    fontSize: fontSize(17),
    fontWeight: '800',
  },
  mid: { flex: 1, minWidth: 0 },
  topLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: spacing(10),
    marginBottom: 8,
  },
  name: {
    flex: 1,
    fontSize: fontSize(14),
    fontWeight: '800',
    letterSpacing: -0.05,
  },
  amt: {
    fontSize: fontSize(14),
    fontWeight: '800',
    letterSpacing: -0.25,
  },
  track: {
    height: scale(5),
    borderRadius: scale(2.5),
    overflow: 'hidden',
    width: '100%',
  },
  trackFill: {
    height: '100%',
    borderRadius: scale(2.5),
  },
  meta: {
    fontSize: fontSize(10),
    fontWeight: '600',
    marginTop: 6,
    letterSpacing: 0.2,
  },
});

export default BookCategoryComposition;
