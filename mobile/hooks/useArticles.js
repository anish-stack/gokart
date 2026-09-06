import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchArticles, fetchArticleById } from '../api/articles';

const CACHE_KEY = 'go_track_cached_articles';

export function useArticles() {
  return useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      try {
        const data = await fetchArticles();
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
        return data;
      } catch (err) {
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached) return JSON.parse(cached);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useArticleDetail(id) {
  return useQuery({
    queryKey: ['article', id],
    queryFn: () => fetchArticleById(id),
    enabled: !!id,
  });
}

