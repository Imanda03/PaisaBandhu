import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { ThemeColors } from '../../utils/colors';
import { scale, spacing, verticalScale } from '../../utils/responsive';
import { ShimmerBox } from './ShimmerBox';

type Props = { theme: ThemeColors };

/** Placeholder for the lending vault summary card. */
export const SkeletonLendingSummaryBlock: React.FC<Props> = ({ theme }) => (
  <View
    style={[
      styles.outer,
      {
        backgroundColor: theme.BACKGROUND_LIGHT,
        borderColor: theme.BORDER_COLOR,
      },
    ]}
  >
    <View style={[styles.inner, { backgroundColor: theme.BACKGROUND }]}>
      <ShimmerBox
        theme={theme}
        height={verticalScale(2.5)}
        borderRadius={1}
        style={{ width: '100%', marginBottom: spacing(10) }}
      />
      <View style={styles.topRow}>
        <ShimmerBox theme={theme} width={scale(30)} height={scale(30)} borderRadius={scale(10)} />
        <View style={styles.topCopy}>
          <ShimmerBox
            theme={theme}
            height={scale(10)}
            borderRadius={scale(5)}
            style={{ width: '38%', marginBottom: spacing(6) }}
          />
          <ShimmerBox theme={theme} height={scale(11)} borderRadius={scale(5)} style={{ width: '52%' }} />
        </View>
        <ShimmerBox theme={theme} width={scale(28)} height={scale(28)} borderRadius={scale(9)} />
      </View>
      <ShimmerBox
        theme={theme}
        height={scale(28)}
        borderRadius={scale(8)}
        style={{ width: '62%', marginBottom: spacing(12) }}
      />
      <View style={[styles.strip, { borderColor: theme.BORDER_COLOR }]}>
        <View style={styles.stripHalf}>
          <ShimmerBox
            theme={theme}
            height={scale(10)}
            borderRadius={scale(5)}
            style={{ width: '50%', marginBottom: spacing(6) }}
          />
          <ShimmerBox theme={theme} height={scale(14)} borderRadius={scale(6)} style={{ width: '70%' }} />
        </View>
        <View style={[styles.divider, { backgroundColor: theme.BORDER_COLOR }]} />
        <View style={styles.stripHalf}>
          <ShimmerBox
            theme={theme}
            height={scale(10)}
            borderRadius={scale(5)}
            style={{ width: '50%', marginBottom: spacing(6) }}
          />
          <ShimmerBox theme={theme} height={scale(14)} borderRadius={scale(6)} style={{ width: '70%' }} />
        </View>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  outer: {
    borderRadius: scale(18),
    borderWidth: StyleSheet.hairlineWidth,
    padding: scale(1),
    marginBottom: spacing(18),
    overflow: 'hidden',
  },
  inner: {
    borderRadius: scale(16),
    paddingHorizontal: spacing(14),
    paddingVertical: spacing(12),
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(10),
    marginBottom: spacing(8),
  },
  topCopy: { flex: 1 },
  strip: {
    flexDirection: 'row',
    borderRadius: scale(12),
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  stripHalf: {
    flex: 1,
    paddingVertical: spacing(10),
    paddingHorizontal: spacing(10),
    alignItems: 'center',
  },
  divider: { width: StyleSheet.hairlineWidth },
});
