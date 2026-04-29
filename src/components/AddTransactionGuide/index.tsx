import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { useTheme } from '../../utils/colors';
import { MaterialIcons } from '../../utils/Icons';
import { scale, verticalScale } from '../../utils/responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const STORAGE_KEY = 'ADD_TRANSACTION_GUIDE_SEEN';

const STEPS = [
  {
    id: 'book_tab',
    title: 'Go to Book',
    description: 'Tap the **Book** tab at the bottom to open your financial books.',
    icon: 'menu-book' as const,
  },
  {
    id: 'create_book',
    title: 'Create a book',
    description: 'Tap the **+** button to create your first book. You can have multiple books for different purposes.',
    icon: 'add-circle-outline' as const,
  },
  {
    id: 'add_transaction',
    title: 'Add a transaction',
    description: 'Open a book, then tap **Add Income** or **Add Expense** to record your first transaction.',
    icon: 'receipt-long' as const,
  },
];

export const ADD_TRANSACTION_GUIDE_STORAGE_KEY = STORAGE_KEY;

type Props = {
  visible: boolean;
  onDismiss: () => void;
};

const AddTransactionGuide: React.FC<Props> = ({ visible, onDismiss }) => {
  const { theme } = useTheme();
  const [stepIndex, setStepIndex] = useState(0);
  const isLastStep = stepIndex === STEPS.length - 1;
  const step = STEPS[stepIndex];

  const handleNext = useCallback(() => {
    if (isLastStep) {
      onDismiss();
    } else {
      setStepIndex((i) => i + 1);
    }
  }, [isLastStep, onDismiss]);

  const handleClose = useCallback(() => {
    onDismiss();
  }, [onDismiss]);

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: scale(24),
    },
    card: {
      width: SCREEN_WIDTH - scale(48),
      maxWidth: 400,
      backgroundColor: theme.BACKGROUND_LIGHT || theme.BACKGROUND,
      borderRadius: scale(24),
      padding: scale(28),
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.2,
          shadowRadius: 24,
        },
        android: { elevation: 12 },
      }),
    },
    stepIndicator: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: scale(8),
      marginBottom: verticalScale(24),
    },
    stepDot: {
      width: scale(8),
      height: scale(8),
      borderRadius: scale(4),
    },
    stepDotActive: {
      width: scale(24),
      borderRadius: scale(12),
    },
    iconWrap: {
      width: scale(72),
      height: scale(72),
      borderRadius: scale(36),
      backgroundColor: theme.SECONDARY + '22',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: verticalScale(20),
    },
    title: {
      fontSize: scale(22),
      fontWeight: '800',
      color: theme.TEXT,
      textAlign: 'center',
      marginBottom: verticalScale(12),
      letterSpacing: -0.3,
    },
    description: {
      fontSize: scale(15),
      lineHeight: scale(22),
      color: theme.LIGHT_TEXT,
      textAlign: 'center',
      marginBottom: verticalScale(28),
      paddingHorizontal: scale(4),
    },
    bold: {
      fontWeight: '700',
      color: theme.TEXT,
    },
    row: {
      flexDirection: 'row',
      gap: scale(12),
      marginTop: verticalScale(8),
    },
    buttonSecondary: {
      flex: 1,
      paddingVertical: verticalScale(14),
      borderRadius: scale(14),
      backgroundColor: theme.BORDER_COLOR + '40',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonPrimary: {
      flex: 1,
      paddingVertical: verticalScale(14),
      borderRadius: scale(14),
      backgroundColor: theme.SECONDARY,
      alignItems: 'center',
      justifyContent: 'center',
      ...Platform.select({
        ios: {
          shadowColor: theme.SECONDARY,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        android: { elevation: 4 },
      }),
    },
    buttonTextSecondary: {
      fontSize: scale(15),
      fontWeight: '700',
      color: theme.TEXT,
    },
    buttonTextPrimary: {
      fontSize: scale(15),
      fontWeight: '700',
      color: theme.PRIMARY || '#1a1a1a',
    },
  });

  const renderDescription = () => {
    const parts = step.description.split(/\*\*(.*?)\*\*/g);
    return (
      <Text style={styles.description}>
        {parts.map((part, i) =>
          i % 2 === 1 ? (
            <Text key={i} style={[styles.description, styles.bold]}>
              {part}
            </Text>
          ) : (
            part
          )
        )}
      </Text>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.stepIndicator}>
            {STEPS.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.stepDot,
                  i === stepIndex && styles.stepDotActive,
                  {
                    backgroundColor:
                      i <= stepIndex ? theme.SECONDARY : theme.BORDER_COLOR,
                    opacity: i <= stepIndex ? 1 : 0.5,
                  },
                ]}
              />
            ))}
          </View>

          <View style={styles.iconWrap}>
            <MaterialIcons
              name={step.icon}
              size={36}
              color={theme.SECONDARY}
            />
          </View>

          <Text style={styles.title}>{step.title}</Text>
          {renderDescription()}

          <View style={styles.row}>
            <TouchableOpacity
              style={styles.buttonSecondary}
              onPress={handleClose}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonTextSecondary}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonPrimary}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonTextPrimary}>
                {isLastStep ? 'Got it' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddTransactionGuide;
