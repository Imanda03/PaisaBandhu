import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Lending } from '../../../services/LendingService';
import { fontSize, scale, spacing, verticalScale } from '../../../utils/responsive';
import { MaterialIcons } from '../../../utils/Icons';
import PressableScale from '../../../components/PressableScale';
import {
  lendingProgress,
  lendingRemaining,
  useLendingChrome,
} from '../lendingTheme';
import { formatCurrency } from '../../../utils/currency';

interface Props {
  item: Lending;
  onPress: () => void;
}

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function initialFor(name: string) {
  const t = name.trim();
  return t ? t.charAt(0).toUpperCase() : '?';
}

function statusLabel(status: Lending['status']) {
  return status.replace('_', ' ');
}

const LendingCard: React.FC<Props> = ({ item, onPress }) => {
  const {
    theme,
    isDark,
    rim,
    rimMetallic,
    faceColors,
    monoFill,
    lentAccent,
    borrowedAccent,
    lentGlow,
    borrowedGlow,
  } = useLendingChrome();

  const remaining = useMemo(() => lendingRemaining(item), [item]);
  const progress = useMemo(() => lendingProgress(item), [item]);
  const paidPct = Math.round(progress * 100);

  const isOverdue = useMemo(() => {
    if (!item.dueDate || item.status === 'settled') return false;
    return new Date(item.dueDate) < new Date();
  }, [item.dueDate, item.status]);

  const isLent = item.type === 'lent';
  const accentPair = isLent ? lentAccent : borrowedAccent;
  const glow = isLent ? lentGlow : borrowedGlow;
  const accentColor = isLent ? theme.SUCCESS : theme.ERROR;

  const statusColor =
    item.status === 'settled'
      ? theme.SUCCESS
      : item.status === 'partially_paid'
        ? theme.WARNING
        : theme.SECONDARY;

  return (
    <PressableScale onPress={onPress} style={styles.press}>
      <View style={[styles.rim, { borderColor: rim }]}>
        <LinearGradient
          colors={rimMetallic}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.rimInner}
        >
          <LinearGradient
            colors={faceColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.shell}
          >
            <LinearGradient
              colors={[accentPair[0], accentPair[1]]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.accentBar}
            />

            <View style={styles.row}>
              <LinearGradient
                colors={[accentPair[0], accentPair[1], accentPair[0]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.monoOuter}
              >
                <View style={[styles.monoInner, { backgroundColor: monoFill }]}>
                  <Text style={[styles.monoLetter, { color: accentColor }]}>
                    {initialFor(item.personName)}
                  </Text>
                </View>
              </LinearGradient>

              <View style={styles.mid}>
                <View style={styles.nameRow}>
                  <Text style={[styles.name, { color: theme.TEXT }]} numberOfLines={1}>
                    {item.personName}
                  </Text>
                  {isOverdue ? (
                    <View style={[styles.overduePill, { backgroundColor: theme.ERROR + '18' }]}>
                      <Text style={[styles.overdueText, { color: theme.ERROR }]}>Overdue</Text>
                    </View>
                  ) : null}
                </View>

                <Text style={[styles.meta, { color: theme.LIGHT_TEXT }]}>
                  {isLent ? 'You lent' : 'You borrowed'} · {formatDate(item.date)}
                </Text>

                {item.dueDate ? (
                  <Text
                    style={[
                      styles.due,
                      { color: isOverdue ? theme.ERROR : theme.LIGHT_TEXT },
                    ]}
                  >
                    Due {formatDate(item.dueDate)}
                  </Text>
                ) : null}

                {item.status !== 'settled' ? (
                  <View style={styles.progressBlock}>
                    <View style={[styles.progressTrack, { backgroundColor: glow }]}>
                      <LinearGradient
                        colors={[accentPair[0], accentPair[1]]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={[styles.progressFill, { width: `${paidPct}%` }]}
                      />
                    </View>
                    <Text style={[styles.progressLabel, { color: theme.LIGHT_TEXT }]}>
                      {paidPct}% repaid · {formatCurrency(remaining)} left
                    </Text>
                  </View>
                ) : (
                  <View style={[styles.chip, { borderColor: rim, backgroundColor: statusColor + '18' }]}>
                    <MaterialIcons name="check-circle" size={12} color={statusColor} />
                    <Text style={[styles.chipText, { color: statusColor }]}>
                      {statusLabel(item.status)}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.right}>
                <Text style={[styles.flowTag, { color: accentColor }]}>
                  {isLent ? 'Lent' : 'Owed'}
                </Text>
                <Text style={[styles.amount, { color: theme.TEXT }]} numberOfLines={1}>
                  {formatCurrency(item.amount)}
                </Text>
                {item.status !== 'settled' ? (
                  <Text style={[styles.remaining, { color: accentColor }]}>
                    {formatCurrency(remaining)}
                  </Text>
                ) : null}
                <MaterialIcons
                  name="chevron-right"
                  size={20}
                  color={theme.SECONDARY}
                  style={styles.chevron}
                />
              </View>
            </View>
          </LinearGradient>
        </LinearGradient>
      </View>
    </PressableScale>
  );
};

const styles = StyleSheet.create({
  press: { marginBottom: spacing(12) },
  rim: {
    borderRadius: scale(20),
    borderWidth: 1,
    padding: scale(1.5),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.14,
        shadowRadius: 18,
      },
      android: { elevation: 5 },
    }),
  },
  rimInner: { borderRadius: scale(18), overflow: 'hidden' },
  shell: { borderRadius: scale(16), overflow: 'hidden' },
  accentBar: { height: verticalScale(3), width: '100%' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing(14),
    paddingHorizontal: spacing(14),
    gap: spacing(12),
  },
  monoOuter: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
    padding: scale(2.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  monoInner: {
    width: '100%',
    height: '100%',
    borderRadius: scale(22),
    justifyContent: 'center',
    alignItems: 'center',
  },
  monoLetter: { fontSize: fontSize(19), fontWeight: '800' },
  mid: { flex: 1, minWidth: 0 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(6),
    marginBottom: spacing(3),
    flexWrap: 'wrap',
  },
  name: { fontSize: fontSize(15), fontWeight: '800', flexShrink: 1 },
  overduePill: {
    paddingHorizontal: spacing(7),
    paddingVertical: spacing(2),
    borderRadius: scale(8),
  },
  overdueText: { fontSize: fontSize(9), fontWeight: '800', letterSpacing: 0.4 },
  meta: { fontSize: fontSize(11), fontWeight: '600', marginBottom: spacing(2) },
  due: { fontSize: fontSize(11), fontWeight: '700', marginBottom: spacing(8) },
  progressBlock: { marginTop: spacing(2) },
  progressTrack: {
    height: verticalScale(5),
    borderRadius: scale(4),
    overflow: 'hidden',
    marginBottom: spacing(5),
  },
  progressFill: { height: '100%', borderRadius: scale(4) },
  progressLabel: { fontSize: fontSize(10), fontWeight: '700' },
  chip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(4),
    paddingHorizontal: spacing(8),
    paddingVertical: spacing(4),
    borderRadius: scale(8),
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: spacing(4),
  },
  chipText: {
    fontSize: fontSize(10),
    fontWeight: '800',
    textTransform: 'capitalize',
    letterSpacing: 0.3,
  },
  right: { alignItems: 'flex-end', minWidth: scale(76) },
  flowTag: {
    fontSize: fontSize(9),
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: spacing(3),
  },
  amount: { fontSize: fontSize(15), fontWeight: '800', letterSpacing: -0.3 },
  remaining: { fontSize: fontSize(12), fontWeight: '700', marginTop: spacing(2) },
  chevron: { marginTop: spacing(6), opacity: 0.85 },
});

export default LendingCard;
