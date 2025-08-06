import { View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native'
import React, { useMemo, useState, useEffect } from 'react'
import { createStyles } from './styles'
import AuthHeader from '../../../../components/core/AuthHeader'
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    withDelay,
    interpolate,
    Extrapolate,
    runOnJS,
    useDerivedValue,
    withRepeat,
    withSequence,
} from 'react-native-reanimated'
import Svg, {
    Path,
    Circle,
    Rect,
    Text as SvgText,
    Defs,
    LinearGradient,
    Stop,
    Line,
    G,
    RadialGradient,
    ClipPath,
    Ellipse,
    Polygon
} from 'react-native-svg'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

const formatCurrency = (num: number) => {
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
    return num.toString()
}

const WeeklyChart = () => {
    const styles = createStyles()
    const [activeChart, setActiveChart] = useState(0)
    const [activeView, setActiveView] = useState('weekly') // 'weekly', 'daily', 'friends'

    // Animation values
    const chartProgress = useSharedValue(0)
    const cardScale = useSharedValue(0)
    const slideX = useSharedValue(screenWidth)
    const pulseAnimation = useSharedValue(0)
    const glowAnimation = useSharedValue(0)
    const rippleAnimation = useSharedValue(0)
    const floatAnimation = useSharedValue(0)
    const sparkleAnimation = useSharedValue(0)

    // Sample data for different views
    const weeklyData = [
        { total: 956, date: '2025-07-25', type: 'expense', category: 'Food' },
        { total: 45000, date: '2025-07-25', type: 'income', category: 'Salary' },
        { total: 5885, date: '2025-07-27', type: 'expense', category: 'Shopping' },
        { total: 12000, date: '2025-07-27', type: 'income', category: 'Freelance' },
        { total: 3000, date: '2025-07-29', type: 'expense', category: 'Transport' },
        { total: 25000, date: '2025-07-29', type: 'income', category: 'Investment' },
        { total: 4000, date: '2025-08-01', type: 'expense', category: 'Bills' },
        { total: 32000, date: '2025-08-01', type: 'income', category: 'Business' },
    ]

    const dailyData = [
        { total: 200, time: '06:00', type: 'expense', category: 'Coffee', mood: 'great' },
        { total: 500, time: '08:00', type: 'income', category: 'Morning Sales', mood: 'excellent' },
        { total: 1200, time: '12:00', type: 'expense', category: 'Lunch', mood: 'good' },
        { total: 2500, time: '14:00', type: 'income', category: 'Client Payment', mood: 'excellent' },
        { total: 800, time: '18:00', type: 'expense', category: 'Dinner', mood: 'good' },
        { total: 3000, time: '20:00', type: 'income', category: 'Freelance', mood: 'great' },
        { total: 300, time: '22:00', type: 'expense', category: 'Entertainment', mood: 'excellent' },
        { total: 150, time: '23:30', type: 'expense', category: 'Late Snack', mood: 'okay' },
    ]

    const friendsData = [
        { name: 'John', income: 15000, expense: 8000, avatar: '👨‍💼', savings: 7000, efficiency: 0.88 },
        { name: 'Sarah', income: 22000, expense: 12000, avatar: '👩‍💻', savings: 10000, efficiency: 0.91 },
        { name: 'Mike', income: 18000, expense: 9500, avatar: '👨‍🎨', savings: 8500, efficiency: 0.85 },
        { name: 'Lisa', income: 25000, expense: 15000, avatar: '👩‍🚀', savings: 10000, efficiency: 0.75 },
        { name: 'Tom', income: 12000, expense: 7000, avatar: '👨‍🔬', savings: 5000, efficiency: 0.83 },
        { name: 'Emma', income: 30000, expense: 18000, avatar: '👩‍⚕️', savings: 12000, efficiency: 0.80 },
        { name: 'Alex', income: 16000, expense: 9000, avatar: '👨‍🎭', savings: 7000, efficiency: 0.87 },
        { name: 'Maya', income: 28000, expense: 16000, avatar: '👩‍🎨', savings: 12000, efficiency: 0.86 },
    ]

    const getCurrentData = () => {
        switch (activeView) {
            case 'daily': return dailyData
            case 'friends': return friendsData
            default: return weeklyData
        }
    }

    const { expenseData, incomeData, dates, totalIncome, totalExpense, maxValue, additionalData } = useMemo(() => {
        const currentData = getCurrentData()

        if (activeView === 'friends') {
            return {
                expenseData: currentData.map((item: any) => item.expense),
                incomeData: currentData.map((item: any) => item.income),
                dates: currentData.map((item: any) => item.name),
                totalIncome: currentData.reduce((sum: any, item: any) => sum + item.income, 0),
                totalExpense: currentData.reduce((sum: any, item: any) => sum + item.expense, 0),
                maxValue: Math.max(...currentData.map((item: any) => Math.max(item.income, item.expense))),
                additionalData: currentData.map((item: any) => ({
                    savings: item.savings,
                    efficiency: item.efficiency,
                    avatar: item.avatar
                }))
            }
        }

        const uniqueDates = Array.from(new Set(currentData.map((item: any) =>
            activeView === 'daily' ? item.time : item.date
        ))).sort()

        const expenseMap: Record<string, number> = {}
        const incomeMap: Record<string, number> = {}
        const moodMap: Record<string, string> = {}
        let totalInc = 0
        let totalExp = 0

        currentData.forEach(({ total, date, time, type, mood }: any) => {
            const key = activeView === 'daily' ? time : date
            if (type === 'expense') {
                expenseMap[key] = (expenseMap[key] || 0) + total
                totalExp += total
            } else if (type === 'income') {
                incomeMap[key] = (incomeMap[key] || 0) + total
                totalInc += total
            }
            if (mood && activeView === 'daily') {
                moodMap[key] = mood
            }
        })

        const expenseValues = uniqueDates.map(date => expenseMap[date] || 0)
        const incomeValues = uniqueDates.map(date => incomeMap[date] || 0)
        const maxVal = Math.max(...expenseValues, ...incomeValues)

        return {
            expenseData: expenseValues,
            incomeData: incomeValues,
            dates: uniqueDates,
            totalIncome: totalInc,
            totalExpense: totalExp,
            maxValue: maxVal,
            additionalData: activeView === 'daily' ? uniqueDates.map(date => ({ mood: moodMap[date] || 'good' })) : []
        }
    }, [activeView])

    // Initialize animations
    useEffect(() => {
        // Reset and start animations when chart changes
        chartProgress.value = 0
        cardScale.value = 0
        slideX.value = screenWidth
        rippleAnimation.value = 0

        // Start entrance animations with staggered timing
        chartProgress.value = withDelay(400, withSpring(1, { damping: 18, stiffness: 120 }))
        cardScale.value = withDelay(100, withSpring(1, { damping: 15, stiffness: 140 }))
        slideX.value = withDelay(250, withSpring(0, { damping: 22, stiffness: 100 }))

        // Continuous animations
        pulseAnimation.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 2500 }),
                withTiming(0, { duration: 2500 })
            ),
            -1,
            true
        )

        glowAnimation.value = withRepeat(
            withTiming(1, { duration: 4000 }),
            -1,
            true
        )

        rippleAnimation.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 3000 }),
                withTiming(0, { duration: 1000 })
            ),
            -1,
            false
        )

        floatAnimation.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 3500 }),
                withTiming(-1, { duration: 3500 })
            ),
            -1,
            true
        )

        sparkleAnimation.value = withRepeat(
            withTiming(1, { duration: 2000 }),
            -1,
            true
        )
    }, [activeChart, activeView])

    const chartTitles = [
        'Liquid Wave Flow',
        'Hologram Gradient',
        'Floating Crystal Bars',
        'Morphing Galaxy Pie',
        'Quantum Pulse Progress',
        'Ethereal Wave Stack',
        'Particle Storm Line',
        'Radial Energy Burst',
        'Elastic Neon Comparison',
        'Prismatic View Portal',
        'Daily Mood Rhythm',
        'Friends Efficiency Radar'
    ]

    const viewTabs = [
        { key: 'weekly', title: 'Weekly', icon: '📊', color: '#6366F1' },
        { key: 'daily', title: 'Daily', icon: '📅', color: '#8B5CF6' },
        { key: 'friends', title: 'Friends', icon: '👥', color: '#EC4899' }
    ]

    // Enhanced Animated Styles
    const cardAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { scale: cardScale.value },
                { translateX: slideX.value },
                { translateY: Math.sin(floatAnimation.value * Math.PI) * 2 }
            ],
            opacity: interpolate(cardScale.value, [0, 1], [0, 1], Extrapolate.CLAMP),
            shadowOpacity: interpolate(glowAnimation.value, [0, 1], [0.15, 0.35], Extrapolate.CLAMP),
            elevation: interpolate(glowAnimation.value, [0, 1], [8, 18], Extrapolate.CLAMP)
        }
    })

    const pulseStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { scale: interpolate(pulseAnimation.value, [0, 1], [1, 1.08], Extrapolate.CLAMP) }
            ],
            opacity: interpolate(pulseAnimation.value, [0, 1], [0.85, 1], Extrapolate.CLAMP)
        }
    })

    const sparkleStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(sparkleAnimation.value, [0, 0.5, 1], [0.3, 1, 0.3], Extrapolate.CLAMP),
            transform: [
                { rotate: `${sparkleAnimation.value * 360}deg` }
            ]
        }
    })

    // Enhanced Chart Components

    const LiquidWaveChart = () => {
        const width = screenWidth - 60
        const height = 280

        const createAdvancedWavePath = (data: number[], offset: number, isIncome: boolean) => {
            if (data.length === 0) return ""

            const stepX = (width - 80) / (data.length - 1)
            let path = `M 40 ${height - 40}`

            data.forEach((value, index) => {
                const progress = chartProgress.value
                const animatedValue = value * progress
                const x = 40 + index * stepX
                const baseY = height - 40 - ((animatedValue / maxValue) * (height - 100))

                // Multi-layered wave effects
                const primaryWave = Math.sin(index * 0.8 + offset + progress * Math.PI) * 12
                const secondaryWave = Math.sin(index * 1.2 + offset * 0.7 + progress * Math.PI * 1.5) * 6
                const tertiaryWave = Math.sin(index * 2 + offset * 0.5 + progress * Math.PI * 2) * 3

                const finalY = baseY + primaryWave + secondaryWave + tertiaryWave

                if (index === 0) {
                    path += ` L ${x} ${finalY}`
                } else {
                    const prevX = 40 + (index - 1) * stepX
                    const prevValue = data[index - 1] * progress
                    const prevBaseY = height - 40 - ((prevValue / maxValue) * (height - 100))
                    const prevPrimaryWave = Math.sin((index - 1) * 0.8 + offset + progress * Math.PI) * 12
                    const prevSecondaryWave = Math.sin((index - 1) * 1.2 + offset * 0.7 + progress * Math.PI * 1.5) * 6
                    const prevTertiaryWave = Math.sin((index - 1) * 2 + offset * 0.5 + progress * Math.PI * 2) * 3
                    const prevFinalY = prevBaseY + prevPrimaryWave + prevSecondaryWave + prevTertiaryWave

                    const cpX1 = prevX + stepX * 0.3
                    const cpY1 = prevFinalY + Math.sin(progress * Math.PI + index) * 5
                    const cpX2 = x - stepX * 0.3
                    const cpY2 = finalY + Math.cos(progress * Math.PI + index) * 5

                    path += ` C ${cpX1} ${cpY1} ${cpX2} ${cpY2} ${x} ${finalY}`
                }
            })

            path += ` L ${40 + (data.length - 1) * stepX} ${height - 40} L 40 ${height - 40} Z`
            return path
        }

        return (
            <View style={{ alignItems: 'center' }}>
                <Svg width={width} height={height}>
                    <Defs>
                        <LinearGradient id="liquidIncomeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <Stop offset="0%" stopColor="#00E676" stopOpacity="0.95" />
                            <Stop offset="25%" stopColor="#4CAF50" stopOpacity="0.85" />
                            <Stop offset="50%" stopColor="#66BB6A" stopOpacity="0.75" />
                            <Stop offset="75%" stopColor="#81C784" stopOpacity="0.65" />
                            <Stop offset="100%" stopColor="#A5D6A7" stopOpacity="0.4" />
                        </LinearGradient>
                        <LinearGradient id="liquidExpenseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <Stop offset="0%" stopColor="#FF5722" stopOpacity="0.95" />
                            <Stop offset="25%" stopColor="#F44336" stopOpacity="0.85" />
                            <Stop offset="50%" stopColor="#EF5350" stopOpacity="0.75" />
                            <Stop offset="75%" stopColor="#E57373" stopOpacity="0.65" />
                            <Stop offset="100%" stopColor="#FFAB91" stopOpacity="0.4" />
                        </LinearGradient>
                        <RadialGradient id="particleGlow" cx="50%" cy="50%" r="50%">
                            <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                            <Stop offset="50%" stopColor="#ffffff" stopOpacity="0.5" />
                            <Stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                        </RadialGradient>
                    </Defs>

                    {/* Animated background grid with ripple effect */}
                    {[0, 1, 2, 3, 4].map(i => (
                        <Line
                            key={i}
                            x1={40}
                            y1={40 + i * (height - 100) / 4}
                            x2={width - 40}
                            y2={40 + i * (height - 100) / 4}
                            stroke="#E8EAF6"
                            strokeWidth="1.5"
                            strokeDasharray="12,6"
                            opacity={chartProgress.value * (0.3 + Math.sin(rippleAnimation.value * Math.PI + i) * 0.2)}
                        />
                    ))}

                    {/* Income Wave with enhanced effects */}
                    <Path
                        d={createAdvancedWavePath(incomeData, 0, true)}
                        fill="url(#liquidIncomeGrad)"
                        opacity={chartProgress.value}
                    />

                    {/* Expense Wave with enhanced effects */}
                    <Path
                        d={createAdvancedWavePath(expenseData, Math.PI, false)}
                        fill="url(#liquidExpenseGrad)"
                        opacity={chartProgress.value}
                    />

                    {/* Enhanced floating data points with particle effects */}
                    {incomeData.map((value, index) => {
                        const x = 40 + index * ((width - 80) / (incomeData.length - 1))
                        const animatedValue = value * chartProgress.value
                        const y = height - 40 - ((animatedValue / maxValue) * (height - 100))
                        const floatOffset = Math.sin(index * 0.8 + floatAnimation.value * Math.PI) * 8
                        const sparkleOffset = Math.cos(sparkleAnimation.value * Math.PI * 2 + index) * 3

                        return (
                            <G key={`income-${index}`}>
                                {/* Outer glow ring */}
                                <Circle
                                    cx={x}
                                    cy={y + floatOffset}
                                    r={15 * chartProgress.value}
                                    fill="url(#particleGlow)"
                                    opacity={0.4 * pulseAnimation.value}
                                />
                                {/* Middle glow */}
                                <Circle
                                    cx={x}
                                    cy={y + floatOffset}
                                    r={10 * chartProgress.value}
                                    fill="rgba(76, 175, 80, 0.3)"
                                    opacity={0.6}
                                />
                                {/* Core point */}
                                <Circle
                                    cx={x + sparkleOffset}
                                    cy={y + floatOffset + sparkleOffset}
                                    r={6 * chartProgress.value}
                                    fill="#4CAF50"
                                    stroke="#fff"
                                    strokeWidth="3"
                                />
                                {/* Sparkle effects */}
                                <Circle
                                    cx={x + 8}
                                    cy={y + floatOffset - 8}
                                    r={2 * sparkleAnimation.value}
                                    fill="#81C784"
                                    opacity={sparkleAnimation.value}
                                />
                            </G>
                        )
                    })}

                    {expenseData.map((value, index) => {
                        const x = 40 + index * ((width - 80) / (expenseData.length - 1))
                        const animatedValue = value * chartProgress.value
                        const y = height - 40 - ((animatedValue / maxValue) * (height - 100))
                        const floatOffset = Math.sin(index * 0.8 + floatAnimation.value * Math.PI + Math.PI) * 8
                        const sparkleOffset = Math.cos(sparkleAnimation.value * Math.PI * 2 + index + Math.PI) * 3

                        return (
                            <G key={`expense-${index}`}>
                                {/* Outer glow ring */}
                                <Circle
                                    cx={x}
                                    cy={y + floatOffset}
                                    r={15 * chartProgress.value}
                                    fill="url(#particleGlow)"
                                    opacity={0.4 * pulseAnimation.value}
                                />
                                {/* Middle glow */}
                                <Circle
                                    cx={x}
                                    cy={y + floatOffset}
                                    r={10 * chartProgress.value}
                                    fill="rgba(244, 67, 54, 0.3)"
                                    opacity={0.6}
                                />
                                {/* Core point */}
                                <Circle
                                    cx={x + sparkleOffset}
                                    cy={y + floatOffset + sparkleOffset}
                                    r={6 * chartProgress.value}
                                    fill="#F44336"
                                    stroke="#fff"
                                    strokeWidth="3"
                                />
                                {/* Sparkle effects */}
                                <Circle
                                    cx={x - 8}
                                    cy={y + floatOffset - 8}
                                    r={2 * sparkleAnimation.value}
                                    fill="#EF5350"
                                    opacity={sparkleAnimation.value}
                                />
                            </G>
                        )
                    })}

                    {/* Enhanced X-axis labels */}
                    {dates.map((date, index) => {
                        const x = 40 + index * ((width - 80) / (dates.length - 1))
                        const label = activeView === 'friends' ? date :
                            activeView === 'daily' ? date :
                                new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

                        return (
                            <G key={index}>
                                <Rect
                                    x={x - 20}
                                    y={height - 35}
                                    width={40}
                                    height={20}
                                    fill="rgba(255,255,255,0.9)"
                                    rx="10"
                                    opacity={chartProgress.value * 0.8}
                                />
                                <SvgText
                                    x={x}
                                    y={height - 22}
                                    fontSize="11"
                                    fill="#555"
                                    textAnchor="middle"
                                    fontWeight="700"
                                    opacity={chartProgress.value}
                                >
                                    {label}
                                </SvgText>
                            </G>
                        )
                    })}
                </Svg>
            </View>
        )
    }

    const DailyMoodRhythmChart = () => {
        const width = screenWidth - 60
        const height = 320
        const centerY = height / 2

        const moodColors: any = {
            excellent: '#4CAF50',
            great: '#8BC34A',
            good: '#FFC107',
            okay: '#FF9800',
            poor: '#F44336'
        }

        return (
            <View style={{ alignItems: 'center' }}>
                <Svg width={width} height={height}>
                    <Defs>
                        <LinearGradient id="dailyBg" x1="0%" y1="0%" x2="100%" y2="0%">
                            <Stop offset="0%" stopColor="#E8EAF6" stopOpacity="0.3" />
                            <Stop offset="50%" stopColor="#F3E5F5" stopOpacity="0.5" />
                            <Stop offset="100%" stopColor="#E1F5FE" stopOpacity="0.3" />
                        </LinearGradient>
                        {Object.entries(moodColors).map(([mood, color]: any) => (
                            <RadialGradient key={mood} id={`mood-${mood}`} cx="50%" cy="50%" r="50%">
                                <Stop offset="0%" stopColor={color} stopOpacity="0.8" />
                                <Stop offset="100%" stopColor={color} stopOpacity="0.3" />
                            </RadialGradient>
                        ))}
                    </Defs>

                    {/* Background */}
                    <Rect width={width} height={height} fill="url(#dailyBg)" />

                    {/* Time grid lines */}
                    {dates.map((time, index) => {
                        const x = 60 + index * ((width - 120) / (dates.length - 1))
                        return (
                            <Line
                                key={index}
                                x1={x}
                                y1={40}
                                x2={x}
                                y2={height - 40}
                                stroke="#E0E0E0"
                                strokeWidth="1"
                                strokeDasharray="4,4"
                                opacity={chartProgress.value * 0.5}
                            />
                        )
                    })}

                    {/* Income/Expense rhythm waves */}
                    {incomeData.map((value, index) => {
                        const x = 60 + index * ((width - 120) / (incomeData.length - 1))
                        const progress = chartProgress.value
                        const animatedValue = value * progress
                        const barHeight = (animatedValue / maxValue) * 100

                        const mood: any = additionalData?.[index]?.mood || 'good'
                        const moodIntensity = { excellent: 1, great: 0.8, good: 0.6, okay: 0.4, poor: 0.2 }[mood]

                        // Income wave (upper)
                        const incomeY = centerY - 20 - barHeight
                        const waveOffset = Math.sin(index * 0.5 + floatAnimation.value * Math.PI) * (10 * moodIntensity)

                        return (
                            <G key={`daily-income-${index}`}>
                                {/* Mood aura */}
                                <Circle
                                    cx={x}
                                    cy={incomeY + waveOffset}
                                    r={20 * progress * moodIntensity}
                                    fill={`url(#mood-${mood})`}
                                    opacity={0.6 * pulseAnimation.value}
                                />
                                {/* Income bar */}
                                <Rect
                                    x={x - 8}
                                    y={incomeY + waveOffset}
                                    width={16}
                                    height={barHeight}
                                    fill={moodColors[mood]}
                                    rx="8"
                                    opacity={progress}
                                />
                                {/* Value label */}
                                <SvgText
                                    x={x}
                                    y={incomeY + waveOffset - 10}
                                    fontSize="9"
                                    fill={moodColors[mood]}
                                    textAnchor="middle"
                                    fontWeight="600"
                                    opacity={progress}
                                >
                                    ${formatCurrency(value)}
                                </SvgText>
                            </G>
                        )
                    })}

                    {expenseData.map((value, index) => {
                        const x = 60 + index * ((width - 120) / (expenseData.length - 1))
                        const progress = chartProgress.value
                        const animatedValue = value * progress
                        const barHeight = (animatedValue / maxValue) * 100

                        const mood = additionalData[index]?.mood || 'good'

                        // Expense wave (lower)
                        const expenseY = centerY + 20
                        const waveOffset = Math.sin(index * 0.7 + floatAnimation.value * Math.PI + Math.PI) * 8

                        return (
                            <G key={`daily-expense-${index}`}>
                                {/* Expense bar */}
                                <Rect
                                    x={x - 8}
                                    y={expenseY + waveOffset}
                                    width={16}
                                    height={barHeight}
                                    fill="#F44336"
                                    rx="8"
                                    opacity={progress * 0.8}
                                />
                                {/* Value label */}
                                <SvgText
                                    x={x}
                                    y={expenseY + waveOffset + barHeight + 15}
                                    fontSize="9"
                                    fill="#F44336"
                                    textAnchor="middle"
                                    fontWeight="600"
                                    opacity={progress}
                                >
                                    ${formatCurrency(value)}
                                </SvgText>
                            </G>
                        )
                    })}

                    {/* Center line */}
                    <Line
                        x1={60}
                        y1={centerY}
                        x2={width - 60}
                        y2={centerY}
                        stroke="#666"
                        strokeWidth="2"
                        opacity={chartProgress.value * 0.7}
                    />

                    {/* Time labels */}
                    {dates.map((time, index) => {
                        const x = 60 + index * ((width - 120) / (dates.length - 1))
                        return (
                            <SvgText
                                key={index}
                                x={x}
                                y={height - 15}
                                fontSize="10"
                                fill="#666"
                                textAnchor="middle"
                                fontWeight="600"
                                opacity={chartProgress.value}
                            >
                                {time}
                            </SvgText>
                        )
                    })}
                </Svg>
            </View>
        )
    }

    const FriendsEfficiencyRadar = () => {
        const size = 300
        const center = size / 2
        const maxRadius = 120
        const levels = 5

        return (
            <View style={{ alignItems: 'center' }}>
                <Svg width={size} height={size}>
                    <Defs>
                        <RadialGradient id="radarBg" cx="50%" cy="50%" r="50%">
                            <Stop offset="0%" stopColor="#E3F2FD" stopOpacity="0.8" />
                            <Stop offset="50%" stopColor="#BBDEFB" stopOpacity="0.4" />
                            <Stop offset="100%" stopColor="#90CAF9" stopOpacity="0.1" />
                        </RadialGradient>
                        {friendsData.map((friend, index) => (
                            <RadialGradient key={friend.name} id={`friend-${index}`} cx="50%" cy="50%" r="50%">
                                <Stop offset="0%" stopColor={`hsl(${index * 45}, 70%, 60%)`} stopOpacity="0.9" />
                                <Stop offset="100%" stopColor={`hsl(${index * 45}, 70%, 40%)`} stopOpacity="0.3" />
                            </RadialGradient>
                        ))}
                    </Defs>

                    {/* Background */}
                    <Circle cx={center} cy={center} r={maxRadius} fill="url(#radarBg)" />

                    {/* Radar grid */}
                    {Array.from({ length: levels }, (_, i) => (
                        <Circle
                            key={i}
                            cx={center}
                            cy={center}
                            r={(maxRadius / levels) * (i + 1)}
                            fill="none"
                            stroke="#E0E0E0"
                            strokeWidth="1.5"
                            strokeDasharray="6,3"
                            opacity={chartProgress.value * 0.6}
                        />
                    ))}

                    {/* Radar spokes */}
                    {Array.from({ length: 8 }, (_, i) => {
                        const angle = (i * 360 / 8) * Math.PI / 180
                        const x = center + maxRadius * Math.cos(angle)
                        const y = center + maxRadius * Math.sin(angle)
                        return (
                            <Line
                                key={i}
                                x1={center}
                                y1={center}
                                x2={x}
                                y2={y}
                                stroke="#E0E0E0"
                                strokeWidth="1"
                                opacity={chartProgress.value * 0.4}
                            />
                        )
                    })}

                    {/* Friend efficiency points */}
                    {friendsData.map((friend, index) => {
                        const angle = (index * 360 / friendsData.length) * Math.PI / 180
                        const radius = (friend.efficiency * maxRadius) * chartProgress.value
                        const x = center + radius * Math.cos(angle)
                        const y = center + radius * Math.sin(angle)

                        const floatOffset = Math.sin(floatAnimation.value * Math.PI + index) * 3
                        const finalX = x + floatOffset
                        const finalY = y + floatOffset

                        return (
                            <G key={friend.name}>
                                {/* Efficiency glow */}
                                <Circle
                                    cx={finalX}
                                    cy={finalY}
                                    r={20 * chartProgress.value}
                                    fill={`url(#friend-${index})`}
                                    opacity={0.4 * pulseAnimation.value}
                                />
                                {/* Friend point */}
                                <Circle
                                    cx={finalX}
                                    cy={finalY}
                                    r={12 * chartProgress.value}
                                    fill={`hsl(${index * 45}, 70%, 60%)`}
                                    stroke="#fff"
                                    strokeWidth="3"
                                />
                                {/* Efficiency percentage */}
                                <SvgText
                                    x={finalX}
                                    y={finalY + 4}
                                    fontSize="8"
                                    fill="#fff"
                                    textAnchor="middle"
                                    fontWeight="700"
                                    opacity={chartProgress.value}
                                >
                                    {Math.round(friend.efficiency * 100)}%
                                </SvgText>
                                {/* Friend name */}
                                <SvgText
                                    x={finalX}
                                    y={finalY - 20}
                                    fontSize="10"
                                    fill={`hsl(${index * 45}, 70%, 40%)`}
                                    textAnchor="middle"
                                    fontWeight="600"
                                    opacity={chartProgress.value}
                                >
                                    {friend.avatar} {friend.name}
                                </SvgText>
                            </G>
                        )
                    })}

                    {/* Center efficiency indicator */}
                    <Circle
                        cx={center}
                        cy={center}
                        r={8 + Math.sin(pulseAnimation.value * Math.PI * 2) * 2}
                        fill="#2196F3"
                        opacity={chartProgress.value}
                    />
                    <SvgText
                        x={center}
                        y={center + 3}
                        fontSize="6"
                        fill="#fff"
                        textAnchor="middle"
                        fontWeight="700"
                        opacity={chartProgress.value}
                    >
                        AVG
                    </SvgText>
                </Svg>
            </View>
        )
    }

    const FloatingCrystalBars = () => {
        const width = screenWidth - 60
        const height = 320
        const barWidth = 28
        const spacing = 12

        return (
            <View style={{ alignItems: 'center' }}>
                <Svg width={width} height={height}>
                    <Defs>
                        <LinearGradient id="crystalIncomeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                            <Stop offset="0%" stopColor="#4CAF50" stopOpacity="1" />
                            <Stop offset="30%" stopColor="#66BB6A" stopOpacity="0.9" />
                            <Stop offset="60%" stopColor="#81C784" stopOpacity="0.8" />
                            <Stop offset="100%" stopColor="#C8E6C9" stopOpacity="0.6" />
                        </LinearGradient>
                        <LinearGradient id="crystalExpenseGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                            <Stop offset="0%" stopColor="#F44336" stopOpacity="1" />
                            <Stop offset="30%" stopColor="#EF5350" stopOpacity="0.9" />
                            <Stop offset="60%" stopColor="#E57373" stopOpacity="0.8" />
                            <Stop offset="100%" stopColor="#FFCDD2" stopOpacity="0.6" />
                        </LinearGradient>
                        <LinearGradient id="crystalReflection" x1="0%" y1="0%" x2="100%" y2="100%">
                            <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
                            <Stop offset="50%" stopColor="#ffffff" stopOpacity="0.2" />
                            <Stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                        </LinearGradient>
                    </Defs>

                    {/* Background particles */}
                    {Array.from({ length: 15 }, (_, i) => {
                        const x = 50 + (i * 37) % (width - 100)
                        const y = 60 + (i * 23) % (height - 120)
                        const sparkleSize = 2 + (i % 3)
                        return (
                            <Circle
                                key={i}
                                cx={x}
                                cy={y}
                                r={sparkleSize * sparkleAnimation.value}
                                fill="rgba(255,255,255,0.7)"
                                opacity={sparkleAnimation.value * 0.8}
                            />
                        )
                    })}

                    {incomeData.map((value, index) => {
                        const progress = chartProgress.value
                        const barHeight = (value / maxValue) * (height - 120) * progress
                        const totalWidth = incomeData.length * (barWidth * 2 + spacing * 2)
                        const startX = (width - totalWidth) / 2
                        const x = startX + index * (barWidth * 2 + spacing * 2)
                        const y = height - 80 - barHeight

                        // Crystal floating animation
                        const floatY = y + Math.sin(index * 0.9 + floatAnimation.value * Math.PI) * 5
                        const crystalTilt = Math.sin(sparkleAnimation.value * Math.PI + index) * 3

                        return (
                            <G key={`crystal-income-${index}`}>
                                {/* Crystal shadow */}
                                <Polygon
                                    points={`${x + 2},${floatY + barHeight + 2} ${x + barWidth + 2},${floatY + barHeight + 2} ${x + barWidth - 3 + 2},${floatY + 2} ${x + 5 + 2},${floatY + 2}`}
                                    fill="rgba(0,0,0,0.15)"
                                    opacity={progress * 0.6}
                                />
                                {/* Main crystal bar */}
                                <Polygon
                                    points={`${x},${floatY + barHeight} ${x + barWidth},${floatY + barHeight} ${x + barWidth - 3 + crystalTilt},${floatY} ${x + 5 + crystalTilt},${floatY}`}
                                    fill="url(#crystalIncomeGrad)"
                                    opacity={progress}
                                />
                                {/* Crystal reflection */}
                                <Polygon
                                    points={`${x + 3},${floatY + barHeight - 10} ${x + barWidth - 6},${floatY + barHeight - 10} ${x + barWidth - 8 + crystalTilt},${floatY + 10} ${x + 6 + crystalTilt},${floatY + 10}`}
                                    fill="url(#crystalReflection)"
                                    opacity={progress * 0.7}
                                />
                                {/* Crystal top facet */}
                                <Polygon
                                    points={`${x + 5 + crystalTilt},${floatY} ${x + barWidth - 3 + crystalTilt},${floatY} ${x + barWidth / 2 + crystalTilt},${floatY - 8}`}
                                    fill="rgba(255,255,255,0.8)"
                                    opacity={progress * 0.9}
                                />
                                {/* Glow effect */}
                                <Polygon
                                    points={`${x - 3},${floatY + barHeight + 3} ${x + barWidth + 3},${floatY + barHeight + 3} ${x + barWidth + crystalTilt},${floatY - 3} ${x + 2 + crystalTilt},${floatY - 3}`}
                                    fill="rgba(76, 175, 80, 0.2)"
                                    opacity={progress * pulseAnimation.value * 0.6}
                                />
                                {/* Value label with glow */}
                                <SvgText
                                    x={x + barWidth / 2}
                                    y={floatY - 15}
                                    fontSize="10"
                                    fill="#4CAF50"
                                    textAnchor="middle"
                                    fontWeight="800"
                                    opacity={progress}
                                    stroke="rgba(255,255,255,0.8)"
                                    strokeWidth="0.5"
                                >
                                    ${formatCurrency(value)}
                                </SvgText>
                            </G>
                        )
                    })}

                    {expenseData.map((value, index) => {
                        const progress = chartProgress.value
                        const barHeight = (value / maxValue) * (height - 120) * progress
                        const totalWidth = expenseData.length * (barWidth * 2 + spacing * 2)
                        const startX = (width - totalWidth) / 2
                        const x = startX + index * (barWidth * 2 + spacing * 2) + barWidth + spacing
                        const y = height - 80 - barHeight

                        // Crystal floating animation (opposite phase)
                        const floatY = y + Math.sin(index * 0.9 + floatAnimation.value * Math.PI + Math.PI) * 5
                        const crystalTilt = Math.sin(sparkleAnimation.value * Math.PI + index + Math.PI) * 3

                        return (
                            <G key={`crystal-expense-${index}`}>
                                {/* Crystal shadow */}
                                <Polygon
                                    points={`${x + 2},${floatY + barHeight + 2} ${x + barWidth + 2},${floatY + barHeight + 2} ${x + barWidth - 3 + 2},${floatY + 2} ${x + 5 + 2},${floatY + 2}`}
                                    fill="rgba(0,0,0,0.15)"
                                    opacity={progress * 0.6}
                                />
                                {/* Main crystal bar */}
                                <Polygon
                                    points={`${x},${floatY + barHeight} ${x + barWidth},${floatY + barHeight} ${x + barWidth - 3 + crystalTilt},${floatY} ${x + 5 + crystalTilt},${floatY}`}
                                    fill="url(#crystalExpenseGrad)"
                                    opacity={progress}
                                />
                                {/* Crystal reflection */}
                                <Polygon
                                    points={`${x + 3},${floatY + barHeight - 10} ${x + barWidth - 6},${floatY + barHeight - 10} ${x + barWidth - 8 + crystalTilt},${floatY + 10} ${x + 6 + crystalTilt},${floatY + 10}`}
                                    fill="url(#crystalReflection)"
                                    opacity={progress * 0.7}
                                />
                                {/* Crystal top facet */}
                                <Polygon
                                    points={`${x + 5 + crystalTilt},${floatY} ${x + barWidth - 3 + crystalTilt},${floatY} ${x + barWidth / 2 + crystalTilt},${floatY - 8}`}
                                    fill="rgba(255,255,255,0.8)"
                                    opacity={progress * 0.9}
                                />
                                {/* Glow effect */}
                                <Polygon
                                    points={`${x - 3},${floatY + barHeight + 3} ${x + barWidth + 3},${floatY + barHeight + 3} ${x + barWidth + crystalTilt},${floatY - 3} ${x + 2 + crystalTilt},${floatY - 3}`}
                                    fill="rgba(244, 67, 54, 0.2)"
                                    opacity={progress * pulseAnimation.value * 0.6}
                                />
                                {/* Value label with glow */}
                                <SvgText
                                    x={x + barWidth / 2}
                                    y={floatY - 15}
                                    fontSize="10"
                                    fill="#F44336"
                                    textAnchor="middle"
                                    fontWeight="800"
                                    opacity={progress}
                                    stroke="rgba(255,255,255,0.8)"
                                    strokeWidth="0.5"
                                >
                                    ${formatCurrency(value)}
                                </SvgText>
                            </G>
                        )
                    })}

                    {/* Enhanced labels with crystal frames */}
                    {dates.map((date, index) => {
                        const totalWidth = dates.length * (barWidth * 2 + spacing * 2)
                        const startX = (width - totalWidth) / 2
                        const x = startX + index * (barWidth * 2 + spacing * 2) + barWidth + spacing / 2
                        const label = activeView === 'friends' ? date :
                            activeView === 'daily' ? date :
                                new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

                        return (
                            <G key={index}>
                                <Polygon
                                    points={`${x - 25},${height - 45} ${x + 25},${height - 45} ${x + 20},${height - 25} ${x - 20},${height - 25}`}
                                    fill="rgba(255,255,255,0.95)"
                                    stroke="rgba(200,200,200,0.8)"
                                    strokeWidth="1"
                                    opacity={chartProgress.value * 0.9}
                                />
                                <SvgText
                                    x={x}
                                    y={height - 32}
                                    fontSize="11"
                                    fill="#555"
                                    textAnchor="middle"
                                    fontWeight="700"
                                    opacity={chartProgress.value}
                                >
                                    {label}
                                </SvgText>
                            </G>
                        )
                    })}
                </Svg>
            </View>
        )
    }

    const renderCurrentChart = () => {
        switch (activeChart) {
            case 0: return <LiquidWaveChart />
            case 1: return <HologramGradientChart />
            case 2: return <FloatingCrystalBars />
            case 3: return <MorphingGalaxyPie />
            case 4: return <QuantumPulseProgress />
            case 5: return <EtherealWaveStack />
            case 6: return <ParticleStormLine />
            case 7: return <RadialEnergyBurst />
            case 8: return <ElasticNeonComparison />
            case 9: return <PrismaticViewPortal />
            case 10: return activeView === 'daily' ? <DailyMoodRhythmChart /> : <LiquidWaveChart />
            case 11: return activeView === 'friends' ? <FriendsEfficiencyRadar /> : <LiquidWaveChart />
            default: return <LiquidWaveChart />
        }
    }

    const MorphingGalaxyPie = () => {
        const size = 280
        const center = size / 2
        const radius = 100
        const innerRadius = 50

        const total = totalIncome + totalExpense
        const incomeAngle = (totalIncome / total) * 360 * chartProgress.value
        const expenseAngle = (totalExpense / total) * 360 * chartProgress.value

        const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
            const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
            return {
                x: centerX + (radius * Math.cos(angleInRadians)),
                y: centerY + (radius * Math.sin(angleInRadians))
            }
        }

        const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
            const start = polarToCartesian(x, y, radius, endAngle)
            const end = polarToCartesian(x, y, radius, startAngle)
            const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

            return [
                "M", start.x, start.y,
                "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
                "L", x, y,
                "L", start.x, start.y
            ].join(" ")
        }

        return (
            <View style={{ alignItems: 'center' }}>
                <Svg width={size} height={size}>
                    <Defs>
                        <RadialGradient id="galaxyBg" cx="50%" cy="50%" r="50%">
                            <Stop offset="0%" stopColor="#0F2027" />
                            <Stop offset="50%" stopColor="#203A43" />
                            <Stop offset="100%" stopColor="#2C5364" />
                        </RadialGradient>
                        <RadialGradient id="incomeGalaxy" cx="50%" cy="50%" r="50%">
                            <Stop offset="0%" stopColor="#00c6ff" />
                            <Stop offset="100%" stopColor="#0072ff" />
                        </RadialGradient>
                        <RadialGradient id="expenseGalaxy" cx="50%" cy="50%" r="50%">
                            <Stop offset="0%" stopColor="#ff758c" />
                            <Stop offset="100%" stopColor="#ff7eb3" />
                        </RadialGradient>
                    </Defs>

                    {/* Galaxy background */}
                    <Circle cx={center} cy={center} r={radius + 10} fill="url(#galaxyBg)" />

                    {/* Stars */}
                    {Array.from({ length: 50 }).map((_, i) => {
                        const angle = Math.random() * 2 * Math.PI
                        const dist = Math.random() * radius
                        const x = center + dist * Math.cos(angle)
                        const y = center + dist * Math.sin(angle)
                        const size = 1 + Math.random() * 2
                        const opacity = 0.5 + Math.random() * 0.5

                        return (
                            <Circle
                                key={i}
                                cx={x}
                                cy={y}
                                r={size * sparkleAnimation.value}
                                fill="white"
                                opacity={opacity * sparkleAnimation.value}
                            />
                        )
                    })}

                    {/* Income segment */}
                    <Path
                        d={describeArc(center, center, radius, 0, incomeAngle)}
                        fill="url(#incomeGalaxy)"
                        opacity={chartProgress.value}
                    />

                    {/* Expense segment */}
                    <Path
                        d={describeArc(center, center, radius, incomeAngle, incomeAngle + expenseAngle)}
                        fill="url(#expenseGalaxy)"
                        opacity={chartProgress.value}
                    />

                    {/* Center hole */}
                    <Circle
                        cx={center}
                        cy={center}
                        r={innerRadius}
                        fill="#0F2027"
                        stroke="#2C5364"
                        strokeWidth="2"
                    />

                    {/* Income label */}
                    <SvgText
                        x={center}
                        y={center - 15}
                        fontSize="14"
                        fill="#00c6ff"
                        textAnchor="middle"
                        fontWeight="bold"
                        opacity={chartProgress.value}
                    >
                        ${formatCurrency(totalIncome)}
                    </SvgText>

                    {/* Expense label */}
                    <SvgText
                        x={center}
                        y={center + 15}
                        fontSize="14"
                        fill="#ff758c"
                        textAnchor="middle"
                        fontWeight="bold"
                        opacity={chartProgress.value}
                    >
                        ${formatCurrency(totalExpense)}
                    </SvgText>

                    {/* Percentage labels */}
                    <SvgText
                        x={center}
                        y={center + 40}
                        fontSize="12"
                        fill="white"
                        textAnchor="middle"
                        opacity={chartProgress.value}
                    >
                        {Math.round((totalIncome / total) * 100)}% Income
                    </SvgText>
                    <SvgText
                        x={center}
                        y={center + 55}
                        fontSize="12"
                        fill="white"
                        textAnchor="middle"
                        opacity={chartProgress.value}
                    >
                        {Math.round((totalExpense / total) * 100)}% Expense
                    </SvgText>
                </Svg>
            </View>
        )
    }

    const QuantumPulseProgress = () => {
        const width = screenWidth - 60
        const height = 200
        const barHeight = 30
        const spacing = 10

        return (
            <View style={{ alignItems: 'center' }}>
                <Svg width={width} height={height}>
                    <Defs>
                        <LinearGradient id="quantumIncome" x1="0%" y1="0%" x2="100%" y2="0%">
                            <Stop offset="0%" stopColor="#00c6ff" />
                            <Stop offset="100%" stopColor="#0072ff" />
                        </LinearGradient>
                        <LinearGradient id="quantumExpense" x1="0%" y1="0%" x2="100%" y2="0%">
                            <Stop offset="0%" stopColor="#ff758c" />
                            <Stop offset="100%" stopColor="#ff7eb3" />
                        </LinearGradient>
                    </Defs>

                    {/* Background */}
                    <Rect width={width} height={height} fill="#f8f9fa" rx="10" />

                    {/* Income progress */}
                    <Rect
                        x={20}
                        y={40}
                        width={(width - 40) * (totalIncome / (totalIncome + totalExpense)) * chartProgress.value}
                        height={barHeight}
                        fill="url(#quantumIncome)"
                        rx="15"
                        ry="15"
                    >
                        <Animated
                            attributeName="width"
                            from="0"
                            to={(width - 40) * (totalIncome / (totalIncome + totalExpense))}
                            dur="1s"
                            begin="0s"
                            fill="freeze"
                        />
                    </Rect>

                    {/* Income label */}
                    <SvgText
                        x={width - 20}
                        y={40 + barHeight / 2 + 5}
                        fontSize="12"
                        fill="#0072ff"
                        textAnchor="end"
                        fontWeight="bold"
                        opacity={chartProgress.value}
                    >
                        Income: ${formatCurrency(totalIncome)}
                    </SvgText>

                    {/* Expense progress */}
                    <Rect
                        x={20}
                        y={40 + barHeight + spacing}
                        width={(width - 40) * (totalExpense / (totalIncome + totalExpense)) * chartProgress.value}
                        height={barHeight}
                        fill="url(#quantumExpense)"
                        rx="15"
                        ry="15"
                    >
                        <Animate
                            attributeName="width"
                            from="0"
                            to={(width - 40) * (totalExpense / (totalIncome + totalExpense))}
                            dur="1s"
                            begin="0s"
                            fill="freeze"
                        />
                    </Rect>

                    {/* Expense label */}
                    <SvgText
                        x={width - 20}
                        y={40 + barHeight + spacing + barHeight / 2 + 5}
                        fontSize="12"
                        fill="#ff758c"
                        textAnchor="end"
                        fontWeight="bold"
                        opacity={chartProgress.value}
                    >
                        Expense: ${formatCurrency(totalExpense)}
                    </SvgText>

                    {/* Pulsing indicator */}
                    <Circle
                        cx={width / 2}
                        cy={height - 30}
                        r={8 + pulseAnimation.value * 4}
                        fill="#6c757d"
                        opacity={0.7}
                    />

                    {/* Total label */}
                    <SvgText
                        x={width / 2}
                        y={height - 15}
                        fontSize="14"
                        fill="#495057"
                        textAnchor="middle"
                        fontWeight="bold"
                        opacity={chartProgress.value}
                    >
                        Total: ${formatCurrency(totalIncome + totalExpense)}
                    </SvgText>
                </Svg>
            </View>
        )
    }

    const EtherealWaveStack = () => {
        const width = screenWidth - 60
        const height = 280
        const centerY = height / 2

        return (
            <View style={{ alignItems: 'center' }}>
                <Svg width={width} height={height}>
                    <Defs>
                        <LinearGradient id="etherealIncome" x1="0%" y1="0%" x2="100%" y2="0%">
                            <Stop offset="0%" stopColor="rgba(0, 198, 255, 0.7)" />
                            <Stop offset="100%" stopColor="rgba(0, 114, 255, 0.7)" />
                        </LinearGradient>
                        <LinearGradient id="etherealExpense" x1="0%" y1="0%" x2="100%" y2="0%">
                            <Stop offset="0%" stopColor="rgba(255, 117, 140, 0.7)" />
                            <Stop offset="100%" stopColor="rgba(255, 126, 179, 0.7)" />
                        </LinearGradient>
                    </Defs>

                    {/* Background grid */}
                    {[0, 1, 2, 3, 4].map(i => (
                        <Line
                            key={i}
                            x1={40}
                            y1={40 + i * (height - 80) / 4}
                            x2={width - 40}
                            y2={40 + i * (height - 80) / 4}
                            stroke="#e9ecef"
                            strokeWidth="1"
                            strokeDasharray="5,5"
                            opacity={0.5}
                        />
                    ))}

                    {/* Income wave */}
                    <Path
                        d={`
                        M 40 ${centerY}
                        ${incomeData.map((value, index) => {
                            const x = 40 + index * ((width - 80) / (incomeData.length - 1))
                            const y = centerY - ((value / maxValue) * (height - 120) * chartProgress.value)
                            const waveOffset = Math.sin(index * 0.8 + floatAnimation.value * Math.PI) * 10
                            return `L ${x} ${y + waveOffset}`
                        }).join(' ')}
                        L ${width - 40} ${centerY}
                        Z
                    `}
                        fill="url(#etherealIncome)"
                        opacity={0.8}
                    />

                    {/* Expense wave */}
                    <Path
                        d={`
                        M 40 ${centerY}
                        ${expenseData.map((value, index) => {
                            const x = 40 + index * ((width - 80) / (expenseData.length - 1))
                            const y = centerY + ((value / maxValue) * (height - 120) * chartProgress.value)
                            const waveOffset = Math.sin(index * 0.8 + floatAnimation.value * Math.PI + Math.PI) * 10
                            return `L ${x} ${y + waveOffset}`
                        }).join(' ')}
                        L ${width - 40} ${centerY}
                        Z
                    `}
                        fill="url(#etherealExpense)"
                        opacity={0.8}
                    />

                    {/* Center line */}
                    <Line
                        x1={40}
                        y1={centerY}
                        x2={width - 40}
                        y2={centerY}
                        stroke="#495057"
                        strokeWidth="1.5"
                        opacity={0.7}
                    />

                    {/* Data points */}
                    {incomeData.map((value, index) => {
                        const x = 40 + index * ((width - 80) / (incomeData.length - 1))
                        const y = centerY - ((value / maxValue) * (height - 120) * chartProgress.value)
                        const waveOffset = Math.sin(index * 0.8 + floatAnimation.value * Math.PI) * 10

                        return (
                            <Circle
                                key={`income-point-${index}`}
                                cx={x}
                                cy={y + waveOffset}
                                r={5}
                                fill="#0072ff"
                                stroke="white"
                                strokeWidth="2"
                            />
                        )
                    })}

                    {expenseData.map((value, index) => {
                        const x = 40 + index * ((width - 80) / (expenseData.length - 1))
                        const y = centerY + ((value / maxValue) * (height - 120) * chartProgress.value)
                        const waveOffset = Math.sin(index * 0.8 + floatAnimation.value * Math.PI + Math.PI) * 10

                        return (
                            <Circle
                                key={`expense-point-${index}`}
                                cx={x}
                                cy={y + waveOffset}
                                r={5}
                                fill="#ff758c"
                                stroke="white"
                                strokeWidth="2"
                            />
                        )
                    })}

                    {/* Labels */}
                    {dates.map((date, index) => {
                        const x = 40 + index * ((width - 80) / (dates.length - 1))
                        const label = activeView === 'friends' ? date :
                            activeView === 'daily' ? date :
                                new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

                        return (
                            <SvgText
                                key={index}
                                x={x}
                                y={height - 20}
                                fontSize="10"
                                fill="#495057"
                                textAnchor="middle"
                                fontWeight="600"
                            >
                                {label}
                            </SvgText>
                        )
                    })}
                </Svg>
            </View>
        )
    }

    const ParticleStormLine = () => {
        const width = screenWidth - 60
        const height = 280

        return (
            <View style={{ alignItems: 'center' }}>
                <Svg width={width} height={height}>
                    <Defs>
                        <RadialGradient id="particleGlow" cx="50%" cy="50%" r="50%">
                            <Stop offset="0%" stopColor="white" stopOpacity="0.9" />
                            <Stop offset="100%" stopColor="white" stopOpacity="0" />
                        </RadialGradient>
                    </Defs>

                    {/* Background particles */}
                    {Array.from({ length: 50 }).map((_, i) => {
                        const x = Math.random() * width
                        const y = Math.random() * height
                        const size = 1 + Math.random() * 3
                        const opacity = 0.2 + Math.random() * 0.5
                        const speed = 1 + Math.random() * 3

                        return (
                            <Circle
                                key={`particle-${i}`}
                                cx={x}
                                cy={y + (sparkleAnimation.value * speed * 20) % height}
                                r={size}
                                fill="url(#particleGlow)"
                                opacity={opacity * sparkleAnimation.value}
                            />
                        )
                    })}

                    {/* Income line */}
                    <Path
                        d={`
                        M 40 ${height - 40}
                        ${incomeData.map((value, index) => {
                            const x = 40 + index * ((width - 80) / (incomeData.length - 1))
                            const y = height - 40 - ((value / maxValue) * (height - 100) * chartProgress.value)
                            const jitter = Math.sin(index * 0.5 + sparkleAnimation.value * Math.PI * 2) * 5
                            return `L ${x} ${y + jitter}`
                        }).join(' ')}
                    `}
                        fill="none"
                        stroke="#00c6ff"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />

                    {/* Expense line */}
                    <Path
                        d={`
                        M 40 ${height - 40}
                        ${expenseData.map((value, index) => {
                            const x = 40 + index * ((width - 80) / (expenseData.length - 1))
                            const y = height - 40 - ((value / maxValue) * (height - 100) * chartProgress.value)
                            const jitter = Math.sin(index * 0.5 + sparkleAnimation.value * Math.PI * 2 + Math.PI) * 5
                            return `L ${x} ${y + jitter}`
                        }).join(' ')}
                    `}
                        fill="none"
                        stroke="#ff758c"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />

                    {/* Data points with glow */}
                    {incomeData.map((value, index) => {
                        const x = 40 + index * ((width - 80) / (incomeData.length - 1))
                        const y = height - 40 - ((value / maxValue) * (height - 100) * chartProgress.value)
                        const jitter = Math.sin(index * 0.5 + sparkleAnimation.value * Math.PI * 2) * 5

                        return (
                            <G key={`income-point-${index}`}>
                                <Circle
                                    cx={x}
                                    cy={y + jitter}
                                    r={12}
                                    fill="url(#particleGlow)"
                                    opacity={0.4}
                                />
                                <Circle
                                    cx={x}
                                    cy={y + jitter}
                                    r={8}
                                    fill="#00c6ff"
                                    stroke="white"
                                    strokeWidth="2"
                                />
                            </G>
                        )
                    })}

                    {expenseData.map((value, index) => {
                        const x = 40 + index * ((width - 80) / (expenseData.length - 1))
                        const y = height - 40 - ((value / maxValue) * (height - 100) * chartProgress.value)
                        const jitter = Math.sin(index * 0.5 + sparkleAnimation.value * Math.PI * 2 + Math.PI) * 5

                        return (
                            <G key={`expense-point-${index}`}>
                                <Circle
                                    cx={x}
                                    cy={y + jitter}
                                    r={12}
                                    fill="url(#particleGlow)"
                                    opacity={0.4}
                                />
                                <Circle
                                    cx={x}
                                    cy={y + jitter}
                                    r={8}
                                    fill="#ff758c"
                                    stroke="white"
                                    strokeWidth="2"
                                />
                            </G>
                        )
                    })}

                    {/* Labels */}
                    {dates.map((date, index) => {
                        const x = 40 + index * ((width - 80) / (dates.length - 1))
                        const label = activeView === 'friends' ? date :
                            activeView === 'daily' ? date :
                                new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

                        return (
                            <SvgText
                                key={index}
                                x={x}
                                y={height - 15}
                                fontSize="10"
                                fill="white"
                                textAnchor="middle"
                                fontWeight="600"
                            >
                                {label}
                            </SvgText>
                        )
                    })}
                </Svg>
            </View>
        )
    }

    const RadialEnergyBurst = () => {
        const size = 280
        const center = size / 2
        const maxRadius = 120

        return (
            <View style={{ alignItems: 'center' }}>
                <Svg width={size} height={size}>
                    <Defs>
                        <RadialGradient id="energyBg" cx="50%" cy="50%" r="50%">
                            <Stop offset="0%" stopColor="#1a2a6c" />
                            <Stop offset="50%" stopColor="#b21f1f" />
                            <Stop offset="100%" stopColor="#fdbb2d" />
                        </RadialGradient>
                        <RadialGradient id="energyIncome" cx="50%" cy="50%" r="50%">
                            <Stop offset="0%" stopColor="#00c6ff" stopOpacity="0.9" />
                            <Stop offset="100%" stopColor="#0072ff" stopOpacity="0.3" />
                        </RadialGradient>
                        <RadialGradient id="energyExpense" cx="50%" cy="50%" r="50%">
                            <Stop offset="0%" stopColor="#ff758c" stopOpacity="0.9" />
                            <Stop offset="100%" stopColor="#ff7eb3" stopOpacity="0.3" />
                        </RadialGradient>
                    </Defs>

                    {/* Background */}
                    <Circle cx={center} cy={center} r={maxRadius} fill="url(#energyBg)" />

                    {/* Energy bursts */}
                    {incomeData.map((value, index) => {
                        const angle = (index * 360 / incomeData.length) * Math.PI / 180
                        const radius = (value / maxValue) * maxRadius * chartProgress.value
                        const x = center + radius * Math.cos(angle)
                        const y = center + radius * Math.sin(angle)

                        return (
                            <G key={`income-burst-${index}`}>
                                <Line
                                    x1={center}
                                    y1={center}
                                    x2={x}
                                    y2={y}
                                    stroke="url(#energyIncome)"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                                <Circle
                                    cx={x}
                                    cy={y}
                                    r={8 + pulseAnimation.value * 4}
                                    fill="url(#energyIncome)"
                                />
                            </G>
                        )
                    })}

                    {expenseData.map((value, index) => {
                        const angle = (index * 360 / expenseData.length) * Math.PI / 180
                        const radius = (value / maxValue) * maxRadius * chartProgress.value
                        const x = center + radius * Math.cos(angle)
                        const y = center + radius * Math.sin(angle)

                        return (
                            <G key={`expense-burst-${index}`}>
                                <Line
                                    x1={center}
                                    y1={center}
                                    x2={x}
                                    y2={y}
                                    stroke="url(#energyExpense)"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                                <Circle
                                    cx={x}
                                    cy={y}
                                    r={8 + pulseAnimation.value * 4}
                                    fill="url(#energyExpense)"
                                />
                            </G>
                        )
                    })}

                    {/* Center glow */}
                    <Circle
                        cx={center}
                        cy={center}
                        r={20 + pulseAnimation.value * 10}
                        fill="white"
                        opacity={0.3}
                    />
                    <Circle
                        cx={center}
                        cy={center}
                        r={10 + pulseAnimation.value * 5}
                        fill="white"
                        opacity={0.6}
                    />

                    {/* Labels */}
                    {dates.map((date, index) => {
                        const angle = (index * 360 / dates.length) * Math.PI / 180
                        const x = center + (maxRadius + 20) * Math.cos(angle)
                        const y = center + (maxRadius + 20) * Math.sin(angle)
                        const label = activeView === 'friends' ? date :
                            activeView === 'daily' ? date :
                                new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

                        return (
                            <SvgText
                                key={index}
                                x={x}
                                y={y}
                                fontSize="10"
                                fill="white"
                                textAnchor="middle"
                                fontWeight="600"
                            >
                                {label}
                            </SvgText>
                        )
                    })}

                    {/* Total values */}
                    <SvgText
                        x={center}
                        y={center - 10}
                        fontSize="14"
                        fill="white"
                        textAnchor="middle"
                        fontWeight="bold"
                    >
                        Income: ${formatCurrency(totalIncome)}
                    </SvgText>
                    <SvgText
                        x={center}
                        y={center + 10}
                        fontSize="14"
                        fill="white"
                        textAnchor="middle"
                        fontWeight="bold"
                    >
                        Expense: ${formatCurrency(totalExpense)}
                    </SvgText>
                </Svg>
            </View>
        )
    }

    const ElasticNeonComparison = () => {
        const width = screenWidth - 60
        const height = 280
        const barWidth = 20
        const spacing = 15

        return (
            <View style={{ alignItems: 'center' }}>
                <Svg width={width} height={height}>
                    <Defs>
                        <LinearGradient id="neonIncome" x1="0%" y1="0%" x2="0%" y2="100%">
                            <Stop offset="0%" stopColor="#00c6ff" />
                            <Stop offset="100%" stopColor="#0072ff" />
                        </LinearGradient>
                        <LinearGradient id="neonExpense" x1="0%" y1="0%" x2="0%" y2="100%">
                            <Stop offset="0%" stopColor="#ff758c" />
                            <Stop offset="100%" stopColor="#ff7eb3" />
                        </LinearGradient>
                        <Filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </Filter>
                    </Defs>

                    {/* Background grid */}
                    {[0, 1, 2, 3, 4].map(i => (
                        <Line
                            key={i}
                            x1={40}
                            y1={40 + i * (height - 80) / 4}
                            x2={width - 40}
                            y2={40 + i * (height - 80) / 4}
                            stroke="#2a2a2a"
                            strokeWidth="1"
                            strokeDasharray="5,5"
                        />
                    ))}

                    {/* Income bars with elastic effect */}
                    {incomeData.map((value, index) => {
                        const progress = chartProgress.value
                        const animatedValue = value * progress
                        const barHeight = (animatedValue / maxValue) * (height - 100)
                        const x = 40 + index * (barWidth * 2 + spacing * 2)
                        const y = height - 60 - barHeight
                        const elasticEffect = Math.sin(index * 0.5 + pulseAnimation.value * Math.PI * 2) * 5

                        return (
                            <G key={`neon-income-${index}`}>
                                <Rect
                                    x={x - elasticEffect}
                                    y={y}
                                    width={barWidth}
                                    height={barHeight}
                                    fill="url(#neonIncome)"
                                    rx="5"
                                    ry="5"
                                    filter="url(#neonGlow)"
                                />
                                <SvgText
                                    x={x + barWidth / 2}
                                    y={y - 10}
                                    fontSize="10"
                                    fill="#00c6ff"
                                    textAnchor="middle"
                                    fontWeight="bold"
                                >
                                    ${formatCurrency(value)}
                                </SvgText>
                            </G>
                        )
                    })}

                    {/* Expense bars with elastic effect */}
                    {expenseData.map((value, index) => {
                        const progress = chartProgress.value
                        const animatedValue = value * progress
                        const barHeight = (animatedValue / maxValue) * (height - 100)
                        const x = 40 + index * (barWidth * 2 + spacing * 2) + barWidth + spacing
                        const y = height - 60 - barHeight
                        const elasticEffect = Math.sin(index * 0.5 + pulseAnimation.value * Math.PI * 2 + Math.PI) * 5

                        return (
                            <G key={`neon-expense-${index}`}>
                                <Rect
                                    x={x - elasticEffect}
                                    y={y}
                                    width={barWidth}
                                    height={barHeight}
                                    fill="url(#neonExpense)"
                                    rx="5"
                                    ry="5"
                                    filter="url(#neonGlow)"
                                />
                                <SvgText
                                    x={x + barWidth / 2}
                                    y={y - 10}
                                    fontSize="10"
                                    fill="#ff758c"
                                    textAnchor="middle"
                                    fontWeight="bold"
                                >
                                    ${formatCurrency(value)}
                                </SvgText>
                            </G>
                        )
                    })}

                    {/* Labels */}
                    {dates.map((date, index) => {
                        const x = 40 + index * (barWidth * 2 + spacing * 2) + barWidth + spacing / 2
                        const label = activeView === 'friends' ? date :
                            activeView === 'daily' ? date :
                                new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

                        return (
                            <SvgText
                                key={index}
                                x={x}
                                y={height - 30}
                                fontSize="10"
                                fill="#aaa"
                                textAnchor="middle"
                                fontWeight="600"
                            >
                                {label}
                            </SvgText>
                        )
                    })}

                    {/* Legend */}
                    <Rect x={width - 120} y={20} width={15} height={15} fill="url(#neonIncome)" rx="3" ry="3" />
                    <SvgText x={width - 100} y={32} fontSize="12" fill="#00c6ff" fontWeight="bold">Income</SvgText>
                    <Rect x={width - 120} y={40} width={15} height={15} fill="url(#neonExpense)" rx="3" ry="3" />
                    <SvgText x={width - 100} y={52} fontSize="12" fill="#ff758c" fontWeight="bold">Expense</SvgText>
                </Svg>
            </View>
        )
    }

    const PrismaticViewPortal = () => {
        const size = 280
        const center = size / 2
        const maxRadius = 120

        return (
            <View style={{ alignItems: 'center' }}>
                <Svg width={size} height={size}>
                    <Defs>
                        <RadialGradient id="portalBg" cx="50%" cy="50%" r="50%">
                            <Stop offset="0%" stopColor="#000000" />
                            <Stop offset="100%" stopColor="#1a1a2e" />
                        </RadialGradient>
                        <ClipPath id="portalClip">
                            <Circle cx={center} cy={center} r={maxRadius * chartProgress.value} />
                        </ClipPath>
                    </Defs>

                    {/* Portal background */}
                    <Circle cx={center} cy={center} r={maxRadius} fill="url(#portalBg)" />

                    {/* Prismatic rings */}
                    {[0, 1, 2, 3, 4].map(i => {
                        const radius = (maxRadius / 5) * (i + 1) * chartProgress.value
                        const hue = (i * 72 + sparkleAnimation.value * 360) % 360
                        const color = `hsl(${hue}, 100%, 50%)`

                        return (
                            <Circle
                                key={`ring-${i}`}
                                cx={center}
                                cy={center}
                                r={radius}
                                fill="none"
                                stroke={color}
                                strokeWidth="2"
                                strokeDasharray="10,5"
                                opacity={0.7}
                                clipPath="url(#portalClip)"
                            />
                        )
                    })}

                    {/* Data points */}
                    {incomeData.map((value, index) => {
                        const angle = (index * 360 / incomeData.length) * Math.PI / 180
                        const radius = (value / maxValue) * maxRadius * chartProgress.value
                        const x = center + radius * Math.cos(angle)
                        const y = center + radius * Math.sin(angle)
                        const hue = (index * 30 + sparkleAnimation.value * 360) % 360
                        const color = `hsl(${hue}, 100%, 60%)`

                        return (
                            <G key={`portal-income-${index}`}>
                                <Line
                                    x1={center}
                                    y1={center}
                                    x2={x}
                                    y2={y}
                                    stroke={color}
                                    strokeWidth="1"
                                    opacity={0.5}
                                    clipPath="url(#portalClip)"
                                />
                                <Circle
                                    cx={x}
                                    cy={y}
                                    r={8}
                                    fill={color}
                                    stroke="white"
                                    strokeWidth="2"
                                    clipPath="url(#portalClip)"
                                />
                                <SvgText
                                    x={x}
                                    y={y - 15}
                                    fontSize="10"
                                    fill={color}
                                    textAnchor="middle"
                                    fontWeight="bold"
                                    clipPath="url(#portalClip)"
                                >
                                    ${formatCurrency(value)}
                                </SvgText>
                            </G>
                        )
                    })}

                    {expenseData.map((value, index) => {
                        const angle = (index * 360 / expenseData.length) * Math.PI / 180
                        const radius = (value / maxValue) * maxRadius * chartProgress.value
                        const x = center + radius * Math.cos(angle)
                        const y = center + radius * Math.sin(angle)
                        const hue = (index * 30 + sparkleAnimation.value * 360 + 180) % 360
                        const color = `hsl(${hue}, 100%, 60%)`

                        return (
                            <G key={`portal-expense-${index}`}>
                                <Line
                                    x1={center}
                                    y1={center}
                                    x2={x}
                                    y2={y}
                                    stroke={color}
                                    strokeWidth="1"
                                    opacity={0.5}
                                    clipPath="url(#portalClip)"
                                />
                                <Circle
                                    cx={x}
                                    cy={y}
                                    r={8}
                                    fill={color}
                                    stroke="white"
                                    strokeWidth="2"
                                    clipPath="url(#portalClip)"
                                />
                                <SvgText
                                    x={x}
                                    y={y + 25}
                                    fontSize="10"
                                    fill={color}
                                    textAnchor="middle"
                                    fontWeight="bold"
                                    clipPath="url(#portalClip)"
                                >
                                    ${formatCurrency(value)}
                                </SvgText>
                            </G>
                        )
                    })}

                    {/* Center label */}
                    <SvgText
                        x={center}
                        y={center}
                        fontSize="12"
                        fill="white"
                        textAnchor="middle"
                        fontWeight="bold"
                    >
                        ${formatCurrency(totalIncome + totalExpense)}
                    </SvgText>
                </Svg>
            </View>
        )
    }

    const HologramGradientChart = () => {
        const width = screenWidth - 60
        const height = 300

        return (
            <View style={{ alignItems: 'center' }}>
                <Svg width={width} height={height}>
                    <Defs>
                        <LinearGradient id="hologramBase" x1="0%" y1="0%" x2="100%" y2="100%">
                            <Stop offset="0%" stopColor="#00BCD4" stopOpacity="0.8" />
                            <Stop offset="25%" stopColor="#2196F3" stopOpacity="0.7" />
                            <Stop offset="50%" stopColor="#9C27B0" stopOpacity="0.6" />
                            <Stop offset="75%" stopColor="#E91E63" stopOpacity="0.7" />
                            <Stop offset="100%" stopColor="#FF5722" stopOpacity="0.8" />
                        </LinearGradient>
                        <LinearGradient id="hologramIncome" x1="0%" y1="100%" x2="100%" y2="0%">
                            <Stop offset="0%" stopColor="#4CAF50" stopOpacity="0.9" />
                            <Stop offset="33%" stopColor="#8BC34A" stopOpacity="0.8" />
                            <Stop offset="66%" stopColor="#CDDC39" stopOpacity="0.7" />
                            <Stop offset="100%" stopColor="#FFEB3B" stopOpacity="0.6" />
                        </LinearGradient>
                        <LinearGradient id="hologramExpense" x1="0%" y1="100%" x2="100%" y2="0%">
                            <Stop offset="0%" stopColor="#F44336" stopOpacity="0.9" />
                            <Stop offset="33%" stopColor="#FF5722" stopOpacity="0.8" />
                            <Stop offset="66%" stopColor="#FF9800" stopOpacity="0.7" />
                            <Stop offset="100%" stopColor="#FFC107" stopOpacity="0.6" />
                        </LinearGradient>
                    </Defs>

                    {/* Holographic background grid */}
                    <Rect width={width} height={height} fill="url(#hologramBase)" opacity={0.1} />

                    {/* Animated scanlines */}
                    {Array.from({ length: 20 }, (_, i) => (
                        <Line
                            key={i}
                            x1={0}
                            y1={i * (height / 20)}
                            x2={width}
                            y2={i * (height / 20)}
                            stroke="rgba(0,255,255,0.3)"
                            strokeWidth="1"
                            opacity={Math.sin(sparkleAnimation.value * Math.PI * 2 + i * 0.5) * 0.5 + 0.5}
                        />
                    ))}

                    {/* Income hologram areas */}
                    {incomeData.map((value, index) => {
                        const progress = chartProgress.value
                        const animatedValue = value * progress
                        const barHeight = (animatedValue / maxValue) * (height - 100)
                        const x = 60 + index * ((width - 120) / (incomeData.length - 1))
                        const y = height - 60 - barHeight

                        const hologramOffset = Math.sin(index * 0.6 + sparkleAnimation.value * Math.PI * 2) * 8
                        const glitchOffset = Math.random() * 2 - 1

                        return (
                            <G key={`hologram-income-${index}`}>
                                {/* Main hologram beam */}
                                <Rect
                                    x={x - 15 + hologramOffset}
                                    y={y}
                                    width={30}
                                    height={barHeight}
                                    fill="url(#hologramIncome)"
                                    opacity={progress * 0.8}
                                    transform={`skewX(${hologramOffset})`}
                                />
                                {/* Glitch effect */}
                                <Rect
                                    x={x - 15 + glitchOffset}
                                    y={y + barHeight * 0.3}
                                    width={30}
                                    height={barHeight * 0.4}
                                    fill="#00FFFF"
                                    opacity={progress * sparkleAnimation.value * 0.3}
                                />
                                {/* Hologram scan line */}
                                <Line
                                    x1={x - 20}
                                    y1={y + (barHeight * sparkleAnimation.value)}
                                    x2={x + 20}
                                    y2={y + (barHeight * sparkleAnimation.value)}
                                    stroke="#00FFFF"
                                    strokeWidth="2"
                                    opacity={progress * 0.7}
                                />
                                {/* Floating value */}
                                <SvgText
                                    x={x + hologramOffset}
                                    y={y - 10}
                                    fontSize="11"
                                    fill="#00FFFF"
                                    textAnchor="middle"
                                    fontWeight="700"
                                    opacity={progress}
                                    filter="drop-shadow(0 0 3px #00FFFF)"
                                >
                                    ${formatCurrency(value)}
                                </SvgText>
                            </G>
                        )
                    })}

                    {/* Expense hologram areas */}
                    {expenseData.map((value, index) => {
                        const progress = chartProgress.value
                        const animatedValue = value * progress
                        const barHeight = (animatedValue / maxValue) * (height - 100)
                        const x = 60 + index * ((width - 120) / (expenseData.length - 1))
                        const y = height - 60 - barHeight

                        const hologramOffset = Math.sin(index * 0.6 + sparkleAnimation.value * Math.PI * 2 + Math.PI) * 8
                        const glitchOffset = Math.random() * 2 - 1

                        return (
                            <G key={`hologram-expense-${index}`}>
                                {/* Main hologram beam */}
                                <Rect
                                    x={x - 10 + hologramOffset}
                                    y={y}
                                    width={20}
                                    height={barHeight}
                                    fill="url(#hologramExpense)"
                                    opacity={progress * 0.6}
                                    transform={`skewX(${-hologramOffset})`}
                                />
                                {/* Glitch effect */}
                                <Rect
                                    x={x - 10 + glitchOffset}
                                    y={y + barHeight * 0.6}
                                    width={20}
                                    height={barHeight * 0.3}
                                    fill="#FF00FF"
                                    opacity={progress * sparkleAnimation.value * 0.4}
                                />
                                {/* Hologram scan line */}
                                <Line
                                    x1={x - 15}
                                    y1={y + (barHeight * (1 - sparkleAnimation.value))}
                                    x2={x + 15}
                                    y2={y + (barHeight * (1 - sparkleAnimation.value))}
                                    stroke="#FF00FF"
                                    strokeWidth="2"
                                    opacity={progress * 0.7}
                                />
                                {/* Floating value */}
                                <SvgText
                                    x={x + hologramOffset}
                                    y={y - 10}
                                    fontSize="11"
                                    fill="#FF00FF"
                                    textAnchor="middle"
                                    fontWeight="700"
                                    opacity={progress}
                                    filter="drop-shadow(0 0 3px #FF00FF)"
                                >
                                    ${formatCurrency(value)}
                                </SvgText>
                            </G>
                        )
                    })}

                    {/* Holographic labels */}
                    {dates.map((date, index) => {
                        const x = 60 + index * ((width - 120) / (dates.length - 1))
                        const label = activeView === 'friends' ? date :
                            activeView === 'daily' ? date :
                                new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

                        return (
                            <SvgText
                                key={index}
                                x={x}
                                y={height - 20}
                                fontSize="10"
                                fill="#00FFFF"
                                textAnchor="middle"
                                fontWeight="600"
                                opacity={chartProgress.value}
                                filter="drop-shadow(0 0 2px #00FFFF)"
                            >
                                {label}
                            </SvgText>
                        )
                    })}
                </Svg>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <AuthHeader title="Financial Charts" />

            {/* View selector tabs */}
            <Animated.View style={[styles.tabContainer, cardAnimatedStyle]}>
                {viewTabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        style={[
                            styles.tabButton,
                            activeView === tab.key && { backgroundColor: tab.color }
                        ]}
                        onPress={() => setActiveView(tab.key)}
                    >
                        <Text style={styles.tabText}>{tab.icon} {tab.title}</Text>
                    </TouchableOpacity>
                ))}
            </Animated.View>

            {/* Chart title */}
            <Animated.View style={[styles.chartTitleContainer, pulseStyle]}>
                <Text style={styles.chartTitle}>{chartTitles[activeChart]}</Text>
            </Animated.View>

            {/* Main chart container */}
            <Animated.View style={[styles.chartContainer, cardAnimatedStyle]}>
                <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={(e) => {
                        const newIndex = Math.round(e.nativeEvent.contentOffset.x / screenWidth)
                        if (newIndex !== activeChart) {
                            setActiveChart(newIndex)
                        }
                    }}
                >
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((index) => (
                        <View key={index} style={{ width: screenWidth }}>
                            {renderCurrentChart()}
                        </View>
                    ))}
                </ScrollView>
            </Animated.View>

            {/* Summary cards */}
            <Animated.View style={[styles.summaryContainer, cardAnimatedStyle]}>
                <Animated.View style={[styles.summaryCard, pulseStyle]}>
                    <Text style={styles.summaryLabel}>Total Income</Text>
                    <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>
                        ${formatCurrency(totalIncome)}
                    </Text>
                </Animated.View>

                <Animated.View style={[styles.summaryCard, pulseStyle]}>
                    <Text style={styles.summaryLabel}>Total Expense</Text>
                    <Text style={[styles.summaryValue, { color: '#F44336' }]}>
                        ${formatCurrency(totalExpense)}
                    </Text>
                </Animated.View>

                <Animated.View style={[styles.summaryCard, pulseStyle]}>
                    <Text style={styles.summaryLabel}>Net Balance</Text>
                    <Text style={[styles.summaryValue, {
                        color: totalIncome >= totalExpense ? '#4CAF50' : '#F44336'
                    }]}>
                        ${formatCurrency(totalIncome - totalExpense)}
                    </Text>
                </Animated.View>
            </Animated.View>

            {/* Chart indicator dots */}
            <Animated.View style={[styles.dotsContainer, cardAnimatedStyle]}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.dot,
                            activeChart === index && styles.activeDot,
                            activeChart === index && { backgroundColor: viewTabs.find(t => t.key === activeView)?.color || '#6366F1' }
                        ]}
                        onPress={() => {
                            setActiveChart(index)
                        }}
                    />
                ))}
            </Animated.View>
        </View>
    )
}

export default WeeklyChart