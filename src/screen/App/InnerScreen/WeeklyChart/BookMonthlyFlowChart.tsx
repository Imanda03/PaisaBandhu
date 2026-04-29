import React, { useEffect } from 'react';
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
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../../../../utils/colors';
import type { MonthlyIncomeExpensePoint } from '../../../../components/AnimatedChart/GroupedMonthlyBarChart.types';
import { scale, fontSize, spacing } from '../../../../utils/responsive';

const formatInr = (n: number) =>
  Math.round(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });

type RowProps = {
  row: MonthlyIncomeExpensePoint;
  index: number;
  rim: string;
  hairline: string;
  isLast: boolean;
};

function MonthPulseRow({ row, index, rim, hairline, isLast }: RowProps) {
  const { theme } = useTheme();
  const trackW = useSharedValue(0);
  const progress = useSharedValue(0);

  const total = Math.max((row.income || 0) + (row.expense || 0), 1);
  const inPct = (row.income || 0) / total;
  const exPct = (row.expense || 0) / total;

  const onTrackLayout = (e: LayoutChangeEvent) => {
    trackW.value = e.nativeEvent.layout.width;
  };

  useEffect(() => {
    progress.value = 0;
    progress.value = withDelay(
      index * 65,
      withTiming(1, {
        duration: 880,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, [row.income, row.expense, index, progress]);

  const greenStyle = useAnimatedStyle(() => ({
    width: trackW.value * inPct * progress.value,
  }));

  const redStyle = useAnimatedStyle(() => ({
    width: trackW.value * exPct * progress.value,
  }));

  return (
    <View
      style={[
        styles.row,
        !isLast && {
          borderBottomColor: hairline,
          borderBottomWidth: StyleSheet.hairlineWidth,
        },
      ]}
    >
      <View style={[styles.monthCol, { borderRightColor: rim }]}>
        <Text style={[styles.monthText, { color: theme.SECONDARY }]} numberOfLines={2}>
          {row.label}
        </Text>
      </View>

      <View style={styles.rowMain}>
        <Text style={[styles.rowOverline, { color: theme.LIGHT_TEXT }]}>
          Mix of inflow & outflow
        </Text>
        <View style={[styles.trackShell, { backgroundColor: hairline }]}>
          <View style={styles.trackInner} onLayout={onTrackLayout}>
            <Animated.View style={[styles.segWrap, greenStyle]}>
              <LinearGradient
                colors={['#7FD99A', theme.INCOME_PIE]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.segFill}
              />
            </Animated.View>
            <Animated.View style={[styles.segWrap, redStyle]}>
              <LinearGradient
                colors={['#FFABAB', theme.EXPENSE_PIE]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.segFill}
              />
            </Animated.View>
          </View>
        </View>

        <View style={styles.amountRow}>
          <Text style={[styles.amountIn, { color: theme.INCOME_PIE }]}>
            +₹{formatInr(row.income || 0)}
          </Text>
          <Text style={[styles.amountSep, { color: theme.LIGHT_TEXT }]}>·</Text>
          <Text style={[styles.amountOut, { color: theme.EXPENSE_PIE }]}>
            −₹{formatInr(row.expense || 0)}
          </Text>
        </View>
      </View>
    </View>
  );
}

type Props = {
  data: MonthlyIncomeExpensePoint[];
};

const BookMonthlyFlowChart: React.FC<Props> = ({ data }) => {
  const { theme, isDark } = useTheme();

  const rim = isDark ? 'rgba(198, 165, 107, 0.22)' : 'rgba(198, 165, 107, 0.35)';
  const hairline = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const innerBg = isDark ? 'rgba(255,255,255,0.035)' : 'rgba(255,255,255,0.5)';

  if (!data?.length) return null;

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
                  ≋
                </Text>
              </View>
              <View style={styles.headerText}>
                <Text style={[styles.overline, { color: theme.SECONDARY }]}>
                  Temporal flow
                </Text>
                <Text style={[styles.title, { color: theme.TEXT }]}>
                  Monthly rhythm
                </Text>
                <Text style={[styles.subtitle, { color: theme.LIGHT_TEXT }]}>
                  One fused strip per month — green is inflow, coral is outflow.
                </Text>
              </View>
            </View>

            <View style={[styles.listRim, { borderColor: hairline }]}>
              {data.map((row, index) => (
                <MonthPulseRow
                  key={`${row.label}-${index}`}
                  row={row}
                  index={index}
                  rim={rim}
                  hairline={hairline}
                  isLast={index === data.length - 1}
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
    fontSize: fontSize(22),
    fontWeight: '300',
    marginTop: -2,
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
    alignItems: 'stretch',
    minHeight: scale(88),
  },
  monthCol: {
    width: scale(64),
    paddingVertical: spacing(14),
    paddingHorizontal: spacing(8),
    justifyContent: 'center',
    borderRightWidth: 1,
  },
  monthText: {
    fontSize: fontSize(12),
    fontWeight: '800',
    letterSpacing: 0.2,
    textAlign: 'center',
    lineHeight: Math.round(fontSize(12) * 1.2),
  },
  rowMain: {
    flex: 1,
    paddingVertical: spacing(12),
    paddingHorizontal: spacing(12),
    justifyContent: 'center',
    minWidth: 0,
  },
  rowOverline: {
    fontSize: fontSize(9),
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    marginBottom: 8,
    opacity: 0.75,
  },
  trackShell: {
    borderRadius: scale(8),
    padding: scale(3),
  },
  trackInner: {
    flexDirection: 'row',
    alignItems: 'stretch',
    height: scale(12),
    borderRadius: scale(5),
    overflow: 'hidden',
  },
  segWrap: { height: scale(12), overflow: 'hidden' },
  segFill: { flex: 1, width: '100%', minWidth: 2 },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: spacing(10),
    gap: 6,
  },
  amountIn: {
    fontSize: fontSize(12),
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  amountSep: { fontSize: fontSize(12), fontWeight: '700', opacity: 0.45 },
  amountOut: {
    fontSize: fontSize(12),
    fontWeight: '800',
    letterSpacing: -0.2,
  },
});

export default BookMonthlyFlowChart;
