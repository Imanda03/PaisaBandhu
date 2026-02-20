import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../utils/colors';
import { scale, verticalScale, fontSize, spacing } from '../../../utils/responsive';

export const createStyles = (theme: ThemeColors) =>
    StyleSheet.create({
        root: {
            flex: 1,
            backgroundColor: theme.PURPLE,
        },
        body: {
            flex: 1,
            backgroundColor: theme.BACKGROUND,
            borderTopLeftRadius: scale(48),
            borderTopRightRadius: scale(48),
            paddingHorizontal: spacing(24),
            paddingTop: verticalScale(36),
        },
        bodyContent: {
            paddingBottom: verticalScale(30),
        },
        image: {
            width: '90%',
            height: verticalScale(260),
            alignSelf: 'center',
        },
        textContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: verticalScale(20),
        },
        text: {
            fontSize: fontSize(34),
            color: theme.TEXT,
            fontWeight: '700',
            letterSpacing: -0.5,
        },
        textDescription: {
            fontSize: fontSize(15),
            color: theme.LIGHT_TEXT,
            textAlign: 'center',
            marginTop: verticalScale(16),
            paddingHorizontal: spacing(16),
            lineHeight: fontSize(22),
        },
        ButtonContainer: {
            marginTop: '20%',
            gap: spacing(16),
        },
    });
