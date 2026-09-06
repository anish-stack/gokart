import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './storageKeys';

function generateId() {
  return `dev_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Returns a persisted anonymous device id, generating one on first launch.
 * Mobile never authenticates - this id is only used to link push tokens
 * and recently-tracked AWBs for shipment status notifications.
 */
export async function getOrCreateDeviceId() {
  let id = await AsyncStorage.getItem(STORAGE_KEYS.DEVICE_ID);
  if (!id) {
    id = generateId();
    await AsyncStorage.setItem(STORAGE_KEYS.DEVICE_ID, id);
  }
  return id;
}
