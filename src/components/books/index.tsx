import { View, Text, TouchableOpacity } from 'react-native';
import React, { useMemo } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { createStyles } from './styles';
import { useTheme } from '../../utils/colors';
import {
  FeatherIcon,
  MaterialIcons,
  IoniconsIcon,
  MaterialCommunityIcon,
} from '../../utils/Icons';

interface BookItem {
  id: string;
  title: string;
  transactionCount: number;
  type: 'single' | 'group' | 'personal';
  isShared?: boolean;
  ownerName?: string | null;
}

export type BookListLayout = 'list' | 'grid';

interface BookListItemProps {
  item: BookItem;
  onEditPress: () => void;
  onPress?: () => void;
  layout?: BookListLayout;
  /** Position in the visible list (for engraved serial). */
  listIndex?: number;
}

const withAlpha = (hex: string, alphaHex: string) => {
  if (!hex.startsWith('#') || hex.length < 7) {
    return hex;
  }
  return `${hex}${alphaHex}`;
};

const FORGED_RIM_LIGHT = [
  '#E4D5B8',
  '#FFFCF7',
  '#C6A56B',
  '#A8894F',
  '#D8CAB0',
] as const;

const FORGED_RIM_DARK = [
  '#5C5648',
  '#2A292E',
  '#9A8354',
  '#C6A56B',
  '#3D3C42',
] as const;

