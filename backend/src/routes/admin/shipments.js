const express = require('express');
const ctrl = require('../../controllers/admin/shipmentsAdminController');
const { requireAdminAuth } = require('../../middleware/adminAuth');

const router = express.Router();

router.use(requireAdminAuth);

router.get('/', ctrl.listShipments);
router.get('/:id', ctrl.getShipment);

module.exports = router;
