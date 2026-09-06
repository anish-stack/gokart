const asyncHandler = require('../utils/asyncHandler');
const { success, failure } = require('../utils/apiResponse');
const Article = require('../models/Article');

// Helper function to format the cover image URL to absolute
const formatArticleImage = (req, article) => {
  if (article && article.coverImage && article.coverImage.startsWith('/')) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    // Convert Mongoose document to a plain object before modifying/attaching
    const articleObj = article.toObject ? article.toObject() : { ...article };
    articleObj.coverImage = `${baseUrl}${article.coverImage}`;
    return articleObj;
  }
  return article;
};

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

  // Prepend base URL to every article's coverImage if it's a relative path
  const formattedArticles = articles.map((article) => formatArticleImage(req, article));

  return success(res, formattedArticles, 200, { page, limit, total, totalPages: Math.ceil(total / limit) });
});

const getArticleById = asyncHandler(async (req, res) => {
  const article = await Article.findOne({ _id: req.params.id, isPublished: true });
  if (!article) return failure(res, 'Article not found', 404, 'NOT_FOUND');

  // Prepend base URL for the single article response
  const formattedArticle = formatArticleImage(req, article);

  return success(res, formattedArticle);
});

module.exports = { listArticles, getArticleById };