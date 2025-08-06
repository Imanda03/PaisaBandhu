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

export interface MoodData {
    date: string;
    mood: number; // 1-5 scale (1: very sad, 5: very happy)
    note?: string;
}

interface AnimatedMoodTrackerProps {
    data: MoodData[];
    width?: number;
    height?: number;
    animationDuration?: number;
    title?: string;
    showTrend?: boolean;
}

export const AnimatedMoodTracker: React.FC<AnimatedMoodTrackerProps> = ({
    data,
    width = 350,
    height = 280,
    animationDuration = 1200,
    title,
    showTrend = true,
}) => {
    const { theme } = useTheme();
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2 - 60; // Space for mood faces

    const progress = useSharedValue(0);
    const animatedValues = data.map(() => useSharedValue(0));

    useEffect(() => {
        progress.value = withTiming(1, {
            duration: animationDuration,
            easing: Easing.out(Easing.quad),
        });

        animatedValues.forEach((animatedValue, index) => {
            animatedValue.value = withDelay(
                index * 100,
                withTiming(1, {
                    duration: animationDuration,
                    easing: Easing.out(Easing.back(1.2)),
                })
            );
        });
    }, [data]);

    const getMoodColor = (mood: number): string => {
        const colors = [
            theme.EXPENSE_PIE,    // 1: Very sad
            theme.WARNING,        // 2: Sad
            theme.INCOME_PIE,     // 3: Neutral
            theme.SUCCESS,        // 4: Happy
            theme.LIGHT_PURPLE,   // 5: Very happy
        ];
        return colors[Math.max(0, Math.min(4, mood - 1))];
    };

    const getMoodEmoji = (mood: number): string => {
        const emojis = ['😢', '😞', '😐', '😊', '😄'];
        return emojis[Math.max(0, Math.min(4, mood - 1))];
    };

    const getScaledPoint = (point: MoodData, index: number) => {
        const x = padding + (index / (data.length - 1)) * chartWidth;
        const y = padding + chartHeight - ((point.mood - 1) / 4) * chartHeight;
        return { x, y };
    };

    const createPath = () => {
        if (data.length === 0) return '';

        const scaledPoints = data.map(getScaledPoint);
        let path = `M${scaledPoints[0].x},${scaledPoints[0].y}`;

        for (let i = 1; i < scaledPoints.length; i++) {
            const current = scaledPoints[i];
            const previous = scaledPoints[i - 1];

            const controlX = (previous.x + current.x) / 2;
            path += ` Q${controlX},${previous.y} ${current.x},${current.y}`;
        }

        return path;
    };

    const animatedLineProps = useAnimatedProps(() => {
        const pathLength = 1000;
        const strokeDasharray = pathLength;
        const strokeDashoffset = interpolate(progress.value, [0, 1], [pathLength, 0]);

        return {
            strokeDasharray,
            strokeDashoffset,
        };
    });

    const averageMood = data.length > 0 ?
        data.reduce((sum, item) => sum + item.mood, 0) / data.length : 0;

    return (
        <View style={[styles.container, { backgroundColor: theme.BACKGROUND }]}>
            {title && (
                <Text style={[styles.title, { color: theme.TEXT }]}>{title}</Text>
            )}

            <Svg width={width} height={height}>
                <Defs>
                    <LinearGradient id="moodGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor={theme.EXPENSE_PIE} stopOpacity="1" />
                        <Stop offset="25%" stopColor={theme.WARNING} stopOpacity="1" />
                        <Stop offset="50%" stopColor={theme.INCOME_PIE} stopOpacity="1" />
                        <Stop offset="75%" stopColor={theme.SUCCESS} stopOpacity="1" />
                        <Stop offset="100%" stopColor={theme.LIGHT_PURPLE} stopOpacity="1" />
                    </LinearGradient>
                </Defs>

                {/* Mood level indicators */}
                {[1, 2, 3, 4, 5].map((level, index) => {
                    const y = padding + chartHeight - ((level - 1) / 4) * chartHeight;
                    return (
                        <React.Fragment key={`level-${level}`}>
                            <Path
                                d={`M${padding},${y} L${width - padding},${y}`}
                                stroke={theme.BORDER_COLOR}
                                strokeWidth={1}
                                opacity={0.2}
                                strokeDasharray="5,5"
                            />
                            <SvgText
                                x={padding - 30}
                                y={y + 4}
                                fontSize="20"
                                textAnchor="middle"
                            >
                                {getMoodEmoji(level)}
                            </SvgText>
                        </React.Fragment>
                    );
                })}

                {/* Trend line */}
                {showTrend && data.length > 1 && (
                    <AnimatedPath
                        d={createPath()}
                        stroke="url(#moodGradient)"
                        strokeWidth={3}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        animatedProps={animatedLineProps}
                    />
                )}

                {/* Data points */}
                {data.map((point, index) => {
                    const scaledPoint = getScaledPoint(point, index);

                    const animatedCircleProps = useAnimatedProps(() => {
                        const progress = animatedValues[index].value;
                        return {
                            r: interpolate(progress, [0, 1], [0, 8]),
                            opacity: progress,
                        };
                    });

                    return (
                        <React.Fragment key={`mood-${index}`}>
                            {/* Outer circle */}
                            <AnimatedCircle
                                cx={scaledPoint.x}
                                cy={scaledPoint.y}
                                fill={theme.BACKGROUND}
                                stroke={getMoodColor(point.mood)}
                                strokeWidth={3}
                                animatedProps={animatedCircleProps}
                            />

                            {/* Inner circle */}
                            <AnimatedCircle
                                cx={scaledPoint.x}
                                cy={scaledPoint.y}
                                fill={getMoodColor(point.mood)}
                                animatedProps={useAnimatedProps(() => {
                                    const progress = animatedValues[index].value;
                                    return {
                                        r: interpolate(progress, [0, 1], [0, 4]),
                                        opacity: progress,
                                    };
                                })}
                            />

                            {/* Date label */}
                            <SvgText
                                x={scaledPoint.x}
                                y={height - 40}
                                fontSize="10"
                                fill={theme.LIGHT_TEXT}
                                textAnchor="middle"
                            >
                                {point.date}
                            </SvgText>
                        </React.Fragment>
                    );
                })}

                {/* Summary stats */}
                <Polygon
                    points={`15,${height - 25} ${width - 15},${height - 25} ${width - 25},${height - 5} 25,${height - 5}`}
                    fill={theme.CARD_SHADOW}
                    opacity={0.1}
                />

                <SvgText
                    x={25}
                    y={height - 12}
                    fontSize="12"
                    fill={theme.TEXT}
                    fontWeight="bold"
                >
                    Average Mood: {getMoodEmoji(Math.round(averageMood))} {averageMood.toFixed(1)}
                </SvgText>

                <SvgText
                    x={width - 25}
                    y={height - 12}
                    fontSize="12"
                    fill={theme.LIGHT_TEXT}
                    textAnchor="end"
                >
                    {data.length} entries
                </SvgText>
            </Svg>

            {/* Mood scale legend */}
            <View style={styles.legend}>
                <Text style={[styles.legendTitle, { color: theme.TEXT }]}>Mood Scale:</Text>
                <View style={styles.legendRow}>
                    {[1, 2, 3, 4, 5].map((mood) => (
                        <View key={mood} style={styles.legendItem}>
                            <Text style={styles.moodEmoji}>{getMoodEmoji(mood)}</Text>
                            <Text style={[styles.moodNumber, { color: theme.LIGHT_TEXT }]}>{mood}</Text>
                        </View>
                    ))}
                </View>
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
        marginTop: 16,
        alignItems: 'center',
    },
    legendTitle: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 8,
    },
    legendRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    legendItem: {
        alignItems: 'center',
    },
    moodEmoji: {
        fontSize: 16,
    },
    moodNumber: {
        fontSize: 10,
        marginTop: 2,
    },
})