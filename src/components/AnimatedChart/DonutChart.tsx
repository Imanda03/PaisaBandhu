import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Text as SvgText, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withTiming,
    withDelay,
    Easing,
    interpolate,
} from 'react-native-reanimated';
import { useTheme } from '../../utils/colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface DonutChartData {
    value: number;
    label: string;
    color?: string;
}

interface AnimatedDonutChartProps {
    data: DonutChartData[];
    size?: number;
    strokeWidth?: number;
    animationDuration?: number;
    title?: string;
    showLabels?: boolean;
    showPercentages?: boolean;
    centerText?: string;
}

export const AnimatedDonutChart: React.FC<AnimatedDonutChartProps> = ({
    data,
    size = 280,
    strokeWidth = 40,
    animationDuration = 1200,
    title,
    showLabels = true,
    showPercentages = true,
    centerText,
}) => {
    const { theme } = useTheme();
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

    const total = data.reduce((sum, item) => sum + item.value, 0);
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

    const getColor = (index: number): string => {
        if (data[index].color) return data[index].color!;

        const colors = [
            theme.INCOME_PIE,
            theme.EXPENSE_PIE,
            theme.PURPLE,
            theme.LIGHT_PURPLE,
            theme.SUCCESS,
            theme.WARNING,
        ];
        return colors[index % colors.length];
    };

    let cumulativePercentage = 0;

    return (
        <View style={[styles.container, { backgroundColor: theme.LIGHT_PURPLE }]}>
            {title && (
                <Text style={[styles.title, { color: theme.SECONDARY }]}>{title}</Text>
            )}

            <View style={styles.chartContainer}>
                <Svg width={size} height={size}>
                    <Defs>
                        {data.map((_, index) => (
                            <LinearGradient
                                key={`donut-gradient-${index}`}
                                id={`donut-gradient-${index}`}
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="100%"
                            >
                                <Stop offset="0%" stopColor={getColor(index)} stopOpacity="1" />
                                <Stop offset="100%" stopColor={getColor(index)} stopOpacity="0.7" />
                            </LinearGradient>
                        ))}
                    </Defs>

                    {/* Background circle */}
                    <Circle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke={theme.BORDER_COLOR}
                        strokeWidth={strokeWidth}
                        fill="none"
                        opacity={0.1}
                    />

                    {/* Data segments */}
                    {data.map((item, index) => {
                        const percentage = item.value / total;
                        const strokeDasharray = `${percentage * circumference} ${circumference}`;
                        const rotate = (cumulativePercentage * 360) - 90;

                        const previousCumulative = cumulativePercentage;
                        cumulativePercentage += percentage;

                        const animatedProps = useAnimatedProps(() => {
                            const progress = animatedValues[index].value;
                            const animatedPercentage = interpolate(progress, [0, 1], [0, percentage]);
                            const animatedStrokeDasharray = `${animatedPercentage * circumference} ${circumference}`;

                            return {
                                strokeDasharray: animatedStrokeDasharray,
                                opacity: progress,
                            };
                        });

                        // Calculate label position
                        const angle = (previousCumulative + percentage / 2) * 2 * Math.PI;
                        const labelRadius = radius + strokeWidth / 2 + 20;
                        // const labelX = center + Math.cos(angle - Math.PI / 2) * labelRadius;
                        // const labelY = center + Math.sin(angle - Math.PI / 2) * labelRadius;

                        return (
                            <React.Fragment key={`segment-${index}`}>
                                <G rotation={rotate} originX={center} originY={center}>
                                    <AnimatedCircle
                                        cx={center}
                                        cy={center}
                                        r={radius}
                                        stroke={`url(#donut-gradient-${index})`}
                                        strokeWidth={strokeWidth}
                                        fill="none"
                                        strokeLinecap="round"
                                        animatedProps={animatedProps}
                                        strokeDashoffset={0}
                                    />
                                </G>

                                {/* Labels */}
                                {showLabels && percentage > 0.05 && (
                                    <>
                                        <SvgText
                                            // x={labelX}
                                            // y={labelY - 5}
                                            fontSize="12"
                                            fill={theme.TEXT}
                                            textAnchor="middle"
                                            fontWeight="bold"
                                        >
                                            {item.label}
                                        </SvgText>
                                        {showPercentages && (
                                            <SvgText
                                                // x={labelX}
                                                // y={labelY + 10}
                                                fontSize="10"
                                                fill={theme.SECONDARY}
                                                textAnchor="middle"
                                            >
                                                {`${(percentage * 100).toFixed(1)}%`}
                                            </SvgText>
                                        )}
                                    </>
                                )}
                            </React.Fragment>
                        );
                    })}

                    {/* Center text */}
                    {centerText && (
                        <SvgText
                            x={center}
                            y={center}
                            fontSize="16"
                            fill={theme.SECONDARY}
                            textAnchor="middle"
                            fontWeight="bold"
                        >
                            {centerText}
                        </SvgText>
                    )}
                </Svg>

                {/* Legend */}
                {showLabels && (
                    <View style={styles.legend}>
                        {data.map((item, index) => (
                            <View key={`legend-${index}`} style={styles.legendItem}>
                                <View
                                    style={[
                                        styles.legendColor,
                                        { backgroundColor: getColor(index) }
                                    ]}
                                />
                                <Text style={[styles.legendText, { color: theme.TEXT }]}>
                                    {item.label}: {item.value}
                                    {showPercentages && (
                                        <Text style={[styles.legendPercentage, { color: theme.LIGHT_TEXT }]}>
                                            {` (${((item.value / total) * 100).toFixed(1)}%)`}
                                        </Text>
                                    )}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 12,
        // margin: 8,
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
    chartContainer: {
        alignItems: 'center',
    },
    legend: {
        marginTop: 20,
        width: '100%',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    legendColor: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 8,
    },
    legendText: {
        fontSize: 14,
        flex: 1,
    },
    legendPercentage: {
        fontSize: 12,
    },
});