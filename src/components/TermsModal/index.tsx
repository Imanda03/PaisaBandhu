import React, { useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Pressable,
  Dimensions,
} from 'react-native';
import Animated, {
  FadeInDown,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../utils/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface TermsModalProps {
  visible: boolean;
  onClose: () => void;
}

const TERMS_CONTENT = [
  {
    title: '1. Acceptance',
    body: 'By using Kharcha Split you agree to these Terms and Conditions. If you do not agree, please do not use the app.',
    icon: 'check-circle',
    gradient: ['#C6A56B', '#D4B87A'],
  },
  {
    title: '2. Use of the Service',
    body: 'Kharcha Split helps you track expenses, manage books, and split costs. You must use the service only for lawful purposes and in line with these terms.',
    icon: 'description',
    gradient: ['#C6A56B', '#E8D4A8'],
  },
  {
    title: '3. Your Data & Privacy',
    body: 'Your personal and financial details will not be shared with third parties for marketing or sale. Data is used only to provide and improve the service, and as described in our Privacy Policy.',
    icon: 'lock',
    gradient: ['#C6A56B', '#D4B87A'],
  },
  {
    title: '4. Details Will Not Be Shared',
    body: 'We do not sell, rent, or share your email, phone number, transaction data, or any personally identifiable information with advertisers or other third parties. Your details stay private and are protected.',
    icon: 'security',
    gradient: ['#C6A56B', '#E8D4A8'],
  },
  {
    title: '5. Security',
    body: 'We use industry-standard measures to protect your data. You are responsible for keeping your device and account secure.',
    icon: 'shield',
    gradient: ['#C6A56B', '#D4B87A'],
  },
  {
    title: '6. Changes',
    body: 'We may update these terms from time to time. Continued use of the app after changes means you accept the updated terms.',
    icon: 'update',
    gradient: ['#C6A56B', '#E8D4A8'],
  },
];

export default function TermsModal({ visible, onClose }: TermsModalProps) {
  const { theme } = useTheme();
  const isDark = theme.HEADER_BACKGROUND === '#0F1012';

  const styles = useMemo(
    () =>
      StyleSheet.create({
        modalContainer: {
          flex: 1,
          justifyContent: 'flex-end',
        },
        overlay: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
        },
        sheet: {
          backgroundColor: theme.BACKGROUND_LIGHT,
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          maxHeight: SCREEN_HEIGHT * 0.9,
          height: SCREEN_HEIGHT * 0.85,
          borderWidth: 1.5,
          borderColor: isDark ? 'rgba(198, 165, 107, 0.3)' : 'rgba(198, 165, 107, 0.2)',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -8,
          },
          shadowOpacity: 0.4,
          shadowRadius: 24,
          elevation: 24,
          overflow: 'hidden',
          flexDirection: 'column',
        },
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 20,
          borderBottomWidth: 1.5,
          borderBottomColor: isDark ? 'rgba(198, 165, 107, 0.2)' : 'rgba(198, 165, 107, 0.15)',
        },
        titleContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
        },
        titleIcon: {
          width: 44,
          height: 44,
          borderRadius: 22,
          justifyContent: 'center',
          alignItems: 'center',
        },
        title: {
          fontSize: 28,
          fontWeight: '800',
          color: theme.TEXT,
          letterSpacing: -0.5,
        },
        closeBtn: {
          width: 44,
          height: 44,
          borderRadius: 22,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.06)',
        },
        scrollContainer: {
          height: SCREEN_HEIGHT * 0.85 - 100,
        },
        scrollContent: {
          paddingHorizontal: 20,
          paddingTop: 24,
          paddingBottom: Platform.OS === 'ios' ? 60 : 40,
        },
        section: {
          marginBottom: 20,
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF',
          borderRadius: 20,
          padding: 24,
          borderWidth: 1.5,
          borderColor: isDark ? 'rgba(198, 165, 107, 0.3)' : 'rgba(198, 165, 107, 0.2)',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: isDark ? 0.25 : 0.12,
          shadowRadius: 12,
          elevation: 6,
        },
        sectionHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 16,
          gap: 16,
        },
        sectionIconContainer: {
          width: 48,
          height: 48,
          borderRadius: 24,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#C6A56B',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.4,
          shadowRadius: 6,
          elevation: 4,
        },
        sectionTitle: {
          fontSize: 19,
          fontWeight: '700',
          color: theme.TEXT,
          flex: 1,
          letterSpacing: -0.3,
          lineHeight: 26,
        },
        sectionBody: {
          fontSize: 15.5,
          color: theme.LIGHT_TEXT,
          lineHeight: 26,
          opacity: 0.95,
          paddingLeft: 64,
          letterSpacing: 0.15,
        },
      }),
    [theme, isDark]
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.modalContainer}>
        <Pressable style={styles.overlay} onPress={onClose} />
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <LinearGradient
                colors={['#C6A56B', '#D4B87A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.titleIcon}
              >
                <MaterialIcons name="gavel" size={24} color="#1E1E24" />
              </LinearGradient>
              <Text style={styles.title}>Terms & Conditions</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <MaterialIcons name="close" size={26} color={theme.TEXT} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
            bounces={true}
            scrollEnabled={true}
            nestedScrollEnabled={true}
          >
            {TERMS_CONTENT.map((section, i) => (
              <Animated.View
                key={i}
                entering={FadeInDown.delay(i * 80).duration(500)}
                style={styles.section}
              >
                <View style={styles.sectionHeader}>
                  <LinearGradient
                    colors={section.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.sectionIconContainer}
                  >
                    <MaterialIcons name={section.icon as any} size={24} color="#1E1E24" />
                  </LinearGradient>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                </View>
                <View >
                  <Text style={styles.sectionBody}>{section.body}</Text>
                </View>
              </Animated.View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
