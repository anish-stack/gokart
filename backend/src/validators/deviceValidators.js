const { body } = require('express-validator');
const { SUPPORTED_LANGUAGES } = require('../utils/constants');

const registerDeviceValidator = [
  body('deviceToken').trim().notEmpty().withMessage('deviceToken is required'),
  body('platform').isIn(['ios', 'android', 'web']).withMessage('platform must be ios, android or web'),
  body('language').optional().isIn(SUPPORTED_LANGUAGES).withMessage('Unsupported language'),
];

module.exports = { registerDeviceValidator };
