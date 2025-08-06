import { useTheme } from '../../../../utils/colors';
import { AnimatedBarChart, BarChartData } from '../../../../components/AnimatedChart/BarChart';
import { AnimatedLineChart, LineChartData } from '../../../../components/AnimatedChart/LineChart';
import { AnimatedDonutChart, DonutChartData } from '../../../../components/AnimatedChart/DonutChart';
import { AnimatedAreaChart, AreaChartData } from '../../../../components/AnimatedChart/AreaChart';
import { AnimatedRadialChart, RadialChartData } from '../../../../components/AnimatedChart/RadialProgrssChart';
import { ScrollView, View } from 'react-native';
import { createStyles } from './styles';
import AuthHeader from '../../../../components/core/AuthHeader';
import { AnimatedSpendingTracker, SpendingData } from '../../../../components/AnimatedChart/SpendingTrackerChart';
import { AnimatedHabitTracker, HabitTrackerData } from '../../../../components/AnimatedChart/HabitTrackingChart';
import { AnimatedMoodTracker, MoodData } from '../../../../components/AnimatedChart/MoodTrackingChart';
import { AnimatedCalendarHeatmap, CalendarData } from '../../../../components/AnimatedChart/CalendarProgressChart';
import { AnimatedFitnessChart, FitnessMetric } from '../../../../components/AnimatedChart/FitnessProgressChart';

