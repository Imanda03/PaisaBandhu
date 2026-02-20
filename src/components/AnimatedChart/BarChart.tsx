import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { scale, fontSize, spacing } from '../../utils/responsive';
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
    width: widthProp,
    height: heightProp,
    showValues = true,
    animationDuration = 1000,
    title,
}) => {
    const { theme } = useTheme();
    const { width: screenWidth } = useWindowDimensions();
    const chartDimensions = useMemo(() => {
        const w = widthProp ?? Math.max(screenWidth - spacing(48), scale(280));
        const h = heightProp ?? Math.min(scale(320), w * 0.75);
        return { width: w, height: h };
    }, [screenWidth, widthProp, heightProp]);
    const { width, height } = chartDimensions;

    if (!data || data.length === 0) {
        return (
            <View style={[styles.container, { backgroundColor: theme.BACKGROUND_LIGHT }]}>
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
    const barGap = scale(12);
    // Calculate spacing values outside worklets to avoid UI thread errors
    const spacing40 = spacing(40);
    const spacing35 = spacing(35);
    const spacing45 = spacing(45);
    const spacing50 = spacing(50);
    const spacing80 = spacing(80);
    const spacing20 = spacing(20);
    const barWidth = Math.max((width - spacing80) / data.length - barGap, scale(24));
    const chartHeight = height - spacing80;

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
        <View style={[styles.container, { backgroundColor: theme.BACKGROUND_LIGHT }]}>
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

                {/* Bars */}
                {data.map((item, index) => {
                    const animatedProps = useAnimatedProps(() => {
                        const barHeight = (animatedValues[index].value / maxValue) * chartHeight;
                        return {
                            height: barHeight,
                            y: height - spacing40 - barHeight,
                        };
                    });

                    const x = spacing50 + index * (barWidth + barGap);

                    return (
                        <React.Fragment key={`bar-${index}`}>
                            <AnimatedRect
                                x={x}
                                width={barWidth}
                                fill={`url(#gradient-${index})`}
                                rx={scale(6)}
                                animatedProps={animatedProps}
                            />

                            {/* Labels */}
                            <SvgText
                                x={x + barWidth / 2}
                                y={height - spacing20}
                                fontSize={fontSize(10)}
                                fill={theme.TEXT}
                                textAnchor="middle"
                            >
                                {item.label}
                            </SvgText>

                            {/* Values */}
                            {showValues && (
                                <SvgText
                                    x={x + barWidth / 2}
                                    y={height - spacing50}
                                    fontSize={fontSize(12)}
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
        padding: spacing(20),
        borderRadius: scale(20),
        margin: spacing(8),
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.04)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 6,
    },
    title: {
        fontSize: fontSize(18),
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: spacing(16),
    },
});