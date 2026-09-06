import { useQuery } from '@tanstack/react-query';
import { fetchAppConfig } from '../api/config';

export function useAppConfig() {
  const query = useQuery({
    queryKey: ['app-config'],
    queryFn: async () => {
      const data = await fetchAppConfig();
    
      return data;
    },
    staleTime: 0,      
    gcTime: 0,    
    refetchOnMount: 'always', // Component mount hote hi hamesha fresh fetch karega
    refetchOnWindowFocus: true, // App focus mein aane par bhi fetch karega
  });

  return query;
}