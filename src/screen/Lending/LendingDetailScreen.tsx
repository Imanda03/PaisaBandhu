import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PressableScale from '../../components/PressableScale';
import PaymentTimeline from './components/PaymentTimeline';
import RecordPaymentSheet from './components/RecordPaymentSheet';
import EditPaymentSheet from './components/EditPaymentSheet';
import {
  useLending,
  useRecordPayment,
  useSettleLending,
  useDeleteLending,
  useUpdatePayment,
  useDeletePayment,
} from '../../ReactQueryHook/lending.hook';
import { LendingPayment } from '../../services/LendingService';
import { fontSize, scale, spacing, verticalScale } from '../../utils/responsive';
import { MaterialIcons, IoniconsIcon } from '../../utils/Icons';
import { formatCurrency } from '../../utils/currency';
import {
  lendingProgress,
  lendingRemaining,
  useLendingChrome,
} from './lendingTheme';
import { useModal } from '../../context/ModalContext';
import { SkeletonLendingDetail } from '../../components/skeleton';

type RouteParams = { id: string };

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const LendingDetailScreen: React.FC = () => {
  const {
    theme,
    isDark,
    rim,
    rimMetallic,
    innerBg,
    faceColors,
    goldCTA,
    lentAccent,
    borrowedAccent,
    lentGlow,
    borrowedGlow,
    topAccent,
  } = useLendingChrome();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params as RouteParams;
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [editPaymentOpen, setEditPaymentOpen] = useState(false);
  const [editingPaymentIndex, setEditingPaymentIndex] = useState<number | null>(null);
  const [editingPayment, setEditingPayment] = useState<LendingPayment | null>(null);

  const { data: lending, isLoading, isError, refetch } = useLending(id);
  const { mutate: recordPayment, isLoading: paying } = useRecordPayment(id);
  const { mutate: updatePayment, isLoading: updatingPayment } = useUpdatePayment(id);
  const { mutate: deletePayment } = useDeletePayment(id);
  const { mutate: settle, isLoading: settling } = useSettleLending(id);
  const { mutate: remove } = useDeleteLending(id);
  const { showModal, hideModal, showConfirm } = useModal();

  const paid = useMemo(
    () => lending?.payments.reduce((s, p) => s + p.amount, 0) ?? 0,
    [lending],
  );
  const remaining = useMemo(
    () => (lending ? lendingRemaining(lending) : 0),
    [lending],
  );
  const progress = useMemo(
    () => (lending ? lendingProgress(lending) : 0),
    [lending],
  );
  const paidPct = Math.round(progress * 100);

  const isOverdue = useMemo(() => {
    if (!lending?.dueDate || lending.status === 'settled') return false;
    return new Date(lending.dueDate) < new Date();
  }, [lending]);

  const handleSettle = () => {
    showModal({
      title: 'Mark as settled?',
      message: 'This will close the lending record.',
      type: 'warning',
      buttons: [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => hideModal(),
        },
        {
          text: 'Settle',
          style: 'default',
          onPress: () => {
            hideModal();
            settle(undefined, { onSuccess: () => refetch() });
          },
        },
      ],
    });
  };

  const handleDeletePayment = (index: number) => {
    showConfirm(
      'Delete payment?',
      'This will remove the payment from history.',
      () =>
        deletePayment(index, {
          onSuccess: () => refetch(),
        }),
    );
  };

  const handleEditPayment = (index: number, payment: LendingPayment) => {
    setEditingPaymentIndex(index);
    setEditingPayment(payment);
    setEditPaymentOpen(true);
  };

  const otherPaidForEdit =
    editingPaymentIndex != null && lending
      ? lending.payments.reduce(
          (s, p, i) => (i === editingPaymentIndex ? s : s + p.amount),
          0,
        )
      : 0;

  const handleDeleteLending = () => {
    showConfirm(
      'Delete lending?',
      'This cannot be undone.',
      () => remove(undefined, { onSuccess: () => navigation.goBack() }),
    );
  };

  if (isLoading) {
    return (
      <SkeletonLendingDetail
        theme={theme}
        paddingTop={insets.top}
        paddingBottom={insets.bottom}
        headerGradient={theme.HEADER_GRADIENT}
      />
    );
  }

  if (isError || !lending) {
    return (
      <View style={[styles.center, { backgroundColor: theme.BACKGROUND, paddingTop: insets.top }]}>
        <Text style={{ color: theme.ERROR, fontWeight: '700' }}>Failed to load lending.</Text>
        <PressableScale onPress={() => refetch()} style={[styles.retry, { borderColor: theme.SECONDARY }]}>
          <Text style={{ color: theme.SECONDARY, fontWeight: '800' }}>Retry</Text>
        </PressableScale>
      </View>
    );
  }

  const isLent = lending.type === 'lent';
  const accentPair = isLent ? lentAccent : borrowedAccent;
  const glow = isLent ? lentGlow : borrowedGlow;
  const accentColor = isLent ? theme.SUCCESS : theme.ERROR;

  const isSettled = lending.status === 'settled';
  const canModify = !isSettled;

  return (
    <View style={[styles.root, { backgroundColor: theme.HEADER_GRADIENT[0] }]}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[...theme.HEADER_GRADIENT]}
        style={[styles.headerGrad, { paddingTop: insets.top + spacing(10) }]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <LinearGradient
          colors={['rgba(198, 165, 107, 0.35)', 'rgba(198, 165, 107, 0)', 'transparent']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.headerGoldWash}
          pointerEvents="none"
        />
        <View style={styles.headerRow}>
          <PressableScale
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <IoniconsIcon name="arrow-back" size={26} color="rgba(255, 252, 247, 0.95)" />
          </PressableScale>

          <View style={styles.headerCenter}>
            <Text style={styles.headerOverline}>Private ledger</Text>
            <Text style={styles.headerPerson} numberOfLines={2}>
              {lending.personName}
            </Text>
            <LinearGradient
              colors={[...goldCTA]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.recordChip}
            >
              <MaterialIcons
                name={isLent ? 'north-east' : 'south-west'}
                size={14}
                color={theme.NAVBAR_ACTIVE_TEXT}
              />
              <Text style={[styles.recordChipText, { color: theme.NAVBAR_ACTIVE_TEXT }]}>
                {isLent ? 'Lent record' : 'Borrowed record'}
              </Text>
            </LinearGradient>
          </View>

          <View style={styles.headerActions}>
            {canModify ? (
              <PressableScale
                onPress={() =>
                  navigation.navigate('AddLending' as never, { id: lending.id } as never)
                }
                style={styles.headerIconBtn}
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.14)', 'rgba(255,255,255,0.06)']}
                  style={StyleSheet.absoluteFill}
                />
                <MaterialIcons name="edit" size={20} color="rgba(255, 250, 242, 0.95)" />
              </PressableScale>
            ) : null}
            <PressableScale onPress={handleDeleteLending} style={styles.headerIconBtn}>
              <LinearGradient
                colors={['rgba(255,255,255,0.14)', 'rgba(255,255,255,0.06)']}
                style={StyleSheet.absoluteFill}
              />
              <MaterialIcons name="delete-outline" size={20} color="rgba(255, 200, 200, 0.98)" />
            </PressableScale>
          </View>
        </View>
      </LinearGradient>

      <View style={[styles.sheet, { backgroundColor: theme.BACKGROUND }]}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing(32) }]}
        showsVerticalScrollIndicator={false}
      >
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
                colors={[accentPair[0], accentPair[1]]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.heroAccent}
              />
              <LinearGradient
                colors={[...topAccent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.heroTopAccent}
              />

              <View style={[styles.heroPad, { backgroundColor: innerBg }]}>
                <View style={styles.badges}>
                  <LinearGradient
                    colors={[...goldCTA]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.typeBadge}
                  >
                    <Text style={[styles.badgeText, { color: theme.NAVBAR_ACTIVE_TEXT }]}>
                      {isLent ? 'Lent' : 'Borrowed'}
                    </Text>
                  </LinearGradient>
                  <View style={[styles.badge, { borderColor: rim, borderWidth: 1 }]}>
                    <Text style={[styles.badgeText, { color: theme.TEXT }]}>
                      {lending.status.replace('_', ' ')}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.amountLabel, { color: theme.LIGHT_TEXT }]}>
                  Total amount
                </Text>
                <Text style={[styles.amount, { color: theme.TEXT }]}>
                  {formatCurrency(lending.amount)}
                </Text>

                {lending.status !== 'settled' ? (
                  <>
                    <View style={[styles.progressTrack, { backgroundColor: glow }]}>
                      <LinearGradient
                        colors={[accentPair[0], accentPair[1]]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={[styles.progressFill, { width: `${paidPct}%` }]}
                      />
                    </View>
                    <View style={styles.progressMeta}>
                      <Text style={[styles.balance, { color: accentColor }]}>
                        {formatCurrency(remaining)} remaining
                      </Text>
                      <Text style={[styles.paidMeta, { color: theme.LIGHT_TEXT }]}>
                        {paidPct}% repaid · {formatCurrency(paid)} paid
                      </Text>
                    </View>
                  </>
                ) : (
                  <Text style={[styles.balance, { color: theme.SUCCESS }]}>
                    Fully settled
                  </Text>
                )}
              </View>
            </LinearGradient>
          </LinearGradient>
        </View>

        {isOverdue ? (
          <View style={[styles.banner, { backgroundColor: theme.ERROR_LIGHT, borderColor: theme.ERROR + '44' }]}>
            <MaterialIcons name="warning-amber" size={20} color={theme.ERROR} />
            <Text style={[styles.bannerText, { color: theme.ERROR }]}>
              Overdue — was due {formatDate(lending.dueDate!)}
            </Text>
          </View>
        ) : null}

        <View style={styles.metaGrid}>
          <View style={[styles.metaCard, { borderColor: rim }]}>
            <MaterialIcons name="event" size={16} color={theme.SECONDARY} />
            <Text style={[styles.metaLabel, { color: theme.LIGHT_TEXT }]}>Started</Text>
            <Text style={[styles.metaValue, { color: theme.TEXT }]}>
              {formatDate(lending.date)}
            </Text>
          </View>
          <View style={[styles.metaCard, { borderColor: rim }]}>
            <MaterialIcons name="schedule" size={16} color={theme.SECONDARY} />
            <Text style={[styles.metaLabel, { color: theme.LIGHT_TEXT }]}>Due</Text>
            <Text style={[styles.metaValue, { color: lending.dueDate ? theme.TEXT : theme.LIGHT_TEXT }]}>
              {lending.dueDate ? formatDate(lending.dueDate) : 'Not set'}
            </Text>
          </View>
        </View>

        {lending.personContact ? (
          <View style={[styles.contactCard, { borderColor: rim }]}>
            <MaterialIcons name="contact-phone" size={18} color={theme.SECONDARY} />
            <Text style={[styles.contactText, { color: theme.TEXT }]}>
              {lending.personContact}
            </Text>
          </View>
        ) : null}

        {lending.description ? (
          <View style={[styles.noteCard, { borderColor: rim, backgroundColor: innerBg }]}>
            <Text style={[styles.noteLabel, { color: theme.SECONDARY }]}>Note</Text>
            <Text style={[styles.desc, { color: theme.LIGHT_TEXT }]}>{lending.description}</Text>
          </View>
        ) : null}

        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIcon, { backgroundColor: theme.SECONDARY + '22' }]}>
            <MaterialIcons name="history" size={18} color={theme.SECONDARY} />
          </View>
          <View>
            <Text style={[styles.section, { color: theme.TEXT }]}>Payment history</Text>
            <Text style={[styles.sectionSub, { color: theme.LIGHT_TEXT }]}>
              {lending.payments.length} recorded payment{lending.payments.length === 1 ? '' : 's'}
            </Text>
          </View>
        </View>

        {isSettled ? (
          <View style={[styles.settledBanner, { borderColor: theme.SUCCESS + '44', backgroundColor: theme.SUCCESS + '12' }]}>
            <MaterialIcons name="verified" size={18} color={theme.SUCCESS} />
            <Text style={[styles.settledText, { color: theme.SUCCESS }]}>
              Settled — this record is read-only
            </Text>
          </View>
        ) : null}

        <PaymentTimeline
          payments={lending.payments}
          canEdit={canModify}
          onEditPayment={handleEditPayment}
          onDeletePayment={handleDeletePayment}
        />

        {canModify ? (
          <View style={styles.actions}>
            <PressableScale onPress={() => setPaymentOpen(true)} style={styles.primaryWrap}>
              <LinearGradient
                colors={[...goldCTA]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryBtn}
              >
                <MaterialIcons name="payments" size={20} color={theme.NAVBAR_ACTIVE_TEXT} />
                <Text style={[styles.primaryText, { color: theme.NAVBAR_ACTIVE_TEXT }]}>
                  Record payment
                </Text>
              </LinearGradient>
            </PressableScale>
            <PressableScale
              onPress={handleSettle}
              disabled={settling}
              style={[styles.outlineBtn, { borderColor: theme.SECONDARY }]}
            >
              <MaterialIcons name="verified" size={18} color={theme.SECONDARY} />
              <Text style={[styles.outlineText, { color: theme.SECONDARY }]}>
                Mark as settled
              </Text>
            </PressableScale>
          </View>
        ) : null}
      </ScrollView>
      </View>

      <RecordPaymentSheet
        visible={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        maxAmount={remaining}
        loading={paying}
        onSubmit={data => {
          recordPayment(data, {
            onSuccess: () => {
              setPaymentOpen(false);
              refetch();
            },
          });
        }}
      />

      <EditPaymentSheet
        visible={editPaymentOpen}
        onClose={() => {
          setEditPaymentOpen(false);
          setEditingPaymentIndex(null);
          setEditingPayment(null);
        }}
        payment={editingPayment ?? undefined}
        maxTotal={lending.amount}
        otherPaid={otherPaidForEdit}
        loading={updatingPayment}
        onSubmit={data => {
          if (editingPaymentIndex == null) return;
          updatePayment(
            { paymentIndex: editingPaymentIndex, data },
            {
              onSuccess: () => {
                setEditPaymentOpen(false);
                setEditingPaymentIndex(null);
                setEditingPayment(null);
                refetch();
              },
            },
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing(14) },
  retry: {
    paddingHorizontal: spacing(18),
    paddingVertical: spacing(10),
    borderRadius: scale(14),
    borderWidth: 1.5,
  },
  headerGrad: {
    paddingBottom: spacing(18),
    paddingHorizontal: spacing(20),
    overflow: 'hidden',
  },
  headerGoldWash: {
    ...StyleSheet.absoluteFillObject,
    height: verticalScale(120),
    top: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing(10),
  },
  backBtn: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(14),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing(2),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(198, 165, 107, 0.35)',
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  headerCenter: { flex: 1, minWidth: 0, paddingTop: spacing(2) },
  headerOverline: {
    fontSize: fontSize(10),
    fontWeight: '800',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    color: 'rgba(198, 165, 107, 0.98)',
    marginBottom: spacing(6),
  },
  headerPerson: {
    fontSize: fontSize(22),
    fontWeight: '800',
    letterSpacing: -0.4,
    color: 'rgba(255, 252, 247, 0.98)',
    lineHeight: Math.round(fontSize(22) * 1.2),
    marginBottom: spacing(10),
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  recordChip: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    gap: spacing(6),
    paddingHorizontal: spacing(12),
    paddingVertical: spacing(7),
    borderRadius: scale(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  recordChipText: {
    fontSize: fontSize(11),
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  headerActions: { flexDirection: 'row', gap: spacing(8), marginTop: spacing(4) },
  headerIconBtn: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(14),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(198, 165, 107, 0.38)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  sheet: {
    flex: 1,
    borderTopLeftRadius: scale(28),
    borderTopRightRadius: scale(28),
    marginTop: -spacing(8),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.12,
        shadowRadius: 18,
      },
      android: { elevation: 10 },
    }),
  },
  content: { paddingHorizontal: spacing(20), paddingTop: spacing(20) },
  settledBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(8),
    padding: spacing(12),
    borderRadius: scale(14),
    borderWidth: 1,
    marginBottom: spacing(14),
  },
  settledText: { fontSize: fontSize(13), fontWeight: '700' },
  heroRim: {
    borderRadius: scale(24),
    borderWidth: 1,
    padding: scale(1.5),
    marginBottom: spacing(16),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#C6A56B',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
      },
      android: { elevation: 6 },
    }),
  },
  heroRimInner: { borderRadius: scale(22), overflow: 'hidden' },
  heroFace: { borderRadius: scale(20), overflow: 'hidden' },
  heroAccent: { height: verticalScale(4), width: '100%' },
  heroTopAccent: { height: verticalScale(3), width: '100%' },
  heroPad: { padding: spacing(22) },
  badges: { flexDirection: 'row', gap: spacing(8), marginBottom: spacing(16) },
  typeBadge: {
    paddingHorizontal: spacing(12),
    paddingVertical: spacing(6),
    borderRadius: scale(10),
  },
  badge: { paddingHorizontal: spacing(10), paddingVertical: spacing(6), borderRadius: scale(10) },
  badgeText: { fontSize: fontSize(11), fontWeight: '800', textTransform: 'capitalize' },
  amountLabel: {
    fontSize: fontSize(11),
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: spacing(6),
  },
  amount: {
    fontSize: fontSize(36),
    fontWeight: '800',
    letterSpacing: -0.8,
    marginBottom: spacing(14),
  },
  progressTrack: {
    height: verticalScale(8),
    borderRadius: scale(5),
    overflow: 'hidden',
    marginBottom: spacing(10),
  },
  progressFill: { height: '100%', borderRadius: scale(5) },
  progressMeta: { gap: spacing(4) },
  balance: { fontSize: fontSize(16), fontWeight: '800' },
  paidMeta: { fontSize: fontSize(12), fontWeight: '600' },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(10),
    padding: spacing(14),
    borderRadius: scale(16),
    borderWidth: 1,
    marginBottom: spacing(14),
  },
  bannerText: { fontWeight: '700', fontSize: fontSize(13), flex: 1 },
  metaGrid: { flexDirection: 'row', gap: spacing(10), marginBottom: spacing(12) },
  metaCard: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: scale(16),
    padding: spacing(14),
    gap: spacing(4),
  },
  metaLabel: { fontSize: fontSize(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 },
  metaValue: { fontSize: fontSize(14), fontWeight: '800' },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(10),
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: scale(14),
    padding: spacing(14),
    marginBottom: spacing(12),
  },
  contactText: { fontSize: fontSize(14), fontWeight: '600', flex: 1 },
  noteCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: scale(16),
    padding: spacing(16),
    marginBottom: spacing(16),
  },
  noteLabel: {
    fontSize: fontSize(10),
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: spacing(6),
  },
  desc: { fontSize: fontSize(14), lineHeight: fontSize(20) },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(12),
    marginTop: spacing(8),
    marginBottom: spacing(4),
  },
  sectionIcon: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: { fontSize: fontSize(17), fontWeight: '800', letterSpacing: -0.2 },
  sectionSub: { fontSize: fontSize(12), fontWeight: '600', marginTop: spacing(2) },
  actions: { marginTop: spacing(26), gap: spacing(12) },
  primaryWrap: { borderRadius: scale(16), overflow: 'hidden' },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing(8),
    paddingVertical: spacing(16),
  },
  primaryText: { fontSize: fontSize(15), fontWeight: '800' },
  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing(8),
    borderRadius: scale(16),
    paddingVertical: spacing(14),
    borderWidth: 1.5,
  },
  outlineText: { fontSize: fontSize(15), fontWeight: '700' },
});

export default LendingDetailScreen;
