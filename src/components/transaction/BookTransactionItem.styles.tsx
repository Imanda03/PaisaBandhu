import { StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../utils/colors';
import { scale, fontSize, spacing } from '../../utils/responsive';

export const createStyles = () => {
    const { theme, isDark } = useTheme();

    return StyleSheet.create({
        transactionItem: {
            paddingHorizontal: 0,
            paddingVertical: 0,
        },
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.BACKGROUND_LIGHT,
            borderRadius: scale(20),
            paddingVertical: spacing(14),
            paddingHorizontal: spacing(16),
            marginVertical: spacing(2),
            borderWidth: 1,
            borderColor: isDark
                ? 'rgba(198, 165, 107, 0.12)'
                : theme.BORDER_COLOR + '30',
            shadowColor: theme.SHADOW,
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: isDark ? 0.22 : 0.08,
            shadowRadius: 12,
            elevation: 4,
        },
        iconWrapper: {
            width: scale(52),
            height: scale(52),
            borderRadius: scale(16),
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: spacing(14),
            ...Platform.select({
                ios: {
                    shadowColor: theme.SECONDARY,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                },
                android: {
                    elevation: 2,
                },
            }),
        },
        iconContainer: {
            width: scale(48),
            height: scale(48),
            borderRadius: scale(14),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.BACKGROUND_LIGHT,
            borderWidth: 1,
            borderColor: isDark
                ? 'rgba(255,255,255,0.08)'
                : theme.BORDER_COLOR + '25',
        },
        icon: {
            fontSize: scale(22),
        },
        contentWrapper: {
            flex: 1,
            marginRight: spacing(10),
            justifyContent: 'center',
        },
        titleRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: spacing(8),
        },
        title: {
            flex: 1,
            fontSize: fontSize(16),
            fontWeight: '700',
            color: theme.TEXT,
            letterSpacing: 0.15,
            lineHeight: fontSize(21),
        },
        categoryBadge: {
            backgroundColor: isDark ? theme.SECONDARY + '28' : theme.PURPLE + '18',
            borderRadius: scale(8),
            paddingHorizontal: spacing(8),
            paddingVertical: spacing(4),
            marginRight: spacing(8),
            borderWidth: 1,
            borderColor: isDark ? theme.SECONDARY + '45' : theme.PURPLE + '30',
        },
        categoryText: {
            fontSize: fontSize(10),
            fontWeight: '800',
            color: isDark ? theme.SECONDARY : theme.PURPLE,
            letterSpacing: 0.6,
            textTransform: 'uppercase',
        },
        metaRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing(10),
            flexWrap: 'wrap',
        },
        metaItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing(4),
        },
        metaIcon: {
            opacity: 0.7,
        },
        dateText: {
            fontSize: fontSize(11),
            fontWeight: '600',
            color: theme.LIGHT_TEXT,
            opacity: 0.8,
        },
        friendText: {
            fontSize: fontSize(11),
            fontWeight: '600',
            color: theme.LIGHT_TEXT,
            opacity: 0.88,
        },
        priceWrapper: {
            alignItems: 'flex-end',
            justifyContent: 'center',
        },
        priceContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: spacing(12),
            paddingVertical: spacing(8),
            borderRadius: scale(12),
            gap: spacing(6),
            borderWidth: 1,
            borderColor: theme.BORDER_COLOR + '25',
            backgroundColor: isDark ? theme.BACKGROUND + '80' : theme.BACKGROUND,
            ...Platform.select({
                ios: {
                    shadowColor: theme.SHADOW,
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.08,
                    shadowRadius: 4,
                },
                android: {
                    elevation: 1,
                },
            }),
        },
        priceIcon: {
            marginTop: 1,
        },
        price: {
            fontSize: fontSize(16),
            fontWeight: '800',
            letterSpacing: 0.2,
            lineHeight: fontSize(19),
        },
        rightActionWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: spacing(8),
            gap: spacing(8),
            backgroundColor: 'transparent',
            paddingVertical: spacing(4),
        },
        actionButton: {
            width: scale(44),
            height: scale(44),
            borderRadius: scale(14),
            alignItems: 'center',
            justifyContent: 'center',
            ...Platform.select({
                ios: {
                    shadowColor: theme.SHADOW,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                },
                android: {
                    elevation: 3,
                },
            }),
        },
        viewButton: {
            backgroundColor: theme.PURPLE,
        },
        deleteButton: {
            backgroundColor: theme.ERROR,
        },
    });
};
