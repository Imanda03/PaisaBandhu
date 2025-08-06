import React, { useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { createStyles } from './styles';
import { useTheme } from '../../utils/colors';
import { IoniconsIcon } from '../../utils/Icons';
import HomeScreen from '../../screen/App/HomeScreen';
import BookScreen from '../../screen/App/BookScreen';
import ProfileScreen from '../../screen/App/ProfileScreen';

const Tab = createBottomTabNavigator();

const Tabs = () => {
    const styles = createStyles();
    const { theme } = useTheme();
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarHideOnKeyboard: true,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    } else if (route.name === 'Transaction') {
                        iconName = focused ? 'cash' : 'cash-outline';
                    } else if (route.name === 'Book') {
                        iconName = focused ? 'book-sharp' : 'book-outline';
                    } else {
                        iconName = focused ? 'person' : 'person-outline';
                    }
                    const iconColor = focused
                        ? theme.NAVBAR_ACTIVE_TEXT
                        : theme.NAVBAR_INACTIVE_TEXT;
                    return <IoniconsIcon name={iconName} size={size} color={iconColor} />;
                },
                headerShown: false,
                tabBarLabel: ({ focused }) => {
                    return (
                        <Text
                            style={[
                                styles.tabLabel,
                                {
                                    color: focused
                                        ? theme.NAVBAR_ACTIVE_TEXT
                                        : theme.NAVBAR_INACTIVE_TEXT,
                                },
                            ]}>
                            {route.name}
                        </Text>
                    );
                },
                tabBarStyle: styles.tabBar,
                tabBarItemStyle: styles.tabBarItem,
                // tabBarIconStyle: styles.tabBarIcon,
            })}>
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarButton: props => <TabBarButton {...props} />,
                }}
            />

            <Tab.Screen
                name="Book"
                component={BookScreen}
                options={{
                    tabBarButton: props => <TabBarButton {...props} />,
                }}
            />

            {/* <Tab.Screen
                name="Transaction"
                component={HistoryScreen}
                options={{
                    tabBarButton: props => <TabBarButton {...props} />,
                }}
            /> */}

            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarButton: props => <TabBarButton {...props} />,
                }}
            />
        </Tab.Navigator>
    );
};

const TabBarButton = ({ accessibilityState, children, onPress }: any) => {
    const focused = accessibilityState?.selected;

    // Animated values for the translation and scale
    const translateYValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(translateYValue, {
            toValue: focused ? -10 : 5,
            useNativeDriver: true,
        }).start();
    }, [focused]);

    const styles = createStyles();

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            style={styles.tabBarButtonContainer}>
            <Animated.View
                style={[
                    styles.tabBarButton,
                    {
                        transform: [{ translateY: translateYValue }],
                    },
                    focused ? styles.tabBarButtonActive : null,
                ]}>
                {children}
            </Animated.View>
        </TouchableOpacity>
    );
};

export default Tabs;
