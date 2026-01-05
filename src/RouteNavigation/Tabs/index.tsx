import React, { useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { createStyles } from './styles';
import { useTheme } from '../../utils/colors';
import { IoniconsIcon } from '../../utils/Icons';
import HomeScreen from '../../screen/App/HomeScreen';
import BookScreen from '../../screen/App/BookScreen';
import ProfileScreen from '../../screen/App/ProfileScreen';
import SocialFeedScreen from '../../screen/App/SocialFeedScreen';
import ChallengesScreen from '../../screen/App/ChallengesScreen';
import AchievementsScreen from '../../screen/App/AchievementsScreen';
import SavingsGoalsScreen from '../../screen/App/SavingsGoalsScreen';

const Tab = createBottomTabNavigator();

const Tabs = () => {
  const styles = createStyles();
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Feed') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Challenges') {
            // Use medal icon - more reliable in Ionicons
            iconName = focused ? 'medal' : 'medal-outline';
          } else if (route.name === 'Book') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = focused ? 'person' : 'person-outline';
          }
          const iconColor = focused
            ? theme.NAVBAR_ACTIVE_TEXT || '#E3E3E3'
            : theme.NAVBAR_INACTIVE_TEXT || '#456882';
          const iconSize = size || 24;

          return (
            <IoniconsIcon name={iconName} size={iconSize} color={iconColor} />
          );
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
              ]}
            >
              {route.name}
            </Text>
          );
        },
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
        // tabBarIconStyle: styles.tabBarIcon,
      })}
    >
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

      <Tab.Screen
        name="Challenges"
        component={ChallengesScreen}
        options={{
          tabBarButton: props => <TabBarButton {...props} />,
        }}
      />

      <Tab.Screen
        name="Feed"
        component={SocialFeedScreen}
        options={{
          tabBarButton: props => <TabBarButton {...props} />,
        }}
      />

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

const TabBarButton = ({
  accessibilityState,
  children,
  onPress,
  ...props
}: any) => {
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
      {...props}
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.tabBarButtonContainer}
    >
      <Animated.View
        style={[
          styles.tabBarButton,
          {
            transform: [{ translateY: translateYValue }],
          },
          focused ? styles.tabBarButtonActive : null,
        ]}
      >
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default Tabs;
