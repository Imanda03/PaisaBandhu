import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Text as SvgText, Defs, LinearGradient, Stop, Polygon } from 'react-native-svg';
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
const AnimatedPath = Animated.createAnimatedComponent(Path);

export interface FitnessMetric {
    name: string;
    current: number;
    target: number;
    unit: string;
    icon?: string;
}

interface AnimatedFitnessChartProps {
    metrics: FitnessMetric[];
    width?: number;
    height?: number;
    animationDuration?: number;
    title?: string;
    chartType?: 'circular' | 'radar';
}

export const AnimatedFitnessChart: React.FC<AnimatedFitnessChartProps> = ({
    metrics,
    width = 320,
    height = 320,
    animationDuration = 1200,
    title,
    chartType = 'circular',
}) => {
    const { theme } = useTheme();
    const center = width / 2;
    const maxRadius = Math.min(width, height) / 2 - 60;

    const animatedValues = metrics.map(() => useSharedValue(0));

    useEffect(() => {
        animatedValues.forEach((animatedValue, index) => {
            animatedValue.value = withDelay(
                index * 200,
                withTiming(1, {
                    duration: animationDuration,
                    easing: Easing.out(Easing.back(1.1)),
                })
            );
        });
    }, [metrics]);

    const getMetricColor = (index: number): string => {
        const colors = [
            theme.SUCCESS,
            theme.LIGHT_PURPLE,
            theme.WARNING,
            theme.PURPLE,
            theme.INCOME_PIE,
            theme.EXPENSE_PIE,
        ];
        return colors[index % colors.length];
    };

    const getProgressPercentage = (current: number, target: number): number => {
        return Math.min(current / target, 1);
    };

    if (chartType === 'radar') {
        // Radar Chart Implementation
        const angles = metrics.map((_, index) => (index * 2 * Math.PI) / metrics.length);

        const createRadarPath = (values: number[]): string => {
            if (values.length === 0) return '';

            const points = values.map((value, index) => {
                const angle = angles[index] - Math.PI / 2;
                const radius = (value / 100) * maxRadius;
                const x = center + Math.cos(angle) * radius;
                const y = center + Math.sin(angle) * radius;
                return { x, y };
            });

            let path = `M${points[0].x},${points[0].y}`;
            for (let i = 1; i < points.length; i++) {
                path += ` L${points[i].x},${points[i].y}`;
            }
            path += ' Z';

            return path;
        };

        const animatedRadarProps = useAnimatedProps(() => {
            const progress = Math.min(...animatedValues.map(v => v.value));
            const values = metrics.map((metric, index) => {
                const targetPercentage = getProgressPercentage(metric.current, metric.target) * 100;
                return interpolate(animatedValues[index].value, [0, 1], [0, targetPercentage]);
            });

            return {
                d: createRadarPath(values),
                opacity: progress * 0.3,
            };
        });

        return (
            <View style={[styles.container, { backgroundColor: theme.BACKGROUND }]}>
                {title && (
                    <Text style={[styles.title, { color: theme.TEXT }]}>{title}</Text>
                )}

                <Svg width={width} height={height}>
                    <Defs>
                        <LinearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <Stop offset="0%" stopColor={theme.PURPLE} stopOpacity="0.4" />
                            <Stop offset="100%" stopColor={theme.LIGHT_PURPLE} stopOpacity="0.1" />
                        </LinearGradient>
                    </Defs>

                    {/* Background rings */}
                    {[0.2, 0.4, 0.6, 0.8, 1].map((scale, index) => (
                        <Circle
                            key={`ring-${index}`}
                            cx={center}
                            cy={center}
                            r={maxRadius * scale}
                            stroke={theme.BORDER_COLOR}
                            strokeWidth={1}
                            fill="none"
                            opacity={0.2}
                        />
                    ))}

                    {/* Axis lines */}
                    {angles.map((angle, index) => {
                        const x2 = center + Math.cos(angle - Math.PI / 2) * maxRadius;
                        const y2 = center + Math.sin(angle - Math.PI / 2) * maxRadius;

                        return (
                            <Path
                                key={`axis-${index}`}
                                d={`M${center},${center} L${x2},${y2}`}
                                stroke={theme.BORDER_COLOR}
                                strokeWidth={1}
                                opacity={0.3}
                            />
                        );
                    })}

                    {/* Data area */}
                    <AnimatedPath
                        fill="url(#radarGradient)"
                        stroke={theme.PURPLE}
                        strokeWidth={2}
                        animatedProps={animatedRadarProps}
                    />

                    {/* Metric labels and values */}
                    {metrics.map((metric, index) => {
                        const angle = angles[index] - Math.PI / 2;
                        const labelRadius = maxRadius + 25;
                        const x = center + Math.cos(angle) * labelRadius;
                        const y = center + Math.sin(angle) * labelRadius;

                        return (
                            <React.Fragment key={`label-${index}`}>
                                <SvgText
                                    x={x}
                                    y={y - 5}
                                    fontSize="12"
                                    fill={theme.TEXT}
                                    textAnchor="middle"
                                    fontWeight="bold"
                                >
                                    {metric.name}
                                </SvgText>
                                <SvgText
                                    x={x}
                                    y={y + 10}
                                    fontSize="10"
                                    fill={theme.LIGHT_TEXT}
                                    textAnchor="middle"
                                >
                                    {metric.current}/{metric.target} {metric.unit}
                                </SvgText>
                            </React.Fragment>
                        );
                    })}
                </Svg>
            </View>
        );
    }

    // Circular Progress Chart Implementation
    return (
        <View style={[styles.container, { backgroundColor: theme.BACKGROUND }]}>
            {title && (
                <Text style={[styles.title, { color: theme.TEXT }]}>{title}</Text>
            )}

            <Svg width={width} height={height}>
                <Defs>
                    {metrics.map((_, index) => (
                        <LinearGradient
                            key={`fitness-gradient-${index}`}
                            id={`fitness-gradient-${index}`}
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                        >
                            <Stop offset="0%" stopColor={getMetricColor(index)} stopOpacity="0.3" />
                            <Stop offset="100%" stopColor={getMetricColor(index)} stopOpacity="1" />
                        </LinearGradient>
                    ))}
                </Defs>

                {metrics.map((metric, index) => {
                    const radius = 40 + index * 35;
                    const circumference = 2 * Math.PI * radius;
                    const percentage = getProgressPercentage(metric.current, metric.target);

                    const animatedProps = useAnimatedProps(() => {
                        const progress = animatedValues[index].value;
                        const animatedPercentage = interpolate(progress, [0, 1], [0, percentage]);
                        const strokeDasharray = circumference;
                        const strokeDashoffset = circumference * (1 - animatedPercentage);

                        return {
                            strokeDasharray,
                            strokeDashoffset,
                            opacity: progress,
                        };
                    });

                    return (
                        <React.Fragment key={`fitness-${index}`}>
                            {/* Background circle */}
                            <Circle
                                cx={center}
                                cy={center}
                                r={radius}
                                stroke={theme.BORDER_COLOR}
                                strokeWidth={8}
                                fill="none"
                                opacity={0.1}
                            />

                            {/* Progress circle */}
                            <AnimatedCircle
                                cx={center}
                                cy={center}
                                r={radius}
                                stroke={`url(#fitness-gradient-${index})`}
                                strokeWidth={8}
                                fill="none"
                                strokeLinecap="round"
                                transform={`rotate(-90 ${center} ${center})`}
                                animatedProps={animatedProps}
                            />
                        </React.Fragment>
                    );
                })}

                {/* Center content */}
                <Circle
                    cx={center}
                    cy={center}
                    r={30}
                    fill={theme.BACKGROUND}
                    stroke={theme.BORDER_COLOR}
                    strokeWidth={2}
                />

                <SvgText
                    x={center}
                    y={center - 5}
                    fontSize="12"
                    fill={theme.TEXT}
                    textAnchor="middle"
                    fontWeight="bold"
                >
                    Fitness
                </SvgText>

                <SvgText
                    x={center}
                    y={center + 10}
                    fontSize="10"
                    fill={theme.LIGHT_TEXT}
                    textAnchor="middle"
                >
                    Goals
                </SvgText>
            </Svg>

            {/* Legend */}
            <View style={styles.legend}>
                {metrics.map((metric, index) => (
                    <View key={`legend-${index}`} style={styles.legendItem}>
                        <View
                            style={[
                                styles.legendColor,
                                { backgroundColor: getMetricColor(index) }
                            ]}
                        />
                        <View style={styles.legendContent}>
                            <Text style={[styles.legendText, { color: theme.TEXT }]}>
                                {metric.name}
                            </Text>
                            <Text style={[styles.legendValue, { color: theme.LIGHT_TEXT }]}>
                                {metric.current}/{metric.target} {metric.unit} ({Math.round(getProgressPercentage(metric.current, metric.target) * 100)}%)
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
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
    legend: {
        marginTop: 20,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
    },
    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 10,
    },
    legendContent: {
        flex: 1,
    },
    legendText: {
        fontSize: 14,
        fontWeight: '600',
    },
    legendValue: {
        fontSize: 12,
        marginTop: 2,
    },
});