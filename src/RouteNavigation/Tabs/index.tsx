import React, { useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  findNodeHandle,
  UIManager,
} from 'react-native';
import { fontSize, useNavBarLayout } from '../../utils/responsive';
import { createTabBarStyles } from './styles';
import { useTheme } from '../../utils/colors';
import { IoniconsIcon } from '../../utils/Icons';
import HomeScreen from '../../screen/App/HomeScreen';
import BookScreen from '../../screen/App/BookScreen';
import ProfileScreen from '../../screen/App/ProfileScreen';
import ChallengesScreen from '../../screen/App/ChallengesScreen';
import { useGuideTour } from '../../context/GuideTourContext';
import { renderFlowingTabBar } from './FlowingTabBar';

const Tab = createBottomTabNavigator();

const Tabs = () => {
  const nav = useNavBarLayout();
  const styles = createTabBarStyles(nav);
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      tabBar={renderFlowingTabBar}
      screenOptions={({ route }) => ({
        // FlowingTabBar hides on keyboard; keep false so nested BottomTabBar does not animate too.
        tabBarHideOnKeyboard: false,
        tabBarActiveBackgroundColor: 'transparent',
        tabBarInactiveBackgroundColor: 'transparent',
        tabBarIcon: ({ focused, color: _color }) => {
          let iconName: string;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
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
              minimumFontScale={0.82}
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
        // tabBarIconStyle: styles.tabBarIcon,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarButton: props => <TabBarButton {...props} routeName="Home" />,
        }}
      />
      <Tab.Screen
        name="Book"
        component={BookScreen}
        options={{
          tabBarButton: props => <TabBarButton {...props} routeName="Book" />,
        }}
      />

      <Tab.Screen
        name="Challenges"
        component={ChallengesScreen}
        options={{
          tabBarButton: props => <TabBarButton {...props} routeName="Challenges" />,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarButton: props => <TabBarButton {...props} routeName="Profile" />,
        }}
      />
    </Tab.Navigator>
  );
};

const TabBarButton = ({
  accessibilityState,
  children,
  onPress,
  routeName,
  ...props
}: any) => {
  const nav = useNavBarLayout();
  const styles = createTabBarStyles(nav);
  const focused = accessibilityState?.selected;
  const ref = useRef<View>(null);
  const { tourStep, setTargetLayout, goNextStep } = useGuideTour();
  const isBookTab = routeName === 'Book';
  const showTour = isBookTab && tourStep === 1;

  useEffect(() => {
    if (!showTour || !ref.current) return;
    const measure = () => {
      const tag = findNodeHandle(ref.current);
      if (tag != null) {
        UIManager.measureInWindow(tag, (x, y, width, height) => {
          setTargetLayout({ x, y, width, height }, 'Tap here to open Books');
        });
      }
    };
    const t = requestAnimationFrame(() => requestAnimationFrame(measure));
    return () => {
      cancelAnimationFrame(t);
      if (isBookTab) setTargetLayout(null, '');
    };
  }, [showTour, isBookTab, setTargetLayout]);

  const handlePress = () => {
    if (showTour) goNextStep();
    onPress?.();
  };

  const translateYValue = useRef(new Animated.Value(0)).current;
  const activeScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateYValue, {
        toValue: focused ? -nav.tabLiftPx : 0,
        useNativeDriver: true,
        friction: 8,
        tension: 100,
      }),
      Animated.spring(activeScale, {
        toValue: focused ? 1.04 : 1,
        useNativeDriver: true,
        friction: 7,
        tension: 140,
      }),
    ]).start();
  }, [focused, translateYValue, activeScale, nav.tabLiftPx]);

  return (
    <View ref={ref} collapsable={false} style={styles.tabBarButtonContainer}>
    <TouchableOpacity
      {...props}
      onPress={handlePress}
      activeOpacity={0.8}
      style={StyleSheet.absoluteFill}
    >
      <Animated.View
        style={[
          styles.tabBarButton,
          {
            transform: [
              { translateY: translateYValue },
              { scale: activeScale },
            ],
          },
        ]}
      >
        {children}
      </Animated.View>
    </TouchableOpacity>
    </View>
  );
};

export default Tabs;
