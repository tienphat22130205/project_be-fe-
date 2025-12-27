import { Router } from 'express';
import tourController from './tour.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';
import { createTourValidation, updateTourValidation } from './tour.validation';

const router = Router();

// Public routes
router.get('/', tourController.getTours);
router.get('/featured', tourController.getFeaturedTours);
router.get('/popular', tourController.getPopularTours);
router.get('/stats', tourController.getTourStats);
router.get('/promotional', tourController.getPromotionalTours);
router.get('/:id/related', tourController.getRelatedTours);
router.get('/:id', tourController.getTourById);

// Protected routes - Admin only
router.post('/', authenticate, authorize('admin'), validate(createTourValidation), tourController.createTour);
router.put('/:id', authenticate, authorize('admin'), validate(updateTourValidation), tourController.updateTour);
router.delete('/:id', authenticate, authorize('admin'), tourController.deleteTour);

export default router;
