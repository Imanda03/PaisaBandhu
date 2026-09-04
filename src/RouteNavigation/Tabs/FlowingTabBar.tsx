import {
  BottomTabBar,
  BottomTabBarHeightCallbackContext,
  type BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  EmitterSubscription,
  Keyboard,
  LayoutChangeEvent,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../utils/colors';
import { createTabBarStyles } from './styles';
import { scale, useNavBarLayout } from '../../utils/responsive';
import { springConfig } from '../../utils/animations';

function useKeyboardVisible() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onShow = () => setVisible(true);
    const onHide = () => setVisible(false);
    let subs: EmitterSubscription[];
    if (Platform.OS === 'ios') {
      subs = [
        Keyboard.addListener('keyboardWillShow', onShow),
        Keyboard.addListener('keyboardWillHide', onHide),
      ];
    } else {
      subs = [
        Keyboard.addListener('keyboardDidShow', onShow),
        Keyboard.addListener('keyboardDidHide', onHide),
      ];
    }
    return () => subs.forEach(s => s.remove());
  }, []);
  return visible;
}

export function FlowingTabBar(props: BottomTabBarProps) {
  const { state } = props;
  const nav = useNavBarLayout();
  const styles = createTabBarStyles(nav);
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const onHeightChange = useContext(BottomTabBarHeightCallbackContext);

  const keyboardShown = useKeyboardVisible();
  const shouldShow = !keyboardShown;

  const [layoutHeight, setLayoutHeight] = useState(0);
  const [isTabBarHidden, setIsTabBarHidden] = useState(!shouldShow);

  const visible = useSharedValue(shouldShow ? 1 : 0);
  const indicatorX = useSharedValue(0);
  const [trackW, setTrackW] = useState(0);
  const [dashW, setDashW] = useState(0);
  const isFirstIndicator = useRef(true);

  const insetBottom = insets.bottom;
  const effectiveBottomOffset =
    insetBottom > 0 ? Math.min(nav.bottomOffset, 8) : nav.bottomOffset;
  const dockContentHeight = nav.dockHeight;
  const totalDockHeight = dockContentHeight + insetBottom;

  const rimColors = useMemo(
    () =>
      isDark
        ? ['#5C5344', '#3D3A35', '#C6A56B', '#3D3A35', '#5C5344']
        : ['#D4C4A8', '#FDFCFA', '#C6A56B', '#FDFCFA', '#D4C4A8'],
    [isDark],
  );

  const faceColors = useMemo(
    () =>
      isDark
        ? ['#2A2A2F', '#1C1C20', '#222228']
        : ['#FFFFFF', '#F4F6FA', '#FAFBFD'],
    [isDark],
  );

  const accentColors = useMemo(
    () => ['#F0E0C4', '#E8CF9E', '#C6A56B', '#A8894F', '#8A7140'],
    [],
  );

  useEffect(() => {
    if (shouldShow) {
      visible.value = withSpring(1, springConfig);
      setIsTabBarHidden(false);
    } else {
      setIsTabBarHidden(true);
      visible.value = withTiming(0, { duration: 200 });
    }
  }, [shouldShow, visible]);

  const dockAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY:
          (1 - visible.value) *
          (layoutHeight + insetBottom + StyleSheet.hairlineWidth),
      },
    ],
  }));

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const { height } = e.nativeEvent.layout;
      onHeightChange?.(height);
      setLayoutHeight(prev => (prev === height ? prev : height));
    },
    [onHeightChange],
  );

  const n = state.routes.length;

  const onTrackLayout = useCallback((e: LayoutChangeEvent) => {
    setTrackW(e.nativeEvent.layout.width);
  }, []);

  useEffect(() => {
    if (trackW <= 0 || n <= 0) return;
    const padH = nav.dockTrackPaddingH;
    const innerW = Math.max(0, trackW - 2 * padH);
    const slot = innerW / n;
    const w = Math.min(
      Math.max(slot * 0.38, scale(28)),
      Math.max(scale(48), nav.dockHeight * 0.38),
    );
    setDashW(w);
    const x = padH + state.index * slot + (slot - w) / 2;
    if (isFirstIndicator.current) {
      indicatorX.value = x;
      isFirstIndicator.current = false;
    } else {
      indicatorX.value = withSpring(x, springConfig);
    }
  }, [
    state.index,
    trackW,
    n,
    indicatorX,
    nav.dockHeight,
    nav.dockTrackPaddingH,
  ]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  return (
    <Animated.View
      onLayout={handleLayout}
      pointerEvents={isTabBarHidden ? 'none' : 'auto'}
      style={[
        styles.tabBarDock,
        {
          bottom: effectiveBottomOffset,
          minHeight: dockContentHeight,
          height: totalDockHeight,
          paddingBottom: insetBottom,
          paddingTop: 6,
        },
        dockAnimatedStyle,
      ]}
    >
      <LinearGradient
        colors={rimColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.tabBarRim}
      >
        <LinearGradient
          colors={faceColors}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.tabBarInner}
        >
          <View style={styles.dockTrack} onLayout={onTrackLayout}>
            {dashW > 0 && trackW > 0 ? (
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.accentRailWrap,
                  { width: dashW },
                  indicatorStyle,
                ]}
              >
                <LinearGradient
                  colors={accentColors}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={StyleSheet.absoluteFill}
                />
              </Animated.View>
            ) : null}
            <View style={styles.dockItemsLayer}>
              <BottomTabBar {...props} />
            </View>
          </View>
        </LinearGradient>
      </LinearGradient>
    </Animated.View>
  );
}

export function renderFlowingTabBar(props: BottomTabBarProps) {
  return <FlowingTabBar {...props} />;
}
