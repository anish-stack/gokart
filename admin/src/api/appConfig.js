import client from './client';

export const getAppConfig = () => client.get('/admin/config').then((r) => r.data.data);
export const updateAppConfig = (payload) => client.put('/admin/config', payload).then((r) => r.data.data);
