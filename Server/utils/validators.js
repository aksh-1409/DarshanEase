const { body, param, validationResult } = require('express-validator');

// Validation middleware to check results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

// User validation rules
const userValidation = {
  signup: [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate
  ],
  login: [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
  ],
  update: [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('phone').optional().trim(),
    body('address').optional().trim(),
    validate
  ]
};

// Temple validation rules
const templeValidation = {
  create: [
    body('templeName').trim().notEmpty().withMessage('Temple name is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('darshanStartTime').notEmpty().withMessage('Start time is required'),
    body('darshanEndTime').notEmpty().withMessage('End time is required'),
    validate
  ]
};

// Darshan validation rules
const darshanValidation = {
  create: [
    body('darshanName').trim().notEmpty().withMessage('Darshan name is required'),
    body('templeId').notEmpty().withMessage('Temple ID is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('startTime').notEmpty().withMessage('Start time is required'),
    body('endTime').notEmpty().withMessage('End time is required'),
    body('totalSeats').isInt({ min: 1 }).withMessage('Total seats must be at least 1'),
    body('normalPrice').isFloat({ min: 0 }).withMessage('Normal price must be a positive number'),
    validate
  ]
};

// Booking validation rules
const bookingValidation = {
  create: [
    body('darshanId').notEmpty().withMessage('Darshan ID is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    validate
  ]
};

// Feedback validation rules
const feedbackValidation = {
  create: [
    body('templeId').notEmpty().withMessage('Temple ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().trim(),
    validate
  ]
};

// Donation validation rules
const donationValidation = {
  create: [
    body('templeId').notEmpty().withMessage('Temple ID is required'),
    body('amount').isFloat({ min: 1 }).withMessage('Amount must be at least 1'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    validate
  ]
};

module.exports = {
  validate,
  userValidation,
  templeValidation,
  darshanValidation,
  bookingValidation,
  feedbackValidation,
  donationValidation
};
