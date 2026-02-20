import { Dimensions, PixelRatio, Platform } from 'react-native';

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
