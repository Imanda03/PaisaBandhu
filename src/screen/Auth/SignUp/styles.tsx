import { StyleSheet } from 'react-native';
import { useTheme } from '../../../utils/colors';
import { scale, verticalScale, spacing } from '../../../utils/responsive';

export const createStyles = () => {
    const { theme } = useTheme();

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.BACKGROUND,
        },
        header: {
            paddingVertical: 50,
            backgroundColor: theme.PURPLE,
            zIndex: 0,
            elevation: 1,

        },
        scrollContainer: {
            flex: 1,
        },
        scrollContent: {
            // flexGrow: 1,
            paddingBottom: 40,
        },
        content: {
            flex: 1,
            backgroundColor: theme.BACKGROUND,
            borderTopLeftRadius: scale(40),
            borderTopRightRadius: scale(40),
            paddingHorizontal: spacing(20),
            paddingTop: verticalScale(30),
            marginTop: -verticalScale(40),
            zIndex: 1,
            elevation: 5,
        },
        title: {
            color: theme.SECONDARY,
            fontWeight: '800',
            fontSize: 18,
            textAlign: 'center',
            marginBottom: 20,
            marginTop: 30,
            lineHeight: 26,
        },
        loginField: {
            marginTop: 20,
            gap: 15,
        },
        forgotPassword: {
            // marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'flex-end'
        },
        forgetText: {
            color: theme.TEXT,
            fontWeight: '700',
            textAlign: 'center',
            fontSize: 14,
        },
        errorMessage: {
            color: theme.ERROR,
            textAlign: 'center',
            fontWeight: '600',
            marginTop: 10,
        },
    });
};
