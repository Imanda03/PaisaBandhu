import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { createStyles } from './styles';
import { useTheme } from '../../utils/colors';
import { FeatherIcon, MaterialIcons } from '../../utils/Icons';

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
        {/* Left Section - Icon and Info */}
        <View style={styles.leftSection}>
          <View style={[styles.iconContainer, {
            backgroundColor: item.type === 'single' 
              ? theme.SUCCESS_LIGHT 
              : theme.WARNING_LIGHT
          }]}>
          <MaterialIcons 
            name={item.type === 'single' ? 'account-balance-wallet' : 'group'} 
            size={24} 
            color={item.type === 'single' ? theme.SUCCESS : theme.WARNING} 
          />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            <View style={styles.subtitleContainer}>
              <MaterialIcons name="receipt-long" size={15} color={theme.LIGHT_TEXT} />
              <Text style={styles.subtitle}>
                {item.transactionCount || 0} {item.transactionCount === 1 ? 'txn' : 'txns'}
              </Text>
            </View>
          </View>
        </View>

        {/* Right Section - Actions */}
        <View style={styles.rightSection}>
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
              {item?.type?.toUpperCase() || 'SINGLE'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onEditPress}
            style={styles.editButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View style={styles.editButtonContainer}>
              <FeatherIcon name="edit-3" size={17} color={theme.PURPLE} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BookListItem;
