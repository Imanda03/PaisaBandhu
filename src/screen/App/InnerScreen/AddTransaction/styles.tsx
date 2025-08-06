import { StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../../../../utils/colors';

export const createStyles = () => {
    const { theme } = useTheme();
    const windowHeight = Dimensions.get('window').height;

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
        innerContainer: {
            flex: 1,
            justifyContent: 'space-between',
        },
        buttonWrapper: {
            paddingBottom: 20,
        },
    });
};
