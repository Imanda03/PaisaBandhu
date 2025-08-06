import { StyleSheet } from 'react-native';
import { useTheme } from '../../utils/colors';

export const createStyles = () => {
    const { theme } = useTheme();

    return StyleSheet.create({
        cardContainer: {
            backgroundColor: theme.BACKGROUND_LIGHT,
            borderRadius: 12,
            marginHorizontal: 16,
            marginVertical: 6,
            padding: 16,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 5,
            },
            shadowOpacity: 0.25,
            shadowRadius: 12,
            elevation: 8,
        },
        contentContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',

        },
        textContainer: {
            flex: 1,
            marginRight: 12,
            color: theme.TEXT,
            gap: 10
        },
        title: {
            fontSize: 20,
            fontWeight: 600,
            marginBottom: 4,
            letterSpacing: 0.15,
            color: theme.TEXT
        },
        subtitle: {
            fontSize: 14,
            opacity: 0.9,
            fontWeight: 500,
        },
        actionContainer: {
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10
        },
        typeBadge: {
            // paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16,
            // marginRight: 12,
            minWidth: 80,
            alignItems: 'center',
            justifyContent: 'center',
        },
        typeText: {
            fontSize: 12,
            fontWeight: '700',
            letterSpacing: 0.5,
        },
        editButton: {
            padding: 6,
            // borderRadius: 20,
            // backgroundColor: theme.NAVBAR_ACTIVE_BACKGROUND,
        },
    });
};