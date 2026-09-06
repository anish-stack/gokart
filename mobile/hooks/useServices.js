import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchServices, fetchServiceById } from '../api/services';
import { STORAGE_KEYS } from '../utils/storageKeys';

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      try {
        const data = await fetchServices();
        await AsyncStorage.setItem(STORAGE_KEYS.CACHED_SERVICES, JSON.stringify(data));
        return data;
      } catch (err) {
        const cached = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_SERVICES);
        if (cached) return JSON.parse(cached);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useServiceDetail(id) {
  return useQuery({
    queryKey: ['service', id],
    queryFn: () => fetchServiceById(id),
    enabled: !!id,
  });
}
