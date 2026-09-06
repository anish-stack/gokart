const express = require('express');
const { login, me } = require('../../controllers/admin/authController');
const { loginValidator } = require('../../validators/adminAuthValidators');
const validate = require('../../middleware/validate');
const { requireAdminAuth } = require('../../middleware/adminAuth');
const { authLimiter } = require('../../middleware/rateLimit');

const router = express.Router();

router.post('/login', authLimiter, loginValidator, validate, login);
router.get('/me', requireAdminAuth, me);

module.exports = router;
