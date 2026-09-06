const asyncHandler = require('../../utils/asyncHandler');
const { success, failure } = require('../../utils/apiResponse');
const CMSPage = require('../../models/CMSPage');
const cmsService = require('../../services/cmsService');

const listAll = asyncHandler(async (req, res) => {
  const pages = await CMSPage.find().sort({ slug: 1 });
  return success(res, pages);
});

const upsertBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const page = await CMSPage.findOneAndUpdate(
    { slug },
    { ...req.body, slug },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );
  await cmsService.invalidateCmsCache(slug);
  return success(res, page);
});

const toggleEnabled = asyncHandler(async (req, res) => {
  const page = await CMSPage.findOne({ slug: req.params.slug });
  if (!page) return failure(res, 'Page not found', 404, 'NOT_FOUND');
  page.isEnabled = req.body.isEnabled;
  await page.save();
  await cmsService.invalidateCmsCache(req.params.slug);
  return success(res, page);
});

module.exports = { listAll, upsertBySlug, toggleEnabled };
