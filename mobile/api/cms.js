import client from './client';

export async function fetchCmsPage(slug, language) {
  const { data } = await client.get(`/cms/${slug}`, { params: { language } });
  return data.data;
}
