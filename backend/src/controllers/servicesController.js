const asyncHandler = require('../utils/asyncHandler');
const { success, failure } = require('../utils/apiResponse');
const Service = require('../models/Service');

const listServices = asyncHandler(async (req, res) => {
  const services = await Service.find({ isActive: true }).sort({ sortOrder: 1, createdAt: 1 });
  return success(res, services);
});

const getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findOne({ _id: req.params.id, isActive: true });
  if (!service) return failure(res, 'Service not found', 404, 'NOT_FOUND');
  return success(res, service);
});

module.exports = { listServices, getServiceById };
