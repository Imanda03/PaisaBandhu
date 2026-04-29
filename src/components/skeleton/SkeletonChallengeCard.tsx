import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { ThemeColors } from '../../utils/colors';
import { scale, spacing } from '../../utils/responsive';
import { ShimmerBox } from './ShimmerBox';

type Props = { theme: ThemeColors };

export const SkeletonChallengeCard: React.FC<Props> = ({ theme }) => (
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
      height={scale(16)}
      borderRadius={scale(8)}
      style={{ width: '78%', marginBottom: spacing(10) }}
    />
    <ShimmerBox
      theme={theme}
      height={scale(12)}
      borderRadius={scale(6)}
      style={{ width: '85%', marginBottom: spacing(6) }}
    />
    <ShimmerBox
      theme={theme}
      height={scale(12)}
      borderRadius={scale(6)}
      style={{ width: '55%' }}
    />
  </View>
);

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: scale(20),
    padding: spacing(16),
    marginBottom: spacing(12),
    borderWidth: StyleSheet.hairlineWidth,
  },
});
