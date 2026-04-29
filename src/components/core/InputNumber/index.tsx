import React from 'react';
import {
  View,
  TextInput,
  Text,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../../../utils/colors';
import { createStyles } from '../sharedStyles';

interface InputNumberProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  placeholder?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

const InputNumberComponent = ({
  value,
  onChangeText,
  error,
  placeholder = 'Enter number',
  containerStyle,
  inputStyle,
}: InputNumberProps) => {
  const styles = createStyles();
  const { theme } = useTheme();

  const handleChangeText = (text: string) => {
    // Only allow numbers and decimal point
    const formattedText = text.replace(/[^0-9.]/g, '');
    // Prevent multiple decimal points
    if (formattedText.split('.').length > 2) return;
    onChangeText(formattedText);
  };

  return (
    <View>
      <View
        style={[
          styles.inputContainer,
          containerStyle,
          error && styles.inputError,
        ]}
      >
        <TextInput
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.PLACEHOLDER_COLOR}
          keyboardType="phone-pad"
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default React.memo(InputNumberComponent);
