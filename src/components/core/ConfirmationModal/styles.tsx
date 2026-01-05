import { StyleSheet } from 'react-native';
import { useTheme } from '../../../utils/colors';

export const createStyles = () => {
    const { theme } = useTheme()
    return StyleSheet.create({
        modalOverlay: {
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(33, 52, 72, 0.7)',
            padding: 20,
        },
        modalContainer: {
            backgroundColor: theme.BACKGROUND,
            borderRadius: 10,
            padding: 20,
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10,
            color: theme.TEXT
        },
        description: {
            fontSize: 15,
            marginBottom: 20,
            color: theme.TEXT
        },
        buttonRow: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 10
        },
        cancelButton: {
            marginRight: 10,
        },
        cancelText: {
            color: theme.LIGHT_TEXT,
            fontSize: 16,
        },
        confirmButton: {
            backgroundColor: theme.ERROR,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 5,
        },
        confirmText: {
            color: theme.DARK_TEXT,
            fontSize: 16,
        },
    })
}
