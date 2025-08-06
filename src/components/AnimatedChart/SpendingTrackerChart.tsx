import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Text as SvgText, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
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
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface SpendingData {
    category: string;
    spent: number;
    budget: number;
    icon?: string;
}

interface AnimatedSpendingTrackerProps {
    data: SpendingData[];
    width?: number;
    height?: number;
    animationDuration?: number;
    title?: string;
    showPercentages?: boolean;
}

export const AnimatedSpendingTracker: React.FC<AnimatedSpendingTrackerProps> = ({
    data,
    width = 350,
    height = 400,
    animationDuration = 1000,
    title,
    showPercentages = true,
}) => {
    const { theme } = useTheme();
    const itemHeight = 60;
    const barHeight = 20;
    const padding = 20;

    const animatedValues = data.map(() => useSharedValue(0));

    useEffect(() => {
        animatedValues.forEach((animatedValue, index) => {
            animatedValue.value = withDelay(
                index * 150,
                withTiming(1, {
                    duration: animationDuration,
                    easing: Easing.out(Easing.quad),
                })
            );
        });
    }, [data]);

    const getStatusColor = (spent: number, budget: number): string => {
        const percentage = spent / budget;
        if (percentage >= 1) return theme.EXPENSE_PIE;
        if (percentage >= 0.8) return theme.WARNING;
        if (percentage >= 0.6) return theme.INCOME_PIE;
        return theme.SUCCESS;
    };

    const getBackgroundColor = (spent: number, budget: number): string => {
        const percentage = spent / budget;
        if (percentage >= 1) return theme.ERROR_LIGHT;
        if (percentage >= 0.8) return theme.WARNING_LIGHT;
        return theme.SUCCESS_LIGHT;
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.BACKGROUND }]}>
            {title && (
                <Text style={[styles.title, { color: theme.TEXT }]}>{title}</Text>
            )}

            <Svg width={width} height={height}>
                <Defs>
                    {data.map((item, index) => (
                        <LinearGradient
                            key={`spending-gradient-${index}`}
                            id={`spending-gradient-${index}`}
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                        >
                            <Stop offset="0%" stopColor={getStatusColor(item.spent, item.budget)} stopOpacity="0.8" />
                            <Stop offset="100%" stopColor={getStatusColor(item.spent, item.budget)} stopOpacity="1" />
                        </LinearGradient>
                    ))}
                </Defs>

                {data.map((item, index) => {
                    const y = padding + index * (itemHeight + 10);
                    const barWidth = width - 120;
                    const percentage = Math.min(item.spent / item.budget, 1);
                    const isOverBudget = item.spent > item.budget;

                    const animatedProps = useAnimatedProps(() => {
                        const progress = animatedValues[index].value;
                        const animatedWidth = interpolate(progress, [0, 1], [0, barWidth * percentage]);

                        return {
                            width: animatedWidth,
                            opacity: progress,
                        };
                    });

                    const animatedIndicatorProps = useAnimatedProps(() => {
                        const progress = animatedValues[index].value;
                        return {
                            opacity: interpolate(progress, [0.5, 1], [0, 1]),
                            r: interpolate(progress, [0.5, 1], [0, isOverBudget ? 8 : 6]),
                        };
                    });

                    return (
                        <React.Fragment key={`spending-${index}`}>
                            {/* Background bar */}
                            <Rect
                                x={80}
                                y={y + 20}
                                width={barWidth}
                                height={barHeight}
                                fill={getBackgroundColor(item.spent, item.budget)}
                                rx={barHeight / 2}
                            />

                            {/* Progress bar */}
                            <AnimatedRect
                                x={80}
                                y={y + 20}
                                height={barHeight}
                                fill={`url(#spending-gradient-${index})`}
                                rx={barHeight / 2}
                                animatedProps={animatedProps}
                            />

                            {/* Budget line indicator */}
                            <Rect
                                x={80 + barWidth - 2}
                                y={y + 15}
                                width={2}
                                height={barHeight + 10}
                                fill={theme.BORDER_COLOR}
                                opacity={0.6}
                            />

                            {/* Category label */}
                            <SvgText
                                x={15}
                                y={y + 15}
                                fontSize="14"
                                fill={theme.TEXT}
                                fontWeight="bold"
                            >
                                {item.category}
                            </SvgText>

                            {/* Amount text */}
                            <SvgText
                                x={15}
                                y={y + 32}
                                fontSize="12"
                                fill={theme.LIGHT_TEXT}
                            >
                                ${item.spent} / ${item.budget}
                            </SvgText>

                            {/* Percentage */}
                            {showPercentages && (
                                <SvgText
                                    x={width - 15}
                                    y={y + 25}
                                    fontSize="12"
                                    fill={getStatusColor(item.spent, item.budget)}
                                    textAnchor="end"
                                    fontWeight="bold"
                                >
                                    {Math.round(percentage * 100)}%
                                </SvgText>
                            )}

                            {/* Over budget indicator */}
                            {isOverBudget && (
                                <AnimatedCircle
                                    cx={70}
                                    cy={y + 15}
                                    fill={theme.EXPENSE_PIE}
                                    animatedProps={animatedIndicatorProps}
                                />
                            )}

                            {/* Status indicator */}
                            <AnimatedCircle
                                cx={width - 35}
                                cy={y + 35}
                                fill={getStatusColor(item.spent, item.budget)}
                                animatedProps={useAnimatedProps(() => {
                                    const progress = animatedValues[index].value;
                                    return {
                                        opacity: interpolate(progress, [0.7, 1], [0, 1]),
                                        r: interpolate(progress, [0.7, 1], [0, 4]),
                                    };
                                })}
                            />
                        </React.Fragment>
                    );
                })}

                {/* Summary section */}
                <Rect
                    x={10}
                    y={height - 80}
                    width={width - 20}
                    height={70}
                    fill={theme.CARD_SHADOW}
                    rx={8}
                    opacity={0.1}
                />

                <SvgText
                    x={20}
                    y={height - 60}
                    fontSize="14"
                    fill={theme.TEXT}
                    fontWeight="bold"
                >
                    Summary
                </SvgText>

                <SvgText
                    x={20}
                    y={height - 40}
                    fontSize="12"
                    fill={theme.LIGHT_TEXT}
                >
                    Total Spent: ${data.reduce((sum, item) => sum + item.spent, 0)}
                </SvgText>

                <SvgText
                    x={20}
                    y={height - 25}
                    fontSize="12"
                    fill={theme.LIGHT_TEXT}
                >
                    Total Budget: ${data.reduce((sum, item) => sum + item.budget, 0)}
                </SvgText>
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 12,
        margin: 8,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
});