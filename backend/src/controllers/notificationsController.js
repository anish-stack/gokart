const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const notificationService = require('../services/notificationService');

const registerDevice = asyncHandler(async (req, res) => {
  const { deviceToken, platform, language, deviceId } = req.body;
  const device = await notificationService.registerDevice({ deviceToken, platform, language, deviceId });
  return success(res, { deviceId: device.deviceId }, 201);
});

const unregisterDevice = asyncHandler(async (req, res) => {
  const { deviceId } = req.body;
  await notificationService.unregisterDevice(deviceId);
  return success(res, { unregistered: true });
});

module.exports = { registerDevice, unregisterDevice };
