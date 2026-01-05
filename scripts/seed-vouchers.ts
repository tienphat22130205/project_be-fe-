import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Voucher } from '../app/entities/Voucher';
import { User } from '../app/entities/User';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-tour';

const seedVouchers = async () => {
    try {
        console.log('🔄 Đang kết nối MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Đã kết nối MongoDB\n');

        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 1);

        const pastDate = new Date();
        pastDate.setFullYear(pastDate.getFullYear() - 1);

        const vouchers = [
            {
                code: 'WELCOME100K',
                description: 'Chào mừng thành viên mới - Giảm 100k cho chuyến đi đầu tiên',
                discountType: 'fixed',
                discountValue: 100000,
                minOrderValue: 1000000,
                startDate: pastDate,
                endDate: futureDate,
                usageLimit: 10000,
                limitPerUser: 1,
                type: 'system',
                trigger: 'welcome',
            },
            {
                code: 'SUMMER2025',
                description: 'Khuyến mãi mùa hè 2025 - Giảm 8% cho tour nội địa',
                discountType: 'percentage',
                discountValue: 8,
                maxDiscountAmount: 800000,
                minOrderValue: 3000000,
                startDate: pastDate,
                endDate: futureDate,
                usageLimit: 1000,
                limitPerUser: 1,
                type: 'public',
                trigger: 'none',
            },
            {
                code: 'VIP500K',
                description: 'Voucher VIP - Giảm 500k cho tour quốc tế',
                discountType: 'fixed',
                discountValue: 500000,
                minOrderValue: 10000000,
                startDate: pastDate,
                endDate: futureDate,
                usageLimit: 100,
                limitPerUser: 1,
                type: 'private',
                trigger: 'none',
            },
            // Voucher cho mọi user
            {
                code: 'TRAVEL200K',
                description: 'Giảm 200k cho tour từ 5 triệu',
                discountType: 'fixed',
                discountValue: 200000,
                minOrderValue: 5000000,
                startDate: pastDate,
                endDate: futureDate,
                usageLimit: 5000,
                limitPerUser: 1,
                type: 'system',
                trigger: 'none',
            },
            {
                code: 'TOUR5OFF',
                description: 'Giảm 5% tối đa 300k cho mọi tour',
                discountType: 'percentage',
                discountValue: 5,
                maxDiscountAmount: 300000,
                minOrderValue: 2000000,
                startDate: pastDate,
                endDate: futureDate,
                usageLimit: 5000,
                limitPerUser: 1,
                type: 'system',
                trigger: 'none',
            },
            {
                code: 'DISCOVER150K',
                description: 'Khám phá Việt Nam - Giảm 150k cho tour trong nước',
                discountType: 'fixed',
                discountValue: 150000,
                minOrderValue: 3000000,
                startDate: pastDate,
                endDate: futureDate,
                usageLimit: 5000,
                limitPerUser: 1,
                type: 'system',
                trigger: 'none',
            },
        ];

        console.log('🎟️  Đang tạo Vouchers...');
        const createdVouchers = [];
        for (const v of vouchers) {
            const voucher = await Voucher.findOneAndUpdate(
                { code: v.code },
                { $set: v },
                { upsert: true, new: true }
            );
            createdVouchers.push(voucher);
            console.log(`   + Đã tạo/cập nhật: ${v.code}`);
        }

        // Gán các voucher system (không phải WELCOME100K) cho tất cả user
        console.log('\n🎁 Đang gán vouchers cho tất cả users...');
        const users = await User.find({});
        const systemVouchers = createdVouchers.filter(
            v => v.type === 'system' && v.code !== 'WELCOME100K'
        );

        for (const user of users) {
            for (const voucher of systemVouchers) {
                const alreadyHas = user.vouchers.some(
                    v => v.voucher.toString() === voucher._id.toString()
                );

                if (!alreadyHas) {
                    user.vouchers.push({
                        voucher: voucher._id,
                        assignedAt: new Date(),
                        isUsed: false,
                    });
                }
            }
            await user.save();
            console.log(`   + Đã gán ${systemVouchers.length} vouchers cho user: ${user.email}`);
        }

        console.log('\n✨ Voucher seeding completed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding vouchers:', error);
        process.exit(1);
    }
};

seedVouchers();
// npx ts-node scripts/seed-vouchers.ts
