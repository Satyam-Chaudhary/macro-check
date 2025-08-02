import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { WeeklySummary } from '@/schemas/analytics';

const fetchWeeklySummary = async (): Promise<WeeklySummary> => {
  const { data } = await apiClient.get('/analytics/weekly-summary');
  return data;
};

export const useWeeklySummary = () => {
  return useQuery<WeeklySummary, Error>({
    queryKey: ['weeklySummary'],
    queryFn: fetchWeeklySummary,
    staleTime: 1000 * 60 * 10, // consider the data fresh till 5 min even after invalidating cache in backend to limit down llm calls
  });
};