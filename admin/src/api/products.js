import client from './client';

export const getProducts = () => client.get('/admin/products').then((r) => r.data.data);
export const createProduct = (payload) => client.post('/admin/products', payload).then((r) => r.data.data);
export const updateProduct = (id, payload) => client.put(`/admin/products/${id}`, payload).then((r) => r.data.data);
export const deleteProduct = (id) => client.delete(`/admin/products/${id}`).then((r) => r.data.data);
