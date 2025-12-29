import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '../../utils/Icons';
import { useTheme } from '../../utils/colors';
import BottomSheet from '../BottomSheet';
import { FeedComment } from '../../services/SocialFeedService';
import { useFetchFeedComments, useAddFeedComment } from '../../ReactQueryHook/feed.hook';
import { formatTimeAgo } from '../../utils/helper';

interface FeedCommentModalProps {
  isVisible: boolean;
  onClose: () => void;
  feedItemId: string;
}

const FeedCommentModal: React.FC<FeedCommentModalProps> = ({
  isVisible,
  onClose,
  feedItemId,
}) => {
  const { theme } = useTheme();
  const [commentText, setCommentText] = useState('');
  const { data: comments = [], refetch } = useFetchFeedComments(feedItemId);
  const { mutate: addComment, isLoading: isAdding } = useAddFeedComment();
  const styles = createStyles(theme);

  const handleAddComment = () => {
    if (commentText.trim()) {
      addComment(
        { itemId: feedItemId, text: commentText },
        {
          onSuccess: () => {
            setCommentText('');
            refetch();
          },
        }
      );
    }
  };

  const renderComment = ({ item }: { item: FeedComment }) => (
    <View style={styles.commentItem}>
      <View style={[styles.avatar, { backgroundColor: theme.PURPLE }]}>
        <Text style={styles.avatarText}>
          {item.userName.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={[styles.commentAuthor, { color: theme.TEXT }]}>
            {item.userName}
          </Text>
          <Text style={[styles.commentTime, { color: theme.LIGHT_TEXT }]}>
            {formatTimeAgo(item.createdAt.toString())}
          </Text>
        </View>
        <Text style={[styles.commentText, { color: theme.TEXT }]}>
          {item.text}
        </Text>
      </View>
    </View>
  );

  return (
    <BottomSheet isVisible={isVisible} onClose={onClose} title="Comments">
      <View style={styles.wrapper}>
        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item) => item.id}
          style={styles.commentsList}
          contentContainerStyle={styles.commentsContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="comment-outline" size={48} color={theme.LIGHT_TEXT} />
              <Text style={[styles.emptyText, { color: theme.LIGHT_TEXT }]}>
                No comments yet. Be the first to comment!
              </Text>
            </View>
          }
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <View style={[styles.inputContainer, { borderTopColor: theme.BORDER_COLOR }]}>
            <TextInput
              style={[styles.input, { color: theme.TEXT, backgroundColor: theme.INPUT_BACKGROUND }]}
              placeholder="Write a comment..."
              placeholderTextColor={theme.PLACEHOLDER_COLOR}
              value={commentText}
              onChangeText={setCommentText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                {
                  backgroundColor: commentText.trim() ? theme.PURPLE : theme.BORDER_COLOR,
                },
              ]}
              onPress={handleAddComment}
              disabled={!commentText.trim() || isAdding}
            >
              <MaterialIcons
                name="send"
                size={20}
                color={commentText.trim() ? '#FFFFFF' : theme.LIGHT_TEXT}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </BottomSheet>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    wrapper: {
      height: 500,
    },
    commentsList: {
      flex: 1,
      maxHeight: 400,
    },
    commentsContent: {
      padding: 16,
      paddingBottom: 8,
    },
    commentItem: {
      flexDirection: 'row',
      marginBottom: 16,
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
      fontSize: 14,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    commentContent: {
      flex: 1,
    },
    commentHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    commentAuthor: {
      fontSize: 14,
      fontWeight: '700',
      marginRight: 8,
    },
    commentTime: {
      fontSize: 12,
    },
    commentText: {
      fontSize: 14,
      lineHeight: 20,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
    },
    emptyText: {
      marginTop: 12,
      fontSize: 14,
      textAlign: 'center',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: 16,
      paddingVertical: 12,
      paddingBottom: 16,
      borderTopWidth: 1,
      gap: 8,
      backgroundColor: theme.BACKGROUND,
    },
    input: {
      flex: 1,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 14,
      minHeight: 44,
      maxHeight: 100,
      borderWidth: 1,
      borderColor: theme.BORDER_COLOR,
    },
    sendButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default FeedCommentModal;

