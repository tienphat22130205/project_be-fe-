import { Schema, model, Document, Types } from 'mongoose';

export interface ITour extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  destination: string;
  duration: number; // in days
  price: number;
  maxGroupSize: number;
  difficulty: 'easy' | 'medium' | 'difficult';
  images: string[];
  startDates: Date[];
  startLocation: {
    type: string;
    coordinates: number[];
    address: string;
    description: string;
  };
  locations: Array<{
    type: string;
    coordinates: number[];
    address: string;
    description: string;
    day: number;
  }>;
  guides: Types.ObjectId[];
  rating: number;
  ratingsQuantity: number;
  isActive: boolean;
  featured: boolean;
  category: string;
  includes: string[];
  excludes: string[];
  createdAt: Date;
  updatedAt: Date;
}

const tourSchema = new Schema<ITour>(
  {
    title: {
      type: String,
      required: [true, 'Tour must have a title'],
      trim: true,
      maxlength: [100, 'Title must be less than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Tour must have a description'],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, 'Tour must have a destination'],
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'Tour must have a duration'],
      min: [1, 'Duration must be at least 1 day'],
    },
    price: {
      type: Number,
      required: [true, 'Tour must have a price'],
      min: [0, 'Price must be positive'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Tour must have a group size'],
      min: [1, 'Group size must be at least 1'],
    },
    difficulty: {
      type: String,
      required: [true, 'Tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be either: easy, medium, difficult',
      },
    },
    images: [
      {
        type: String,
      },
    ],
    startDates: [
      {
        type: Date,
      },
    ],
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: {
          type: [Number],
          default: [0, 0],
        },
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be at least 1.0'],
      max: [5, 'Rating must be at most 5.0'],
      set: (val: number) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      required: [true, 'Tour must have a category'],
      trim: true,
    },
    includes: [
      {
        type: String,
      },
    ],
    excludes: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
tourSchema.index({ price: 1, rating: -1 });
tourSchema.index({ destination: 1 });
tourSchema.index({ startLocation: '2dsphere' });

export const Tour = model<ITour>('Tour', tourSchema);
