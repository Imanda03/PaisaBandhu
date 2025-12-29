import apiClient from './apiCLient';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'transaction' | 'savings' | 'social' | 'milestone';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date | string;
  progress?: number;
  target?: number;
  unlocked: boolean;
}

export interface UserAchievements {
  totalUnlocked: number;
  achievements: Achievement[];
  recentUnlocks: Achievement[];
  nextAchievements: Achievement[];
}

class AchievementService {
  // Get all achievements for user
  async getAchievements(): Promise<UserAchievements | null> {
    try {
      const response = await apiClient.get('/achievements');
      if (response.data.success) {
        const data = response.data.data;
        return {
          ...data,
          achievements: data.achievements.map((a: any) => ({
            ...a,
            unlockedAt: a.unlockedAt ? new Date(a.unlockedAt) : undefined,
          })),
          recentUnlocks: data.recentUnlocks?.map((a: any) => ({
            ...a,
            unlockedAt: a.unlockedAt ? new Date(a.unlockedAt) : undefined,
          })) || [],
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching achievements:', error);
      return null;
    }
  }

  // Get achievement by ID
  async getAchievement(id: string): Promise<Achievement | null> {
    try {
      const response = await apiClient.get(`/achievements/${id}`);
      if (response.data.success) {
        const achievement = response.data.data.achievement;
        return {
          ...achievement,
          unlockedAt: achievement.unlockedAt ? new Date(achievement.unlockedAt) : undefined,
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching achievement:', error);
      return null;
    }
  }

  // Share achievement
  async shareAchievement(achievementId: string): Promise<string | null> {
    try {
      const response = await apiClient.post(`/achievements/${achievementId}/share`);
      if (response.data.success) {
        return response.data.data.shareUrl;
      }
      return null;
    } catch (error) {
      console.error('Error sharing achievement:', error);
      return null;
    }
  }
}

export const achievementService = new AchievementService();

