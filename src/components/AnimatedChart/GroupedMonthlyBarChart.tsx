import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Rect, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { scale, fontSize, spacing } from '../../utils/responsive';
import { useTheme } from '../../utils/colors';
import type { MonthlyIncomeExpensePoint } from './GroupedMonthlyBarChart.types';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

type PairProps = {
  row: MonthlyIncomeExpensePoint;
  index: number;
  groupStart: number;
  barWidth: number;
  pairGap: number;
  chartHeight: number;
  height: number;
  maxValue: number;
  spacing40: number;
  spacing20: number;
  themeText: string;
  animationDuration: number;
};

const GroupedBarPair: React.FC<PairProps> = ({
  row,
  index,
  groupStart,
  barWidth,
  pairGap,
  chartHeight,
  height,
  maxValue,
  spacing40,
  spacing20,
  themeText,
  animationDuration,
}) => {
  const animIncome = useSharedValue(0);
  const animExpense = useSharedValue(0);

  useEffect(() => {
    animIncome.value = 0;
    animExpense.value = 0;
    animIncome.value = withDelay(
      index * 80,
      withTiming(row.income, {
        duration: animationDuration,
        easing: Easing.out(Easing.quad),
      }),
    );
    animExpense.value = withDelay(
      index * 80 + 40,
      withTiming(row.expense, {
        duration: animationDuration,
        easing: Easing.out(Easing.quad),
      }),
    );
  // Reanimated shared values (animIncome, animExpense) are stable per mount.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row.income, row.expense, index, animationDuration]);

  const incomeProps = useAnimatedProps(() => {
    const hBar = (animIncome.value / maxValue) * chartHeight;
    return {
      height: hBar,
      y: height - spacing40 - hBar,
    };
  });

  const expenseProps = useAnimatedProps(() => {
    const hBar = (animExpense.value / maxValue) * chartHeight;
    return {
      height: hBar,
      y: height - spacing40 - hBar,
    };
  });

  const slotWidth = barWidth * 2 + pairGap;
  const labelCenterX = groupStart + slotWidth / 2;

  return (
    <React.Fragment>
      <AnimatedRect
        x={groupStart}
        y={height - spacing40}
        width={barWidth}
        height={0}
        fill="url(#grad-income)"
        rx={scale(5)}
        animatedProps={incomeProps}
      />
      <AnimatedRect
        x={groupStart + barWidth + pairGap}
        y={height - spacing40}
        width={barWidth}
        height={0}
        fill="url(#grad-expense)"
        rx={scale(5)}
        animatedProps={expenseProps}
      />
      <SvgText
        x={labelCenterX}
        y={height - spacing20}
        fontSize={fontSize(10)}
        fill={themeText}
        textAnchor="middle"
      >
        {row.label}
      </SvgText>
    </React.Fragment>
  );
};

interface Props {
  data: MonthlyIncomeExpensePoint[];
  title?: string;
  animationDuration?: number;
}

export const GroupedMonthlyBarChart: React.FC<Props> = ({
  data,
  title,
  animationDuration = 1200,
}) => {
  const { theme } = useTheme();
  const isDark = theme.HEADER_BACKGROUND === '#0F1012';
  const { width: screenWidth } = useWindowDimensions();

  const chartLayout = useMemo(() => {
    const w = Math.max(screenWidth - spacing(48), scale(280));
    const h = Math.min(scale(300), w * 0.72);
    return { width: w, height: h };
  }, [screenWidth]);

  const { width, height } = chartLayout;

  const spacing80 = spacing(80);
  const spacing40 = spacing(40);
  const spacing35 = spacing(35);
  const spacing45 = spacing(45);
  const spacing50 = spacing(50);
  const spacing20 = spacing(20);
  const chartHeight = height - spacing80;

  const maxValue = useMemo(() => {
    if (!data?.length) return 1;
    return Math.max(
      ...data.flatMap((d) => [d.income || 0, d.expense || 0]),
      1,
    );
  }, [data]);

  const { groupPositions, barWidth, pairGap } = useMemo(() => {
    const n = Math.max(data?.length || 0, 1);
    const groupGap = scale(10);
    const innerGap = scale(4);
    const s80 = spacing(80);
    const s50 = spacing(50);
    const inner = width - s80;
    const groupSlot = n > 0 ? (inner - (n - 1) * groupGap) / n : inner;
    const bw = Math.max((groupSlot - innerGap) / 2, scale(12));
    const positions: number[] = [];
    for (let i = 0; i < n; i++) {
      positions.push(s50 + i * (groupSlot + groupGap));
    }
    return { groupPositions: positions, barWidth: bw, pairGap: innerGap };
  }, [data?.length, width]);

  if (!data || data.length === 0) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.BACKGROUND_LIGHT,
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          },
        ]}
      >
        {title ? (
          <Text style={[styles.title, { color: theme.LIGHT_TEXT }]}>{title}</Text>
        ) : null}
        <View style={{ padding: 40, alignItems: 'center' }}>
          <Text style={{ color: theme.TEXT, opacity: 0.6 }}>No data available</Text>
        </View>
      </View>
    );
  }

  const incomeColor = theme.INCOME_PIE || theme.SUCCESS;
  const expenseColor = theme.EXPENSE_PIE || theme.ERROR;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.BACKGROUND_LIGHT,
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        },
      ]}
    >
      {title ? (
        <Text style={[styles.title, { color: theme.LIGHT_TEXT }]}>{title}</Text>
      ) : null}

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: incomeColor }]} />
          <Text style={[styles.legendLabel, { color: theme.LIGHT_TEXT }]}>Income</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: expenseColor }]} />
          <Text style={[styles.legendLabel, { color: theme.LIGHT_TEXT }]}>Expense</Text>
        </View>
      </View>

      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="grad-income" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={incomeColor} stopOpacity={1} />
            <Stop offset="100%" stopColor={incomeColor} stopOpacity={0.55} />
          </LinearGradient>
          <LinearGradient id="grad-expense" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={expenseColor} stopOpacity={1} />
            <Stop offset="100%" stopColor={expenseColor} stopOpacity={0.55} />
          </LinearGradient>
        </Defs>

        {[0, 0.25, 0.5, 0.75, 1].map((percentage, index) => (
          <React.Fragment key={`grid-${index}`}>
            <Rect
              x={spacing40}
              y={spacing40 + chartHeight * percentage}
              width={width - spacing80}
              height={1}
              fill={theme.BORDER_COLOR}
              opacity={0.3}
            />
            <SvgText
              x={spacing35}
              y={spacing45 + chartHeight * percentage}
              fontSize={fontSize(10)}
              fill={theme.LIGHT_TEXT}
              textAnchor="end"
            >
              {Math.round(maxValue * (1 - percentage))}
            </SvgText>
          </React.Fragment>
        ))}

        {data.map((row, index) => (
          <GroupedBarPair
            key={`${row.label}-${index}`}
            row={row}
            index={index}
            groupStart={groupPositions[index] ?? spacing50}
            barWidth={barWidth}
            pairGap={pairGap}
            chartHeight={chartHeight}
            height={height}
            maxValue={maxValue}
            spacing40={spacing40}
            spacing20={spacing20}
            themeText={theme.TEXT}
            animationDuration={animationDuration}
          />
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing(20),
    borderRadius: scale(22),
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  title: {
    fontSize: fontSize(13),
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    textAlign: 'left',
    marginBottom: spacing(12),
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing(24),
    marginBottom: spacing(12),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(8),
  },
  legendDot: {
    width: scale(10),
    height: scale(10),
    borderRadius: scale(5),
  },
  legendLabel: {
    fontSize: fontSize(12),
    fontWeight: '600',
  },
});
