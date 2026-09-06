const asyncHandler = require('../../utils/asyncHandler');
const { success, failure } = require('../../utils/apiResponse');
const Article = require('../../models/Article');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

/**
 * Convert cover image path into absolute URL
 *
 * DB:
 * /uploads/article-123.jpg
 *
 * API:
 * https://api.yourdomain.com/uploads/article-123.jpg
 */
const makeAbsoluteImageUrl = (image) => {
  if (!image) return '';

  // Already absolute URL
  if (
    image.startsWith('http://') ||
    image.startsWith('https://')
  ) {
    return image;
  }

  // Uploaded image
  if (image.startsWith('/uploads/')) {
    return `${BASE_URL}${image}`;
  }

  return image;
};

/**
 * Format article before sending response
 */
const formatArticle = (article) => {
  const data = article.toObject();

  data.coverImage = makeAbsoluteImageUrl(data.coverImage);

  return data;
};

/**
 * Format multiple articles
 */
const formatArticles = (articles) => {
  return articles.map((article) => formatArticle(article));
};


/**
 * GET ALL ARTICLES - ADMIN
 */
const listAll = asyncHandler(async (req, res) => {
  const articles = await Article.find()
    .sort({
      sortOrder: 1,
      publishedAt: -1,
      createdAt: -1,
    });

  const formattedArticles = formatArticles(articles);

  return success(res, formattedArticles);
});


/**
 * GET SINGLE ARTICLE - ADMIN
 */
const getOne = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);

  if (!article) {
    return failure(
      res,
      'Article not found',
      404,
      'NOT_FOUND'
    );
  }

  return success(res, formatArticle(article));
});


/**
 * CREATE ARTICLE
 */
const create = asyncHandler(async (req, res) => {
  const articleData = { ...req.body };

  console.log('Raw request body:', req.body);

  /**
   * Parse translated fields
   *
   * Multipart form-data sends them as JSON strings
   */
  const translatedFields = [
    'title',
    'summary',
    'body',
  ];

  translatedFields.forEach((field) => {
    if (typeof articleData[field] === 'string') {
      try {
        articleData[field] = JSON.parse(
          articleData[field]
        );
      } catch (error) {
        console.error(
          `Invalid JSON for ${field}:`,
          error
        );

        throw new Error(
          `Invalid ${field} format`
        );
      }
    }
  });


  /**
   * Convert sortOrder to number
   */
  if (articleData.sortOrder !== undefined) {
    articleData.sortOrder = Number(
      articleData.sortOrder
    );
  }


  /**
   * Convert isPublished to boolean
   */
  if (articleData.isPublished !== undefined) {
    if (articleData.isPublished === 'true') {
      articleData.isPublished = true;
    } else if (
      articleData.isPublished === 'false'
    ) {
      articleData.isPublished = false;
    }
  }


  /**
   * Parse tags
   */
  if (typeof articleData.tags === 'string') {
    try {
      articleData.tags = JSON.parse(
        articleData.tags
      );
    } catch (error) {
      articleData.tags = articleData.tags
        .split(',')
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean);
    }
  }


  /**
   * Uploaded image
   *
   * Save relative path in DB
   */
  if (req.file) {
    articleData.coverImage =
      `/uploads/${req.file.filename}`;
  }


  console.log(
    'Parsed article data:',
    articleData
  );


  const article = await Article.create(
    articleData
  );


  /**
   * Return absolute image URL in API
   */
  return success(
    res,
    formatArticle(article),
    201
  );
});


/**
 * UPDATE ARTICLE
 */
const update = asyncHandler(async (req, res) => {
  const updateData = { ...req.body };

  console.log('Raw request body:', req.body);


  /**
   * Parse translated fields
   */
  const translatedFields = [
    'title',
    'summary',
    'body',
  ];

  translatedFields.forEach((field) => {
    if (typeof updateData[field] === 'string') {
      try {
        updateData[field] = JSON.parse(
          updateData[field]
        );
      } catch (error) {
        console.error(
          `Invalid JSON for ${field}:`,
          updateData[field]
        );

        throw new Error(
          `Invalid ${field} format`
        );
      }
    }
  });


  /**
   * Convert sortOrder to number
   */
  if (updateData.sortOrder !== undefined) {
    updateData.sortOrder = Number(
      updateData.sortOrder
    );
  }


  /**
   * Convert isPublished to boolean
   */
  if (updateData.isPublished !== undefined) {
    if (updateData.isPublished === 'true') {
      updateData.isPublished = true;
    } else if (
      updateData.isPublished === 'false'
    ) {
      updateData.isPublished = false;
    }
  }


  /**
   * Parse tags
   */
  if (typeof updateData.tags === 'string') {
    try {
      updateData.tags = JSON.parse(
        updateData.tags
      );
    } catch (error) {
      updateData.tags = updateData.tags
        .split(',')
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean);
    }
  }


  /**
   * New uploaded image
   *
   * Save relative path in DB
   */
  if (req.file) {
    updateData.coverImage =
      `/uploads/${req.file.filename}`;
  }


  console.log(
    'Parsed update data:',
    updateData
  );


  const article = await Article.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );


  if (!article) {
    return failure(
      res,
      'Article not found',
      404,
      'NOT_FOUND'
    );
  }


  /**
   * Return absolute image URL
   */
  return success(
    res,
    formatArticle(article)
  );
});


/**
 * DELETE ARTICLE
 */
const remove = asyncHandler(async (req, res) => {
  const article =
    await Article.findByIdAndDelete(
      req.params.id
    );

  if (!article) {
    return failure(
      res,
      'Article not found',
      404,
      'NOT_FOUND'
    );
  }

  return success(res, {
    deleted: true,
  });
});


module.exports = {
  listAll,
  getOne,
  create,
  update,
  remove,
};