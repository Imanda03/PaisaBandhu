import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AuthHeader from '../../../../components/core/AuthHeader';
import AddCategoryForm from '../../../../components/CategoryForm';
import { useTheme } from '../../../../utils/colors';
import { scale, spacing } from '../../../../utils/responsive';

const AddCategories = React.memo(() => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { backgroundColor: theme.HEADER_GRADIENT[0] }]}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[...theme.HEADER_GRADIENT]}
        style={[styles.header, { paddingTop: insets.top }]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <AuthHeader title="New category" />
      </LinearGradient>

      <View
        style={[
          styles.sheet,
          {
            backgroundColor: theme.BACKGROUND,
            paddingBottom: insets.bottom + spacing(12),
          },
        ]}
      >
        <View style={styles.handleWrap}>
          <View style={[styles.handle, { backgroundColor: theme.BORDER_COLOR }]} />
        </View>
        <View style={styles.formWrap}>
          <AddCategoryForm />
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingBottom: spacing(12) },
  sheet: {
    flex: 1,
    borderTopLeftRadius: scale(28),
    borderTopRightRadius: scale(28),
    marginTop: -spacing(6),
    overflow: 'hidden',
  },
  handleWrap: { alignItems: 'center', paddingTop: spacing(10), paddingBottom: spacing(4) },
  handle: {
    width: scale(40),
    height: scale(4),
    borderRadius: scale(2),
    opacity: 0.5,
  },
  formWrap: {
    flex: 1,
    paddingHorizontal: spacing(20),
    minHeight: 0,
  },
});

AddCategories.displayName = 'AddCategories';
export default AddCategories;
