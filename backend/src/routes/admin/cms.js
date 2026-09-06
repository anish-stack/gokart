const express = require('express');
const ctrl = require('../../controllers/admin/cmsAdminController');
const { upsertCmsValidator } = require('../../validators/cmsValidators');
const validate = require('../../middleware/validate');
const { requireAdminAuth, requireRole } = require('../../middleware/adminAuth');

const router = express.Router();

router.use(requireAdminAuth);

router.get('/', ctrl.listAll);
router.put('/:slug', requireRole('SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER'), upsertCmsValidator, validate, ctrl.upsertBySlug);
router.patch('/:slug/toggle', requireRole('SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER'), ctrl.toggleEnabled);

module.exports = router;
