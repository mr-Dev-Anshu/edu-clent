# Backend Routes Documentation - Academic Year, Class, Section

## Base URL
```
http://localhost:YOUR_PORT/api
```

---

## 🎓 Academic Year Endpoints

### 1. Get All Academic Years (Paginated)
```
GET /academic-years
```
**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `isCurrent` (string, optional: "true")
- `isLocked` (string, optional: "true")

**Response:**
```json
{
  "success": true,
  "total": 5,
  "page": 1,
  "limit": 10,
  "pages": 1,
  "data": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "tenantId": "tenant-uuid",
      "name": "2024-2025",
      "startDate": "2024-04-01",
      "endDate": "2025-03-31",
      "isCurrent": true,
      "isLocked": false,
      "createdAt": "2024-04-01T00:00:00.000Z",
      "updatedAt": "2024-04-01T00:00:00.000Z"
    }
  ]
}
```

---

### 2. Get Current Academic Year
```
GET /academic-years/current
```
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "tenantId": "tenant-uuid",
    "name": "2024-2025",
    "startDate": "2024-04-01",
    "endDate": "2025-03-31",
    "isCurrent": true,
    "isLocked": false,
    "createdAt": "2024-04-01T00:00:00.000Z",
    "updatedAt": "2024-04-01T00:00:00.000Z"
  }
}
```

---

## 📚 Class Endpoints

### 3. Get All Classes (Simple Pagination)
```
GET /classes
```
**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `numericLevel` (number, optional)

**Response:**
```json
{
  "success": true,
  "total": 12,
  "page": 1,
  "limit": 10,
  "pages": 2,
  "data": [
    {
      "id": "class-uuid-1",
      "tenantId": "tenant-uuid",
      "name": "Class X",
      "numericLevel": 10,
      "description": "Senior class",
      "createdAt": "2024-04-01T00:00:00.000Z",
      "updatedAt": "2024-04-01T00:00:00.000Z"
    }
  ]
}
```

---

### 4. Get Classes with Sections (NEW - Main Endpoint)
```
GET /classes/with-sections
```
**Query Parameters:**
- `search` (string, optional) - Search in: name, description, numericLevel
- `academicYearId` (UUID, optional) - Filter sections by academic year
- `numericLevel` (number, optional) - Separate numeric level filter
- `page` (number, default: 1)
- `limit` (number, default: 10)

**Response:**
```json
{
  "success": true,
  "total": 12,
  "page": 1,
  "limit": 10,
  "pages": 2,
  "data": [
    {
      "id": "class-uuid-1",
      "tenantId": "tenant-uuid",
      "name": "Class X-A",
      "numericLevel": 10,
      "description": "Senior class",
      "createdAt": "2024-04-01T00:00:00.000Z",
      "updatedAt": "2024-04-01T00:00:00.000Z",
      "sections": [
        {
          "id": "section-uuid-1",
          "tenantId": "tenant-uuid",
          "name": "Section A",
          "capacity": 40,
          "classTeacherId": "teacher-uuid-1",
          "classTeacher": {
            "id": "teacher-uuid-1",
            "firstName": "John",
            "lastName": "Doe",
            "email": "john@school.com",
            "phone": "+91-9999999999",
            "status": "active"
          },
          "classId": "class-uuid-1",
          "academicYearId": "year-uuid-1",
          "academicYear": {
            "id": "year-uuid-1",
            "name": "2024-2025",
            "startDate": "2024-04-01",
            "endDate": "2025-03-31",
            "isCurrent": true,
            "isLocked": false
          },
          "createdAt": "2024-04-01T00:00:00.000Z",
          "updatedAt": "2024-04-01T00:00:00.000Z"
        },
        {
          "id": "section-uuid-2",
          "tenantId": "tenant-uuid",
          "name": "Section B",
          "capacity": 42,
          "classTeacherId": "teacher-uuid-2",
          "classTeacher": {
            "id": "teacher-uuid-2",
            "firstName": "Jane",
            "lastName": "Smith",
            "email": "jane@school.com",
            "phone": "+91-8888888888",
            "status": "active"
          },
          "classId": "class-uuid-1",
          "academicYearId": "year-uuid-1",
          "academicYear": {
            "id": "year-uuid-1",
            "name": "2024-2025",
            "startDate": "2024-04-01",
            "endDate": "2025-03-31",
            "isCurrent": true,
            "isLocked": false
          },
          "createdAt": "2024-04-01T00:00:00.000Z",
          "updatedAt": "2024-04-01T00:00:00.000Z"
        }
      ]
    },
    {
      "id": "class-uuid-2",
      "tenantId": "tenant-uuid",
      "name": "Class IX",
      "numericLevel": 9,
      "description": "Junior class",
      "createdAt": "2024-04-01T00:00:00.000Z",
      "updatedAt": "2024-04-01T00:00:00.000Z",
      "sections": []
    }
  ]
}
```

---

### 5. Get Classes with Sections (Legacy - Full Fetch)
```
GET /classes/with-sections/all
```
**Description:** Returns all classes with their sections without pagination (use cautiously for large datasets)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "class-uuid-1",
      "tenantId": "tenant-uuid",
      "name": "Class X-A",
      "numericLevel": 10,
      "description": "Senior class",
      "createdAt": "2024-04-01T00:00:00.000Z",
      "updatedAt": "2024-04-01T00:00:00.000Z",
      "sections": [
        {
          "id": "section-uuid-1",
          "tenantId": "tenant-uuid",
          "name": "Section A",
          "capacity": 40,
          "classTeacherId": "teacher-uuid-1",
          "classTeacher": {
            "id": "teacher-uuid-1",
            "firstName": "John",
            "lastName": "Doe",
            "email": "john@school.com",
            "phone": "+91-9999999999",
            "status": "active"
          },
          "classId": "class-uuid-1",
          "academicYearId": "year-uuid-1",
          "academicYear": {
            "id": "year-uuid-1",
            "name": "2024-2025",
            "startDate": "2024-04-01",
            "endDate": "2025-03-31",
            "isCurrent": true,
            "isLocked": false
          },
          "createdAt": "2024-04-01T00:00:00.000Z",
          "updatedAt": "2024-04-01T00:00:00.000Z"
        }
      ]
    }
  ]
}
```

