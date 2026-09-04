import { StyleSheet, Platform } from 'react-native';
import { fontSize, scale, spacing } from '../../utils/responsive';

export const createStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    topSection: {
      flexShrink: 0,
    },
    lead: {
      fontSize: fontSize(13),
      lineHeight: Math.round(fontSize(13) * 1.5),
      fontWeight: '600',
      marginBottom: spacing(14),
      paddingHorizontal: spacing(2),
    },
    typeBlock: {
      flexShrink: 0,
      marginBottom: spacing(12),
    },
    typeLabel: {
      fontSize: fontSize(11),
      fontWeight: '800',
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      marginBottom: spacing(10),
    },
    typeTrack: {
      flexDirection: 'row',
      borderRadius: scale(14),
      borderWidth: 1,
      padding: spacing(4),
      gap: spacing(4),
    },
    typeBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing(6),
      paddingVertical: spacing(14),
      borderRadius: scale(11),
      overflow: 'hidden',
      minHeight: scale(48),
    },
    typeBtnActive: {
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.12,
          shadowRadius: 4,
        },
        android: { elevation: 2 },
      }),
    },
    typeBtnText: {
      fontSize: fontSize(14),
      fontWeight: '800',
    },
    iconSectionRim: {
      flex: 1,
      minHeight: 0,
      borderRadius: scale(20),
      borderWidth: 1,
      padding: scale(1.5),
      marginBottom: spacing(12),
      overflow: 'hidden',
    },
    iconRimInner: {
      flex: 1,
      borderRadius: scale(18),
      overflow: 'hidden',
    },
    iconSectionFace: {
      flex: 1,
      borderRadius: scale(16),
      padding: spacing(14),
      minHeight: 0,
    },
    sectionLabel: {
      fontSize: fontSize(10),
      fontWeight: '800',
      letterSpacing: 1.4,
      textTransform: 'uppercase',
    },
    iconHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing(10),
      gap: spacing(10),
      flexShrink: 0,
    },
    selectedChip: {
      flexDirection: 'row',
      alignItems: 'center',
      maxWidth: '52%',
      paddingVertical: spacing(5),
      paddingHorizontal: spacing(10),
      borderRadius: scale(10),
      borderWidth: StyleSheet.hairlineWidth,
      gap: spacing(6),
    },
    chipEmoji: { fontSize: fontSize(18) },
    chipLabel: { fontSize: fontSize(12), fontWeight: '700', flexShrink: 1 },
    iconScroll: {
      flex: 1,
      minHeight: 0,
    },
    iconScrollContent: {
      flexGrow: 1,
      paddingBottom: spacing(8),
    },
    iconGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    iconCell: {
      width: '23%',
      marginBottom: spacing(10),
      borderRadius: scale(14),
      borderWidth: 2,
      paddingVertical: spacing(12),
      paddingHorizontal: spacing(4),
      alignItems: 'center',
      minHeight: scale(76),
      justifyContent: 'center',
    },
    iconEmoji: { fontSize: fontSize(26), marginBottom: spacing(4) },
    iconCellLabel: {
      fontSize: fontSize(9),
      fontWeight: '700',
      textAlign: 'center',
    },
    fixedBottom: {
      flexShrink: 0,
    },
    previewCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing(10),
      padding: spacing(12),
      borderRadius: scale(14),
      borderWidth: StyleSheet.hairlineWidth,
      marginBottom: spacing(12),
    },
    previewText: {
      flex: 1,
      fontSize: fontSize(14),
      fontWeight: '600',
    },
    ctaWrap: { borderRadius: scale(16), overflow: 'hidden' },
    ctaBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing(8),
      paddingVertical: spacing(16),
      ...Platform.select({
        ios: {
          shadowColor: '#C6A56B',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.35,
          shadowRadius: 12,
        },
        android: { elevation: 8 },
      }),
    },
    ctaText: {
      fontSize: fontSize(16),
      fontWeight: '800',
      letterSpacing: 0.3,
    },
  });
