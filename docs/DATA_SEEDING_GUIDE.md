## 🔧 Hướng dẫn Seed Database

### Thứ tự chạy Script

#### Option 1: Chạy từng script riêng lẻ
```bash
# Bước 1: Tạo Regions & Provinces
npx ts-node scripts/seed-regions-provinces.ts
# → Kết quả: 3 regions, 29 provinces

# Bước 2: Tạo Countries với slug
npx ts-node scripts/seed-countries.ts
# → Kết quả: 9 countries (8 Châu Á, 1 Châu Âu)

# Bước 3: Tạo Tours & Additional Services
npx ts-node scripts/seed-complete.ts
# → Kết quả: 48 tours (31 domestic + 17 international), 288 services
```

#### Option 2: Chạy 1 lần (RECOMMENDED ⭐)
```bash
npx ts-node scripts/seed-all.ts
# → Tự động chạy cả 3 scripts theo thứ tự
# → Kết quả: Full database ready to use
```

**Lưu ý:**
- ⚠️ Phải chạy đúng thứ tự vì tours cần regions/provinces/countries tồn tại trước
- ✅ `seed-all.ts` đảm bảo chạy đúng thứ tự tự động
- 🔄 Mỗi script sẽ xóa dữ liệu cũ trước khi insert mới

---