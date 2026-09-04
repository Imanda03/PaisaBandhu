import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { ThemeColors } from '../../utils/colors';
import { scale, spacing } from '../../utils/responsive';
import { ShimmerBox } from './ShimmerBox';

type Props = { theme: ThemeColors };

/** Placeholder for lent / borrowed / settled segment control. */
export const SkeletonLendingSegmentTabs: React.FC<Props> = ({ theme }) => (
  <View
    style={[
      styles.track,
      {
        borderColor: theme.BORDER_COLOR,
        backgroundColor: theme.BACKGROUND_LIGHT,
      },
    ]}
  >
    {[0, 1, 2].map(i => (
      <View key={i} style={styles.segmentCell}>
        <ShimmerBox theme={theme} height={scale(38)} borderRadius={scale(12)} style={styles.segmentShimmer} />
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    borderRadius: scale(16),
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing(4),
    marginBottom: spacing(18),
    gap: spacing(4),
  },
  segmentCell: { flex: 1 },
  segmentShimmer: { width: '100%' },
});
