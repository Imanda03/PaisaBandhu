import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import React from 'react';
import { createStyles } from './styles';
import { useTheme } from '../../../utils/colors';
import { EntypoIcon } from '../../../utils/Icons';

interface ButtonProps {
  title: string;
  onPress: () => void;
  iconName?: string;
  marginTop?: number;
  loading?: boolean;
}

const ButtonIconComponent = ({
  title,
  onPress,
  iconName,
  marginTop,
  loading,
}: ButtonProps) => {
  const styles = createStyles(iconName);
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { marginTop: marginTop ?? 0, opacity: loading ? 0.5 : 1 },
      ]}
      activeOpacity={0.7}
      onPress={onPress}
      disabled={loading}>
      {iconName && <View></View>}
      {loading ? (
        <ActivityIndicator size="small" color={theme.SECONDARY} />
      ) : (
        <>
          <Text style={styles.text}>{title}</Text>
          {iconName && (
            <EntypoIcon
              name={iconName}
              color={theme.SECONDARY}
              size={30}
              style={styles.icon}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

export default ButtonIconComponent;
