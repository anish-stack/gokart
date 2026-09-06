import client from './client';

export const getCmsPages = () => client.get('/admin/cms').then((r) => r.data.data);
export const upsertCmsPage = (slug, payload) => client.put(`/admin/cms/${slug}`, payload).then((r) => r.data.data);
export const toggleCmsPage = (slug, isEnabled) =>
  client.patch(`/admin/cms/${slug}/toggle`, { isEnabled }).then((r) => r.data.data);
