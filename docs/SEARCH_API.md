# 🔍 API Tìm Kiếm Tours (Advanced Search)

## Tổng quan

API tìm kiếm nâng cao cho phép client tìm tours theo **tất cả các thuộc tính** có thể, bao gồm:
- 📝 Tên tour, mô tả, điểm đến
- 🗺️ Miền (Region)
- 🏙️ Tỉnh/Thành phố (Province)
- 🌍 Quốc gia (Country)
- 💰 Giá, độ khó, thời lượng, rating
- 🎯 Category, featured, international/domestic

---

## 📡 Endpoint

```
GET /api/tours
```

---

## 🔑 Query Parameters

### 1. **Search Text** (tìm toàn văn)

| Parameter | Type | Mô tả |
|-----------|------|-------|
| `search` | string | Tìm trong title, description, destination, category, highlights, region name, province name, country name |

**Ví dụ:**
```
# Tìm tour có chữ "Hạ Long"
GET /api/tours?search=hạ long

# Tìm tour có "biển"
GET /api/tours?search=biển

# Tìm tour ở "Miền Bắc" (tìm theo tên region)
GET /api/tours?search=miền bắc

# Tìm tour ở "Đà Nẵng" (tìm theo tên province)
GET /api/tours?search=đà nẵng

# Tìm tour "Thái Lan" (tìm theo tên country)
GET /api/tours?search=thái lan
```

---

### 2. **Filter theo Location**

| Parameter | Type | Mô tả |
|-----------|------|-------|
| `region` | string | Tìm theo slug hoặc tên miền (mien-bac, Miền Bắc) |
| `province` | string | Tìm theo slug hoặc tên tỉnh (ha-noi, Hà Nội) |
| `country` | string | Tìm theo slug hoặc tên quốc gia (thai-lan, Thái Lan) |

**Ví dụ:**
```
# Tours ở Miền Bắc
GET /api/tours?region=mien-bac
GET /api/tours?region=Miền Bắc

# Tours ở Hà Nội
GET /api/tours?province=ha-noi
GET /api/tours?province=Hà Nội

# Tours ở Thái Lan
GET /api/tours?country=thai-lan
GET /api/tours?country=Thái Lan
```

---

### 3. **Filter theo Price**

| Parameter | Type | Mô tả |
|-----------|------|-------|
| `minPrice` | number | Giá tối thiểu (VND) |
| `maxPrice` | number | Giá tối đa (VND) |

**Ví dụ:**
```
# Tours từ 2M đến 5M
GET /api/tours?minPrice=2000000&maxPrice=5000000

# Tours dưới 3M
GET /api/tours?maxPrice=3000000

# Tours trên 10M
GET /api/tours?minPrice=10000000
```

---

### 4. **Filter theo Duration**

| Parameter | Type | Mô tả |
|-----------|------|-------|
| `minDuration` | number | Thời lượng tối thiểu (ngày) |
| `maxDuration` | number | Thời lượng tối đa (ngày) |

**Ví dụ:**
```
# Tours từ 3-5 ngày
GET /api/tours?minDuration=3&maxDuration=5

# Tours dài >= 7 ngày
GET /api/tours?minDuration=7
```

---

### 5. **Filter theo Rating**

| Parameter | Type | Mô tả |
|-----------|------|-------|
| `minRating` | number | Rating tối thiểu (0-5) |

**Ví dụ:**
```
# Tours rating >= 4.5
GET /api/tours?minRating=4.5

# Tours rating >= 4.8
GET /api/tours?minRating=4.8
```

---

### 6. **Filter theo Type**

| Parameter | Type | Mô tả |
|-----------|------|-------|
| `isInternational` | boolean | true = nước ngoài, false = trong nước |
| `featured` | boolean | true = tours nổi bật |
| `category` | string | Loại tour (Beach, Mountain, City, etc.) |
| `difficulty` | string | Độ khó (easy, medium, difficult) |

**Ví dụ:**
```
# Chỉ tours nước ngoài
GET /api/tours?isInternational=true

# Chỉ tours trong nước
GET /api/tours?isInternational=false

# Tours featured
GET /api/tours?featured=true

# Tours biển
GET /api/tours?category=Beach

# Tours dễ
GET /api/tours?difficulty=easy
```

---

### 7. **Pagination & Sorting**

