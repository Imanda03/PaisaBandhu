import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
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

export const AnimatedSpendingTracker: React.FC<Props> = ({
  data,
  width = 350,
  title = 'Spending Comparison',
  barHeight = 18,
  rowHeight = 52,
  minHeight = 100,
  maxHeight = 600,
}) => {
  const { theme } = useTheme();
  const padding = 20;

  // Calculate dynamic height based on number of items
  const calculatedHeight = useMemo(() => {
    const contentHeight = padding * 2 + data.length * rowHeight;
    return Math.min(Math.max(contentHeight, minHeight), maxHeight);
  }, [data.length, rowHeight, minHeight, maxHeight]);

  const animatedValues = data.map(() => useSharedValue(0));
  const maxSpent = Math.max(...data.map(item => item.spent));

  useEffect(() => {
    animatedValues.forEach((v, i) => {
      v.value = withDelay(
        i * 120,
        withTiming(1, {
          duration: 800,
          easing: Easing.out(Easing.cubic),
        }),
      );
    });
  }, [data]);

  const getBarColor = (spent: number) => {
    if (spent === maxSpent) return theme.EXPENSE_PIE;
    return theme.INCOME_PIE;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.BACKGROUND }]}>
      {title && (
        <Text style={[styles.title, { color: theme.TEXT }]}>{title}</Text>
      )}

      <Svg width={width} height={calculatedHeight}>
        <Defs>
          {data.map((item, i) => (
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
                stopColor={getBarColor(item.spent)}
                stopOpacity="0.6"
              />
              <Stop
                offset="100%"
                stopColor={getBarColor(item.spent)}
                stopOpacity="1"
              />
            </LinearGradient>
          ))}
        </Defs>

        {data.map((item, index) => {
          const y = padding + index * rowHeight;
          const barWidth = width - 100;
          const percentage = item.spent / maxSpent;

          const animatedProps = useAnimatedProps(() => ({
            width: interpolate(
              animatedValues[index].value,
              [0, 1],
              [0, barWidth * percentage],
            ),
            opacity: animatedValues[index].value,
          }));

          return (
            <React.Fragment key={index}>
              {/* Category */}
              <SvgText
                x={15}
                y={y + 14}
                fontSize="14"
                fill={theme.TEXT}
                fontWeight="600"
              >
                {item.category}
              </SvgText>

              {/* Background bar */}
              <Rect
                x={15}
                y={y + 16}
                width={barWidth}
                height={barHeight}
                rx={barHeight / 2}
                fill={getBarColor(item.spent)}
                opacity={0.15}
              />

              {/* Animated bar */}
              <AnimatedRect
                x={15}
                y={y + 16}
                height={barHeight}
                rx={barHeight / 2}
                fill={`url(#grad-${index})`}
                animatedProps={animatedProps}
              />

              {/* Highlight highest spender */}
              {item.spent === maxSpent && (
                <SvgText
                  x={width - 40}
                  y={y + 30}
                  fontSize="11"
                  fill={theme.EXPENSE_PIE}
                  textAnchor="end"
                  fontWeight="bold"
                >
                  Highest
                </SvgText>
              )}
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 14,
    margin: 10,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
});
