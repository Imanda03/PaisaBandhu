import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcon } from '../../utils/Icons';
import { useTheme } from '../../utils/colors';
import { FeedItem as FeedItemType } from '../../services/SocialFeedService';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { formatTimeAgo } from '../../utils/helper';
import CustomConfirmationModal from '../core/ConfirmationModal';
import { useDeleteFeedItem, useUpdateFeedItemVisibility } from '../../ReactQueryHook/feed.hook';
import { useFetchUserDetails } from '../../ReactQueryHook/auth.hook';

interface FeedItemProps {
  item: FeedItemType;
  currentUserId?: string;
  feedType?: 'public' | 'private';
  onPress?: () => void;
  onReact?: (reaction: 'like' | 'celebrate') => void;
  onComment?: () => void;
}

const FeedItem: React.FC<FeedItemProps> = ({
  item,
  currentUserId,
  feedType = 'public',
  onPress,
  onReact,
  onComment,
}) => {
  const { theme } = useTheme();
  const [userReaction, setUserReaction] = useState(item.reactions.userReaction);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const styles = createStyles(theme);
  const { mutate: deleteFeedItem, isLoading: isDeleting } = useDeleteFeedItem();
  const { mutate: updateVisibility, isLoading: isUpdating } = useUpdateFeedItemVisibility();
  const { data: currentUser } = useFetchUserDetails();

  // Check if current user owns this item
  const isOwner = currentUserId === item.userId || currentUser?.id === item.userId;

  const handleDelete = () => {
    deleteFeedItem(item.id, {
      onSuccess: () => {
        setShowDeleteModal(false);
      },
    });
  };

  const handleToggleVisibility = () => {
    const newVisibility = item.visibility === 'public' ? 'private' : 'public';
    updateVisibility({
      itemId: item.id,
      visibility: newVisibility,
    });
  };

  const handleReact = (reaction: 'like' | 'celebrate') => {
    if (userReaction === reaction) {
      setUserReaction(undefined);
    } else {
      setUserReaction(reaction);
    }
    onReact?.(reaction);
  };

  const getTypeIcon = () => {
    switch (item.type) {
      case 'achievement':
        return '🎉';
      case 'challenge':
        return '🏆';
      case 'milestone':
        return '⭐';
      case 'group_activity':
        return '👥';
      case 'savings_goal':
        return '💰';
      default:
        return '📊';
    }
  };

  return (
    <Animated.View entering={FadeInDown}>
      <TouchableOpacity
        style={[styles.container, { backgroundColor: theme.BACKGROUND_LIGHT }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.header}>
          {item.isAnonymous ? (
            <View style={[styles.avatar, { backgroundColor: theme.PURPLE }]}>
              <Text style={styles.avatarText}>?</Text>
            </View>
          ) : (
            <View style={[styles.avatar, { backgroundColor: theme.PURPLE }]}>
              {item.userAvatar ? (
                <Image source={{ uri: item.userAvatar }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>
                  {item.userName.charAt(0).toUpperCase()}
                </Text>
              )}
            </View>
          )}
          <View style={styles.headerContent}>
            <Text style={[styles.userName, { color: theme.TEXT }]}>
              {item.isAnonymous ? 'Someone' : item.userName}
            </Text>
            <Text style={[styles.time, { color: theme.LIGHT_TEXT }]}>
              {formatTimeAgo(item.createdAt.toString())}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.typeIcon}>{getTypeIcon()}</Text>
            {isOwner && feedType === 'private' && (
              <View style={styles.ownerActions}>
                <TouchableOpacity
                  onPress={handleToggleVisibility}
                  style={styles.actionButton}
                  disabled={isUpdating}
                >
                  <MaterialIcons
                    name={item.visibility === 'public' ? 'public' : 'lock'}
                    size={18}
                    color={theme.LIGHT_TEXT}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowDeleteModal(true)}
                  style={styles.actionButton}
                  disabled={isDeleting}
                >
                  <MaterialIcons
                    name="delete-outline"
                    size={18}
                    color={theme.ERROR}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <View style={styles.body}>
          <Text style={[styles.title, { color: theme.TEXT }]}>{item.title}</Text>
          <Text style={[styles.description, { color: theme.LIGHT_TEXT }]}>
            {item.description}
          </Text>
          {item.data.amount && (
            <View style={styles.amountContainer}>
              <Text style={[styles.amount, { color: theme.PURPLE }]}>
                ₹{item.data.amount.toLocaleString()}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <View style={styles.reactions}>
            <TouchableOpacity
              style={styles.reactionButton}
              onPress={() => handleReact('like')}
            >
              <MaterialCommunityIcon
                name={userReaction === 'like' ? 'thumb-up' : 'thumb-up-outline'}
                size={20}
                color={userReaction === 'like' ? theme.PURPLE : theme.LIGHT_TEXT}
              />
              <Text style={[styles.reactionCount, { color: theme.LIGHT_TEXT }]}>
                {item.reactions.likes}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.reactionButton}
              onPress={() => handleReact('celebrate')}
            >
              <Text style={styles.celebrateEmoji}>
                {userReaction === 'celebrate' ? '🎉' : '🎊'}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.commentButton} onPress={onComment}>
            <MaterialIcons name="chat-bubble-outline" size={20} color={theme.LIGHT_TEXT} />
            <Text style={[styles.commentCount, { color: theme.LIGHT_TEXT }]}>
              {item.reactions.comments}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      {isOwner && (
        <CustomConfirmationModal
          visible={showDeleteModal}
          title="Delete Feed Item?"
          description="Are you sure you want to delete this feed item? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          loading={isDeleting}
        />
      )}
    </Animated.View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      ...theme.shadow && {
        shadowColor: theme.SHADOW,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      },
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    avatarImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    avatarText: {
      fontSize: 18,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    headerContent: {
      flex: 1,
    },
    userName: {
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 2,
    },
    time: {
      fontSize: 12,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    typeIcon: {
      fontSize: 24,
    },
    ownerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    actionButton: {
      padding: 4,
    },
    body: {
      marginBottom: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 4,
    },
    description: {
      fontSize: 14,
      lineHeight: 20,
    },
    amountContainer: {
      marginTop: 8,
      padding: 8,
      backgroundColor: theme.SECONDARY,
      borderRadius: 8,
      alignSelf: 'flex-start',
    },
    amount: {
      fontSize: 20,
      fontWeight: '700',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.BORDER_COLOR,
    },
    reactions: {
      flexDirection: 'row',
      gap: 16,
    },
    reactionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    reactionCount: {
      fontSize: 14,
    },
    celebrateEmoji: {
      fontSize: 20,
    },
    commentButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    commentCount: {
      fontSize: 14,
    },
  });

export default FeedItem;

