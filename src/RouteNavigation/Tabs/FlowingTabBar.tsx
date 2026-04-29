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
  Animated,
  EmitterSubscription,
  Keyboard,
  LayoutChangeEvent,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../utils/colors';
import { createTabBarStyles } from './styles';
import { scale, useNavBarLayout } from '../../utils/responsive';

const useNativeDriver = Platform.OS !== 'web';

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
  const visible = useRef(new Animated.Value(shouldShow ? 1 : 0)).current;

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
      Animated.spring(visible, {
        toValue: 1,
        useNativeDriver: useNativeDriver,
        damping: 26,
        stiffness: 260,
      }).start(({ finished }) => {
        if (finished) setIsTabBarHidden(false);
      });
    } else {
      setIsTabBarHidden(true);
      Animated.timing(visible, {
        toValue: 0,
        duration: 200,
        useNativeDriver: useNativeDriver,
      }).start();
    }
    return () => visible.stopAnimation();
  }, [shouldShow, visible]);

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const { height } = e.nativeEvent.layout;
      onHeightChange?.(height);
      setLayoutHeight(prev => (prev === height ? prev : height));
    },
    [onHeightChange],
  );

  const n = state.routes.length;
  const indicatorX = useRef(new Animated.Value(0)).current;
  const [trackW, setTrackW] = useState(0);
  const [dashW, setDashW] = useState(0);
  const isFirstIndicator = useRef(true);

  const onTrackLayout = useCallback((e: LayoutChangeEvent) => {
    setTrackW(e.nativeEvent.layout.width);
  }, []);

  useEffect(() => {
    if (trackW <= 0 || n <= 0) return;
    // dockTrack uses horizontal padding; tabs lay out in the inner width only.
    const padH = nav.dockTrackPaddingH;
    const innerW = Math.max(0, trackW - 2 * padH);
    const slot = innerW / n;
    const w = Math.min(
      Math.max(slot * 0.42, scale(36)),
      Math.max(scale(56), nav.dockHeight * 0.42),
    );
    setDashW(w);
    const x = padH + state.index * slot + (slot - w) / 2;
    if (isFirstIndicator.current) {
      indicatorX.setValue(x);
      isFirstIndicator.current = false;
    } else {
      Animated.spring(indicatorX, {
        toValue: x,
        useNativeDriver: true,
        damping: 17,
        stiffness: 200,
        mass: 0.78,
      }).start();
    }
  }, [state.index, trackW, n, indicatorX, nav.dockHeight, nav.dockTrackPaddingH]);

  const insetBottom = insets.bottom;

  return (
    <Animated.View
      onLayout={handleLayout}
      pointerEvents={isTabBarHidden ? 'none' : 'auto'}
      style={[
        styles.tabBarDock,
        {
          paddingBottom: insetBottom,
          transform: [
            {
              translateY: visible.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  layoutHeight + insetBottom + StyleSheet.hairlineWidth,
                  0,
                ],
              }),
            },
          ],
        },
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
                  {
                    width: dashW,
                    transform: [{ translateX: indicatorX }],
                  },
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
