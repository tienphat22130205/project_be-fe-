import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Tour } from '../app/entities/Tour';
import { AdditionalService } from '../app/entities/AdditionalService';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-tour';

// Helper functions
const generateTourCode = (destination: string, duration: number) => {
    const code = destination
        .split(',')[0]
        .toUpperCase()
        .replace(/\s+/g, '-')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    return `${code}-${duration}D${duration - 1}N`;
};

const generateDepartures = (basePrice: number) => [
    {
        startDate: new Date('2025-03-15'),
        endDate: new Date('2025-03-18'),
        availableSeats: Math.floor(Math.random() * 20) + 15,
        pricing: {
            adult: Math.round(basePrice * 0.9),
            child: Math.round(basePrice * 0.45),
            infant: Math.round(basePrice * 0.25)
        }
    },
    {
        startDate: new Date('2025-04-20'),
        endDate: new Date('2025-04-23'),
        availableSeats: Math.floor(Math.random() * 25) + 20,
        pricing: {
            adult: basePrice,
            child: Math.round(basePrice * 0.5),
            infant: Math.round(basePrice * 0.25)
        }
    },
    {
        startDate: new Date('2025-06-10'),
        endDate: new Date('2025-06-13'),
        availableSeats: Math.floor(Math.random() * 30) + 25,
        pricing: {
            adult: basePrice,
            child: Math.round(basePrice * 0.5),
            infant: Math.round(basePrice * 0.25)
        }
    }
];

const generateItinerary = (duration: number, destination: string) => {
    const days = [];
    for (let i = 1; i <= duration; i++) {
        if (i === 1) {
            days.push({
                day: i,
                title: `Ngày ${i}: Khởi hành - ${destination}`,
                description: `Xe đón quý khách tại điểm hẹn, khởi hành đến ${destination}. Nhận phòng khách sạn, tự do nghỉ ngơi hoặc khám phá địa phương.`,
                meals: ['Trưa', 'Chiều'],
                accommodation: `Khách sạn 3-4* tại ${destination}`
            });
        } else if (i === duration) {
            days.push({
                day: i,
                title: `Ngày ${i}: ${destination} - Về điểm khởi hành`,
                description: `Dùng điểm tâm sáng. Trả phòng, tự do mua sắm đặc sản. Xe đưa đoàn về điểm khởi hành. Kết thúc chương trình.`,
                meals: ['Sáng']
            });
        } else {
            days.push({
                day: i,
                title: `Ngày ${i}: Tham quan ${destination}`,
                description: `Tham quan các điểm du lịch nổi tiếng, trải nghiệm văn hóa địa phương, thưởng thức ẩm thực đặc trưng của ${destination}.`,
                meals: ['Sáng', 'Trưa', 'Chiều'],
                accommodation: `Khách sạn 3-4* tại ${destination}`
            });
        }
    }
    return days;
};

const generatePolicies = () => ({
    cancellation: [
        'Hủy trước 15 ngày: Hoàn lại 100% tiền tour',
        'Hủy từ 7-14 ngày: Hoàn lại 70% tiền tour',
        'Hủy từ 3-6 ngày: Hoàn lại 50% tiền tour',
        'Hủy trong vòng 2 ngày: Không hoàn tiền'
    ],
    payment: [
        'Đặt cọc 30% khi đăng ký',
        'Thanh toán 70% còn lại trước 7 ngày khởi hành',
        'Chấp nhận thanh toán: Tiền mặt, chuyển khoản, thẻ tín dụng'
    ],
    groupDiscount: 'Nhóm từ 5 khách trở lên, giảm 5% giá tour cho khách hàng thứ 5',
    note: [
        'Không áp dụng đồng thời nhiều chương trình khuyến mãi',
        'Giá tour có thể thay đổi theo mùa',
        'Vui lòng liên hệ để biết thêm chi tiết'
    ]
});

