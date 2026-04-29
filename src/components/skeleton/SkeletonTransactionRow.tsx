import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { ThemeColors } from '../../utils/colors';
import { scale, spacing } from '../../utils/responsive';
import { ShimmerBox } from './ShimmerBox';

type Props = { theme: ThemeColors };

export const SkeletonTransactionRow: React.FC<Props> = ({ theme }) => (
  <View
    style={[
      styles.row,
      {
        backgroundColor: theme.BACKGROUND_LIGHT,
        borderColor: theme.BORDER_COLOR,
      },
    ]}
  >
    <ShimmerBox
      theme={theme}
      width={scale(40)}
      height={scale(40)}
      borderRadius={scale(20)}
    />
    <View style={styles.body}>
      <ShimmerBox
        theme={theme}
        height={scale(12)}
        borderRadius={scale(6)}
        style={{ width: '75%', marginBottom: spacing(6) }}
      />
      <ShimmerBox
        theme={theme}
        height={scale(10)}
        borderRadius={scale(5)}
        style={{ width: '55%' }}
      />
    </View>
    <ShimmerBox
      theme={theme}
      height={scale(14)}
      borderRadius={scale(7)}
      style={{ width: scale(56), marginLeft: spacing(8) }}
    />
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderRadius: scale(18),
    paddingHorizontal: spacing(14),
    paddingVertical: spacing(10),
    marginBottom: spacing(10),
    borderWidth: StyleSheet.hairlineWidth,
  },
  body: {
    flex: 1,
    marginLeft: spacing(12),
  },
});
