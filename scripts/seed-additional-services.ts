import mongoose from 'mongoose';
import { Tour } from '../app/entities/Tour';
import { AdditionalService } from '../app/entities/AdditionalService';
import config from '../app/configs';

const seedAdditionalServices = async () => {
  try {
    await mongoose.connect(config.mongodb.uri);
    console.log('Connected to MongoDB');

    // Xóa dữ liệu cũ
    await AdditionalService.deleteMany({});
    console.log('Cleared additional services');

    // Lấy tất cả tours
    const tours = await Tour.find();
    if (!tours || tours.length === 0) {
      console.log('No tour found. Please seed tours first.');
      return;
    }

    console.log(`Found ${tours.length} tours. Creating services for all tours...`);

    // Template dịch vụ cộng thêm chung (tên và mô tả chung)
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

    // Tạo services cho tất cả tours với giá khác nhau
    const allServices = [];
    for (const tour of tours) {
      // Hệ số giá dựa trên giá tour (tour đắt hơn thì services cũng đắt hơn)
      const priceRatio = tour.price / 10000000; // Normalize theo 10 triệu
      const multiplier = Math.max(0.7, Math.min(1.5, priceRatio)); // Giới hạn từ 0.7x đến 1.5x
      
      for (const template of serviceTemplates) {
        const adjustedPrice = Math.round(template.basePrice * multiplier / 10000) * 10000; // Làm tròn đến 10k
        
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
    console.log(`\nCreated ${allServices.length} additional services (${serviceTemplates.length} services x ${tours.length} tours)`);

    // Hiển thị danh sách theo tour
    console.log('\nServices by Tour:');
    for (const tour of tours) {
      const services = await AdditionalService.find({ tour: tour._id });
      console.log(`\n${tour.title} (${services.length} services):`);
      services.forEach((service) => {
        console.log(`  - ${service.name}: ${service.price.toLocaleString('vi-VN')} ${service.unit}`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding additional services:', error);
    process.exit(1);
  }
};

seedAdditionalServices();
