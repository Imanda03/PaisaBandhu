import { useQuery, useQueryClient } from "react-query";
import { AxiosError } from "axios";
import { ApiError } from "../utils/types";
import { achievementService, UserAchievements } from "../services/AchievementService";

export const useFetchAchievements = () => {
  return useQuery<UserAchievements | null, AxiosError<ApiError>>(
    ['Achievements'],
    () => achievementService.getAchievements(),
    {
      onError: (error) => {
        console.error('Failed to fetch achievements:', error);
      },
      staleTime: 30000, // Cache for 30 seconds
    }
  );
};

export const useInvalidateAchievements = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['Achievements'] });
  };
};

