import { StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../utils/colors';

export const createStyles = () => {
  const { theme } = useTheme();

  const cardShadow = Platform.select({
    ios: {
      shadowColor: theme.PRIMARY,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 16,
    },
    android: { elevation: 4 },
  });

  const segmentShadow = Platform.select({
    ios: {
      shadowColor: theme.PRIMARY,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },
    android: { elevation: 2 },
  });

  const iconSelectedShadow = Platform.select({
    ios: {
      shadowColor: theme.SECONDARY,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
    },
    android: { elevation: 6 },
  });

  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
    },
    fixedTop: {
      flexShrink: 0,
    },
    fixedBottom: {
      flexShrink: 0,
      paddingTop: 16,
    },
    section: {
      marginBottom: 16,
      backgroundColor: theme.INPUT_BACKGROUND,
      borderRadius: 20,
      padding: 20,
      borderWidth: 1,
      borderColor: theme.BORDER_COLOR,
      ...cardShadow,
    },
    chooseIconRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
      paddingHorizontal: 4,
    },
    chooseIconLabel: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      opacity: 0.85,
    },
    iconScrollView: {
      flex: 1,
      minHeight: 0,
    },
    scrollContent: {
      paddingVertical: 16,
      paddingBottom: 24,
    },
    sectionLabel: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1.2,
      marginBottom: 14,
      textTransform: 'uppercase',
      opacity: 0.85,
    },
    label: {
      fontSize: 15,
      fontWeight: '600',
      marginBottom: 10,
      letterSpacing: 0.2,
    },
    typeWrapper: {
      flexDirection: 'row',
      borderRadius: 14,
      padding: 4,
      backgroundColor: theme.BACKGROUND,
      ...segmentShadow,
    },
    typeButton: {
      flex: 1,
      height: 48,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 12,
      marginHorizontal: 2,
    },
    typeButtonActive: {
      backgroundColor: theme.PURPLE,
      ...segmentShadow,
    },
    typeText: {
      fontSize: 16,
      fontWeight: '600',
      letterSpacing: 0.3,
    },
    typeTextActive: {
      color: theme.SECONDARY,
    },
    typeTextInactive: {
      color: theme.LIGHT_TEXT,
    },
    iconGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    iconButton: {
      width: '23%',
      marginHorizontal: '1%',
      marginVertical: 6,
      borderRadius: 16,
      borderWidth: 2,
      paddingVertical: 14,
      paddingHorizontal: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.BACKGROUND,
      minHeight: 72,
    },
    iconButtonSelected: {
      borderColor: theme.SECONDARY,
      backgroundColor: theme.INPUT_BACKGROUND,
      ...iconSelectedShadow,
    },
    iconButtonUnselected: {
      borderColor: 'transparent',
    },
    iconEmoji: {
      fontSize: 28,
      marginBottom: 6,
    },
    iconLabel: {
      fontSize: 11,
      fontWeight: '600',
      letterSpacing: 0.2,
      textAlign: 'center',
      maxWidth: '100%',
    },
    selectedChip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.BACKGROUND,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.BORDER_COLOR,
    },
    selectedChipEmoji: {
      fontSize: 20,
      marginRight: 8,
    },
    selectedChipLabel: {
      fontSize: 14,
      fontWeight: '600',
      letterSpacing: 0.2,
    },
    errorText: {
      color: theme.ERROR,
      fontSize: 13,
      marginLeft: 4,
      marginTop: 6,
      fontWeight: '500',
    },
  });
};
