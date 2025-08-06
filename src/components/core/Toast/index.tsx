import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View, Easing } from 'react-native';
import { useTheme } from '../../../utils/colors';
import { FontAwesome5Icon } from '../../../utils/Icons';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onHide?: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 2000,
  onHide,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  const { theme } = useTheme();

  useEffect(() => {
    if (message) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5)),
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -20,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (onHide) onHide();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration, fadeAnim, translateY, onHide]);

  if (!message) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: 'check-circle',
          color: theme.SUCCESS,
          bgColor: theme.SUCCESS_LIGHT,
        };
      case 'error':
        return {
          icon: 'exclamation-circle',
          color: theme.ERROR,
          bgColor: theme.ERROR_LIGHT,
        };
      case 'warning':
        return {
          icon: 'info-circle',
          color: theme.WARNING,
          bgColor: theme.WARNING_LIGHT,
        };
      default:
        return {
          icon: 'info-circle',
          color: theme.WARNING,
          bgColor: theme.WARNING_LIGHT,
        };
    }
  };

  const { icon, color, bgColor } = getTypeStyles();

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View
        style={[
          styles.toast,
          {
            opacity: fadeAnim,
            transform: [{ translateY }],
            backgroundColor: bgColor,
          },
        ]}>
        <FontAwesome5Icon
          name={icon}
          size={26}
          color={color}
          style={styles.icon}
        />
        <Text style={[styles.text, { color }]}>{message}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '90%',
    height: '100%',
  },
  icon: {
    marginRight: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Toast;
