import { StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../../utils/colors';

const { height, width } = Dimensions.get('window');

export const createStyles = () => {
    const { theme, isDark } = useTheme();
    return StyleSheet.create({

        modalContent: {
            paddingHorizontal: 10,
            paddingVertical: 20,
            justifyContent: 'space-between'
        },
        modalButtonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
            gap: 5
        },
        modalButton: {
            backgroundColor: theme.PURPLE,
            borderRadius: 15,
            paddingVertical: 15,
            alignItems: 'center',
            flex: 1,
            marginHorizontal: 5,
        },

        modalButtonText: {
            color: 'white',
            fontSize: 16,
            fontWeight: '700',
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'flex-end',
        },
        modalContainer: {
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            // paddingBottom: 20,
            maxHeight: height * 0.9,
        },
        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: theme.BORDER_COLOR,
        },
        modalTitle: {
            marginTop: 20,
            fontSize: 24,
            fontWeight: '700',
            color: theme.TEXT,
        },
        closeButton: {
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderRadius: 10,
            borderStyle: 'dotted',
            borderColor: isDark ? theme.SECONDARY : theme.PURPLE,
        },
        closeButtonText: {
            color: isDark ? theme.SECONDARY : theme.PURPLE,
            fontSize: 18,
            fontWeight: '600',
        },

    });
};

export default createStyles;