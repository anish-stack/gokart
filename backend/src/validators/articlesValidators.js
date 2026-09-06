const { query, param } = require('express-validator');

const listArticlesValidator = [
  query('tag').optional({ checkFalsy: true }).trim().isLength({ max: 60 }),
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('limit must be between 1 and 50'),
];

const articleIdParamValidator = [param('id').isMongoId().withMessage('Invalid article id')];

module.exports = { listArticlesValidator, articleIdParamValidator };
