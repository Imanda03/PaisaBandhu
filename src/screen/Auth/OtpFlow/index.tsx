import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../../utils/colors';
import { createStyles } from './styles';
import AuthHeader from '../../../components/core/AuthHeader';
import Input from '../../../components/core/Input';
import TermsModal from '../../../components/TermsModal';
import { useToast } from '../../../context/ToastContext';
import { useAuth } from '../../../context/AuthContext';
import { useSendOtp, useVerifyOtp, useCompleteProfile } from '../../../ReactQueryHook/auth.hook';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Step = 'email' | 'code' | 'profile';

const AUTH_HEADER_VERTICAL = 56;

const STEP_ORDER: Step[] = ['email', 'code', 'profile'];

const OtpFlow = ({ navigation: _navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { showToast } = useToast();
  const { login } = useAuth();
  const isDark = theme.HEADER_BACKGROUND === '#0F1012';

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [registrationToken, setRegistrationToken] = useState('');
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);

  const { mutate: doSendOtp, isLoading: sendingOtp } = useSendOtp(
    () => {
      showToast('Code sent to your email!', 'success');
      setStep('code');
    },
    (msg) => showToast(msg, 'error')
  );

  const { mutate: doVerifyOtp, isLoading: verifying } = useVerifyOtp(
    (res) => {
      if (res?.needsProfile) {
        setRegistrationToken(res.registrationToken || '');
        setVerifiedEmail(res.email || email);
        setStep('profile');
      } else if (res?.token) {
        login(res.token);
        showToast(res.message || 'Welcome back!', 'success');
      }
    },
    (msg) => showToast(msg, 'error')
  );

  const { mutate: doCompleteProfile, isLoading: completing } = useCompleteProfile(
    (res) => {
      if (res?.token) {
        login(res.token);
        showToast(res.message || 'Welcome to Kharcha Split!', 'success');
      }
    },
    (msg) => showToast(msg, 'error')
  );

  const handleSendOtp = useCallback(() => {
    if (!email.trim()) {
      showToast('Please enter your email', 'error');
      return;
    }
    if (!acceptedTerms) {
      showToast('Please accept the Terms and Conditions', 'error');
      return;
    }
    doSendOtp(email.trim());
  }, [email, acceptedTerms, doSendOtp, showToast]);

  const handleVerifyOtp = useCallback(() => {
    if (!code.trim() || code.replace(/\s/g, '').length !== 6) {
      showToast('Please enter the 6-digit code', 'error');
      return;
    }
    doVerifyOtp({ email: email.trim(), code: code.replace(/\s/g, '') });
  }, [email, code, doVerifyOtp, showToast]);

  const handleCompleteProfile = useCallback(() => {
    if (!fullName.trim() || fullName.trim().length < 2) {
      showToast('Please enter your full name', 'error');
      return;
    }
    if (!phoneNumber.trim() || !/^9\d{9}$/.test(phoneNumber.trim().replace(/\D/g, '').slice(-10))) {
      showToast('Please enter a valid phone (e.g. 9XXXXXXXXX)', 'error');
      return;
    }
    let phone = phoneNumber.trim().replace(/\D/g, '');
    phone = phone.slice(-10);
    if (phone.length !== 10 || !phone.startsWith('9')) {
      showToast('Phone must start with 9 and be 10 digits (e.g. 9876543210)', 'error');
      return;
    }
    doCompleteProfile({
      registrationToken,
      fullName: fullName.trim(),
      phoneNumber: phone,
    });
  }, [registrationToken, fullName, phoneNumber, doCompleteProfile, showToast]);

  const handleResendCode = useCallback(() => {
    doSendOtp(email.trim());
  }, [email, doSendOtp]);

  const handleBack = useCallback(() => {
    if (step === 'code') {
      setStep('email');
      setCode('');
    } else if (step === 'profile') {
      setStep('code');
    }
  }, [step]);

  const currentStepIndex = STEP_ORDER.indexOf(step);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={
          isDark
            ? [theme.BACKGROUND, theme.BACKGROUND, theme.SECONDARY + '08']
            : [theme.BACKGROUND, theme.BACKGROUND, theme.SECONDARY + '06']
        }
        style={{ flex: 1 }}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <AuthHeader
            title={
              step === 'email'
                ? 'Sign in'
                : step === 'code'
                  ? 'Verify code'
                  : 'Complete profile'
            }
          />

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            <View style={styles.stepDots}>
              {STEP_ORDER.map((s, i) => (
                <View
                  key={s}
                  style={[
                    styles.stepDot,
                    s === step && styles.stepDotActive,
                    {
                      backgroundColor:
                        i <= currentStepIndex ? theme.SECONDARY : theme.BORDER_COLOR,
                      opacity: i <= currentStepIndex ? 1 : 0.4,
                    },
                  ]}
                />
              ))}
            </View>

            {step === 'email' && (
              <Animated.View
                entering={FadeInDown.duration(450).springify().damping(18)}
                style={styles.card}
              >
                <View style={styles.cardInner}>
                  <View style={styles.iconRing}>
                    <MaterialIcons
                      name="mail-outline"
                      size={44}
                      color={theme.SECONDARY}
                    />
                  </View>
                  <Text style={styles.title}>Enter your email</Text>
                  <Text style={styles.subtitle}>
                    We'll send you a secure verification code. No password needed.
                  </Text>
                  <View style={styles.inputWrap}>
                    <Input
                      placeholder="you@example.com"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                    />
                  </View>

                  <View style={styles.termsRow}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => setAcceptedTerms((v) => !v)}
                      style={styles.checkboxTouch}
                    >
                      <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
                        {acceptedTerms && (
                          <MaterialIcons name="check" size={18} color={theme.PRIMARY} />
                        )}
                      </View>
                    </TouchableOpacity>
                    <Text style={styles.termsLabel}>
                      I accept the{' '}
                      <Text
                        style={styles.termsLink}
                        onPress={() => setTermsModalVisible(true)}
                      >
                        Terms and Conditions
                      </Text>
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={handleSendOtp}
                    disabled={sendingOtp || !acceptedTerms}
                    activeOpacity={0.85}
                    style={{ width: '100%' }}
                  >
                    <LinearGradient
                      colors={
                        acceptedTerms && !sendingOtp
                          ? [theme.SECONDARY, theme.SECONDARY + 'E6']
                          : [theme.BORDER_COLOR, theme.BORDER_COLOR]
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.primaryButton}
                    >
                      {sendingOtp ? (
                        <ActivityIndicator size="small" color={theme.PRIMARY} />
                      ) : (
                        <View style={styles.primaryButtonInner}>
                          <MaterialIcons
                            name="send"
                            size={22}
                            color={theme.PRIMARY}
                          />
                          <Text style={styles.primaryButtonText}>
                            Send verification code
                          </Text>
                        </View>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>

                  <TermsModal
                    visible={termsModalVisible}
                    onClose={() => setTermsModalVisible(false)}
                  />
                </View>
              </Animated.View>
            )}

            {step === 'code' && (
              <Animated.View
                entering={FadeInDown.duration(450).springify().damping(18)}
                style={styles.card}
              >
                <View style={styles.cardInner}>
                  <View style={styles.iconRing}>
                    <MaterialIcons
                      name="mark-email-read"
                      size={44}
                      color={theme.SECONDARY}
                    />
                  </View>
                  <Text style={styles.title}>Check your inbox</Text>
                  <Text style={styles.subtitle}>
                    We sent a 6-digit code to{' '}
                    <Text style={{ color: theme.SECONDARY, fontWeight: '700' }}>
                      {email}
                    </Text>
                    . It expires in 5 minutes.
                  </Text>

                  <View style={styles.codeInputWrapper}>
                    <TextInput
                      style={[
                        styles.codeInput,
                        code.length === 6 && {
                          borderColor: theme.SECONDARY + '80',
                          backgroundColor: theme.SECONDARY + '08',
                        },
                      ]}
                      placeholder="000000"
                      placeholderTextColor={theme.PLACEHOLDER_COLOR}
                      value={code}
                      onChangeText={(t) =>
                        setCode(t.replace(/\D/g, '').slice(0, 6))
                      }
                      keyboardType="number-pad"
                      maxLength={6}
                      autoFocus
                    />
                  </View>

                  <TouchableOpacity
                    onPress={handleVerifyOtp}
                    disabled={verifying || code.length !== 6}
                    activeOpacity={0.85}
                    style={{ width: '100%' }}
                  >
                    <LinearGradient
                      colors={
                        code.length === 6 && !verifying
                          ? [theme.SECONDARY, theme.SECONDARY + 'E6']
                          : [theme.BORDER_COLOR, theme.BORDER_COLOR]
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={[
                        styles.primaryButton,
                        (verifying || code.length !== 6) && {
                          opacity: 0.7,
                        },
                      ]}
                    >
                      {verifying ? (
                        <ActivityIndicator size="small" color={theme.PRIMARY} />
                      ) : (
                        <View style={styles.primaryButtonInner}>
                          <MaterialIcons
                            name="verified-user"
                            size={22}
                            color={theme.PRIMARY}
                          />
                          <Text style={styles.primaryButtonText}>
                            Verify & continue
                          </Text>
                        </View>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleResendCode}
                    disabled={sendingOtp}
                    style={styles.resendBtn}
                  >
                    <Text style={styles.resendText}>
                      Didn't get it? Resend code
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
                    <Text style={styles.backText}>← Change email</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            )}

            {step === 'profile' && (
              <Animated.View
                entering={FadeInDown.duration(450).springify().damping(18)}
                style={styles.card}
              >
                <View style={styles.cardInner}>
                  <View style={styles.iconRing}>
                    <MaterialIcons
                      name="person-add-alt-1"
                      size={44}
                      color={theme.SECONDARY}
                    />
                  </View>
                  <Text style={styles.title}>Almost there</Text>
                  <Text style={styles.subtitle}>
                    Tell us your name and phone so we can personalize your experience.
                  </Text>
                  <Text style={styles.emailHint}>{verifiedEmail}</Text>

                  <View style={styles.inputWrap}>
                    <Input
                      placeholder="Full name"
                      value={fullName}
                      onChangeText={setFullName}
                    />
                  </View>
                  <View style={styles.inputWrap}>
                    <Input
                      placeholder="Phone · 9XXXXXXXXX"
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      keyboardType="phone-pad"
                    />
                  </View>

                  <TouchableOpacity
                    onPress={handleCompleteProfile}
                    disabled={completing}
                    activeOpacity={0.85}
                    style={{ width: '100%' }}
                  >
                    <LinearGradient
                      colors={[theme.SECONDARY, theme.SECONDARY + 'E6']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.primaryButton}
                    >
                      {completing ? (
                        <ActivityIndicator size="small" color={theme.PRIMARY} />
                      ) : (
                        <View style={styles.primaryButtonInner}>
                          <MaterialIcons
                            name="check-circle"
                            size={22}
                            color={theme.PRIMARY}
                          />
                          <Text style={styles.primaryButtonText}>
                            Complete & sign in
                          </Text>
                        </View>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
                    <Text style={styles.backText}>← Back</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

export default OtpFlow;
