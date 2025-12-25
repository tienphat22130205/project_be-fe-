import { Booking, IBooking } from '../../entities/Booking';
import { Tour } from '../../entities/Tour';
import { AdditionalService } from '../../entities/AdditionalService';
import { NotFoundError, BadRequestError } from '../../exceptions';

export interface BookingQuery {
  page?: number;
  limit?: number;
  status?: string;
  userId?: string;
}

export interface IPassengerInput {
  fullName: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: Date;
  email: string;
  phone: string;
}

export interface IAdditionalServiceInput {
  serviceId: string;
  quantity: number;
}

export interface CreateBookingData {
  tourId: string;
  startDate: Date;
  numberOfPeople: number;
  passengers: IPassengerInput[];
  additionalServices?: IAdditionalServiceInput[];
  discountCode?: string;
  paymentType: '100%' | '50%';
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
    address?: string;
    notes?: string;
  };
}

export class BookingService {
  /**
   * Tạo booking mới với tính năng thanh toán đầy đủ
   */
  async createBooking(
    userId: string,
    data: CreateBookingData
  ): Promise<IBooking> {
    // 1. Kiểm tra tour tồn tại và còn hoạt động
    const tour = await Tour.findById(data.tourId);
    if (!tour) {
      throw new NotFoundError('Tour not found');
    }

    if (!tour.isActive) {
      throw new BadRequestError('Tour is not available');
    }

    // 2. Kiểm tra ngày khởi hành hợp lệ (so sánh theo ngày, không cần match timestamp chính xác)
    const startDate = new Date(data.startDate);
    const startDateOnly = startDate.toISOString().split('T')[0]; // YYYY-MM-DD
    
    const validStartDate = tour.startDates.find((date) => {
      const tourDateOnly = new Date(date).toISOString().split('T')[0];
      return tourDateOnly === startDateOnly;
    });

    if (!validStartDate) {
      throw new BadRequestError('Invalid start date for this tour');
    }

    // 3. Kiểm tra số lượng người
    if (data.numberOfPeople > tour.maxGroupSize) {
      throw new BadRequestError(
        `Number of people exceeds maximum group size of ${tour.maxGroupSize}`
      );
    }

    if (data.passengers.length !== data.numberOfPeople) {
      throw new BadRequestError(
        'Number of passengers must match number of people'
      );
    }

    // 4. Tính giá cơ bản
    const basePrice = tour.price * data.numberOfPeople;
    let totalPrice = basePrice;
    let surcharge = 0;

    // 5. Xử lý dịch vụ cộng thêm
    const bookingAdditionalServices = [];
    if (data.additionalServices && data.additionalServices.length > 0) {
      for (const serviceInput of data.additionalServices) {
        const service = await AdditionalService.findOne({
          _id: serviceInput.serviceId,
          tour: data.tourId,
          isActive: true,
        });

        if (!service) {
          throw new NotFoundError(
            `Additional service ${serviceInput.serviceId} not found`
          );
        }

        if (service.maxQuantity && serviceInput.quantity > service.maxQuantity) {
          throw new BadRequestError(
            `Quantity exceeds maximum allowed for service ${service.name}`
          );
        }

        const subtotal = service.price * serviceInput.quantity;
        bookingAdditionalServices.push({
          service: service._id,
          quantity: serviceInput.quantity,
          price: service.price,
          subtotal,
        });

        totalPrice += subtotal;
      }
    }

    // 6. Áp dụng mã giảm giá (nếu có)
    let discountAmount = 0;
    if (data.discountCode) {
      // TODO: Implement discount code validation
      // Tạm thời để trống, có thể tích hợp với hệ thống mã giảm giá sau
      discountAmount = 0;
    }

    // 7. Tính tổng tiền cuối cùng
    totalPrice = totalPrice + surcharge - discountAmount;

    // 8. Tạo booking
    const booking = await Booking.create({
      tour: data.tourId,
      user: userId,
      startDate: data.startDate,
      numberOfPeople: data.numberOfPeople,
      basePrice,
      totalPrice,
      passengers: data.passengers,
      additionalServices: bookingAdditionalServices,
      discountCode: data.discountCode,
      discountAmount,
      surcharge,
      paymentType: data.paymentType,
      customerInfo: data.customerInfo,
      status: 'pending',
      paymentStatus: 'pending',
    });

    await booking.populate('tour user');

    return booking;
  }

  /**
   * Tính toán giá booking (dùng để preview trước khi tạo)
   */
  async calculateBookingPrice(data: {
    tourId: string;
    numberOfPeople: number;
    additionalServices?: IAdditionalServiceInput[];
    discountCode?: string;
  }): Promise<{
    basePrice: number;
    additionalServicesTotal: number;
    discountAmount: number;
    surcharge: number;
    totalPrice: number;
    breakdown: {
      tourPrice: number;
      pricePerPerson: number;
      services: Array<{
        name: string;
        price: number;
        quantity: number;
        subtotal: number;
      }>;
    };
  }> {
    const tour = await Tour.findById(data.tourId);
    if (!tour) {
      throw new NotFoundError('Tour not found');
    }

    const basePrice = tour.price * data.numberOfPeople;
    let additionalServicesTotal = 0;
    const servicesBreakdown = [];

    if (data.additionalServices && data.additionalServices.length > 0) {
      for (const serviceInput of data.additionalServices) {
        const service = await AdditionalService.findById(serviceInput.serviceId);
        if (service) {
          const subtotal = service.price * serviceInput.quantity;
          additionalServicesTotal += subtotal;
          servicesBreakdown.push({
            name: service.name,
            price: service.price,
            quantity: serviceInput.quantity,
            subtotal,
          });
        }
      }
    }

    let discountAmount = 0;
    if (data.discountCode) {
      // TODO: Implement discount validation
      discountAmount = 0;
    }

    const surcharge = 0; // TODO: Implement surcharge logic if needed
    const totalPrice = basePrice + additionalServicesTotal + surcharge - discountAmount;

    return {
      basePrice,
      additionalServicesTotal,
      discountAmount,
      surcharge,
      totalPrice,
      breakdown: {
        tourPrice: basePrice,
        pricePerPerson: tour.price,
        services: servicesBreakdown,
      },
    };
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
