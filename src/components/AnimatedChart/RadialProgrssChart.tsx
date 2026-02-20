import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Circle, Text as SvgText, Defs, LinearGradient, Stop, G } from 'react-native-svg';
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
const AnimatedText = Animated.createAnimatedComponent(SvgText);

export interface RadialChartData {
    value: number;
    maxValue: number;
    label: string;
    color?: string;
}

interface AnimatedRadialChartProps {
    data: RadialChartData[];
    size?: number;
    strokeWidth?: number;
    animationDuration?: number;
    title?: string;
    showValues?: boolean;
    centerRadius?: number;
}

export const AnimatedRadialChart: React.FC<AnimatedRadialChartProps> = ({
    data,
    size: sizeProp,
    strokeWidth = 20,
    animationDuration = 1200,
    title,
    showValues = true,
    centerRadius = 40,
}) => {
    const { theme } = useTheme();
    const { width: screenWidth } = useWindowDimensions();
    const size = useMemo(
        () => sizeProp ?? Math.min(screenWidth - 80, 300),
        [screenWidth, sizeProp],
    );
    const center = size / 2;
    const animatedValues = data.map(() => useSharedValue(0));

    useEffect(() => {
        animatedValues.forEach((animatedValue, index) => {
            animatedValue.value = withDelay(
                index * 200,
                withTiming(1, {
                    duration: animationDuration,
                    easing: Easing.out(Easing.back(1.2)),
                })
            );
        });
    }, [data]);

    const getColor = (index: number): string => {
        if (data[index].color) return data[index].color!;

        const colors = [
            theme.PURPLE,
            theme.LIGHT_PURPLE,
            theme.SUCCESS,
            theme.WARNING,
            theme.INCOME_PIE,
            theme.EXPENSE_PIE,
        ];
        return colors[index % colors.length];
    };

    const getRadius = (index: number): number => {
        const baseRadius = centerRadius + 10;
        return baseRadius + index * (strokeWidth + 10);
    };

    const getCircumference = (index: number): number => {
        return 2 * Math.PI * getRadius(index);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.BACKGROUND_LIGHT }]}>
            {title && (
                <Text style={[styles.title, { color: theme.TEXT }]}>{title}</Text>
            )}

            <View style={styles.chartContainer}>
                <Svg width={size} height={size}>
                    <Defs>
                        {data.map((_, index) => (
                            <LinearGradient
                                key={`radial-gradient-${index}`}
                                id={`radial-gradient-${index}`}
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="0%"
                            >
                                <Stop offset="0%" stopColor={getColor(index)} stopOpacity="0.3" />
                                <Stop offset="100%" stopColor={getColor(index)} stopOpacity="1" />
                            </LinearGradient>
                        ))}
                    </Defs>

                    <G rotation="-90" originX={center} originY={center}>
                        {data.map((item, index) => {
                            const radius = getRadius(index);
                            const circumference = getCircumference(index);
                            const percentage = item.value / item.maxValue;

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

                            const animatedTextProps = useAnimatedProps(() => {
                                const progress = animatedValues[index].value;
                                const animatedValue = interpolate(progress, [0, 1], [0, item.value]);

                                return {
                                    text: Math.round(animatedValue).toString(),
                                    opacity: progress,
                                };
                            });

                            // Calculate label position
                            const labelRadius = radius + strokeWidth + 20;
                            const labelX = center + Math.cos(0) * labelRadius;
                            const labelY = center;

                            return (
                                <React.Fragment key={`radial-${index}`}>
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

                                    {/* Progress circle */}
                                    <AnimatedCircle
                                        cx={center}
                                        cy={center}
                                        r={radius}
                                        stroke={`url(#radial-gradient-${index})`}
                                        strokeWidth={strokeWidth}
                                        fill="none"
                                        strokeLinecap="round"
                                        animatedProps={animatedProps}
                                    />
                                </React.Fragment>
                            );
                        })}
                    </G>

                    {/* Center content */}
                    <Circle
                        cx={center}
                        cy={center}
                        r={centerRadius}
                        fill={theme.BACKGROUND}
                        stroke={theme.BORDER_COLOR}
                        strokeWidth={2}
                    />

                    <SvgText
                        x={center}
                        y={center - 10}
                        fontSize="14"
                        fill={theme.TEXT}
                        textAnchor="middle"
                        fontWeight="bold"
                    >
                        Progress
                    </SvgText>

                    <SvgText
                        x={center}
                        y={center + 10}
                        fontSize="12"
                        fill={theme.LIGHT_TEXT}
                        textAnchor="middle"
                    >
                        Overview
                    </SvgText>

                    {/* Value labels */}
                    {showValues && data.map((item, index) => {
                        const radius = getRadius(index);
                        const angle = (item.value / item.maxValue) * 2 * Math.PI - Math.PI / 2;
                        const labelX = center + Math.cos(angle) * (radius + strokeWidth / 2 + 15);
                        const labelY = center + Math.sin(angle) * (radius + strokeWidth / 2 + 15);

                        const animatedTextProps = useAnimatedProps(() => {
                            const progress = animatedValues[index].value;
                            const animatedValue = interpolate(progress, [0, 1], [0, item.value]);

                            return {
                                opacity: progress,
                            };
                        });

                        return item.value > 0 ? (
                            <AnimatedText
                                key={`value-${index}`}
                                x={labelX}
                                y={labelY}
                                fontSize="11"
                                fill={getColor(index)}
                                textAnchor="middle"
                                fontWeight="bold"
                                animatedProps={animatedTextProps}
                            >
                                {`${Math.round((item.value / item.maxValue) * 100)}%`}
                            </AnimatedText>
                        ) : null;
                    })}
                </Svg>

                {/* Legend */}
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
                                {item.label}
                            </Text>
                            <Text style={[styles.legendValue, { color: theme.LIGHT_TEXT }]}>
                                {item.value}/{item.maxValue}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        borderRadius: 20,
        margin: 8,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.04)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 6,
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
        justifyContent: 'space-between',
    },
    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    legendText: {
        fontSize: 14,
        flex: 1,
    },
    legendValue: {
        fontSize: 12,
        fontWeight: '600',
    },
});