import React, { useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  LayoutChangeEvent,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { ThemeColors } from '../../../../../utils/colors';
import { scale, fontSize, spacing } from '../../../../../utils/responsive';
import SpendingEmptyState from './SpendingEmptyState';
import { formatCurrency, formatSignedCurrency } from '../../../../../utils/currency';

export type CategorySpend = { category: string; spent: number };

type Props = {
  theme: ThemeColors;
  isDark: boolean;
  income: number;
  expense: number;
  categories: CategorySpend[];
  formatAmount: (value: number) => string;
  insightPercent: number | null;
  insightTier: string;
  hasFlowData: boolean;
};

const MONOGRAM_GRADIENTS: [string, string][] = [
  ['#C6A56B', '#8A7140'],
  ['#A89878', '#6B5E48'],
  ['#8B9A8A', '#5A6658'],
  ['#9B8AA0', '#6B5A70'],
  ['#8A9BB0', '#5A6578'],
  ['#B0A08A', '#786858'],
];

function monogramGradientFor(name: string): [string, string] {
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i) * (i + 1);
  }
  return MONOGRAM_GRADIENTS[sum % MONOGRAM_GRADIENTS.length];
}

function initialFor(category: string) {
  const t = category.trim();
  return t ? t.charAt(0).toUpperCase() : '•';
}

