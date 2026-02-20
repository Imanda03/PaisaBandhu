import { StyleSheet } from 'react-native';
import { useTheme } from '../../../../utils/colors';
import { scale, verticalScale } from '../../../../utils/responsive';

export const createStyles = () => {
    const { theme } = useTheme();

    return StyleSheet.create({
        root: {
            flex: 1,
            backgroundColor: theme.HEADER_BACKGROUND,
            paddingTop: '13%',
            paddingHorizontal: '5%',
        },
        container: {
            flex: 2,
            backgroundColor: theme.BACKGROUND,
            marginTop: '10%',
            marginHorizontal: '-5%',
            borderTopLeftRadius: scale(40),
            borderTopRightRadius: scale(40),
            paddingTop: verticalScale(30),
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
