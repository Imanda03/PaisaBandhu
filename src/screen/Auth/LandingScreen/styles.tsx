import { StyleSheet, Dimensions } from 'react-native';
import { ThemeColors } from '../../../utils/colors';

const { width, height } = Dimensions.get('window');

export const createStyles = (theme: ThemeColors) =>
    StyleSheet.create({
        root: {
            flex: 1,
            backgroundColor: theme.PURPLE, // Header background
        },
        body: {
            flex: 1,
            backgroundColor: theme.BACKGROUND,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            paddingHorizontal: 20,
            paddingTop: 30,
        },
        bodyContent: {
            paddingBottom: 30,
        },
        image: {
            width: '90%',
            height: height * 0.3,
            alignSelf: 'center',
        },
        textContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20,
        },
        text: {
            fontSize: 32,
            color: theme.TEXT,
            fontWeight: '600',
        },
        textDescription: {
            fontSize: 14,
            color: theme.TEXT,
            textAlign: 'center',
            marginTop: 14,
            paddingHorizontal: 10,
        },
        ButtonContainer: {
            marginTop: '20%',
            gap: 20,
        },
    });
