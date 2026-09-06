const express = require('express');
const ctrl = require('../../controllers/admin/usersAdminController');
const { requireAdminAuth, requireRole } = require('../../middleware/adminAuth');

const router = express.Router();

router.use(requireAdminAuth, requireRole('SUPER_ADMIN'));

router.get('/', ctrl.listUsers);
router.post('/', ctrl.createUser);
router.put('/:id', ctrl.updateUser);

module.exports = router;
