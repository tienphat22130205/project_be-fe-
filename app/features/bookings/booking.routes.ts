import { Router } from 'express';
import bookingController from './booking.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';
import {
  createBookingValidation,
  updateBookingStatusValidation,
} from './booking.validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// User routes
router.post('/', validate(createBookingValidation), bookingController.createBooking);
router.get('/my-bookings', bookingController.getUserBookings);
router.get('/:id', bookingController.getBookingById);
router.put('/:id/cancel', bookingController.cancelBooking);

// Admin routes
router.get('/', authorize('admin'), bookingController.getBookings);
router.put(
  '/:id/status',
  authorize('admin'),
  validate(updateBookingStatusValidation),
  bookingController.updateBookingStatus
);

export default router;
