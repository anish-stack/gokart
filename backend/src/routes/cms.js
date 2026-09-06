const express = require('express');
const { getCmsPage } = require('../controllers/cmsController');
const { cmsSlugParamValidator } = require('../validators/cmsValidators');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/:slug', cmsSlugParamValidator, validate, getCmsPage);

module.exports = router;
