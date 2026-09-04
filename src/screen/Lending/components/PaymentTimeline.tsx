import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { LendingPayment } from '../../../services/LendingService';
import { fontSize, scale, spacing } from '../../../utils/responsive';
import { MaterialIcons } from '../../../utils/Icons';
import { formatCurrency } from '../../../utils/currency';
import { useLendingChrome } from '../lendingTheme';

/** Must match combined width of edit + delete swipe columns (see styles.swipeEdit / swipeDelete). */
const SWIPE_ACTION_BTN_W = scale(72);
const SWIPE_ACTION_TOTAL_W = SWIPE_ACTION_BTN_W * 2;

interface Props {
  payments: LendingPayment[];
  canEdit?: boolean;
  onEditPayment?: (index: number, payment: LendingPayment) => void;
  onDeletePayment?: (index: number) => void;
}

/** Keeps edit + delete moving as one strip with the row instead of uncovering delete before edit. */
function PaymentSwipeActions({
  dragTranslation,
  index,
  payments,
  goldCTA,
  theme,
  onEditPayment,
  onDeletePayment,
}: {
  dragTranslation: SharedValue<number>;
  index: number;
  payments: LendingPayment[];
  goldCTA: readonly string[];
  theme: { NAVBAR_ACTIVE_TEXT: string };
  onEditPayment?: (index: number, payment: LendingPayment) => void;
  onDeletePayment?: (index: number) => void;
}) {
  const slideStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateX: interpolate(
            dragTranslation.value,
            [-SWIPE_ACTION_TOTAL_W, 0],
            [0, SWIPE_ACTION_TOTAL_W],
            Extrapolation.CLAMP,
          ),
        },
      ],
    }),
    [],
  );

  return (
    <Animated.View style={[styles.swipeActions, slideStyle]}>
      <TouchableOpacity
        style={styles.swipeEdit}
        onPress={() => onEditPayment?.(index, payments[index])}
        activeOpacity={0.88}
      >
        <LinearGradient colors={[...goldCTA]} style={styles.swipeGrad}>
          <MaterialIcons name="edit" size={18} color={theme.NAVBAR_ACTIVE_TEXT} />
          <Text style={[styles.swipeText, { color: theme.NAVBAR_ACTIVE_TEXT }]}>Edit</Text>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.swipeDelete}
        onPress={() => onDeletePayment?.(index)}
        activeOpacity={0.88}
      >
        <MaterialIcons name="delete-outline" size={18} color="#fff" />
        <Text style={styles.swipeDeleteText}>Delete</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const PaymentTimeline: React.FC<Props> = ({
  payments,
  canEdit = false,
  onEditPayment,
  onDeletePayment,
}) => {
  const { theme, rim, rimMetallic, faceColors, innerBg, hairline, goldCTA } =
    useLendingChrome();

  /** Softer spring than Swipeable defaults — less “snappy / mechanical” on open & close. */
  const swipeAnimationOptions = useMemo(
    () => ({
      damping: 30,
      stiffness: 260,
      mass: 0.88,
      overshootClamping: true,
    }),
    [],
  );

  const renderRow = (p: LendingPayment, i: number) => (
    <View style={styles.rowWrap}>
      <View style={styles.railCol}>
        {i < payments.length - 1 ? (
          <View style={[styles.railLine, { backgroundColor: hairline }]} />
        ) : null}
        <LinearGradient colors={[theme.SECONDARY, '#A8894F']} style={styles.dot}>
          <MaterialIcons name="payments" size={10} color={theme.NAVBAR_ACTIVE_TEXT} />
        </LinearGradient>
      </View>

      <View
        style={[
          styles.row,
          i < payments.length - 1 && {
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: hairline,
          },
        ]}
      >
        <View style={styles.body}>
          <Text style={[styles.amount, { color: theme.TEXT }]}>
            {formatCurrency(p.amount)}
          </Text>
          <Text style={[styles.date, { color: theme.LIGHT_TEXT }]}>
            {new Date(p.date).toLocaleDateString('en-IN', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </Text>
          {p.note ? (
            <Text style={[styles.note, { color: theme.LIGHT_TEXT }]}>{p.note}</Text>
          ) : null}
        </View>
        <View style={[styles.paidPill, { backgroundColor: theme.SUCCESS + '16' }]}>
          <Text style={[styles.paidText, { color: theme.SUCCESS }]}>Paid</Text>
        </View>
      </View>
    </View>
  );

  if (!payments.length) {
    return (
      <View style={[styles.emptyRim, { borderColor: rim }]}>
        <LinearGradient colors={faceColors} style={styles.emptyShell}>
          <View style={[styles.emptyPad, { backgroundColor: innerBg }]}>
            <MaterialIcons name="history" size={28} color={theme.SECONDARY} />
            <Text style={[styles.emptyTitle, { color: theme.TEXT }]}>No payments yet</Text>
            <Text style={[styles.emptyText, { color: theme.LIGHT_TEXT }]}>
              Record the first repayment to build your timeline.
            </Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={[styles.listRim, { borderColor: rim }]}>
      <LinearGradient colors={rimMetallic} style={styles.listRimInner}>
        <LinearGradient colors={faceColors} style={styles.listShell}>
          <View style={[styles.listPad, { backgroundColor: innerBg }]}>
            {canEdit ? (
              <Text style={[styles.swipeHint, { color: theme.LIGHT_TEXT }]}>
                Swipe left on a payment to edit or delete
              </Text>
            ) : null}
            {payments.map((p, i) =>
              canEdit ? (
                <Swipeable
                  key={`payment-${i}-${String(p.date)}`}
                  renderRightActions={(_progress, dragTranslation) => (
                    <PaymentSwipeActions
                      dragTranslation={dragTranslation}
                      index={i}
                      payments={payments}
                      goldCTA={goldCTA}
                      theme={theme}
                      onEditPayment={onEditPayment}
                      onDeletePayment={onDeletePayment}
                    />
                  )}
                  overshootRight={false}
                  overshootFriction={14}
                  friction={1.06}
                  animationOptions={swipeAnimationOptions}
                  childrenContainerStyle={styles.swipeChild}
                >
                  {renderRow(p, i)}
                </Swipeable>
              ) : (
                <View key={`payment-${i}-${String(p.date)}`}>{renderRow(p, i)}</View>
              ),
            )}
          </View>
        </LinearGradient>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  listRim: {
    borderRadius: scale(20),
    borderWidth: 1,
    padding: scale(1.5),
    overflow: 'hidden',
    marginTop: spacing(10),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 14,
      },
      android: { elevation: 4 },
    }),
  },
  listRimInner: { borderRadius: scale(18), overflow: 'hidden' },
  listShell: { borderRadius: scale(16), overflow: 'hidden' },
  listPad: { paddingVertical: spacing(6) },
  swipeHint: {
    fontSize: fontSize(11),
    fontWeight: '600',
    paddingHorizontal: spacing(14),
    paddingTop: spacing(8),
    paddingBottom: spacing(4),
  },
  swipeChild: {
    flex: 1,
    alignSelf: 'stretch',
  },
  rowWrap: {
    flexDirection: 'row',
    paddingLeft: spacing(14),
    backgroundColor: 'transparent',
    width: '100%',
  },
  railCol: {
    width: scale(28),
    alignItems: 'center',
    paddingTop: spacing(18),
  },
  railLine: {
    position: 'absolute',
    top: scale(34),
    bottom: -spacing(8),
    width: scale(2),
    borderRadius: scale(1),
  },
  dot: {
    width: scale(22),
    height: scale(22),
    borderRadius: scale(11),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing(14),
    paddingRight: spacing(14),
    gap: spacing(10),
  },
  body: { flex: 1 },
  amount: { fontSize: fontSize(16), fontWeight: '800', letterSpacing: -0.2 },
  date: { fontSize: fontSize(12), fontWeight: '600', marginTop: spacing(3) },
  note: { fontSize: fontSize(13), marginTop: spacing(5), lineHeight: fontSize(18) },
  paidPill: {
    paddingHorizontal: spacing(10),
    paddingVertical: spacing(5),
    borderRadius: scale(10),
  },
  paidText: { fontSize: fontSize(10), fontWeight: '800', letterSpacing: 0.5 },
  swipeActions: {
    flexDirection: 'row',
    height: '100%',
    width: SWIPE_ACTION_TOTAL_W,
  },
  swipeEdit: { width: SWIPE_ACTION_BTN_W, justifyContent: 'center' },
  swipeGrad: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing(4),
    paddingHorizontal: spacing(6),
  },
  swipeText: { fontSize: fontSize(10), fontWeight: '800' },
  swipeDelete: {
    width: SWIPE_ACTION_BTN_W,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing(4),
  },
  swipeDeleteText: { color: '#fff', fontSize: fontSize(10), fontWeight: '800' },
  emptyRim: {
    borderRadius: scale(18),
    borderWidth: 1,
    overflow: 'hidden',
    marginTop: spacing(10),
  },
  emptyShell: { borderRadius: scale(16), overflow: 'hidden' },
  emptyPad: {
    padding: spacing(28),
    alignItems: 'center',
    gap: spacing(8),
  },
  emptyTitle: { fontSize: fontSize(16), fontWeight: '800' },
  emptyText: { fontSize: fontSize(13), textAlign: 'center', lineHeight: fontSize(18) },
});

export default PaymentTimeline;
