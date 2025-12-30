import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Voucher } from '../app/entities/Voucher';

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
                code: 'WELCOME50',
                description: 'Voucher chào mừng thành viên mới - Giảm 50k',
                discountType: 'fixed',
                discountValue: 50000,
                minOrderValue: 0,
                startDate: pastDate,
                endDate: futureDate,
                usageLimit: 10000,
                limitPerUser: 1,
                type: 'system',
                trigger: 'welcome',
            },
            {
                code: 'SUMMER2025',
                description: 'Khuyến mãi mùa hè 2025 - Giảm 10%',
                discountType: 'percentage',
                discountValue: 10,
                maxDiscountAmount: 500000,
                minOrderValue: 1000000,
                startDate: pastDate, // Active now
                endDate: futureDate,
                usageLimit: 1000,
                limitPerUser: 1,
                type: 'public',
                trigger: 'none',
            },
            {
                code: 'VIP200',
                description: 'Voucher đặc biệt cho khách hàng VIP - Giảm 200k',
                discountType: 'fixed',
                discountValue: 200000,
                minOrderValue: 2000000,
                startDate: pastDate,
                endDate: futureDate,
                usageLimit: 100,
                limitPerUser: 1,
                type: 'private',
                trigger: 'none',
            },
        ];

        console.log('🎟️  Đang tạo Vouchers...');
        for (const v of vouchers) {
            // Use updateOne with upsert to avoid duplicates if running multiple times
            await Voucher.updateOne(
                { code: v.code },
                { $set: v },
                { upsert: true }
            );
            console.log(`   + Đã tạo/cập nhật: ${v.code}`);
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
