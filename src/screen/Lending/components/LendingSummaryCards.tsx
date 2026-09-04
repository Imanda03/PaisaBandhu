import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Lending } from '../../../services/LendingService';
import { fontSize, scale, spacing, verticalScale } from '../../../utils/responsive';
import { MaterialIcons } from '../../../utils/Icons';
import AnimatedNumber from '../../../components/AnimatedNumber';
import { formatAmountNumber, CURRENCY_SYMBOL } from '../../../utils/currency';
import { lendingRemaining, useLendingChrome } from '../lendingTheme';

interface Props {
  lendings: Lending[];
}

function sumPending(items: Lending[], type: 'lent' | 'borrowed') {
  return items
    .filter(l => l.type === type && l.status !== 'settled')
    .reduce((s, l) => s + lendingRemaining(l), 0);
}

function countActive(items: Lending[], type: 'lent' | 'borrowed') {
  return items.filter(l => l.type === type && l.status !== 'settled').length;
}

const LendingSummaryCards: React.FC<Props> = ({ lendings }) => {
  const { theme, isDark, rim, innerBg, rimMetallic, vaultFace, topAccent, goldCTA } =
    useLendingChrome();

  const lent = useMemo(() => sumPending(lendings, 'lent'), [lendings]);
  const owe = useMemo(() => sumPending(lendings, 'borrowed'), [lendings]);
  const net = lent - owe;
  const lentCount = useMemo(() => countActive(lendings, 'lent'), [lendings]);
  const oweCount = useMemo(() => countActive(lendings, 'borrowed'), [lendings]);
  const netPositive = net >= 0;
  const netColor = netPositive ? theme.SUCCESS : theme.ERROR;

  return (
    <View style={[styles.rimOuter, { borderColor: rim }]}>
      <LinearGradient
        colors={rimMetallic}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.rimGrad}
      >
        <LinearGradient
          colors={vaultFace}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.shell}
        >
          <LinearGradient
            colors={[...topAccent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.topAccent}
          />

          <View style={[styles.pad, { backgroundColor: innerBg }]}>
            {/* Compact header row */}
            <View style={styles.topRow}>
              <LinearGradient
                colors={[...goldCTA]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconGem}
              >
                <MaterialIcons
                  name="account-balance-wallet"
                  size={15}
                  color={theme.NAVBAR_ACTIVE_TEXT}
                />
              </LinearGradient>
              <View style={styles.topCopy}>
                <Text style={[styles.overline, { color: theme.SECONDARY }]}>
                  Vault
                </Text>
                <Text style={[styles.netLabel, { color: theme.LIGHT_TEXT }]}>
                  Net position
                </Text>
              </View>
              <View style={[styles.countPill, { borderColor: rim }]}>
                <Text style={[styles.countText, { color: theme.SECONDARY }]}>
                  {lendings.length}
                </Text>
              </View>
            </View>

            {/* Hero net — single tight line */}
            <View style={styles.netRow}>
              <Text style={[styles.netSign, { color: netColor }]}>
                {netPositive ? '+' : '−'}
              </Text>
              <Text style={[styles.netSymbol, { color: netColor }]}>
                {CURRENCY_SYMBOL}
              </Text>
              <AnimatedNumber
                value={Math.abs(net)}
                style={[styles.netAmount, { color: netColor }]}
                formatter={v =>
                  formatAmountNumber(Math.round(v), { maximumFractionDigits: 0 })
                }
              />
            </View>

            {/* Inline lent / owe strip */}
            <View style={[styles.strip, { borderColor: rim }]}>
              <View style={styles.stripHalf}>
                <View style={styles.stripLabelRow}>
                  <View style={[styles.stripDot, { backgroundColor: theme.SUCCESS }]} />
                  <Text style={[styles.stripLabel, { color: theme.LIGHT_TEXT }]}>
                    Lent
                  </Text>
                </View>
                <Text style={[styles.stripValue, { color: theme.SUCCESS }]}>
                  {CURRENCY_SYMBOL} {formatAmountNumber(lent, { maximumFractionDigits: 0 })}
                </Text>
                <Text style={[styles.stripSub, { color: theme.LIGHT_TEXT }]}>
                  {lentCount} active
                </Text>
              </View>

              <View style={[styles.stripDivider, { backgroundColor: rim }]} />

              <View style={styles.stripHalf}>
                <View style={styles.stripLabelRow}>
                  <View style={[styles.stripDot, { backgroundColor: theme.ERROR }]} />
                  <Text style={[styles.stripLabel, { color: theme.LIGHT_TEXT }]}>
                    Owe
                  </Text>
                </View>
                <Text style={[styles.stripValue, { color: theme.ERROR }]}>
                  {CURRENCY_SYMBOL} {formatAmountNumber(owe, { maximumFractionDigits: 0 })}
                </Text>
                <Text style={[styles.stripSub, { color: theme.LIGHT_TEXT }]}>
                  {oweCount} active
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  rimOuter: {
    borderRadius: scale(18),
    borderWidth: 1,
    padding: scale(1),
    marginBottom: spacing(14),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#C6A56B',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 14,
      },
      android: { elevation: 5 },
    }),
  },
  rimGrad: { borderRadius: scale(17), overflow: 'hidden' },
  shell: { borderRadius: scale(16), overflow: 'hidden' },
  topAccent: { height: verticalScale(2.5), width: '100%' },
  pad: { paddingHorizontal: spacing(14), paddingVertical: spacing(12) },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(10),
    marginBottom: spacing(8),
  },
  iconGem: {
    width: scale(30),
    height: scale(30),
    borderRadius: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  topCopy: { flex: 1 },
  overline: {
    fontSize: fontSize(9),
    fontWeight: '800',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  netLabel: {
    fontSize: fontSize(11),
    fontWeight: '700',
    marginTop: spacing(1),
  },
  countPill: {
    minWidth: scale(28),
    height: scale(28),
    borderRadius: scale(9),
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing(8),
  },
  countText: { fontSize: fontSize(12), fontWeight: '800' },
  netRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing(10),
  },
  netSign: { fontSize: fontSize(16), fontWeight: '800', marginRight: spacing(2) },
  netSymbol: {
    fontSize: fontSize(14),
    fontWeight: '800',
    marginRight: spacing(4),
  },
  netAmount: { fontSize: fontSize(28), fontWeight: '800', letterSpacing: -0.8 },
  strip: {
    flexDirection: 'row',
    borderRadius: scale(12),
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    backgroundColor: 'rgba(198,165,107,0.04)',
  },
  stripHalf: {
    flex: 1,
    paddingVertical: spacing(9),
    paddingHorizontal: spacing(10),
    alignItems: 'center',
  },
  stripDivider: { width: StyleSheet.hairlineWidth },
  stripLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(5),
    marginBottom: spacing(3),
  },
  stripDot: { width: scale(5), height: scale(5), borderRadius: scale(3) },
  stripLabel: {
    fontSize: fontSize(9),
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  stripValue: { fontSize: fontSize(13), fontWeight: '800', letterSpacing: -0.2 },
  stripSub: { fontSize: fontSize(9), fontWeight: '600', marginTop: spacing(2) },
});

export default LendingSummaryCards;
