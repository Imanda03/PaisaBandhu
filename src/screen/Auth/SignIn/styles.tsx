import { StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../../../utils/colors';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

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
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            paddingHorizontal: 20,
            paddingTop: 30,
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
            marginVertical: 20,
            height: SCREEN_HEIGHT * 0.25,
            justifyContent: 'center',
        },
        shadowContainer: {
            position: 'absolute',
            width: SCREEN_WIDTH * 0.6,
            height: SCREEN_HEIGHT * 0.12,
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
            width: SCREEN_WIDTH * 0.7,
            height: SCREEN_HEIGHT * 0.25,
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
