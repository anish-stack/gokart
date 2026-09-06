import client from './client';

export const getUsers = () => client.get('/admin/users').then((r) => r.data.data);
export const createUser = (payload) => client.post('/admin/users', payload).then((r) => r.data.data);
export const updateUser = (id, payload) => client.put(`/admin/users/${id}`, payload).then((r) => r.data.data);
