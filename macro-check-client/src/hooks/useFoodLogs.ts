import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import apiClient from '@/lib/api';
import { Log, DailySummary } from '@/schemas/analytics';

// --- API Functions ---
const postManualLog = async (logData: any) => {
  // console.log(logData)
  const { data } = await apiClient.post('/logs/manual', logData);
  // console.log(data)
  return data;
};

const postAiLog = async (logData: any) => {
  const { data } = await apiClient.post('/logs/llm', logData);
  return data;
};

const deleteLogApi = async (log: Log) => {
  const { data } = await apiClient.delete(`/logs/${log.id}`);
  return data;
};

// --- Custom Hook ---
export const useFoodLogs = (options?: { optimistic?: boolean; onSuccessCallback?: () => void }) => {
  const queryClient = useQueryClient();
  // Default optimistic to false if not provided
  const { optimistic = false, onSuccessCallback } = options || {};

  const handleError = (error: any) => {
    const message = error.response?.data?.detail || "An error occurred. Please try again.";
    Alert.alert("Error", message);
  };

  const onMutationSuccess = (logDate: string) => {
    // This helper function will now be used by all create/update mutations
    queryClient.invalidateQueries({ queryKey: ['dailySummary', logDate] });
    queryClient.invalidateQueries({ queryKey: ['logHistory', logDate] });
    // queryClient.invalidateQueries({ queryKey: ['weeklySummary'] }); 
    if (onSuccessCallback) onSuccessCallback();
  };


  const logManuallyMutation = useMutation({
    mutationFn: postManualLog,
    onSuccess: (_data, variables) => onMutationSuccess(variables.date),
    onError: handleError,
  });

  const logWithAiMutation = useMutation({
    mutationFn: postAiLog,
    onSuccess: (_data, variables) => onMutationSuccess(variables.date),
    onError: handleError,
  });

  const deleteLogMutation = useMutation({
    mutationFn: deleteLogApi,
    // onMutate will only be defined if the 'optimistic' option is true
    onMutate: optimistic
      ? async (deletedLog) => {
          const queryKey = ['logHistory', deletedLog.date];
          await queryClient.cancelQueries({ queryKey });
          const previousLogs = queryClient.getQueryData<Log[]>(queryKey);
          if (previousLogs) {
            queryClient.setQueryData(
              queryKey,
              previousLogs.filter((log) => log.id !== deletedLog.id)
            );
          }
          return { previousLogs };
        }
      : undefined,
    onError: (err, variables, context: any) => {
      // Only roll back if we made an optimistic update
      if (optimistic && context?.previousLogs) {
        const queryKey = ['logHistory', variables.date];
        queryClient.setQueryData(queryKey, context.previousLogs);
      }
      handleError(err);
    },
    // onSettled runs after success or error, ensuring data is eventually consistent
    onSettled: (_data, _error, variables) => {
      const logDate = variables.date;
      onMutationSuccess(logDate);
    },
  });

  return {
    logManually: logManuallyMutation.mutate,
    isManualLoading: logManuallyMutation.isPending,
    logWithAi: logWithAiMutation.mutate,
    isAiLoading: logWithAiMutation.isPending,
    deleteLog: deleteLogMutation.mutate,
    isDeleting: deleteLogMutation.isPending,
    deletingLogId: deleteLogMutation.variables?.id,
  };
};