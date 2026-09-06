import client from './client';

export const getServices = () => client.get('/admin/services').then((r) => r.data.data);
export const createService = (payload) => client.post('/admin/services', payload).then((r) => r.data.data);
export const updateService = (id, payload) => client.put(`/admin/services/${id}`, payload).then((r) => r.data.data);
export const deleteService = (id) => client.delete(`/admin/services/${id}`).then((r) => r.data.data);
