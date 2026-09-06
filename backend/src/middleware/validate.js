const { validationResult } = require('express-validator');

/**
 * Runs after express-validator chains; short-circuits with a 400 on failure.
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      code: 'VALIDATION_ERROR',
      errors: errors.array(),
    });
  }
  return next();
}

module.exports = validate;
