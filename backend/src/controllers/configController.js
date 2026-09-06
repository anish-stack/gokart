const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const configService = require('../services/configService');

const getConfig = asyncHandler(async (req, res) => {
  const config = await configService.getAppConfig();
  return success(res, config);
});

module.exports = { getConfig };
