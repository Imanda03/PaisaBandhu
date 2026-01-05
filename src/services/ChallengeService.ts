import apiClient from './apiCLient';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'save_amount' | 'spend_less' | 'no_purchases' | 'category_limit';
  targetAmount?: number;
  targetCategory?: string;
  startDate: Date | string;
  endDate: Date | string;
  createdBy:
    | string
    | {
        _id?: string;
        id?: string;
        fullName?: string;
        email?: string;
        avatar?: string;
      };
  participants:
    | string[]
    | Array<{
        _id?: string;
        id?: string;
        fullName?: string;
        email?: string;
        avatar?: string;
      }>;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Date | string;
  userProgress?: {
    progress: number;
    currentAmount: number;
    rank: number | null;
  };
}

export interface ChallengeProgress {
  userId: string;
  userName: string;
  progress: number;
  currentAmount: number;
  rank: number;
  avatar?: string;
}

export interface ChallengeLeaderboard {
  challengeId: string;
  participants: ChallengeProgress[];
  topPerformer?: ChallengeProgress;
}

class ChallengeService {
  // Create a new challenge
  async createChallenge(data: {
    title: string;
    description: string;
    type: Challenge['type'];
    targetAmount?: number;
    targetCategory?: string;
    endDate: Date;
    friendIds?: string[];
  }): Promise<Challenge | null> {
    try {
      const response = await apiClient.post('/challenges', {
        ...data,
        endDate: data.endDate.toISOString(),
      });
      if (response.data.success) {
        const challenge = response.data.data.challenge;
        return {
          ...challenge,
          startDate: new Date(challenge.startDate),
          endDate: new Date(challenge.endDate),
          createdAt: new Date(challenge.createdAt),
        };
      }
      return null;
    } catch (error) {
      console.error('Error creating challenge:', error);
      return null;
    }
  }

  // Get all challenges
  async getChallenges(params?: {
    status?: string;
    type?: string;
    limit?: number;
    skip?: number;
  }): Promise<Challenge[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      if (params?.type) queryParams.append('type', params.type);
      if (params?.limit) queryParams.append('limit', String(params.limit));
      if (params?.skip) queryParams.append('skip', String(params.skip));

      const response = await apiClient.get(
        `/challenges?${queryParams.toString()}`,
      );
      if (response.data.success) {
        return response.data.data.challenges.map((c: any) => ({
          ...c,
          startDate: new Date(c.startDate),
          endDate: new Date(c.endDate),
          createdAt: new Date(c.createdAt),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching challenges:', error);
      return [];
    }
  }

  // Join a challenge
  async joinChallenge(challengeId: string): Promise<boolean> {
    try {
      const response = await apiClient.post(`/challenges/${challengeId}/join`);
      return response.data.success;
    } catch (error) {
      console.error('Error joining challenge:', error);
      return false;
    }
  }

  // Get challenge leaderboard
  async getLeaderboard(
    challengeId: string,
  ): Promise<ChallengeLeaderboard | null> {
    try {
      const response = await apiClient.get(
        `/challenges/${challengeId}/leaderboard`,
      );
      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return null;
    }
  }

  // Get user's progress in challenge
  async getMyProgress(challengeId: string): Promise<ChallengeProgress | null> {
    try {
      const response = await apiClient.get(
        `/challenges/${challengeId}/progress`,
      );
      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching progress:', error);
      return null;
    }
  }

  // Delete challenge
  async deleteChallenge(challengeId: string): Promise<boolean> {
    try {
      console.log('Deleting challenge:', challengeId);
      const response = await apiClient.delete(`/challenges/${challengeId}`);
      return response.data.success;
    } catch (error) {
      console.error('Error deleting challenge:', error);
      return false;
    }
  }
}

export const challengeService = new ChallengeService();
