import React, { useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  View,
  Text,
  StyleSheet,
  findNodeHandle,
  UIManager,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { fontSize, useNavBarLayout } from '../../utils/responsive';
import { createTabBarStyles } from './styles';
import { useTheme } from '../../utils/colors';
import { IoniconsIcon } from '../../utils/Icons';
import HomeScreen from '../../screen/App/HomeScreen';
import BookScreen from '../../screen/App/BookScreen';
import ProfileScreen from '../../screen/App/ProfileScreen';
import ChallengesScreen from '../../screen/App/ChallengesScreen';
import LendingRoute from '../../RouteNavigation/StackRoute/LendingRoute';
import { renderFlowingTabBar } from './FlowingTabBar';
import PressableScale from '../../components/PressableScale';
import { microSpring } from '../../utils/animations';

const Tab = createBottomTabNavigator();

type TabRouteName = 'Home' | 'Book' | 'Lending' | 'Challenges' | 'Profile';

const Tabs = () => {
  const nav = useNavBarLayout();
  const styles = createTabBarStyles(nav);
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      tabBar={renderFlowingTabBar}
      screenOptions={({ route }) => ({
        tabBarHideOnKeyboard: false,
        tabBarActiveBackgroundColor: 'transparent',
        tabBarInactiveBackgroundColor: 'transparent',
        tabBarIcon: ({ focused }) => {
          let iconName: string;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Lending') {
            iconName = focused ? 'cash' : 'cash-outline';
          } else if (route.name === 'Challenges') {
            iconName = focused ? 'medal' : 'medal-outline';
          } else if (route.name === 'Book') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = focused ? 'person' : 'person-outline';
          }
          const iconColor = focused
            ? theme.SECONDARY
            : theme.NAVBAR_INACTIVE_TEXT;
          const iconSize =
            nav.iconBase + (focused ? nav.iconFocusDelta : 0);

          return (
            <IoniconsIcon name={iconName} size={iconSize} color={iconColor} />
          );
        },
        headerShown: false,
        tabBarLabel: ({ focused }) => {
          return (
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}
              style={[
                styles.tabLabel,
                {
                  color: focused ? theme.TEXT : theme.NAVBAR_INACTIVE_TEXT,
                  fontSize: fontSize(
                    focused ? nav.labelActivePt : nav.labelInactivePt,
                  ),
                  fontWeight: focused ? '700' : '500',
                  letterSpacing: focused ? 0.2 : 0.35,
                  opacity: focused ? 1 : 0.72,
                  textTransform: 'uppercase',
                },
              ]}
            >
              {route.name}
            </Text>
          );
        },
        tabBarStyle: styles.tabBarNavigatorInner,
        tabBarItemStyle: styles.tabBarItem,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarButton: (props: Record<string, unknown>) => (
            <TabBarButton {...props} routeName="Home" />
          ),
        }}
      />
      <Tab.Screen
        name="Book"
        component={BookScreen}
        options={{
          tabBarButton: (props: Record<string, unknown>) => (
            <TabBarButton {...props} routeName="Book" />
          ),
        }}
      />
      <Tab.Screen
        name="Lending"
        component={LendingRoute}
        options={{
          tabBarButton: (props: Record<string, unknown>) => (
            <TabBarButton {...props} routeName="Lending" />
          ),
        }}
      />
      <Tab.Screen
        name="Challenges"
        component={ChallengesScreen}
        options={{
          tabBarButton: (props: Record<string, unknown>) => (
            <TabBarButton {...props} routeName="Challenges" />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarButton: (props: Record<string, unknown>) => (
            <TabBarButton {...props} routeName="Profile" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const TabBarButton = ({
  accessibilityState,
  children,
  onPress,
  routeName: _routeName,
  ...props
}: {
  accessibilityState?: { selected?: boolean };
  children?: React.ReactNode;
  onPress?: () => void;
  routeName: TabRouteName;
  [key: string]: unknown;
}) => {
  const nav = useNavBarLayout();
  const styles = createTabBarStyles(nav);
  const focused = accessibilityState?.selected;
  const ref = useRef<View>(null);
  const translateY = useSharedValue(0);
  const activeScale = useSharedValue(1);

  useEffect(() => {
    translateY.value = withSpring(focused ? -nav.tabLiftPx : 0, microSpring);
    activeScale.value = withSpring(focused ? 1.03 : 1, microSpring);
  }, [focused, translateY, activeScale, nav.tabLiftPx]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: activeScale.value },
    ],
  }));

  return (
    <View ref={ref} collapsable={false} style={styles.tabBarButtonContainer}>
      <PressableScale
        {...props}
        onPress={onPress}
        style={StyleSheet.absoluteFill}
      >
        <Animated.View style={[styles.tabBarButton, animatedStyle]}>
          {children}
        </Animated.View>
      </PressableScale>
    </View>
  );
};

export default Tabs;
