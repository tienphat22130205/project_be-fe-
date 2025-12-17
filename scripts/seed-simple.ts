import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Tour } from '../app/entities/Tour';

dotenv.config();

// 10 tours mẫu đơn giản
const sampleTours = [
  {
    title: 'Du Lịch Hạ Long 3 Ngày 2 Đêm',
    description: 'Khám phá vẻ đẹp kỳ vĩ của Vịnh Hạ Long - Di sản thiên nhiên thế giới',
    destination: 'Quảng Ninh, Vietnam',
    duration: 3,
    price: 3500000,
    maxGroupSize: 20,
    difficulty: 'easy',
    images: [
      'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800'
    ],
    startLocation: {
      type: 'Point',
      coordinates: [107.0844, 20.9101],
      address: 'Quảng Ninh, Vietnam',
      description: 'Bến tàu Bãi Cháy'
    },
    locations: [
      {
        type: 'Point',
        coordinates: [107.0844, 20.9101],
        address: 'Vịnh Hạ Long',
        description: 'Tham quan vịnh Hạ Long',
        day: 1
      }
    ],
    rating: 4.8,
    ratingsQuantity: 125,
    category: 'Beach & Islands',
    featured: true
  },
  {
    title: 'Sapa - Fansipan 4 Ngày 3 Đêm',
    description: 'Chinh phục nóc nhà Đông Dương và khám phá các bản làng dân tộc',
    destination: 'Lào Cai, Vietnam',
    duration: 4,
    price: 4200000,
    maxGroupSize: 15,
    difficulty: 'medium',
    images: [
      'https://images.unsplash.com/photo-1583417019030-80e65726c58b?w=800',
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800'
    ],
    startLocation: {
      type: 'Point',
      coordinates: [103.8440, 22.3364],
      address: 'Sapa, Lào Cai',
      description: 'Trung tâm Sapa'
    },
    locations: [
      {
        type: 'Point',
        coordinates: [103.8440, 22.3364],
        address: 'Fansipan',
        description: 'Đỉnh Fansipan',
        day: 2
      }
    ],
    rating: 4.9,
    ratingsQuantity: 98,
    category: 'Mountain & Trekking',
    featured: true
  },
  {
    title: 'Phú Quốc 5 Ngày 4 Đêm',
    description: 'Nghỉ dưỡng tại đảo ngọc Phú Quốc với bãi biển đẹp nhất Việt Nam',
    destination: 'Kiên Giang, Vietnam',
    duration: 5,
    price: 6500000,
    maxGroupSize: 25,
    difficulty: 'easy',
    images: [
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'
    ],
    startLocation: {
      type: 'Point',
      coordinates: [103.9650, 10.2269],
      address: 'Phú Quốc, Kiên Giang',
      description: 'Sân bay Phú Quốc'
    },
    locations: [
      {
        type: 'Point',
        coordinates: [103.9650, 10.2269],
        address: 'Bãi Sao',
        description: 'Bãi biển Sao',
        day: 1
      }
    ],
    rating: 4.7,
    ratingsQuantity: 210,
    category: 'Beach & Islands',
    featured: true
  },
  {
    title: 'Đà Nẵng - Hội An 3 Ngày 2 Đêm',
    description: 'Khám phá Bà Nà Hills và phố cổ Hội An',
    destination: 'Đà Nẵng, Vietnam',
    duration: 3,
    price: 3800000,
    maxGroupSize: 20,
    difficulty: 'easy',
    images: [
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800'
    ],
    startLocation: {
      type: 'Point',
      coordinates: [108.2022, 16.0544],
      address: 'Đà Nẵng',
      description: 'Sân bay Đà Nẵng'
    },
    locations: [
      {
        type: 'Point',
        coordinates: [108.2022, 16.0544],
        address: 'Bà Nà Hills',
        description: 'Cầu Vàng',
        day: 1
      }
    ],
    rating: 4.6,
    ratingsQuantity: 156,
    category: 'City & Culture',
    featured: false
  },
  {
    title: 'Nha Trang 4 Ngày 3 Đêm',
    description: 'Tour biển đảo Nha Trang với nhiều hoạt động thể thao nước',
    destination: 'Khánh Hòa, Vietnam',
    duration: 4,
    price: 4500000,
    maxGroupSize: 30,
    difficulty: 'easy',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'
    ],
    startLocation: {
      type: 'Point',
      coordinates: [109.1967, 12.2388],
      address: 'Nha Trang, Khánh Hòa',
      description: 'Trung tâm Nha Trang'
    },
    locations: [
      {
        type: 'Point',
        coordinates: [109.1967, 12.2388],
        address: 'Vinpearl Land',
        description: 'Công viên giải trí',
        day: 2
      }
    ],
    rating: 4.5,
    ratingsQuantity: 178,
    category: 'Beach & Islands',
    featured: false
  },
  {
    title: 'Đà Lạt 3 Ngày 2 Đêm',
    description: 'Thành phố ngàn hoa với khí hậu mát mẻ',
    destination: 'Lâm Đồng, Vietnam',
    duration: 3,
    price: 2800000,
    maxGroupSize: 20,
    difficulty: 'easy',
    images: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800'
    ],
    startLocation: {
      type: 'Point',
      coordinates: [108.4419, 11.9404],
      address: 'Đà Lạt, Lâm Đồng',
      description: 'Trung tâm Đà Lạt'
    },
    locations: [
      {
        type: 'Point',
        coordinates: [108.4419, 11.9404],
        address: 'Hồ Xuân Hương',
        description: 'Hồ Xuân Hương',
        day: 1
      }
    ],
    rating: 4.7,
    ratingsQuantity: 145,
    category: 'City & Culture',
    featured: false
  },
  {
    title: 'Ninh Bình - Tràng An 2 Ngày 1 Đêm',
    description: 'Hạ Long trên cạn với Tràng An và Tam Cốc',
    destination: 'Ninh Bình, Vietnam',
    duration: 2,
    price: 1800000,
    maxGroupSize: 25,
    difficulty: 'easy',
    images: [
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800'
    ],
    startLocation: {
      type: 'Point',
      coordinates: [105.9745, 20.2506],
      address: 'Ninh Bình',
      description: 'Khu du lịch Tràng An'
    },
    locations: [
      {
        type: 'Point',
        coordinates: [105.9745, 20.2506],
        address: 'Tràng An',
        description: 'Quần thể Tràng An',
        day: 1
      }
    ],
    rating: 4.8,
    ratingsQuantity: 92,
    category: 'Nature & Wildlife',
    featured: true
  },
  {
    title: 'Huế - Phố Cổ 3 Ngày 2 Đêm',
    description: 'Khám phá cố đô Huế với các di tích lịch sử',
    destination: 'Thừa Thiên Huế, Vietnam',
    duration: 3,
    price: 3200000,
    maxGroupSize: 20,
    difficulty: 'easy',
    images: [
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800'
    ],
    startLocation: {
      type: 'Point',
      coordinates: [107.5955, 16.4637],
      address: 'Huế',
      description: 'Đại Nội Huế'
    },
    locations: [
      {
        type: 'Point',
        coordinates: [107.5955, 16.4637],
        address: 'Đại Nội',
        description: 'Hoàng cung Huế',
        day: 1
      }
    ],
    rating: 4.6,
    ratingsQuantity: 110,
    category: 'City & Culture',
    featured: false
  },
  {
    title: 'Cần Thơ - Chợ Nổi 2 Ngày 1 Đêm',
    description: 'Trải nghiệm chợ nổi Cái Răng và văn hóa miền Tây',
    destination: 'Cần Thơ, Vietnam',
    duration: 2,
    price: 1600000,
    maxGroupSize: 30,
    difficulty: 'easy',
    images: [
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800'
    ],
    startLocation: {
      type: 'Point',
      coordinates: [105.7847, 10.0341],
      address: 'Cần Thơ',
      description: 'Bến Ninh Kiều'
    },
    locations: [
      {
        type: 'Point',
        coordinates: [105.7847, 10.0341],
        address: 'Chợ nổi Cái Răng',
        description: 'Chợ nổi',
        day: 1
      }
    ],
    rating: 4.5,
    ratingsQuantity: 88,
    category: 'Nature & Wildlife',
    featured: false
  },
  {
    title: 'Mũi Né - Phan Thiết 3 Ngày 2 Đêm',
    description: 'Nghỉ dưỡng tại Mũi Né với đồi cát bay nổi tiếng',
    destination: 'Bình Thuận, Vietnam',
    duration: 3,
    price: 2500000,
    maxGroupSize: 25,
    difficulty: 'easy',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'
    ],
    startLocation: {
      type: 'Point',
      coordinates: [108.1004, 10.9280],
      address: 'Phan Thiết, Bình Thuận',
      description: 'Trung tâm Phan Thiết'
    },
    locations: [
      {
        type: 'Point',
        coordinates: [108.1004, 10.9280],
        address: 'Đồi cát bay',
        description: 'Đồi cát Mũi Né',
        day: 1
      }
    ],
    rating: 4.4,
    ratingsQuantity: 102,
    category: 'Beach & Islands',
    featured: false
  }
];

