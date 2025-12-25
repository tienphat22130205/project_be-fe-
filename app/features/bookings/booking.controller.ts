import { Response, NextFunction } from 'express';
import bookingService from './booking.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class BookingController {
  async createBooking(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const bookingData = req.body;

      const booking = await bookingService.createBooking(userId, bookingData);

      res.status(201).json({
        status: 'success',
        data: { booking },
      });
    } catch (error) {
      next(error);
    }
  }

  async calculatePrice(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const priceCalculation = await bookingService.calculateBookingPrice(req.body);

      res.status(200).json({
        status: 'success',
        data: priceCalculation,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBookings(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        status: req.query.status as string,
        userId: req.user!.role === 'admin' ? req.query.userId as string : req.user!._id.toString(),
      };

      const result = await bookingService.getBookings(query);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBookingById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.role === 'admin' ? undefined : req.user!._id.toString();
      const booking = await bookingService.getBookingById(req.params.id, userId);

      res.status(200).json({
        status: 'success',
        data: { booking },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateBookingStatus(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { status } = req.body;
      const booking = await bookingService.updateBookingStatus(req.params.id, status);

      res.status(200).json({
        status: 'success',
        data: { booking },
      });
    } catch (error) {
      next(error);
    }
  }

  async cancelBooking(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const booking = await bookingService.cancelBooking(req.params.id, userId);

      res.status(200).json({
        status: 'success',
        data: { booking },
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserBookings(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const bookings = await bookingService.getUserBookings(userId);

      res.status(200).json({
        status: 'success',
        data: { bookings },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new BookingController();
