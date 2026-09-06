const express = require('express');
const ctrl = require('../../controllers/admin/contactAreaAdminController');
const { requireAdminAuth, requireRole } = require('../../middleware/adminAuth');

const router = express.Router();

router.use(requireAdminAuth);

router.get('/', ctrl.listAreas);
router.post('/', requireRole('SUPER_ADMIN', 'ADMIN'), ctrl.createArea);
router.put('/:id', requireRole('SUPER_ADMIN', 'ADMIN'), ctrl.updateArea);
router.delete('/:id', requireRole('SUPER_ADMIN', 'ADMIN'), ctrl.removeArea);

router.get('/submissions/all', ctrl.listSubmissions);
router.patch('/submissions/:id/status', requireRole('SUPER_ADMIN', 'ADMIN', 'SUPPORT'), ctrl.updateSubmissionStatus);

module.exports = router;
