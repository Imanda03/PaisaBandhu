import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '../../../utils/Icons';
import { useTheme } from '../../../utils/colors';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { scale } from '../../../utils/responsive';

export interface ModalButton {
  text: string;
  onPress: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

export interface CustomModalProps {
  visible: boolean;
  title?: string;
  message: string;
  buttons?: ModalButton[];
  onDismiss?: () => void;
  type?: 'info' | 'warning' | 'error' | 'success';
  showCloseButton?: boolean;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  title,
  message,
  buttons = [],
  onDismiss,
  type = 'info',
  showCloseButton = true,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const getTypeColor = () => {
    switch (type) {
      case 'error':
        return theme.ERROR;
      case 'warning':
        return theme.WARNING || '#E5A854';
      case 'success':
        return theme.SUCCESS;
      case 'info':
      default:
        return theme.SECONDARY || theme.PURPLE;
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'error':
        return 'error-outline';
      case 'warning':
        return 'warning';
      case 'success':
        return 'check-circle';
      case 'info':
      default:
        return 'info';
    }
  };

  const defaultButtons: ModalButton[] = buttons.length
    ? buttons
    : [
        {
          text: 'OK',
          onPress: () => onDismiss?.(),
          style: 'default',
        },
      ];

  const isDestructiveModal = defaultButtons.some((b) => b.style === 'destructive');
  const accentColor = type === 'warning' || type === 'error' ? theme.ERROR : getTypeColor();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <Animated.View
          entering={FadeIn.duration(220)}
          exiting={FadeOut.duration(180)}
          style={[
            styles.modalContainer,
            {
              backgroundColor: theme.BACKGROUND_LIGHT || theme.BACKGROUND,
              borderLeftColor: accentColor,
              borderLeftWidth: isDestructiveModal || type === 'warning' || type === 'error' ? 4 : 0,
            },
          ]}
        >
          <View style={[styles.header, { borderBottomColor: theme.BORDER_COLOR + '60' }]}>
            <View style={styles.headerLeft}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: getTypeColor() + '22' },
                ]}
              >
                <MaterialIcons
                  name={getTypeIcon()}
                  size={scale(26)}
                  color={getTypeColor()}
                />
              </View>
              {title && (
                <Text style={[styles.title, { color: theme.TEXT }]}>{title}</Text>
              )}
            </View>
            {showCloseButton && (
              <TouchableOpacity
                onPress={onDismiss}
                style={[styles.closeButton, { backgroundColor: theme.BORDER_COLOR + '40' }]}
                activeOpacity={0.7}
              >
                <MaterialIcons name="close" size={scale(20)} color={theme.TEXT} />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
          >
            <Text style={[styles.message, { color: theme.TEXT }]}>{message}</Text>
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: theme.BORDER_COLOR + '60' }]}>
            {defaultButtons.map((button, index) => {
              const isCancel = button.style === 'cancel';
              const isDestructive = button.style === 'destructive';
              const isConfirm = !isCancel && !isDestructive && defaultButtons.length > 1;
              return (
                <TouchableOpacity
                  key={index}
                  onPress={button.onPress}
                  style={[
                    styles.button,
                    isCancel && {
                      backgroundColor: 'transparent',
                      borderWidth: 2,
                      borderColor: theme.BORDER_COLOR,
                    },
                    isDestructive && {
                      backgroundColor: theme.ERROR,
                      ...Platform.select({
                        ios: {
                          shadowColor: theme.ERROR,
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.35,
                          shadowRadius: 8,
                        },
                        android: { elevation: 6 },
                      }),
                    },
                    isConfirm && {
                      backgroundColor: theme.SECONDARY + '28',
                      borderWidth: 0,
                    },
                    defaultButtons.length === 1 && styles.buttonFullWidth,
                  ]}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      {
                        color: isDestructive
                          ? '#FFFFFF'
                          : isCancel
                          ? theme.TEXT
                          : isConfirm
                          ? theme.SECONDARY
                          : getTypeColor(),
                        fontWeight: '700',
                      },
                    ]}
                  >
                    {button.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.52)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: scale(24),
    },
    modalContainer: {
      width: '100%',
      maxWidth: 400,
      borderRadius: scale(24),
      overflow: 'hidden',
      maxHeight: '82%',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.16,
          shadowRadius: 24,
        },
        android: { elevation: 16 },
      }),
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: scale(18),
      paddingHorizontal: scale(22),
      borderBottomWidth: 1,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: scale(14),
    },
    iconContainer: {
      width: scale(48),
      height: scale(48),
      borderRadius: scale(24),
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: scale(18),
      fontWeight: '800',
      flex: 1,
      letterSpacing: 0.2,
    },
    closeButton: {
      width: scale(36),
      height: scale(36),
      borderRadius: scale(18),
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      maxHeight: 300,
    },
    contentContainer: {
      padding: scale(22),
    },
    message: {
      fontSize: scale(15),
      lineHeight: scale(23),
      letterSpacing: 0.15,
    },
    footer: {
      flexDirection: 'row',
      padding: scale(18),
      gap: scale(12),
      borderTopWidth: 1,
    },
    button: {
      flex: 1,
      paddingVertical: scale(14),
      paddingHorizontal: scale(20),
      borderRadius: scale(14),
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonFullWidth: {
      flex: 1,
    },
    buttonText: {
      fontSize: scale(15),
      fontWeight: '600',
      letterSpacing: 0.3,
    },
  });

export default CustomModal;

