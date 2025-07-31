import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import apiClient from '@/lib/api';

const postManualLog = async (logData: any) => {
  const { data } = await apiClient.post('/logs/manual', logData);
  return data;
};

const postAiLog = async (logData: any) => {
  const { data } = await apiClient.post('/logs/llm', logData);
  return data;
};

export const useFoodLogs = (onSuccessCallback: () => void) => {
  const queryClient = useQueryClient();

  const commonMutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailySummary'] });
      onSuccessCallback();
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || "An error occurred. Please try again.";
      Alert.alert("Error", message);
    },
  };

  const logManuallyMutation = useMutation({
    mutationFn: postManualLog,
    ...commonMutationOptions,
  });

  const logWithAiMutation = useMutation({
    mutationFn: postAiLog,
    ...commonMutationOptions,
  });

  return {
    logManually: logManuallyMutation.mutate,
    isManualLoading: logManuallyMutation.isPending,
    logWithAi: logWithAiMutation.mutate,
    isAiLoading: logWithAiMutation.isPending,
  };
};