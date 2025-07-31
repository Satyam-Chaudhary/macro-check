import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { DailySummary } from '@/schemas/analytics';

const fetchDailySummary = async (targetDate: string): Promise<DailySummary> => {

  const { data } = await apiClient.get('/analytics/daily-summary', {
    params: { target_date: targetDate },
  });

  return data;
};

export const useDailySummary = (targetDate: string) => {
  return useQuery<DailySummary, Error>({
    // The queryKey uniquely identifies this query. When targetDate changes,
    // TanStack Query will automatically refetch the data.
    queryKey: ['dailySummary', targetDate],
    queryFn: () => fetchDailySummary(targetDate),
  });
};