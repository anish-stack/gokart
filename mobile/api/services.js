import client from './client';

export async function fetchServices() {
  const { data } = await client.get('/services');
  return data.data;
}

export async function fetchServiceById(id) {
  const { data } = await client.get(`/services/${id}`);
  return data.data;
}
