import { Schema, model, Document } from 'mongoose';

export interface IVoucher extends Document {
    code: string;
    description: string;
    discountType: 'fixed' | 'percentage';
    discountValue: number;
    maxDiscountAmount?: number; // Only for percentage
    minOrderValue: number;
    startDate: Date;
    endDate: Date;
    usageLimit: number; // Max total usage count
    usedCount: number; // Current usage count
    limitPerUser: number; // Max usage per user
    type: 'public' | 'private' | 'system';
    trigger?: 'welcome' | 'loyalty' | 'none'; // Auto-assign trigger
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const voucherSchema = new Schema<IVoucher>(
    {
        code: {
            type: String,
            required: [true, 'Voucher code is required'],
            unique: true,
            uppercase: true,
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        discountType: {
            type: String,
            enum: ['fixed', 'percentage'],
            required: [true, 'Discount type is required'],
        },
        discountValue: {
            type: Number,
            required: [true, 'Discount value is required'],
            min: [0, 'Discount value must be positive'],
        },
        maxDiscountAmount: {
            type: Number,
            min: [0, 'Max discount amount must be positive'],
        },
        minOrderValue: {
            type: Number,
            default: 0,
            min: [0, 'Min order value must be positive'],
        },
        startDate: {
            type: Date,
            required: [true, 'Start date is required'],
        },
        endDate: {
            type: Date,
            required: [true, 'End date is required'],
        },
        usageLimit: {
            type: Number,
            default: 1000, // Default high limit
        },
        usedCount: {
            type: Number,
            default: 0,
        },
        limitPerUser: {
            type: Number,
            default: 1,
        },
        type: {
            type: String,
            enum: ['public', 'private', 'system'],
            default: 'public',
        },
        trigger: {
            type: String,
            enum: ['welcome', 'loyalty', 'none'],
            default: 'none',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
voucherSchema.index({ code: 1 }, { unique: true });
voucherSchema.index({ startDate: 1, endDate: 1 });
voucherSchema.index({ trigger: 1 });

export const Voucher = model<IVoucher>('Voucher', voucherSchema);
