const asyncHandler = require('../utils/asyncHandler');
const { success, failure } = require('../utils/apiResponse');
const Article = require('../models/Article');

const listArticles = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const filter = { isPublished: true };
  if (req.query.tag) filter.tags = req.query.tag.toLowerCase();

  const [articles, total] = await Promise.all([
    Article.find(filter)
      .sort({ sortOrder: 1, publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Article.countDocuments(filter),
  ]);

  return success(res, articles, 200, { page, limit, total, totalPages: Math.ceil(total / limit) });
});

const getArticleById = asyncHandler(async (req, res) => {
  const article = await Article.findOne({ _id: req.params.id, isPublished: true });
  if (!article) return failure(res, 'Article not found', 404, 'NOT_FOUND');
  return success(res, article);
});

module.exports = { listArticles, getArticleById };
