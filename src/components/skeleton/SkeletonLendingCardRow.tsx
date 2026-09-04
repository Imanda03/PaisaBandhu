import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { ThemeColors } from '../../utils/colors';
import { scale, spacing, verticalScale } from '../../utils/responsive';
import { ShimmerBox } from './ShimmerBox';

type Props = { theme: ThemeColors };

/** Placeholder row matching lending card layout (avatar, copy, amounts). */
export const SkeletonLendingCardRow: React.FC<Props> = ({ theme }) => (
  <View
    style={[
      styles.rim,
      {
        backgroundColor: theme.BACKGROUND_LIGHT,
        borderColor: theme.BORDER_COLOR,
      },
    ]}
  >
    <ShimmerBox
      theme={theme}
      height={verticalScale(3)}
      borderRadius={scale(2)}
      style={{ width: '100%', marginBottom: 0 }}
    />
    <View style={styles.row}>
      <ShimmerBox
        theme={theme}
        width={scale(50)}
        height={scale(50)}
        borderRadius={scale(25)}
      />
      <View style={styles.mid}>
        <ShimmerBox
          theme={theme}
          height={scale(15)}
          borderRadius={scale(8)}
          style={{ width: '72%', marginBottom: spacing(8) }}
        />
        <ShimmerBox
          theme={theme}
          height={scale(11)}
          borderRadius={scale(6)}
          style={{ width: '55%', marginBottom: spacing(6) }}
        />
        <ShimmerBox
          theme={theme}
          height={verticalScale(5)}
          borderRadius={scale(4)}
          style={{ width: '100%', marginTop: spacing(4) }}
        />
        <ShimmerBox
          theme={theme}
          height={scale(10)}
          borderRadius={scale(5)}
          style={{ width: '48%', marginTop: spacing(6) }}
        />
      </View>
      <View style={styles.right}>
        <ShimmerBox
          theme={theme}
          height={scale(9)}
          borderRadius={scale(4)}
          style={{ width: scale(36), marginBottom: spacing(6) }}
        />
        <ShimmerBox
          theme={theme}
          height={scale(15)}
          borderRadius={scale(6)}
          style={{ width: scale(72), marginBottom: spacing(4) }}
        />
        <ShimmerBox theme={theme} height={scale(12)} borderRadius={scale(5)} style={{ width: scale(56) }} />
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  rim: {
    borderRadius: scale(20),
    borderWidth: StyleSheet.hairlineWidth,
    padding: scale(1.5),
    marginBottom: spacing(12),
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing(14),
    paddingHorizontal: spacing(14),
    gap: spacing(12),
  },
  mid: { flex: 1, minWidth: 0 },
  right: { alignItems: 'flex-end', minWidth: scale(76) },
});
