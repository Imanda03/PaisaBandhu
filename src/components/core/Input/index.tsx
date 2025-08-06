import React, {useState, useCallback} from 'react';
import {
  View,
  TextInput,
  Pressable,
  Text,
  KeyboardTypeOptions,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {createStyles} from './styles';
import {useTheme} from '../../../utils/colors';

interface InputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  error?: string;
}

const InputComponent = React.memo(
  ({
    placeholder,
    value,
    onChangeText,
    secureTextEntry,
    keyboardType,
    error,
  }: InputProps) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const styles = createStyles();
    const {theme} = useTheme();

    const onEyePress = useCallback(() => {
      setIsPasswordVisible(prev => !prev);
    }, []);

    return (
      <View>
        <View style={[styles.inputContainer, error && styles.inputError]}>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={theme.PLACEHOLDER_COLOR}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry && !isPasswordVisible}
            keyboardType={keyboardType ?? 'default'}
          />
          {secureTextEntry && (
            <Pressable onPress={onEyePress} style={styles.eyeIcon}>
              <Entypo
                name={isPasswordVisible ? 'eye' : 'eye-with-line'}
                size={22}
                color={theme.TEXT}
              />
            </Pressable>
          )}
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  },
);

export default InputComponent;
