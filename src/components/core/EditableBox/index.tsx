import React, { useState } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { createStyles } from './styles';
import { useTheme } from '../../../utils/colors';

interface InputProps {
  value: string | undefined;
  onChangeText: (text: string) => void;
  keyboardType?: string;
  error?: string;
  editable?: boolean;
  label?: string;
}

const InputComponent = ({
  value,
  onChangeText,
  error,
  editable = true,
  label,
}: InputProps) => {
  const styles = createStyles();
  const { theme } = useTheme();
  return (
    <View style={{ opacity: !editable ? 0.5 : 1 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={theme.PLACEHOLDER_COLOR}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default React.memo(InputComponent);
