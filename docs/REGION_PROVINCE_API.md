# Hướng Dẫn Sử Dụng API Tours Theo Miền/Tỉnh

## 🎯 Cấu trúc đã cập nhật

### 1. Entities Mới
- **Region Entity**: Lưu thông tin 3 miền (Bắc, Trung, Nam) với image
- **Province Entity**: Lưu thông tin 29 tỉnh/thành với image + thumbnail
- **Tour Entity**: Cập nhật `region` và `province` từ String → ObjectId reference

### 2. Dữ liệu hiện tại
- **3 Regions** với images
- **29 Provinces** với images + thumbnails
- **36 Tours** (31 trong nước + 5 quốc tế)
- Mỗi region/province có tour count

---

## 📡 API Endpoints

### 1️⃣ Lấy danh sách các miền
```
GET http://localhost:5000/api/tours/regions
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "regions": [
      {
        "_id": "67xxx",
        "name": "Miền Bắc",
        "slug": "mien-bac",
        "description": "Vùng đất văn hóa nghìn năm với thủ đô Hà Nội...",
        "image": "https://images.unsplash.com/photo-1528127269322-539801943592?w=800",
        "order": 1,
        "tourCount": 11
      },
      {
        "_id": "67xxx",
        "name": "Miền Trung",
        "slug": "mien-trung",
        "description": "Vùng đất di sản với cố đô Huế, phố cổ Hội An...",
        "image": "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800",
        "order": 2,
        "tourCount": 9
      },
      {
        "_id": "67xxx",
        "name": "Miền Nam",
        "slug": "mien-nam",
        "description": "Vùng đất Nam Bộ giàu tài nguyên...",
        "image": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
        "order": 3,
        "tourCount": 11
      }
    ]
  }
}
```

---

### 2️⃣ Lấy danh sách tỉnh theo miền
```
GET http://localhost:5000/api/tours/regions/:regionSlug/provinces
```

**Ví dụ:**
```
GET http://localhost:5000/api/tours/regions/mien-bac/provinces
GET http://localhost:5000/api/tours/regions/mien-trung/provinces
GET http://localhost:5000/api/tours/regions/mien-nam/provinces
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "provinces": [
      {
        "_id": "67xxx",
        "name": "Quảng Ninh",
        "slug": "quang-ninh",
        "description": "Vịnh Hạ Long - Di sản thiên nhiên thế giới...",
        "image": "https://images.unsplash.com/photo-1528127269322-539801943592?w=800",
        "thumbnailImage": "https://images.unsplash.com/photo-1528127269322-539801943592?w=400",
        "order": 1,
        "tourCount": 2
      },
      {
        "_id": "67xxx",
        "name": "Lào Cai",
        "slug": "lao-cai",
        "description": "Sapa - Nóc nhà Đông Dương Fansipan...",
        "image": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800",
        "thumbnailImage": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400",
        "order": 2,
        "tourCount": 1
      }
    ]
  }
}
```

---

### 3️⃣ Lấy tours theo miền
```
GET http://localhost:5000/api/tours/regions/:regionSlug/tours
GET http://localhost:5000/api/tours/regions/:regionSlug/tours?limit=10
```

**Ví dụ:**
```
GET http://localhost:5000/api/tours/regions/mien-bac/tours
GET http://localhost:5000/api/tours/regions/mien-trung/tours?limit=5
GET http://localhost:5000/api/tours/regions/mien-nam/tours
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "tours": [
      {
        "_id": "67xxx",
        "title": "Du Lịch Hạ Long 3 Ngày 2 Đêm",
        "slug": "du-lich-ha-long-3-ngay-2-dem",
        "destination": "Quảng Ninh",
        "price": 4500000,
        "duration": 3,
        "rating": 4.8,
        "region": {
          "_id": "67xxx",
          "name": "Miền Bắc",
          "slug": "mien-bac",
          "image": "https://..."
        },
        "province": {
          "_id": "67xxx",
          "name": "Quảng Ninh",
          "slug": "quang-ninh",
          "image": "https://...",
          "thumbnailImage": "https://..."
        },
        "images": ["url1", "url2"],
        "highlights": ["..."],
        "departures": [...]
      }
    ]
  }
}
```

---

### 4️⃣ Lấy tours theo tỉnh
```
GET http://localhost:5000/api/tours/provinces/:provinceSlug/tours
GET http://localhost:5000/api/tours/provinces/:provinceSlug/tours?limit=10
```

**Ví dụ:**
```
GET http://localhost:5000/api/tours/provinces/quang-ninh/tours
GET http://localhost:5000/api/tours/provinces/da-nang/tours?limit=5
GET http://localhost:5000/api/tours/provinces/kien-giang/tours
```

---

## 🧪 Test trên Postman

### Test Case 1: Lấy tất cả miền
```
GET http://localhost:5000/api/tours/regions
```

### Test Case 2: Xem tỉnh Miền Bắc
```
GET http://localhost:5000/api/tours/regions/mien-bac/provinces
```

### Test Case 3: Xem tours Miền Bắc
```
GET http://localhost:5000/api/tours/regions/mien-bac/tours
```

### Test Case 4: Xem tours Quảng Ninh
```
GET http://localhost:5000/api/tours/provinces/quang-ninh/tours
```

### Test Case 5: Xem tỉnh Miền Trung
```
GET http://localhost:5000/api/tours/regions/mien-trung/provinces
```

### Test Case 6: Xem tours Đà Nẵng
```
GET http://localhost:5000/api/tours/provinces/da-nang/tours
```

### Test Case 7: Xem tỉnh Miền Nam
```
GET http://localhost:5000/api/tours/regions/mien-nam/provinces
```

