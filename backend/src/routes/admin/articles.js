const express = require('express');
const ctrl = require('../../controllers/admin/articlesAdminController');
const { upsertArticleValidator } = require('../../validators/articlesAdminValidators');
const validate = require('../../middleware/validate');
const { requireAdminAuth, requireRole } = require('../../middleware/adminAuth');
const upload = require('../../middleware/upload');

const router = express.Router();

router.use(requireAdminAuth);

router.get('/', ctrl.listAll);
router.get('/:id', ctrl.getOne);
router.post('/', requireRole('SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER'), upload.single('image'), validate, ctrl.create);
router.put('/:id', requireRole('SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER'), upload.single('image'), validate, ctrl.update);
router.delete('/:id', requireRole('SUPER_ADMIN', 'ADMIN'), ctrl.remove);

module.exports = router;
