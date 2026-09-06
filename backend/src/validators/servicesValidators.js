const { body } = require('express-validator');

const upsertServiceValidator = [
  body('title.en').trim().notEmpty().withMessage('English title is required'),
  body('description.en').trim().notEmpty().withMessage('English description is required'),
  body('externalUrl').optional({ checkFalsy: true }).isURL().withMessage('externalUrl must be a valid URL'),
  body('sortOrder').optional().isInt().withMessage('sortOrder must be an integer'),
  body('isActive').optional().isBoolean(),
];

module.exports = { upsertServiceValidator };
