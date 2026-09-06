import client from './client';

export async function fetchAppConfig() {
  const { data } = await client.get('/config');
  return data.data;
}
