const express = require('express');
const ctrl = require('../../controllers/admin/notificationLogsAdminController');
const { requireAdminAuth } = require('../../middleware/adminAuth');

const router = express.Router();

router.use(requireAdminAuth);

router.get('/', ctrl.listLogs);

module.exports = router;
