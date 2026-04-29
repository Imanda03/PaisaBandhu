import React, { useEffect } from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import type { ThemeColors } from '../../utils/colors';

export type ShimmerBoxProps = {
  theme: ThemeColors;
  height: number;
  borderRadius?: number;
  width?: number | `${number}%`;
  style?: ViewStyle;
};

export const ShimmerBox: React.FC<ShimmerBoxProps> = ({
  theme,
  height,
  borderRadius = 8,
  width,
  style,
}) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.linear }),
      -1,
      false,
    );
  }, [progress]);

  const slideStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(progress.value, [0, 1], [-140, 140]),
      },
    ],
  }));

  return (
    <View
      style={[
        {
          height,
          borderRadius,
          overflow: 'hidden',
          backgroundColor: theme.BACKGROUND_LIGHT,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: theme.BORDER_COLOR,
        },
        width !== undefined ? { width } : { alignSelf: 'stretch' },
        style,
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          { width: '220%' },
          slideStyle,
        ]}
      >
        <LinearGradient
          colors={[
            'transparent',
            'rgba(198, 165, 107, 0.22)',
            'rgba(255, 255, 255, 0.08)',
            'transparent',
          ]}
          locations={[0.15, 0.4, 0.6, 0.85]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};
