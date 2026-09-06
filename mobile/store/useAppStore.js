import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/storageKeys';

/**
 * Global app state: language, config, notification prefs, device id.
 * Persisted fields are written to AsyncStorage on change so they survive restarts.
 */
export const useAppStore = create((set, get) => ({
  language: 'en',
  deviceId: null,
  config: null,
  notifPrefs: { shipment: true, marketing: true, service: true },
  isOffline: false,
  hydrated: false,

  async hydrate() {
    const [language, notifPrefsRaw, cachedConfig] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE),
      AsyncStorage.getItem(STORAGE_KEYS.NOTIF_PREFS),
      AsyncStorage.getItem(STORAGE_KEYS.CACHED_CONFIG),
    ]);

    set({
      language: language || 'en',
      notifPrefs: notifPrefsRaw ? JSON.parse(notifPrefsRaw) : get().notifPrefs,
      config: cachedConfig ? JSON.parse(cachedConfig) : null,
      hydrated: true,
    });
  },

  async setLanguage(lang) {
    await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    set({ language: lang });
  },

  setDeviceId(id) {
    set({ deviceId: id });
  },

  async setNotifPrefs(prefs) {
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIF_PREFS, JSON.stringify(prefs));
    set({ notifPrefs: prefs });
  },

  async setConfig(config) {
    await AsyncStorage.setItem(STORAGE_KEYS.CACHED_CONFIG, JSON.stringify(config));
    set({ config });
  },

  setOffline(isOffline) {
    set({ isOffline });
  },
}));
