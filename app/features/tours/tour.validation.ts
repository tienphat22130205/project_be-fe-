import { body } from 'express-validator';

export const createTourValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('destination').trim().notEmpty().withMessage('Destination is required'),
  body('duration')
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive integer'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('maxGroupSize')
    .isInt({ min: 1 })
    .withMessage('Max group size must be a positive integer'),
  body('difficulty')
    .isIn(['easy', 'medium', 'difficult'])
    .withMessage('Difficulty must be easy, medium, or difficult'),
  body('category').trim().notEmpty().withMessage('Category is required'),
];

export const updateTourValidation = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('destination').optional().trim().notEmpty().withMessage('Destination cannot be empty'),
  body('duration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive integer'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('maxGroupSize')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Max group size must be a positive integer'),
  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'difficult'])
    .withMessage('Difficulty must be easy, medium, or difficult'),
];