### Test Case 8: Xem tours Phú Quốc (limit 5)
```
GET http://localhost:5000/api/tours/provinces/kien-giang/tours?limit=5
```

### Test Case 9: Tìm kiếm tours
```
GET http://localhost:5000/api/tours?search=hạ long
GET http://localhost:5000/api/tours?search=sapa&minPrice=3000000
```

### Test Case 10: Filter theo giá
```
GET http://localhost:5000/api/tours?minPrice=2000000&maxPrice=5000000
```

---

## ⚙️ Cách chạy Setup Database

### Bước 1: Seed Regions và Provinces (CHẠY ĐẦU TIÊN)
```bash
npx ts-node scripts/seed-regions-provinces.ts
```
✅ Tạo 3 regions + 29 provinces với images

### Bước 2: Seed Tours và Additional Services
```bash
npx ts-node scripts/seed-complete.ts
```
✅ Tạo 36 tours + 216 additional services

### Bước 3: Migrate Tour References
```bash
npx ts-node scripts/migrate-tour-references.ts
```
✅ Convert region/province từ string sang ObjectId

---

## 📊 Dữ liệu sau khi seed

### Miền Bắc (11 tours, 10 tỉnh)
- **Quảng Ninh**: Du Lịch Hạ Long 3 Ngày 2 Đêm, Hạ Long - Quảng Ninh 2N1Đ
- **Lào Cai**: SIÊU ƯU ĐÃI: Sapa - Fansipan 4N3Đ
- **Ninh Bình**: Hà Nội - Ninh Bình 2N1Đ
- **Hà Giang**: Hà Giang - Cao Bằng 5N4Đ
- **Sơn La**: Mộc Châu - Mai Châu 3N2Đ
- **Vĩnh Phúc**: Hà Nội - Tam Đảo 2N1Đ
- **Bắc Kạn**: Bắc Kạn - Hồ Ba Bể 3N2Đ
- **Điện Biên**: Điện Biên - Sơn La 4N3Đ
- **Hải Phòng**: Hải Phòng - Cát Bà 3N2Đ
- **Yên Bái**: Yên Bái - Mù Cang Chải 4N3Đ

### Miền Trung (9 tours, 9 tỉnh)
- **Đà Nẵng**: KHUYẾN MÃI: Đà Nẵng - Hội An 3N2Đ
- **Thừa Thiên Huế**: Huế - Phong Nha 4N3Đ
- **Khánh Hòa**: Nha Trang Biển Đảo 4N3Đ
- **Bình Định**: Quy Nhơn - Phú Yên 3N2Đ
- **Quảng Nam**: Quảng Nam - Hội An - Mỹ Sơn 3N2Đ
- **Quảng Bình**: Quảng Bình - Động Thiên Đường 3N2Đ
- **Quảng Trị**: Quảng Trị - DMZ 2N1Đ
- **Đắk Lắk**: Đắk Lắk - Buôn Ma Thuột 3N2Đ
- **Gia Lai**: Gia Lai - Pleiku - Biển Hồ 3N2Đ

### Miền Nam (11 tours, 10 tỉnh)
- **Kiên Giang**: Phú Quốc Đảo Ngọc 5N4Đ (2 tours), Rạch Giá - Hà Tiên 3N2Đ
- **Bà Rịa - Vũng Tàu**: TP.HCM - Vũng Tàu 2N1Đ, Côn Đảo Huyền Thoại 4N3Đ
- **Lâm Đồng**: Đà Lạt Thành Phố Ngàn Hoa 3N2Đ
- **Cần Thơ**: Cần Thơ - Miệt Vườn Sông Nước 3N2Đ
- **Bình Thuận**: Phan Thiết - Mũi Né 3N2Đ
- **An Giang**: An Giang - Châu Đốc - Núi Sam 2N1Đ
- **Tiền Giang**: Tiền Giang - Mỹ Tho - Bến Tre 2N1Đ
- **Vĩnh Long**: Vĩnh Long - Sa Đéc - Cái Bè 2N1Đ

---

## 🎨 Flow sử dụng cho Frontend

```
1. Homepage: Gọi GET /api/tours/regions
   → Hiển thị 3 miền với images

2. User click "Miền Bắc"
   → Gọi GET /api/tours/regions/mien-bac/provinces
   → Hiển thị 10 tỉnh với thumbnails

3. User click "Quảng Ninh"
   → Gọi GET /api/tours/provinces/quang-ninh/tours
   → Hiển thị 2 tours của Quảng Ninh

4. Hoặc click "Xem tất cả tours Miền Bắc"
   → Gọi GET /api/tours/regions/mien-bac/tours
   → Hiển thị 11 tours
```

---

## ✨ Tính năng nổi bật

✅ **Slug-based URLs** - SEO friendly (dùng `mien-bac` thay vì `Miền Bắc`)  
✅ **Images everywhere** - Mỗi region và province đều có image  
✅ **Tour count** - Hiển thị số lượng tours cho mỗi region/province  
✅ **Populated data** - Tours tự động include thông tin region/province  
✅ **Auto date adjustment** - Dates tự động chuyển sang năm tương lai

---

## 📝 Lưu ý

- Sử dụng **slug** cho URLs (vd: `mien-bac`, `quang-ninh`, `da-nang`)
- Không cần URL encode vì dùng slug thay vì tên có dấu
- Các API chỉ trả về tours trong nước (`isInternational: false`)
- Tours quốc tế có field `country` thay vì `region/province`
- Tất cả images từ Unsplash, có thể thay đổi trong seed scripts
