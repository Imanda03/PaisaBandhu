import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  StatusBarStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient as SvgLinearGradient,
  Stop,
} from 'react-native-svg';
import { getItem } from '../assets/storage';
import { useQueryClient } from 'react-query';
import { currentUser } from '../services/AuthService';
import {
  getBalanceTransaction,
  getLatestTransaction,
} from '../services/TransactionService';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const RING_SIZE = Math.min(SCREEN_W * 0.78, 300);
const RING_CX = RING_SIZE / 2;
const RING_CY = RING_SIZE / 2;
const PROGRESS_R = RING_SIZE * 0.38;
const CIRC = 2 * Math.PI * PROGRESS_R;

type LoadingTheme = {
  BG_DEEP: string;
  BG_MID: string;
  BG_HIGHLIGHT: string;
  TEXT: string;
  TEXT_MUTED: string;
  GOLD: string;
  GOLD_SOFT: string;
  GOLD_DEEP: string;
  TRACK: string;
  AURORA_A: string;
  AURORA_B: string;
  GRID: string;
  SPARK: string;
  STATUS: StatusBarStyle;
};

const vaultLight: LoadingTheme = {
  BG_DEEP: '#E8E4DC',
  BG_MID: '#F5F2EC',
  BG_HIGHLIGHT: '#FFFCF7',
  TEXT: '#14151A',
  TEXT_MUTED: 'rgba(20, 21, 26, 0.55)',
  GOLD: '#B8893C',
  GOLD_SOFT: '#D4B87A',
  GOLD_DEEP: '#8A6B2E',
  TRACK: 'rgba(20, 21, 26, 0.08)',
  AURORA_A: 'rgba(198, 165, 107, 0.22)',
  AURORA_B: 'rgba(184, 137, 60, 0.12)',
  GRID: 'rgba(20, 21, 26, 0.04)',
  SPARK: 'rgba(198, 165, 107, 0.45)',
  STATUS: 'dark-content',
};

const vaultDark: LoadingTheme = {
  BG_DEEP: '#050508',
  BG_MID: '#0C0C10',
  BG_HIGHLIGHT: '#14141A',
  TEXT: '#F4F2ED',
  TEXT_MUTED: 'rgba(244, 242, 237, 0.5)',
  GOLD: '#D4B87A',
  GOLD_SOFT: '#E8D4A8',
  GOLD_DEEP: '#9A7B43',
  TRACK: 'rgba(255, 255, 255, 0.06)',
  AURORA_A: 'rgba(198, 165, 107, 0.18)',
  AURORA_B: 'rgba(212, 184, 122, 0.06)',
  GRID: 'rgba(255, 255, 255, 0.03)',
  SPARK: 'rgba(232, 212, 168, 0.35)',
  STATUS: 'light-content',
};

/** Fixed star positions (normalized 0–1) for a subtle constellation */
const SPARKS = [
  { x: 0.08, y: 0.14, d: 2.2 },
  { x: 0.88, y: 0.11, d: 1.8 },
  { x: 0.22, y: 0.28, d: 1.5 },
  { x: 0.76, y: 0.34, d: 2.0 },
  { x: 0.12, y: 0.62, d: 1.6 },
  { x: 0.92, y: 0.58, d: 2.4 },
  { x: 0.42, y: 0.08, d: 1.4 },
  { x: 0.58, y: 0.72, d: 1.9 },
  { x: 0.18, y: 0.82, d: 2.1 },
  { x: 0.84, y: 0.88, d: 1.7 },
  { x: 0.5, y: 0.18, d: 1.3 },
  { x: 0.34, y: 0.48, d: 2.3 },
  { x: 0.66, y: 0.42, d: 1.55 },
  { x: 0.06, y: 0.44, d: 1.65 },
  { x: 0.94, y: 0.36, d: 2.0 },
];

