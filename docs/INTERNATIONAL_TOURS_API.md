
---
## 🧪 Test API Tours Nước Ngoài

### 📋 Checklist Test Cases

#### ✅ 1. Tất cả tours nước ngoài (17 tours)
```
http://localhost:5000/api/tours?isInternational=true
http://localhost:5000/api/tours?isInternational=true&limit=20
```
**Kỳ vọng:** 17 tours quốc tế

---

#### ✅ 2. Tours khuyến mãi nước ngoài (4 tours)
```
http://localhost:5000/api/tours/promotional?type=international
```
**Kỳ vọng:** Bangkok, Seoul Spring, Tokyo, Dubai

---

#### ✅ 3. Search theo quốc gia (Text Search)

**🔍 Tìm kiếm nâng cao:** Search text sẽ tìm trong title, description, destination, highlights VÀ cả tên country!

**Thái Lan (3 tours):**
```
# Search text - tìm trong mọi field + country name
http://localhost:5000/api/tours?search=thái lan
http://localhost:5000/api/tours?search=bangkok

# Filter chính xác theo country slug (nhanh hơn)
http://localhost:5000/api/tours?country=thai-lan
```
**Kỳ vọng:** Bangkok-Pattaya (6.99M), Phuket (8.99M), Chiang Mai (7.49M)

**Nhật Bản (3 tours):**
```
# Search text
http://localhost:5000/api/tours?search=nhật bản
http://localhost:5000/api/tours?search=tokyo

# Filter chính xác
http://localhost:5000/api/tours?country=nhat-ban
```
**Kỳ vọng:** Tokyo-Osaka-Kyoto (28.9M), Hokkaido (32.99M), Tokyo-Disneyland (24.99M)

**Hàn Quốc (3 tours):**
```
# Search text
http://localhost:5000/api/tours?search=hàn quốc
http://localhost:5000/api/tours?search=seoul

# Filter chính xác
http://localhost:5000/api/tours?country=han-quoc
```
**Kỳ vọng:** Seoul-Nami (13.5M), Busan-Jeju (15.99M), Seoul Spring (14.99M)

---

#### ✅ 4. Filter theo giá

**Giá rẻ (< 10M) - 3 tours:**
```
http://localhost:5000/api/tours?isInternational=true&maxPrice=10000000
```
**Kỳ vọng:** 3 tours Thái Lan

**Giá trung bình (10M-20M) - 10 tours:**
```
http://localhost:5000/api/tours?isInternational=true&minPrice=10000000&maxPrice=20000000
```
**Kỳ vọng:** Hàn Quốc, Singapore, Đài Loan, Trung Quốc

**Giá cao (> 20M) - 4 tours:**
```
http://localhost:5000/api/tours?isInternational=true&minPrice=20000000
```
**Kỳ vọng:** Nhật Bản, Dubai, Châu Âu

---

#### ✅ 5. Filter theo duration
```
http://localhost:5000/api/tours?isInternational=true&minDuration=5&maxDuration=6
```
**Kỳ vọng:** Tours 5N4Đ và 6N5Đ

---

#### ✅ 6. Filter theo rating
```
http://localhost:5000/api/tours?isInternational=true&minRating=4.8
```
**Kỳ vọng:** Tours chất lượng cao (rating >= 4.8)

---

#### ✅ 7. Sort theo giá
```
# Rẻ → Đắt
http://localhost:5000/api/tours?isInternational=true&sort=price

# Đắt → Rẻ
http://localhost:5000/api/tours?isInternational=true&sort=-price
```

---

#### ✅ 8. Pagination
```
http://localhost:5000/api/tours?isInternational=true&page=1&limit=5
http://localhost:5000/api/tours?isInternational=true&page=2&limit=5
```

---

#### ✅ 9. Countries API

**Tất cả countries:**
```
http://localhost:5000/api/countries
```
**Kỳ vọng:** 9 countries với tourCount

**Country theo slug:**
```
http://localhost:5000/api/countries/thai-lan
http://localhost:5000/api/countries/han-quoc
http://localhost:5000/api/countries/nhat-ban
```

**Tours của country:**
```
http://localhost:5000/api/countries/thai-lan/tours
http://localhost:5000/api/countries/nhat-ban/tours
```

**Countries theo châu lục:**
```
http://localhost:5000/api/countries/continent/Châu%20Á
http://localhost:5000/api/countries/continent/Châu%20Âu
```

---

## � Advanced Search

### Tìm kiếm toàn diện
API hỗ trợ tìm kiếm theo **tất cả các thuộc tính**:

#### 1. **Text Search** (tìm trong mọi field)
```
# Tìm "bangkok" - tìm trong title, description, highlights, country name
http://localhost:5000/api/tours?search=bangkok

# Tìm "biển" - tìm trong title, description, highlights
http://localhost:5000/api/tours?search=biển

# Tìm "miền bắc" - tìm cả trong region name
http://localhost:5000/api/tours?search=miền bắc
```

#### 2. **Filter chính xác** (nhanh hơn)
```
# Filter theo country slug
http://localhost:5000/api/tours?country=thai-lan

# Filter theo region slug  
http://localhost:5000/api/tours?region=mien-bac

# Filter theo province slug
http://localhost:5000/api/tours?province=ha-noi
```

#### 3. **Kết hợp nhiều filters**
```
# Thái Lan + 4-5 ngày + giá tăng dần
http://localhost:5000/api/tours?country=thai-lan&minDuration=4&maxDuration=5&sort=price

# Nước ngoài + rating cao + giá 10M-20M
http://localhost:5000/api/tours?isInternational=true&minRating=4.8&minPrice=10000000&maxPrice=20000000

# Miền Bắc + featured + giá < 5M
http://localhost:5000/api/tours?region=mien-bac&featured=true&maxPrice=5000000
```

📖 **Chi tiết đầy đủ:** Xem [SEARCH_API.md](SEARCH_API.md)

---

## 📝 Tổng kết

### Database Structure
- ✅ **9 countries** với slug tiếng Việt (thai-lan, han-quoc, nhat-ban...)
- ✅ **17 tours nước ngoài** linked với countries qua ObjectId
- ✅ **4 tours khuyến mãi** (Bangkok, Seoul Spring, Tokyo, Dubai)
- ✅ **10 tours featured** (có ⭐)

### API Features
- ✅ **4 Countries API endpoints** (list, detail, tours, by continent)
- ✅ **Advanced Search** - Tìm theo tên, region, province, country, price, duration, rating
- ✅ **Full Tour filtering** (search, price, duration, rating, sort, pagination)
- ✅ **Field đặc biệt**: `country` (ObjectId) thay vì `region/province`
- ✅ **Giá từ 6.99M đến 79.99M** VND
- ✅ **Duration từ 4 đến 10 ngày**

### Seed Scripts
- ✅ **seed-all.ts** - Master script chạy tất cả theo thứ tự
- ✅ **seed-countries.ts** - Tạo countries với slug bằng slugify
- ✅ **seed-complete.ts** - Map country names → ObjectIds

### Điểm nổi bật
- 🎯 Mỗi quốc gia có nhiều lựa chọn tour (2-3 tours/country)
- 🎯 Đa dạng mức giá phù hợp nhiều đối tượng
- 🎯 Phân loại theo theme: city, beach, culture, winter, family, luxury
- 🎯 Tours cao cấp: Dubai, Nhật Bản, Châu Âu
