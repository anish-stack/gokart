const asyncHandler = require('../utils/asyncHandler');
const { success, failure } = require('../utils/apiResponse');
const Product = require('../models/Product');

const listProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true }).sort({ sortOrder: 1, createdAt: 1 });
  return success(res, products);
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, isActive: true });
  if (!product) return failure(res, 'Product not found', 404, 'NOT_FOUND');
  return success(res, product);
});

module.exports = { listProducts, getProductById };
