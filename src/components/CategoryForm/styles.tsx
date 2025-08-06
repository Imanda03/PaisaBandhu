import { StyleSheet } from 'react-native';
import { useTheme } from '../../utils/colors';

export const createStyles = () => {
    const { theme } = useTheme();

    return StyleSheet.create({
        container: {
            flex: 1,
            // marginVertical: 30,
            flexDirection: 'column',
            justifyContent: 'space-between',
            marginBottom: '10%'
        },
        label: {
            fontSize: 16,
            fontWeight: '500',
            marginBottom: 8,
        },
        input: {
            height: 48,
            borderRadius: 8,
            paddingHorizontal: 16,
            marginBottom: 16,
        },
        iconGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            // marginBottom: 16,
        },
        selectedIconLabel: {
            marginVertical: 8,
            fontSize: 16,
            fontWeight: 600,
            // textAlign: 'center',
        },
        iconButton: {
            width: '22%',
            aspectRatio: 1,
            margin: '1.5%',
            borderRadius: 8,
            borderWidth: 2,
            justifyContent: 'center',
            alignItems: 'center',
        },
        iconText: {
            fontSize: 24,
        },
        typeContainer: {
            flexDirection: 'row',
            marginBottom: 24,
        },
        typeButton: {
            flex: 1,
            height: 48,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
            marginHorizontal: 4,
        },
        typeText: {
            fontSize: 16,
            fontWeight: '500',
        },
        submitButton: {
            height: 48,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
        },
        submitText: {
            fontSize: 16,
            fontWeight: '600',
        },
        errorText: {
            color: theme.ERROR,
            fontSize: 13,
            // marginTop: 4,
            marginLeft: 4,
            fontWeight: '500',
        },
    });
};
