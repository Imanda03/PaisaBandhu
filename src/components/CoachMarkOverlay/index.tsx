import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../utils/colors';
import { useGuideTour } from '../../context/GuideTourContext';
import { scale, verticalScale, spacing } from '../../utils/responsive';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SPOTLIGHT_PADDING = scale(20);
const TOTAL_STEPS = 3;

const TAB_COUNT = 4;
const BOOK_TAB_INDEX = 1;
// Tab bar layout (must match Tabs/styles) — exported for step 1 hole alignment
const TAB_BAR_BOTTOM = verticalScale(16);
const TAB_BAR_HEIGHT = verticalScale(72);
const TAB_BAR_MARGIN = spacing(16);

export default function CoachMarkOverlay() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { tourStep, tourComplete, targetLayout, label, skipTour, goNextStep } = useGuideTour();
  const pulse = useSharedValue(1);
  const opacity = useSharedValue(0);

  const show = !tourComplete && tourStep > 0 && (targetLayout || (tourStep === 3 && label));

  useEffect(() => {
    if (show) {
      opacity.value = withTiming(1, { duration: 300 });
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.08, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [show]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  if (!show) return null;

  const hasSpotlight = !!targetLayout && targetLayout.width > 0 && targetLayout.height > 0;

  const isStep1 = tourStep === 1;

  let holeX: number;
  let holeY: number;
  let holeW: number;
  let holeH: number;

  if (hasSpotlight && isStep1) {
    const barWidth = SCREEN_WIDTH - 2 * TAB_BAR_MARGIN;
    const tabWidth = barWidth / TAB_COUNT;
    holeX = TAB_BAR_MARGIN + BOOK_TAB_INDEX * tabWidth + scale(2);
    holeW = tabWidth - scale(4);
    holeH = TAB_BAR_HEIGHT + scale(16);
    holeY = SCREEN_HEIGHT - insets.bottom - TAB_BAR_BOTTOM - TAB_BAR_HEIGHT - scale(4);
    holeY += scale(45);
  } else if (hasSpotlight) {
    holeX = Math.max(0, targetLayout.x - SPOTLIGHT_PADDING);
    holeY = Math.max(0, targetLayout.y - SPOTLIGHT_PADDING);
    holeW = targetLayout.width + SPOTLIGHT_PADDING * 2;
    holeH = targetLayout.height + SPOTLIGHT_PADDING * 2;
  } else {
    holeX = holeY = holeW = holeH = 0;
  }

  const dim = (top: number, left: number, width: number, height: number) => ({
    position: 'absolute' as const,
    top,
    left,
    width,
    height,
    backgroundColor: 'rgba(0,0,0,0.58)',
    pointerEvents: 'none' as const,
  });

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, overlayStyle]}
      pointerEvents={show ? 'box-none' : 'none'}
    >
      {hasSpotlight ? (
        <>
          <View style={dim(0, 0, SCREEN_WIDTH, holeY)} />
          <View style={dim(holeY + holeH, 0, SCREEN_WIDTH, SCREEN_HEIGHT - holeY - holeH)} />
          <View style={dim(holeY, 0, holeX, holeH)} />
          <View style={dim(holeY, holeX + holeW, SCREEN_WIDTH - holeX - holeW, holeH)} />
          <Animated.View
            pointerEvents="none"
            style={[
              styles.ring,
              { left: holeX, top: holeY, width: holeW, height: holeH, borderColor: theme.SECONDARY },
              ringStyle,
            ]}
          />
          {/* Step 1: transparent tap target over Book tab so tap always works */}
          {isStep1 && hasSpotlight && (
            <TouchableOpacity
              style={{
                position: 'absolute',
                left: holeX,
                top: holeY,
                width: holeW,
                height: holeH,
              }}
              activeOpacity={1}
              onPress={() => {
                goNextStep();
                (navigation as any).navigate('Tabs', { screen: 'Book' });
              }}
            />
          )}
        </>
      ) : (
        <View
          style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.58)' }]}
          pointerEvents="none"
        />
      )}

      {/* Premium tooltip card - respect safe area */}
      <View
        style={[
          styles.tooltip,
          {
            backgroundColor: theme.BACKGROUND_LIGHT || theme.BACKGROUND,
            borderLeftColor: theme.SECONDARY,
            top: insets.top + scale(80),
          },
        ]}
        pointerEvents="none"
      >
        <View style={styles.stepRow}>
          {[1, 2, 3].map((step) => (
            <View
              key={step}
              style={[
                styles.stepDot,
                step === tourStep && styles.stepDotActive,
                { backgroundColor: step === tourStep ? theme.SECONDARY : theme.BORDER_COLOR + '99' },
              ]}
            />
          ))}
        </View>
        <Text style={[styles.tooltipLabel, { color: theme.SECONDARY }]}>
          Step {tourStep} of {TOTAL_STEPS}
        </Text>
        <Text style={[styles.tooltipText, { color: theme.TEXT }]}>{label}</Text>
      </View>

      {/* Skip - left side, visible, respect safe area */}
      <TouchableOpacity
        style={[
          styles.skipBtn,
          {
            borderColor: theme.BORDER_COLOR,
            backgroundColor: theme.BACKGROUND_LIGHT || theme.BACKGROUND,
            left: scale(20),
            top: insets.top + scale(8),
          },
        ]}
        onPress={skipTour}
        activeOpacity={0.8}
      >
        <Text style={[styles.skipText, { color: theme.TEXT }]}>Skip tour</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  ring: {
    position: 'absolute',
    borderRadius: scale(24),
    borderWidth: 2.5,
    ...Platform.select({
      ios: {
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
      },
      android: { elevation: 12 },
    }),
  },
  tooltip: {
    position: 'absolute',
    left: scale(20),
    right: scale(20),
    paddingVertical: scale(20),
    paddingHorizontal: scale(22),
    paddingLeft: scale(24),
    borderRadius: scale(20),
    borderLeftWidth: 4,
    maxWidth: SCREEN_WIDTH - scale(40),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
      },
      android: { elevation: 12 },
    }),
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(10),
    gap: scale(8),
  },
  stepDot: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
  },
  stepDotActive: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
  },
  tooltipLabel: {
    fontSize: scale(12),
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: scale(4),
    textTransform: 'uppercase',
  },
  tooltipText: {
    fontSize: scale(17),
    fontWeight: '700',
    lineHeight: scale(24),
    letterSpacing: 0.2,
  },
  skipBtn: {
    position: 'absolute',
    left: scale(20),
    paddingVertical: scale(10),
    paddingHorizontal: scale(18),
    borderRadius: scale(22),
    borderWidth: 1.5,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: { elevation: 6 },
    }),
  },
  skipText: {
    fontSize: scale(14),
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
