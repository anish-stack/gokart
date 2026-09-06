const AppConfig = require('../models/AppConfig');
const { cacheGet, cacheSet, cacheDel } = require('../config/redis');

const CACHE_KEY = 'app:config';

async function getAppConfig() {
  const cached = await cacheGet(CACHE_KEY);
  if (cached) return cached;

  let config = await AppConfig.findOne();
  if (!config) config = await AppConfig.create({});

  await cacheSet(CACHE_KEY, config, 120);
  return config;
}

async function updateAppConfig(updates) {
  let config = await AppConfig.findOne();
  if (!config) config = new AppConfig();
  Object.assign(config, updates);
  await config.save();
  await cacheDel(CACHE_KEY);
  return config;
}

module.exports = { getAppConfig, updateAppConfig };
