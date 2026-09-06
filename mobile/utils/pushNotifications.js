import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { registerDevice } from '../api/notifications';
import { getOrCreateDeviceId } from './deviceId';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Requests permission and registers this anonymous device with the backend
 * for shipment status push notifications. Safe to call multiple times.
 */
export async function setupPushNotifications(language) {
  try {
    const deviceId = await getOrCreateDeviceId();

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return { deviceId, granted: false };
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    let pushToken = deviceId;
    try {
      const tokenResponse = await Notifications.getExpoPushTokenAsync();
      pushToken = tokenResponse.data;
    } catch (err) {
      // Push tokens require a real device + valid project config; fall back
      // to registering the device without a token so demo mode still works.
    }

    await registerDevice({ deviceToken: pushToken, platform: Platform.OS, language, deviceId });

    return { deviceId, granted: true };
  } catch (err) {
    return { deviceId: null, granted: false, error: err.message };
  }
}
