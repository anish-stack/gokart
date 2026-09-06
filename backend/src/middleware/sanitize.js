const xss = require('xss');

/**
 * Recursively strips XSS payloads from string fields in req.body/query/params.
 * Complements express-mongo-sanitize (which strips Mongo operator injection).
 */
function deepSanitize(obj) {
  if (typeof obj === 'string') return xss(obj);
  if (Array.isArray(obj)) return obj.map(deepSanitize);
  if (obj && typeof obj === 'object') {
    const clean = {};
    Object.keys(obj).forEach((key) => {
      clean[key] = deepSanitize(obj[key]);
    });
    return clean;
  }
  return obj;
}

function sanitizeInput(req, res, next) {
  if (req.body) req.body = deepSanitize(req.body);
  if (req.query) req.query = deepSanitize(req.query);
  if (req.params) req.params = deepSanitize(req.params);
  next();
}

module.exports = sanitizeInput;
