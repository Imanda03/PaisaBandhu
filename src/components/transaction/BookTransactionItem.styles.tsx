import { StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../utils/colors';

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
            borderRadius: 16,
            padding: 14,
            marginVertical: 4,
            borderWidth: 1,
            borderColor: theme.BORDER_COLOR + '25',
            shadowColor: theme.SHADOW,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 3,
        },
        iconWrapper: {
            width: 48,
            height: 48,
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
            ...Platform.select({
                ios: {
                    shadowColor: theme.SHADOW,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.12,
                    shadowRadius: 6,
                },
                android: {
                    elevation: 2,
                },
            }),
        },
        iconContainer: {
            width: 44,
            height: 44,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.BACKGROUND_LIGHT,
            borderWidth: 1.5,
        },
        icon: {
            fontSize: 22,
        },
        contentWrapper: {
            flex: 1,
            marginRight: 10,
            justifyContent: 'center',
        },
        titleRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 7,
        },
        title: {
            flex: 1,
            fontSize: 15.5,
            fontWeight: '700',
            color: theme.TEXT,
            letterSpacing: 0.2,
            lineHeight: 20,
        },
        categoryBadge: {
            backgroundColor: isDark ? theme.SECONDARY + '30' : theme.PURPLE + '20',
            borderRadius: 6,
            paddingHorizontal: 7,
            paddingVertical: 3,
            marginRight: 8,
            borderWidth: 0.5,
            borderColor: isDark ? theme.SECONDARY + '50' : theme.PURPLE + '35',
        },
        categoryText: {
            fontSize: 10,
            fontWeight: '700',
            color: isDark ? theme.SECONDARY : theme.PURPLE,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
        },
        metaRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            flexWrap: 'wrap',
        },
        metaItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        metaIcon: {
            opacity: 0.7,
        },
        dateText: {
            fontSize: 10.5,
            fontWeight: '500',
            color: theme.LIGHT_TEXT,
            opacity: 0.75,
        },
        friendText: {
            fontSize: 10.5,
            fontWeight: '600',
            color: theme.LIGHT_TEXT,
            opacity: 0.85,
        },
        priceWrapper: {
            alignItems: 'flex-end',
            justifyContent: 'center',
        },
        priceContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 10,
            gap: 5,
            borderWidth: 1,
            borderColor: theme.BORDER_COLOR + '20',
            ...Platform.select({
                ios: {
                    shadowColor: theme.SHADOW,
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
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
            fontSize: 15,
            fontWeight: '800',
            letterSpacing: 0.3,
            lineHeight: 18,
        },
        rightActionWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: 8,
            gap: 6,
            backgroundColor: 'transparent',
            paddingVertical: 4,
        },
        actionButton: {
            width: 42,
            height: 42,
            borderRadius: 12,
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
