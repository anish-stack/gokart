import client from './client';

export async function fetchArticles(params = {}) {
  const { data } = await client.get('/articles', { params });
  return data.data;
}

export async function fetchArticleById(id) {
  const { data } = await client.get(`/articles/${id}`);
  return data.data;
}
