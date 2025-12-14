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
router.get('/:id', tourController.getTourById);

// Protected routes - Admin only
router.use(authenticate, authorize('admin'));
router.post('/', validate(createTourValidation), tourController.createTour);
router.put('/:id', validate(updateTourValidation), tourController.updateTour);
router.delete('/:id', tourController.deleteTour);

export default router;
