import { StyleSheet } from 'react-native';
import { useTheme } from '../../../../utils/colors';

export const createStyles = () => {
    const { theme } = useTheme();

    return StyleSheet.create({
        root: {
            flex: 1,
            backgroundColor: theme.PURPLE,
            paddingTop: '13%',
            paddingHorizontal: '5%',
        },
        container: {
            flex: 2,
            backgroundColor: theme.BACKGROUND,
            marginTop: '10%',
            marginHorizontal: '-5%',
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            paddingTop: 30,
            paddingHorizontal: '5%',
        },
    });
};
