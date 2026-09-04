import React, { useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { staggerDelayMs } from '../../utils/animations';

export interface AnimatedListItemProps {
  index: number;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const AnimatedListItem: React.FC<AnimatedListItemProps> = ({
  index,
  children,
  style,
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    const delay = staggerDelayMs(index);
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) }),
    );
    translateY.value = withDelay(delay, withTiming(0, { duration: 300 }));
  }, [index, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
  );
};

export default AnimatedListItem;
