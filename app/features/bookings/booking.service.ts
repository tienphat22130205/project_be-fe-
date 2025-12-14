import { Booking, IBooking } from '../../entities/Booking';
import { Tour } from '../../entities/Tour';
import { NotFoundError, BadRequestError } from '../../exceptions';

export interface BookingQuery {
  page?: number;
  limit?: number;
  status?: string;
  userId?: string;
}

export class BookingService {
  async createBooking(
    userId: string,
    data: {
      tourId: string;
      startDate: Date;
      numberOfPeople: number;
      customerInfo: {
        fullName: string;
        email: string;
        phone: string;
        address?: string;
        notes?: string;
      };
    }
  ): Promise<IBooking> {
    // Check if tour exists
    const tour = await Tour.findById(data.tourId);
    if (!tour) {
      throw new NotFoundError('Tour not found');
    }

    if (!tour.isActive) {
      throw new BadRequestError('Tour is not available');
    }

    // Check if start date is valid
    const startDate = new Date(data.startDate);
    const validStartDate = tour.startDates.find(
      (date) => date.getTime() === startDate.getTime()
    );

    if (!validStartDate) {
      throw new BadRequestError('Invalid start date for this tour');
    }

    // Check if there are enough spots
    if (data.numberOfPeople > tour.maxGroupSize) {
      throw new BadRequestError(
        `Number of people exceeds maximum group size of ${tour.maxGroupSize}`
      );
    }

    // Calculate total price
    const totalPrice = tour.price * data.numberOfPeople;

    // Create booking
    const booking = await Booking.create({
      tour: data.tourId,
      user: userId,
      startDate: data.startDate,
      numberOfPeople: data.numberOfPeople,
      totalPrice,
      customerInfo: data.customerInfo,
    });

    await booking.populate('tour user');

    return booking;
  }

  async getBookings(query: BookingQuery): Promise<{
    bookings: IBooking[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10, status, userId } = query;

    // Build filter
    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (userId) {
      filter.user = userId;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .sort('-createdAt')
        .skip(skip)
        .limit(limit)
        .populate('tour', 'title destination duration price images')
        .populate('user', 'fullName email'),
      Booking.countDocuments(filter),
    ]);

    return {
      bookings,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getBookingById(bookingId: string, userId?: string): Promise<IBooking> {
    const filter: any = { _id: bookingId };
    if (userId) {
      filter.user = userId;
    }

    const booking = await Booking.findOne(filter)
      .populate('tour')
      .populate('user', 'fullName email');

    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    return booking;
  }

  async updateBookingStatus(
    bookingId: string,
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  ): Promise<IBooking> {
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true, runValidators: true }
    ).populate('tour user');

    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    return booking;
  }

  async cancelBooking(bookingId: string, userId: string): Promise<IBooking> {
    const booking = await Booking.findOne({ _id: bookingId, user: userId });

    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    if (booking.status === 'cancelled') {
      throw new BadRequestError('Booking is already cancelled');
    }

    if (booking.status === 'completed') {
      throw new BadRequestError('Cannot cancel a completed booking');
    }

    booking.status = 'cancelled';
    await booking.save();

    return booking;
  }

  async getUserBookings(userId: string): Promise<IBooking[]> {
    const bookings = await Booking.find({ user: userId })
      .sort('-createdAt')
      .populate('tour', 'title destination duration price images');

    return bookings;
  }
}

export default new BookingService();