---

### 6. Get Class by ID
```
GET /classes/{classId}
```
**Path Parameters:**
- `classId` (UUID) - Class ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "class-uuid-1",
    "tenantId": "tenant-uuid",
    "name": "Class X",
    "numericLevel": 10,
    "description": "Senior class",
    "createdAt": "2024-04-01T00:00:00.000Z",
    "updatedAt": "2024-04-01T00:00:00.000Z"
  }
}
```

---

### 7. Create Class
```
POST /classes
```
**Request Body:**
```json
{
  "name": "Class X",
  "numericLevel": 10,
  "description": "Senior class"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "class-uuid-1",
    "tenantId": "tenant-uuid",
    "name": "Class X",
    "numericLevel": 10,
    "description": "Senior class",
    "createdAt": "2024-04-01T00:00:00.000Z",
    "updatedAt": "2024-04-01T00:00:00.000Z"
  }
}
```

---

### 8. Update Class
```
PATCH /classes/{classId}
```
**Path Parameters:**
- `classId` (UUID) - Class ID

**Request Body:**
```json
{
  "name": "Class X-Updated",
  "numericLevel": 10,
  "description": "Updated description"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "class-uuid-1",
    "tenantId": "tenant-uuid",
    "name": "Class X-Updated",
    "numericLevel": 10,
    "description": "Updated description",
    "createdAt": "2024-04-01T00:00:00.000Z",
    "updatedAt": "2024-04-01T12:00:00.000Z"
  }
}
```

---

### 9. Delete Class
```
DELETE /classes/{classId}
```
**Path Parameters:**
- `classId` (UUID) - Class ID

**Response:**
```json
{
  "success": true,
  "message": "Class deleted successfully",
  "data": {
    "id": "class-uuid-1",
    "tenantId": "tenant-uuid",
    "name": "Class X",
    "numericLevel": 10,
    "description": "Senior class",
    "createdAt": "2024-04-01T00:00:00.000Z",
    "updatedAt": "2024-04-01T00:00:00.000Z"
  }
}
```

---

## 📖 Section Endpoints

### 10. Get All Sections (Paginated)
```
GET /sections
```
**Query Parameters:**
- `classId` (UUID, optional) - Filter by class
- `academicYearId` (UUID, optional) - Filter by academic year
- `page` (number, default: 1)
- `limit` (number, default: 10)

**Response:**
```json
{
  "success": true,
  "total": 8,
  "page": 1,
  "limit": 10,
  "pages": 1,
  "data": [
    {
      "id": "section-uuid-1",
      "tenantId": "tenant-uuid",
      "name": "Section A",
      "capacity": 40,
      "classTeacherId": "teacher-uuid-1",
      "classTeacher": {
        "id": "teacher-uuid-1",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@school.com",
        "phone": "+91-9999999999",
        "status": "active"
      },
      "classId": "class-uuid-1",
      "class": {
        "id": "class-uuid-1",
        "tenantId": "tenant-uuid",
        "name": "Class X",
        "numericLevel": 10,
        "description": "Senior class"
      },
      "academicYearId": "year-uuid-1",
      "academicYear": {
        "id": "year-uuid-1",
        "tenantId": "tenant-uuid",
        "name": "2024-2025",
        "startDate": "2024-04-01",
        "endDate": "2025-03-31",
        "isCurrent": true,
        "isLocked": false
      },
      "createdAt": "2024-04-01T00:00:00.000Z",
      "updatedAt": "2024-04-01T00:00:00.000Z"
    }
  ]
}
```

---

### 11. Get Sections for Specific Class (NEW)
```
GET /classes/{classId}/sections
```
**Path Parameters:**
- `classId` (UUID) - Class ID

**Query Parameters:**
- `academicYearId` (UUID, optional) - Filter by academic year
- `page` (number, default: 1)
- `limit` (number, default: 10)

**Response:**
```json
{
  "success": true,
  "total": 2,
  "page": 1,
  "limit": 10,
  "pages": 1,
  "data": [
    {
      "id": "section-uuid-1",
      "tenantId": "tenant-uuid",
      "name": "Section A",
      "capacity": 40,
      "classTeacherId": "teacher-uuid-1",
      "classTeacher": {
        "id": "teacher-uuid-1",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@school.com",
        "phone": "+91-9999999999",
        "status": "active"
      },
      "classId": "class-uuid-1",
      "academicYearId": "year-uuid-1",
      "academicYear": {
        "id": "year-uuid-1",
        "tenantId": "tenant-uuid",
        "name": "2024-2025",
        "startDate": "2024-04-01",
        "endDate": "2025-03-31",
        "isCurrent": true,
        "isLocked": false
      },
      "createdAt": "2024-04-01T00:00:00.000Z",
      "updatedAt": "2024-04-01T00:00:00.000Z"
    }
  ]
}
```

---

### 12. Get Section by ID
```
GET /sections/{sectionId}
```
**Path Parameters:**
- `sectionId` (UUID) - Section ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "section-uuid-1",
    "tenantId": "tenant-uuid",
    "name": "Section A",
    "capacity": 40,
    "classTeacherId": "teacher-uuid-1",
    "classTeacher": {
      "id": "teacher-uuid-1",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@school.com",
      "phone": "+91-9999999999",
      "status": "active"
    },
    "classId": "class-uuid-1",
    "class": {
      "id": "class-uuid-1",
      "tenantId": "tenant-uuid",
      "name": "Class X",
      "numericLevel": 10,
      "description": "Senior class"
    },
    "academicYearId": "year-uuid-1",
    "academicYear": {
      "id": "year-uuid-1",
      "tenantId": "tenant-uuid",
      "name": "2024-2025",
      "startDate": "2024-04-01",
      "endDate": "2025-03-31",
      "isCurrent": true,
      "isLocked": false
    },
    "createdAt": "2024-04-01T00:00:00.000Z",
    "updatedAt": "2024-04-01T00:00:00.000Z"
  }
}
```

