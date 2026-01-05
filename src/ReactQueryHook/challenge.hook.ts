import { useMutation, useQuery, useQueryClient } from "react-query";
import { useToast } from "../context/ToastContext";
import { AxiosError } from "axios";
import { ApiError } from "../utils/types";
import { challengeService, Challenge } from "../services/ChallengeService";

export const useFetchChallenges = (params?: {
  status?: string;
  type?: string;
  limit?: number;
  skip?: number;
}) => {
  return useQuery<Challenge[], AxiosError<ApiError>>(
    ['Challenges', params],
    () => challengeService.getChallenges(params),
    {
      onError: (error) => {
        console.error('Failed to fetch challenges:', error);
      },
    }
  );
};

export const useCreateChallenge = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<Challenge | null, AxiosError<ApiError>, {
    title: string;
    description: string;
    type: Challenge['type'];
    targetAmount?: number;
    targetCategory?: string;
    endDate: Date;
    friendIds?: string[];
  }>(
    async (data) => challengeService.createChallenge(data),
    {
      onSuccess: async (response) => {
        if (response) {
          showToast("Challenge created successfully", "success");
          await queryClient.invalidateQueries({ queryKey: ['Challenges'] });
        } else {
          showToast("Failed to create challenge", "error");
        }
      },
      onError: (error: any) => {
        showToast(
          error.response?.data?.message || 'Failed to create challenge',
          'error',
        );
      },
    }
  );
};

export const useJoinChallenge = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<boolean, AxiosError<ApiError>, string>(
    async (challengeId) => challengeService.joinChallenge(challengeId),
    {
      onSuccess: async (response) => {
        if (response) {
          showToast("Joined challenge successfully", "success");
          await queryClient.invalidateQueries({ queryKey: ['Challenges'] });
        } else {
          showToast("Failed to join challenge", "error");
        }
      },
      onError: (error: any) => {
        showToast(
          error.response?.data?.message || 'Failed to join challenge',
          'error',
        );
      },
    }
  );
};

export const useFetchChallengeLeaderboard = (challengeId: string) => {
  return useQuery(
    ['ChallengeLeaderboard', challengeId],
    () => challengeService.getLeaderboard(challengeId),
    {
      enabled: !!challengeId,
      onError: (error) => {
        console.error('Failed to fetch challenge leaderboard:', error);
      },
    }
  );
};

export const useFetchMyChallengeProgress = (challengeId: string) => {
  return useQuery(
    ['ChallengeProgress', challengeId],
    () => challengeService.getMyProgress(challengeId),
    {
      enabled: !!challengeId,
      onError: (error) => {
        console.error('Failed to fetch challenge progress:', error);
      },
    }
  );
};

export const useDeleteChallenge = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<boolean, AxiosError<ApiError>, string>(
    async (challengeId) => challengeService.deleteChallenge(challengeId),
    {
      onSuccess: async () => {
        showToast("Challenge deleted successfully", "success");
        await queryClient.invalidateQueries({ queryKey: ['Challenges'] });
      },
      onError: (error: any) => {
        showToast(
          error.response?.data?.message || 'Failed to delete challenge',
          'error',
        );
      },
    }
  );
};

