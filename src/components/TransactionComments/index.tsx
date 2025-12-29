import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '../../utils/Icons';
import { useTheme } from '../../utils/colors';
import { commentService, Comment } from '../../services/CommentService';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { formatTimeAgo } from '../../utils/helper';

interface TransactionCommentsProps {
  transactionId: string;
  onClose?: () => void;
}

const TransactionComments: React.FC<TransactionCommentsProps> = ({
  transactionId,
  onClose,
}) => {
  const { theme } = useTheme();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, [transactionId]);

  const loadComments = async () => {
    try {
      const data = await commentService.getComments(transactionId);
      setComments(data);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const comment = await commentService.addComment(transactionId, newComment.trim());
    if (comment) {
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  const handleLike = async (commentId: string) => {
    await commentService.likeComment(commentId);
    loadComments();
  };

  const renderComment = ({ item, index }: { item: Comment; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 30)}>
      <View style={[styles.commentItem, { backgroundColor: theme.BACKGROUND_LIGHT }]}>
        <View style={[styles.avatar, { backgroundColor: theme.PURPLE }]}>
          {item.userAvatar ? (
            <Text style={styles.avatarText}>{item.userName.charAt(0).toUpperCase()}</Text>
          ) : (
            <Text style={styles.avatarText}>{item.userName.charAt(0).toUpperCase()}</Text>
          )}
        </View>
        <View style={styles.commentContent}>
          <View style={styles.commentHeader}>
            <Text style={[styles.userName, { color: theme.TEXT }]}>{item.userName}</Text>
            <Text style={[styles.time, { color: theme.LIGHT_TEXT }]}>
              {formatTimeAgo(item.createdAt.toString())}
            </Text>
          </View>
          <Text style={[styles.commentText, { color: theme.TEXT }]}>{item.text}</Text>
          <TouchableOpacity
            style={styles.likeButton}
            onPress={() => handleLike(item.id)}
          >
            <MaterialIcons
              name={item.reactions.userLiked ? 'favorite' : 'favorite-border'}
              size={16}
              color={item.reactions.userLiked ? '#E57373' : theme.LIGHT_TEXT}
            />
            <Text style={[styles.likeCount, { color: theme.LIGHT_TEXT }]}>
              {item.reactions.likes}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  const styles = createStyles(theme);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.TEXT }]}>Comments</Text>
        {onClose && (
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={24} color={theme.TEXT} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="chat-bubble-outline" size={48} color={theme.PURPLE} />
            <Text style={[styles.emptyText, { color: theme.TEXT }]}>No comments yet</Text>
            <Text style={[styles.emptySubtext, { color: theme.LIGHT_TEXT }]}>
              Be the first to comment!
            </Text>
          </View>
        }
      />

      <View style={[styles.inputContainer, { backgroundColor: theme.BACKGROUND_LIGHT }]}>
        <TextInput
          style={[styles.input, { color: theme.TEXT, borderColor: theme.BORDER_COLOR }]}
          placeholder="Add a comment..."
          placeholderTextColor={theme.LIGHT_TEXT}
          value={newComment}
          onChangeText={setNewComment}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: theme.PURPLE }]}
          onPress={handleAddComment}
          disabled={!newComment.trim()}
        >
          <MaterialIcons
            name="send"
            size={20}
            color={theme.SECONDARY}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.BACKGROUND,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.BORDER_COLOR,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
    },
    listContent: {
      padding: 16,
    },
    commentItem: {
      flexDirection: 'row',
      padding: 12,
      borderRadius: 12,
      marginBottom: 12,
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    avatarText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    commentContent: {
      flex: 1,
    },
    commentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    userName: {
      fontSize: 14,
      fontWeight: '700',
    },
    time: {
      fontSize: 12,
    },
    commentText: {
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 8,
    },
    likeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    likeCount: {
      fontSize: 12,
    },
    emptyContainer: {
      alignItems: 'center',
      padding: 40,
    },
    emptyText: {
      fontSize: 16,
      fontWeight: '600',
      marginTop: 16,
    },
    emptySubtext: {
      fontSize: 14,
      marginTop: 4,
    },
    inputContainer: {
      flexDirection: 'row',
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: theme.BORDER_COLOR,
      gap: 12,
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 10,
      fontSize: 14,
      maxHeight: 100,
    },
    sendButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default TransactionComments;

