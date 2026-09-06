const express = require('express');
const { listLanguages } = require('../controllers/languagesController');

const router = express.Router();

router.get('/', listLanguages);

module.exports = router;