| Parameter | Type | Mô tả |
|-----------|------|-------|
| `page` | number | Trang hiện tại (default: 1) |
| `limit` | number | Số tours/trang (default: 10) |
| `sort` | string | Sắp xếp: `price`, `-price`, `rating`, `-rating`, `duration`, `-createdAt` |

**Ví dụ:**
```
# Trang 2, mỗi trang 20 tours
GET /api/tours?page=2&limit=20

# Sắp xếp giá tăng dần
GET /api/tours?sort=price

# Sắp xếp giá giảm dần
GET /api/tours?sort=-price

# Sắp xếp theo rating cao nhất
GET /api/tours?sort=-rating
```

---

## 🎯 Ví dụ Tìm Kiếm Kết Hợp

### 1. Tours biển ở Miền Trung, giá dưới 5M
```
GET /api/tours?region=mien-trung&category=Beach&maxPrice=5000000
```

### 2. Tours nước ngoài rating cao (>= 4.8), giá 10M-20M
```
GET /api/tours?isInternational=true&minRating=4.8&minPrice=10000000&maxPrice=20000000
```

### 3. Tours Thái Lan, 4-5 ngày, giá rẻ
```
GET /api/tours?country=thai-lan&minDuration=4&maxDuration=5&maxPrice=10000000&sort=price
```

### 4. Tìm "Sapa" trong tất cả tours
```
GET /api/tours?search=sapa
```
**Kết quả:** Tìm trong title, description, destination, highlights, và cả tên tỉnh (Lào Cai có tours Sapa)

### 5. Tours ở Hà Nội, featured, sắp xếp theo rating
```
GET /api/tours?province=ha-noi&featured=true&sort=-rating
```

### 6. Tours núi, khó, thời lượng >= 5 ngày
```
GET /api/tours?category=Mountain&difficulty=difficult&minDuration=5
```

---

## 📊 Response Format

```json
{
  "status": "success",
  "data": {
    "tours": [
      {
        "_id": "67xxx",
        "title": "Du Lịch Hạ Long 3 Ngày 2 Đêm",
        "slug": "du-lich-ha-long-3-ngay-2-dem",
        "destination": "Vịnh Hạ Long",
        "price": 3500000,
        "duration": 3,
        "rating": 4.8,
        "category": "Beach",
        "difficulty": "easy",
        "isInternational": false,
        "featured": true,
        "region": {
          "_id": "67xxx",
          "name": "Miền Bắc",
          "slug": "mien-bac"
        },
        "province": {
          "_id": "67xxx",
          "name": "Quảng Ninh",
          "slug": "quang-ninh"
        },
        "country": null,
        "images": ["url1", "url2"],
        "highlights": [
          "Vịnh Hạ Long - Di sản thế giới",
          "Hang Sửng Sốt",
          "Đảo Titop"
        ]
      }
    ],
    "total": 48,
    "page": 1,
    "totalPages": 5
  }
}
```

---

## 🚀 Use Cases

### 1. **Trang chủ - Search bar**
```javascript
// User gõ "hạ long" vào search bar
fetch('/api/tours?search=hạ long&limit=20')
```

### 2. **Filter sidebar - Tours trong nước**
```javascript
// User chọn: Miền Bắc, giá < 5M, rating > 4.5
fetch('/api/tours?region=mien-bac&maxPrice=5000000&minRating=4.5&isInternational=false')
```

### 3. **Tours theo tỉnh**
```javascript
// User click vào tỉnh "Đà Nẵng"
fetch('/api/tours?province=da-nang&sort=-rating')
```

### 4. **Tours nước ngoài theo quốc gia**
```javascript
// User xem tours Thái Lan
fetch('/api/tours?country=thai-lan&sort=price')
```

### 5. **Advanced search form**
```javascript
// User điền form phức tạp
const params = new URLSearchParams({
  category: 'Beach',
  minPrice: '3000000',
  maxPrice: '8000000',
  minDuration: '3',
  maxDuration: '5',
  minRating: '4.5',
  isInternational: 'false',
  sort: '-rating',
  page: '1',
  limit: '12'
});
fetch(`/api/tours?${params}`)
```

---

## ⚡ Performance Notes

### Optimizations
- ✅ **Indexes**: Region, Province, Country có index trên name & slug
- ✅ **Populate**: Chỉ lấy fields cần thiết (name, slug, image)
- ✅ **Search**: Sử dụng regex với $options: 'i' (case-insensitive)
- ✅ **Pagination**: Limit mặc định 10 để tránh quá tải