function SparkDot({
  left,
  top,
  size,
  phase,
  color,
}: {
  left: number;
  top: number;
  size: number;
  phase: number;
  color: string;
}) {
  const tw = useSharedValue(0);
  useEffect(() => {
    tw.value = withDelay(
      phase,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.15, { duration: 2800, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false,
      ),
    );
  }, [phase, tw]);

  const style = useAnimatedStyle(() => ({
    opacity: interpolate(tw.value, [0, 1], [0.2, 1], Extrapolation.CLAMP),
    transform: [{ scale: interpolate(tw.value, [0, 1], [0.85, 1.15]) }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left,
          top,
          width: size,
          height: size,
          borderRadius: size,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

const LoadingScreen = ({ onFinish }: { onFinish?: () => void }) => {
  const [vt, setVt] = useState(vaultLight);
  const [progressText, setProgressText] = useState(0);
  const queryClient = useQueryClient();

  const progress = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslate = useSharedValue(28);
  const titleShimmer = useSharedValue(0);
  const ringOuter = useSharedValue(0);
  const ringMid = useSharedValue(0);
  const ringInner = useSharedValue(0);
  const aurora = useSharedValue(0);
  const scan = useSharedValue(0);
  const pulseCore = useSharedValue(0);

  const progressCircleProps = useAnimatedProps(() => {
    const p = Math.min(100, Math.max(0, progress.value));
    return {
      strokeDashoffset: CIRC * (1 - p / 100),
    };
  });

  const ringOuterStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${ringOuter.value}deg` }],
  }));
  const ringMidStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-ringMid.value}deg` }],
  }));
  const ringInnerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${ringInner.value}deg` }],
  }));

  const auroraStyle = useAnimatedStyle(() => ({
    opacity: interpolate(aurora.value, [0, 0.5, 1], [0.35, 0.7, 0.35]),
    transform: [
      { translateX: interpolate(aurora.value, [0, 1], [-30, 30]) },
      { translateY: interpolate(aurora.value, [0, 1], [20, -20]) },
      { scale: interpolate(aurora.value, [0, 1], [1, 1.08]) },
    ],
  }));

  const scanStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(scan.value, [0, 1], [-SCREEN_W * 0.5, SCREEN_W * 0.5]) },
      { rotate: '18deg' },
    ],
    opacity: interpolate(scan.value, [0, 0.15, 0.85, 1], [0, 0.12, 0.12, 0]),
  }));

  const titleAccentStyle = useAnimatedStyle(() => ({
    opacity: interpolate(titleShimmer.value, [0, 0.5, 1], [0.75, 1, 0.75]),
  }));

  const corePulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pulseCore.value, [0, 1], [1, 1.06]) }],
    opacity: interpolate(pulseCore.value, [0, 1], [0.5, 0.85]),
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslate.value }],
  }));

  const progressBarFillStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
    height: '100%',
    borderRadius: 100,
    overflow: 'hidden',
  }));

  useEffect(() => {
    const themeAndDataPrefetch = (async () => {
      const saved = await getItem('theme');
      setVt(saved === 'dark' ? vaultDark : vaultLight);

      await Promise.allSettled([
        queryClient.prefetchQuery(['ProfileDetails'], () => currentUser()),
        queryClient.prefetchQuery(['LatestTransactionList'], () =>
          getLatestTransaction(),
        ),
        queryClient.prefetchQuery(
          ['ChartTransaction', undefined, undefined],
          () => getBalanceTransaction(undefined),
        ),
      ]);
    })();

    contentOpacity.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
    contentTranslate.value = withTiming(0, {
      duration: 1100,
      easing: Easing.out(Easing.cubic),
    });

    titleShimmer.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 3200, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );

    ringOuter.value = withRepeat(
      withTiming(360, { duration: 28000, easing: Easing.linear }),
      -1,
      false,
    );
    ringMid.value = withRepeat(
      withTiming(360, { duration: 19000, easing: Easing.linear }),
      -1,
      false,
    );
    ringInner.value = withRepeat(
      withTiming(360, { duration: 36000, easing: Easing.linear }),
      -1,
      false,
    );

    aurora.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );

    scan.value = withRepeat(
      withTiming(1, { duration: 6500, easing: Easing.inOut(Easing.ease) }),
      -1,
      false,
    );

    pulseCore.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2400, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );

    let step = 0;
    const interval = setInterval(() => {
      step += Math.random() * 6 + 3;
      if (step > 100) step = 100;
      progress.value = withTiming(step, {
        duration: 380,
        easing: Easing.out(Easing.cubic),
      });
      runOnJS(setProgressText)(Math.floor(step));
      if (step >= 100) {
        setTimeout(() => {
          const finish = () => {
            if (onFinish) {
              runOnJS(onFinish)();
            }
          };
          themeAndDataPrefetch.then(finish).catch(finish);
        }, 520);
        clearInterval(interval);
      }
    }, 115);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- splash runs once; prefetch + progress timing must not re-subscribe
  }, []);

  const gridLines = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => (
        <View
          key={`h-${i}`}
          style={[
            styles.gridLineH,
            {
              top: `${(i + 1) * 6.5}%`,
              backgroundColor: vt.GRID,
            },
          ]}
        />
      )),
    [vt.GRID],
  );

  const statusLabel =
    progressText < 22
      ? 'Sealing the vault…'
      : progressText < 48
        ? 'Syncing your ledgers…'
        : progressText < 74
          ? 'Polishing the numbers…'
          : progressText < 100
            ? 'Almost there…'
            : 'Welcome in.';

  return (
    <View style={[styles.container, { backgroundColor: vt.BG_DEEP }]}>
      <StatusBar
        backgroundColor="transparent"
        barStyle={vt.STATUS}
        translucent
      />

      <LinearGradient
        colors={[vt.BG_DEEP, vt.BG_MID, vt.BG_HIGHLIGHT]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View style={[styles.auroraBlob, auroraStyle]} pointerEvents="none">
        <LinearGradient
          colors={[vt.AURORA_B, 'transparent', vt.AURORA_A]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <Animated.View style={[styles.scanBeam, scanStyle]} pointerEvents="none">
        <LinearGradient
          colors={['transparent', vt.GOLD_SOFT + '55', 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <View style={styles.gridWrap} pointerEvents="none">
        {gridLines}
      </View>

      {SPARKS.map((s, i) => (
        <SparkDot
          key={i}
          left={SCREEN_W * s.x}
          top={SCREEN_H * s.y}
          size={4 * s.d}
          phase={i * 180}
          color={vt.SPARK}
        />
      ))}

      <Animated.View style={[styles.content, contentStyle]}>
        <View style={styles.heroBlock}>
          <View style={[styles.ringsStack, { width: RING_SIZE, height: RING_SIZE }]}>
            <Animated.View style={[styles.ringLayer, ringOuterStyle]}>
              <Svg width={RING_SIZE} height={RING_SIZE}>
                <Defs>
                  <SvgLinearGradient id="vaultGold" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0" stopColor={vt.GOLD_SOFT} />
                    <Stop offset="0.5" stopColor={vt.GOLD} />
                    <Stop offset="1" stopColor={vt.GOLD_DEEP} />
                  </SvgLinearGradient>
                </Defs>
                <Circle
                  cx={RING_CX}
                  cy={RING_CY}
                  r={RING_SIZE * 0.46}
                  stroke="url(#vaultGold)"
                  strokeWidth={1.2}
                  strokeDasharray="6 14"
                  fill="none"
                  opacity={0.45}
                />
              </Svg>
            </Animated.View>

            <Animated.View style={[styles.ringLayer, ringMidStyle]}>
              <Svg width={RING_SIZE} height={RING_SIZE}>
                <Circle
                  cx={RING_CX}
                  cy={RING_CY}
                  r={RING_SIZE * 0.405}
                  stroke={vt.GOLD}
                  strokeWidth={0.8}
                  strokeDasharray="2 10"
                  fill="none"
                  opacity={0.35}
                />
              </Svg>
            </Animated.View>

            <Animated.View style={[styles.ringLayer, ringInnerStyle]}>
              <Svg width={RING_SIZE} height={RING_SIZE}>
                <Circle
                  cx={RING_CX}
                  cy={RING_CY}
                  r={RING_SIZE * 0.355}
                  stroke={vt.GOLD_SOFT}
                  strokeWidth={0.6}
                  strokeDasharray="1 6"
                  fill="none"
                  opacity={0.28}
                />
              </Svg>
            </Animated.View>

            <Svg
              width={RING_SIZE}
              height={RING_SIZE}
              style={styles.ringLayer}
            >
              <Defs>
                <SvgLinearGradient id="progressStroke" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0" stopColor={vt.GOLD_SOFT} />
                  <Stop offset="1" stopColor={vt.GOLD} />
                </SvgLinearGradient>
              </Defs>
              <Circle
                cx={RING_CX}
                cy={RING_CY}
                r={PROGRESS_R}
                stroke={vt.TRACK}
                strokeWidth={5}
                fill="none"
              />
              <G rotation={-90} originX={RING_CX} originY={RING_CY}>
                <AnimatedCircle
                  cx={RING_CX}
                  cy={RING_CY}
                  r={PROGRESS_R}
                  stroke="url(#progressStroke)"
                  strokeWidth={5}
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${CIRC} ${CIRC}`}
                  animatedProps={progressCircleProps}
                />
              </G>
            </Svg>

            <Animated.View style={[styles.coreGlow, corePulseStyle]} pointerEvents="none">
              <LinearGradient
                colors={[vt.GOLD + '00', vt.GOLD + '44', vt.GOLD + '00']}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>

            <View style={styles.emblemWrap}>
              <LinearGradient
                colors={[vt.GOLD_DEEP, vt.GOLD, vt.GOLD_SOFT]}
                start={{ x: 0.15, y: 0 }}
                end={{ x: 0.9, y: 1 }}
                style={styles.emblemPlate}
              >
                <Text style={styles.emblemRupee}>₹</Text>
              </LinearGradient>
              <View style={[styles.emblemRim, { borderColor: vt.GOLD_SOFT + 'AA' }]} />
            </View>
          </View>
        </View>

        <Text style={[styles.brandCaps, { color: vt.TEXT }]}>KHARCHA</Text>
        <Animated.Text style={[styles.brandScript, { color: vt.GOLD }, titleAccentStyle]}>
          Split
        </Animated.Text>
        <Text style={[styles.tagline, { color: vt.TEXT_MUTED }]}>
          Your money, choreographed.
        </Text>

        <View style={styles.progressMeta}>
          <View style={[styles.progressTrack, { backgroundColor: vt.TRACK }]}>
            <Animated.View style={progressBarFillStyle}>
              <LinearGradient
                colors={[vt.GOLD_DEEP, vt.GOLD, vt.GOLD_SOFT]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </View>
          <View style={styles.progressRow}>
            <Text style={[styles.progressPct, { color: vt.GOLD }]}>{progressText}%</Text>
            <View style={[styles.vaultPip, { backgroundColor: vt.GOLD }]} />
            <Text style={[styles.statusLine, { color: vt.TEXT_MUTED }]}>{statusLabel}</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  auroraBlob: {
    ...StyleSheet.absoluteFillObject,
    top: '12%',
    height: '55%',
    opacity: 0.6,
  },
  scanBeam: {
    position: 'absolute',
    width: SCREEN_W * 0.55,
    height: SCREEN_H * 1.4,
    top: -SCREEN_H * 0.2,
    left: SCREEN_W * 0.22,
  },
  gridWrap: {
    ...StyleSheet.absoluteFillObject,
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth * 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
    zIndex: 4,
  },
  heroBlock: {
    marginBottom: 36,
  },
  ringsStack: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  coreGlow: {
    position: 'absolute',
    width: RING_SIZE * 0.5,
    height: RING_SIZE * 0.5,
    borderRadius: RING_SIZE * 0.25,
    alignSelf: 'center',
    top: RING_SIZE * 0.25,
  },
  emblemWrap: {
    position: 'absolute',
    width: 76,
    height: 76,
    alignSelf: 'center',
    top: RING_SIZE / 2 - 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emblemPlate: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 16,
  },
  emblemRim: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    borderWidth: 1.5,
    margin: -3,
  },
  emblemRupee: {
    fontSize: 38,
    fontWeight: '700',
    color: '#1A1510',
    marginTop: -2,
  },
  brandCaps: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 9,
    marginBottom: 2,
  },
  brandScript: {
    fontSize: 44,
    fontWeight: '300',
    fontStyle: 'italic',
    letterSpacing: 1,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.4,
    marginBottom: 40,
    textAlign: 'center',
  },
  progressMeta: {
    width: '100%',
    maxWidth: 340,
  },
  progressTrack: {
    height: 5,
    borderRadius: 100,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  progressPct: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
  },
  vaultPip: {
    width: 5,
    height: 5,
    borderRadius: 3,
    opacity: 0.85,
  },
  statusLine: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
    flexShrink: 1,
    textAlign: 'center',
  },
});

export default LoadingScreen;
