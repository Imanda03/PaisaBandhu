import React from 'react';
import {View, TextInput, Text} from 'react-native';
import {createStyles} from '../sharedStyles';
import {useTheme} from '../../../utils/colors';

interface TextAreaProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  placeholder?: string;
  numberOfLines?: number;
}

const TextAreaComponent = ({
  value,
  onChangeText,
  error,
  placeholder = 'Enter text',
  numberOfLines = 4,
}: TextAreaProps) => {
  const styles = createStyles();
  const {theme} = useTheme();

  return (
    <View>
      <View
        style={[
          styles.inputContainer,
          styles.textAreaContainer,
          error && styles.inputError,
        ]}>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.PLACEHOLDER_COLOR}
          multiline
          numberOfLines={numberOfLines}
          textAlignVertical="top"
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default React.memo(TextAreaComponent);
