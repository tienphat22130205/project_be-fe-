import { Schema, model, Document, Types } from 'mongoose';

export interface IBooking extends Document {
  _id: Types.ObjectId;
  tour: Types.ObjectId;
  user: Types.ObjectId;
  startDate: Date;
  numberOfPeople: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod?: string;
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
    totalPrice: {
      type: Number,
      required: [true, 'Booking must have a price'],
      min: [0, 'Price must be positive'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
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
