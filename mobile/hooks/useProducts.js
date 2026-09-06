import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchProducts, fetchProductById } from '../api/products';
import { STORAGE_KEYS } from '../utils/storageKeys';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const data = await fetchProducts();
        await AsyncStorage.setItem(STORAGE_KEYS.CACHED_PRODUCTS, JSON.stringify(data));
        return data;
      } catch (err) {
        const cached = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_PRODUCTS);
        if (cached) return JSON.parse(cached);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductDetail(id) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });
}
