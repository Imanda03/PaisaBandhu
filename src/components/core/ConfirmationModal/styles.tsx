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
        confirmInputContainer: {
            marginBottom: 20,
        },
        confirmInputLabel: {
            fontSize: 14,
            marginBottom: 8,
            color: theme.TEXT,
        },
        confirmTextHighlight: {
            fontWeight: '700',
            color: theme.ERROR,
        },
        confirmInput: {
            borderWidth: 1,
            borderColor: theme.BORDER_COLOR,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 10,
            fontSize: 16,
            color: theme.TEXT,
            backgroundColor: theme.INPUT_BACKGROUND,
        },
        confirmButtonDisabled: {
            opacity: 0.5,
        },
    })
}
