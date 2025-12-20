import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { createStyles } from './styles';
import { useTheme } from '../../utils/colors';
import { FeatherIcon } from '../../utils/Icons';

interface BookItem {
  id: string;
  title: string;
  transactionCount: number;
  type: 'single' | 'personal';
}

interface BookListItemProps {
  item: BookItem;
  onEditPress: () => void;
  onPress?: () => void;
}

const BookListItem = ({ item, onEditPress, onPress }: BookListItemProps) => {
  const styles = createStyles();
  const { theme } = useTheme();
  console.log('items', item);
  return (
    <TouchableOpacity
      style={styles.cardContainer}
      activeOpacity={0.5}
      onPress={onPress}
    >
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={[styles.title, {}]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={[styles.subtitle, { color: theme.PLACEHOLDER_COLOR }]}>
            {item.transactionCount}{' '}
            {item.transactionCount === 1 ? 'transaction' : 'transactions'}
          </Text>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            onPress={onEditPress}
            style={styles.editButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <FeatherIcon name="edit" size={24} color={theme.TEXT} />
          </TouchableOpacity>
          <View
            style={[
              styles.typeBadge,
              {
                backgroundColor:
                  item.type === 'single'
                    ? theme.SUCCESS_LIGHT
                    : theme.WARNING_LIGHT,
              },
            ]}
          >
            <Text
              style={[
                styles.typeText,
                {
                  color: item.type === 'single' ? theme.SUCCESS : theme.WARNING,
                },
              ]}
            >
              {item?.type?.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BookListItem;
