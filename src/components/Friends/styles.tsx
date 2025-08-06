import { StyleSheet } from 'react-native';
import { useTheme } from '../../utils/colors';

export const createStyles = () => {
    const { theme } = useTheme();

    return StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 15,
            marginVertical: 8,
            borderRadius: 12,

            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            backgroundColor: theme.LIST_BG
        },
        leftContent: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        iconContainer: {
            padding: 8,
            borderRadius: 8,
            marginRight: 12,
        },
        title: {
            fontSize: 20,
            fontWeight: 600,
            color: theme.TEXT
        },
        subTitle: {
            marginLeft: 10,
            fontSize: 12,
            fontWeight: 600,
            color: 'gray'
        },
        actions: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        deleteButton: {
            marginLeft: 16,
        },
        addButton: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            borderWidth: 1,
            borderStyle: 'dashed',
            borderRadius: 12,
            marginVertical: 8,
        },
        addText: {
            marginLeft: 8,
            fontSize: 16,
            fontWeight: '500',
        },
    });
};
