import { StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../../utils/colors';

const { height, width } = Dimensions.get('window');

export const createStyles = () => {
    const { theme } = useTheme();
    return StyleSheet.create({
        input: {
            borderWidth: 1.5,
            borderColor: theme.BORDER_COLOR,
            borderRadius: 15,
            padding: 15,
            marginBottom: 20,
            color: theme.TEXT,
            fontSize: 16,
            backgroundColor: theme.INPUT_BACKGROUND
        },
        modalContent: {
            paddingHorizontal: 10,
            // paddingVertical: 20,
            justifyContent: 'space-between',
        },
        modalButtonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            // marginBottom: 20,
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
        deleteButton: {
            backgroundColor: theme.ERROR,
        },
        modalButtonText: {
            color: theme.SECONDARY,
            fontSize: 16,
            fontWeight: '700',
        },
        errorText: {
            color: theme.ERROR,
            fontSize: 12,
            // marginTop: 4,
            marginLeft: 4,
        },
        helperText: {
            fontSize: 12,
            color: 'gray',
            // marginTop: -4,
            marginBottom: 4,
            marginLeft: 4,
        },
    });
};

export default createStyles;