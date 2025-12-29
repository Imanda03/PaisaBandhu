import apiClient from './apiCLient';

export interface FeedItem {
  id: string;
  type: 'achievement' | 'challenge' | 'milestone' | 'group_activity' | 'savings_goal';
  userId: string;
  userName: string;
  userAvatar?: string;
  title: string;
  description: string;
  data: {
    amount?: number;
    achievement?: string;
    challenge?: string;
    friends?: string[];
  };
  reactions: {
    likes: number;
    comments: number;
    userReaction?: 'like' | 'love' | 'celebrate';
  };
  createdAt: Date | string;
  isAnonymous: boolean;
  visibility?: 'private' | 'public';
}

export interface FeedComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  createdAt: Date | string;
}

class SocialFeedService {
  // Get feed items
  async getFeed(params?: {
    limit?: number;
    skip?: number;
    type?: string;
    feedType?: 'public' | 'private';
  }): Promise<FeedItem[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append('limit', String(params.limit));
      if (params?.skip) queryParams.append('skip', String(params.skip));
      if (params?.type) queryParams.append('type', params.type);
      if (params?.feedType) queryParams.append('feedType', params.feedType);

      const response = await apiClient.get(`/feed?${queryParams.toString()}`);
      if (response.data.success) {
        return response.data.data.items.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching feed:', error);
      return [];
    }
  }

  // React to feed item
  async reactToItem(itemId: string, reaction: 'like' | 'love' | 'celebrate'): Promise<boolean> {
    try {
      const response = await apiClient.post(`/feed/${itemId}/react`, { reaction });
      return response.data.success;
    } catch (error) {
      console.error('Error reacting to item:', error);
      return false;
    }
  }

  // Get comments for feed item
  async getComments(itemId: string): Promise<FeedComment[]> {
    try {
      const response = await apiClient.get(`/feed/${itemId}/comments`);
      if (response.data.success) {
        return response.data.data.comments.map((c: any) => ({
          ...c,
          createdAt: new Date(c.createdAt),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  }

  // Add comment
  async addComment(itemId: string, text: string): Promise<FeedComment | null> {
    try {
      const response = await apiClient.post(`/feed/${itemId}/comments`, { text });
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

  // Update feed item visibility
  async updateVisibility(itemId: string, visibility: 'private' | 'public'): Promise<boolean> {
    try {
      const response = await apiClient.patch(`/feed/${itemId}/visibility`, { visibility });
      return response.data.success;
    } catch (error) {
      console.error('Error updating visibility:', error);
      return false;
    }
  }

  // Delete feed item
  async deleteFeedItem(itemId: string): Promise<boolean> {
    try {
      const response = await apiClient.delete(`/feed/${itemId}`);
      return response.data.success;
    } catch (error) {
      console.error('Error deleting feed item:', error);
      return false;
    }
  }
}

export const socialFeedService = new SocialFeedService();

