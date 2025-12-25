import { Schema, model, Document, Types } from 'mongoose';

export interface IPassenger {
  fullName: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: Date;
  email: string;
  phone: string;
}

export interface IBookingAdditionalService {
  service: Types.ObjectId;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface IBooking extends Document {
  _id: Types.ObjectId;
  tour: Types.ObjectId;
  user: Types.ObjectId;
  startDate: Date;
  numberOfPeople: number;
  basePrice: number; // Giá gốc của tour
  totalPrice: number; // Tổng tiền cuối cùng sau khi tính toán
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'partial' | 'refunded';
  paymentType: '100%' | '50%'; // Thanh toán 100% hoặc 50%
  paymentMethod?: 'atm' | 'credit_card' | 'bank_transfer' | 'cash' | 'momo';
  payment?: Types.ObjectId; // Reference to Payment
  
  // Thông tin hành khách
  passengers: IPassenger[];
  
  // Dịch vụ cộng thêm
  additionalServices: IBookingAdditionalService[];
  
  // Mã khuyến mãi và giảm giá
  discountCode?: string;
  discountAmount: number;
  
  // Phụ thu (nếu có)
  surcharge: number;
  
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
    address?: string;
    notes?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    tour: {
      type: Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Booking must belong to a tour'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a user'],
    },
    startDate: {
      type: Date,
      required: [true, 'Booking must have a start date'],
    },
    numberOfPeople: {
      type: Number,
      required: [true, 'Booking must specify number of people'],
      min: [1, 'Number of people must be at least 1'],
    },
    basePrice: {
      type: Number,
      required: [true, 'Booking must have a base price'],
      min: [0, 'Price must be positive'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Booking must have a total price'],
      min: [0, 'Price must be positive'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'partial', 'refunded'],
      default: 'pending',
    },
    paymentType: {
      type: String,
      enum: ['100%', '50%'],
      default: '100%',
    },
    paymentMethod: {
      type: String,
      enum: ['atm', 'credit_card', 'bank_transfer', 'cash', 'momo'],
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
    },
    passengers: [
      {
        fullName: {
          type: String,
          required: [true, 'Passenger full name is required'],
        },
        gender: {
          type: String,
          enum: ['male', 'female', 'other'],
          required: [true, 'Passenger gender is required'],
        },
        dateOfBirth: {
          type: Date,
          required: [true, 'Passenger date of birth is required'],
        },
        email: {
          type: String,
          required: [true, 'Passenger email is required'],
        },
        phone: {
          type: String,
          required: [true, 'Passenger phone is required'],
        },
      },
    ],
    additionalServices: [
      {
        service: {
          type: Schema.Types.ObjectId,
          ref: 'AdditionalService',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, 'Quantity must be at least 1'],
        },
        price: {
          type: Number,
          required: true,
          min: [0, 'Price must be positive'],
        },
        subtotal: {
          type: Number,
          required: true,
          min: [0, 'Subtotal must be positive'],
        },
      },
    ],
    discountCode: {
      type: String,
      trim: true,
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: [0, 'Discount must be positive'],
    },
    surcharge: {
      type: Number,
      default: 0,
      min: [0, 'Surcharge must be positive'],
    },
    customerInfo: {
      fullName: {
        type: String,
        required: [true, 'Customer full name is required'],
      },
      email: {
        type: String,
        required: [true, 'Customer email is required'],
      },
      phone: {
        type: String,
        required: [true, 'Customer phone is required'],
      },
      address: String,
      notes: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ tour: 1, startDate: 1 });

export const Booking = model<IBooking>('Booking', bookingSchema);
