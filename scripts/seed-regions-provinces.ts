import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Region } from '../app/entities/Region';
import { Province } from '../app/entities/Province';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-tour';

// Regions data with images
const regionsData = [
    {
        name: 'Miền Bắc',
        slug: 'mien-bac',
        description: 'Vùng đất văn hóa nghìn năm với thủ đô Hà Nội, Vịnh Hạ Long và Sapa núi rừng hùng vĩ.',
        image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
        order: 1,
        isActive: true
    },
    {
        name: 'Miền Trung',
        slug: 'mien-trung',
        description: 'Vùng đất di sản với cố đô Huế, phố cổ Hội An và thiên nhiên kỳ vĩ Phong Nha - Kẻ Bàng.',
        image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
        order: 2,
        isActive: true
    },
    {
        name: 'Miền Nam',
        slug: 'mien-nam',
        description: 'Vùng đất Nam Bộ giàu tài nguyên với TP. Hồ Chí Minh, Đồng bằng sông Cửu Long và Phú Quốc.',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
        order: 3,
        isActive: true
    }
];

// Provinces data with images
const provincesData = [
    // Miền Bắc
    {
        name: 'Quảng Ninh',
        slug: 'quang-ninh',
        regionSlug: 'mien-bac',
        description: 'Vịnh Hạ Long - Di sản thiên nhiên thế giới với hàng nghìn đảo đá vôi kỳ vĩ.',
        image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
        thumbnailImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=400',
        order: 1
    },
    {
        name: 'Lào Cai',
        slug: 'lao-cai',
        regionSlug: 'mien-bac',
        description: 'Sapa - Nóc nhà Đông Dương Fansipan và ruộng bậc thang tuyệt đẹp.',
        image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
        thumbnailImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400',
        order: 2
    },
    {
        name: 'Ninh Bình',
        slug: 'ninh-binh',
        regionSlug: 'mien-bac',
        description: 'Tràng An - Vịnh Hạ Long trên cạn với danh thắng thiên nhiên tuyệt mỹ.',
        image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
        thumbnailImage: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400',
        order: 3
    },
    {
        name: 'Hà Giang',
        slug: 'ha-giang',
        regionSlug: 'mien-bac',
        description: 'Cao nguyên đá Đồng Văn - Di sản địa chất toàn cầu với cung đường hạnh phúc.',
        image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
        thumbnailImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400',
        order: 4
    },
    {
        name: 'Sơn La',
        slug: 'son-la',
        regionSlug: 'mien-bac',
        description: 'Mộc Châu - Cao nguyên xanh với đồi chè bạt ngàn và thác Dải Yếm thơ mộng.',
        image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
        thumbnailImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400',
        order: 5
    },
    {
        name: 'Vĩnh Phúc',
        slug: 'vinh-phuc',
        regionSlug: 'mien-bac',
        description: 'Tam Đảo - Thành phố sương mù với khí hậu mát mẻ quanh năm.',
        image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
        thumbnailImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400',
        order: 6
    },
    {
        name: 'Bắc Kạn',
        slug: 'bac-kan',
        regionSlug: 'mien-bac',
        description: 'Hồ Ba Bể - Hồ nước ngọt tự nhiên lớn nhất Việt Nam với thiên nhiên hoang sơ.',
        image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
        thumbnailImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400',
        order: 7
    },
    {
        name: 'Điện Biên',
        slug: 'dien-bien',
        regionSlug: 'mien-bac',
        description: 'Điện Biên Phủ - Miền đất lịch sử với chiến thắng chấn động địa cầu.',
        image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
        thumbnailImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400',
        order: 8
    },
    {
        name: 'Hải Phòng',
        slug: 'hai-phong',
        regionSlug: 'mien-bac',
        description: 'Cát Bà - Đảo ngọc với vườn quốc gia và Vịnh Lan Hạ tuyệt đẹp.',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
        thumbnailImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
        order: 9
    },
    {
        name: 'Yên Bái',
        slug: 'yen-bai',
        regionSlug: 'mien-bac',
        description: 'Mù Cang Chải - Ruộng bậc thang đẹp nhất Việt Nam, di sản văn hóa quốc gia.',
        image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
        thumbnailImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400',
        order: 10
    },

    // Miền Trung
    {
        name: 'Đà Nẵng',
        slug: 'da-nang',
        regionSlug: 'mien-trung',
        description: 'Thành phố đáng sống với Bà Nà Hills, Cầu Vàng và bãi biển Mỹ Khê tuyệt đẹp.',
        image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
        thumbnailImage: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400',
        order: 1
    },
    {
        name: 'Thừa Thiên Huế',
        slug: 'thua-thien-hue',
        regionSlug: 'mien-trung',
        description: 'Cố đô Huế - Di sản văn hóa thế giới với Đại Nội và lăng tẩm các vua.',
        image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
        thumbnailImage: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400',
        order: 2
    },
    {
        name: 'Khánh Hòa',
        slug: 'khanh-hoa',
        regionSlug: 'mien-trung',
        description: 'Nha Trang - Thành phố biển với bãi tắm đẹp và tour 4 đảo hấp dẫn.',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
        thumbnailImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
        order: 3
    },
    {
        name: 'Bình Định',
        slug: 'binh-dinh',
        regionSlug: 'mien-trung',
        description: 'Quy Nhơn - Bãi biển hoang sơ với Eo Gió và ghềnh Đá Đĩa độc đáo.',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
        thumbnailImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
        order: 4
    },
    {
        name: 'Quảng Nam',
        slug: 'quang-nam',
        regionSlug: 'mien-trung',
        description: 'Hội An - Phố cổ di sản thế giới với kiến trúc độc đáo và đèn lồng lung linh.',
        image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
        thumbnailImage: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400',
        order: 5
    },
    {
        name: 'Quảng Bình',
        slug: 'quang-binh',
        regionSlug: 'mien-trung',
        description: 'Phong Nha - Kẻ Bàng với động Thiên Đường và Sơn Đoòng lớn nhất thế giới.',
        image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
        thumbnailImage: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400',
        order: 6
    },
    {
        name: 'Quảng Trị',
        slug: 'quang-tri',
        regionSlug: 'mien-trung',
        description: 'Vĩ tuyến 17 - Miền đất lịch sử với đường hầm Vịnh Mốc và cầu Hiền Lương.',
        image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
        thumbnailImage: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400',
        order: 7
    },
    {
        name: 'Đắk Lắk',
        slug: 'dak-lak',
        regionSlug: 'mien-trung',
        description: 'Buôn Ma Thuột - Thủ phủ cà phê Việt Nam với hồ Lắk và thác Dray Nur.',
        image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
        thumbnailImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400',
        order: 8
    },
    {
        name: 'Gia Lai',
        slug: 'gia-lai',
        regionSlug: 'mien-trung',
        description: 'Pleiku - Biển Hồ thơ mộng và núi lửa Chư Đăng Ya độc đáo.',
        image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
        thumbnailImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400',
        order: 9
    },

    // Miền Nam
    {
        name: 'Kiên Giang',
        slug: 'kien-giang',
        regionSlug: 'mien-nam',
        description: 'Phú Quốc - Đảo ngọc với biển xanh, cát trắng và Vinpearl Safari.',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
        thumbnailImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
        order: 1
    },
    {
        name: 'Bà Rịa - Vũng Tàu',
        slug: 'ba-ria-vung-tau',
        regionSlug: 'mien-nam',
        description: 'Vũng Tàu - Thành phố biển gần Sài Gòn và Côn Đảo huyền thoại.',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
        thumbnailImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
        order: 2
    },
    {
        name: 'Lâm Đồng',
        slug: 'lam-dong',
        regionSlug: 'mien-nam',
        description: 'Đà Lạt - Thành phố ngàn hoa với khí hậu mát mẻ quanh năm.',
        image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
        thumbnailImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400',
        order: 3
    },
    {
        name: 'Cần Thơ',
        slug: 'can-tho',
        regionSlug: 'mien-nam',
        description: 'Cần Thơ - Thủ phủ miền Tây với chợ nổi Cái Răng đặc trưng.',
        image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
        thumbnailImage: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400',
        order: 4
    },
    {
        name: 'Bình Thuận',
        slug: 'binh-thuan',
        regionSlug: 'mien-nam',
        description: 'Phan Thiết - Mũi Né với đồi cát bay và suối tiên độc đáo.',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
        thumbnailImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
        order: 5
    },
    {
        name: 'An Giang',
        slug: 'an-giang',
        regionSlug: 'mien-nam',
        description: 'Châu Đốc - Núi Sam linh thiêng và văn hóa đa dạng sắc tộc.',
        image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
        thumbnailImage: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400',
        order: 6
    },
    {
        name: 'Tiền Giang',
        slug: 'tien-giang',
        regionSlug: 'mien-nam',
        description: 'Mỹ Tho - Cửa ngõ miền Tây với vườn trái cây và đờn ca tài tử.',
        image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
        thumbnailImage: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400',
        order: 7
    },
    {
        name: 'Đồng Tháp',
        slug: 'dong-thap',
        regionSlug: 'mien-nam',
        description: 'Sa Đéc - Làng hoa nổi tiếng và cù lao miệt vườn xanh mát.',
        image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
        thumbnailImage: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400',
        order: 8
    },
    {
        name: 'Vĩnh Long',
        slug: 'vinh-long',
        regionSlug: 'mien-nam',
        description: 'Vĩnh Long - Chợ nổi Cái Bè và cù lao An Bình thơ mộng.',
        image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
        thumbnailImage: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400',
        order: 9
    },
    {
        name: 'Bến Tre',
        slug: 'ben-tre',
        regionSlug: 'mien-nam',
        description: 'Bến Tre - Xứ dừa với làng nghề kẹo dừa truyền thống.',
        image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
        thumbnailImage: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400',
        order: 10
    }
];