---

### 13. Create Section
```
POST /sections
```
**Request Body:**
```json
{
  "name": "Section A",
  "classId": "class-uuid-1",
  "academicYearId": "year-uuid-1",
  "capacity": 40,
  "classTeacherId": "teacher-uuid-1"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "section-uuid-1",
    "tenantId": "tenant-uuid",
    "name": "Section A",
    "capacity": 40,
    "classTeacherId": "teacher-uuid-1",
    "classTeacher": {
      "id": "teacher-uuid-1",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@school.com",
      "phone": "+91-9999999999",
      "status": "active"
    },
    "classId": "class-uuid-1",
    "class": {
      "id": "class-uuid-1",
      "tenantId": "tenant-uuid",
      "name": "Class X",
      "numericLevel": 10,
      "description": "Senior class"
    },
    "academicYearId": "year-uuid-1",
    "academicYear": {
      "id": "year-uuid-1",
      "tenantId": "tenant-uuid",
      "name": "2024-2025",
      "startDate": "2024-04-01",
      "endDate": "2025-03-31",
      "isCurrent": true,
      "isLocked": false
    },
    "createdAt": "2024-04-01T00:00:00.000Z",
    "updatedAt": "2024-04-01T00:00:00.000Z"
  }
}
```

---

### 14. Update Section
```
PATCH /sections/{sectionId}
```
**Path Parameters:**
- `sectionId` (UUID) - Section ID

