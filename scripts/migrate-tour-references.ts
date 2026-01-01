import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Tour } from '../app/entities/Tour';
import { Region } from '../app/entities/Region';
import { Province } from '../app/entities/Province';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-tour';

// Mapping from old string values to new slug values
const regionMapping: Record<string, string> = {
    'Miền Bắc': 'mien-bac',
    'Miền Trung': 'mien-trung',
    'Miền Nam': 'mien-nam'
};

const provinceMapping: Record<string, string> = {
    'Quảng Ninh': 'quang-ninh',
    'Lào Cai': 'lao-cai',
    'Ninh Bình': 'ninh-binh',
    'Hà Giang': 'ha-giang',
    'Sơn La': 'son-la',
    'Vĩnh Phúc': 'vinh-phuc',
    'Bắc Kạn': 'bac-kan',
    'Điện Biên': 'dien-bien',
    'Hải Phòng': 'hai-phong',
    'Yên Bái': 'yen-bai',
    'Đà Nẵng': 'da-nang',
    'Thừa Thiên Huế': 'thua-thien-hue',
    'Khánh Hòa': 'khanh-hoa',
    'Bình Định': 'binh-dinh',
    'Quảng Nam': 'quang-nam',
    'Quảng Bình': 'quang-binh',
    'Quảng Trị': 'quang-tri',
    'Đắk Lắk': 'dak-lak',
    'Gia Lai': 'gia-lai',
    'Kiên Giang': 'kien-giang',
    'Bà Rịa - Vũng Tàu': 'ba-ria-vung-tau',
    'Lâm Đồng': 'lam-dong',
    'Cần Thơ': 'can-tho',
    'Bình Thuận': 'binh-thuan',
    'An Giang': 'an-giang',
    'Tiền Giang': 'tien-giang',
    'Đồng Tháp': 'dong-thap',
    'Vĩnh Long': 'vinh-long',
    'Bến Tre': 'ben-tre'
};

async function migrateTourReferences() {
    try {
        console.log('🔄 Đang kết nối MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Đã kết nối MongoDB\n');

        // Load regions and provinces
        console.log('📥 Đang load regions và provinces...');
        const regions = await Region.find({});
        const provinces = await Province.find({});
        
        const regionMap = new Map(regions.map(r => [r.slug, r._id]));
        const provinceMap = new Map(provinces.map(p => [p.slug, p._id]));
        
        console.log(`✅ Đã load ${regions.length} regions và ${provinces.length} provinces\n`);

        // Get all tours directly from MongoDB collection (bypass Mongoose schema)
        const tours: any[] = await Tour.collection.find({}).toArray();
        console.log(`📝 Tìm thấy ${tours.length} tours\n`);

        let updatedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        for (const tour of tours) {
            try {
                const updateData: any = {};

                // If tour has region string, convert to ObjectId
                if (tour.region && typeof tour.region === 'string') {
                    const regionSlug = regionMapping[tour.region];
                    if (regionSlug && regionMap.has(regionSlug)) {
                        updateData.region = regionMap.get(regionSlug);
                    } else {
                        console.log(`⚠️  Không tìm thấy region cho: ${tour.region} (${tour.title})`);
                    }
                }

                // If tour has province string, convert to ObjectId
                if (tour.province && typeof tour.province === 'string') {
                    const provinceSlug = provinceMapping[tour.province];
                    if (provinceSlug && provinceMap.has(provinceSlug)) {
                        updateData.province = provinceMap.get(provinceSlug);
                    } else {
                        console.log(`⚠️  Không tìm thấy province cho: ${tour.province} (${tour.title})`);
                    }
                }

                // Update if we have data to update
                if (Object.keys(updateData).length > 0) {
                    // Use updateOne with direct MongoDB operation
                    await Tour.collection.updateOne(
                        { _id: tour._id },
                        { $set: updateData }
                    );
                    updatedCount++;
                    console.log(`✅ Updated: ${tour.title}`);
                } else {
                    skippedCount++;
                    console.log(`⏭️  Skipped: ${tour.title} (không có region/province string)`);
                }
            } catch (error: any) {
                errorCount++;
                console.error(`❌ Lỗi khi update tour ${tour.title}:`, error.message);
            }
        }

        console.log('\n📊 THỐNG KÊ:');
        console.log('═══════════════════════════════════════════════════');
        console.log(`   ✅ Đã cập nhật: ${updatedCount} tours`);
        console.log(`   ⏭️  Bỏ qua: ${skippedCount} tours`);
        console.log(`   ❌ Lỗi: ${errorCount} tours`);
        console.log(`   📝 Tổng: ${tours.length} tours\n`);

        // Show tours by region
        console.log('📊 TOURS THEO REGION:');
        console.log('═══════════════════════════════════════════════════');
        for (const region of regions) {
            const count = await Tour.countDocuments({ region: region._id });
            console.log(`   ${region.name}: ${count} tours`);
        }

        console.log('\n✨ Hoàn tất migration!\n');
        process.exit(0);
    } catch (error: any) {
        console.error('❌ Lỗi:', error.message);
        process.exit(1);
    }
}

migrateTourReferences();
