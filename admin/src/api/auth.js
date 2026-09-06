import client from './client';

export async function login(email, password) {
  const { data } = await client.post('/admin/auth/login', { email, password });
  return data.data;
}

export async function fetchMe() {
  const { data } = await client.get('/admin/auth/me');
  return data.data;
}
