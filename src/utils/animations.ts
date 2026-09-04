import { Easing } from 'react-native-reanimated';

export const springConfig = { damping: 16, stiffness: 160, mass: 0.8 };

export const timingConfig = { duration: 280, easing: Easing.out(Easing.cubic) };

export const microSpring = { damping: 20, stiffness: 300 };

export const staggerDelayMs = (index: number) => index * 50;
