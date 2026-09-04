import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '../../../../../utils/Icons';
import { useTheme } from '../../../../../utils/colors';
import { scale, spacing, fontSize } from '../../../../../utils/responsive';

const SpendingEmptyState: React.FC = () => {
  const { theme } = useTheme();
  return (
    <View style={[styles.root, { borderColor: theme.BORDER_COLOR }]}>
      <MaterialIcons
        name="pie-chart-outline"
        size={scale(40)}
        color={theme.SECONDARY}
        style={styles.icon}
      />
      <Text style={[styles.title, { color: theme.TEXT }]}>
        No spending data for this period
      </Text>
      <Text style={[styles.body, { color: theme.LIGHT_TEXT }]}>
        Expenses in this period will appear here with a clean breakdown.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing(28),
    paddingHorizontal: spacing(20),
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: scale(16),
    marginTop: spacing(12),
  },
  icon: { marginBottom: spacing(12) },
  title: {
    fontSize: fontSize(15),
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing(6),
  },
  body: {
    fontSize: fontSize(13),
    textAlign: 'center',
    lineHeight: fontSize(19),
  },
});

export default SpendingEmptyState;
