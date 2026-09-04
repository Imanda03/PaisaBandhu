import React, { useEffect } from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';
import { formatAmountNumber } from '../../utils/currency';

export interface AnimatedNumberProps {
  value: number;
  duration?: number;
  formatter?: (value: number) => string;
  style?: StyleProp<TextStyle>;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 800,
  formatter = (v) => formatAmountNumber(Math.round(v), { maximumFractionDigits: 0 }),
  style,
}) => {
  const [display, setDisplay] = React.useState('0');

  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = value * eased;
      setDisplay(formatter(current));
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  }, [value, duration, formatter]);

  return <Text style={style}>{display}</Text>;
};

export default AnimatedNumber;
