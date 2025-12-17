import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Tour } from '../app/entities/Tour';

dotenv.config();

// Helper function to generate tour code
const generateTourCode = (destination: string, duration: number) => {
  const code = destination
    .split(',')[0]
    .toUpperCase()
    .replace(/\s+/g, '-')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  return `${code}-${duration}D${duration - 1}N`;
};

// Helper function to generate departures
const generateDepartures = (basePrice: number) => [
  {
    startDate: new Date('2025-03-15'),
    endDate: new Date(new Date('2025-03-15').getTime() + 86400000 * 3),
    availableSeats: Math.floor(Math.random() * 20) + 15,
    pricing: {
      adult: Math.round(basePrice * 0.9),
      child: Math.round(basePrice * 0.45),
      infant: Math.round(basePrice * 0.25)
    }
  },
  {
    startDate: new Date('2025-04-20'),
    endDate: new Date(new Date('2025-04-20').getTime() + 86400000 * 3),
    availableSeats: Math.floor(Math.random() * 25) + 20,
    pricing: {
      adult: basePrice,
      child: Math.round(basePrice * 0.5),
      infant: Math.round(basePrice * 0.25)
    }
  }
];

// Helper function to generate basic itinerary
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
        meals: ['Sáng'],
        accommodation: undefined
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

// Helper function to generate policies
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

