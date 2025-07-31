import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import apiClient from '@/lib/api';
import { DailySummary } from '@/schemas/analytics';

// API Function to post the goal
const postGoal = async (goalData: any) => {
  const { data } = await apiClient.post('/goals/', goalData);
  return data;
};

// Custom Hook for setting goals
export const useGoals = (onSuccessCallback: () => void) => {
  const queryClient = useQueryClient();

  const { mutate: setGoal, isPending: isLoading } = useMutation({
    mutationFn: postGoal,
    // This onSuccess block is the key
    onSuccess: (newGoal, variables) => {
      const goalDate = variables.date;
      const queryKey = ['dailySummary', goalDate];

      // Manually update the 'dailySummary' cache
      queryClient.setQueryData<DailySummary | undefined>(queryKey, (oldData) => {
        // If there was no data before, we can't update it
        if (!oldData) {
            // We can choose to refetch or construct a new summary object.
            // For now, we'll just invalidate to trigger a full refetch in this edge case.
            queryClient.invalidateQueries({ queryKey });
            return undefined;
        }

        // If old data exists, update it with the new goal values
        return {
          ...oldData,
          goal_calories: newGoal.calories,
          goal_protein: newGoal.protein,
          goal_carbs: newGoal.carbs,
          goal_fat: newGoal.fat,
        };
      });

      onSuccessCallback();
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || "An error occurred. Please try again.";
      Alert.alert("Error", message);
    },
  });

  return { setGoal, isLoading };
};