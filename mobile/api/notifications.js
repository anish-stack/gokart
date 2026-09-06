import client from './client';

export async function registerDevice({ deviceToken, platform, language, deviceId }) {
  const { data } = await client.post('/notifications/register-device', {
    deviceToken,
    platform,
    language,
    deviceId,
  });
  return data.data;
}

export async function unregisterDevice(deviceId) {
  const { data } = await client.post('/notifications/unregister-device', { deviceId });
  return data.data;
}
