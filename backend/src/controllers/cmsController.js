const asyncHandler = require('../utils/asyncHandler');
const { success, failure } = require('../utils/apiResponse');
const cmsService = require('../services/cmsService');

const getCmsPage = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const page = await cmsService.getCmsPage(slug);
  if (!page) return failure(res, 'Page not found or not enabled', 404, 'NOT_FOUND');
  return success(res, page);
});

module.exports = { getCmsPage };
