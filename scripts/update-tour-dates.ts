import mongoose from 'mongoose';
import { Tour } from '../app/entities/Tour';
import config from '../app/configs';

async function updateTourDates() {
  try {
    console.log('🔄 Đang kết nối MongoDB...');
    await mongoose.connect(config.mongodb.uri);
    console.log('✅ Đã kết nối MongoDB\n');

    // Tạo startDates mới từ 2026
    const newStartDates = [
      new Date('2026-01-15'),
      new Date('2026-02-17'),
      new Date('2026-03-20'),
      new Date('2026-04-22'),
      new Date('2026-05-18'),
      new Date('2026-06-15'),
      new Date('2026-07-20'),
      new Date('2026-08-17')
    ];

    // Update tất cả tours
    const result = await Tour.updateMany(
      {},
      { $set: { startDates: newStartDates } }
    );

    console.log(`✅ Đã cập nhật ${result.modifiedCount} tours`);
    console.log('\n📅 Các ngày khởi hành mới:');
    newStartDates.forEach(date => {
      console.log(`   - ${date.toISOString().split('T')[0]}`);
    });

  } catch (error) {
    console.error('❌ Lỗi:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Đã ngắt kết nối MongoDB');
  }
}

updateTourDates();
