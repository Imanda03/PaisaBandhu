import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ADS_ENABLED } from '../../config/ads';

type BannerPlacement = 'home' | 'books' | 'challenges';

type Props = {
  placement?: BannerPlacement;
};

const BannerAdView: React.FC<Props> = () =>
  ADS_ENABLED ? <View style={styles.placeholder} /> : null;

const styles = StyleSheet.create({
  placeholder: {
    height: 0,
  },
});

export default BannerAdView;

