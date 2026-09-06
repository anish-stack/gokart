import client from './client';

export const getArticles = () => client.get('/admin/articles').then((r) => r.data.data);
export const getArticle = (id) => client.get(`/admin/articles/${id}`).then((r) => r.data.data);
export const createArticle = (payload) => client.post('/admin/articles', payload).then((r) => r.data.data);
export const updateArticle = (id, payload) => client.put(`/admin/articles/${id}`, payload).then((r) => r.data.data);
export const deleteArticle = (id) => client.delete(`/admin/articles/${id}`).then((r) => r.data.data);