**Request Body:**
```json
{
  "name": "Section A-Updated",
  "capacity": 45,
  "classTeacherId": "teacher-uuid-2"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "section-uuid-1",
    "tenantId": "tenant-uuid",
    "name": "Section A-Updated",
    "capacity": 45,
    "classTeacherId": "teacher-uuid-2",
    "classTeacher": {
      "id": "teacher-uuid-2",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@school.com",
      "phone": "+91-8888888888",
      "status": "active"
    },
    "classId": "class-uuid-1",
    "class": {
      "id": "class-uuid-1",
      "tenantId": "tenant-uuid",
      "name": "Class X",
      "numericLevel": 10,
      "description": "Senior class"
    },
    "academicYearId": "year-uuid-1",
    "academicYear": {
      "id": "year-uuid-1",
      "tenantId": "tenant-uuid",
      "name": "2024-2025",
      "startDate": "2024-04-01",
      "endDate": "2025-03-31",
      "isCurrent": true,
      "isLocked": false
    },
    "createdAt": "2024-04-01T00:00:00.000Z",
    "updatedAt": "2024-04-01T12:00:00.000Z"
  }
}
```

---

### 15. Delete Section
```
DELETE /sections/{sectionId}
```
**Path Parameters:**
- `sectionId` (UUID) - Section ID

**Response:**
```json
{
  "success": true,
  "message": "Section deleted successfully",
  "data": {
    "id": "section-uuid-1",
    "tenantId": "tenant-uuid",
    "name": "Section A",
    "capacity": 40,
    "classTeacherId": "teacher-uuid-1",
    "classTeacher": {
      "id": "teacher-uuid-1",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@school.com",
      "phone": "+91-9999999999",
      "status": "active"
    },
    "classId": "class-uuid-1",
    "class": {
      "id": "class-uuid-1",
      "tenantId": "tenant-uuid",
      "name": "Class X",
      "numericLevel": 10,
      "description": "Senior class"
    },
    "academicYearId": "year-uuid-1",
    "academicYear": {
      "id": "year-uuid-1",
      "tenantId": "tenant-uuid",
      "name": "2024-2025",
      "startDate": "2024-04-01",
      "endDate": "2025-03-31",
      "isCurrent": true,
      "isLocked": false
    },
    "createdAt": "2024-04-01T00:00:00.000Z",
    "updatedAt": "2024-04-01T00:00:00.000Z"
  }
}
```

---

## 🔑 NEW / UPDATED Endpoints Summary

### Main New Endpoints:
1. **GET /classes/with-sections** - Classes with filtered sections (MOST IMPORTANT FOR FRONTEND)
2. **GET /classes/{classId}/sections** - Sections for specific class

### Key Features:
✅ Full nested object population (classTeacher, academicYear, class details)  
✅ Server-side search and filtering  
✅ Pagination support  
✅ Tenant isolation enforced  
✅ Academic year filtering  

---

## 📋 Frontend Integration Checklist

- [ ] Call `GET /academic-years/current` on page load to get current year ID
- [ ] Use `GET /classes/with-sections?academicYearId={yearId}&page=1&limit=10` for main table
- [ ] Implement search: `GET /classes/with-sections?search={term}&academicYearId={yearId}`
- [ ] Handle pagination with `page` and `limit` params
- [ ] Display nested `classTeacher`, `academicYear` data without extra requests
- [ ] Optional: Use `GET /classes/{classId}/sections` for class detail view

---

## ⚠️ Important Notes

1. **All endpoints require JWT authentication** - Pass token in Authorization header
2. **Tenant isolation is automatic** - No need to pass tenant ID in requests
3. **Responses are fully populated** - No additional API calls needed for nested data
4. **Pagination is after filtering** - Search/filter results are paginated
5. **Empty sections array** - Classes with no sections for selected year return empty array, not null

---

## 🚀 Frontend Usage Example

```javascript
// Get current academic year
const yearRes = await fetch('/api/academic-years/current', {
  headers: { Authorization: `Bearer ${token}` }
});
const { data: currentYear } = await yearRes.json();

// Get classes with sections for current year
const classRes = await fetch(
  `/api/classes/with-sections?academicYearId=${currentYear.id}&page=1&limit=10`,
  { headers: { Authorization: `Bearer ${token}` } }
);
const { data: classes, total, pages } = await classRes.json();

// Search with filters
const searchRes = await fetch(
  `/api/classes/with-sections?search=Class&numericLevel=10&academicYearId=${currentYear.id}&page=1&limit=10`,
  { headers: { Authorization: `Bearer ${token}` } }
);
```

---

Generated: May 5, 2026  
Backend Status: ✅ Production Ready
