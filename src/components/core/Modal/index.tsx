import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '../../../utils/Icons';
import { useTheme } from '../../../utils/colors';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

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
        return '#FF9500';
      case 'success':
        return theme.SUCCESS;
      case 'info':
      default:
        return theme.PURPLE;
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

  // Default buttons if none provided
  const defaultButtons: ModalButton[] = buttons.length
    ? buttons
    : [
        {
          text: 'OK',
          onPress: () => onDismiss?.(),
          style: 'default',
        },
      ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={[styles.modalContainer, { backgroundColor: theme.BACKGROUND_LIGHT }]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.BACKGROUND }]}>
            <View style={styles.headerLeft}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: getTypeColor() + '20' },
                ]}
              >
                <MaterialIcons
                  name={getTypeIcon()}
                  size={24}
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
                style={[styles.closeButton, { backgroundColor: theme.BACKGROUND }]}
                activeOpacity={0.7}
              >
                <MaterialIcons name="close" size={20} color={theme.TEXT} />
              </TouchableOpacity>
            )}
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
          >
            <Text style={[styles.message, { color: theme.TEXT }]}>{message}</Text>
          </ScrollView>

          {/* Buttons */}
          <View style={[styles.footer, { borderTopColor: theme.BACKGROUND }]}>
            {defaultButtons.map((button, index) => (
              <TouchableOpacity
                key={index}
                onPress={button.onPress}
                style={[
                  styles.button,
                  button.style === 'destructive' && {
                    backgroundColor: theme.ERROR + '15',
                  },
                  button.style === 'cancel' && {
                    backgroundColor: theme.BACKGROUND,
                  },
                  !button.style || button.style === 'default'
                    ? { backgroundColor: getTypeColor() + '20' }
                    : {},
                  defaultButtons.length === 1 && styles.buttonFullWidth,
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color:
                        button.style === 'destructive'
                          ? theme.ERROR
                          : button.style === 'cancel'
                          ? theme.TEXT
                          : getTypeColor(),
                    },
                  ]}
                >
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
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
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContainer: {
      width: '100%',
      maxWidth: 400,
      borderRadius: 20,
      overflow: 'hidden',
      maxHeight: '80%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: 12,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      flex: 1,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      maxHeight: 300,
    },
    contentContainer: {
      padding: 20,
    },
    message: {
      fontSize: 15,
      lineHeight: 22,
    },
    footer: {
      flexDirection: 'row',
      padding: 16,
      gap: 12,
      borderTopWidth: 1,
    },
    button: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonFullWidth: {
      flex: 1,
    },
    buttonText: {
      fontSize: 15,
      fontWeight: '600',
    },
  });

export default CustomModal;

