import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../../utils/colors';
import AuthHeader from '../../../components/core/AuthHeader';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const PRIVACY_CONTENT = [
  {
    title: 'Introduction',
    body: 'Kharcha Split ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application ("App").',
    icon: 'info',
    gradient: ['#C6A56B', '#D4B87A'],
  },
  {
    title: 'Information We Collect',
    body: 'We collect personal information including email address, phone number, full name, and password (securely hashed). We also collect financial data such as transaction records, book data, and financial categories. Additionally, we collect usage data, device information, session information, and network status.',
    icon: 'data-usage',
    gradient: ['#C6A56B', '#E8D4A8'],
  },
  {
    title: 'How We Use Your Information',
    body: 'We use collected information for account management, app functionality, authentication, communication (OTP codes), data synchronization, customer support, and app improvement. Your data is never sold or shared for marketing purposes.',
    icon: 'settings',
    gradient: ['#C6A56B', '#D4B87A'],
  },
  {
    title: 'Data Storage and Security',
    body: 'Data is stored locally on your device using AsyncStorage and securely on our backend servers. Passwords are hashed using secure algorithms, and we use JWT tokens for authentication. We maintain secure backups of your data.',
    icon: 'lock',
    gradient: ['#C6A56B', '#E8D4A8'],
  },
  {
    title: 'Data Sharing and Disclosure',
    body: 'We do NOT sell your personal information. We may share information only with your consent, with group transaction members, with trusted service providers (like email services), or when required by law.',
    icon: 'share',
    gradient: ['#C6A56B', '#D4B87A'],
  },
  {
    title: 'Third-Party Services',
    body: 'Our App uses Resend for email services (OTP delivery) and secure cloud servers for backend hosting. We do NOT use analytics, advertising, or tracking services.',
    icon: 'extension',
    gradient: ['#C6A56B', '#E8D4A8'],
  },
  {
    title: 'Your Rights and Choices',
    body: 'You have the right to access, update, delete your personal information, and export your transaction data. You can manage these through the App settings.',
    icon: 'verified-user',
    gradient: ['#C6A56B', '#D4B87A'],
  },
  {
    title: 'Children\'s Privacy',
    body: 'Our App is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.',
    icon: 'child-care',
    gradient: ['#C6A56B', '#E8D4A8'],
  },
  {
    title: 'Permissions We Request',
    body: 'Android: INTERNET (required), POST_NOTIFICATIONS (notifications), READ/WRITE_EXTERNAL_STORAGE (Android 12 and below for file operations). iOS: Network access only. We do not request location, camera, or photo library access.',
    icon: 'security',
    gradient: ['#C6A56B', '#D4B87A'],
  },
  {
    title: 'Data Retention',
    body: 'We retain your personal information for as long as your account is active. If you delete your account, we will delete your personal information within 30 days, except where required by law.',
    icon: 'schedule',
    gradient: ['#C6A56B', '#E8D4A8'],
  },
  {
    title: 'International Data Transfers',
    body: 'Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your data.',
    icon: 'public',
    gradient: ['#C6A56B', '#D4B87A'],
  },
  {
    title: 'Changes to This Privacy Policy',
    body: 'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy and updating the "Last Updated" date.',
    icon: 'update',
    gradient: ['#C6A56B', '#E8D4A8'],
  },
  {
    title: 'Contact Us',
    body: 'If you have any questions about this Privacy Policy or our data practices, please contact us through the app support channels.',
    icon: 'contact-support',
    gradient: ['#C6A56B', '#D4B87A'],
  },
  {
    title: 'Compliance',
    body: 'This Privacy Policy complies with Google Play Developer Program Policies, Apple App Store Review Guidelines, GDPR, and CCPA regulations.',
    icon: 'gavel',
    gradient: ['#C6A56B', '#E8D4A8'],
  },
];

export default function PrivacyPolicyScreen() {
  const { theme } = useTheme();
  const isDark = theme.HEADER_BACKGROUND === '#0F1012';
  const insets = useSafeAreaInsets();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.BACKGROUND,
        },
        headerContainer: {
          paddingTop: insets.top,
          backgroundColor: theme.BACKGROUND,
          paddingBottom: 12,
        },
        scroll: {
          flex: 1,
          paddingHorizontal: 20,
          paddingTop: 24,
          paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        },
        headerSection: {
          marginBottom: 32,
          alignItems: 'center',
        },
        headerIcon: {
          width: 64,
          height: 64,
          borderRadius: 32,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 16,
        },
        headerTitle: {
          fontSize: 28,
          fontWeight: '800',
          color: theme.TEXT,
          letterSpacing: -0.5,
          marginBottom: 8,
          textAlign: 'center',
        },
        headerSubtitle: {
          fontSize: 16,
          color: theme.LIGHT_TEXT,
          opacity: 0.8,
          textAlign: 'center',
        },
        lastUpdated: {
          fontSize: 14,
          color: theme.SECONDARY,
          fontWeight: '600',
          marginTop: 8,
          textAlign: 'center',
        },
        section: {
          marginBottom: 18,
          backgroundColor: isDark ? theme.BACKGROUND_LIGHT : '#FFFFFF',
          borderRadius: 20,
          padding: 22,
          borderWidth: 1.5,
          borderColor: isDark ? 'rgba(198, 165, 107, 0.25)' : 'rgba(198, 165, 107, 0.18)',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: isDark ? 0.2 : 0.1,
          shadowRadius: 10,
          elevation: 5,
          overflow: 'hidden',
          position: 'relative',
        },
        sectionHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 14,
          gap: 14,
        },
        sectionIconContainer: {
          width: 44,
          height: 44,
          borderRadius: 22,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#C6A56B',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 3,
        },
        sectionTitle: {
          fontSize: 18,
          fontWeight: '700',
          color: theme.TEXT,
          flex: 1,
          letterSpacing: -0.3,
          lineHeight: 24,
        },
        sectionBody: {
          fontSize: 15,
          color: theme.LIGHT_TEXT,
          lineHeight: 26,
          opacity: 0.95,
          paddingLeft: 58,
          letterSpacing: 0.2,
        },
      }),
    [theme, isDark, insets.top]
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <AuthHeader title="Privacy Policy" />
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <Animated.View entering={FadeInDown.duration(400)} style={styles.headerSection}>
          <LinearGradient
            colors={['#C6A56B', '#D4B87A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerIcon}
          >
            <MaterialIcons name="privacy-tip" size={32} color="#1E1E24" />
          </LinearGradient>
          <Text style={styles.headerTitle}>Privacy Policy</Text>
          <Text style={styles.headerSubtitle}>Your privacy matters to us</Text>
          <Text style={styles.lastUpdated}>Last Updated: February 20, 2026</Text>
        </Animated.View>

        {PRIVACY_CONTENT.map((section, i) => (
          <Animated.View
            key={i}
            entering={FadeInDown.delay(i * 50).duration(400)}
            style={styles.section}
          >
            <View style={styles.sectionHeader}>
              <LinearGradient
                colors={section.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.sectionIconContainer}
              >
                <MaterialIcons name={section.icon as any} size={22} color="#1E1E24" />
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
  );
}