// Tours Việt Nam + Quốc tế
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
    tourCode: 'NHA-TRANG-4D3N',
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
    featured: false,
    departures: [
      {
        startDate: new Date('2025-03-15'),
        endDate: new Date('2025-03-18'),
        availableSeats: 25,
        pricing: {
          adult: 3990000,
          child: 1995000,
          infant: 1000000
        }
      },
      {
        startDate: new Date('2025-04-20'),
        endDate: new Date('2025-04-23'),
        availableSeats: 30,
        pricing: {
          adult: 4200000,
          child: 2100000,
          infant: 1050000
        }
      }
    ],
    itinerary: [
      {
        day: 1,
        title: 'TP. HỒ CHÍ MINH - NHA TRANG',
        description: 'Buổi sáng: Xe đón quý khách tại điểm hẹn, khởi hành đi Nha Trang. Dọc đường ngắm cảnh núi non hùng vĩ. Buổi trưa: Dùng bữa trưa tại nhà hàng. Buổi chiều: Đến Nha Trang, nhận phòng khách sạn. Tự do tắm biển, dạo phố.',
        meals: ['Sáng', 'Trưa', 'Chiều'],
        accommodation: 'Khách sạn 3* tại Nha Trang'
      },
      {
        day: 2,
        title: 'NHA TRANG - ĐẢO',
        description: 'Buổi sáng: Sau khi ăn sáng, xe đưa đoàn đến bến tàu. Khởi hành tham quan 4 đảo. Tham quan Bảo tàng Hải dương học, ngắm san hô và các loài cá biển. Buổi trưa: Dùng cơm trưa trên tàu. Tắm biển, vui chơi thể thao nước.',
        meals: ['Sáng', 'Trưa', 'Chiều'],
        accommodation: 'Khách sạn 3* tại Nha Trang'
      },
      {
        day: 3,
        title: 'NHA TRANG - I RESORT',
        description: 'Buổi sáng: Sau bữa sáng, xe đưa quý khách đến Trung tâm Suối khoáng nóng I-Resort Nha Trang. Tại đây, quý khách có thể thư giãn và tận hưởng...',
        meals: ['Sáng', 'Trưa'],
        accommodation: 'Khách sạn 3* tại Nha Trang'
      },
      {
        day: 4,
        title: 'NHA TRANG - TP. HỒ CHÍ MINH',
        description: 'Buổi sáng: Dùng điểm tâm sáng tại khách sạn. Trả phòng, tự do mua sắm đặc sản. Xe đưa đoàn khởi hành về TP.HCM. Kết thúc chương trình tour.',
        meals: ['Sáng'],
        accommodation: undefined
      }
    ],
    policies: {
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
        'Tour nước ngoài: áp dụng từ Dưới 2 tuổi',
        'Tour trong nước: áp dụng từ 2 đến 5 tuổi'
      ]
    }
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
  },

  // ============ TOURS QUỐC TẾ ============

  // CHÂU Á
  {
    title: 'Bangkok - Pattaya 5 Ngày 4 Đêm',
    description: 'Khám phá thủ đô Bangkok sôi động, chùa Vàng, chợ nổi, và thành phố biển Pattaya. Thưởng thức ẩm thực đường phố Thái Lan và mua sắm tại các khu chợ nổi tiếng.',
    destination: 'Thái Lan',
    duration: 5,
    price: 8900000,
    maxGroupSize: 25,
    difficulty: 'easy',
    images: [
      'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800',
      'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800'
    ],
    startLocation: {
      type: 'Point',
      coordinates: [100.5018, 13.7563],
      address: 'Bangkok, Thailand',
      description: 'Sân bay Suvarnabhumi'
    },
    locations: [
      {
        type: 'Point',
        coordinates: [100.5018, 13.7563],
        address: 'Wat Arun',
        description: 'Chùa Bình Minh',
        day: 1
      },
      {
        type: 'Point',
        coordinates: [100.8825, 12.9236],
        address: 'Pattaya Beach',
        description: 'Bãi biển Pattaya',
        day: 3
      }
    ],
    rating: 4.7,
    ratingsQuantity: 245,
    category: 'City & Culture',
    featured: true
  },

  {
    title: 'Seoul - Jeju 6 Ngày 5 Đêm',
    description: 'Trải nghiệm văn hóa K-pop tại Seoul, thăm cung điện Gyeongbokgung, làng Bukchon Hanok. Bay đến đảo Jeju - thiên đường nghỉ dưỡng với núi Hallasan và bãi biển tuyệt đẹp.',
    destination: 'Hàn Quốc',
    duration: 6,
    price: 18500000,
    maxGroupSize: 20,
    difficulty: 'easy',
    images: [
      'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800',
      'https://images.unsplash.com/photo-1583854229275-27663f5d44b4?w=800'
    ],
    startLocation: {
      type: 'Point',
      coordinates: [126.9780, 37.5665],
      address: 'Seoul, South Korea',
      description: 'Sân bay Incheon'
    },
    locations: [
      {
        type: 'Point',
        coordinates: [126.9780, 37.5665],
        address: 'Gyeongbokgung Palace',
        description: 'Cung điện Gyeongbokgung',
        day: 2
      },
      {
        type: 'Point',
        coordinates: [126.5312, 33.4996],
        address: 'Jeju Island',
        description: 'Đảo Jeju',
        day: 4
      }
    ],
    rating: 4.9,
    ratingsQuantity: 312,
    category: 'City & Culture',
    featured: true
  },

  {
    title: 'Tokyo - Osaka - Kyoto 7 Ngày 6 Đêm',
    description: 'Hành trình khám phá Nhật Bản: Tokyo hiện đại với tháp Tokyo Skytree, núi Ph富士, Osaka sôi động, và Kyoto cổ kính với chùa Vàng Kinkaku-ji và khu rừng tre Arashiyama.',
    destination: 'Nhật Bản',
    duration: 7,
    price: 32500000,
    maxGroupSize: 18,
    difficulty: 'medium',
    images: [
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800'
    ],
    startLocation: {
      type: 'Point',
      coordinates: [139.6917, 35.6895],
      address: 'Tokyo, Japan',
      description: 'Sân bay Narita'
    },
    locations: [
      {
        type: 'Point',
        coordinates: [139.6917, 35.6895],
        address: 'Shibuya Crossing',
        description: 'Giao lộ Shibuya',
        day: 1
      },
      {
        type: 'Point',
        coordinates: [135.7681, 35.0116],
        address: 'Kinkaku-ji Temple',
        description: 'Chùa Vàng Kyoto',
        day: 5
      }
    ],
    rating: 4.9,
    ratingsQuantity: 428,
    category: 'City & Culture',
    featured: true
  },

  {
    title: 'Singapore 4 Ngày 3 Đêm',
    description: 'Khám phá đảo quốc sư tử với Gardens by the Bay, Marina Bay Sands, Sentosa Island, Little India và Chinatown. Thưởng thức ẩm thực đa văn hóa tại hawker centers.',
    destination: 'Singapore',
    duration: 4,
    price: 12800000,
    maxGroupSize: 20,
    difficulty: 'easy',
    images: [
      'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800',
      'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=800'
    ],
    startLocation: {
      type: 'Point',
      coordinates: [103.8198, 1.3521],
      address: 'Singapore',
      description: 'Sân bay Changi'
    },
    locations: [
      {
        type: 'Point',
        coordinates: [103.8198, 1.3521],
        address: 'Marina Bay',
        description: 'Marina Bay Sands',
        day: 1
      }
    ],
    rating: 4.8,
    ratingsQuantity: 256,
    category: 'City & Culture',
    featured: false
  },

  {
    title: 'Bali 6 Ngày 5 Đêm',
    description: 'Thiên đường nhiệt đới Indonesia: ruộng bậc thang Tegalalang, đền Tanah Lot, bãi biển Seminyak, rừng khỉ Ubud. Trải nghiệm spa truyền thống Bali và yoga retreat.',
    destination: 'Indonesia',
    duration: 6,
    price: 14500000,
    maxGroupSize: 22,
    difficulty: 'easy',
    images: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
      'https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=800'
    ],
    startLocation: {
      type: 'Point',
      coordinates: [115.1889, -8.4095],
      address: 'Bali, Indonesia',
      description: 'Sân bay Ngurah Rai'
    },
    locations: [
      {
        type: 'Point',
        coordinates: [115.2809, -8.5069],
        address: 'Tanah Lot',
        description: 'Đền Tanah Lot',
        day: 2
      }
    ],
    rating: 4.7,
    ratingsQuantity: 198,
    category: 'Beach & Islands',
    featured: false
  },

  // CHÂU ÂU
  {
    title: 'Paris - Swiss Alps 7 Ngày 6 Đêm',
    description: 'Khám phá kinh đô ánh sáng Paris: tháp Eiffel, Louvre, Versailles. Tiếp tục hành trình đến Thụy Sĩ với núi Jungfraujoch, thị trấn Interlaken và hồ Lucerne tuyệt đẹp.',
    destination: 'Pháp - Thụy Sĩ',
    duration: 7,
    price: 58900000,
    maxGroupSize: 15,
    difficulty: 'medium',
    images: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
      'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800'
    ],
    startLocation: {
      type: 'Point',
      coordinates: [2.3522, 48.8566],
      address: 'Paris, France',
      description: 'Sân bay Charles de Gaulle'
    },
    locations: [
      {
        type: 'Point',
        coordinates: [2.2945, 48.8584],
        address: 'Eiffel Tower',
        description: 'Tháp Eiffel',
        day: 1
      },
      {
        type: 'Point',
        coordinates: [7.9575, 46.5197],
        address: 'Jungfraujoch',
        description: 'Nóc nhà châu Âu',
        day: 5
      }
    ],
    rating: 4.9,
    ratingsQuantity: 385,
    category: 'City & Culture',
    featured: true
  },

  {
    title: 'Rome - Venice - Florence 8 Ngày 7 Đêm',
    description: 'Hành trình qua ba viên ngọc nước Ý: Rome với Colosseum và Vatican, Venice lãng mạn với thuyền gondola, Florence - nôi phục hưng văn hóa với tượng David và Duomo.',
    destination: 'Ý',
    duration: 8,
    price: 62500000,
    maxGroupSize: 18,
    difficulty: 'medium',
    images: [
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
      'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800'
    ],
    startLocation: {
      type: 'Point',
      coordinates: [12.4964, 41.9028],
      address: 'Rome, Italy',
      description: 'Sân bay Fiumicino'
    },
    locations: [
      {
        type: 'Point',
        coordinates: [12.4924, 41.8902],
        address: 'Colosseum',
        description: 'Đấu trường La Mã',
        day: 1
      },
      {
        type: 'Point',
        coordinates: [12.3155, 45.4408],
        address: 'Venice',
        description: 'Quảng trường St. Mark',
        day: 4
      }
    ],
    rating: 4.8,
    ratingsQuantity: 341,
    category: 'City & Culture',
    featured: true
  },

  // CHÂU MỸ
  {
    title: 'New York - Washington DC 6 Ngày 5 Đêm',
    description: 'Khám phá bờ Đông nước Mỹ: New York với tượng Nữ thần Tự do, Times Square, Central Park. Thăm thủ đô Washington DC với Nhà Trắng, tượng đài Lincoln.',
    destination: 'Hoa Kỳ',
    duration: 6,
    price: 68000000,
    maxGroupSize: 20,
    difficulty: 'easy',
    images: [
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800'
    ],
    startLocation: {
      type: 'Point',
      coordinates: [-74.0060, 40.7128],
      address: 'New York, USA',
      description: 'Sân bay JFK'
    },
    locations: [
      {
        type: 'Point',
        coordinates: [-74.0445, 40.6892],
        address: 'Statue of Liberty',
        description: 'Tượng Nữ thần Tự do',
        day: 2
      }
    ],
    rating: 4.8,
    ratingsQuantity: 289,
    category: 'City & Culture',
    featured: false
  },

  {
    title: 'Cancun - Tulum 5 Ngày 4 Đêm',
    description: 'Thiên đường biển Caribe Mexico: bãi biển cát trắng Cancun, khu di tích Maya tại Tulum và Chichen Itza. Lặn biển ngắm san hô và cenotes huyền bí.',
    destination: 'Mexico',
    duration: 5,
    price: 45000000,
    maxGroupSize: 18,
    difficulty: 'easy',
    images: [
      'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800',
      'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800'
    ],
    startLocation: {
      type: 'Point',
      coordinates: [-86.8515, 21.1619],
      address: 'Cancun, Mexico',
      description: 'Cancun Hotel Zone'
    },
    locations: [
      {
        type: 'Point',
        coordinates: [-87.4653, 20.2114],
        address: 'Tulum',
        description: 'Khu di tích Maya',
        day: 3
      }
    ],
    rating: 4.7,
    ratingsQuantity: 167,
    category: 'Beach & Islands',
    featured: false
  },

  // CHÂU ÚC
  {
    title: 'Sydney - Melbourne 7 Ngày 6 Đêm',
    description: 'Tour Úc: Sydney Opera House, cầu Harbour Bridge, bãi biển Bondi. Melbourne với nghệ thuật đường phố, Great Ocean Road và 12 Apostles. Gặp gỡ kangaroo và koala.',
    destination: 'Úc',
    duration: 7,
    price: 72000000,
    maxGroupSize: 16,
    difficulty: 'medium',
    images: [
      'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800',
      'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800'
    ],
    startLocation: {
      type: 'Point',
      coordinates: [151.2093, -33.8688],
      address: 'Sydney, Australia',
      description: 'Sân bay Sydney'
    },
    locations: [
      {
        type: 'Point',
        coordinates: [151.2153, -33.8568],
        address: 'Sydney Opera House',
        description: 'Nhà hát Opera Sydney',
        day: 1
      }
    ],
    rating: 4.9,
    ratingsQuantity: 234,
    category: 'City & Culture',
    featured: true
  },

  // CHÂU PHI
  {
    title: 'Cairo - Luxor 6 Ngày 5 Đêm',
    description: 'Khám phá nền văn minh cổ đại Ai Cập: Kim tự tháp Giza, Sphinx, bảo tàng Ai Cập. Du thuyền sông Nile, thung lũng các vua tại Luxor với đền Karnak và Hatshepsut.',
    destination: 'Ai Cập',
    duration: 6,
    price: 38500000,
    maxGroupSize: 20,
    difficulty: 'medium',
    images: [
      'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800',
      'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800'
    ],
    startLocation: {
      type: 'Point',
      coordinates: [31.2357, 30.0444],
      address: 'Cairo, Egypt',
      description: 'Sân bay Cairo'
    },
    locations: [
      {
        type: 'Point',
        coordinates: [31.1342, 29.9792],
        address: 'Pyramids of Giza',
        description: 'Kim tự tháp Giza',
        day: 1
      }
    ],
    rating: 4.6,
    ratingsQuantity: 178,
    category: 'City & Culture',
    featured: false
  }
];

async function seedSimpleTours() {
  try {
    console.log('🚀 Đang xóa dữ liệu cũ và thêm tours Việt Nam + Quốc tế...\n');

    // Connect MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/travel_tour_db';
    await mongoose.connect(mongoUri);
    console.log('✅ Đã kết nối MongoDB:', mongoUri);

    // Xóa tất cả tours cũ
    const deleted = await Tour.deleteMany({});
    console.log(`🗑️  Đã xóa ${deleted.deletedCount} tours cũ\n`);

    // Tạo startDates và thêm data chi tiết cho mỗi tour
    const tours = sampleTours.map(tour => ({
      ...tour,
      tourCode: generateTourCode(tour.destination, tour.duration),
      startDates: [
        new Date('2024-03-15'),
        new Date('2024-04-20'),
        new Date('2024-05-25')
      ],
      departures: generateDepartures(tour.price),
      itinerary: generateItinerary(tour.duration, tour.destination.split(',')[0]),
      policies: generatePolicies(),
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
