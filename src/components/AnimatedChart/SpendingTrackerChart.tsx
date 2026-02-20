import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import Svg, {
  Rect,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useTheme } from '../../utils/colors';
import { scale, fontSize, spacing } from '../../utils/responsive';
import { MaterialIcons } from '../../utils/Icons';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

export interface SpendingData {
  category: string;
  spent: number;
}

interface Props {
  data: SpendingData[];
  width?: number;
  title?: string;
  barHeight?: number;
  rowHeight?: number;
  minHeight?: number;
  maxHeight?: number;
}

const formatAmount = (value: number) =>
  value.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

export const AnimatedSpendingTracker: React.FC<Props> = ({
  data,
  width: widthProp,
  title = 'Spending Comparison',
  barHeight: barHeightProp,
  rowHeight: rowHeightProp,
  minHeight = 100,
  maxHeight = 600,
}) => {
  const { theme } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const width = useMemo(
    () => widthProp ?? Math.max(screenWidth - spacing(48), scale(280)),
    [screenWidth, widthProp],
  );
  const padding = spacing(24);
  // Pre-calculate spacing values to avoid calling spacing() in worklets
  const spacing20 = spacing(20);
  const spacing30 = spacing(30);
  const spacing12 = spacing(12);
  const barHeight = barHeightProp ?? scale(20);
  const rowHeight = rowHeightProp ?? scale(58);
  const isDark = theme.HEADER_BACKGROUND === '#0F1012';

  const calculatedHeight = useMemo(() => {
    const contentHeight = padding * 2 + data.length * rowHeight;
    return Math.min(Math.max(contentHeight, minHeight), maxHeight);
  }, [data.length, rowHeight, minHeight, maxHeight, padding]);

  const animatedValues = data.map(() => useSharedValue(0));
  const maxSpent = Math.max(...data.map(item => item.spent), 1);

  useEffect(() => {
    animatedValues.forEach((v, i) => {
      v.value = withDelay(
        i * 100,
        withTiming(1, {
          duration: 900,
          easing: Easing.out(Easing.cubic),
        }),
      );
    });
  }, [data]);

  const getBarColor = (spent: number) => {
    if (spent === maxSpent) return theme.EXPENSE_PIE;
    return theme.SECONDARY;
  };

  const containerStyle = [
    styles.container,
    {
      backgroundColor: theme.BACKGROUND_LIGHT,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(198, 165, 107, 0.15)' : 'rgba(198, 165, 107, 0.2)',
      padding: spacing(24),
      borderRadius: scale(24),
      ...Platform.select({
        ios: {
          shadowColor: isDark ? '#000' : theme.PURPLE,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: isDark ? 0.28 : 0.1,
          shadowRadius: 20,
        },
        android: { elevation: 10 },
      }),
    },
  ];

  return (
    <View style={containerStyle}>
      <View style={styles.header}>
        <View style={[styles.headerIcon, { backgroundColor: theme.SECONDARY + '25' }]}>
          <MaterialIcons
            name="pie-chart"
            size={scale(22)}
            color={theme.SECONDARY}
          />
        </View>
        <Text style={[styles.title, { color: theme.TEXT }]}>{title}</Text>
      </View>

      <Svg width={width} height={calculatedHeight}>
        <Defs>
          {data.map((item, i) => {
            const barColor = getBarColor(item.spent);
            return (
              <LinearGradient
                key={i}
                id={`grad-${i}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <Stop
                  offset="0%"
                  stopColor={barColor}
                  stopOpacity="0.75"
                />
                <Stop
                  offset="100%"
                  stopColor={barColor}
                  stopOpacity="1"
                />
              </LinearGradient>
            );
          })}
          {data.map((item, i) => (
            <LinearGradient
              key={`bg-${i}`}
              id={`bg-grad-${i}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <Stop
                offset="0%"
                stopColor={theme.BORDER_COLOR}
                stopOpacity={0.12}
              />
              <Stop
                offset="100%"
                stopColor={theme.BORDER_COLOR}
                stopOpacity={0.06}
              />
            </LinearGradient>
          ))}
        </Defs>

        {data.map((item, index) => {
          const y = padding + index * rowHeight;
          const amountColumnWidth = scale(120);
          const barWidth = width - amountColumnWidth - spacing(30);
          const percentage = maxSpent > 0 ? item.spent / maxSpent : 0;

          const animatedProps = useAnimatedProps(() => ({
            width: interpolate(
              animatedValues[index].value,
              [0, 1],
              [0, barWidth * percentage],
            ),
            opacity: animatedValues[index].value,
          }));

          const isHighest = item.spent === maxSpent;

          return (
            <React.Fragment key={index}>
              {/* Category label */}
              <SvgText
                x={spacing20}
                y={y + scale(16)}
                fontSize={fontSize(14)}
                fill={theme.TEXT}
                fontWeight="700"
              >
                {item.category}
              </SvgText>

              {/* Background bar */}
              <Rect
                x={spacing20}
                y={y + scale(22)}
                width={barWidth}
                height={barHeight}
                rx={barHeight / 2}
                fill={`url(#bg-grad-${index})`}
              />

              {/* Animated bar */}
              <AnimatedRect
                x={spacing20}
                y={y + scale(22)}
                height={barHeight}
                rx={barHeight / 2}
                fill={`url(#grad-${index})`}
                animatedProps={animatedProps}
              />

              {/* Amount label */}
              <SvgText
                x={width - spacing12}
                y={y + scale(37)}
                fontSize={fontSize(12)}
                fill={isHighest ? theme.EXPENSE_PIE : theme.LIGHT_TEXT}
                textAnchor="end"
                fontWeight="800"
              >
                ₹{formatAmount(item.spent)}
                {isHighest ? ' • Highest' : ''}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: spacing(8),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(12),
    marginBottom: spacing(20),
  },
  headerIcon: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(14),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize(20),
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
