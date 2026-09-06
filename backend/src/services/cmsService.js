const CMSPage = require('../models/CMSPage');
const { cacheGet, cacheSet, cacheDel } = require('../config/redis');

async function getCmsPage(slug) {
  const cacheKey = `cms:${slug}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return cached;

  const page = await CMSPage.findOne({ slug, isEnabled: true });
  if (page) await cacheSet(cacheKey, page, 300);
  return page;
}

async function invalidateCmsCache(slug) {
  await cacheDel(`cms:${slug}`);
}

module.exports = { getCmsPage, invalidateCmsCache };
