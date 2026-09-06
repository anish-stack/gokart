const asyncHandler = require('../../utils/asyncHandler');
const { success, failure } = require('../../utils/apiResponse');
const Service = require('../../models/Service');
const { cacheDel } = require('../../config/redis');

const listAll = asyncHandler(async (req, res) => {
  const services = await Service.find().sort({ sortOrder: 1, createdAt: 1 });
  return success(res, services);
});

const create = asyncHandler(async (req, res) => {
  const service = await Service.create(req.body);
  return success(res, service, 201);
});

const update = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!service) return failure(res, 'Service not found', 404, 'NOT_FOUND');
  return success(res, service);
});

const remove = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) return failure(res, 'Service not found', 404, 'NOT_FOUND');
  return success(res, { deleted: true });
});

module.exports = { listAll, create, update, remove };
