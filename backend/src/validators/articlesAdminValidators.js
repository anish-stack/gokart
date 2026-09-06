const { body } = require('express-validator');

const upsertArticleValidator = [
  body('title.en').trim().notEmpty().withMessage('English title is required'),
  body('body.en').trim().notEmpty().withMessage('English body is required'),
  body('coverImage').optional({ checkFalsy: true }).isURL().withMessage('coverImage must be a valid URL'),
  body('tags').optional().isArray().withMessage('tags must be an array of strings'),
  body('sortOrder').optional().isInt().withMessage('sortOrder must be an integer'),
  body('isPublished').optional().isBoolean(),
];

module.exports = { upsertArticleValidator };
