# Travel Tour API Documentation

## API Endpoints

Base URL: `http://localhost:5000/api`

---

## Authentication

### Register
**POST** `/auth/register`

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "phone": "+84123456789"
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "user": {...},
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### Login
**POST** `/auth/login`

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Refresh Token
**POST** `/auth/refresh-token`

Request body:
```json
{
  "refreshToken": "refresh_token"
}
```

### Get Profile (Protected)
**GET** `/auth/profile`

Headers:
```
Authorization: Bearer {accessToken}
```

### Update Profile (Protected)
**PUT** `/auth/profile`

Headers:
```
Authorization: Bearer {accessToken}
```

Request body:
```json
{
  "fullName": "John Smith",
  "phone": "+84987654321"
}
```

### Change Password (Protected)
**PUT** `/auth/change-password`

Headers:
```
Authorization: Bearer {accessToken}
```

Request body:
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

### Logout (Protected)
**POST** `/auth/logout`

Headers:
```
Authorization: Bearer {accessToken}
```

Request body:
```json
{
  "refreshToken": "refresh_token"
}
```

---

## Tours

### Get All Tours
**GET** `/tours`

Query parameters:
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `search` (string)
- `destination` (string)
- `difficulty` (easy|medium|difficult)
- `minPrice` (number)
- `maxPrice` (number)
- `category` (string)
- `featured` (boolean)
- `sort` (string, e.g., "price", "-rating")

Example:
```
GET /api/tours?page=1&limit=10&destination=Đà Nẵng&difficulty=easy
```

### Get Tour by ID
**GET** `/tours/:id`

### Get Featured Tours
**GET** `/tours/featured?limit=6`

### Get Popular Tours
**GET** `/tours/popular?limit=6`

### Get Tour Statistics
**GET** `/tours/stats`

### Create Tour (Admin Only)
**POST** `/tours`

Headers:
```
Authorization: Bearer {accessToken}
```

Request body:
```json
{
  "title": "Tour Hạ Long 3 ngày 2 đêm",
  "description": "Khám phá vịnh Hạ Long...",
  "destination": "Quảng Ninh",
  "duration": 3,
  "price": 2500000,
  "maxGroupSize": 20,
  "difficulty": "easy",
  "category": "Biển đảo",
  "images": ["url1", "url2"],
  "startDates": ["2024-12-20", "2024-12-27"],
  "includes": ["Khách sạn", "Ăn uống", "Vé tham quan"],
  "excludes": ["Vé máy bay"]
}
```

### Update Tour (Admin Only)
**PUT** `/tours/:id`

Headers:
```
Authorization: Bearer {accessToken}
```

### Delete Tour (Admin Only)
**DELETE** `/tours/:id`

Headers:
```
Authorization: Bearer {accessToken}
```

---

## Bookings

### Create Booking (Protected)
**POST** `/bookings`

Headers:
```
Authorization: Bearer {accessToken}
```

Request body:
```json
{
  "tourId": "tour_id",
  "startDate": "2024-12-20",
  "numberOfPeople": 2,
  "customerInfo": {
    "fullName": "Nguyễn Văn A",
    "email": "customer@example.com",
    "phone": "+84123456789",
    "address": "123 Đường ABC, Hà Nội",
    "notes": "Yêu cầu đặc biệt..."
  }
}
```

### Get User's Bookings (Protected)
**GET** `/bookings/my-bookings`

Headers:
```
Authorization: Bearer {accessToken}
```

### Get All Bookings (Admin Only)
**GET** `/bookings`

Headers:
```
Authorization: Bearer {accessToken}
```

Query parameters:
- `page` (number)
- `limit` (number)
- `status` (pending|confirmed|cancelled|completed)
- `userId` (string)

### Get Booking by ID (Protected)
**GET** `/bookings/:id`

Headers:
```
Authorization: Bearer {accessToken}
```

### Cancel Booking (Protected)
**PUT** `/bookings/:id/cancel`

Headers:
```
Authorization: Bearer {accessToken}
```

### Update Booking Status (Admin Only)
**PUT** `/bookings/:id/status`

Headers:
```
Authorization: Bearer {accessToken}
```

Request body:
```json
{
  "status": "confirmed"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "status": "fail",
  "message": "Error message here"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `500` - Internal Server Error
