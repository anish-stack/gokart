const express = require('express');
const { registerDevice, unregisterDevice } = require('../controllers/notificationsController');
const { registerDeviceValidator } = require('../validators/deviceValidators');
const validate = require('../middleware/validate');

const router = express.Router();

router.post('/register-device', registerDeviceValidator, validate, registerDevice);
router.post('/unregister-device', unregisterDevice);

module.exports = router;
