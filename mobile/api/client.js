import axios from 'axios';
import Constants from 'expo-constants';

/**
 * Base URL comes from EXPO_PUBLIC_API_BASE_URL so it can differ per
 * environment without ever hardcoding a URL in the bundle. Falls back to
 * a local dev default. No secrets live here - mobile is fully anonymous
 * and only ever talks to our own backend, never directly to the AWB provider.
 */
const baseURL ='https://admingokart.imagecloud.online/api' ||
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  Constants.expoConfig?.extra?.apiBaseUrl ||
  'http://localhost:4000/api';

const client = axios.create({
  baseURL,
  timeout: 15000,
});

export default client;