const BookListItem = ({
  item,
  onEditPress,
  onPress,
  layout = 'list',
  listIndex,
}: BookListItemProps) => {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const isSingle = item.type === 'single' || item.type === 'personal';
  const isSharedBook = item.isShared === true;
  const accentColor = isSharedBook
    ? theme.SECONDARY
    : isSingle
    ? theme.SUCCESS
    : theme.WARNING;

  const typeLabel = isSharedBook
    ? 'Shared'
    : isSingle
    ? 'Solo'
    : 'Group';

  const iconName = isSharedBook
    ? 'account-group-outline'
    : isSingle
    ? 'notebook-outline'
    : 'account-multiple-outline';

  const n = item.transactionCount || 0;
  const countLabel =
    layout === 'grid'
      ? `${n} ${n === 1 ? 'txn' : 'txns'}`
      : `${n} ${n === 1 ? 'transaction' : 'transactions'}`;

  const serial =
    listIndex != null
      ? String(listIndex + 1).padStart(2, '0')
      : '—';

  const rim = isDark ? FORGED_RIM_DARK : FORGED_RIM_LIGHT;
  const onGold = theme.NAVBAR_ACTIVE_TEXT;

  const perfDots = [0, 1, 2, 3, 4];

  const gridBarColors = [
    withAlpha(accentColor, 'EE'),
    withAlpha(accentColor, '44'),
    withAlpha(accentColor, '88'),
  ];

  const renderList = () => (
    <TouchableOpacity activeOpacity={0.82} onPress={onPress}>
      <LinearGradient
        colors={[...rim]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.forgedOuter, isSharedBook && styles.sharedForged]}
      >
        <View style={styles.forgedPlate}>
          <LinearGradient
            pointerEvents="none"
            colors={
              isDark
                ? ['rgba(198,165,107,0.07)', 'transparent', 'rgba(0,0,0,0.35)']
                : ['rgba(255,255,255,0.5)', 'transparent', 'rgba(198,165,107,0.06)']
            }
            style={styles.vignette}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.bracketTL} />
          <View style={styles.bracketBR} />

          <View style={styles.listRow}>
            <View style={styles.prismSlot}>
              <LinearGradient
                colors={[accentColor, withAlpha(accentColor, '00')]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.prism}
              />
            </View>

            <View style={styles.perfCol}>
              {perfDots.map(i => (
                <View
                  key={i}
                  style={[styles.perfDot, { backgroundColor: accentColor }]}
                />
              ))}
            </View>

            <LinearGradient
              colors={[withAlpha(theme.SECONDARY, '55'), withAlpha(theme.SECONDARY, 'CC')]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconSealOuter}
            >
              <View
                style={[
                  styles.iconSealInner,
                  { borderColor: withAlpha(accentColor, '55') },
                ]}
              >
                <MaterialCommunityIcon
                  name={iconName}
                  size={26}
                  color={accentColor}
                />
              </View>
            </LinearGradient>

            <View style={styles.listBody}>
              <View style={styles.listTopActions}>
                <Text
                  style={[styles.vaultCatalog, styles.vaultCatalogShrink]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  ◆ VAULT · {typeLabel.toUpperCase()}
                </Text>
                {!isSharedBook ? (
                  <TouchableOpacity
                    onPress={onEditPress}
                    style={styles.listEdit}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    accessibilityLabel="Edit book"
                  >
                    <FeatherIcon
                      name="edit-3"
                      size={21}
                      color={theme.SECONDARY}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
              <Text
                style={styles.listTitle}
                numberOfLines={3}
                ellipsizeMode="tail"
                maxFontSizeMultiplier={1.25}
              >
                {item.title}
              </Text>
              <View style={styles.listMetaRow}>
                <View style={styles.listStat}>
                  <MaterialIcons
                    name="receipt-long"
                    size={17}
                    color={accentColor}
                  />
                  <Text style={styles.listStatText}>{countLabel}</Text>
                </View>
              </View>
              {isSharedBook && item.ownerName ? (
                <Text style={styles.listShared} numberOfLines={1}>
                  Custodian · {item.ownerName}
                </Text>
              ) : null}
            </View>

            <LinearGradient
              colors={['#2C261C', '#C6A56B', '#E8D4A8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.ingotRail}
            >
              <IoniconsIcon name="chevron-forward" size={22} color={onGold} />
              <Text style={[styles.ingotSerial, { color: onGold }]}>{serial}</Text>
            </LinearGradient>
          </View>

          <LinearGradient
            pointerEvents="none"
            colors={
              isDark
                ? ['rgba(255,255,255,0.06)', 'transparent']
                : ['rgba(255,255,255,0.65)', 'transparent']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 0.9, y: 0.45 }}
            style={styles.shineSweep}
          />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderGrid = () => (
    <TouchableOpacity activeOpacity={0.82} onPress={onPress}>
      <LinearGradient
        colors={[...rim]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.forgedOuterGrid, isSharedBook && styles.sharedForged]}
      >
        <View style={styles.forgedPlateGrid}>
          <LinearGradient
            colors={gridBarColors}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.gridIngotBar}
          />

          <LinearGradient
            pointerEvents="none"
            colors={
              isDark
                ? ['rgba(198,165,107,0.06)', 'transparent', 'rgba(0,0,0,0.3)']
                : ['rgba(255,255,255,0.45)', 'transparent', 'rgba(198,165,107,0.05)']
            }
            style={styles.vignette}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />

          <View style={styles.bracketTRGrid} />
          <View style={styles.bracketBLGrid} />

          <Text style={styles.gridSerialAbs}>No. {serial}</Text>

          <View style={styles.gridNotchRow}>
            {perfDots.slice(0, 4).map(i => (
              <View
                key={i}
                style={[styles.gridNotchDot, { backgroundColor: accentColor }]}
              />
            ))}
          </View>

          <View style={styles.gridSealWrap}>
            <LinearGradient
              colors={[withAlpha(theme.SECONDARY, '66'), withAlpha(theme.SECONDARY, 'DD')]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gridSealOuter}
            >
              <View
                style={[
                  styles.gridSealInner,
                  { borderColor: withAlpha(accentColor, '50') },
                ]}
              >
                <MaterialCommunityIcon
                  name={iconName}
                  size={26}
                  color={accentColor}
                />
              </View>
            </LinearGradient>
          </View>

          <View style={styles.gridBody}>
            <View style={styles.gridHeadRow}>
              <Text
                style={[styles.gridTypeCaps, { color: accentColor }]}
                numberOfLines={1}
              >
                {typeLabel.toUpperCase()}
              </Text>
              <View style={styles.gridSpacer} />
              {!isSharedBook ? (
                <TouchableOpacity
                  onPress={onEditPress}
                  style={styles.gridEdit}
                  hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                  accessibilityLabel="Edit book"
                >
                  <FeatherIcon
                    name="edit-3"
                    size={19}
                    color={theme.SECONDARY}
                  />
                </TouchableOpacity>
              ) : null}
            </View>

            <Text
              style={styles.gridTitle}
              numberOfLines={3}
              ellipsizeMode="tail"
              maxFontSizeMultiplier={1.25}
            >
              {item.title}
            </Text>

            <View style={styles.gridFoot}>
              <View style={styles.gridStat}>
                <MaterialIcons
                  name="receipt-long"
                  size={15}
                  color={accentColor}
                />
                <Text style={styles.gridStatTxt} numberOfLines={1}>
                  {countLabel}
                </Text>
              </View>
              <LinearGradient
                colors={['#3A3428', '#C6A56B']}
                style={styles.gridChevGold}
              >
                <IoniconsIcon name="chevron-forward" size={17} color={onGold} />
              </LinearGradient>
            </View>

            {isSharedBook && item.ownerName ? (
              <Text style={styles.gridShared} numberOfLines={1}>
                {item.ownerName}
              </Text>
            ) : null}
          </View>

          <LinearGradient
            pointerEvents="none"
            colors={
              isDark
                ? ['rgba(255,255,255,0.05)', 'transparent']
                : ['rgba(255,255,255,0.55)', 'transparent']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.shineSweep}
          />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return layout === 'grid' ? renderGrid() : renderList();
};

export default BookListItem;
