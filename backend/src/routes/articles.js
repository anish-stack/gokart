const express = require('express');
const { listArticles, getArticleById } = require('../controllers/articlesController');
const { listArticlesValidator, articleIdParamValidator } = require('../validators/articlesValidators');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/', listArticlesValidator, validate, listArticles);
router.get('/:id', articleIdParamValidator, validate, getArticleById);

module.exports = router;
