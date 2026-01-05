import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Tour } from '../app/entities/Tour';
import { AdditionalService } from '../app/entities/AdditionalService';
import { Region } from '../app/entities/Region';
import { Province } from '../app/entities/Province';
import { Country } from '../app/entities/Country';
// npx ts-node scripts/seed-complete.ts
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-tour';

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
    // ==================== TOURS MIỀN BẮC ====================
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
        region: 'Miền Bắc',
        province: 'Quảng Ninh',
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
        region: 'Miền Bắc',
        province: 'Lào Cai',
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
        title: 'Hà Nội - Ninh Bình 2N1Đ',
        description: 'Tour tham quan Tràng An, Tam Cốc, Hang Múa và chùa Bái Đính - Di sản thiên nhiên và văn hóa thế giới.',
        destination: 'Ninh Bình, Vietnam',
        duration: 2,
        price: 1890000,
        maxGroupSize: 25,
        difficulty: 'easy',
        images: [
            'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800'
        ],
        tourCode: 'NINH-BINH-2D1N',
        startDates: [new Date('2025-01-25'), new Date('2025-02-18'), new Date('2025-03-22')],
        departures: generateDepartures(1890000),
        itinerary: generateItinerary(2, 'Ninh Bình'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [105.9745, 20.2506],
            address: 'Ninh Bình, Vietnam',
            description: 'Trung tâm Ninh Bình'
        },
        locations: [{
            type: 'Point',
            coordinates: [105.9745, 20.2506],
            address: 'Tràng An',
            description: 'Quần thể danh thắng Tràng An',
            day: 1
        }],
        rating: 4.7,
        ratingsQuantity: 156,
        category: 'Nature & Culture',
        featured: false,
        isInternational: false,
        isPromotional: false,
        region: 'Miền Bắc',
        province: 'Ninh Bình',
        includes: [
            'Xe đưa đón từ Hà Nội',
            'Khách sạn 3* tại Ninh Bình',
            'Vé tham quan các điểm',
            'Bữa ăn theo chương trình',
            'Hướng dẫn viên'
        ],
        excludes: [
            'Chi phí cá nhân',
            'Đồ uống',
            'Tiền tip'
        ]
    },
    {
        title: 'KHUYẾN MÃI HOT: Hạ Long - Yên Tử 3N2Đ',
        description: 'Combo siêu tiết kiệm: Khám phá Vịnh Hạ Long & chinh phục núi Yến Tử linh thiêng. Giá cực ưu đãi cho khách đặt sớm!',
        destination: 'Quảng Ninh, Vietnam',
        duration: 3,
        price: 2990000,
        maxGroupSize: 20,
        difficulty: 'medium',
        images: [
            'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
            'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800'
        ],
        tourCode: 'HA-LONG-YEN-TU-PROMO',
        startDates: [new Date('2025-02-10'), new Date('2025-03-05'), new Date('2025-04-08')],
        departures: generateDepartures(2990000),
        itinerary: generateItinerary(3, 'Hạ Long - Yên Tử'),
        policies: generatePolicies(),
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
                description: 'Vịnh Hạ Long',
                day: 1
            },
            {
                type: 'Point',
                coordinates: [106.7583, 21.1128],
                address: 'Núi Yên Tử',
                description: 'Quần thể di tích Yên Tử',
                day: 2
            }
        ],
        rating: 4.8,
        ratingsQuantity: 187,
        category: 'Beach & Culture',
        featured: true,
        isInternational: false,
        isPromotional: true,
        region: 'Miền Bắc',
        province: 'Quảng Ninh',
        includes: [
            'Vé tàu tham quan Vịnh Hạ Long',
            'Vé cáp treo Yên Tử',
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
        title: 'ƯU ĐÃI ĐẶC BIỆT: Mộc Châu - Tú Lệ 3N2Đ',
        description: 'Săn mây Mộc Châu, check-in đồi chè trái tim, thưởng thức sữa chua & gà đồi. Giá shock cho nhóm từ 4 người!',
        destination: 'Sơn La, Vietnam',
        duration: 3,
        price: 2490000,
        maxGroupSize: 18,
        difficulty: 'easy',
        images: [
            'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
            'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800'
        ],
        tourCode: 'MOC-CHAU-PROMO',
        startDates: [new Date('2025-02-20'), new Date('2025-03-15'), new Date('2025-04-18')],
        departures: generateDepartures(2490000),
        itinerary: generateItinerary(3, 'Mộc Châu - Tú Lệ'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [104.6720, 20.8453],
            address: 'Mộc Châu, Sơn La',
            description: 'Trung tâm Mộc Châu'
        },
        locations: [
            {
                type: 'Point',
                coordinates: [104.6720, 20.8453],
                address: 'Đồi chè Mộc Châu',
                description: 'Đồi chè trái tim',
                day: 1
            },
            {
                type: 'Point',
                coordinates: [104.3956, 21.4322],
                address: 'Tú Lệ',
                description: 'Thung lũng Tú Lệ',
                day: 2
            }
        ],
        rating: 4.7,
        ratingsQuantity: 142,
        category: 'Nature & Photography',
        featured: true,
        isInternational: false,
        isPromotional: true,
        region: 'Miền Bắc',
        province: 'Sơn La',
        includes: [
            'Xe đưa đón từ Hà Nội',
            'Khách sạn 3* & Homestay',
            'Bữa ăn đặc sản địa phương',
            'Hướng dẫn viên vui vẻ',
            'Bảo hiểm du lịch'
        ],
        excludes: [
            'Chi phí cá nhân',
            'Đồ uống có cồn',
            'Tiền tip'
        ]
    },
    {
        title: 'Hà Giang - Cao Bằng 5N4Đ',
        description: 'Chinh phục vòng cung Hà Giang, thác Bản Giốc, động Pắc Bó và khám phá cao nguyên đá Đồng Văn.',
        destination: 'Hà Giang - Cao Bằng, Vietnam',
        duration: 5,
        price: 4500000,
        maxGroupSize: 16,
        difficulty: 'difficult',
        images: [
            'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800'
        ],
        tourCode: 'HA-GIANG-5D4N',
        startDates: [new Date('2025-02-10'), new Date('2025-03-12'), new Date('2025-04-15')],
        departures: generateDepartures(4500000),
        itinerary: generateItinerary(5, 'Hà Giang'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [104.9784, 22.8025],
            address: 'Hà Giang, Vietnam',
            description: 'Trung tâm Hà Giang'
        },
        locations: [{
            type: 'Point',
            coordinates: [104.9784, 22.8025],
            address: 'Đồng Văn',
            description: 'Cao nguyên đá Đồng Văn',
            day: 2
        }],
        rating: 4.9,
        ratingsQuantity: 203,
        category: 'Mountain & Trekking',
        featured: true,
        isInternational: false,
        isPromotional: false,
        region: 'Miền Bắc',
        province: 'Hà Giang',
        includes: [
            'Xe đưa đón suốt tuyến',
            'Khách sạn và homestay',
            'Bữa ăn theo chương trình',
            'Hướng dẫn viên địa phương',
            'Bảo hiểm du lịch'
        ],
        excludes: [
            'Chi phí cá nhân',
            'Đồ uống có cồn',
            'Tiền tip'
        ]
    },
    {
        title: 'Mộc Châu - Mai Châu 3N2Đ',
        description: 'Khám phá cao nguyên Mộc Châu với đồi chè xanh mướt, thung lũng Mai Châu và bản làng người Thái.',
        destination: 'Sơn La - Hòa Bình, Vietnam',
        duration: 3,
        price: 2500000,
        maxGroupSize: 20,
        difficulty: 'easy',
        images: [
            'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800'
        ],
        tourCode: 'MOC-CHAU-3D2N',
        startDates: [new Date('2025-01-15'), new Date('2025-02-20'), new Date('2025-03-18')],
        departures: generateDepartures(2500000),
        itinerary: generateItinerary(3, 'Mộc Châu'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [104.6784, 20.8417],
            address: 'Mộc Châu, Sơn La',
            description: 'Cao nguyên Mộc Châu'
        },
        locations: [{
            type: 'Point',
            coordinates: [104.6784, 20.8417],
            address: 'Đồi chè Mộc Châu',
            description: 'Đồi chè xanh mướt',
            day: 1
        }],
        rating: 4.6,
        ratingsQuantity: 142,
        category: 'Nature & Culture',
        featured: false,
        isInternational: false,
        isPromotional: false,
        region: 'Miền Bắc',
        province: 'Sơn La',
        includes: [
            'Xe đưa đón từ Hà Nội',
            'Homestay/khách sạn 3*',
            'Bữa ăn theo chương trình',
            'Hướng dẫn viên',
            'Bảo hiểm'
        ],
        excludes: [
            'Chi phí cá nhân',
            'Đồ uống',
            'Tiền tip'
        ]
    },
    {
        title: 'Hà Nội - Tam Đảo 2N1Đ',
        description: 'Nghỉ dưỡng tại Tam Đảo với khí hậu mát mẻ, khám phá thác Bạc, chùa Trình và thưởng thức đặc sản núi rừng.',
        destination: 'Vĩnh Phúc, Vietnam',
        duration: 2,
        price: 1590000,
        maxGroupSize: 20,
        difficulty: 'easy',
        images: [
            'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800'
        ],
        tourCode: 'TAM-DAO-2D1N',
        startDates: [new Date('2025-01-12'), new Date('2025-02-16'), new Date('2025-03-14')],
        departures: generateDepartures(1590000),
        itinerary: generateItinerary(2, 'Tam Đảo'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [105.6389, 21.4644],
            address: 'Tam Đảo, Vĩnh Phúc',
            description: 'Trung tâm Tam Đảo'
        },
        locations: [{
            type: 'Point',
            coordinates: [105.6389, 21.4644],
            address: 'Thác Bạc',
            description: 'Thác Bạc Tam Đảo',
            day: 1
        }],
        rating: 4.5,
        ratingsQuantity: 112,
        category: 'Nature & Relax',
        featured: false,
        isInternational: false,
        isPromotional: false,
        region: 'Miền Bắc',
        province: 'Vĩnh Phúc',
        includes: [
            'Xe đưa đón từ Hà Nội',
            'Khách sạn 3*',
            'Bữa ăn theo chương trình',
            'Hướng dẫn viên',
            'Bảo hiểm'
        ],
        excludes: [
            'Chi phí cá nhân',
            'Đồ uống',
            'Tiền tip'
        ]
    },
    {
        title: 'Bắc Kạn - Hồ Ba Bể 3N2Đ',
        description: 'Khám phá hồ Ba Bể - hồ nước ngọt tự nhiên lớn nhất Việt Nam, động Puông, thác Đầu Đẳng và bản Pác Ngòi.',
        destination: 'Bắc Kạn, Vietnam',
        duration: 3,
        price: 2890000,
        maxGroupSize: 18,
        difficulty: 'medium',
        images: [
            'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800'
        ],
        tourCode: 'BA-BE-3D2N',
        startDates: [new Date('2025-02-08'), new Date('2025-03-10'), new Date('2025-04-12')],
        departures: generateDepartures(2890000),
        itinerary: generateItinerary(3, 'Ba Bể'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [105.8362, 22.1475],
            address: 'Bắc Kạn, Vietnam',
            description: 'Hồ Ba Bể'
        },
        locations: [{
            type: 'Point',
            coordinates: [105.8362, 22.1475],
            address: 'Hồ Ba Bể',
            description: 'Vườn quốc gia Ba Bể',
            day: 1
        }],
        rating: 4.7,
        ratingsQuantity: 128,
        category: 'Nature & Adventure',
        featured: false,
        isInternational: false,
        isPromotional: false,
        region: 'Miền Bắc',
        province: 'Bắc Kạn',
        includes: [
            'Xe đưa đón từ Hà Nội',
            'Homestay/khách sạn',
            'Vé tham quan',
            'Bữa ăn theo chương trình',
            'Hướng dẫn viên'
        ],
        excludes: [
            'Chi phí cá nhân',
            'Đồ uống',
            'Tiền tip'
        ]
    },
    {
        title: 'Điện Biên - Sơn La 4N3Đ',
        description: 'Hành trình về miền đất lịch sử với đồi A1, nghĩa trang Điện Biên Phủ, Mường Thanh và thưởng thức cơm lam.',
        destination: 'Điện Biên, Vietnam',
        duration: 4,
        price: 3890000,
        maxGroupSize: 20,
        difficulty: 'medium',
        images: [
            'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800'
        ],
        tourCode: 'DIEN-BIEN-4D3N',
        startDates: [new Date('2025-02-05'), new Date('2025-03-08'), new Date('2025-04-10')],
        departures: generateDepartures(3890000),
        itinerary: generateItinerary(4, 'Điện Biên'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [103.0158, 21.3855],
            address: 'Điện Biên Phủ',
            description: 'Trung tâm Điện Biên Phủ'
        },
        locations: [{
            type: 'Point',
            coordinates: [103.0158, 21.3855],
            address: 'Đồi A1',
            description: 'Đồi A1 Điện Biên Phủ',
            day: 1
        }],
        rating: 4.6,
        ratingsQuantity: 95,
        category: 'History & Culture',
        featured: false,
        isInternational: false,
        isPromotional: false,
        region: 'Miền Bắc',
        province: 'Điện Biên',
        includes: [
            'Xe đưa đón từ Hà Nội',
            'Khách sạn 3*',
            'Vé tham quan',
            'Bữa ăn theo chương trình',
            'Hướng dẫn viên'
        ],
        excludes: [
            'Chi phí cá nhân',
            'Đồ uống',
            'Tiền tip'
        ]
    },
    {
        title: 'Hải Phòng - Cát Bà 3N2Đ',
        description: 'Khám phá đảo Cát Bà với vườn quốc gia, Vịnh Lan Hạ, bãi tắm Cát Cò và thưởng thức hải sản tươi sống.',
        destination: 'Hải Phòng, Vietnam',
        duration: 3,
        price: 2990000,
        maxGroupSize: 25,
        difficulty: 'easy',
        images: [
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'
        ],
        tourCode: 'CAT-BA-3D2N',
        startDates: [new Date('2025-01-20'), new Date('2025-02-24'), new Date('2025-03-26')],
        departures: generateDepartures(2990000),
        itinerary: generateItinerary(3, 'Cát Bà'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [107.0531, 20.7273],
            address: 'Cát Bà, Hải Phòng',
            description: 'Đảo Cát Bà'
        },
        locations: [{
            type: 'Point',
            coordinates: [107.0531, 20.7273],
            address: 'Vịnh Lan Hạ',
            description: 'Vịnh Lan Hạ Cát Bà',
            day: 1
        }],
        rating: 4.7,
        ratingsQuantity: 167,
        category: 'Beach & Nature',
        featured: false,
        isInternational: false,
        isPromotional: false,
        region: 'Miền Bắc',
        province: 'Hải Phòng',
        includes: [
            'Xe và phà đưa đón',
            'Khách sạn 3* trên đảo',
            'Vé tham quan',
            'Bữa ăn theo chương trình',
            'Hướng dẫn viên'
        ],
        excludes: [
            'Chi phí cá nhân',
            'Đồ uống',
            'Tiền tip'
        ]
    },
    {
        title: 'Yên Bái - Mù Cang Chải 4N3Đ',
        description: 'Chinh phục ruộng bậc thang Mù Cang Chải - Di sản văn hóa quốc gia, khám phá bản Lao Chải và đèo Khau Phạ.',
        destination: 'Yên Bái, Vietnam',
        duration: 4,
        price: 4200000,
        maxGroupSize: 16,
        difficulty: 'medium',
        images: [
            'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800'
        ],
        tourCode: 'MU-CANG-CHAI-4D3N',
        startDates: [new Date('2025-02-18'), new Date('2025-03-20'), new Date('2025-04-22')],
        departures: generateDepartures(4200000),
        itinerary: generateItinerary(4, 'Mù Cang Chải'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [104.0647, 21.6931],
            address: 'Mù Cang Chải, Yên Bái',
            description: 'Trung tâm Mù Cang Chải'
        },
        locations: [{
            type: 'Point',
            coordinates: [104.0647, 21.6931],
            address: 'Ruộng bậc thang',
            description: 'Ruộng bậc thang Mù Cang Chải',
            day: 2
        }],
        rating: 4.8,
        ratingsQuantity: 176,
        category: 'Nature & Photography',
        featured: true,
        isInternational: false,
        isPromotional: false,
        region: 'Miền Bắc',
        province: 'Yên Bái',
        includes: [
            'Xe đưa đón từ Hà Nội',
            'Homestay/khách sạn',
            'Bữa ăn theo chương trình',
            'Hướng dẫn viên địa phương',
            'Bảo hiểm'
        ],
        excludes: [
            'Chi phí cá nhân',
            'Đồ uống',
            'Tiền tip'
        ]
    },

    // ==================== TOURS MIỀN TRUNG ====================
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
        region: 'Miền Trung',
        province: 'Đà Nẵng',
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
        title: 'Huế - Phong Nha 4N3Đ',
        description: 'Khám phá cố đô Huế với Đại Nội, lăng tẩm các vua, động Phong Nha - Kẻ Bàng và sông Bến Hải.',
        destination: 'Thừa Thiên Huế - Quảng Bình, Vietnam',
        duration: 4,
        price: 3800000,
        maxGroupSize: 18,
        difficulty: 'easy',
        images: [
            'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800'
        ],
        tourCode: 'HUE-4D3N',
        startDates: [new Date('2025-01-28'), new Date('2025-02-25'), new Date('2025-03-28')],
        departures: generateDepartures(3800000),
        itinerary: generateItinerary(4, 'Huế'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [107.5909, 16.4637],
            address: 'Huế, Thừa Thiên Huế',
            description: 'Trung tâm Huế'
        },
        locations: [{
            type: 'Point',
            coordinates: [107.5909, 16.4637],
            address: 'Đại Nội Huế',
            description: 'Hoàng thành Huế',
            day: 1
        }],
        rating: 4.7,
        ratingsQuantity: 189,
        category: 'Culture & History',
        featured: true,
        isInternational: false,
        isPromotional: false,
        region: 'Miền Trung',
        province: 'Thừa Thiên Huế',
        includes: [
            'Xe đưa đón',
            'Khách sạn 3-4*',
            'Vé tham quan các điểm',
            'Bữa ăn theo chương trình',
            'Hướng dẫn viên'
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
        ratingsQuantity: 245,
        category: 'Beach & Islands',
        featured: true,
        isInternational: false,
        isPromotional: false,
        region: 'Miền Trung',
        province: 'Khánh Hòa',
        includes: [
            'Vé tham quan 4 đảo',
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
        title: 'SALE SỐC: Phú Quốc 3N2Đ - Trọn Gói Resort',
        description: 'Combo cực HOT: Vé máy bay + Resort 4* + Buffet sáng + Tham quan Nam đảo. Đặt ngay kẻo lỡ giá shock!',
        destination: 'Kiên Giang, Vietnam',
        duration: 3,
        price: 3990000,
        maxGroupSize: 25,
        difficulty: 'easy',
        images: [
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
            'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800'
        ],
        tourCode: 'PHU-QUOC-PROMO',
        startDates: [new Date('2025-02-12'), new Date('2025-03-18'), new Date('2025-04-22')],
        departures: generateDepartures(3990000),
        itinerary: generateItinerary(3, 'Phú Quốc'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [103.9650, 10.2128],
            address: 'Phú Quốc, Kiên Giang',
            description: 'Sân bay Phú Quốc'
        },
        locations: [
            {
                type: 'Point',
                coordinates: [103.9650, 10.2128],
                address: 'Bãi Sao',
                description: 'Bãi Sao Phú Quốc',
                day: 1
            },
            {
                type: 'Point',
                coordinates: [104.0297, 10.1778],
                address: 'Nam đảo',
                description: 'Tour Nam đảo',
                day: 2
            }
        ],
        rating: 4.9,
        ratingsQuantity: 312,
        category: 'Beach & Resort',
        featured: true,
        isInternational: false,
        isPromotional: true,
        region: 'Miền Nam',
        province: 'Kiên Giang',
        includes: [
            'Vé máy bay khứ hồi',
            'Resort 4* view biển',
            'Buffet sáng hàng ngày',
            'Tour Nam đảo',
            'Xe đưa đón sân bay',
            'Bảo hiểm du lịch'
        ],
        excludes: [
            'Bữa trưa, tối',
            'Chi phí cá nhân',
            'Tiền tip'
        ]
    },
    {
        title: 'ƯU ĐÃI TẾT: Hội An - Đà Nẵng - Huế 5N4Đ',
        description: 'Khuyến mãi đặc biệt Tết Nguyên Đán: Miền Trung 5 ngày giá siêu tiết kiệm. Phố cổ Hội An + Bà Nà Hills + Cố đô Huế.',
        destination: 'Quảng Nam - Đà Nẵng - Huế, Vietnam',
        duration: 5,
        price: 4990000,
        maxGroupSize: 22,
        difficulty: 'easy',
        images: [
            'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
            'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800'
        ],
        tourCode: 'HOI-AN-DA-NANG-HUE-PROMO',
        startDates: [new Date('2025-02-08'), new Date('2025-03-12'), new Date('2025-04-16')],
        departures: generateDepartures(4990000),
        itinerary: generateItinerary(5, 'Hội An - Đà Nẵng - Huế'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [108.2022, 16.0544],
            address: 'Đà Nẵng, Vietnam',
            description: 'Sân bay Đà Nẵng'
        },
        locations: [
            {
                type: 'Point',
                coordinates: [108.3280, 15.8801],
                address: 'Hội An',
                description: 'Phố cổ Hội An',
                day: 1
            },
            {
                type: 'Point',
                coordinates: [107.9912, 15.9754],
                address: 'Bà Nà Hills',
                description: 'Cầu Vàng Bà Nà',
                day: 2
            },
            {
                type: 'Point',
                coordinates: [107.5909, 16.4637],
                address: 'Huế',
                description: 'Đại Nội Huế',
                day: 3
            }
        ],
        rating: 4.8,
        ratingsQuantity: 267,
        category: 'Culture & Beach',
        featured: true,
        isInternational: false,
        isPromotional: true,
        region: 'Miền Trung',
        province: 'Đà Nẵng',
        includes: [
            'Vé máy bay khứ hồi',
            'Khách sạn 3-4* trung tâm',
            'Vé Bà Nà Hills',
            'Bữa ăn theo chương trình',
            'Hướng dẫn viên nhiệt tình',
            'Bảo hiểm du lịch'
        ],
        excludes: [
            'Chi phí cá nhân',
            'Đồ uống có cồn',
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
        region: 'Miền Trung',
        province: 'Khánh Hòa',
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
    {
        title: 'Quy Nhơn - Phú Yên 3N2Đ',
        description: 'Khám phá Quy Nhơn với ghềnh Đá Đĩa, Eo Gió, và Phú Yên với Gành Đá Đĩa, tháp Nhạn.',
        destination: 'Bình Định - Phú Yên, Vietnam',
        duration: 3,
        price: 3200000,
        maxGroupSize: 22,
        difficulty: 'easy',
        images: [
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'
        ],
        tourCode: 'QUY-NHON-3D2N',
        startDates: [new Date('2025-02-05'), new Date('2025-03-08'), new Date('2025-04-12')],
        departures: generateDepartures(3200000),
        itinerary: generateItinerary(3, 'Quy Nhơn'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [109.2195, 13.7830],
            address: 'Quy Nhơn, Bình Định',
            description: 'Trung tâm Quy Nhơn'
        },
        locations: [{
            type: 'Point',
            coordinates: [109.2195, 13.7830],
            address: 'Eo Gió',
            description: 'Mũi Eo Gió',
            day: 1
        }],
        rating: 4.6,
        ratingsQuantity: 134,
        category: 'Beach & Nature',
        featured: false,
        isInternational: false,
        isPromotional: false,
        region: 'Miền Trung',
        province: 'Bình Định',
        includes: [
            'Xe đưa đón',
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
        title: 'Hạ Long - Quảng Ninh 2N1Đ (Bay từ Đà Nẵng)',
        description: 'Trải nghiệm Vịnh Hạ Long từ miền Trung với vé máy bay trọn gói, tham quan hang Sửng Sốt và đảo Titop.',
        destination: 'Quảng Ninh, Vietnam',
        duration: 2,
        price: 5990000,
        maxGroupSize: 20,
        difficulty: 'easy',
        images: [
            'https://images.unsplash.com/photo-1528127269322-539801943592?w=800'
        ],
        tourCode: 'HA-LONG-FROM-DN-2D1N',
        startDates: [new Date('2025-02-12'), new Date('2025-03-15'), new Date('2025-04-18')],
        departures: generateDepartures(5990000),
        itinerary: generateItinerary(2, 'Hạ Long'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [108.2022, 16.0544],
            address: 'Đà Nẵng',
            description: 'Sân bay Đà Nẵng'
        },
        locations: [{
            type: 'Point',
            coordinates: [107.0844, 20.9101],
            address: 'Vịnh Hạ Long',
            description: 'Vịnh Hạ Long',
            day: 1
        }],
        rating: 4.6,
        ratingsQuantity: 89,
        category: 'Beach & Islands',
        featured: false,
        isInternational: false,
        isPromotional: false,
        region: 'Miền Trung',
        province: 'Đà Nẵng',
        includes: [
            'Vé máy bay khứ hồi',
            'Khách sạn 3*',
            'Vé tàu tham quan',
            'Bữa ăn theo chương trình',
            'Hướng dẫn viên'
        ],
        excludes: [
            'Chi phí cá nhân',
            'Đồ uống',
            'Tiền tip'
        ]
    },
    {
        title: 'Quảng Nam - Hội An - Mỹ Sơn 3N2Đ',
        description: 'Khám phá phố cổ Hội An, thánh địa Mỹ Sơn, làng gốm Thanh Hà và rừng dừa Bảy Mẫu.',
        destination: 'Quảng Nam, Vietnam',
        duration: 3,
        price: 2790000,
        maxGroupSize: 22,
        difficulty: 'easy',
        images: [
            'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800'
        ],
        tourCode: 'HOI-AN-3D2N',
        startDates: [new Date('2025-01-22'), new Date('2025-02-26'), new Date('2025-03-28')],
        departures: generateDepartures(2790000),
        itinerary: generateItinerary(3, 'Hội An'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [108.3380, 15.8801],
            address: 'Hội An, Quảng Nam',
            description: 'Phố cổ Hội An'
        },
        locations: [{
            type: 'Point',
            coordinates: [108.3380, 15.8801],
            address: 'Phố cổ Hội An',
            description: 'Di sản văn hóa thế giới',
            day: 1
        }],
        rating: 4.8,
        ratingsQuantity: 198,
        category: 'Culture & History',
        featured: true,
        isInternational: false,
        isPromotional: false,
        region: 'Miền Trung',
        province: 'Quảng Nam',
        includes: [
            'Xe đưa đón từ Đà Nẵng',
            'Khách sạn 3* trung tâm',
            'Vé tham quan',
            'Bữa ăn theo chương trình',
            'Hướng dẫn viên'
        ],
        excludes: [
            'Vé máy bay',
            'Chi phí cá nhân',
            'Tiền tip'
        ]
    },
    {
        title: 'Quảng Bình - Động Thiên Đường 3N2Đ',
        description: 'Khám phá động Thiên Đường - hang động đẹp nhất hành tinh, vườn thực vật và thác Suối Nước Mọc.',
        destination: 'Quảng Bình, Vietnam',
        duration: 3,
        price: 3290000,
        maxGroupSize: 20,
        difficulty: 'easy',
        images: [
            'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800'
        ],
        tourCode: 'THIEN-DUONG-3D2N',
        startDates: [new Date('2025-02-10'), new Date('2025-03-12'), new Date('2025-04-15')],
        departures: generateDepartures(3290000),
        itinerary: generateItinerary(3, 'Quảng Bình'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [106.3488, 17.4676],
            address: 'Đồng Hới, Quảng Bình',
            description: 'Trung tâm Đồng Hới'
        },
        locations: [{
            type: 'Point',
            coordinates: [106.3488, 17.4676],
            address: 'Động Thiên Đường',
            description: 'Hang động Thiên Đường',
            day: 2
        }],
        rating: 4.9,
        ratingsQuantity: 223,
        category: 'Nature & Adventure',
        featured: true,
        isInternational: false,
        isPromotional: false,
        region: 'Miền Trung',
        province: 'Quảng Bình',
        includes: [
            'Xe đưa đón',
            'Khách sạn 3*',
            'Vé tham quan động',
            'Bữa ăn theo chương trình',
            'Hướng dẫn viên'
        ],
        excludes: [
            'Vé máy bay/tàu',
            'Chi phí cá nhân',
            'Tiền tip'
        ]
    },
    {
        title: 'Quảng Trị - DMZ 2N1Đ',
        description: 'Hành trình về miền chiến địa với vĩ tuyến 17, cầu Hiền Lương, đường hầm Vịnh Mốc và nghĩa trang Trường Sơn.',
        destination: 'Quảng Trị, Vietnam',
        duration: 2,
        price: 2290000,
        maxGroupSize: 25,
        difficulty: 'easy',
        images: [
            'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800'
        ],
        tourCode: 'QUANG-TRI-2D1N',
        startDates: [new Date('2025-01-18'), new Date('2025-02-20'), new Date('2025-03-22')],
        departures: generateDepartures(2290000),
        itinerary: generateItinerary(2, 'Quảng Trị'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [107.1858, 16.7487],
            address: 'Đông Hà, Quảng Trị',
            description: 'Trung tâm Quảng Trị'
        },
        locations: [{
            type: 'Point',
            coordinates: [107.1858, 16.7487],
            address: 'Vĩ tuyến 17',
            description: 'Cầu Hiền Lương',
            day: 1
        }],
        rating: 4.5,
        ratingsQuantity: 87,
        category: 'History & Culture',
        featured: false,
        isInternational: false,
        isPromotional: false,
        region: 'Miền Trung',
        province: 'Quảng Trị',
        includes: [
            'Xe đưa đón từ Huế',
            'Khách sạn 3*',
            'Vé tham quan',
            'Bữa ăn theo chương trình',
            'Hướng dẫn viên'
        ],
        excludes: [
            'Chi phí cá nhân',
            'Đồ uống',
            'Tiền tip'
        ]
    },
    {
        title: 'Đắk Lắk - Buôn Ma Thuột 3N2Đ',
        description: 'Khám phá Tây Nguyên với hồ Lắk, thác Dray Nur, làng cà phê và thưởng thức cà phê Buôn Ma Thuột.',
        destination: 'Đắk Lắk, Vietnam',
        duration: 3,
        price: 3490000,
        maxGroupSize: 20,
        difficulty: 'easy',
        images: [
            'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800'
        ],
        tourCode: 'DAK-LAK-3D2N',
        startDates: [new Date('2025-02-15'), new Date('2025-03-18'), new Date('2025-04-20')],
        departures: generateDepartures(3490000),
        itinerary: generateItinerary(3, 'Buôn Ma Thuột'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [108.0378, 12.6726],
            address: 'Buôn Ma Thuột, Đắk Lắk',
            description: 'Trung tâm Buôn Ma Thuột'
        },
        locations: [{
            type: 'Point',
            coordinates: [108.0378, 12.6726],
            address: 'Hồ Lắk',
            description: 'Hồ Lắk',
            day: 1
        }],
        rating: 4.7,
        ratingsQuantity: 154,
        category: 'Nature & Culture',
        featured: false,
        isInternational: false,
        isPromotional: false,
        region: 'Miền Trung',
        province: 'Đắk Lắk',
        includes: [
            'Xe đưa đón',
            'Khách sạn 3*',
            'Vé tham quan',
            'Bữa ăn theo chương trình',
            'Hướng dẫn viên địa phương'
        ],
        excludes: [
            'Vé máy bay',
            'Chi phí cá nhân',
            'Tiền tip'
        ]
    },
    {
        title: 'Gia Lai - Pleiku - Biển Hồ 3N2Đ',
        description: 'Khám phá Gia Lai với Biển Hồ, núi lửa Chư Đăng Ya, đường hầm Hải Vân và làng cổ Kon Ka Kinh.',
        destination: 'Gia Lai, Vietnam',
        duration: 3,
        price: 3190000,
        maxGroupSize: 18,
        difficulty: 'medium',
        images: [
            'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800'
        ],
        tourCode: 'GIA-LAI-3D2N',
        startDates: [new Date('2025-02-08'), new Date('2025-03-10'), new Date('2025-04-12')],
        departures: generateDepartures(3190000),
        itinerary: generateItinerary(3, 'Pleiku'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [107.9842, 13.9833],
            address: 'Pleiku, Gia Lai',
            description: 'Trung tâm Pleiku'
        },
        locations: [{
            type: 'Point',
            coordinates: [107.9842, 13.9833],
            address: 'Biển Hồ',
            description: 'Biển Hồ Pleiku',
            day: 1
        }],
        rating: 4.6,
        ratingsQuantity: 132,
        category: 'Nature & Adventure',
        featured: false,
        isInternational: false,
        isPromotional: false,
        region: 'Miền Trung',
        province: 'Gia Lai',
        includes: [
            'Xe đưa đón',
            'Khách sạn 3*',
            'Vé tham quan',
            'Bữa ăn theo chương trình',
            'Hướng dẫn viên'
        ],
        excludes: [
            'Vé máy bay',
            'Chi phí cá nhân',
            'Tiền tip'
        ]
    },

    // ==================== TOURS MIỀN NAM ====================
    {
        title: 'FLASH SALE: Sài Gòn - Mũi Né 3N2Đ',
        description: 'Deal HOT mùa hè: Khám phá đồi cát bay, suối tiên, làng chài và thưởng thức hải sản tươi ngon. Giá sốc chỉ 2.2 triệu!',
        destination: 'Bình Thuận, Vietnam',
        duration: 3,
        price: 2290000,
        maxGroupSize: 28,
        difficulty: 'easy',
        images: [
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
            'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800'
        ],
        tourCode: 'MUI-NE-PROMO',
        startDates: [new Date('2025-02-15'), new Date('2025-03-20'), new Date('2025-04-25')],
        departures: generateDepartures(2290000),
        itinerary: generateItinerary(3, 'Mũi Né'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [108.0820, 10.9333],
            address: 'Phan Thiết, Bình Thuận',
            description: 'Trung tâm Phan Thiết'
        },
        locations: [
            {
                type: 'Point',
                coordinates: [108.2829, 10.9521],
                address: 'Đồi cát bay',
                description: 'Đồi cát Mũi Né',
                day: 1
            },
            {
                type: 'Point',
                coordinates: [108.2452, 10.9635],
                address: 'Suối Tiên',
                description: 'Suối Tiên Mũi Né',
                day: 2
            }
        ],
        rating: 4.7,
        ratingsQuantity: 223,
        category: 'Beach & Adventure',
        featured: true,
        isInternational: false,
        isPromotional: true,
        region: 'Miền Nam',
        province: 'Bình Thuận',
        includes: [
            'Xe đưa đón từ TP.HCM',
            'Khách sạn 3* gần biển',
            'Bữa ăn theo chương trình',
            'Hướng dẫn viên vui tính',
            'Bảo hiểm du lịch'
        ],
        excludes: [
            'Chi phí cá nhân',
            'Đồ uống có cồn',
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
        region: 'Miền Nam',
        province: 'Kiên Giang',
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

    // ==================== TOURS MIỀN NAM ====================
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
        region: 'Miền Nam',
        province: 'Kiên Giang',
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
        title: 'TP.HCM - Vũng Tàu 2N1Đ',
        description: 'Du lịch Vũng Tàu với bãi Sau, bãi Trước, tượng Chúa Kitô, ngọn hải đăng và thưởng thức hải sản tươi sống.',
        destination: 'Bà Rịa - Vũng Tàu, Vietnam',
        duration: 2,
        price: 1590000,
        maxGroupSize: 30,
        difficulty: 'easy',
        images: [
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'
        ],
        tourCode: 'VUNG-TAU-2D1N',
        startDates: [new Date('2025-01-18'), new Date('2025-02-22'), new Date('2025-03-20')],
        departures: generateDepartures(1590000),
        itinerary: generateItinerary(2, 'Vũng Tàu'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [107.0843, 10.3460],
            address: 'Vũng Tàu, Bà Rịa - Vũng Tàu',
            description: 'Trung tâm Vũng Tàu'
        },
        locations: [{
            type: 'Point',
            coordinates: [107.0843, 10.3460],
            address: 'Bãi Sau',
            description: 'Bãi biển Sau Vũng Tàu',
            day: 1
        }],
        rating: 4.5,
        ratingsQuantity: 167,
        category: 'Beach & Relax',
        featured: false,
        isInternational: false,
        isPromotional: false,
        region: 'Miền Nam',
        province: 'Bà Rịa - Vũng Tàu',
        includes: [
            'Xe đưa đón từ TP.HCM',
            'Khách sạn 3* gần biển',
            'Bữa ăn theo chương trình',
            'Hướng dẫn viên',
            'Bảo hiểm'
        ],
        excludes: [
            'Chi phí cá nhân',
            'Đồ uống',
            'Tiền tip'
        ]
    },
    {
        title: 'GIÁ HỦY DIỆT: Cần Thơ - Sóc Trăng - Bạc Liêu 3N2Đ',
        description: 'Combo tiết kiệm nhất miền Tây: Chợ nổi Cái Răng, chùa Khmer, nhà cổ Bình Thủy, vườn trái cây. Tặng kèm tour đi thuyền!',
        destination: 'Cần Thơ - Sóc Trăng - Bạc Liêu, Vietnam',
        duration: 3,
        price: 1990000,
        maxGroupSize: 24,
        difficulty: 'easy',
        images: [
            'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
            'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800'
        ],
        tourCode: 'CAN-THO-PROMO',
        startDates: [new Date('2025-02-18'), new Date('2025-03-22'), new Date('2025-04-28')],
        departures: generateDepartures(1990000),
        itinerary: generateItinerary(3, 'Cần Thơ - Miền Tây'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [105.7850, 10.0340],
            address: 'Cần Thơ, Vietnam',
            description: 'Bến Ninh Kiều'
        },
        locations: [
            {
                type: 'Point',
                coordinates: [105.7850, 10.0340],
                address: 'Chợ nổi Cái Răng',
                description: 'Chợ nổi Cái Răng',
                day: 1
            },
            {
                type: 'Point',
                coordinates: [105.9733, 9.6019],
                address: 'Chùa Khmer',
                description: 'Chùa Khmer Sóc Trăng',
                day: 2
            }
        ],
        rating: 4.6,
        ratingsQuantity: 178,
        category: 'Culture & River',
        featured: true,
        isInternational: false,
        isPromotional: true,
        region: 'Miền Nam',
        province: 'Cần Thơ',
        includes: [
            'Xe đưa đón từ TP.HCM',
            'Khách sạn 2-3*',
            'Tour thuyền chợ nổi',
            'Bữa ăn đặc sản miền Tây',
            'Hướng dẫn viên địa phương',
            'Bảo hiểm du lịch'
        ],
        excludes: [
            'Chi phí cá nhân',
            'Đồ uống có cồn',
            'Tiền tip'
        ]
    },
    {
        title: 'Đà Lạt Thành Phố Ngàn Hoa 3N2Đ',
        description: 'Khám phá Đà Lạt với thác Datanla, hồ Tuyền Lâm, đồi chè Cầu Đất, làng hoa Vạn Thành và chợ đêm Đà Lạt.',
        destination: 'Lâm Đồng, Vietnam',
        duration: 3,
        price: 2790000,
        maxGroupSize: 20,
        difficulty: 'easy',
        images: [
            'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800'
        ],
        tourCode: 'DA-LAT-3D2N',
        startDates: [new Date('2025-01-22'), new Date('2025-02-18'), new Date('2025-03-25')],
        departures: generateDepartures(2790000),
        itinerary: generateItinerary(3, 'Đà Lạt'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [108.4419, 11.9404],
            address: 'Đà Lạt, Lâm Đồng',
            description: 'Trung tâm Đà Lạt'
        },
        locations: [{
            type: 'Point',
            coordinates: [108.4419, 11.9404],
            address: 'Hồ Tuyền Lâm',
            description: 'Hồ Tuyền Lâm',
            day: 1
        }],
        rating: 4.8,
        ratingsQuantity: 234,
        category: 'Nature & Relax',
        featured: true,
        isInternational: false,
        isPromotional: false,
        region: 'Miền Nam',
        province: 'Lâm Đồng',
        includes: [
            'Xe đưa đón từ TP.HCM',
            'Khách sạn 3* trung tâm',
            'Bữa ăn theo chương trình',
            'Vé tham quan các điểm',
            'Hướng dẫn viên'
        ],
        excludes: [
            'Chi phí cá nhân',
            'Đồ uống',
            'Tiền tip'
        ]
    },
    {
        title: 'Cần Thơ - Miệt Vườn Sông Nước 3N2Đ',
        description: 'Khám phá miền Tây với chợ nổi Cái Răng, vườn trái cây, làng hoa Sa Đéc và nhà cổ Bình Thủy.',
        destination: 'Cần Thơ - Đồng Tháp, Vietnam',
        duration: 3,
        price: 2390000,
        maxGroupSize: 25,
        difficulty: 'easy',
        images: [
            'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800'
        ],
        tourCode: 'CAN-THO-3D2N',
        startDates: [new Date('2025-02-08'), new Date('2025-03-15'), new Date('2025-04-10')],
        departures: generateDepartures(2390000),
        itinerary: generateItinerary(3, 'Cần Thơ'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [105.7850, 10.0340],
            address: 'Cần Thơ',
            description: 'Trung tâm Cần Thơ'
        },
        locations: [{
            type: 'Point',
            coordinates: [105.7850, 10.0340],
            address: 'Chợ nổi Cái Răng',
            description: 'Chợ nổi Cái Răng',
            day: 1
        }],
        rating: 4.6,
        ratingsQuantity: 145,
        category: 'Culture & Nature',
        featured: false,
        isInternational: false,
        isPromotional: false,
        region: 'Miền Nam',
        province: 'Cần Thơ',
        includes: [
            'Xe đưa đón từ TP.HCM',
            'Khách sạn 3* tại Cần Thơ',
            'Bữa ăn theo chương trình',
            'Vé tham quan',
            'Hướng dẫn viên'
        ],
        excludes: [
            'Chi phí cá nhân',
            'Đồ uống',
            'Tiền tip'
        ]
    },
    {
        title: 'Côn Đảo Huyền Thoại 4N3Đ',
        description: 'Khám phá Côn Đảo với nhà tù Phú Hải, bãi Đầm Trầu, lặn ngắm san hô và viếng mộ cô Sáu.',
        destination: 'Bà Rịa - Vũng Tàu, Vietnam',
        duration: 4,
        price: 8900000,
        maxGroupSize: 15,
        difficulty: 'medium',
        images: [
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'
        ],
        tourCode: 'CON-DAO-4D3N',
        startDates: [new Date('2025-02-15'), new Date('2025-03-18'), new Date('2025-04-22')],
        departures: generateDepartures(8900000),
        itinerary: generateItinerary(4, 'Côn Đảo'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [106.6067, 8.6833],
            address: 'Côn Đảo, Bà Rịa - Vũng Tàu',
            description: 'Sân bay Côn Đảo'
        },
        locations: [{
            type: 'Point',
            coordinates: [106.6067, 8.6833],
            address: 'Bãi Đầm Trầu',
            description: 'Bãi biển Đầm Trầu',
            day: 1
        }],
        rating: 4.9,
        ratingsQuantity: 98,
        category: 'Beach & History',
        featured: true,
        isInternational: false,
        isPromotional: false,
        region: 'Miền Nam',
        province: 'Bà Rịa - Vũng Tàu',
        includes: [
            'Vé máy bay khứ hồi',
            'Resort 4* trên đảo',
            'Bữa ăn theo chương trình',
            'Tour lặn ngắm san hô',
            'Hướng dẫn viên',
            'Bảo hiểm'
        ],
        excludes: [
            'Chi phí cá nhân',
            'Đồ uống có cồn',
            'Tiền tip'
        ]
    },
    {
        title: 'Phan Thiết - Mũi Né 3N2Đ',
        description: 'Du lịch Phan Thiết với đồi cát bay, đồi cát vàng, suối tiên, hải đăng Kê Gà và thưởng thức hải sản.',
        destination: 'Bình Thuận, Vietnam',
        duration: 3,
        price: 2390000,
        maxGroupSize: 25,
        difficulty: 'easy',
        images: [
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'
        ],
        tourCode: 'MUI-NE-3D2N',
        startDates: [new Date('2025-01-20'), new Date('2025-02-22'), new Date('2025-03-24')],
        departures: generateDepartures(2390000),
        itinerary: generateItinerary(3, 'Phan Thiết'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [108.1007, 10.9280],
            address: 'Phan Thiết, Bình Thuận',
            description: 'Trung tâm Phan Thiết'
        },
        locations: [{
            type: 'Point',
            coordinates: [108.1007, 10.9280],
            address: 'Đồi cát bay',
            description: 'Đồi cát bay Mũi Né',
            day: 1
        }],
        rating: 4.6,
        ratingsQuantity: 187,
        category: 'Beach & Nature',
        featured: false,
        isInternational: false,
        isPromotional: false,
        region: 'Miền Nam',
        province: 'Bình Thuận',
        includes: [
            'Xe đưa đón từ TP.HCM',
            'Khách sạn 3* gần biển',
            'Bữa ăn theo chương trình',
            'Xe Jeep đồi cát',
            'Hướng dẫn viên'
        ],
        excludes: [
            'Chi phí cá nhân',
            'Đồ uống',
            'Tiền tip'
        ]
    },
    {
        title: 'An Giang - Châu Đốc - Núi Sam 2N1Đ',
        description: 'Khám phá An Giang với núi Sam, chùa Tây An, lăng Thoại Ngọc Hầu và chợ nổi Long Xuyên.',
        destination: 'An Giang, Vietnam',
        duration: 2,
        price: 1890000,
        maxGroupSize: 20,
        difficulty: 'easy',
        images: [
            'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800'
        ],
        tourCode: 'AN-GIANG-2D1N',
        startDates: [new Date('2025-01-25'), new Date('2025-02-28'), new Date('2025-03-30')],
        departures: generateDepartures(1890000),
        itinerary: generateItinerary(2, 'Châu Đốc'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [105.1258, 10.7008],
            address: 'Châu Đốc, An Giang',
            description: 'Trung tâm Châu Đốc'
        },
        locations: [{
            type: 'Point',
            coordinates: [105.1258, 10.7008],
            address: 'Núi Sam',
            description: 'Núi Sam Châu Đốc',
            day: 1
        }],
        rating: 4.5,
        ratingsQuantity: 123,
        category: 'Culture & Nature',
        featured: false,
        isInternational: false,
        isPromotional: false,
        region: 'Miền Nam',
        province: 'An Giang',
        includes: [
            'Xe đưa đón từ TP.HCM',
            'Khách sạn 3*',
            'Bữa ăn theo chương trình',
            'Vé tham quan',
            'Hướng dẫn viên'
        ],
        excludes: [
            'Chi phí cá nhân',
            'Đồ uống',
            'Tiền tip'
        ]
    },
    {
        title: 'Tiền Giang - Mỹ Tho - Bến Tre 2N1Đ',
        description: 'Khám phá sông nước miền Tây với chợ nổi, vườn trái cây, làng kẹo dừa và nghe đờn ca tài tử.',
        destination: 'Tiền Giang - Bến Tre, Vietnam',
        duration: 2,
        price: 1690000,
        maxGroupSize: 28,
        difficulty: 'easy',
        images: [
            'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800'
        ],
        tourCode: 'MY-THO-2D1N',
        startDates: [new Date('2025-01-18'), new Date('2025-02-20'), new Date('2025-03-22')],
        departures: generateDepartures(1690000),
        itinerary: generateItinerary(2, 'Mỹ Tho'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [106.3600, 10.3600],
            address: 'Mỹ Tho, Tiền Giang',
            description: 'Trung tâm Mỹ Tho'
        },
        locations: [{
            type: 'Point',
            coordinates: [106.3600, 10.3600],
            address: 'Vườn trái cây',
            description: 'Vườn trái cây Mỹ Tho',
            day: 1
        }],
        rating: 4.4,
        ratingsQuantity: 156,
        category: 'Culture & Nature',
        featured: false,
        isInternational: false,
        isPromotional: false,
        region: 'Miền Nam',
        province: 'Tiền Giang',
        includes: [
            'Xe đưa đón từ TP.HCM',
            'Khách sạn 3*',
            'Bữa ăn theo chương trình',
            'Vé tham quan',
            'Hướng dẫn viên'
        ],
        excludes: [
            'Chi phí cá nhân',
            'Đồ uống',
            'Tiền tip'
        ]
    },
    {
        title: 'Vĩnh Long - Sa Đéc - Cái Bè 2N1Đ',
        description: 'Tour miệt vườn với chợ nổi Cái Bè, làng hoa Sa Đéc, cù lao An Bình và thưởng thức trái cây miệt vườn.',
        destination: 'Vĩnh Long - Đồng Tháp, Vietnam',
        duration: 2,
        price: 1590000,
        maxGroupSize: 22,
        difficulty: 'easy',
        images: [
            'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800'
        ],
        tourCode: 'VINH-LONG-2D1N',
        startDates: [new Date('2025-02-05'), new Date('2025-03-08'), new Date('2025-04-10')],
        departures: generateDepartures(1590000),
        itinerary: generateItinerary(2, 'Vĩnh Long'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [105.9572, 10.2396],
            address: 'Vĩnh Long',
            description: 'Trung tâm Vĩnh Long'
        },
        locations: [{
            type: 'Point',
            coordinates: [105.9572, 10.2396],
            address: 'Chợ nổi Cái Bè',
            description: 'Chợ nổi Cái Bè',
            day: 1
        }],
        rating: 4.5,
        ratingsQuantity: 134,
        category: 'Culture & Nature',
        featured: false,
        isInternational: false,
        isPromotional: false,
        region: 'Miền Nam',
        province: 'Vĩnh Long',
        includes: [
            'Xe đưa đón từ TP.HCM',
            'Homestay/khách sạn',
            'Bữa ăn theo chương trình',
            'Vé tham quan',
            'Hướng dẫn viên'
        ],
        excludes: [
            'Chi phí cá nhân',
            'Đồ uống',
            'Tiền tip'
        ]
    },
    {
        title: 'Rạch Giá - Hà Tiên 3N2Đ',
        description: 'Khám phá Kiên Giang với chùa Hang, biển Mũi Nai, núi Tô Châu và thưởng thức hải sản Rạch Giá.',
        destination: 'Kiên Giang, Vietnam',
        duration: 3,
        price: 2590000,
        maxGroupSize: 20,
        difficulty: 'easy',
        images: [
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'
        ],
        tourCode: 'HA-TIEN-3D2N',
        startDates: [new Date('2025-02-12'), new Date('2025-03-15'), new Date('2025-04-18')],
        departures: generateDepartures(2590000),
        itinerary: generateItinerary(3, 'Hà Tiên'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [104.9784, 10.3809],
            address: 'Hà Tiên, Kiên Giang',
            description: 'Trung tâm Hà Tiên'
        },
        locations: [{
            type: 'Point',
            coordinates: [104.9784, 10.3809],
            address: 'Biển Mũi Nai',
            description: 'Bãi biển Mũi Nai',
            day: 1
        }],
        rating: 4.6,
        ratingsQuantity: 142,
        category: 'Beach & Culture',
        featured: false,
        isInternational: false,
        isPromotional: false,
        region: 'Miền Nam',
        province: 'Kiên Giang',
        includes: [
            'Xe đưa đón từ TP.HCM',
            'Khách sạn 3*',
            'Bữa ăn theo chương trình',
            'Vé tham quan',
            'Hướng dẫn viên'
        ],
        excludes: [
            'Chi phí cá nhân',
            'Đồ uống',
            'Tiền tip'
        ]
    },

    // ==================== TOURS NGOÀI NƯỚC ====================
    
    // ===== THÁI LAN (3 tours) =====
    {
        title: 'SIÊU KM: Bangkok - Pattaya 5N4Đ',
        description: 'Tour Thái Lan giá siêu rẻ. Buffet Baiyoke Sky 84 tầng, show Alcazar, chùa Vàng và chợ nổi Damnoen Saduak.',
        destination: 'Bangkok - Pattaya',
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
        country: 'Thái Lan',
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
        title: 'Phuket - Vịnh Phang Nga 5N4Đ',
        description: 'Đảo ngọc Phuket: Bãi biển Patong, đảo Phi Phi, vịnh Phang Nga, show Fantasea và chùa Wat Chalong.',
        destination: 'Phuket - Phang Nga',
        duration: 5,
        price: 8990000,
        maxGroupSize: 25,
        difficulty: 'easy',
        images: [
            'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800',
            'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800'
        ],
        tourCode: 'PHUKET-5D4N',
        startDates: [new Date('2025-01-15'), new Date('2025-02-18'), new Date('2025-03-20')],
        departures: generateDepartures(8990000),
        itinerary: generateItinerary(5, 'Phuket'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [98.3923, 7.8804],
            address: 'Phuket, Thailand',
            description: 'Sân bay quốc tế Phuket'
        },
        locations: [{
            type: 'Point',
            coordinates: [98.3923, 7.8804],
            address: 'Patong Beach',
            description: 'Bãi biển Patong',
            day: 1
        }],
        rating: 4.8,
        ratingsQuantity: 198,
        category: 'Beach & Island',
        featured: true,
        isInternational: true,
        isPromotional: false,
        country: 'Thái Lan',
        includes: [
            'Vé máy bay khứ hồi',
            'Khách sạn 4* gần biển',
            'Tour 4 đảo Phi Phi',
            'Bữa ăn theo chương trình',
            'Hướng dẫn viên tiếng Việt'
        ],
        excludes: [
            'Chi phí cá nhân',
            'Massage & Spa',
            'Tiền tip'
        ]
    },
    {
        title: 'Chiang Mai - Chiang Rai 4N3Đ',
        description: 'Miền Bắc Thái Lan: Đền Trắng Wat Rong Khun, Golden Triangle, làng thổ dân cổ dài và chợ đêm Chiang Mai.',
        destination: 'Chiang Mai - Chiang Rai',
        duration: 4,
        price: 7490000,
        maxGroupSize: 20,
        difficulty: 'easy',
        images: [
            'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800'
        ],
        tourCode: 'CHIANG-MAI-4D3N',
        startDates: [new Date('2025-02-05'), new Date('2025-03-10'), new Date('2025-04-08')],
        departures: generateDepartures(7490000),
        itinerary: generateItinerary(4, 'Chiang Mai'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [98.9853, 18.7883],
            address: 'Chiang Mai, Thailand',
            description: 'Sân bay quốc tế Chiang Mai'
        },
        locations: [{
            type: 'Point',
            coordinates: [98.9853, 18.7883],
            address: 'Doi Suthep',
            description: 'Chùa Doi Suthep',
            day: 1
        }],
        rating: 4.7,
        ratingsQuantity: 156,
        category: 'Nature & Culture',
        featured: false,
        isInternational: true,
        isPromotional: false,
        country: 'Thái Lan',
        includes: [
            'Vé máy bay khứ hồi',
            'Khách sạn 3*',
            'Bữa ăn theo chương trình',
            'Vé tham quan',
            'Hướng dẫn viên'
        ],
        excludes: [
            'Chi phí cá nhân',
            'Cưỡi voi',
            'Tiền tip'
        ]
    },
    // ===== HÀN QUỐC (3 tours) =====
    {
        title: 'Seoul - Nami - Everland 5N4Đ',
        description: 'Khám phá Hàn Quốc: Cung điện Gyeongbokgung, đảo Nami, Everland, làng Bukchon Hanok và shopping Myeongdong.',
        destination: 'Seoul - Nami - Everland',
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
        country: 'Hàn Quốc',
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
        title: 'Busan - Đảo Jeju 6N5Đ',
        description: 'Hành trình miền Nam: Busan - thành phố biển, đảo Jeju với núi Hallasan, làng Seongsan và bảo tàng gấu Teddy.',
        destination: 'Busan - Jeju',
        duration: 6,
        price: 15990000,
        maxGroupSize: 18,
        difficulty: 'easy',
        images: [
            'https://images.unsplash.com/photo-1563789031959-4c02bcb41319?w=800'
        ],
        tourCode: 'BUSAN-JEJU-6D5N',
        startDates: [new Date('2025-02-20'), new Date('2025-03-25'), new Date('2025-04-15')],
        departures: generateDepartures(15990000),
        itinerary: generateItinerary(6, 'Busan'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [129.0403, 35.1796],
            address: 'Busan, South Korea',
            description: 'Sân bay Gimhae'
        },
        locations: [{
            type: 'Point',
            coordinates: [129.0403, 35.1796],
            address: 'Gamcheon Culture Village',
            description: 'Làng văn hóa Gamcheon',
            day: 1
        }],
        rating: 4.7,
        ratingsQuantity: 145,
        category: 'Beach & Culture',
        featured: false,
        isInternational: true,
        isPromotional: false,
        country: 'Hàn Quốc',
        includes: [
            'Vé máy bay khứ hồi',
            'Vé máy bay nội địa đến Jeju',
            'Khách sạn 3-4*',
            'Bữa ăn theo chương trình',
            'Hướng dẫn viên tiếng Việt'
        ],
        excludes: [
            'Chi phí visa',
            'Chi phí cá nhân',
            'Tiền tip'
        ]
    },
    {
        title: 'Seoul Mùa Hoa Anh Đào 5N4Đ',
        description: 'Tour mùa xuân Seoul: Ngắm hoa anh đào Yeouido, lễ hội hoa Jinhae, cung Changdeokgung và N Seoul Tower.',
        destination: 'Seoul - Jinhae',
        duration: 5,
        price: 14990000,
        maxGroupSize: 20,
        difficulty: 'easy',
        images: [
            'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800'
        ],
        tourCode: 'SEOUL-SPRING-5D4N',
        startDates: [new Date('2025-03-28'), new Date('2025-04-02'), new Date('2025-04-10')],
        departures: generateDepartures(14990000),
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
            address: 'Yeouido Park',
            description: 'Công viên Yeouido',
            day: 2
        }],
        rating: 4.9,
        ratingsQuantity: 167,
        category: 'City & Nature',
        featured: true,
        isInternational: true,
        isPromotional: true,
        country: 'Hàn Quốc',
        includes: [
            'Vé máy bay khứ hồi',
            'Khách sạn 4*',
            'Bữa ăn theo chương trình',
            'Vé tham quan',
            'Hướng dẫn viên tiếng Việt'
        ],
        excludes: [
            'Chi phí visa',
            'Mua sắm',
            'Tiền tip'
        ]
    },
    // ===== NHẬT BẢN (3 tours) =====
    {
        title: 'CHÙM TOUR: Tokyo - Osaka - Kyoto 7N6Đ',
        description: 'Hành trình Nhật Bản: Tokyo Skytree, núi Phú Sĩ, Osaka Castle, chùa Vàng Kinkaku-ji và rừng tre Arashiyama.',
        destination: 'Tokyo - Osaka - Kyoto',
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
        country: 'Nhật Bản',
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
        title: 'Hokkaido Mùa Tuyết 6N5Đ',
        description: 'Hokkaido mùa đông: Sapporo Snow Festival, trượt tuyết Niseko, suối nước nóng Noboribetsu và làng cổ Otaru.',
        destination: 'Hokkaido - Sapporo',
        duration: 6,
        price: 32990000,
        maxGroupSize: 15,
        difficulty: 'medium',
        images: [
            'https://images.unsplash.com/photo-1551622108-31b1e2e0ec95?w=800'
        ],
        tourCode: 'HOKKAIDO-6D5N',
        startDates: [new Date('2025-01-20'), new Date('2025-02-10'), new Date('2025-02-20')],
        departures: generateDepartures(32990000),
        itinerary: generateItinerary(6, 'Hokkaido'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [141.3469, 43.0642],
            address: 'Sapporo, Hokkaido, Japan',
            description: 'Sân bay New Chitose'
        },
        locations: [{
            type: 'Point',
            coordinates: [141.3469, 43.0642],
            address: 'Sapporo Snow Festival',
            description: 'Lễ hội tuyết Sapporo',
            day: 2
        }],
        rating: 4.9,
        ratingsQuantity: 178,
        category: 'Winter & Adventure',
        featured: true,
        isInternational: true,
        isPromotional: false,
        country: 'Nhật Bản',
        includes: [
            'Vé máy bay khứ hồi',
            'Khách sạn 4*',
            'Vé tham quan',
            'Bữa ăn theo chương trình',
            'Hướng dẫn viên tiếng Việt'
        ],
        excludes: [
            'Chi phí visa',
            'Thuê đồ trượt tuyết',
            'Tiền tip'
        ]
    },
    {
        title: 'Tokyo - Disneyland - Phú Sĩ 5N4Đ',
        description: 'Tokyo cổ điển: Disneyland, chùa Sensoji, Shibuya, Harajuku, núi Phú Sĩ và làng Oshino Hakkai.',
        destination: 'Tokyo - Phú Sĩ',
        duration: 5,
        price: 24990000,
        maxGroupSize: 20,
        difficulty: 'easy',
        images: [
            'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800'
        ],
        tourCode: 'TOKYO-DISNEY-5D4N',
        startDates: [new Date('2025-02-15'), new Date('2025-03-20'), new Date('2025-04-18')],
        departures: generateDepartures(24990000),
        itinerary: generateItinerary(5, 'Tokyo'),
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
            address: 'Tokyo Disneyland',
            description: 'Công viên Tokyo Disneyland',
            day: 2
        }],
        rating: 4.8,
        ratingsQuantity: 234,
        category: 'Family & Entertainment',
        featured: false,
        isInternational: true,
        isPromotional: false,
        country: 'Nhật Bản',
        includes: [
            'Vé máy bay khứ hồi',
            'Khách sạn 3*',
            'Vé Disneyland 1 ngày',
            'Bữa ăn theo chương trình',
            'Hướng dẫn viên'
        ],
        excludes: [
            'Chi phí visa',
            'Chi phí cá nhân',
            'Tiền tip'
        ]
    },
    // ===== SINGAPORE & MALAYSIA (2 tours) =====
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
        country: 'Singapore - Malaysia',
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
        title: 'Singapore - Sentosa - Universal 5N4Đ',
        description: 'Đảo quốc sư tử: Merlion Park, Gardens by the Bay, Night Safari, Universal Studios và Resort World Sentosa.',
        destination: 'Singapore',
        duration: 5,
        price: 16990000,
        maxGroupSize: 18,
        difficulty: 'easy',
        images: [
            'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800'
        ],
        tourCode: 'SINGAPORE-5D4N',
        startDates: [new Date('2025-02-08'), new Date('2025-03-12'), new Date('2025-04-20')],
        departures: generateDepartures(16990000),
        itinerary: generateItinerary(5, 'Singapore'),
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
            address: 'Sentosa Island',
            description: 'Đảo Sentosa',
            day: 2
        }],
        rating: 4.8,
        ratingsQuantity: 198,
        category: 'Family & Entertainment',
        featured: true,
        isInternational: true,
        isPromotional: false,
        country: 'Singapore',
        includes: [
            'Vé máy bay khứ hồi',
            'Khách sạn 4*',
            'Vé Universal Studios',
            'Vé Night Safari',
            'Bữa ăn theo chương trình',
            'Hướng dẫn viên'
        ],
        excludes: [
            'Chi phí cá nhân',
            'Mua sắm',
            'Tiền tip'
        ]
    },
    
    // ===== ĐÀI LOAN (2 tours) =====
    {
        title: 'Đài Loan - Đài Bắc - Đài Trung 5N4Đ',
        description: 'Khám phá Đài Loan: Đài Bắc 101, thả đèn trời Thập Phần, Hồ Nhật Nguyệt và chợ đêm Phùng Giáp.',
        destination: 'Đài Bắc - Đài Trung',
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
        country: 'Đài Loan',
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
    },
    {
        title: 'Đài Loan - Cao Hùng - Thác Cái 6N5Đ',
        description: 'Miền Nam Đài Loan: Cao Hùng, làng cổ Jiufen, công viên quốc gia Taroko, thác Shifen và chùa Phật Quang Sơn.',
        destination: 'Cao Hùng - Hoa Liên',
        duration: 6,
        price: 13990000,
        maxGroupSize: 20,
        difficulty: 'easy',
        images: ['https://images.unsplash.com/photo-1588432406557-832f6fc8e3bb?w=800'],
        tourCode: 'TAIWAN-SOUTH-6D5N',
        startDates: [new Date('2025-02-25'), new Date('2025-03-22'), new Date('2025-04-28')],
        departures: generateDepartures(13990000),
        itinerary: generateItinerary(6, 'Cao Hùng'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [120.3014, 22.6273],
            address: 'Kaohsiung, Taiwan',
            description: 'Sân bay quốc tế Cao Hùng'
        },
        locations: [{
            type: 'Point',
            coordinates: [120.3014, 22.6273],
            address: 'Fo Guang Shan',
            description: 'Chùa Phật Quang Sơn',
            day: 2
        }],
        rating: 4.7,
        ratingsQuantity: 123,
        category: 'Nature & Culture',
        featured: false,
        isInternational: true,
        isPromotional: false,
        country: 'Đài Loan',
        includes: [
            'Vé máy bay khứ hồi',
            'Khách sạn 3*',
            'Bữa ăn theo chương trình',
            'Vé tham quan',
            'Hướng dẫn viên'
        ],
        excludes: [
            'Chi phí cá nhân',
            'Mua sắm',
            'Tiền tip'
        ]
    },
    
    // ===== TRUNG QUỐC (2 tours) =====
    {
        title: 'Bắc Kinh - Vạn Lý Trường Thành 5N4Đ',
        description: 'Khám phá Trung Quốc: Tử Cấm Thành, Vạn Lý Trường Thành, Thiên Đàn, Cung Mùa Hè và Lăng Minh Thập Tam.',
        destination: 'Bắc Kinh',
        duration: 5,
        price: 12990000,
        maxGroupSize: 20,
        difficulty: 'medium',
        images: ['https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800'],
        tourCode: 'BEIJING-5D4N',
        startDates: [new Date('2025-02-18'), new Date('2025-03-15'), new Date('2025-04-12')],
        departures: generateDepartures(12990000),
        itinerary: generateItinerary(5, 'Bắc Kinh'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [116.4074, 39.9042],
            address: 'Beijing, China',
            description: 'Sân bay quốc tế Bắc Kinh'
        },
        locations: [{
            type: 'Point',
            coordinates: [116.4074, 39.9042],
            address: 'Great Wall',
            description: 'Vạn Lý Trường Thành',
            day: 2
        }],
        rating: 4.8,
        ratingsQuantity: 201,
        category: 'History & Culture',
        featured: true,
        isInternational: true,
        isPromotional: false,
        country: 'Trung Quốc',
        includes: [
            'Vé máy bay khứ hồi',
            'Khách sạn 4*',
            'Bữa ăn theo chương trình',
            'Vé tham quan',
            'Hướng dẫn viên tiếng Việt'
        ],
        excludes: [
            'Chi phí visa',
            'Chi phí cá nhân',
            'Tiền tip'
        ]
    },
    {
        title: 'Thượng Hải - Tô Châu - Hàng Châu 6N5Đ',
        description: 'Miền Đông Trung Quốc: Bến Thượng Hải, vườn cổ Tô Châu, chùa Hàn Sơn, Tây Hồ và làng cổ Ô Trấn.',
        destination: 'Thượng Hải - Tô Châu',
        duration: 6,
        price: 14990000,
        maxGroupSize: 18,
        difficulty: 'easy',
        images: ['https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=800'],
        tourCode: 'SHANGHAI-6D5N',
        startDates: [new Date('2025-02-22'), new Date('2025-03-20'), new Date('2025-04-25')],
        departures: generateDepartures(14990000),
        itinerary: generateItinerary(6, 'Thượng Hải'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [121.4737, 31.2304],
            address: 'Shanghai, China',
            description: 'Sân bay Phố Đông'
        },
        locations: [{
            type: 'Point',
            coordinates: [121.4737, 31.2304],
            address: 'The Bund',
            description: 'Bến Thượng Hải',
            day: 1
        }],
        rating: 4.7,
        ratingsQuantity: 156,
        category: 'City & Culture',
        featured: false,
        isInternational: true,
        isPromotional: false,
        country: 'Trung Quốc',
        includes: [
            'Vé máy bay khứ hồi',
            'Khách sạn 4*',
            'Bữa ăn theo chương trình',
            'Vé tham quan',
            'Hướng dẫn viên'
        ],
        excludes: [
            'Chi phí visa',
            'Mua sắm',
            'Tiền tip'
        ]
    },
    
    // ===== DUBAI & CHÂU ÂU (2 tours) =====
    {
        title: 'Dubai - Abu Dhabi 5N4Đ',
        description: 'Khám phá UAE: Burj Khalifa, Dubai Mall, sa mạc Safari, Đại thánh đường Sheikh Zayed và Ferrari World.',
        destination: 'Dubai - Abu Dhabi',
        duration: 5,
        price: 24990000,
        maxGroupSize: 15,
        difficulty: 'easy',
        images: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800'],
        tourCode: 'DUBAI-5D4N',
        startDates: [new Date('2025-01-25'), new Date('2025-03-08'), new Date('2025-04-15')],
        departures: generateDepartures(24990000),
        itinerary: generateItinerary(5, 'Dubai'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [55.2708, 25.2048],
            address: 'Dubai, UAE',
            description: 'Sân bay quốc tế Dubai'
        },
        locations: [{
            type: 'Point',
            coordinates: [55.2708, 25.2048],
            address: 'Burj Khalifa',
            description: 'Tòa nhà cao nhất thế giới',
            day: 1
        }],
        rating: 4.9,
        ratingsQuantity: 289,
        category: 'Luxury & Modern',
        featured: true,
        isInternational: true,
        isPromotional: true,
        country: 'Dubai',
        includes: [
            'Vé máy bay khứ hồi',
            'Khách sạn 4-5*',
            'Bữa ăn theo chương trình',
            'Vé tham quan Burj Khalifa',
            'Safari sa mạc',
            'Hướng dẫn viên tiếng Việt'
        ],
        excludes: [
            'Chi phí visa',
            'Mua sắm',
            'Tiền tip'
        ]
    },
    {
        title: 'Châu Âu 5 Nước: Pháp - Thụy Sĩ - Ý - Đức - Áo 10N9Đ',
        description: 'Tour Châu Âu cổ điển: Paris, Alps Thụy Sĩ, Venice, Rome, Munich và Vienna với đầy đủ di sản UNESCO.',
        destination: 'Châu Âu',
        duration: 10,
        price: 79990000,
        maxGroupSize: 20,
        difficulty: 'medium',
        images: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800'],
        tourCode: 'EUROPE-10D9N',
        startDates: [new Date('2025-04-15'), new Date('2025-05-10'), new Date('2025-06-05')],
        departures: generateDepartures(79990000),
        itinerary: generateItinerary(10, 'Paris'),
        policies: generatePolicies(),
        startLocation: {
            type: 'Point',
            coordinates: [2.3522, 48.8566],
            address: 'Paris, France',
            description: 'Sân bay Charles de Gaulle'
        },
        locations: [{
            type: 'Point',
            coordinates: [2.3522, 48.8566],
            address: 'Eiffel Tower',
            description: 'Tháp Eiffel',
            day: 1
        }],
        rating: 5.0,
        ratingsQuantity: 412,
        category: 'Cultural Heritage',
        featured: true,
        isInternational: true,
        isPromotional: false,
        country: 'Châu Âu',
        includes: [
            'Vé máy bay khứ hồi',
            'Khách sạn 4*',
            'Bữa ăn theo chương trình',
            'Vé tham quan bảo tàng',
            'Hướng dẫn viên tiếng Việt',
            'Bảo hiểm quốc tế',
            'Visa Schengen'
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

        // Load regions, provinces và countries trước
        console.log('📥 Đang load regions, provinces và countries...');
        const regions = await Region.find({});
        const provinces = await Province.find({});
        const countries = await Country.find({});
        
        if (regions.length === 0 || provinces.length === 0) {
            console.error('❌ Chưa có regions/provinces. Chạy seed-regions-provinces.ts trước!');
            process.exit(1);
        }
        
        if (countries.length === 0) {
            console.error('❌ Chưa có countries. Chạy seed-countries.ts trước!');
            process.exit(1);
        }
        
        console.log(`✅ Đã load ${regions.length} regions, ${provinces.length} provinces và ${countries.length} countries\n`);

        // Tạo map để dễ tra cứu
        const regionMap = new Map();
        const provinceMap = new Map();
        const countryMap = new Map();
        
        regions.forEach(r => regionMap.set(r.name, r._id));
        provinces.forEach(p => provinceMap.set(p.name, p._id));
        countries.forEach(c => countryMap.set(c.name, c._id));

        // Cập nhật tours với ObjectId
        const toursWithIds = completeTours.map(tour => {
            if (!tour.isInternational) {
                return {
                    ...tour,
                    region: regionMap.get(tour.region as any),
                    province: provinceMap.get(tour.province as any)
                };
            } else {
                return {
                    ...tour,
                    country: countryMap.get(tour.country as any)
                };
            }
        });

        // Xóa toàn bộ dữ liệu cũ
        console.log('🗑️  Đang xóa dữ liệu cũ...');
        await Tour.deleteMany({});
        console.log('✅ Đã xóa toàn bộ tours cũ\n');

        // Insert tours mới
        console.log('📝 Đang insert tours mới...');
        const inserted = await Tour.insertMany(toursWithIds);
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
