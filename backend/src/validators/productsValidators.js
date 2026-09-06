const { body } = require('express-validator');

const upsertProductValidator = [
  body('name.en').trim().notEmpty().withMessage('English name is required'),
  body('description.en').trim().notEmpty().withMessage('English description is required'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('externalUrl').optional({ checkFalsy: true }).isURL().withMessage('externalUrl must be a valid URL'),
  body('sortOrder').optional().isInt(),
  body('isActive').optional().isBoolean(),
];

module.exports = { upsertProductValidator };
