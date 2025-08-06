import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Text as SvgText, Circle } from 'react-native-svg';
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

export interface HabitData {
    date: string;
    completed: boolean;
    intensity?: number; // 0-1 for partial completion
}

export interface HabitTrackerData {
    habitName: string;
    data: HabitData[];
    color?: string;
}

interface AnimatedHabitTrackerProps {
    habits: HabitTrackerData[];
    width?: number;
    height?: number;
    animationDuration?: number;
    title?: string;
    daysToShow?: number;
}

export const AnimatedHabitTracker: React.FC<AnimatedHabitTrackerProps> = ({
    habits,
    width = 350,
    height = 300,
    animationDuration = 800,
    title,
    daysToShow = 30,
}) => {
    const { theme } = useTheme();
    const cellSize = 20;
    const cellSpacing = 2;
    const padding = 20;
    const labelWidth = 100;

    const animatedValues = habits.flatMap(habit =>
        habit.data.map(() => useSharedValue(0))
    );

    useEffect(() => {
        let index = 0;
        habits.forEach(habit => {
            habit.data.forEach((_, dataIndex) => {
                animatedValues[index].value = withDelay(
                    (index * 20) + (dataIndex * 10),
                    withTiming(1, {
                        duration: animationDuration,
                        easing: Easing.out(Easing.back(1.1)),
                    })
                );
                index++;
            });
        });
    }, [habits]);

    const getHabitColor = (habitIndex: number): string => {
        if (habits[habitIndex].color) return habits[habitIndex].color!;

        const colors = [
            theme.SUCCESS,
            theme.PURPLE,
            theme.LIGHT_PURPLE,
            theme.WARNING,
            theme.INCOME_PIE,
        ];
        return colors[habitIndex % colors.length];
    };

    const getCellColor = (completed: boolean, intensity: number = 1, habitColor: string): string => {
        if (!completed) return theme.BORDER_COLOR;

        const alpha = Math.max(0.3, intensity);
        return `${habitColor}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
    };

    const getStreakCount = (habitData: HabitData[]): number => {
        let streak = 0;
        for (let i = habitData.length - 1; i >= 0; i--) {
            if (habitData[i].completed) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    };

    const getCompletionRate = (habitData: HabitData[]): number => {
        const completed = habitData.filter(d => d.completed).length;
        return Math.round((completed / habitData.length) * 100);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.BACKGROUND }]}>
            {title && (
                <Text style={[styles.title, { color: theme.TEXT }]}>{title}</Text>
            )}

            <Svg width={width} height={height}>
                {habits.map((habit, habitIndex) => {
                    const y = padding + habitIndex * (cellSize + cellSpacing + 25);
                    let animIndex = habitIndex * habit.data.length;

                    return (
                        <React.Fragment key={`habit-${habitIndex}`}>
                            {/* Habit name */}
                            <SvgText
                                x={15}
                                y={y + 15}
                                fontSize="14"
                                fill={theme.TEXT}
                                fontWeight="bold"
                            >
                                {habit.habitName}
                            </SvgText>

                            {/* Stats */}
                            <SvgText
                                x={15}
                                y={y + 30}
                                fontSize="10"
                                fill={theme.LIGHT_TEXT}
                            >
                                {getCompletionRate(habit.data)}% • {getStreakCount(habit.data)} day streak
                            </SvgText>

                            {/* Habit cells */}
                            {habit.data.slice(0, daysToShow).map((day, dayIndex) => {
                                const x = labelWidth + dayIndex * (cellSize + cellSpacing);
                                const habitColor = getHabitColor(habitIndex);

                                const animatedProps = useAnimatedProps(() => {
                                    const progress = animatedValues[animIndex + dayIndex].value;
                                    const scale = interpolate(progress, [0, 1], [0, 1]);

                                    return {
                                        width: cellSize * scale,
                                        height: cellSize * scale,
                                        x: x + (cellSize * (1 - scale)) / 2,
                                        y: y + 35 + (cellSize * (1 - scale)) / 2,
                                        opacity: progress,
                                    };
                                });

                                return (
                                    <React.Fragment key={`cell-${habitIndex}-${dayIndex}`}>
                                        {/* Background cell */}
                                        <Rect
                                            x={x}
                                            y={y + 35}
                                            width={cellSize}
                                            height={cellSize}
                                            fill={theme.BORDER_COLOR}
                                            rx={3}
                                            opacity={0.2}
                                        />

                                        {/* Progress cell */}
                                        {day.completed && (
                                            <AnimatedRect
                                                fill={getCellColor(day.completed, day.intensity, habitColor)}
                                                rx={3}
                                                animatedProps={animatedProps}
                                            />
                                        )}

                                        {/* Intensity indicator for partial completion */}
                                        {day.completed && day.intensity && day.intensity < 1 && (
                                            <AnimatedCircle
                                                cx={x + cellSize / 2}
                                                cy={y + 35 + cellSize / 2}
                                                r={3}
                                                fill={habitColor}
                                                animatedProps={useAnimatedProps(() => {
                                                    const progress = animatedValues[animIndex + dayIndex].value;
                                                    return {
                                                        opacity: progress * 0.8,
                                                        r: interpolate(progress, [0, 1], [0, 3]),
                                                    };
                                                })}
                                            />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </React.Fragment>
                    );
                })}

                {/* Legend */}
                <SvgText
                    x={15}
                    y={height - 40}
                    fontSize="12"
                    fill={theme.LIGHT_TEXT}
                >
                    Legend:
                </SvgText>

                <Rect
                    x={70}
                    y={height - 50}
                    width={cellSize}
                    height={cellSize}
                    fill={theme.BORDER_COLOR}
                    rx={3}
                    opacity={0.2}
                />
                <SvgText
                    x={95}
                    y={height - 35}
                    fontSize="10"
                    fill={theme.LIGHT_TEXT}
                >
                    Not Done
                </SvgText>

                <Rect
                    x={160}
                    y={height - 50}
                    width={cellSize}
                    height={cellSize}
                    fill={theme.SUCCESS}
                    rx={3}
                />
                <SvgText
                    x={185}
                    y={height - 35}
                    fontSize="10"
                    fill={theme.LIGHT_TEXT}
                >
                    Completed
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