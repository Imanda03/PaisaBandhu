import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { ThemeColors } from '../../utils/colors';
import { scale, spacing, verticalScale } from '../../utils/responsive';
import { IoniconsIcon } from '../../utils/Icons';
import { ShimmerBox } from './ShimmerBox';

type Props = {
  theme: ThemeColors;
  paddingTop: number;
  paddingBottom: number;
  headerGradient: ThemeColors['HEADER_GRADIENT'];
};

/**
 * Full-screen placeholder matching lending detail layout (header, hero, meta, history block).
 */
export const SkeletonLendingDetail: React.FC<Props> = ({
  theme,
  paddingTop,
  paddingBottom,
  headerGradient,
}) => {
  const navigation = useNavigation();
  const headerColors = [...headerGradient] as string[];

  return (
    <View style={[styles.root, { backgroundColor: headerColors[0] }]}>
      <LinearGradient
        colors={headerColors}
        style={[styles.headerGrad, { paddingTop }]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
            <IoniconsIcon name="arrow-back" color={theme.SECONDARY} size={30} />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <ShimmerBox
              theme={theme}
              height={scale(22)}
              borderRadius={scale(8)}
              style={{ width: '58%', marginBottom: spacing(8) }}
            />
            <ShimmerBox theme={theme} height={scale(12)} borderRadius={scale(6)} style={{ width: '36%' }} />
          </View>
          <View style={styles.headerIcons}>
            <ShimmerBox theme={theme} width={scale(40)} height={scale(40)} borderRadius={scale(12)} />
            <ShimmerBox theme={theme} width={scale(40)} height={scale(40)} borderRadius={scale(12)} />
          </View>
        </View>
      </LinearGradient>

      <View style={[styles.sheet, { backgroundColor: theme.BACKGROUND }]}>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: paddingBottom + spacing(32) }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.heroRim, { borderColor: theme.BORDER_COLOR }]}>
            <View style={[styles.heroInner, { backgroundColor: theme.BACKGROUND_LIGHT }]}>
              <ShimmerBox
                theme={theme}
                height={verticalScale(4)}
                borderRadius={2}
                style={{ width: '100%' }}
              />
              <ShimmerBox
                theme={theme}
                height={verticalScale(3)}
                borderRadius={2}
                style={{ width: '100%', marginTop: verticalScale(2) }}
              />
              <View style={[styles.heroPad, { backgroundColor: theme.BACKGROUND }]}>
                <View style={styles.badges}>
                  <ShimmerBox theme={theme} height={scale(28)} borderRadius={scale(10)} style={{ width: scale(56) }} />
                  <ShimmerBox theme={theme} height={scale(28)} borderRadius={scale(10)} style={{ width: scale(88) }} />
                </View>
                <ShimmerBox
                  theme={theme}
                  height={scale(11)}
                  borderRadius={scale(5)}
                  style={{ width: '32%', marginBottom: spacing(8) }}
                />
                <ShimmerBox
                  theme={theme}
                  height={scale(36)}
                  borderRadius={scale(10)}
                  style={{ width: '72%', marginBottom: spacing(14) }}
                />
                <ShimmerBox
                  theme={theme}
                  height={verticalScale(8)}
                  borderRadius={scale(5)}
                  style={{ width: '100%', marginBottom: spacing(10) }}
                />
                <View style={styles.progressMeta}>
                  <ShimmerBox theme={theme} height={scale(16)} borderRadius={scale(6)} style={{ width: '48%' }} />
                  <ShimmerBox theme={theme} height={scale(12)} borderRadius={scale(5)} style={{ width: '55%' }} />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.metaGrid}>
            <ShimmerBox
              theme={theme}
              height={scale(72)}
              borderRadius={scale(16)}
              style={{ flex: 1, borderWidth: StyleSheet.hairlineWidth, borderColor: theme.BORDER_COLOR }}
            />
            <ShimmerBox
              theme={theme}
              height={scale(72)}
              borderRadius={scale(16)}
              style={{ flex: 1, borderWidth: StyleSheet.hairlineWidth, borderColor: theme.BORDER_COLOR }}
            />
          </View>

          <View style={styles.sectionRow}>
            <ShimmerBox theme={theme} width={scale(40)} height={scale(40)} borderRadius={scale(14)} />
            <View style={styles.sectionCopy}>
              <ShimmerBox
                theme={theme}
                height={scale(17)}
                borderRadius={scale(8)}
                style={{ width: '52%', marginBottom: spacing(6) }}
              />
              <ShimmerBox theme={theme} height={scale(12)} borderRadius={scale(6)} style={{ width: '40%' }} />
            </View>
          </View>

          <View style={[styles.timelineRim, { borderColor: theme.BORDER_COLOR }]}>
            <View style={[styles.timelineInner, { backgroundColor: theme.BACKGROUND_LIGHT }]}>
              {[0, 1, 2].map(i => (
                <View
                  key={i}
                  style={[
                    styles.timelineRow,
                    i < 2 && {
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: theme.BORDER_COLOR + '44',
                    },
                  ]}
                >
                  <ShimmerBox theme={theme} width={scale(22)} height={scale(22)} borderRadius={scale(11)} />
                  <View style={styles.timelineBody}>
                    <ShimmerBox
                      theme={theme}
                      height={scale(16)}
                      borderRadius={scale(6)}
                      style={{ width: '44%', marginBottom: spacing(6) }}
                    />
                    <ShimmerBox theme={theme} height={scale(12)} borderRadius={scale(5)} style={{ width: '62%' }} />
                  </View>
                  <ShimmerBox theme={theme} height={scale(26)} borderRadius={scale(10)} style={{ width: scale(48) }} />
                </View>
              ))}
            </View>
          </View>

          <ShimmerBox
            theme={theme}
            height={scale(52)}
            borderRadius={scale(16)}
            style={{ width: '100%', marginTop: spacing(22) }}
          />
          <ShimmerBox
            theme={theme}
            height={scale(48)}
            borderRadius={scale(16)}
            style={{ width: '100%', marginTop: spacing(12) }}
          />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerGrad: { paddingBottom: spacing(14) },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingRight: spacing(16),
    gap: spacing(10),
  },
  headerTitles: { flex: 1, paddingTop: spacing(4), paddingLeft: spacing(4) },
  headerIcons: { flexDirection: 'row', gap: spacing(8), paddingTop: spacing(8) },
  sheet: {
    flex: 1,
    borderTopLeftRadius: scale(28),
    borderTopRightRadius: scale(28),
    marginTop: -spacing(8),
    overflow: 'hidden',
  },
  content: { paddingHorizontal: spacing(20), paddingTop: spacing(20) },
  heroRim: {
    borderRadius: scale(24),
    borderWidth: 1,
    padding: scale(1.5),
    marginBottom: spacing(16),
    overflow: 'hidden',
  },
  heroInner: { borderRadius: scale(20), overflow: 'hidden' },
  heroPad: { padding: spacing(22) },
  badges: { flexDirection: 'row', gap: spacing(8), marginBottom: spacing(16) },
  progressMeta: { gap: spacing(6) },
  metaGrid: { flexDirection: 'row', gap: spacing(10), marginBottom: spacing(12) },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(12),
    marginTop: spacing(8),
    marginBottom: spacing(12),
  },
  sectionCopy: { flex: 1 },
  timelineRim: {
    borderRadius: scale(20),
    borderWidth: 1,
    padding: scale(1.5),
    overflow: 'hidden',
    marginTop: spacing(4),
  },
  timelineInner: { borderRadius: scale(16), paddingVertical: spacing(8), paddingHorizontal: spacing(12) },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(12),
    paddingVertical: spacing(14),
  },
  timelineBody: { flex: 1 },
});
