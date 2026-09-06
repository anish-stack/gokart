import client from './client';

export async function fetchProducts() {
  const { data } = await client.get('/products');
  return data.data;
}

export async function fetchProductById(id) {
  const { data } = await client.get(`/products/${id}`);
  return data.data;
}
