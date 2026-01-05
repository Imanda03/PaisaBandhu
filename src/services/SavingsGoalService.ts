import apiClient from './apiCLient';

export interface SavingsGoal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date | string;
  participants: string[];
  isGroup: boolean;
  createdBy: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Date | string;
  contributions: Array<{
    userId: string;
    userName: string;
    amount: number;
    date: Date | string;
  }>;
}

class SavingsGoalService {
  // Create savings goal
  async createGoal(data: {
    title: string;
    description: string;
    targetAmount: number;
    targetDate: Date;
    friendIds?: string[];
  }): Promise<SavingsGoal | null> {
    try {
      const response = await apiClient.post('/savings-goals', {
        ...data,
        targetDate: data.targetDate.toISOString(),
      });
      if (response.data.success) {
        const goal = response.data.data.goal;
        return {
          ...goal,
          targetDate: new Date(goal.targetDate),
          createdAt: new Date(goal.createdAt),
          contributions: goal.contributions?.map((c: any) => ({
            ...c,
            date: new Date(c.date),
          })) || [],
        };
      }
      return null;
    } catch (error) {
      console.error('Error creating savings goal:', error);
      return null;
    }
  }

  // Get all goals
  async getGoals(params?: {
    status?: string;
    isGroup?: boolean;
  }): Promise<SavingsGoal[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      if (params?.isGroup !== undefined) queryParams.append('isGroup', String(params.isGroup));

      const response = await apiClient.get(`/savings-goals?${queryParams.toString()}`);
      if (response.data.success) {
        return response.data.data.goals.map((g: any) => ({
          ...g,
          targetDate: new Date(g.targetDate),
          createdAt: new Date(g.createdAt),
          contributions: g.contributions?.map((c: any) => ({
            ...c,
            date: new Date(c.date),
          })) || [],
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching goals:', error);
      return [];
    }
  }

  // Contribute to goal
  async contribute(goalId: string, amount: number): Promise<boolean> {
    try {
      const response = await apiClient.post(`/savings-goals/${goalId}/contribute`, { amount });
      return response.data.success;
    } catch (error) {
      console.error('Error contributing to goal:', error);
      return false;
    }
  }

  // Join group goal
  async joinGoal(goalId: string): Promise<boolean> {
    try {
      const response = await apiClient.post(`/savings-goals/${goalId}/join`);
      return response.data.success;
    } catch (error) {
      console.error('Error joining goal:', error);
      return false;
    }
  }
}

export const savingsGoalService = new SavingsGoalService();

