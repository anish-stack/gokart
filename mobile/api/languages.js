import client from './client';

export async function fetchLanguages() {
  const { data } = await client.get('/languages');
  return data.data;
}