export const WeeklyChart = () => {
    const { theme } = useTheme();
    const styles = createStyles()

    // Sample data for different charts
    const barData: BarChartData[] = [
        { label: 'Jan', value: 65 },
        { label: 'Feb', value: 78 },
        { label: 'Mar', value: 90 },
        { label: 'Apr', value: 55 },
        { label: 'May', value: 82 },
        { label: 'Jun', value: 95 },
    ];

    const lineData: LineChartData[] = [
        { x: 1, y: 20, label: 'Week 1' },
        { x: 2, y: 45, label: 'Week 2' },
        { x: 3, y: 28, label: 'Week 3' },
        { x: 4, y: 80, label: 'Week 4' },
        { x: 5, y: 65, label: 'Week 5' },
        { x: 6, y: 95, label: 'Week 6' },
        { x: 7, y: 70, label: 'Week 7' },
    ];

    const donutData: DonutChartData[] = [
        { value: 1200, label: 'Income' },
        { value: 800, label: 'Expense' },
        // { value: 600, label: 'Entertainment' },
        // { value: 400, label: 'Shopping' },
        // { value: 300, label: 'Others' },
    ];

    const areaData: AreaChartData[] = [
        { x: 1, y: 30, label: 'Q1' },
        { x: 2, y: 50, label: 'Q2' },
        { x: 3, y: 35, label: 'Q3' },
        { x: 4, y: 75, label: 'Q4' },
        { x: 5, y: 60, label: 'Q5' },
        { x: 6, y: 90, label: 'Q6' },
    ];

    const radialData: RadialChartData[] = [
        { value: 75, maxValue: 100, label: 'Savings Goal' },
        { value: 60, maxValue: 100, label: 'Budget Usage' },
        { value: 85, maxValue: 100, label: 'Investment' },
        { value: 40, maxValue: 100, label: 'Emergency Fund' },
    ];

    const spendingData: SpendingData[] = [
        { category: 'Food', spent: 450, budget: 500 },
        { category: 'Transport', spent: 120, budget: 150 },
        { category: 'Entertainment', spent: 200, budget: 180 },
        { category: 'Shopping', spent: 80, budget: 200 },
        { category: 'Utilities', spent: 300, budget: 280 },
    ];

    const habitData: HabitTrackerData[] = [
        {
            habitName: 'Exercise',
            data: Array.from({ length: 30 }, (_, i) => ({
                date: new Date(2024, 0, i + 1).toISOString().split('T')[0],
                completed: Math.random() > 0.3,
                intensity: Math.random(),
            })),
        },
        {
            habitName: 'Reading',
            data: Array.from({ length: 30 }, (_, i) => ({
                date: new Date(2024, 0, i + 1).toISOString().split('T')[0],
                completed: Math.random() > 0.4,
            })),
        },
        {
            habitName: 'Meditation',
            data: Array.from({ length: 30 }, (_, i) => ({
                date: new Date(2024, 0, i + 1).toISOString().split('T')[0],
                completed: Math.random() > 0.5,
            })),
        },
    ];

    const moodData: MoodData[] = [
        { date: '01/15', mood: 4, note: 'Great day!' },
        { date: '01/16', mood: 3, note: 'Okay' },
        { date: '01/17', mood: 5, note: 'Amazing!' },
        { date: '01/18', mood: 2, note: 'Not great' },
        { date: '01/19', mood: 4, note: 'Better' },
        { date: '01/20', mood: 3, note: 'Average' },
        { date: '01/21', mood: 5, note: 'Excellent!' },
    ];

    const calendarData: CalendarData[] = Array.from({ length: 100 }, (_, i) => ({
        date: new Date(2024, 0, i + 1).toISOString().split('T')[0],
        value: Math.floor(Math.random() * 5),
    }));

    const fitnessData: FitnessMetric[] = [
        { name: 'Steps', current: 8500, target: 10000, unit: 'steps' },
        { name: 'Water', current: 6, target: 8, unit: 'glasses' },
        { name: 'Sleep', current: 7, target: 8, unit: 'hours' },
        { name: 'Workouts', current: 4, target: 5, unit: 'sessions' },
    ];

    return (
        <View style={styles.root}>
            <AuthHeader title={`Transaction's Chart`} />
            <ScrollView
                style={[styles.container]}
                showsVerticalScrollIndicator={false}
            >
                {/* <View style={styles.chartWrapper}>
                    <AnimatedBarChart
                        data={barData}
                        title="Monthly Revenue"
                        showValues={true}
                        animationDuration={2000}
                    />
                </View> */}
                {/* 
                <View style={styles.chartWrapper}>
                    <AnimatedLineChart
                        data={lineData}
                        title="Weekly Performance"
                        showDots={true}
                        showGrid={true}
                        gradientFill={true}
                        animationDuration={1500}
                    />
                </View> */}

                <View style={styles.chartWrapper}>
                    <AnimatedDonutChart
                        data={donutData}
                        title="Expense Breakdown"
                        showLabels={true}
                        showPercentages={true}
                        centerText="Total"
                        animationDuration={1200}
                    />
                </View>

                {/* <View style={styles.chartWrapper}>
                    <AnimatedAreaChart
                        data={areaData}
                        title="Quarterly Growth"
                        showGrid={true}
                        animationDuration={1500}
                        gradientColors={[theme.PURPLE, theme.SUCCESS]}
                    />
                </View> */}
                {/* 
                <View style={styles.chartWrapper}>
                    <AnimatedRadialChart
                        data={radialData}
                        title="Financial Goals Progress"
                        showValues={true}
                        animationDuration={1200}
                    />
                </View> */}
                {/* <View style={styles.chartWrapper}>
                    <AnimatedSpendingTracker
                        data={spendingData}
                        title="Monthly Budget Tracker"
                        showPercentages={true}
                        animationDuration={1000}
                    />
                </View>  */}
                {/* <View style={styles.chartWrapper}>
                    <AnimatedHabitTracker
                        habits={habitData}
                        title="Daily Habits Tracker"
                        animationDuration={800}
                        daysToShow={30}
                    />
                </View>

                <View style={styles.chartWrapper}>
                    <AnimatedMoodTracker
                        data={moodData}
                        title="Mood Tracker"
                        showTrend={true}
                        animationDuration={1200}
                    />
                </View>
                {/* <View style={styles.chartWrapper}>
                    <AnimatedCalendarHeatmap
                        data={calendarData}
                        title="Activity Heatmap"
                        animationDuration={1000}
                        baseColor={theme.SUCCESS}
                        startDate="2024-01-01"
                        endDate="2024-04-10"
                    />
                </View> */}

                {/* <View style={styles.chartWrapper}>
                    <AnimatedFitnessChart
                        metrics={fitnessData}
                        title="Fitness Goals - Circular"
                        chartType="circular"
                        animationDuration={1200}
                    />
                </View> */}
                {/* 
                <View style={styles.chartWrapper}>
                    <AnimatedFitnessChart
                        metrics={fitnessData}
                        title="Fitness Goals - Radar"
                        chartType="radar"
                        animationDuration={1200}
                    />
                </View> */}
            </ScrollView>
        </View>
    );
};
