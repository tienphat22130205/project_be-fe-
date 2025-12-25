import { Schema, model, Document, Types } from 'mongoose';

export interface IPayment extends Document {
  _id: Types.ObjectId;
  booking: Types.ObjectId;
  amount: number;
  method: 'atm' | 'credit_card' | 'bank_transfer' | 'cash' | 'momo';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  gatewayResponse?: any;
  paymentDate?: Date;
  expiresAt?: Date;
  metadata?: {
    bankCode?: string;
    cardType?: string;
    gatewayTransactionId?: string;
    description?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: [true, 'Payment must belong to a booking'],
    },
    amount: {
      type: Number,
      required: [true, 'Payment must have an amount'],
      min: [0, 'Amount must be positive'],
    },
    method: {
      type: String,
      enum: ['atm', 'credit_card', 'bank_transfer', 'cash', 'momo'],
      required: [true, 'Payment method is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    gatewayResponse: {
      type: Schema.Types.Mixed,
    },
    paymentDate: {
      type: Date,
    },
    expiresAt: {
      type: Date,
    },
    metadata: {
      bankCode: String,
      cardType: String,
      gatewayTransactionId: String,
      description: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
paymentSchema.index({ booking: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ status: 1, createdAt: -1 });

export const Payment = model<IPayment>('Payment', paymentSchema);
