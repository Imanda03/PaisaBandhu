import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withTiming,
    withDelay,
    Easing,
} from 'react-native-reanimated';
import { useTheme } from '../../utils/colors';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

export interface BarChartData {
    label: string;
    value: number;
    color?: string;
}

interface AnimatedBarChartProps {
    data: BarChartData[];
    width?: number;
    height?: number;
    showValues?: boolean;
    animationDuration?: number;
    title?: string;
}

export const AnimatedBarChart: React.FC<AnimatedBarChartProps> = ({
    data,
    width = 350,
    height = 250,
    showValues = true,
    animationDuration = 1000,
    title,
}) => {
    const { theme } = useTheme();
    
    if (!data || data.length === 0) {
        return (
            <View style={[styles.container, { backgroundColor: theme.BACKGROUND }]}>
                {title && (
                    <Text style={[styles.title, { color: theme.TEXT }]}>{title}</Text>
                )}
                <View style={{ padding: 40, alignItems: 'center' }}>
                    <Text style={{ color: theme.TEXT, opacity: 0.6 }}>No data available</Text>
                </View>
            </View>
        );
    }
    
    const maxValue = Math.max(...data.map(item => item.value), 1);
    const barWidth = Math.max((width - 60) / data.length - 10, 20);
    const chartHeight = height - 80;

    const animatedValues = data.map(() => useSharedValue(0));

    useEffect(() => {
        animatedValues.forEach((animatedValue, index) => {
            animatedValue.value = withDelay(
                index * 100,
                withTiming(data[index].value, {
                    duration: animationDuration,
                    easing: Easing.out(Easing.quad),
                })
            );
        });
    }, [data]);

    const getBarColor = (index: number): string => {
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

    return (
        <View style={[styles.container, { backgroundColor: theme.BACKGROUND }]}>
            {title && (
                <Text style={[styles.title, { color: theme.TEXT }]}>{title}</Text>
            )}

            <Svg width={width} height={height}>
                <Defs>
                    {data.map((_, index) => (
                        <LinearGradient
                            key={`gradient-${index}`}
                            id={`gradient-${index}`}
                            x1="0%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                        >
                            <Stop offset="0%" stopColor={getBarColor(index)} stopOpacity="1" />
                            <Stop offset="100%" stopColor={getBarColor(index)} stopOpacity="0.6" />
                        </LinearGradient>
                    ))}
                </Defs>

                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((percentage, index) => (
                    <React.Fragment key={`grid-${index}`}>
                        <Rect
                            x={40}
                            y={40 + chartHeight * percentage}
                            width={width - 80}
                            height={1}
                            fill={theme.BORDER_COLOR}
                            opacity={0.3}
                        />
                        <SvgText
                            x={35}
                            y={45 + chartHeight * percentage}
                            fontSize="10"
                            fill={theme.LIGHT_TEXT}
                            textAnchor="end"
                        >
                            {Math.round(maxValue * (1 - percentage))}
                        </SvgText>
                    </React.Fragment>
                ))}

                {/* Bars */}
                {data.map((item, index) => {
                    const animatedProps = useAnimatedProps(() => {
                        const barHeight = (animatedValues[index].value / maxValue) * chartHeight;
                        return {
                            height: barHeight,
                            y: height - 40 - barHeight,
                        };
                    });

                    const x = 50 + index * (barWidth + 10);

                    return (
                        <React.Fragment key={`bar-${index}`}>
                            <AnimatedRect
                                x={x}
                                width={barWidth}
                                fill={`url(#gradient-${index})`}
                                rx={4}
                                animatedProps={animatedProps}
                            />

                            {/* Labels */}
                            <SvgText
                                x={x + barWidth / 2}
                                y={height - 20}
                                fontSize="10"
                                fill={theme.TEXT}
                                textAnchor="middle"
                            >
                                {item.label}
                            </SvgText>

                            {/* Values */}
                            {showValues && (
                                <SvgText
                                    x={x + barWidth / 2}
                                    y={height - 50}
                                    fontSize="12"
                                    fill={theme.TEXT}
                                    textAnchor="middle"
                                    fontWeight="bold"
                                >
                                    {item.value}
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
        // padding: 16,
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