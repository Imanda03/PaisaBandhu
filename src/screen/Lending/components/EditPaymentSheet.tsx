import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import BottomSheet from '../../../components/BottomSheet';
import DatePicker from '../../../components/core/DatePicker';
import TextArea from '../../../components/core/TextArea';
import PressableScale from '../../../components/PressableScale';
import { fontSize, scale, spacing, verticalScale } from '../../../utils/responsive';
import { CURRENCY_SYMBOL, formatCurrency } from '../../../utils/currency';
import { MaterialIcons } from '../../../utils/Icons';
import { LendingPayment } from '../../../services/LendingService';
import { useLendingChrome } from '../lendingTheme';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { amount: number; note?: string; date?: Date }) => void;
  loading?: boolean;
  payment?: LendingPayment;
  maxTotal?: number;
  otherPaid?: number;
}

function sanitizeAmountInput(text: string) {
  let t = text.replace(/[^0-9.]/g, '');
  const dot = t.indexOf('.');
  if (dot !== -1) {
    t = t.slice(0, dot + 1) + t.slice(dot + 1).replace(/\./g, '');
    const [, dec = ''] = t.split('.');
    t =
      t.split('.')[0] +
      (t.includes('.') ? '.' + dec.replace(/\D/g, '').slice(0, 2) : '');
  }
  return t;
}

