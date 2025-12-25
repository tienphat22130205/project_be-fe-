import { Schema, model, Document, Types } from 'mongoose';

export interface IAdditionalService extends Document {
  _id: Types.ObjectId;
  tour: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  unit: string; // đ/khách, đ/ngày, etc.
  isActive: boolean;
  maxQuantity?: number;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

const additionalServiceSchema = new Schema<IAdditionalService>(
  {
    tour: {
      type: Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Additional service must belong to a tour'],
    },
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Service description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Service price is required'],
      min: [0, 'Price must be positive'],
    },
    unit: {
      type: String,
      required: [true, 'Service unit is required'],
      default: 'đ/khách',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    maxQuantity: {
      type: Number,
      min: [1, 'Max quantity must be at least 1'],
    },
    category: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
additionalServiceSchema.index({ tour: 1, isActive: 1 });

export const AdditionalService = model<IAdditionalService>(
  'AdditionalService',
  additionalServiceSchema
);
