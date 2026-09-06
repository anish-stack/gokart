const asyncHandler = require('../../utils/asyncHandler');
const { success } = require('../../utils/apiResponse');
const adminAuthService = require('../../services/adminAuthService');

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { token, user } = await adminAuthService.login(email, password);
  return success(res, { token, user });
});

const me = asyncHandler(async (req, res) => {
  return success(res, req.adminUser.toSafeJSON());
});

module.exports = { login, me };
