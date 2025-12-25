import { body } from 'express-validator';

export const initiatePaymentValidation = [
  body('bookingId')
    .notEmpty()
    .withMessage('Booking ID is required')
    .isMongoId()
    .withMessage('Valid booking ID is required'),
  body('method')
    .isIn(['atm', 'credit_card', 'bank_transfer', 'cash', 'momo'])
    .withMessage('Payment method must be one of: atm, credit_card, bank_transfer, cash, momo'),
  body('returnUrl')
    .optional()
    .isURL()
    .withMessage('Return URL must be a valid URL'),
  body('cancelUrl')
    .optional()
    .isURL()
    .withMessage('Cancel URL must be a valid URL'),
  body('bankCode')
    .optional()
    .isString()
    .withMessage('Bank code must be a string'),
];

export const confirmManualPaymentValidation = [
  body('transactionId')
    .optional()
    .isString()
    .withMessage('Transaction ID must be a string'),
  body('notes')
    .optional()
    .isString()
    .withMessage('Notes must be a string'),
];
