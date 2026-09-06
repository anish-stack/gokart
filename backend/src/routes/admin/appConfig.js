const express = require('express');
const ctrl = require('../../controllers/admin/appConfigAdminController');
const { requireAdminAuth, requireRole } = require('../../middleware/adminAuth');

const router = express.Router();

router.use(requireAdminAuth);

router.get('/', ctrl.getConfig);
router.put('/', requireRole('SUPER_ADMIN', 'ADMIN'), ctrl.updateConfig);

module.exports = router;
