const express = require('express');
const ctrl = require('../../controllers/admin/servicesAdminController');
const { upsertServiceValidator } = require('../../validators/servicesValidators');
const validate = require('../../middleware/validate');
const { requireAdminAuth, requireRole } = require('../../middleware/adminAuth');

const router = express.Router();

router.use(requireAdminAuth);

router.get('/', ctrl.listAll);
router.post('/', requireRole('SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER'), upsertServiceValidator, validate, ctrl.create);
router.put('/:id', requireRole('SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER'), upsertServiceValidator, validate, ctrl.update);
router.delete('/:id', requireRole('SUPER_ADMIN', 'ADMIN'), ctrl.remove);

module.exports = router;
