import client from './client';

export async function trackShipment(awb, deviceId) {
  const { data } = await client.get(`/tracking/${encodeURIComponent(awb)}`, {
    params: deviceId ? { deviceId } : {},
  });
  return data.data;
}