const SpendingFlowBoard: React.FC<Props> = ({
  theme,
  isDark,
  income,
  expense,
  categories,
  formatAmount,
  insightPercent,
  insightTier,
  hasFlowData,
}) => {
  const flowTotal = Math.max(income + expense, 0);
  const incomeShare = flowTotal > 0 ? income / flowTotal : 0;

  const trackW = useSharedValue(0);
  const ratioAnim = useSharedValue(0);

  useEffect(() => {
    ratioAnim.value = withTiming(incomeShare, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
  }, [incomeShare, ratioAnim]);

  const onFlowTrackLayout = useCallback(
    (e: LayoutChangeEvent) => {
      trackW.value = e.nativeEvent.layout.width;
    },
    [trackW],
  );

  const incomeFillStyle = useAnimatedStyle(() => ({
    width: Math.max(0, trackW.value * ratioAnim.value),
  }));

  const topCategories = useMemo(() => {
    const safe = Array.isArray(categories)
      ? categories.filter(
          item =>
            item?.category != null &&
            item?.spent != null &&
            Number(item.spent) > 0,
        )
      : [];
    const sorted = [...safe].sort((a, b) => b.spent - a.spent);
    return sorted.slice(0, 8);
  }, [categories]);

  const expenseTotal = useMemo(
    () => topCategories.reduce((s, c) => s + c.spent, 0),
    [topCategories],
  );

  const maxCatSpend = Math.max(...topCategories.map(c => c.spent), 1);

  const net = income - expense;
  const netColor =
    net > 0 ? theme.INCOME_PIE : net < 0 ? theme.EXPENSE_PIE : theme.LIGHT_TEXT;

  const rim = isDark ? 'rgba(198, 165, 107, 0.22)' : 'rgba(198, 165, 107, 0.35)';
  const innerBg = isDark ? 'rgba(255,255,255,0.035)' : 'rgba(255,255,255,0.5)';
  const hairline = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const monoFill = isDark ? '#1C1C20' : '#FFFFFF';

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
            <Text style={[styles.overline, { color: theme.SECONDARY }]}>
              Money movement
            </Text>

            <View style={styles.dualRow}>
              <View style={styles.dualCol}>
                <Text style={[styles.dualLabel, { color: theme.LIGHT_TEXT }]}>
                  Inflow
                </Text>
                <Text
                  style={[styles.dualValue, { color: theme.INCOME_PIE }]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.72}
                >
                  {formatCurrency(income)}
                </Text>
              </View>

              <LinearGradient
                colors={[rim, theme.SECONDARY, rim]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.goldDivider}
              />

              <View style={styles.dualCol}>
                <Text style={[styles.dualLabel, { color: theme.LIGHT_TEXT }]}>
                  Outflow
                </Text>
                <Text
                  style={[styles.dualValue, { color: theme.EXPENSE_PIE }]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.72}
                >
                  {formatCurrency(expense)}
                </Text>
              </View>
            </View>

            {hasFlowData ? (
              <Text style={[styles.netLine, { color: netColor }]}>
                Net position{' '}
                <Text style={styles.netEmphasis}>
                  {formatSignedCurrency(net)}
                </Text>
              </Text>
            ) : (
              <Text style={[styles.netLine, { color: theme.LIGHT_TEXT }]}>
                Add transactions to see your flow
              </Text>
            )}

            <Text style={[styles.meterCaption, { color: theme.LIGHT_TEXT }]}>
              Flow balance
            </Text>
            <View
              style={[styles.flowTrack, { backgroundColor: hairline }]}
              onLayout={onFlowTrackLayout}
            >
              <Animated.View style={[styles.flowIncomeWrap, incomeFillStyle]}>
                <LinearGradient
                  colors={['#6BC77E', theme.INCOME_PIE]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.flowIncomeFill}
                />
              </Animated.View>
            </View>
            <View style={styles.flowLegend}>
              <Text style={[styles.flowLegendTxt, { color: theme.INCOME_PIE }]}>
                Inflow {flowTotal ? Math.round(incomeShare * 100) : 0}%
              </Text>
              <Text style={[styles.flowLegendTxt, { color: theme.EXPENSE_PIE }]}>
                Outflow {flowTotal ? Math.round((1 - incomeShare) * 100) : 0}%
              </Text>
            </View>

            <LinearGradient
              colors={
                isDark
                  ? ['rgba(198, 165, 107, 0.14)', 'rgba(198, 165, 107, 0.04)']
                  : ['rgba(198, 165, 107, 0.2)', 'rgba(198, 165, 107, 0.06)']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.insightCard, { borderColor: rim }]}
            >
              <View style={styles.insightLeft}>
                <Text style={[styles.insightPercent, { color: theme.TEXT }]}>
                  {insightPercent === null ? '—' : `${insightPercent}%`}
                </Text>
                <Text style={[styles.insightSub, { color: theme.LIGHT_TEXT }]}>
                  savings rate
                </Text>
              </View>
              <View
                style={[styles.insightVRule, { backgroundColor: rim }]}
              />
              <View style={styles.insightRight}>
                <Text style={[styles.insightTier, { color: theme.SECONDARY }]}>
                  {insightTier}
                </Text>
                <Text style={[styles.insightHint, { color: theme.LIGHT_TEXT }]}>
                  {hasFlowData ? 'vs. inflow' : 'needs activity'}
                </Text>
              </View>
            </LinearGradient>

            <View style={[styles.sectionRule, { backgroundColor: hairline }]} />

            <Text style={[styles.sectionTitle, { color: theme.TEXT }]}>
              Spending composition
            </Text>
            <Text style={[styles.sectionSub, { color: theme.LIGHT_TEXT }]}>
              By category · ranked by amount
            </Text>

            {topCategories.length === 0 ? (
              <SpendingEmptyState />
            ) : (
              <View style={styles.categoryList}>
                {topCategories.map((row, index) => {
                  const pctOfExpense =
                    expenseTotal > 0
                      ? Math.round((row.spent / expenseTotal) * 100)
                      : 0;
                  const trackPct = (row.spent / maxCatSpend) * 100;
                  const [g0, g1] = monogramGradientFor(row.category);

                  return (
                    <View
                      key={`${row.category}-${index}`}
                      style={[
                        styles.catRow,
                        index < topCategories.length - 1 && {
                          borderBottomWidth: StyleSheet.hairlineWidth,
                          borderBottomColor: hairline,
                        },
                      ]}
                    >
                      <LinearGradient
                        colors={[g0, g1]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.monoOuter}
                      >
                        <View style={[styles.monoInner, { backgroundColor: monoFill }]}>
                          <Text
                            style={[styles.monoLetter, { color: theme.SECONDARY }]}
                          >
                            {initialFor(row.category)}
                          </Text>
                        </View>
                      </LinearGradient>

                      <View style={styles.catBody}>
                        <View style={styles.catTop}>
                          <Text
                            style={[styles.catName, { color: theme.TEXT }]}
                            numberOfLines={1}
                          >
                            {row.category}
                          </Text>
                          <Text
                            style={[styles.catAmt, { color: theme.TEXT }]}
                            numberOfLines={1}
                          >
                            {formatCurrency(row.spent)}
                          </Text>
                        </View>
                        <View style={[styles.catTrack, { backgroundColor: hairline }]}>
                          <LinearGradient
                            colors={[g0, g1]}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={[styles.catFill, { width: `${trackPct}%` }]}
                          />
                        </View>
                        <Text
                          style={[styles.catMeta, { color: theme.LIGHT_TEXT }]}
                        >
                          {pctOfExpense}% of category spend
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
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
  overline: {
    fontSize: fontSize(10),
    fontWeight: '800',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    marginBottom: spacing(14),
    opacity: 0.95,
  },
  dualRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: spacing(10),
  },
  dualCol: {
    flex: 1,
    minWidth: 0,
  },
  dualLabel: {
    fontSize: fontSize(11),
    fontWeight: '600',
    letterSpacing: 0.4,
    marginBottom: 6,
    opacity: 0.88,
  },
  dualValue: {
    fontSize: fontSize(22),
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  goldDivider: {
    width: scale(2),
    marginHorizontal: spacing(12),
    borderRadius: 1,
    alignSelf: 'stretch',
    minHeight: scale(44),
  },
  netLine: {
    fontSize: fontSize(12),
    fontWeight: '600',
    letterSpacing: 0.2,
    marginBottom: spacing(16),
  },
  netEmphasis: {
    fontWeight: '800',
  },
  meterCaption: {
    fontSize: fontSize(10),
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
    opacity: 0.85,
  },
  flowTrack: {
    height: scale(8),
    borderRadius: scale(4),
    overflow: 'hidden',
    width: '100%',
  },
  flowIncomeWrap: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    overflow: 'hidden',
    borderRadius: scale(4),
  },
  flowIncomeFill: {
    ...StyleSheet.absoluteFillObject,
  },
  flowLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: spacing(16),
  },
  flowLegendTxt: {
    fontSize: fontSize(11),
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: scale(16),
    borderWidth: 1,
    paddingVertical: spacing(14),
    paddingHorizontal: spacing(16),
    marginBottom: spacing(4),
  },
  insightLeft: {
    alignItems: 'flex-start',
    minWidth: scale(72),
  },
  insightPercent: {
    fontSize: fontSize(28),
    fontWeight: '800',
    letterSpacing: -1,
  },
  insightSub: {
    fontSize: fontSize(10),
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginTop: 2,
    opacity: 0.85,
  },
  insightVRule: {
    width: 1,
    alignSelf: 'stretch',
    marginHorizontal: spacing(14),
    opacity: 0.9,
  },
  insightRight: {
    flex: 1,
    justifyContent: 'center',
  },
  insightTier: {
    fontSize: fontSize(16),
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  insightHint: {
    fontSize: fontSize(11),
    fontWeight: '500',
    marginTop: 4,
    letterSpacing: 0.15,
  },
  sectionRule: {
    height: StyleSheet.hairlineWidth * 2,
    marginTop: spacing(12),
    marginBottom: spacing(14),
    borderRadius: 1,
  },
  sectionTitle: {
    fontSize: fontSize(16),
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  sectionSub: {
    fontSize: fontSize(11),
    fontWeight: '600',
    marginTop: 4,
    marginBottom: spacing(12),
    letterSpacing: 0.25,
    opacity: 0.9,
  },
  emptyVault: {
    borderWidth: 1,
    borderRadius: scale(16),
    padding: spacing(20),
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: fontSize(15),
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.1,
  },
  emptyBody: {
    fontSize: fontSize(13),
    lineHeight: Math.round(fontSize(13) * 1.45),
    textAlign: 'center',
    fontWeight: '500',
  },
  categoryList: {
    borderRadius: scale(14),
    overflow: 'hidden',
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing(14),
    gap: spacing(12),
  },
  monoOuter: {
    width: scale(46),
    height: scale(46),
    borderRadius: scale(23),
    padding: scale(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  monoInner: {
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
  catBody: {
    flex: 1,
    minWidth: 0,
  },
  catTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: spacing(10),
    marginBottom: 8,
  },
  catName: {
    flex: 1,
    fontSize: fontSize(14),
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  catAmt: {
    fontSize: fontSize(14),
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  catTrack: {
    height: scale(5),
    borderRadius: scale(2.5),
    overflow: 'hidden',
    width: '100%',
  },
  catFill: {
    height: '100%',
    borderRadius: scale(2.5),
  },
  catMeta: {
    fontSize: fontSize(10),
    fontWeight: '600',
    marginTop: 6,
    letterSpacing: 0.2,
  },
});

export default SpendingFlowBoard;
