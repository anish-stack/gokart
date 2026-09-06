const { param, body } = require('express-validator');
const { CMS_SLUGS } = require('../utils/constants');

const cmsSlugParamValidator = [
  param('slug').isIn(CMS_SLUGS).withMessage(`slug must be one of ${CMS_SLUGS.join(', ')}`),
];

const upsertCmsValidator = [
  body('title.en').trim().notEmpty().withMessage('English title is required'),
  body('body.en').trim().notEmpty().withMessage('English body is required'),
];

module.exports = { cmsSlugParamValidator, upsertCmsValidator };
