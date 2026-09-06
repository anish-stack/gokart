const express = require('express');
const { trackByAwb } = require('../controllers/trackingController');
const { trackAwbValidator } = require('../validators/trackingValidators');
const validate = require('../middleware/validate');
const { trackingLimiter } = require('../middleware/rateLimit');

const router = express.Router();

router.get('/:awb', trackingLimiter, trackAwbValidator, validate, trackByAwb);

module.exports = router;
