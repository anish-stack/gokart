import client from './client';

export const getShipments = () => client.get('/admin/shipments').then((r) => r.data.data);
export const getShipmentDetail = (id) => client.get(`/admin/shipments/${id}`).then((r) => r.data.data);
