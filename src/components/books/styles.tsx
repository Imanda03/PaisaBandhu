import { StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../utils/colors';

export const createStyles = () => {
    const { theme } = useTheme();

    return StyleSheet.create({
        cardContainer: {
            backgroundColor: theme.BACKGROUND_LIGHT,
            borderRadius: 18,
            marginHorizontal: 0,
            marginVertical: 0,
            padding: 18,
            borderWidth: 1.5,
            borderColor: theme.BORDER_COLOR + '40',
            shadowColor: theme.SHADOW,
            shadowOffset: {
                width: 0,
                height: 3,
            },
            shadowOpacity: 0.1,
            shadowRadius: 14,
            elevation: 5,
        },
        contentContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        leftSection: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },
        rightSection: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        iconContainer: {
            width: 50,
            height: 50,
            borderRadius: 14,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 14,
            ...Platform.select({
                ios: {
                    shadowColor: theme.SHADOW,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.12,
                    shadowRadius: 8,
                },
                android: {
                    elevation: 3,
                },
            }),
        },
        textContainer: {
            flex: 1,
            justifyContent: 'center',
        },
        title: {
            fontSize: 17,
            fontWeight: '700',
            marginBottom: 5,
            letterSpacing: 0.15,
            color: theme.TEXT,
        },
        subtitleContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
        },
        subtitle: {
            fontSize: 13,
            fontWeight: '500',
            color: theme.LIGHT_TEXT,
            opacity: 0.75,
        },
        editButton: {
            padding: 3,
        },
        editButtonContainer: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: theme.BACKGROUND_LIGHT,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1.5,
            borderColor: theme.PURPLE + '40',
        },
        typeBadge: {
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 14,
            minWidth: 75,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: theme.SHADOW,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.12,
            shadowRadius: 4,
            elevation: 2,
        },
        typeText: {
            fontSize: 10,
            fontWeight: '800',
            letterSpacing: 0.8,
        },
    });
};