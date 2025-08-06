import React from 'react';
import { View, TextInput, Text } from 'react-native';
import { useTheme } from '../../../utils/colors';
import { createStyles } from '../sharedStyles';

interface InputNumberProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  placeholder?: string;
}

const InputNumberComponent = ({
  value,
  onChangeText,
  error,
  placeholder = 'Enter number',
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
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <TextInput
          style={styles.input}
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
