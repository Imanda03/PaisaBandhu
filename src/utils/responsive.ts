import { useMemo } from 'react';
import { Dimensions, PixelRatio, Platform, useWindowDimensions } from 'react-native';

// Base dimensions (iPhone 14 / standard reference)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

/**
 * Scale size proportionally to screen width (uses live dimensions for rotation support)
 */
export const scale = (size: number): number => {
  const { width } = Dimensions.get('window');
  return (width / BASE_WIDTH) * size;
};

/**
 * Scale size proportionally to screen height (uses live dimensions for rotation support)
 */
export const verticalScale = (size: number): number => {
  const { height } = Dimensions.get('window');
  return (height / BASE_HEIGHT) * size;
};

/**
 * Moderate scale - less aggressive for fonts (factor 0.5 = halfway between scaled and original)
 */
export const moderateScale = (size: number, factor = 0.5): number => {
  return size + (scale(size) - size) * factor;
};

/**
 * Responsive font size
 */
export const fontSize = (size: number): number => {
  const scaled = moderateScale(size, 0.4);
  return Math.round(PixelRatio.roundToNearestPixel(scaled));
};

/**
 * Get responsive spacing (padding, margin)
 */
export const spacing = (size: number): number => {
  return Math.round(scale(size));
};

/**
 * Get screen dimensions (live - updates on rotation)
 */
export const getDimensions = () => {
  const { width, height } = Dimensions.get('window');
  return {
    width,
    height,
    isSmallDevice: width < 375,
    isLargeDevice: width >= 414,
  };
};

/** Bottom tab bar layout: blends width + height so wide/short screens (tablets, landscape) stay touch-friendly */
export type NavBarLayout = {
  dockHeight: number;
  rimBorderRadius: number;
  rimPadding: number;
  innerBorderRadius: number;
  bottomOffset: number;
  horizontalInset: number;
  dockTrackPaddingH: number;
  dockTrackPaddingTop: number;
  dockTrackPaddingBottom: number;
  accentBottom: number;
  accentHeight: number;
  tabLabelWidth: number;
  tabBarItemPaddingV: number;
  activeButtonRadius: number;
  activeButtonMarginH: number;
  activeButtonPaddingV: number;
  activeButtonPaddingH: number;
  iconBase: number;
  iconFocusDelta: number;
  labelActivePt: number;
  labelInactivePt: number;
  tabLiftPx: number;
};

export function computeNavBarLayout(
  screenWidth: number,
  screenHeight: number,
): NavBarLayout {
  const wRatio = screenWidth / BASE_WIDTH;
  const hRatio = screenHeight / BASE_HEIGHT;

  const byHeight = hRatio * 78;
  const byWidth = wRatio * 52 * 0.82;
  const dockHeight = Math.round(
    Math.min(Math.max(byHeight, byWidth), 108),
  );

  const horizontalInset = Math.round(Math.min(wRatio * 12, 28));
  const bottomOffset = Math.round(Math.min(hRatio * 12, 22));

  const rimBorderRadius = Math.round(Math.min(wRatio * 34, dockHeight * 0.48));
  const rimPadding = Math.round(wRatio * 2.5);
  const innerBorderRadius = Math.max(rimBorderRadius - rimPadding, 8);

  const dockTrackPaddingH = Math.round(wRatio * 6);
  const dockTrackPaddingTop = Math.round(dockHeight * (4 / 72));
  const dockTrackPaddingBottom = Math.round(dockHeight * (14 / 72));

  const accentBottom = Math.round(dockHeight * (9 / 72));
  const accentHeight = Math.round(Math.max(wRatio * 4, 3));

  const tabLabelWidth = Math.round(Math.min(wRatio * 88, 120));
  const tabBarItemPaddingV = Math.round(hRatio * 4);

  const activeButtonRadius = Math.round(Math.min(wRatio * 20, dockHeight * 0.32));
  const activeButtonMarginH = Math.round(wRatio * 6);
  const activeButtonPaddingV = Math.round(Math.min(wRatio * 10, 15));
  const activeButtonPaddingH = Math.round(Math.min(wRatio * 16, 24));

  const iconBase = Math.round(Math.min(Math.max(wRatio * 24, 22), 32));
  const iconFocusDelta = screenWidth >= 560 ? 3 : 2;

  const isLargeWidth = screenWidth >= 560;
  const labelActivePt = isLargeWidth ? 14 : 13;
  const labelInactivePt = isLargeWidth ? 12 : 11;

  const tabLiftPx = Math.round(dockHeight * (4 / 72));

  return {
    dockHeight,
    rimBorderRadius,
    rimPadding,
    innerBorderRadius,
    bottomOffset,
    horizontalInset,
    dockTrackPaddingH,
    dockTrackPaddingTop,
    dockTrackPaddingBottom,
    accentBottom,
    accentHeight,
    tabLabelWidth,
    tabBarItemPaddingV,
    activeButtonRadius,
    activeButtonMarginH,
    activeButtonPaddingV,
    activeButtonPaddingH,
    iconBase,
    iconFocusDelta,
    labelActivePt,
    labelInactivePt,
    tabLiftPx,
  };
}

export function useNavBarLayout(): NavBarLayout {
  const { width, height } = useWindowDimensions();
  return useMemo(
    () => computeNavBarLayout(width, height),
    [width, height],
  );
}
