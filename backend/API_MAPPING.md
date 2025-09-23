# API Mapping for Frontend Screens

This document shows how the backend controllers map to the three main frontend screens and their functionality.

## 📱 Frontend Screens → Backend Controllers Mapping

### 1. **Discover Screen** (`app/(tabs)/discover.tsx`)
**Purpose**: Display all complaints with filtering and search capabilities

**Backend Controller**: `complaintController.js`
**Main Function**: `getAllComplaints`

**API Endpoint**: `GET /api/complaints`

**Query Parameters**:
- `search` - Text search in title, description, location
- `category` - Filter by complaint category
- `status` - Filter by complaint status
- `priority` - Filter by priority level
- `sortBy` - Sort by newest, oldest, support, priority
- `page` - Pagination page number
- `limit` - Number of items per page

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "complaint_id",
      "title": "Broken Street Light",
      "description": "Street light not working...",
      "category": "Electricity",
      "status": "reported",
      "priority": "medium",
      "location": "Main Road, Vengavasal",
      "coordinates": {
        "latitude": 12.9716,
        "longitude": 77.5946
      },
      "reportedBy": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdDate": "2024-01-15T10:30:00Z",
      "upvotes": 12,
      "images": ["image_url_1", "image_url_2"]
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  }
}
```

**Features Implemented**:
- ✅ Full-text search across title, description, and location
- ✅ Category filtering (Road & Transport, Water & Sanitation, etc.)
- ✅ Status filtering (reported, in_progress, resolved, closed)
- ✅ Priority filtering (high, medium, low)
- ✅ Multiple sorting options
- ✅ Pagination support
- ✅ Population of related data (reportedBy, department, branch)

---

### 2. **My Issues Screen** (`app/(tabs)/my-issues.tsx`)
**Purpose**: Display only the current user's complaints

**Backend Controller**: `complaintController.js`
**Main Function**: `getComplaintsByUser`

**API Endpoint**: `GET /api/complaints/my-complaints`

**Authentication**: Required (JWT token)

**Query Parameters**:
- `page` - Pagination page number
- `limit` - Number of items per page
- `status` - Filter by complaint status (optional)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "complaint_id",
      "title": "My Reported Issue",
      "description": "Description of my issue...",
      "category": "Garbage & Waste",
      "status": "in_progress",
      "priority": "high",
      "location": "My Street, My City",
      "createdDate": "2024-01-15T10:30:00Z",
      "department": {
        "name": "Sanitation Department"
      },
      "branch": {
        "name": "Local Branch"
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalItems": 15,
    "itemsPerPage": 10
  }
}
```

**Features Implemented**:
- ✅ User-specific complaint filtering (reportedBy: userId)
- ✅ Status filtering for user's complaints
- ✅ Pagination support
- ✅ Population of department and branch information
- ✅ Authentication required (JWT middleware)

---

### 3. **Report Screen** (`app/(tabs)/report.tsx`)
**Purpose**: Allow users to create new complaints

**Backend Controller**: `complaintController.js`
**Main Function**: `createComplaint`

**API Endpoint**: `POST /api/complaints`

**Authentication**: Required (JWT token)

**Request Body**:
```json
{
  "title": "Issue Title",
  "description": "Detailed description of the issue",
  "category": "Road & Transport",
  "location": "Street Address, City",
  "coordinates": {
    "latitude": 12.9716,
    "longitude": 77.5946
  },
  "priority": "medium",
  "media": [
    {
      "type": "image",
      "uri": "file_uri",
      "name": "image_name.jpg"
    }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "message": "Complaint created successfully",
  "data": {
    "id": "new_complaint_id",
    "complaintId": "CMP-1642248600000-ABC12",
    "title": "Issue Title",
    "description": "Detailed description...",
    "category": "Road & Transport",
    "status": "reported",
    "priority": "medium",
    "location": "Street Address, City",
    "coordinates": {
      "latitude": 12.9716,
      "longitude": 77.5946
    },
    "reportedBy": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdDate": "2024-01-15T10:30:00Z",
    "upvotes": 0,
    "media": [...]
  }
}
```

**Features Implemented**:
- ✅ Complaint creation with validation
- ✅ Automatic complaint ID generation
- ✅ User authentication and association
- ✅ File upload support (images, videos, audio, documents)
- ✅ Location coordinates support
- ✅ Priority setting
- ✅ Category validation
- ✅ Automatic timestamp creation

---

## 🔧 Additional Supporting Functions

### Statistics for Dashboard
**Function**: `getComplaintStats`
**Endpoint**: `GET /api/complaints/stats`

### User Profile Management
**Functions**: `getUserProfile`, `updateUserProfile`, `getUserDashboard`
**Endpoints**: 
- `GET /api/users/profile`
- `PATCH /api/users/profile`
- `GET /api/users/dashboard`

### File Upload
**Endpoints**:
- `POST /api/upload` - Single file upload
- `POST /api/upload/multiple` - Multiple files upload

---

## 🛡️ Security & Validation

### Authentication
- JWT-based authentication for protected routes
- User ID extraction from JWT token
- Automatic user association with complaints

### Validation
- Required field validation
- Data type validation
- File type and size validation
- Input sanitization

### Error Handling
- Comprehensive error responses
- Proper HTTP status codes
- Detailed error messages for debugging

---

## 📊 Database Queries

### Discover Screen Query
```javascript
Complaint.find(filter)
  .populate('reportedBy', 'name email')
  .populate('department', 'name')
  .populate('branch', 'name')
  .sort(sort)
  .skip(skip)
  .limit(limit)
```

### My Issues Query
```javascript
Complaint.find({ reportedBy: userId })
  .populate('department', 'name')
  .populate('branch', 'name')
  .sort({ createdDate: -1 })
  .skip(skip)
  .limit(limit)
```

### Create Complaint
```javascript
const complaint = new Complaint(complaintData);
await complaint.save();
await complaint.populate('reportedBy', 'name email');
```

---

## ✅ Implementation Status

All required functionality for the three main screens is **FULLY IMPLEMENTED**:

- ✅ **Discover Screen**: Complete filtering, search, and pagination
- ✅ **My Issues Screen**: User-specific complaint retrieval
- ✅ **Report Screen**: Complete complaint creation with file upload
- ✅ **Authentication**: JWT-based security
- ✅ **Validation**: Comprehensive input validation
- ✅ **Error Handling**: Proper error responses
- ✅ **Database Integration**: MongoDB with Mongoose ODM
- ✅ **File Upload**: Multi-format support
- ✅ **API Documentation**: Complete endpoint documentation

The backend is ready for production use with all the required functionality for the three main frontend screens.
