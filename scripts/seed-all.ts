import { execSync } from 'child_process';

console.log('🚀 BẮT ĐẦU SEED TẤT CẢ DỮ LIỆU\n');
console.log('═══════════════════════════════════════════════════\n');

try {
    // Bước 1: Seed Regions & Provinces
    console.log('📍 BƯỚC 1/3: Seeding Regions & Provinces...\n');
    execSync('npx ts-node scripts/seed-regions-provinces.ts', { stdio: 'inherit' });
    console.log('\n✅ Hoàn thành Bước 1\n');
    console.log('═══════════════════════════════════════════════════\n');

    // Bước 2: Seed Countries
    console.log('🌍 BƯỚC 2/3: Seeding Countries...\n');
    execSync('npx ts-node scripts/seed-countries.ts', { stdio: 'inherit' });
    console.log('\n✅ Hoàn thành Bước 2\n');
    console.log('═══════════════════════════════════════════════════\n');

    // Bước 3: Seed Complete Tours
    console.log('🎯 BƯỚC 3/3: Seeding All Tours...\n');
    execSync('npx ts-node scripts/seed-complete.ts', { stdio: 'inherit' });
    console.log('\n✅ Hoàn thành Bước 3\n');
    console.log('═══════════════════════════════════════════════════\n');

    console.log('🎉 HOÀN TẤT TẤT CẢ! Database đã sẵn sàng\n');
    console.log('📊 Tổng kết:');
    console.log('   ✅ 3 Regions (Miền Bắc, Trung, Nam)');
    console.log('   ✅ 29 Provinces');
    console.log('   ✅ 9 Countries');
    console.log('   ✅ 48 Tours (31 trong nước + 17 quốc tế)');
    console.log('   ✅ 288 Additional Services\n');

} catch (error: any) {
    console.error('\n❌ LỖI KHI SEED:', error.message);
    process.exit(1);
}
