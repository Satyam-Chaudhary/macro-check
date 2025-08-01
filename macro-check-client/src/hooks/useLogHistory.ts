import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { Log } from '@/schemas/analytics';

const fetchLogHistory = async (targetDate: string): Promise<Log[]> => {
  const { data } = await apiClient.get('/logs/', {
    params: { target_date: targetDate },
  });
  return data;
};

export const useLogHistory = (targetDate: string) => {
  return useQuery<Log[], Error>({
    queryKey: ['logHistory', targetDate],
    queryFn: () => fetchLogHistory(targetDate),
  });
};