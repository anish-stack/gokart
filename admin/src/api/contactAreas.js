import client from './client';

export const getContactAreas = () => client.get('/admin/contact-areas').then((r) => r.data.data);
export const createContactArea = (payload) => client.post('/admin/contact-areas', payload).then((r) => r.data.data);
export const updateContactArea = (id, payload) => client.put(`/admin/contact-areas/${id}`, payload).then((r) => r.data.data);
export const deleteContactArea = (id) => client.delete(`/admin/contact-areas/${id}`).then((r) => r.data.data);
export const getContactSubmissions = () => client.get('/admin/contact-areas/submissions/all').then((r) => r.data.data);
export const updateSubmissionStatus = (id, status) =>
  client.patch(`/admin/contact-areas/submissions/${id}/status`, { status }).then((r) => r.data.data);
