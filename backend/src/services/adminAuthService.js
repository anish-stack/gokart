const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const env = require('../config/env');

async function login(email, password) {
  const user = await AdminUser.findOne({ email: email.toLowerCase(), isActive: true });
  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    err.code = 'INVALID_CREDENTIALS';
    throw err;
  }

  const matches = await user.comparePassword(password);
  if (!matches) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    err.code = 'INVALID_CREDENTIALS';
    throw err;
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = jwt.sign({ sub: user._id.toString(), role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

  return { token, user: user.toSafeJSON() };
}

module.exports = { login };
