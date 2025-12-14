import { body } from 'express-validator';

export const createBookingValidation = [
  body('tourId').notEmpty().isMongoId().withMessage('Valid tour ID is required'),
  body('startDate').notEmpty().isISO8601().withMessage('Valid start date is required'),
  body('numberOfPeople')
    .isInt({ min: 1 })
    .withMessage('Number of people must be at least 1'),
  body('customerInfo.fullName').trim().notEmpty().withMessage('Customer full name is required'),
  body('customerInfo.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid customer email is required'),
  body('customerInfo.phone').trim().notEmpty().withMessage('Customer phone is required'),
];

export const updateBookingStatusValidation = [
  body('status')
    .isIn(['pending', 'confirmed', 'cancelled', 'completed'])
    .withMessage('Status must be pending, confirmed, cancelled, or completed'),
];
