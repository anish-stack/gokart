const asyncHandler = require('../../utils/asyncHandler');
const { success, failure } = require('../../utils/apiResponse');
const Product = require('../../models/Product');

const listAll = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ sortOrder: 1, createdAt: 1 });
  return success(res, products);
});

const create = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  return success(res, product, 201);
});

const update = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) return failure(res, 'Product not found', 404, 'NOT_FOUND');
  return success(res, product);
});

const remove = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return failure(res, 'Product not found', 404, 'NOT_FOUND');
  return success(res, { deleted: true });
});

module.exports = { listAll, create, update, remove };
