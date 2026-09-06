const { param } = require('express-validator');

const trackAwbValidator = [
  param('awb')
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('AWB number must be between 6 and 20 characters')
    .matches(/^[A-Za-z0-9]+$/)
    .withMessage('AWB number must be alphanumeric'),
];

module.exports = { trackAwbValidator };