// Complete tours data with all attributes
const completeTours = [
    // ==================== TOURS TRONG NƯỚC ====================
    {
        title: 'Du Lịch Hạ Long 3 Ngày 2 Đêm',
        description: 'Khám phá vẻ đẹp kỳ vĩ của Vịnh Hạ Long - Di sản thiên nhiên thế giới với hang Sửng Sốt, đảo Titop và làng chài cổ.',
        destination: 'Quảng Ninh, Vietnam',
        duration: 3,
        price: 3500000,
        maxGroupSize: 20,
        difficulty: 'easy',
        images: [
            'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
            'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800'
        ],
        tourCode: 'HA-LONG-3D2N',
        startDates: [new Date('2025-02-15'), new Date('2025-03-20'), new Date('2025-04-25')],
        departures: generateDepartures(3500000),
        itinerary: generateItinerary(3, 'Hạ Long'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [107.0844, 20.9101],
            address: 'Quảng Ninh, Vietnam',
            description: 'Bến tàu Bãi Cháy'
        },
        locations: [{
            type: 'Point',
            coordinates: [107.0844, 20.9101],
            address: 'Vịnh Hạ Long',
            description: 'Tham quan vịnh Hạ Long',
            day: 1
        }],
        rating: 4.8,
        ratingsQuantity: 125,
        category: 'Beach & Islands',
        featured: true,
        isInternational: false,
        isPromotional: false,
        includes: [
            'Vé tàu tham quan Vịnh Hạ Long',
            'Khách sạn 3-4* tại Hạ Long',
            'Bữa ăn theo chương trình',
            'Hướng dẫn viên nhiệt tình',
            'Bảo hiểm du lịch'
        ],
        excludes: [
            'Chi phí cá nhân',
            'Đồ uống có cồn',
            'Tiền tip cho hướng dẫn viên'
        ]
    },
    {
        title: 'SIÊU ƯU ĐÃI: Sapa - Fansipan 4N3Đ',
        description: 'Chinh phục nóc nhà Đông Dương với cáp treo Fansipan, khám phá bản Cát Cát, thác Bạc và thung lũng Mường Hoa.',
        destination: 'Lào Cai, Vietnam',
        duration: 4,
        price: 3200000,
        maxGroupSize: 15,
        difficulty: 'medium',
        images: [
            'https://image.vietnamnews.vn/uploadvnnews/Article/2025/9/5/448159_fansipan.jpg',
            'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800'
        ],
        tourCode: 'SAPA-4D3N',
        startDates: [new Date('2025-01-20'), new Date('2025-02-15'), new Date('2025-03-10')],
        departures: generateDepartures(3200000),
        itinerary: generateItinerary(4, 'Sapa'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [103.8440, 22.3364],
            address: 'Sapa, Lào Cai',
            description: 'Trung tâm Sapa'
        },
        locations: [{
            type: 'Point',
            coordinates: [103.8440, 22.3364],
            address: 'Fansipan',
            description: 'Đỉnh Fansipan',
            day: 2
        }],
        rating: 4.9,
        ratingsQuantity: 98,
        category: 'Mountain & Trekking',
        featured: true,
        isInternational: false,
        isPromotional: true,
        includes: [
            'Vé cáp treo Fansipan',
            'Khách sạn 3* tại Sapa',
            'Bữa ăn theo chương trình',
            'Hướng dẫn viên địa phương',
            'Bảo hiểm du lịch'
        ],
        excludes: [
            'Vé tàu/xe từ Hà Nội',
            'Chi phí cá nhân',
            'Tiền tip'
        ]
    },
    {
        title: 'Phú Quốc Đảo Ngọc 5N4Đ',
        description: 'Nghỉ dưỡng tại đảo ngọc Phú Quốc với bãi Sao, Vinpearl Safari, Grand World và chợ đêm Phú Quốc.',
        destination: 'Kiên Giang, Vietnam',
        duration: 5,
        price: 6500000,
        maxGroupSize: 25,
        difficulty: 'easy',
        images: [
            'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'
        ],
        tourCode: 'PHU-QUOC-5D4N',
        startDates: [new Date('2025-03-05'), new Date('2025-04-12'), new Date('2025-05-20')],
        departures: generateDepartures(6500000),
        itinerary: generateItinerary(5, 'Phú Quốc'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [103.9650, 10.2269],
            address: 'Phú Quốc, Kiên Giang',
            description: 'Sân bay Phú Quốc'
        },
        locations: [{
            type: 'Point',
            coordinates: [103.9650, 10.2269],
            address: 'Bãi Sao',
            description: 'Bãi biển Sao',
            day: 1
        }],
        rating: 4.7,
        ratingsQuantity: 210,
        category: 'Beach & Islands',
        featured: true,
        isInternational: false,
        isPromotional: false,
        includes: [
            'Vé máy bay khứ hồi',
            'Resort 4* view biển',
            'Tour 4 đảo',
            'Vé Vinpearl Safari',
            'Bảo hiểm du lịch'
        ],
        excludes: [
            'Chi phí cá nhân',
            'Dịch vụ spa',
            'Tiền tip'
        ]
    },
    {
        title: 'KHUYẾN MÃI: Đà Nẵng - Hội An 3N2Đ',
        description: 'Khám phá Bà Nà Hills với Cầu Vàng, phố cổ Hội An, Ngũ Hành Sơn và bãi biển Mỹ Khê.',
        destination: 'Đà Nẵng, Vietnam',
        duration: 3,
        price: 2990000,
        maxGroupSize: 20,
        difficulty: 'easy',
        images: ['https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800'],
        tourCode: 'DA-NANG-3D2N',
        startDates: [new Date('2025-01-15'), new Date('2025-02-10'), new Date('2025-03-15')],
        departures: generateDepartures(2990000),
        itinerary: generateItinerary(3, 'Đà Nẵng'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [108.2022, 16.0544],
            address: 'Đà Nẵng',
            description: 'Sân bay Đà Nẵng'
        },
        locations: [{
            type: 'Point',
            coordinates: [108.2022, 16.0544],
            address: 'Bà Nà Hills',
            description: 'Cầu Vàng',
            day: 1
        }],
        rating: 4.6,
        ratingsQuantity: 156,
        category: 'City & Culture',
        featured: false,
        isInternational: false,
        isPromotional: true,
        includes: [
            'Vé cáp treo Bà Nà Hills',
            'Khách sạn 3* gần biển',
            'Bữa ăn theo chương trình',
            'Hướng dẫn viên',
            'Bảo hiểm'
        ],
        excludes: [
            'Vé máy bay',
            'Chi phí cá nhân',
            'Tiền tip'
        ]
    },
    {
        title: 'Nha Trang Biển Đảo 4N3Đ',
        description: 'Tour biển đảo Nha Trang với 4 đảo, Vinpearl Land, tắm bùn I-Resort và thưởng thức hải sản tươi sống.',
        destination: 'Khánh Hòa, Vietnam',
        duration: 4,
        price: 4500000,
        maxGroupSize: 30,
        difficulty: 'easy',
        images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'],
        tourCode: 'NHA-TRANG-4D3N',
        startDates: [new Date('2025-02-20'), new Date('2025-03-25'), new Date('2025-04-30')],
        departures: generateDepartures(4500000),
        itinerary: generateItinerary(4, 'Nha Trang'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [109.1967, 12.2388],
            address: 'Nha Trang, Khánh Hòa',
            description: 'Trung tâm Nha Trang'
        },
        locations: [{
            type: 'Point',
            coordinates: [109.1967, 12.2388],
            address: 'Vinpearl Land',
            description: 'Công viên giải trí',
            day: 2
        }],
        rating: 4.5,
        ratingsQuantity: 178,
        category: 'Beach & Islands',
        featured: false,
        isInternational: false,
        isPromotional: false,
        includes: [
            'Tour 4 đảo',
            'Khách sạn 3* trung tâm',
            'Bữa ăn theo chương trình',
            'Vé tham quan',
            'Bảo hiểm'
        ],
        excludes: [
            'Vé máy bay',
            'Dịch vụ tắm bùn',
            'Chi phí cá nhân'
        ]
    },

    // ==================== TOURS NGOÀI NƯỚC ====================
    {
        title: 'SIÊU KM: Bangkok - Pattaya 5N4Đ',
        description: 'Tour Thái Lan giá siêu rẻ. Buffet Baiyoke Sky 84 tầng, show Alcazar, chùa Vàng và chợ nổi Damnoen Saduak.',
        destination: 'Thái Lan',
        duration: 5,
        price: 6990000,
        maxGroupSize: 30,
        difficulty: 'easy',
        images: [
            'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800',
            'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800'
        ],
        tourCode: 'BANGKOK-5D4N',
        startDates: [new Date('2025-01-10'), new Date('2025-02-20'), new Date('2025-03-15')],
        departures: generateDepartures(6990000),
        itinerary: generateItinerary(5, 'Bangkok'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [100.5018, 13.7563],
            address: 'Bangkok, Thailand',
            description: 'Sân bay Suvarnabhumi'
        },
        locations: [{
            type: 'Point',
            coordinates: [100.5018, 13.7563],
            address: 'Wat Arun',
            description: 'Chùa Bình Minh',
            day: 1
        }],
        rating: 4.7,
        ratingsQuantity: 245,
        category: 'City & Culture',
        featured: true,
        isInternational: true,
        isPromotional: true,
        includes: [
            'Vé máy bay khứ hồi',
            'Khách sạn 3* trung tâm',
            'Bữa ăn theo chương trình',
            'Vé tham quan',
            'Hướng dẫn viên tiếng Việt',
            'Bảo hiểm quốc tế'
        ],
        excludes: [
            'Chi phí làm visa',
            'Chi phí cá nhân',
            'Tiền tip'
        ]
    },
    {
        title: 'Seoul - Nami - Everland 5N4Đ',
        description: 'Khám phá Hàn Quốc: Cung điện Gyeongbokgung, đảo Nami, Everland, làng Bukchon Hanok và shopping Myeongdong.',
        destination: 'Hàn Quốc',
        duration: 5,
        price: 13500000,
        maxGroupSize: 20,
        difficulty: 'easy',
        images: [
            'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800',
            'https://images.unsplash.com/photo-1583854229275-27663f5d44b4?w=800'
        ],
        tourCode: 'SEOUL-5D4N',
        startDates: [new Date('2025-03-15'), new Date('2025-04-20'), new Date('2025-05-10')],
        departures: generateDepartures(13500000),
        itinerary: generateItinerary(5, 'Seoul'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [126.9780, 37.5665],
            address: 'Seoul, South Korea',
            description: 'Sân bay Incheon'
        },
        locations: [{
            type: 'Point',
            coordinates: [126.9780, 37.5665],
            address: 'Gyeongbokgung Palace',
            description: 'Cung điện Gyeongbokgung',
            day: 2
        }],
        rating: 4.8,
        ratingsQuantity: 189,
        category: 'City & Culture',
        featured: true,
        isInternational: true,
        isPromotional: false,
        includes: [
            'Vé máy bay khứ hồi',
            'Khách sạn 3-4*',
            'Bữa ăn theo chương trình',
            'Vé tham quan Everland',
            'Hướng dẫn viên tiếng Việt',
            'Bảo hiểm quốc tế'
        ],
        excludes: [
            'Chi phí làm visa',
            'Mua sắm cá nhân',
            'Tiền tip'
        ]
    },
    {
        title: 'CHÙM TOUR: Tokyo - Osaka - Kyoto 7N6Đ',
        description: 'Hành trình Nhật Bản: Tokyo Skytree, núi Phú Sĩ, Osaka Castle, chùa Vàng Kinkaku-ji và rừng tre Arashiyama.',
        destination: 'Nhật Bản',
        duration: 7,
        price: 28900000,
        maxGroupSize: 15,
        difficulty: 'medium',
        images: [
            'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
            'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800'
        ],
        tourCode: 'JAPAN-7D6N',
        startDates: [new Date('2025-03-25'), new Date('2025-04-05'), new Date('2025-05-15')],
        departures: generateDepartures(28900000),
        itinerary: generateItinerary(7, 'Tokyo'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [139.6917, 35.6895],
            address: 'Tokyo, Japan',
            description: 'Sân bay Narita'
        },
        locations: [{
            type: 'Point',
            coordinates: [139.6917, 35.6895],
            address: 'Shibuya Crossing',
            description: 'Giao lộ Shibuya',
            day: 1
        }],
        rating: 4.9,
        ratingsQuantity: 312,
        category: 'City & Culture',
        featured: true,
        isInternational: true,
        isPromotional: true,
        includes: [
            'Vé máy bay khứ hồi',
            'Khách sạn 3-4*',
            'Vé tàu Shinkansen',
            'Bữa ăn theo chương trình',
            'Hướng dẫn viên tiếng Việt',
            'Bảo hiểm quốc tế'
        ],
        excludes: [
            'Chi phí làm visa',
            'Chi phí cá nhân',
            'Tiền tip'
        ]
    },
    {
        title: 'Singapore - Malaysia 6N5Đ',
        description: 'Hành trình 2 quốc gia: Gardens by the Bay, Marina Bay Sands, Sentosa, tháp đôi Petronas và Genting Highlands.',
        destination: 'Singapore - Malaysia',
        duration: 6,
        price: 14500000,
        maxGroupSize: 20,
        difficulty: 'easy',
        images: [
            'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800',
            'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=800'
        ],
        tourCode: 'SING-MALAY-6D5N',
        startDates: [new Date('2025-01-30'), new Date('2025-03-05'), new Date('2025-04-18')],
        departures: generateDepartures(14500000),
        itinerary: generateItinerary(6, 'Singapore'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [103.8198, 1.3521],
            address: 'Singapore',
            description: 'Sân bay Changi'
        },
        locations: [{
            type: 'Point',
            coordinates: [103.8198, 1.3521],
            address: 'Marina Bay',
            description: 'Marina Bay Sands',
            day: 1
        }],
        rating: 4.7,
        ratingsQuantity: 167,
        category: 'City & Culture',
        featured: false,
        isInternational: true,
        isPromotional: false,
        includes: [
            'Vé máy bay khứ hồi',
            'Khách sạn 3-4*',
            'Bữa ăn theo chương trình',
            'Vé tham quan',
            'Hướng dẫn viên',
            'Bảo hiểm quốc tế'
        ],
        excludes: [
            'Chi phí cá nhân',
            'Universal Studios',
            'Tiền tip'
        ]
    },
    {
        title: 'Đài Loan - Đài Bắc - Đài Trung 5N4Đ',
        description: 'Khám phá Đài Loan: Đài Bắc 101, thả đèn trời Thập Phần, Hồ Nhật Nguyệt và chợ đêm Phùng Giáp.',
        destination: 'Đài Loan',
        duration: 5,
        price: 11990000,
        maxGroupSize: 25,
        difficulty: 'easy',
        images: ['https://images.unsplash.com/photo-1552912810-33f5d13b519e?w=800'],
        tourCode: 'TAIWAN-5D4N',
        startDates: [new Date('2025-02-12'), new Date('2025-03-18'), new Date('2025-04-22')],
        departures: generateDepartures(11990000),
        itinerary: generateItinerary(5, 'Đài Bắc'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [121.2339, 25.0797],
            address: 'Taipei, Taiwan',
            description: 'Sân bay Đào Viên'
        },
        locations: [{
            type: 'Point',
            coordinates: [121.2339, 25.0797],
            address: 'Taipei 101',
            description: 'Tòa nhà Taipei 101',
            day: 1
        }],
        rating: 4.6,
        ratingsQuantity: 134,
        category: 'City & Culture',
        featured: false,
        isInternational: true,
        isPromotional: false,
        includes: [
            'Vé máy bay khứ hồi',
            'Khách sạn 3*',
            'Bữa ăn theo chương trình',
            'Vé tham quan',
            'Hướng dẫn viên',
            'Bảo hiểm'
        ],
        excludes: [
            'Chi phí cá nhân',
            'Mua sắm',
            'Tiền tip'
        ]
    }
];