### Best Practices
- 🎯 Dùng **slug** thay vì name khi có thể (nhanh hơn)
- 🎯 Kết hợp **filters** thay vì search text rộng (hiệu quả hơn)
- 🎯 Sử dụng **pagination** với limit hợp lý (10-20)
- 🎯 Cache kết quả search phổ biến ở frontend

---

## 🔍 Search Logic

### Search Text (`?search=...`)
Tìm trong các trường sau theo thứ tự ưu tiên:

1. **Tour fields:**
   - `title` - Tên tour
   - `description` - Mô tả chi tiết
   - `destination` - Điểm đến
   - `category` - Loại tour
   - `highlights` - Điểm nổi bật (array)
   - `included` - Bao gồm (array)
   - `excluded` - Không bao gồm (array)

2. **Related collections:**
   - `region.name` - Tên miền
   - `region.description` - Mô tả miền
   - `province.name` - Tên tỉnh
   - `province.description` - Mô tả tỉnh
   - `country.name` - Tên quốc gia
   - `country.description` - Mô tả quốc gia

**Example:**
```
GET /api/tours?search=biển

Tìm thấy:
- Tours có "biển" trong title: "Du lịch biển Nha Trang"
- Tours có "biển" trong description: "Tận hưởng bãi biển tuyệt đẹp..."
- Tours có "biển" trong highlights: ["Tắm biển tại Đảo Ngọc"]
- Tours ở province có "biển": "Khánh Hòa - Biển Nha Trang"
```

---

## 📝 Example Frontend Implementation

```javascript
// Search component
const searchTours = async (searchParams) => {
  const params = new URLSearchParams();
  
  // Text search
  if (searchParams.search) {
    params.append('search', searchParams.search);
  }
  
  // Location filters
  if (searchParams.region) {
    params.append('region', searchParams.region);
  }
  if (searchParams.province) {
    params.append('province', searchParams.province);
  }
  if (searchParams.country) {
    params.append('country', searchParams.country);
  }
  
  // Price range
  if (searchParams.minPrice) {
    params.append('minPrice', searchParams.minPrice);
  }
  if (searchParams.maxPrice) {
    params.append('maxPrice', searchParams.maxPrice);
  }
  
  // Duration
  if (searchParams.minDuration) {
    params.append('minDuration', searchParams.minDuration);
  }
  if (searchParams.maxDuration) {
    params.append('maxDuration', searchParams.maxDuration);
  }
  
  // Type filters
  if (searchParams.isInternational !== undefined) {
    params.append('isInternational', searchParams.isInternational);
  }
  if (searchParams.featured) {
    params.append('featured', 'true');
  }
  
  // Sorting & Pagination
  if (searchParams.sort) {
    params.append('sort', searchParams.sort);
  }
  params.append('page', searchParams.page || 1);
  params.append('limit', searchParams.limit || 12);
  
  const response = await fetch(`/api/tours?${params.toString()}`);
  return response.json();
};

// Usage
const results = await searchTours({
  search: 'hạ long',
  region: 'mien-bac',
  maxPrice: 5000000,
  minRating: 4.5,
  sort: '-rating',
  page: 1,
  limit: 12
});
```

---

## ✅ Summary

| Tính năng | Trạng thái | Mô tả |
|-----------|-----------|-------|
| **Text Search** | ✅ | Tìm trong title, description, destination, category, highlights, included, excluded |
| **Region Search** | ✅ | Tìm theo miền (slug hoặc name) + tìm trong region.name khi search text |
| **Province Search** | ✅ | Tìm theo tỉnh (slug hoặc name) + tìm trong province.name khi search text |
| **Country Search** | ✅ | Tìm theo quốc gia (slug hoặc name) + tìm trong country.name khi search text |
| **Price Filter** | ✅ | minPrice, maxPrice |
| **Duration Filter** | ✅ | minDuration, maxDuration |
| **Rating Filter** | ✅ | minRating |
| **Type Filter** | ✅ | isInternational, featured, category, difficulty |
| **Sorting** | ✅ | price, -price, rating, -rating, duration, -createdAt |
| **Pagination** | ✅ | page, limit |
| **Populate** | ✅ | region, province, country với name, slug, image |

**🎯 Kết luận:** API search đã hỗ trợ **tất cả các thuộc tính** mà client có thể tìm kiếm!
