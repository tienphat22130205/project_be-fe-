import { body } from 'express-validator';

export const createBookingValidation = [
  body('tourId').notEmpty().isMongoId().withMessage('Valid tour ID is required'),
  body('startDate').notEmpty().isISO8601().withMessage('Valid start date is required'),
  body('numberOfPeople')
    .isInt({ min: 1 })
    .withMessage('Number of people must be at least 1'),
  
  // Thông tin hành khách
  body('passengers')
    .isArray({ min: 1 })
    .withMessage('At least one passenger is required'),
  body('passengers.*.fullName')
    .trim()
    .notEmpty()
    .withMessage('Passenger full name is required'),
  body('passengers.*.gender')
    .isIn(['male', 'female', 'other'])
    .withMessage('Passenger gender must be male, female, or other'),
  body('passengers.*.dateOfBirth')
    .notEmpty()
    .isISO8601()
    .withMessage('Valid passenger date of birth is required'),
  body('passengers.*.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid passenger email is required'),
  body('passengers.*.phone')
    .trim()
    .notEmpty()
    .withMessage('Passenger phone is required'),

  // Dịch vụ cộng thêm (optional)
  body('additionalServices')
    .optional()
    .isArray()
    .withMessage('Additional services must be an array'),
  body('additionalServices.*.serviceId')
    .optional()
    .isMongoId()
    .withMessage('Valid service ID is required'),
  body('additionalServices.*.quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Service quantity must be at least 1'),

  // Mã giảm giá (optional)
  body('discountCode')
    .optional()
    .trim()
    .isString()
    .withMessage('Discount code must be a string'),

  // Loại thanh toán
  body('paymentType')
    .isIn(['100%', '50%'])
    .withMessage('Payment type must be 100% or 50%'),

  // Thông tin khách hàng
  body('customerInfo.fullName')
    .trim()
    .notEmpty()
    .withMessage('Customer full name is required'),
  body('customerInfo.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid customer email is required'),
  body('customerInfo.phone')
    .trim()
    .notEmpty()
    .withMessage('Customer phone is required'),
];

export const calculatePriceValidation = [
  body('tourId').notEmpty().isMongoId().withMessage('Valid tour ID is required'),
  body('numberOfPeople')
    .isInt({ min: 1 })
    .withMessage('Number of people must be at least 1'),
  body('additionalServices')
    .optional()
    .isArray()
    .withMessage('Additional services must be an array'),
  body('discountCode')
    .optional()
    .trim()
    .isString()
    .withMessage('Discount code must be a string'),
];

export const updateBookingStatusValidation = [
  body('status')
    .isIn(['pending', 'confirmed', 'cancelled', 'completed'])
    .withMessage('Status must be pending, confirmed, cancelled, or completed'),
];

