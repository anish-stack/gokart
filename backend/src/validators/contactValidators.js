const { body, param } = require('express-validator');

const submitContactValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 120 }),
  body('phone').trim().notEmpty().withMessage('Phone is required').isLength({ max: 20 }),
  body('email').optional({ checkFalsy: true }).trim().isEmail().withMessage('Enter a valid email'),
  body('pincode').optional({ checkFalsy: true }).trim().isLength({ max: 10 }),
  body('city').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('state').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('country').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 2000 }),
];

const pincodeParamValidator = [
  param('pincode').trim().isLength({ min: 3, max: 10 }).withMessage('Invalid pincode'),
];

module.exports = { submitContactValidator, pincodeParamValidator };