async function seedRegionsAndProvinces() {
    try {
        console.log('🔄 Đang kết nối MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Đã kết nối MongoDB\n');

        // Delete old data
        console.log('🗑️  Đang xóa dữ liệu cũ...');
        await Region.deleteMany({});
        await Province.deleteMany({});
        console.log('✅ Đã xóa toàn bộ regions và provinces cũ\n');

        // Insert regions
        console.log('📝 Đang insert regions...');
        const insertedRegions = await Region.insertMany(regionsData);
        console.log(`✅ Đã thêm ${insertedRegions.length} regions\n`);

        // Map region slugs to IDs
        const regionMap = new Map();
        insertedRegions.forEach(region => {
            regionMap.set(region.slug, region._id);
        });

        // Update provinces data with region IDs
        const provincesWithRegionIds = provincesData.map(province => ({
            ...province,
            region: regionMap.get(province.regionSlug),
            regionSlug: undefined // Remove temporary field
        }));

        // Insert provinces
        console.log('📝 Đang insert provinces...');
        const insertedProvinces = await Province.insertMany(provincesWithRegionIds);
        console.log(`✅ Đã thêm ${insertedProvinces.length} provinces\n`);

        // Show statistics
        console.log('📊 THỐNG KÊ:');
        console.log('═══════════════════════════════════════════════════');
        for (const region of insertedRegions) {
            const provinceCount = insertedProvinces.filter(p => 
                p.region.toString() === region._id.toString()
            ).length;
            console.log(`   ${region.name}: ${provinceCount} tỉnh/thành`);
        }

        console.log('\n✨ Hoàn tất! Đã seed regions và provinces\n');
        process.exit(0);
    } catch (error: any) {
        console.error('❌ Lỗi:', error.message);
        process.exit(1);
    }
}

seedRegionsAndProvinces();
