const Redis = require('ioredis');
const env = require('./env');
const logger = require('../utils/logger');

let client = null;

function getRedisClient() {
  if (client) return client;

  client = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 2,
    retryStrategy(times) {
      if (times > 5) return null; // stop retrying, app should still work without cache
      return Math.min(times * 200, 2000);
    },
    lazyConnect: true,
  });

  client.on('error', (err) => {
    logger.warn(`Redis error (continuing without cache): ${err.message}`);
  });

  client.connect().catch((err) => {
    logger.warn(`Redis connect failed (continuing without cache): ${err.message}`);
  });

  return client;
}

/**
 * Safe cache get - never throws, returns null on any failure.
 */
async function cacheGet(key) {
  try {
    const redis = getRedisClient();
    if (redis.status !== 'ready') return null;
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    return null;
  }
}

/**
 * Safe cache set - never throws.
 */
async function cacheSet(key, value, ttlSeconds = 300) {
  try {
    const redis = getRedisClient();
    if (redis.status !== 'ready') return;
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  } catch (err) {
    // no-op, cache is best-effort
  }
}

async function cacheDel(key) {
  try {
    const redis = getRedisClient();
    if (redis.status !== 'ready') return;
    await redis.del(key);
  } catch (err) {
    // no-op
  }
}

module.exports = { getRedisClient, cacheGet, cacheSet, cacheDel };
