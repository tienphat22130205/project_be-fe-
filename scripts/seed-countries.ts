import mongoose from 'mongoose';
import dotenv from 'dotenv';
import slugify from 'slugify';
import { Country } from '../app/entities/Country';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-tour';

const countries = [
    {
        name: 'Thái Lan',
        slug: slugify('Thái Lan', { lower: true, locale: 'vi', strict: true }),
        image: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800',
        description: 'Đất nước chùa vàng với văn hóa độc đáo, bãi biển tuyệt đẹp và ẩm thực phong phú.',
        continent: 'Châu Á',
        isActive: true
    },
    {
        name: 'Hàn Quốc',
        slug: slugify('Hàn Quốc', { lower: true, locale: 'vi', strict: true }),
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
        description: 'Xứ sở kim chi với văn hóa K-pop hiện đại, cung điện cổ kính và công nghệ tiên tiến.',
        continent: 'Châu Á',
        isActive: true
    },
    {
        name: 'Nhật Bản',
        slug: slugify('Nhật Bản', { lower: true, locale: 'vi', strict: true }),
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
        description: 'Đất nước mặt trời mọc với sự kết hợp hoàn hảo giữa truyền thống và hiện đại.',
        continent: 'Châu Á',
        isActive: true
    },
    {
        name: 'Singapore',
        slug: slugify('Singapore', { lower: true, locale: 'vi', strict: true }),
        image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800',
        description: 'Đảo quốc sư tử - thiên đường mua sắm và ẩm thực đa văn hóa.',
        continent: 'Châu Á',
        isActive: true
    },
    {
        name: 'Malaysia',
        slug: slugify('Malaysia', { lower: true, locale: 'vi', strict: true }),
        image: 'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=800',
        description: 'Đất nước đa sắc tộc với thiên nhiên phong phú và ẩm thực hấp dẫn.',
        continent: 'Châu Á',
        isActive: true
    },
    {
        name: 'Đài Loan',
        slug: slugify('Đài Loan', { lower: true, locale: 'vi', strict: true }),
        image: 'https://images.unsplash.com/photo-1552912810-33f5d13b519e?w=800',
        description: 'Bảo đảo Formosa với chợ đêm sôi động, phong cảnh núi non hùng vĩ.',
        continent: 'Châu Á',
        isActive: true
    },
    {
        name: 'Trung Quốc',
        slug: slugify('Trung Quốc', { lower: true, locale: 'vi', strict: true }),
        image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800',
        description: 'Cường quốc phương Đông với lịch sử 5000 năm và di sản văn hóa đồ sộ.',
        continent: 'Châu Á',
        isActive: true
    },
    {
        name: 'Dubai',
        slug: slugify('Dubai', { lower: true, locale: 'vi', strict: true }),
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
        description: 'Thành phố xa hoa bậc nhất thế giới với kiến trúc hiện đại và sa mạc kỳ ảo.',
        continent: 'Châu Á',
        isActive: true
    },
    {
        name: 'Châu Âu',
        slug: slugify('Châu Âu', { lower: true, locale: 'vi', strict: true }),
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
        description: 'Lục địa cổ kính với nền văn minh rực rỡ, kiến trúc tráng lệ và nghệ thuật tinh hoa.',
        continent: 'Châu Âu',
        isActive: true
    }
];

async function seedCountries() {
    try {
        console.log('🔄 Đang kết nối MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Đã kết nối MongoDB\n');

        // Xóa toàn bộ dữ liệu cũ
        console.log('🗑️  Đang xóa dữ liệu countries cũ...');
        await Country.deleteMany({});
        console.log('✅ Đã xóa toàn bộ countries cũ\n');

        // Insert countries mới
        console.log('📝 Đang insert countries...');
        const inserted = await Country.insertMany(countries);
        console.log(`✅ Đã thêm ${inserted.length} countries\n`);

        // Hiển thị danh sách
        console.log('📊 DANH SÁCH COUNTRIES:');
        console.log('═══════════════════════════════════════════════════');
        
        const asiaCountries = inserted.filter(c => c.continent === 'Châu Á');
        const europeCountries = inserted.filter(c => c.continent === 'Châu Âu');
        
        console.log(`\n🌏 Châu Á: ${asiaCountries.length} quốc gia`);
        asiaCountries.forEach((country, index) => {
            console.log(`   ${index + 1}. ${country.name}`);
            console.log(`      📷 Image: ${country.image.substring(0, 50)}...`);
        });
        
        console.log(`\n🌍 Châu Âu: ${europeCountries.length} khu vực`);
        europeCountries.forEach((country, index) => {
            console.log(`   ${index + 1}. ${country.name}`);
            console.log(`      📷 Image: ${country.image.substring(0, 50)}...`);
        });

        console.log('\n✨ Hoàn tất! Đã seed countries\n');
        process.exit(0);
    } catch (error: any) {
        console.error('❌ Lỗi:', error.message);
        process.exit(1);
    }
}

seedCountries();
