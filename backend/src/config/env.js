require('dotenv').config();

function requireEnv(name, fallback) {
  const value = process.env[name];
  if (value === undefined || value === '') {
    return fallback;
  }
  return value;
}

const env = {
  NODE_ENV: requireEnv('NODE_ENV', 'development'),
  PORT: parseInt(requireEnv('PORT', '4000'), 10),

  DATABASE_URL: requireEnv('DATABASE_URL', 'mongodb://localhost:27017/go_track_express'),

  JWT_SECRET: requireEnv('JWT_SECRET', 'dev-only-secret-change-me'),
  JWT_EXPIRES_IN: requireEnv('JWT_EXPIRES_IN', '1d'),

  TRACKING_PROVIDER: requireEnv('TRACKING_PROVIDER', 'demo'),
  AWB_API_URL: requireEnv('AWB_API_URL', 'https://example.com/awb-provider'),
  AWB_API_KEY: requireEnv('AWB_API_KEY', ''),

  FIREBASE_PROJECT_ID: requireEnv('FIREBASE_PROJECT_ID', ''),
  FIREBASE_CLIENT_EMAIL: requireEnv('FIREBASE_CLIENT_EMAIL', ''),
  FIREBASE_PRIVATE_KEY: requireEnv('FIREBASE_PRIVATE_KEY', '').replace(/\\n/g, '\n'),

  CORS_ORIGINS: requireEnv('CORS_ORIGINS', 'http://localhost:5173,http://localhost:19006')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),

  REDIS_URL: requireEnv('REDIS_URL', 'redis://localhost:6379'),
};

module.exports = env;