async function seedSimpleTours() {
  try {
    console.log('🚀 Đang xóa dữ liệu cũ và thêm 10 tours mẫu...\n');

    // Connect MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/travel_tour_db';
    await mongoose.connect(mongoUri);
    console.log('✅ Đã kết nối MongoDB:', mongoUri);

    // Xóa tất cả tours cũ
    const deleted = await Tour.deleteMany({});
    console.log(`🗑️  Đã xóa ${deleted.deletedCount} tours cũ\n`);

    // Tạo startDates cho mỗi tour
    const tours = sampleTours.map(tour => ({
      ...tour,
      startDates: [
        new Date('2024-03-15'),
        new Date('2024-04-20'),
        new Date('2024-05-25')
      ],
      guides: [],
      isActive: true,
      includes: [
        'Xe đưa đón',
        'Khách sạn',
        'Bữa ăn theo chương trình',
        'Hướng dẫn viên',
        'Vé tham quan'
      ],
      excludes: [
        'Vé máy bay',
        'Chi phí cá nhân',
        'Bảo hiểm du lịch'
      ]
    }));

    // Insert tours
    const inserted = await Tour.insertMany(tours);
    console.log(`✅ Đã thêm ${inserted.length} tours mới\n`);

    // Hiển thị danh sách
    console.log('📝 DANH SÁCH TOURS:');
    console.log('═══════════════════════════════════════════════════');
    inserted.forEach((tour, index) => {
      const featured = tour.featured ? '⭐' : '  ';
      console.log(`${featured} ${index + 1}. ${tour.title}`);
      console.log(`    💵 ${tour.price.toLocaleString('vi-VN')}đ | ⏱️  ${tour.duration} ngày | 🎯 ${tour.rating}/5`);
      console.log(`    📍 ${tour.destination} | ${tour.category}`);
    });

    console.log('\n✨ Hoàn tất! Database đã sẵn sàng để test API\n');
    
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  }
}

seedSimpleTours();
