import { Schema, model, Document, Types } from 'mongoose';

export interface IProvince extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  region: Types.ObjectId;
  description?: string;
  image?: string;
  thumbnailImage?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const provinceSchema = new Schema<IProvince>(
  {
    name: {
      type: String,
      required: [true, 'Province must have a name'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Province must have a slug'],
      trim: true,
      lowercase: true,
    },
    region: {
      type: Schema.Types.ObjectId,
      ref: 'Region',
      required: [true, 'Province must belong to a region'],
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    thumbnailImage: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
provinceSchema.index({ slug: 1 });
provinceSchema.index({ region: 1 });
provinceSchema.index({ order: 1 });

export const Province = model<IProvince>('Province', provinceSchema);
