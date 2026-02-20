import { StyleSheet } from 'react-native';
import { useTheme } from '../../../utils/colors';
import { scale, verticalScale, fontSize, spacing } from '../../../utils/responsive';

export const createStyles = () => {
    const { theme } = useTheme();

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.PURPLE,
        },
        header: {
            paddingVertical: 40,
            paddingBottom: 40,
            backgroundColor: theme.PURPLE,
            // alignItems: 'center',
            justifyContent: 'center',
        },
        title: {
            color: theme.SECONDARY,
            fontWeight: '800',
            fontSize: 18,
            textAlign: 'center',
            lineHeight: 24,
            marginTop: 20,
            paddingHorizontal: 20,
        },
        loginTitle: {
            color: theme.TEXT,
            fontWeight: '800',
            fontSize: 18,
            textAlign: 'left',
            // marginBottom: 20,
            lineHeight: 24,
            marginTop: 20,
            // paddingHorizontal: 20,
        },
        content: {
            flex: 1,
            backgroundColor: theme.BACKGROUND,
            borderTopLeftRadius: scale(40),
            borderTopRightRadius: scale(40),
            paddingHorizontal: spacing(20),
            paddingTop: verticalScale(30),
        },
        scrollContent: {
            // flexGrow: 1,
            paddingBottom: 40,
        },
        welcomeSection: {
            alignItems: 'center',
            // marginBottom: 30,
        },
        imageContainer: {
            alignItems: 'center',
            marginVertical: verticalScale(20),
            height: verticalScale(200),
            justifyContent: 'center',
        },
        shadowContainer: {
            position: 'absolute',
            width: scale(220),
            height: verticalScale(100),
            backgroundColor: theme.SHADOW,
            borderRadius: 100,
            bottom: 10,
            shadowColor: theme.SHADOW,
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: theme.SHADOW_OPACITY,
            shadowRadius: 10,
            elevation: 5,
        },
        image: {
            width: scale(260),
            height: verticalScale(200),
        },
        loginField: {
            marginTop: 20,
        },
        forgotPassword: {
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        forgetText: {
            color: theme.TEXT,
            fontWeight: '700',
            fontSize: 14,
        },
    });
};
