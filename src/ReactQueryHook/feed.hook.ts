import { useMutation, useQuery, useQueryClient } from "react-query";
import { useToast } from "../context/ToastContext";
import { AxiosError } from "axios";
import { ApiError } from "../utils/types";
import { socialFeedService, FeedItem, FeedComment } from "../services/SocialFeedService";

export const useFetchFeed = (params?: {
  limit?: number;
  skip?: number;
  type?: string;
  feedType?: 'public' | 'private';
}) => {
  return useQuery<FeedItem[], AxiosError<ApiError>>(
    ['Feed', params],
    () => socialFeedService.getFeed(params),
    {
      onError: (error) => {
        console.error('Failed to fetch feed:', error);
      },
    }
  );
};

export const useReactToFeedItem = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<boolean, AxiosError<ApiError>, {
    itemId: string;
    reaction: 'like' | 'love' | 'celebrate';
  }>(
    async ({ itemId, reaction }) => socialFeedService.reactToItem(itemId, reaction),
    {
      onSuccess: async (response) => {
        if (response) {
          await queryClient.invalidateQueries({ queryKey: ['Feed'] });
        } else {
          showToast("Failed to react to item", "error");
        }
      },
      onError: (error: any) => {
        showToast(
          error.response?.data?.message || 'Failed to react to item',
          'error',
        );
      },
    }
  );
};

export const useFetchFeedComments = (itemId: string) => {
  return useQuery<FeedComment[], AxiosError<ApiError>>(
    ['FeedComments', itemId],
    () => socialFeedService.getComments(itemId),
    {
      enabled: !!itemId,
      onError: (error) => {
        console.error('Failed to fetch feed comments:', error);
      },
    }
  );
};

export const useAddFeedComment = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<FeedComment | null, AxiosError<ApiError>, {
    itemId: string;
    text: string;
  }>(
    async ({ itemId, text }) => socialFeedService.addComment(itemId, text),
    {
      onSuccess: async (response) => {
        if (response) {
          showToast("Comment added successfully", "success");
          await queryClient.invalidateQueries({ queryKey: ['FeedComments'] });
          await queryClient.invalidateQueries({ queryKey: ['Feed'] });
        } else {
          showToast("Failed to add comment", "error");
        }
      },
      onError: (error: any) => {
        showToast(
          error.response?.data?.message || 'Failed to add comment',
          'error',
        );
      },
    }
  );
};

export const useUpdateFeedItemVisibility = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<boolean, AxiosError<ApiError>, {
    itemId: string;
    visibility: 'private' | 'public';
  }>(
    async ({ itemId, visibility }) => socialFeedService.updateVisibility(itemId, visibility),
    {
      onSuccess: async (response) => {
        if (response) {
          showToast("Visibility updated successfully", "success");
          await queryClient.invalidateQueries({ queryKey: ['Feed'] });
        } else {
          showToast("Failed to update visibility", "error");
        }
      },
      onError: (error: any) => {
        showToast(
          error.response?.data?.message || 'Failed to update visibility',
          'error',
        );
      },
    }
  );
};

export const useDeleteFeedItem = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<boolean, AxiosError<ApiError>, string>(
    async (itemId) => socialFeedService.deleteFeedItem(itemId),
    {
      onSuccess: async (response) => {
        if (response) {
          showToast("Feed item deleted successfully", "success");
          await queryClient.invalidateQueries({ queryKey: ['Feed'] });
        } else {
          showToast("Failed to delete feed item", "error");
        }
      },
      onError: (error: any) => {
        showToast(
          error.response?.data?.message || 'Failed to delete feed item',
          'error',
        );
      },
    }
  );
};

