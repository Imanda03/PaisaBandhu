import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Rect, Text } from 'react-native-svg';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withTiming,
    Easing,
    interpolate,
} from 'react-native-reanimated';
import { useTheme } from '../../utils/colors';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface LineChartData {
    x: number;
    y: number;
    label?: string;
}

interface AnimatedLineChartProps {
    data: LineChartData[];
    width?: number;
    height?: number;
    showDots?: boolean;
    showGrid?: boolean;
    animationDuration?: number;
    title?: string;
    strokeWidth?: number;
    gradientFill?: boolean;
}

export const AnimatedLineChart: React.FC<AnimatedLineChartProps> = ({
    data,
    width = 350,
    height = 250,
    showDots = true,
    showGrid = true,
    animationDuration = 1500,
    title,
    strokeWidth = 3,
    gradientFill = true,
}) => {
    const { theme } = useTheme();
    const progress = useSharedValue(0);

    const padding: any = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const minX = Math.min(...data.map(d => d.x));
    const maxX = Math.max(...data.map(d => d.x));
    const minY = Math.min(...data.map(d => d.y));
    const maxY = Math.max(...data.map(d => d.y));

    useEffect(() => {
        progress.value = withTiming(1, {
            duration: animationDuration,
            easing: Easing.out(Easing.quad),
        });
    }, [data]);

    const getScaledPoint = (point: LineChartData) => {
        const x = padding + ((point.x - minX) / (maxX - minX)) * chartWidth;
        const y = padding + chartHeight - ((point.y - minY) / (maxY - minY)) * chartHeight;
        return { x, y };
    };

    const createPath = () => {
        if (data.length === 0) return '';

        const scaledPoints = data.map(getScaledPoint);
        let path = `M${scaledPoints[0].x},${scaledPoints[0].y}`;

        for (let i = 1; i < scaledPoints.length; i++) {
            const current = scaledPoints[i];
            const previous = scaledPoints[i - 1];

            // Create smooth curve using quadratic bezier
            const controlX = (previous.x + current.x) / 2;
            path += ` Q${controlX},${previous.y} ${current.x},${current.y}`;
        }

        return path;
    };

    const createAreaPath = () => {
        if (data.length === 0) return '';

        const linePath = createPath();
        const scaledPoints = data.map(getScaledPoint);
        const lastPoint = scaledPoints[scaledPoints.length - 1];
        const firstPoint = scaledPoints[0];

        return `${linePath} L${lastPoint.x},${height - padding} L${firstPoint.x},${height - padding} Z`;
    };

    const animatedLineProps = useAnimatedProps(() => {
        const pathLength = 1000; // Approximate path length
        const strokeDasharray = pathLength;
        const strokeDashoffset = interpolate(progress.value, [0, 1], [pathLength, 0]);

        return {
            strokeDasharray,
            strokeDashoffset,
        };
    });

    const animatedAreaProps = useAnimatedProps(() => {
        return {
            opacity: interpolate(progress.value, [0, 0.5, 1], [0, 0.3, 0.2]),
        };
    });

    return (
        <View style={[styles.container, { backgroundColor: theme.BACKGROUND }]}>
            {/* {title && (
                <Text style={[styles.title, { color: theme.TEXT }]}>{title}</Text>
            )} */}

            <Svg width={width} height={height}>
                <Defs>
                    <LinearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor={theme.PURPLE} stopOpacity="1" />
                        <Stop offset="50%" stopColor={theme.LIGHT_PURPLE} stopOpacity="1" />
                        <Stop offset="100%" stopColor={theme.SUCCESS} stopOpacity="1" />
                    </LinearGradient>

                    <LinearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <Stop offset="0%" stopColor={theme.PURPLE} stopOpacity="0.3" />
                        <Stop offset="100%" stopColor={theme.PURPLE} stopOpacity="0" />
                    </LinearGradient>
                </Defs>

                {/* Grid */}
                {showGrid && (
                    <>
                        {/* Horizontal grid lines */}
                        {[0, 0.25, 0.5, 0.75, 1].map((percentage, index) => (
                            <React.Fragment key={`h-grid-${index}`}>
                                <Rect
                                    x={padding}
                                    y={padding + chartHeight * percentage}
                                    width={chartWidth}
                                    height={1}
                                    fill={theme.BORDER_COLOR}
                                    opacity={0.2}
                                />
                                <Text
                                    x={padding - 10}
                                    y={padding + chartHeight * percentage + 4}
                                    fontSize="10"
                                    fill={theme.LIGHT_TEXT}
                                    textAnchor="end"
                                >
                                    {Math.round(maxY - (maxY - minY) * percentage)}
                                </Text>
                            </React.Fragment>
                        ))}

                        {/* Vertical grid lines */}
                        {data.map((point, index) => {
                            if (index % Math.ceil(data.length / 5) !== 0) return null;
                            const scaledPoint = getScaledPoint(point);
                            return (
                                <React.Fragment key={`v-grid-${index}`}>
                                    <Rect
                                        x={scaledPoint.x}
                                        y={padding}
                                        width={1}
                                        height={chartHeight}
                                        fill={theme.BORDER_COLOR}
                                        opacity={0.2}
                                    />
                                    <Text
                                        x={scaledPoint.x}
                                        y={height - padding + 15}
                                        fontSize="10"
                                        fill={theme.LIGHT_TEXT}
                                        textAnchor="middle"
                                    >
                                        {point.label || point.x}
                                    </Text>
                                </React.Fragment>
                            );
                        })}
                    </>
                )}

                {/* Area fill */}
                {gradientFill && (
                    <AnimatedPath
                        d={createAreaPath()}
                        fill="url(#areaGradient)"
                        animatedProps={animatedAreaProps}
                    />
                )}

                {/* Line */}
                <AnimatedPath
                    d={createPath()}
                    stroke="url(#lineGradient)"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    animatedProps={animatedLineProps}
                />

                {/* Data points */}
                {showDots && data.map((point, index) => {
                    const scaledPoint = getScaledPoint(point);

                    const animatedCircleProps = useAnimatedProps(() => {
                        const delay = (index / data.length) * 0.5;
                        const circleProgress = interpolate(
                            progress.value,
                            [delay, delay + 0.3],
                            [0, 1],
                            'clamp'
                        );

                        return {
                            r: interpolate(circleProgress, [0, 1], [0, 6]),
                            opacity: circleProgress,
                        };
                    });

                    return (
                        <React.Fragment key={`dot-${index}`}>
                            <AnimatedCircle
                                cx={scaledPoint.x}
                                cy={scaledPoint.y}
                                fill={theme.BACKGROUND}
                                stroke={theme.PURPLE}
                                strokeWidth={2}
                                animatedProps={animatedCircleProps}
                            />
                            <AnimatedCircle
                                cx={scaledPoint.x}
                                cy={scaledPoint.y}
                                fill={theme.PURPLE}
                                animatedProps={useAnimatedProps(() => {
                                    const delay = (index / data.length) * 0.5;
                                    const circleProgress = interpolate(
                                        progress.value,
                                        [delay, delay + 0.3],
                                        [0, 1],
                                        'clamp'
                                    );

                                    return {
                                        r: interpolate(circleProgress, [0, 1], [0, 3]),
                                        opacity: circleProgress,
                                    };
                                })}
                            />
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