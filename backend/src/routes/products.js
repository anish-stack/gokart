const express = require('express');
const { listProducts, getProductById } = require('../controllers/productsController');

const router = express.Router();

router.get('/', listProducts);
router.get('/:id', getProductById);

module.exports = router;
