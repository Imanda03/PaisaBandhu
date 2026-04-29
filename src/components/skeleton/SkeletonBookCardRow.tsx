import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { ThemeColors } from '../../utils/colors';
import { scale, spacing } from '../../utils/responsive';
import { ShimmerBox } from './ShimmerBox';

type Props = { theme: ThemeColors };

export const SkeletonBookCardRow: React.FC<Props> = ({ theme }) => (
  <View
    style={[
      styles.card,
      {
        backgroundColor: theme.BACKGROUND_LIGHT,
        borderColor: theme.BORDER_COLOR,
      },
    ]}
  >
    <ShimmerBox
      theme={theme}
      width={scale(64)}
      height={scale(64)}
      borderRadius={scale(16)}
    />
    <View style={styles.content}>
      <ShimmerBox
        theme={theme}
        height={scale(16)}
        borderRadius={scale(8)}
        style={{ width: '78%', marginBottom: spacing(8) }}
      />
      <ShimmerBox
        theme={theme}
        height={scale(12)}
        borderRadius={scale(6)}
        style={{ width: '70%', marginBottom: spacing(6) }}
      />
      <ShimmerBox
        theme={theme}
        height={scale(12)}
        borderRadius={scale(6)}
        style={{ width: '45%' }}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    width: '100%',
    borderRadius: scale(20),
    padding: spacing(14),
    marginBottom: spacing(12),
    borderWidth: StyleSheet.hairlineWidth,
  },
  content: {
    flex: 1,
    marginLeft: spacing(12),
    justifyContent: 'center',
  },
});
