import apiClient from './apiCLient';

export interface Referral {
  id: string;
  code: string;
  userId?: string; // Optional since backend doesn't always return it
  totalReferrals: number;
  activeReferrals: number;
  rewards: ReferralReward[];
  createdAt: Date | string;
}

export interface ReferralReward {
  id: string;
  type: 'badge' | 'feature_unlock' | 'premium_access';
  title: string;
  description: string;
  requiredReferrals?: number; // Optional - backend returns this
  unlocked: boolean;
  unlockedAt?: Date | string;
}

export interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  rewardsUnlocked: number;
  rank: number;
  nextReward?: ReferralReward;
}

class ReferralService {
  // Get user's referral code
  async getMyReferral(): Promise<Referral | null> {
    try {
      const response = await apiClient.get('/referrals/me');
      if (response.data.success) {
        const referral = response.data.data.referral;
        return {
          ...referral,
          createdAt: new Date(referral.createdAt),
          rewards: referral.rewards?.map((r: any) => ({
            ...r,
            unlockedAt: r.unlockedAt ? new Date(r.unlockedAt) : undefined,
          })) || [],
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching referral:', error);
      return null;
    }
  }

  // Get referral stats
  async getStats(): Promise<ReferralStats | null> {
    try {
      const response = await apiClient.get('/referrals/stats');
      if (response.data.success) {
        const stats = response.data.data;
        return {
          ...stats,
          nextReward: stats.nextReward ? {
            ...stats.nextReward,
            unlockedAt: stats.nextReward.unlockedAt ? new Date(stats.nextReward.unlockedAt) : undefined,
          } : undefined,
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching referral stats:', error);
      return null;
    }
  }

  // Use referral code
  async useReferralCode(code: string): Promise<boolean> {
    try {
      const response = await apiClient.post('/referrals/use', { code });
      return response.data.success;
    } catch (error) {
      console.error('Error using referral code:', error);
      return false;
    }
  }

  // Get referral leaderboard
  async getLeaderboard(limit: number = 50): Promise<Array<{
    userId: string;
    userName: string;
    totalReferrals: number;
    rank: number;
  }>> {
    try {
      const response = await apiClient.get(`/referrals/leaderboard?limit=${limit}`);
      if (response.data.success) {
        return response.data.data.leaderboard;
      }
      return [];
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
  }

  // Get referral friends (users who used my code)
  async getReferralFriends(): Promise<{
    referralFriends: Array<{
      id: string;
      name: string;
      email: string;
      avatar?: string;
      joinedAt: Date | string;
      stats: {
        transactions: number;
        referrals: number;
      };
    }>;
    totalFriends: number;
  } | null> {
    try {
      const response = await apiClient.get('/referrals/friends');
      if (response.data.success) {
        return {
          ...response.data.data,
          referralFriends: response.data.data.referralFriends.map((friend: any) => ({
            ...friend,
            joinedAt: friend.joinedAt ? new Date(friend.joinedAt) : new Date(),
          })),
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching referral friends:', error);
      return null;
    }
  }
}

export const referralService = new ReferralService();

