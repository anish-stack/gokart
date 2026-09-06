const logger = require('../utils/logger');
const env = require('../config/env');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  logger.error(`${req.method} ${req.originalUrl} - ${err.message}`);

  if (err.code === 'AWB_NOT_FOUND') {
    return res.status(404).json({ success: false, message: err.message, code: 'AWB_NOT_FOUND' });
  }

  if (err.code === 'PROVIDER_ERROR') {
    return res.status(503).json({ success: false, message: err.message, code: 'PROVIDER_ERROR' });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: 'Invalid input data', code: 'VALIDATION_ERROR' });
  }

  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: 'Duplicate record', code: 'DUPLICATE' });
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Invalid or expired session', code: 'UNAUTHORIZED' });
  }

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 && env.NODE_ENV === 'production'
    ? 'Something went wrong. Please try again later.'
    : err.message || 'Internal server error';

  return res.status(statusCode).json({ success: false, message, code: err.code || 'INTERNAL_ERROR' });
}

module.exports = errorHandler;
