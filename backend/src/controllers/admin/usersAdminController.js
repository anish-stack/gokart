const asyncHandler = require('../../utils/asyncHandler');
const { success, failure } = require('../../utils/apiResponse');
const AdminUser = require('../../models/AdminUser');

const listUsers = asyncHandler(async (req, res) => {
  const users = await AdminUser.find().sort({ createdAt: -1 });
  return success(res, users.map((u) => u.toSafeJSON()));
});

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const passwordHash = await AdminUser.hashPassword(password);
  const user = await AdminUser.create({ name, email, passwordHash, role });
  return success(res, user.toSafeJSON(), 201);
});

const updateUser = asyncHandler(async (req, res) => {
  const { name, role, isActive, password } = req.body;
  const update = { name, role, isActive };
  if (password) update.passwordHash = await AdminUser.hashPassword(password);

  const user = await AdminUser.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
  if (!user) return failure(res, 'User not found', 404, 'NOT_FOUND');
  return success(res, user.toSafeJSON());
});

module.exports = { listUsers, createUser, updateUser };
