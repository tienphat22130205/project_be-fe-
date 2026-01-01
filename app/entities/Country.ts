import mongoose, { Document, Schema } from 'mongoose';
import slugify from 'slugify';

export interface ICountry extends Document {
    name: string;
    slug: string;
    image: string;
    description?: string;
    continent: string;
    isActive: boolean;
    tourCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const countrySchema = new Schema<ICountry>(
    {
        name: {
            type: String,
            required: [true, 'Tên quốc gia là bắt buộc'],
            unique: true,
            trim: true
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true
        },
        image: {
            type: String,
            required: [true, 'Ảnh quốc gia là bắt buộc']
        },
        description: {
            type: String,
            trim: true
        },
        continent: {
            type: String,
            required: [true, 'Châu lục là bắt buộc'],
            enum: ['Châu Á', 'Châu Âu', 'Châu Mỹ', 'Châu Phi', 'Châu Đại Dương']
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Indexes
countrySchema.index({ slug: 1 });
countrySchema.index({ name: 1 });
countrySchema.index({ continent: 1 });

// Virtual populate tours
countrySchema.virtual('tours', {
    ref: 'Tour',
    localField: '_id',
    foreignField: 'country'
});

// Virtual for tour count
countrySchema.virtual('tourCount', {
    ref: 'Tour',
    localField: '_id',
    foreignField: 'country',
    count: true
});

// Pre-save middleware để tạo slug
countrySchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, {
            lower: true,
            locale: 'vi',
            strict: true
        });
    }
    next();
});

export const Country = mongoose.model<ICountry>('Country', countrySchema);
