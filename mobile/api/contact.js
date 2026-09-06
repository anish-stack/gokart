import client from './client';

export async function fetchContactByPincode(pincode, extra = {}) {
  const { data } = await client.get(`/contact/by-pincode/${encodeURIComponent(pincode)}`, { params: extra });
  return data.data;
}

export async function submitContactForm(payload) {
  const { data } = await client.post('/contact/submit', payload);
  return data.data;
}
