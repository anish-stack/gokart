const jwt = require('jsonwebtoken');
const env = require('../config/env');
const AdminUser = require('../models/AdminUser');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Verifies the admin JWT and attaches req.adminUser. Mobile endpoints never use this.
 */
const requireAdminAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Missing admin token', code: 'UNAUTHORIZED' });
  }

  const payload = jwt.verify(token, env.JWT_SECRET);
  const adminUser = await AdminUser.findById(payload.sub);

  if (!adminUser || !adminUser.isActive) {
    return res.status(401).json({ success: false, message: 'Invalid session', code: 'UNAUTHORIZED' });
  }

  req.adminUser = adminUser;
  return next();
});

/**
 * Role gate - use after requireAdminAuth. Usage: requireRole('SUPER_ADMIN', 'ADMIN')
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.adminUser || !roles.includes(req.adminUser.role)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions', code: 'FORBIDDEN' });
    }
    return next();
  };
}

module.exports = { requireAdminAuth, requireRole };
