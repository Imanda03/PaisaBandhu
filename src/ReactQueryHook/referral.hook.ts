import { useQuery, useMutation, useQueryClient } from "react-query";
import { useToast } from "../context/ToastContext";
import { AxiosError } from "axios";
import { ApiError } from "../utils/types";
import { referralService, Referral, ReferralStats } from "../services/ReferralService";

export interface ReferralFriend {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedAt: Date | string;
  stats: {
    transactions: number;
    referrals: number;
  };
}

export interface ReferralFriendsData {
  referralFriends: ReferralFriend[];
  totalFriends: number;
}

// Get my referral code
export const useFetchMyReferral = () => {
  return useQuery<Referral | null, AxiosError<ApiError>>(
    ['MyReferral'],
    () => referralService.getMyReferral(),
    {
      onError: (error) => {
        console.error('Failed to fetch referral:', error);
      },
    }
  );
};

// Get referral stats
export const useFetchReferralStats = () => {
  return useQuery<ReferralStats | null, AxiosError<ApiError>>(
    ['ReferralStats'],
    () => referralService.getStats(),
    {
      onError: (error) => {
        console.error('Failed to fetch referral stats:', error);
      },
    }
  );
};

// Get referral friends
export const useFetchReferralFriends = () => {
  return useQuery<ReferralFriendsData | null, AxiosError<ApiError>>(
    ['ReferralFriends'],
    () => referralService.getReferralFriends(),
    {
      onError: (error) => {
        console.error('Failed to fetch referral friends:', error);
      },
      staleTime: 30000, // Cache for 30 seconds
    }
  );
};

// Use referral code
export const useReferralCode = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<boolean, AxiosError<ApiError>, string>(
    async (code) => referralService.useReferralCode(code),
    {
      onSuccess: async () => {
        showToast("Referral code applied successfully!", "success");
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['MyReferral'] }),
          queryClient.invalidateQueries({ queryKey: ['ReferralStats'] }),
          queryClient.invalidateQueries({ queryKey: ['ReferralFriends'] }),
        ]);
      },
      onError: (error: any) => {
        showToast(
          error.response?.data?.message || 'Failed to use referral code',
          'error',
        );
      },
    }
  );
};

// Get referral leaderboard
export const useFetchReferralLeaderboard = (limit: number = 50) => {
  return useQuery<
    Array<{
      userId: string;
      userName: string;
      totalReferrals: number;
      rank: number;
    }>,
    AxiosError<ApiError>
  >(
    ['ReferralLeaderboard', limit],
    () => referralService.getLeaderboard(limit),
    {
      onError: (error) => {
        console.error('Failed to fetch leaderboard:', error);
      },
    }
  );
};

