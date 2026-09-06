const asyncHandler = require('../../utils/asyncHandler');
const { success } = require('../../utils/apiResponse');
const NotificationLog = require('../../models/NotificationLog');

const listLogs = asyncHandler(async (req, res) => {
  const logs = await NotificationLog.find().sort({ createdAt: -1 }).limit(200).populate('device', 'deviceId platform');
  return success(res, logs);
});

module.exports = { listLogs };
