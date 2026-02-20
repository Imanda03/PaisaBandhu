import { View, Text, TouchableOpacity } from 'react-native';
import React, { useMemo } from 'react';
import { createStyles } from './styles';
import { useTheme } from '../../utils/colors';
import { FeatherIcon, MaterialIcons, IoniconsIcon } from '../../utils/Icons';

interface BookItem {
  id: string;
  title: string;
  transactionCount: number;
  type: 'single' | 'group' | 'personal';
  isShared?: boolean;
  ownerName?: string | null;
}

interface BookListItemProps {
  item: BookItem;
  onEditPress: () => void;
  onPress?: () => void;
}

const BookListItem = ({ item, onEditPress, onPress }: BookListItemProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const isSingle = item.type === 'single' || item.type === 'personal';
  const isSharedBook = item.isShared === true;
  const accentColor = isSharedBook
    ? theme.SECONDARY
    : isSingle
      ? theme.SUCCESS
      : theme.WARNING;
  const iconBgColor = isSharedBook
    ? theme.SECONDARY + '20'
    : isSingle
      ? theme.SUCCESS_LIGHT
      : theme.WARNING_LIGHT;
  const iconColor = isSharedBook
    ? theme.SECONDARY
    : isSingle
      ? theme.SUCCESS
      : theme.WARNING;

  return (
    <TouchableOpacity
      style={[styles.cardContainer, isSharedBook && styles.sharedCard]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={[styles.accentStrip, { backgroundColor: accentColor }]} />
      <View style={styles.contentWrapper}>
        <View style={styles.leftSection}>
          <View
            style={[styles.iconContainer, { backgroundColor: iconBgColor }]}
          >
            <MaterialIcons
              name={isSharedBook ? 'people-outline' : isSingle ? 'account-balance-wallet' : 'group'}
              size={26}
              color={iconColor}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            {isSharedBook && item.ownerName && (
              <View style={styles.sharedBadge}>
                <Text style={styles.sharedBadgeText}>
                  Shared by {item.ownerName}
                </Text>
              </View>
            )}
            <View style={styles.subtitleContainer}>
              <MaterialIcons
                name="receipt-long"
                size={16}
                color={theme.ICON_MUTED}
              />
              <Text style={styles.subtitle}>
                {item.transactionCount || 0}{' '}
                {item.transactionCount === 1 ? 'txn' : 'txns'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.rightSection}>
          <View
            style={[
              styles.typeBadge,
              {
                backgroundColor: isSharedBook
                  ? theme.SECONDARY + '20'
                  : isSingle
                    ? theme.SUCCESS_LIGHT
                    : theme.WARNING_LIGHT,
              },
            ]}
          >
            <Text
              style={[
                styles.typeText,
                {
                  color: isSharedBook
                    ? theme.SECONDARY
                    : isSingle
                      ? theme.SUCCESS
                      : theme.WARNING,
                },
              ]}
            >
              {isSharedBook ? 'SHARED' : (item?.type?.toUpperCase() || 'SINGLE')}
            </Text>
          </View>
          {!isSharedBook && (
            <TouchableOpacity
              onPress={onEditPress}
              style={styles.editButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <FeatherIcon name="edit-3" size={18} color={theme.ICON_COLOR} />
            </TouchableOpacity>
          )}
          <View style={styles.chevronContainer}>
            <IoniconsIcon
              name="chevron-forward"
              size={20}
              color={theme.ICON_MUTED}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BookListItem;
