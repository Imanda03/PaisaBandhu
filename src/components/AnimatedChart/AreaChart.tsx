import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Rect, Text as SvgText } from 'react-native-svg';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withTiming,
    Easing,
    interpolate,
} from 'react-native-reanimated';
import { useTheme } from '../../utils/colors';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export interface AreaChartData {
    x: number;
    y: number;
    label?: string;
}

interface AnimatedAreaChartProps {
    data: AreaChartData[];
    width?: number;
    height?: number;
    showGrid?: boolean;
    animationDuration?: number;
    title?: string;
    strokeWidth?: number;
    gradientColors?: [string, string];
}

export const AnimatedAreaChart: React.FC<AnimatedAreaChartProps> = ({
    data,
    width: widthProp,
    height: heightProp,
    showGrid = true,
    animationDuration = 1500,
    title,
    strokeWidth = 3,
    gradientColors,
}) => {
    const { theme } = useTheme();
    const { width: screenWidth } = useWindowDimensions();
    const chartDimensions = useMemo(() => {
        const w = widthProp ?? Math.max(screenWidth - 48, 280);
        const h = heightProp ?? Math.min(280, w * 0.75);
        return { width: w, height: h };
    }, [screenWidth, widthProp, heightProp]);
    const width = chartDimensions.width;
    const height = chartDimensions.height;
    const progress = useSharedValue(0);

    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const minX = Math.min(...data.map(d => d.x));
    const maxX = Math.max(...data.map(d => d.x));
    const minY = Math.min(...data.map(d => d.y), 0);
    const maxY = Math.max(...data.map(d => d.y));

    const colors = gradientColors || [theme.PURPLE, theme.LIGHT_PURPLE];

    useEffect(() => {
        progress.value = withTiming(1, {
            duration: animationDuration,
            easing: Easing.out(Easing.cubic),
        });
    }, [data]);

    const getScaledPoint = (point: AreaChartData) => {
        const x = padding + ((point.x - minX) / (maxX - minX)) * chartWidth;
        const y = padding + chartHeight - ((point.y - minY) / (maxY - minY)) * chartHeight;
        return { x, y };
    };

    const createAreaPath = () => {
        if (data.length === 0) return '';

        const scaledPoints = data.map(getScaledPoint);
        const baselineY = padding + chartHeight - ((0 - minY) / (maxY - minY)) * chartHeight;

        let path = `M${scaledPoints[0].x},${baselineY}`;
        path += ` L${scaledPoints[0].x},${scaledPoints[0].y}`;

        // Create smooth curves
        for (let i = 1; i < scaledPoints.length; i++) {
            const current = scaledPoints[i];
            const previous = scaledPoints[i - 1];

            const controlX1 = previous.x + (current.x - previous.x) * 0.3;
            const controlY1 = previous.y;
            const controlX2 = current.x - (current.x - previous.x) * 0.3;
            const controlY2 = current.y;

            path += ` C${controlX1},${controlY1} ${controlX2},${controlY2} ${current.x},${current.y}`;
        }

        return path;
    };

    const animatedAreaProps = useAnimatedProps(() => {
        return {
            opacity: interpolate(progress.value, [0, 0.3, 1], [0, 0.4, 0.6]),
        };
    });

    const animatedStrokeProps = useAnimatedProps(() => {
        const pathLength = 1000;
        const strokeDasharray = pathLength;
        const strokeDashoffset = interpolate(progress.value, [0, 1], [pathLength, 0]);

        return {
            strokeDasharray,
            strokeDashoffset,
        };
    });

    return (
        <View style={[styles.container, { backgroundColor: theme.BACKGROUND_LIGHT }]}>
            {title && (
                <Text style={[styles.title, { color: theme.TEXT }]}>{title}</Text>
            )}

            <Svg width={width} height={height}>
                <Defs>
                    <LinearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <Stop offset="0%" stopColor={colors[0]} stopOpacity="0.8" />
                        <Stop offset="50%" stopColor={colors[1]} stopOpacity="0.4" />
                        <Stop offset="100%" stopColor={colors[1]} stopOpacity="0.1" />
                    </LinearGradient>

                    <LinearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor={colors[0]} stopOpacity="1" />
                        <Stop offset="100%" stopColor={colors[1]} stopOpacity="1" />
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
                                    opacity={0.3}
                                />
                                <SvgText
                                    x={padding - 10}
                                    y={padding + chartHeight * percentage + 4}
                                    fontSize="10"
                                    fill={theme.LIGHT_TEXT}
                                    textAnchor="end"
                                >
                                    {Math.round(maxY - (maxY - minY) * percentage)}
                                </SvgText>
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
                                        opacity={0.3}
                                    />
                                    <SvgText
                                        x={scaledPoint.x}
                                        y={height - padding + 15}
                                        fontSize="10"
                                        fill={theme.LIGHT_TEXT}
                                        textAnchor="middle"
                                    >
                                        {point.label || point.x}
                                    </SvgText>
                                </React.Fragment>
                            );
                        })}
                    </>
                )}

                {/* Area fill */}
                <AnimatedPath
                    d={createAreaPath()}
                    fill="url(#areaGradient)"
                    animatedProps={animatedAreaProps}
                />

                {/* Stroke */}
                <AnimatedPath
                    // d={createStrokePath()}
                    stroke="url(#strokeGradient)"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    animatedProps={animatedStrokeProps}
                />
            </Svg>
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
});