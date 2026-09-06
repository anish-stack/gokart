import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/storageKeys';

const MAX_RECENT = 10;

export const useRecentShipments = create((set, get) => ({
  recent: [],

  async hydrate() {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.RECENT_AWBS);
    set({ recent: raw ? JSON.parse(raw) : [] });
  },

  async addRecent(awb) {
    const upper = awb.toUpperCase();
    const filtered = get().recent.filter((item) => item.awb !== upper);
    const next = [{ awb: upper, trackedAt: new Date().toISOString() }, ...filtered].slice(0, MAX_RECENT);
    set({ recent: next });
    await AsyncStorage.setItem(STORAGE_KEYS.RECENT_AWBS, JSON.stringify(next));
  },

  async clear() {
    set({ recent: [] });
    await AsyncStorage.removeItem(STORAGE_KEYS.RECENT_AWBS);
  },
}));
