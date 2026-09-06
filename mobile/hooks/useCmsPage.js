import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchCmsPage } from '../api/cms';
import { STORAGE_KEYS } from '../utils/storageKeys';
import { useAppStore } from '../store/useAppStore';

export function useCmsPage(slug) {
  const language = useAppStore((s) => s.language);
  const cacheKey = `${STORAGE_KEYS.CACHED_CMS_PREFIX}${slug}_${language}`;

  return useQuery({
    queryKey: ['cms', slug, language],
    queryFn: async () => {
      try {
        const data = await fetchCmsPage(slug, language);
        await AsyncStorage.setItem(cacheKey, JSON.stringify(data));
        return data;
      } catch (err) {
        const cached = await AsyncStorage.getItem(cacheKey);
        if (cached) return JSON.parse(cached);
        throw err;
      }
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}
