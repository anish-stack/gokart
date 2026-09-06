import client from './client';

export const getNotificationLogs = () => client.get('/admin/notification-logs').then((r) => r.data.data);
