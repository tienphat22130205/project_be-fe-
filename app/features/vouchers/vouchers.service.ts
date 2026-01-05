import { Voucher } from '../../entities/Voucher';
import { User } from '../../entities/User';
import { AppError } from '../../exceptions';

interface CreateVoucherDto {
    code: string;
    description: string;
    discountType: 'fixed' | 'percentage';
    discountValue: number;
    maxDiscountAmount?: number;
    minOrderValue: number;
    startDate: Date;
    endDate: Date;
    usageLimit: number;
    limitPerUser: number;
    type: 'public' | 'private' | 'system';
    trigger?: 'welcome' | 'loyalty' | 'none';
}

class VoucherService {
    async createVoucher(data: CreateVoucherDto) {
        const existingVoucher = await Voucher.findOne({ code: data.code });
        if (existingVoucher) {
            throw new AppError('Voucher code already exists', 400);
        }

        const voucher = await Voucher.create(data);
        return voucher;
    }

    async assignVoucher(userId: string, code: string) {
        const voucher = await Voucher.findOne({ code, isActive: true });
        if (!voucher) {
            throw new AppError('Voucher not found or inactive', 404);
        }

        if (voucher.type === 'public') {
            throw new AppError('Cannot manually assign public voucher', 400);
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        const alreadyHas = user.vouchers.some(
            (v) => v.voucher.toString() === voucher._id.toString()
        );

        if (alreadyHas) {
            // Allow multiple if configured? usually no for assignment
            throw new AppError('User already has this voucher', 400);
        }

        user.vouchers.push({
            voucher: voucher._id,
            assignedAt: new Date(),
            isUsed: false,
        });

        await user.save();
        return user;
    }

    async getMyVouchers(userId: string) {
        const user = await User.findById(userId).populate('vouchers.voucher');
        if (!user) {
            throw new AppError('User not found', 404);
        }
        return user.vouchers;
    }

    async validateVoucher(code: string, userId: string, orderTotal: number) {
        const voucher = await Voucher.findOne({ code, isActive: true });
        if (!voucher) {
            throw new AppError('Invalid voucher code', 400);
        }

        const now = new Date();
        if (now < voucher.startDate || now > voucher.endDate) {
            throw new AppError('Voucher is expired or not yet active', 400);
        }

        if (voucher.usageLimit > 0 && voucher.usedCount >= voucher.usageLimit) {
            throw new AppError('Voucher usage limit reached', 400);
        }

        if (orderTotal < voucher.minOrderValue) {
            throw new AppError(`Order total must be at least ${voucher.minOrderValue}`, 400);
        }

        // Check user specific conditions
        if (userId) {
            const user = await User.findById(userId);
            if (!user) {
                throw new AppError('User not found', 404);
            }

            // 1. Check if private voucher is owned (only for private, not system)
            if (voucher.type === 'private') {
                const userVoucher = user.vouchers.find(
                    (v) => v.voucher.toString() === voucher._id.toString()
                );

                if (!userVoucher) {
                    throw new AppError('You do not own this voucher', 403);
                }

                if (userVoucher.isUsed) {
                    throw new AppError('You have already used this voucher', 400);
                }
            }

            // 2. For system vouchers, check if user has it and not used (optional ownership)
            if (voucher.type === 'system') {
                const userVoucher = user.vouchers.find(
                    (v) => v.voucher.toString() === voucher._id.toString()
                );

                // If user has it in their collection, check if it's used
                if (userVoucher && userVoucher.isUsed) {
                    throw new AppError('You have already used this voucher', 400);
                }
                // If user doesn't have it, they can still use it (auto-assign logic)
            }

            // 3. Check limit per user (for public vouchers)
            // For public vouchers, we rely on usage tracking in bookings
        }

        // Calculate discount
        let discountAmount = 0;
        if (voucher.discountType === 'fixed') {
            discountAmount = voucher.discountValue;
        } else {
            discountAmount = (orderTotal * voucher.discountValue) / 100;
            if (voucher.maxDiscountAmount) {
                discountAmount = Math.min(discountAmount, voucher.maxDiscountAmount);
            }
        }

        return {
            isValid: true,
            discountAmount,
            voucher,
        };
    }

    async recordVoucherUsage(userId: string, code: string) {
        const voucher = await Voucher.findOne({ code });
        if (!voucher) return;

        voucher.usedCount += 1;
        await voucher.save();

        if (userId) {
            const user = await User.findById(userId);
            if (user) {
                const userVoucher = user.vouchers.find(
                    (v) => v.voucher.toString() === voucher._id.toString()
                );

                if (userVoucher) {
                    userVoucher.isUsed = true;
                    userVoucher.usedAt = new Date();
                    await user.save();
                }
            }
        }
    }
}

export default new VoucherService();
