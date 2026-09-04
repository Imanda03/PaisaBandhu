import React, { useEffect, useImperativeHandle, forwardRef, useState, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { MaterialIcons } from '../../utils/Icons';
import { useTheme } from '../../utils/colors';
import { springConfig } from '../../utils/animations';

export interface SuccessOverlayRef {
  show: (onComplete?: () => void) => void;
}

interface SuccessOverlayProps {
  iconSize?: number;
}

const SuccessOverlay = forwardRef<SuccessOverlayRef, SuccessOverlayProps>(
  ({ iconSize = 64 }, ref) => {
    const { theme } = useTheme();
    const [visible, setVisible] = useState(false);
    const scale = useSharedValue(0);
    const opacity = useSharedValue(0);
    const onCompleteRef = React.useRef<(() => void) | undefined>(undefined);

    const handleFinish = useCallback(() => {
      setVisible(false);
      onCompleteRef.current?.();
      onCompleteRef.current = undefined;
    }, []);

    const iconStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const overlayStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
    }));

    useImperativeHandle(ref, () => ({
      show: (onComplete?: () => void) => {
        onCompleteRef.current = onComplete;
        setVisible(true);
        scale.value = 0;
        opacity.value = 1;
        scale.value = withSpring(1, springConfig);
        opacity.value = withDelay(
          800,
          withTiming(0, { duration: 400 }, (finished) => {
            if (finished) {
              runOnJS(handleFinish)();
            }
          }),
        );
      },
    }));

    if (!visible) return null;

    return (
      <Animated.View
        style={[styles.overlay, overlayStyle]}
        pointerEvents="none"
      >
        <Animated.View style={[styles.iconWrap, iconStyle]}>
          <MaterialIcons name="check-circle" size={iconSize} color={theme.SUCCESS} />
        </Animated.View>
      </Animated.View>
    );
  },
);

SuccessOverlay.displayName = 'SuccessOverlay';

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SuccessOverlay;
