import apiClient from './apiCLient';

export interface Comment {
  id: string;
  transactionId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  reactions: {
    likes: number;
    userLiked: boolean;
  };
  createdAt: Date | string;
  updatedAt?: Date | string;
}

class CommentService {
  // Get comments for transaction
  async getComments(transactionId: string): Promise<Comment[]> {
    try {
      const response = await apiClient.get(`/comments/transaction/${transactionId}`);
      if (response.data.success) {
        return response.data.data.comments.map((c: any) => ({
          ...c,
          createdAt: new Date(c.createdAt),
          updatedAt: c.updatedAt ? new Date(c.updatedAt) : undefined,
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  }

  // Add comment
  async addComment(transactionId: string, text: string): Promise<Comment | null> {
    try {
      const response = await apiClient.post('/comments', {
        transactionId,
        text,
      });
      if (response.data.success) {
        const comment = response.data.data.comment;
        return {
          ...comment,
          createdAt: new Date(comment.createdAt),
        };
      }
      return null;
    } catch (error) {
      console.error('Error adding comment:', error);
      return null;
    }
  }

  // Update comment
  async updateComment(commentId: string, text: string): Promise<boolean> {
    try {
      const response = await apiClient.put(`/comments/${commentId}`, { text });
      return response.data.success;
    } catch (error) {
      console.error('Error updating comment:', error);
      return false;
    }
  }

  // Delete comment
  async deleteComment(commentId: string): Promise<boolean> {
    try {
      const response = await apiClient.delete(`/comments/${commentId}`);
      return response.data.success;
    } catch (error) {
      console.error('Error deleting comment:', error);
      return false;
    }
  }

  // Like comment
  async likeComment(commentId: string): Promise<boolean> {
    try {
      const response = await apiClient.post(`/comments/${commentId}/like`);
      return response.data.success;
    } catch (error) {
      console.error('Error liking comment:', error);
      return false;
    }
  }
}

export const commentService = new CommentService();