async function seedCompleteTours() {
    try {
        console.log('🔄 Đang kết nối MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Đã kết nối MongoDB\n');

        // Xóa toàn bộ dữ liệu cũ
        console.log('🗑️  Đang xóa dữ liệu cũ...');
        await Tour.deleteMany({});
        console.log('✅ Đã xóa toàn bộ tours cũ\n');

        // Insert tours mới
        console.log('📝 Đang insert tours mới...');
        const inserted = await Tour.insertMany(completeTours);
        console.log(`✅ Đã thêm ${inserted.length} tours mới\n`);

        // Thống kê
        const domesticCount = inserted.filter(t => !t.isInternational).length;
        const internationalCount = inserted.filter(t => t.isInternational).length;
        const promotionalCount = inserted.filter(t => t.isPromotional).length;

        console.log('📊 THỐNG KÊ:');
        console.log('═══════════════════════════════════════════════════');
        console.log(`   📍 Tours trong nước: ${domesticCount}`);
        console.log(`   ✈️  Tours ngoài nước: ${internationalCount}`);
        console.log(`   🎁 Tours ưu đãi: ${promotionalCount}`);
        console.log(`   💼 Tổng cộng: ${inserted.length} tours\n`);

        // Hiển thị danh sách
        console.log('📝 DANH SÁCH TOURS:');
        console.log('═══════════════════════════════════════════════════');
        inserted.forEach((tour, index) => {
            const featured = tour.featured ? '⭐' : '  ';
            const promo = tour.isPromotional ? '🎁' : '  ';
            const location = tour.isInternational ? '✈️ ' : '📍';
            console.log(`${featured}${promo} ${index + 1}. ${location} ${tour.title}`);
            console.log(`      💵 ${tour.price.toLocaleString('vi-VN')}đ | ⏱️  ${tour.duration} ngày | 🎯 ${tour.rating}/5`);
        });

        // ==================== TẠO ADDITIONAL SERVICES ====================
        console.log('\n🎯 Đang tạo dịch vụ bổ sung cho các tours...');
        await AdditionalService.deleteMany({});

        const serviceTemplates = [
            {
                name: 'Phòng đơn phụ thu',
                description: 'Phụ thu cho khách muốn ở phòng đơn thay vì phòng đôi',
                basePrice: 500000,
                unit: 'đ/phòng/đêm',
                isActive: true,
                maxQuantity: 10,
                category: 'Phụ thu',
            },
            {
                name: 'Bảo hiểm du lịch',
                description: 'Bảo hiểm tai nạn và y tế trong suốt chuyến đi',
                basePrice: 200000,
                unit: 'đ/khách',
                isActive: true,
                category: 'Bảo hiểm',
            },
            {
                name: 'Nâng cấp phòng VIP',
                description: 'Nâng cấp lên phòng hạng cao hơn với view đẹp và tiện nghi tốt hơn',
                basePrice: 800000,
                unit: 'đ/phòng/đêm',
                isActive: true,
                maxQuantity: 5,
                category: 'Nâng cấp',
            },
            {
                name: 'Xe riêng đưa đón sân bay',
                description: 'Dịch vụ xe riêng đưa đón tận nơi từ sân bay về khách sạn',
                basePrice: 600000,
                unit: 'đ/chuyến',
                isActive: true,
                maxQuantity: 20,
                category: 'Dịch vụ thêm',
            },
            {
                name: 'Hướng dẫn viên riêng',
                description: 'Thuê hướng dẫn viên riêng cho nhóm để được tư vấn chi tiết',
                basePrice: 1500000,
                unit: 'đ/ngày',
                isActive: true,
                maxQuantity: 3,
                category: 'Dịch vụ thêm',
            },
            {
                name: 'Buffet sáng cao cấp',
                description: 'Nâng cấp bữa sáng buffet cao cấp với nhiều món hơn',
                basePrice: 300000,
                unit: 'đ/khách/ngày',
                isActive: true,
                category: 'Ăn uống',
            },
        ];

        const allServices = [];
        for (const tour of inserted) {
            const priceRatio = tour.price / 10000000;
            const multiplier = Math.max(0.7, Math.min(1.5, priceRatio));

            for (const template of serviceTemplates) {
                const adjustedPrice = Math.round(template.basePrice * multiplier / 10000) * 10000;

                allServices.push({
                    tour: tour._id,
                    name: template.name,
                    description: template.description,
                    price: adjustedPrice,
                    unit: template.unit,
                    isActive: template.isActive,
                    maxQuantity: template.maxQuantity,
                    category: template.category,
                });
            }
        }

        await AdditionalService.insertMany(allServices);
        console.log(`✅ Đã tạo ${allServices.length} dịch vụ bổ sung (${serviceTemplates.length} dịch vụ x ${inserted.length} tours)\n`);

        console.log('\n✨ Hoàn tất! Database đã sẵn sàng\n');
        process.exit(0);
    } catch (error: any) {
        console.error('❌ Lỗi:', error.message);
        process.exit(1);
    }
}

seedCompleteTours();
