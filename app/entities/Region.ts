import { Schema, model, Document, Types } from 'mongoose';

export interface IRegion extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const regionSchema = new Schema<IRegion>(
  {
    name: {
      type: String,
      required: [true, 'Region must have a name'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Region must have a slug'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
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

// Virtual for provinces
regionSchema.virtual('provinces', {
  ref: 'Province',
  localField: '_id',
  foreignField: 'region',
});

// Indexes
regionSchema.index({ slug: 1 });
regionSchema.index({ order: 1 });

export const Region = model<IRegion>('Region', regionSchema);
