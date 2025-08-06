import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
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

export interface CalendarData {
    date: string; // YYYY-MM-DD format
    value: number; // 0-4 intensity levels
}

interface AnimatedCalendarHeatmapProps {
    data: CalendarData[];
    width?: number;
    height?: number;
    animationDuration?: number;
    title?: string;
    startDate?: string;
    endDate?: string;
    baseColor?: string;
}

export const AnimatedCalendarHeatmap: React.FC<AnimatedCalendarHeatmapProps> = ({
    data,
    width = 380,
    height = 200,
    animationDuration = 1000,
    title,
    startDate,
    endDate,
    baseColor,
}) => {
    const { theme } = useTheme();
    const cellSize = 12;
    const cellSpacing = 2;
    const padding = 30;

    const color = baseColor || theme.SUCCESS;

    // Create a map for quick lookup
    const dataMap = new Map(data.map(d => [d.date, d.value]));

    // Generate date range
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate) : new Date();

    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];

    // Fill the calendar grid
    const startDay = new Date(start);
    startDay.setDate(startDay.getDate() - startDay.getDay()); // Start from Sunday

    for (let d = new Date(startDay); d <= end; d.setDate(d.getDate() + 1)) {
        currentWeek.push(new Date(d));

        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    }

    if (currentWeek.length > 0) {
        weeks.push(currentWeek);
    }

    const animatedValues = weeks.flatMap(week =>
        week.map(() => useSharedValue(0))
    );

    useEffect(() => {
        let index = 0;
        weeks.forEach((week, weekIndex) => {
            week.forEach((_, dayIndex) => {
                animatedValues[index].value = withDelay(
                    (weekIndex * 7 + dayIndex) * 10,
                    withTiming(1, {
                        duration: animationDuration,
                        easing: Easing.out(Easing.quad),
                    })
                );
                index++;
            });
        });
    }, [data]);

    const getIntensityColor = (value: number): string => {
        if (value === 0) return theme.BORDER_COLOR;

        const opacity = Math.max(0.2, value / 4);
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    const formatDate = (date: Date): string => {
        return date.toISOString().split('T')[0];
    };

    const getMonthLabel = (weekIndex: number): string | null => {
        if (weekIndex === 0 || weeks[weekIndex][0].getDate() <= 7) {
            return weeks[weekIndex][0].toLocaleDateString('en-US', { month: 'short' });
        }
        return null;
    };

    const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
        <View style={[styles.container, { backgroundColor: theme.BACKGROUND }]}>
            {title && (
                <Text style={[styles.title, { color: theme.TEXT }]}>{title}</Text>
            )}

            <Svg width={width} height={height}>
                {/* Day labels */}
                {dayLabels.map((day, index) => (
                    <SvgText
                        key={`day-${index}`}
                        x={15}
                        y={padding + 15 + index * (cellSize + cellSpacing)}
                        fontSize="10"
                        fill={theme.LIGHT_TEXT}
                        textAnchor="middle"
                    >
                        {day}
                    </SvgText>
                ))}

                {/* Month labels */}
                {weeks.map((week, weekIndex) => {
                    const monthLabel = getMonthLabel(weekIndex);
                    if (!monthLabel) return null;

                    return (
                        <SvgText
                            key={`month-${weekIndex}`}
                            x={padding + weekIndex * (cellSize + cellSpacing) + cellSize / 2}
                            y={20}
                            fontSize="10"
                            fill={theme.LIGHT_TEXT}
                            textAnchor="middle"
                        >
                            {monthLabel}
                        </SvgText>
                    );
                })}

                {/* Calendar cells */}
                {weeks.map((week, weekIndex) => {
                    return week.map((date, dayIndex) => {
                        const x = padding + weekIndex * (cellSize + cellSpacing);
                        const y = padding + 10 + dayIndex * (cellSize + cellSpacing);
                        const dateStr = formatDate(date);
                        const value = dataMap.get(dateStr) || 0;
                        const animIndex = weekIndex * 7 + dayIndex;

                        const isCurrentMonth = date.getMonth() === new Date().getMonth();
                        const isFutureDate = date > new Date();

                        const animatedProps = useAnimatedProps(() => {
                            const progress = animatedValues[animIndex].value;
                            const scale = interpolate(progress, [0, 1], [0, 1]);

                            return {
                                width: cellSize * scale,
                                height: cellSize * scale,
                                x: x + (cellSize * (1 - scale)) / 2,
                                y: y + (cellSize * (1 - scale)) / 2,
                                opacity: isFutureDate ? 0.3 : progress,
                            };
                        });

                        return (
                            <AnimatedRect
                                key={`cell-${weekIndex}-${dayIndex}`}
                                fill={isFutureDate ? theme.BORDER_COLOR : getIntensityColor(value)}
                                rx={2}
                                animatedProps={animatedProps}
                            />
                        );
                    });
                })}

                {/* Legend */}
                <SvgText
                    x={15}
                    y={height - 25}
                    fontSize="10"
                    fill={theme.LIGHT_TEXT}
                >
                    Less
                </SvgText>

                {[0, 1, 2, 3, 4].map((level, index) => (
                    <Rect
                        key={`legend-${level}`}
                        x={50 + index * (cellSize + 2)}
                        y={height - 35}
                        width={cellSize}
                        height={cellSize}
                        fill={getIntensityColor(level)}
                        rx={2}
                    />
                ))}

                <SvgText
                    x={50 + 5 * (cellSize + 2) + 10}
                    y={height - 25}
                    fontSize="10"
                    fill={theme.LIGHT_TEXT}
                >
                    More
                </SvgText>

                {/* Summary stats */}
                <SvgText
                    x={width - 15}
                    y={height - 25}
                    fontSize="10"
                    fill={theme.TEXT}
                    textAnchor="end"
                    fontWeight="bold"
                >
                    Total: {data.reduce((sum, d) => sum + d.value, 0)}
                </SvgText>

                <SvgText
                    x={width - 15}
                    y={height - 10}
                    fontSize="10"
                    fill={theme.LIGHT_TEXT}
                    textAnchor="end"
                >
                    Avg: {data.length > 0 ? (data.reduce((sum, d) => sum + d.value, 0) / data.length).toFixed(1) : '0'}
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