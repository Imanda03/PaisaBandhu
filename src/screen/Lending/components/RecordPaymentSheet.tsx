import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import BottomSheet from '../../../components/BottomSheet';
import TextArea from '../../../components/core/TextArea';
import PressableScale from '../../../components/PressableScale';
import { fontSize, scale, spacing, verticalScale } from '../../../utils/responsive';
import { CURRENCY_SYMBOL, formatAmountNumber, formatCurrency } from '../../../utils/currency';
import { MaterialIcons } from '../../../utils/Icons';
import { useLendingChrome } from '../lendingTheme';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { amount: number; note?: string }) => void;
  loading?: boolean;
  maxAmount?: number;
}

function sanitizeAmountInput(text: string) {
  let t = text.replace(/[^0-9.]/g, '');
  const dot = t.indexOf('.');
  if (dot !== -1) {
    t =
      t.slice(0, dot + 1) +
      t.slice(dot + 1).replace(/\./g, '');
    const [, dec = ''] = t.split('.');
    t =
      t.split('.')[0] +
      (t.includes('.') ? '.' + dec.replace(/\D/g, '').slice(0, 2) : '');
  }
  return t;
}

const RecordPaymentSheet: React.FC<Props> = ({
  visible,
  onClose,
  onSubmit,
  loading,
  maxAmount,
}) => {
  const { theme, isDark, rim, rimMetallic, faceColors, innerBg, goldCTA, topAccent } =
    useLendingChrome();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const remaining = maxAmount ?? 0;

  useEffect(() => {
    if (!visible) {
      setAmount('');
      setNote('');
      setError('');
    }
  }, [visible]);

  const quickOptions = useMemo(() => {
    if (remaining <= 0) return [];
    const half = Math.round(remaining / 2);
    return [
      { key: 'full', label: 'Pay full', value: remaining },
      ...(half > 0 && half < remaining
        ? [{ key: 'half', label: 'Half', value: half }]
        : []),
    ];
  }, [remaining]);

  const handleSubmit = () => {
    const num = Number(amount);
    if (!num || num <= 0) {
      setError('Enter a valid payment amount');
      return;
    }
    if (maxAmount != null && num > maxAmount) {
      setError(`Cannot exceed ${formatCurrency(maxAmount)}`);
      return;
    }
    setError('');
    onSubmit({ amount: num, note: note.trim() || undefined });
  };

  return (
    <BottomSheet isVisible={visible} onClose={onClose} hideHeader>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {/* Sheet header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={[styles.overline, { color: theme.SECONDARY }]}>
                Settlement
              </Text>
              <Text style={[styles.title, { color: theme.TEXT }]}>
                Record payment
              </Text>
            </View>
            <PressableScale onPress={onClose} style={[styles.closeBtn, { borderColor: rim }]}>
              <MaterialIcons name="close" size={20} color={theme.LIGHT_TEXT} />
            </PressableScale>
          </View>

          {/* Hero — remaining balance */}
          {maxAmount != null ? (
            <View style={[styles.heroRim, { borderColor: rim }]}>
              <LinearGradient
                colors={rimMetallic}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroRimInner}
              >
                <LinearGradient
                  colors={faceColors}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.heroFace}
                >
                  <LinearGradient
                    colors={[...topAccent]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.heroAccent}
                  />
                  <View style={[styles.heroPad, { backgroundColor: innerBg }]}>
                    <LinearGradient
                      colors={[...goldCTA]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.heroChip}
                    >
                      <Text style={[styles.heroChipText, { color: theme.NAVBAR_ACTIVE_TEXT }]}>
                        REMAINING
                      </Text>
                    </LinearGradient>
                    <Text style={[styles.heroAmount, { color: theme.TEXT }]}>
                      {formatCurrency(remaining)}
                    </Text>
                    <Text style={[styles.heroHint, { color: theme.LIGHT_TEXT }]}>
                      Log what was paid back toward this lending.
                    </Text>
                  </View>
                </LinearGradient>
              </LinearGradient>
            </View>
          ) : null}

          {/* Quick amounts */}
          {quickOptions.length > 0 ? (
            <View style={styles.quickRow}>
              {quickOptions.map(opt => {
                const active = amount === String(opt.value);
                return (
                  <TouchableOpacity
                    key={opt.key}
                    activeOpacity={0.88}
                    onPress={() => {
                      setAmount(String(opt.value));
                      setError('');
                    }}
                    style={styles.quickBtn}
                  >
                    {active ? (
                      <LinearGradient
                        colors={[...goldCTA]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                      />
                    ) : (
                      <View
                        style={[
                          StyleSheet.absoluteFill,
                          styles.quickBtnIdle,
                          { borderColor: rim },
                        ]}
                      />
                    )}
                    <Text
                      style={[
                        styles.quickLabel,
                        {
                          color: active ? theme.NAVBAR_ACTIVE_TEXT : theme.TEXT,
                        },
                      ]}
                    >
                      {opt.label}
                    </Text>
                    <Text
                      style={[
                        styles.quickValue,
                        {
                          color: active ? theme.NAVBAR_ACTIVE_TEXT : theme.LIGHT_TEXT,
                        },
                      ]}
                    >
                      {CURRENCY_SYMBOL}{' '}
                      {formatAmountNumber(opt.value, { maximumFractionDigits: 0 })}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}

          {/* Amount section */}
          <View style={[styles.sectionRim, { borderColor: rim }]}>
            <LinearGradient
              colors={rimMetallic}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.sectionRimInner}
            >
              <View style={[styles.sectionInner, { backgroundColor: theme.BACKGROUND_LIGHT }]}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIcon, { backgroundColor: theme.SECONDARY + '22' }]}>
                    <MaterialIcons name="payments" size={18} color={theme.SECONDARY} />
                  </View>
                  <Text style={[styles.sectionLabel, { color: theme.TEXT }]}>Amount</Text>
                  <Text style={[styles.sectionHint, { color: theme.SECONDARY }]}>Required</Text>
                </View>
                <View style={[styles.amountRow, { borderColor: rim }]}>
                  <Text style={[styles.amountPrefix, { color: theme.TEXT }]}>
                    {CURRENCY_SYMBOL}
                  </Text>
                  <TextInput
                    style={[styles.amountInput, { color: theme.TEXT }]}
                    value={amount}
                    onChangeText={text => {
                      setAmount(sanitizeAmountInput(text));
                      setError('');
                    }}
                    placeholder="0.00"
                    placeholderTextColor={theme.PLACEHOLDER_COLOR}
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                  />
                </View>
                {error ? (
                  <Text style={[styles.errorText, { color: theme.ERROR }]}>{error}</Text>
                ) : null}
              </View>
            </LinearGradient>
          </View>

          {/* Note section */}
          <View style={[styles.sectionRim, { borderColor: rim }]}>
            <LinearGradient
              colors={rimMetallic}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.sectionRimInner}
            >
              <View style={[styles.sectionInner, { backgroundColor: theme.BACKGROUND_LIGHT }]}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIcon, { backgroundColor: theme.SECONDARY + '22' }]}>
                    <MaterialIcons name="sticky-note-2" size={18} color={theme.SECONDARY} />
                  </View>
                  <Text style={[styles.sectionLabel, { color: theme.TEXT }]}>Note</Text>
                  <Text style={[styles.sectionHint, { color: theme.LIGHT_TEXT }]}>
                    Optional
                  </Text>
                </View>
                <TextArea
                  placeholder="Cash, UPI, bank transfer…"
                  value={note}
                  onChangeText={setNote}
                />
              </View>
            </LinearGradient>
          </View>

          <PressableScale
            onPress={handleSubmit}
            disabled={loading}
            style={[styles.btnWrap, loading && styles.btnDisabled]}
          >
            <LinearGradient
              colors={[...goldCTA]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.btn}
            >
              {loading ? (
                <Text style={[styles.btnText, { color: theme.NAVBAR_ACTIVE_TEXT }]}>
                  Saving…
                </Text>
              ) : (
                <>
                  <MaterialIcons name="check-circle" size={20} color={theme.NAVBAR_ACTIVE_TEXT} />
                  <Text style={[styles.btnText, { color: theme.NAVBAR_ACTIVE_TEXT }]}>
                    Save payment
                  </Text>
                </>
              )}
            </LinearGradient>
          </PressableScale>
        </ScrollView>
      </KeyboardAvoidingView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: spacing(20),
    paddingBottom: spacing(28),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing(16),
    paddingTop: spacing(4),
  },
  overline: {
    fontSize: fontSize(10),
    fontWeight: '800',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    marginBottom: spacing(2),
  },
  title: { fontSize: fontSize(22), fontWeight: '800', letterSpacing: -0.3 },
  closeBtn: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(12),
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroRim: {
    borderRadius: scale(20),
    borderWidth: 1,
    padding: scale(1),
    marginBottom: spacing(14),
    overflow: 'hidden',
  },
  heroRimInner: { borderRadius: scale(19), overflow: 'hidden' },
  heroFace: { borderRadius: scale(18), overflow: 'hidden' },
  heroAccent: { height: verticalScale(3), width: '100%' },
  heroPad: { padding: spacing(16) },
  heroChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing(10),
    paddingVertical: spacing(4),
    borderRadius: scale(10),
    marginBottom: spacing(8),
  },
  heroChipText: {
    fontSize: fontSize(9),
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  heroAmount: {
    fontSize: fontSize(30),
    fontWeight: '800',
    letterSpacing: -0.6,
    marginBottom: spacing(4),
  },
  heroHint: { fontSize: fontSize(12), fontWeight: '600', lineHeight: fontSize(17) },
  quickRow: { flexDirection: 'row', gap: spacing(10), marginBottom: spacing(14) },
  quickBtn: {
    flex: 1,
    borderRadius: scale(14),
    paddingVertical: spacing(12),
    paddingHorizontal: spacing(10),
    alignItems: 'center',
    overflow: 'hidden',
    minHeight: verticalScale(56),
    justifyContent: 'center',
  },
  quickBtnIdle: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: scale(14),
    backgroundColor: 'rgba(198,165,107,0.05)',
  },
  quickLabel: { fontSize: fontSize(11), fontWeight: '800', marginBottom: spacing(2) },
  quickValue: { fontSize: fontSize(12), fontWeight: '700' },
  sectionRim: {
    borderRadius: scale(18),
    borderWidth: 1,
    padding: scale(1),
    marginBottom: spacing(12),
    overflow: 'hidden',
  },
  sectionRimInner: { borderRadius: scale(17), overflow: 'hidden' },
  sectionInner: {
    borderRadius: scale(16),
    padding: spacing(16),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'transparent',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing(12),
    paddingBottom: spacing(10),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128,128,128,0.15)',
  },
  sectionIcon: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {
    flex: 1,
    marginLeft: spacing(10),
    fontSize: fontSize(11),
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  sectionHint: { fontSize: fontSize(11), fontWeight: '600' },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: scale(14),
    paddingHorizontal: spacing(14),
    paddingVertical: spacing(12),
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  amountPrefix: { fontSize: fontSize(20), fontWeight: '800', marginRight: spacing(8) },
  amountInput: {
    flex: 1,
    fontSize: fontSize(22),
    fontWeight: '700',
    padding: 0,
    margin: 0,
  },
  errorText: { fontSize: fontSize(12), fontWeight: '600', marginTop: spacing(8) },
  btnWrap: {
    marginTop: spacing(8),
    borderRadius: scale(16),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#C6A56B',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
    }),
  },
  btnDisabled: { opacity: 0.65 },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing(8),
    paddingVertical: spacing(16),
  },
  btnText: { fontSize: fontSize(15), fontWeight: '800' },
});

export default RecordPaymentSheet;
