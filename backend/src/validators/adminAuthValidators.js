const { body } = require('express-validator');

const loginValidator = [
  body('email').trim().isEmail().withMessage('Enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

module.exports = { loginValidator };
