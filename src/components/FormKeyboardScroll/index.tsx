import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  ViewStyle,
  ScrollViewProps,
} from 'react-native';

export interface FormKeyboardScrollProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  style?: ViewStyle;
  scrollProps?: Omit<ScrollViewProps, 'children' | 'contentContainerStyle'>;
  contentContainerStyle?: ViewStyle;
}

const FormKeyboardScroll: React.FC<FormKeyboardScrollProps> = ({
  children,
  header,
  style,
  scrollProps,
  contentContainerStyle,
}) => (
  <KeyboardAvoidingView
    style={[styles.flex, style]}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
  >
    {header}
    <ScrollView
      {...scrollProps}
      contentContainerStyle={[styles.content, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  </KeyboardAvoidingView>
);

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1, paddingBottom: 32 },
});

export default FormKeyboardScroll;
