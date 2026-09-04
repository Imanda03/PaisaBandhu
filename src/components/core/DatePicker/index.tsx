import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../../utils/colors';
import { createStyles } from '../sharedStyles';

interface DatePickerProps {
  value?: Date;
  onChanged: (date: Date) => void;
  error?: string;
  placeholder?: string;
}

const DatePickerComponent = ({
  value,
  onChanged,
  error,
  placeholder = 'Select date',
}: DatePickerProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const styles = createStyles();

  return (
    <View>
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={[styles.inputContainer, error && styles.inputError]}>
        <Text style={value ? styles.dateText : styles.placeholderText}>
          {value ? value.toLocaleDateString() : placeholder}
        </Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={value ?? new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) {
              onChanged(new Date(selectedDate));
            }
          }}
        />
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default React.memo(DatePickerComponent);
