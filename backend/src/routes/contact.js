const express = require('express');
const { getContactByPincode, submitContact } = require('../controllers/contactController');
const { submitContactValidator, pincodeParamValidator } = require('../validators/contactValidators');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/by-pincode/:pincode', pincodeParamValidator, validate, getContactByPincode);
router.post('/submit', submitContactValidator, validate, submitContact);

module.exports = router;
