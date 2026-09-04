import React, { useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '../../utils/colors';
import createStyles from './styles';

interface BottomSheetProps {
    isVisible: boolean;
    onClose: () => void;
    title?: string;
    hideHeader?: boolean;
    children: React.ReactNode;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
    isVisible,
    onClose,
    title = '',
    hideHeader = false,
    children,
}) => {
    const { theme } = useTheme();
    const styles = createStyles();

    const translateY = useSharedValue(300);
    const overlayOpacity = useSharedValue(0);

    const dismiss = () => {
        overlayOpacity.value = withTiming(0, {
            duration: 200,
            easing: Easing.in(Easing.cubic),
        });
        translateY.value = withTiming(300, {
            duration: 350,
            easing: Easing.in(Easing.cubic),
        }, (finished) => {
            if (finished) runOnJS(onClose)();
        });
    };

    useEffect(() => {
        if (isVisible) {
            // Slide in and fade in
            overlayOpacity.value = withTiming(1, {
                duration: 250,
                easing: Easing.out(Easing.cubic),
            });
            translateY.value = withTiming(0, {
                duration: 400,
                easing: Easing.out(Easing.cubic),
            });
        } else {
            // Fade out and slide down
            overlayOpacity.value = withTiming(0, {
                duration: 200,
                easing: Easing.in(Easing.cubic),
            });
            translateY.value = withTiming(300, {
                duration: 350,
                easing: Easing.in(Easing.cubic),
            }, (finished) => {
                if (finished) runOnJS(onClose)();
            });
        }
    }, [isVisible]);

    const animatedOverlayStyle = useAnimatedStyle(() => ({
        opacity: overlayOpacity.value,
        backgroundColor: 'rgba(0,0,0,0.5)',
        flex: 1,
        justifyContent: 'flex-end',
    }));

    const animatedContainerStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
        backgroundColor: theme.BACKGROUND,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    }));

    return (
        <Modal
            transparent
            animationType="none"
            visible={isVisible}
            onRequestClose={dismiss}
        >
            <Animated.View style={animatedOverlayStyle}>
                <Animated.View style={[styles.modalContainer, animatedContainerStyle]}>
                    {hideHeader ? (
                        <View style={styles.handleWrap}>
                            <View style={styles.handle} />
                        </View>
                    ) : (
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{title}</Text>
                            <TouchableOpacity onPress={dismiss} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    <View style={[styles.modalContent, hideHeader && styles.modalContentFlush]}>
                        {children}
                    </View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};

export default React.memo(BottomSheet);