const EditPaymentSheet: React.FC<Props> = ({
  visible,
  onClose,
  onSubmit,
  loading,
  payment,
  maxTotal,
  otherPaid = 0,
}) => {
  const { theme, rim, rimMetallic, goldCTA, topAccent, faceColors, innerBg } =
    useLendingChrome();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date());
  const [error, setError] = useState('');

  const maxForThis =
    maxTotal != null ? Math.max(maxTotal - otherPaid, 0) : undefined;

  useEffect(() => {
    if (visible && payment) {
      setAmount(String(payment.amount));
      setNote(payment.note ?? '');
      setDate(new Date(payment.date));
      setError('');
    }
    if (!visible) {
      setAmount('');
      setNote('');
      setError('');
    }
  }, [visible, payment]);

  const handleSubmit = () => {
    const num = Number(amount);
    if (!num || num <= 0) {
      setError('Enter a valid payment amount');
      return;
    }
    if (maxForThis != null && num > maxForThis) {
      setError(`Cannot exceed ${formatCurrency(maxForThis)} for this entry`);
      return;
    }
    onSubmit({ amount: num, note: note.trim() || undefined, date });
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
          <View style={styles.headerRow}>
            <View>
              <Text style={[styles.overline, { color: theme.SECONDARY }]}>
                Payment history
              </Text>
              <Text style={[styles.title, { color: theme.TEXT }]}>
                Edit payment
              </Text>
            </View>
            <PressableScale onPress={onClose} style={[styles.closeBtn, { borderColor: rim }]}>
              <MaterialIcons name="close" size={20} color={theme.LIGHT_TEXT} />
            </PressableScale>
          </View>

          <View style={[styles.heroRim, { borderColor: rim }]}>
            <LinearGradient colors={rimMetallic} style={styles.heroRimInner}>
              <LinearGradient colors={faceColors} style={styles.heroFace}>
                <LinearGradient colors={[...topAccent]} style={styles.heroAccent} />
                <View style={[styles.heroPad, { backgroundColor: innerBg }]}>
                  <LinearGradient colors={[...goldCTA]} style={styles.heroChip}>
                    <Text style={[styles.heroChipText, { color: theme.NAVBAR_ACTIVE_TEXT }]}>
                      ADJUST ENTRY
                    </Text>
                  </LinearGradient>
                  <Text style={[styles.heroHint, { color: theme.LIGHT_TEXT }]}>
                    Update amount, date, or note for this repayment.
                  </Text>
                </View>
              </LinearGradient>
            </LinearGradient>
          </View>

          <View style={[styles.sectionRim, { borderColor: rim }]}>
            <LinearGradient colors={rimMetallic} style={styles.sectionRimInner}>
              <View style={[styles.sectionInner, { backgroundColor: theme.BACKGROUND_LIGHT }]}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIcon, { backgroundColor: theme.SECONDARY + '22' }]}>
                    <MaterialIcons name="payments" size={18} color={theme.SECONDARY} />
                  </View>
                  <Text style={[styles.sectionLabel, { color: theme.TEXT }]}>Amount</Text>
                </View>
                <View style={[styles.amountRow, { borderColor: rim }]}>
                  <Text style={[styles.amountPrefix, { color: theme.TEXT }]}>
                    {CURRENCY_SYMBOL}
                  </Text>
                  <TextInput
                    style={[styles.amountInput, { color: theme.TEXT }]}
                    value={amount}
                    onChangeText={t => {
                      setAmount(sanitizeAmountInput(t));
                      setError('');
                    }}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                    placeholderTextColor={theme.PLACEHOLDER_COLOR}
                  />
                </View>
                {error ? (
                  <Text style={[styles.errorText, { color: theme.ERROR }]}>{error}</Text>
                ) : null}
              </View>
            </LinearGradient>
          </View>

          <View style={[styles.sectionRim, { borderColor: rim }]}>
            <LinearGradient colors={rimMetallic} style={styles.sectionRimInner}>
              <View style={[styles.sectionInner, { backgroundColor: theme.BACKGROUND_LIGHT }]}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIcon, { backgroundColor: theme.SECONDARY + '22' }]}>
                    <MaterialIcons name="event" size={18} color={theme.SECONDARY} />
                  </View>
                  <Text style={[styles.sectionLabel, { color: theme.TEXT }]}>Payment date</Text>
                </View>
                <DatePicker value={date} onChanged={setDate} placeholder="Select date" />
              </View>
            </LinearGradient>
          </View>

          <View style={[styles.sectionRim, { borderColor: rim }]}>
            <LinearGradient colors={rimMetallic} style={styles.sectionRimInner}>
              <View style={[styles.sectionInner, { backgroundColor: theme.BACKGROUND_LIGHT }]}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIcon, { backgroundColor: theme.SECONDARY + '22' }]}>
                    <MaterialIcons name="sticky-note-2" size={18} color={theme.SECONDARY} />
                  </View>
                  <Text style={[styles.sectionLabel, { color: theme.TEXT }]}>Note</Text>
                </View>
                <TextArea
                  placeholder="Optional context"
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
            <LinearGradient colors={[...goldCTA]} style={styles.btn}>
              <MaterialIcons name="save" size={20} color={theme.NAVBAR_ACTIVE_TEXT} />
              <Text style={[styles.btnText, { color: theme.NAVBAR_ACTIVE_TEXT }]}>
                {loading ? 'Saving…' : 'Save changes'}
              </Text>
            </LinearGradient>
          </PressableScale>
        </ScrollView>
      </KeyboardAvoidingView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: spacing(20), paddingBottom: spacing(28) },
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
    borderRadius: scale(18),
    borderWidth: 1,
    padding: scale(1),
    marginBottom: spacing(14),
    overflow: 'hidden',
  },
  heroRimInner: { borderRadius: scale(17), overflow: 'hidden' },
  heroFace: { borderRadius: scale(16), overflow: 'hidden' },
  heroAccent: { height: verticalScale(3), width: '100%' },
  heroPad: { padding: spacing(14) },
  heroChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing(10),
    paddingVertical: spacing(4),
    borderRadius: scale(10),
    marginBottom: spacing(8),
  },
  heroChipText: { fontSize: fontSize(9), fontWeight: '800', letterSpacing: 1.2 },
  heroHint: { fontSize: fontSize(12), fontWeight: '600', lineHeight: fontSize(17) },
  sectionRim: {
    borderRadius: scale(18),
    borderWidth: 1,
    padding: scale(1),
    marginBottom: spacing(12),
    overflow: 'hidden',
  },
  sectionRimInner: { borderRadius: scale(17), overflow: 'hidden' },
  sectionInner: { borderRadius: scale(16), padding: spacing(16) },
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
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: scale(14),
    paddingHorizontal: spacing(14),
    paddingVertical: spacing(12),
  },
  amountPrefix: { fontSize: fontSize(20), fontWeight: '800', marginRight: spacing(8) },
  amountInput: { flex: 1, fontSize: fontSize(22), fontWeight: '700', padding: 0 },
  errorText: { fontSize: fontSize(12), fontWeight: '600', marginTop: spacing(8) },
  btnWrap: { marginTop: spacing(8), borderRadius: scale(16), overflow: 'hidden' },
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

export default EditPaymentSheet;
