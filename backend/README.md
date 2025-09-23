# CivicSolve Backend API

A comprehensive backend API for the CivicSolve civic problem reporting system built with Node.js, Express, and MongoDB.

## Features

- **Complaint Management**: Create, read, update, and manage civic complaints
- **User Management**: User registration, profile management, and authentication
- **File Upload**: Support for images, videos, audio, and documents
- **Real-time Notifications**: Email notifications for status updates
- **Search & Filtering**: Advanced search and filtering capabilities
- **Statistics**: Dashboard statistics and reporting
- **RESTful API**: Clean and well-documented API endpoints

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Multer** - File upload handling
- **Nodemailer** - Email notifications

## Project Structure

```
backend/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── complaintController.js # Complaint business logic
│   └── userController.js      # User business logic
├── middleware/
│   ├── authMiddleware.js      # JWT authentication
│   └── uploadMiddleware.js    # File upload handling
├── models/
│   ├── Complaint.js          # Complaint schema
│   └── User.js               # User schema
├── routes/
│   ├── complaintRoutes.js    # Complaint API routes
│   ├── userRoutes.js         # User API routes
│   └── uploadRoutes.js       # File upload routes
├── services/
│   ├── apiService.js         # API service layer
│   └── notificationService.js # Email notifications
├── uploads/                  # File upload directory
├── server.js                 # Main server file
├── package.json
└── README.md
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CivicSolve/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   Update the `.env` file with your configuration:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGO_URI=your-mongodb-connection-string
   JWT_SECRET=your-jwt-secret
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ADMIN_EMAIL=admin@civicsolve.com
   FRONTEND_URL=http://localhost:19006
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Complaints
- `GET /api/complaints` - Get all complaints with filtering
- `GET /api/complaints/:id` - Get complaint by ID
- `POST /api/complaints` - Create new complaint
- `PATCH /api/complaints/:id/status` - Update complaint status
- `POST /api/complaints/:id/upvote` - Upvote complaint
- `GET /api/complaints/my-complaints` - Get user's complaints
- `GET /api/complaints/stats` - Get complaint statistics

### Users
- `POST /api/users/register` - Register new user
- `GET /api/users/profile` - Get user profile
- `PATCH /api/users/profile` - Update user profile
- `GET /api/users/dashboard` - Get user dashboard data
- `GET /api/users/search` - Search users

### File Upload
- `POST /api/upload` - Upload single file
- `POST /api/upload/multiple` - Upload multiple files
- `DELETE /api/upload/:filename` - Delete file

### Health Check
- `GET /health` - Server health status

## Database Schema

### Complaint Model
```javascript
{
  complaintId: String (unique),
  title: String,
  description: String,
  location: String,
  coordinates: { latitude: Number, longitude: Number },
  status: ['reported', 'in_progress', 'resolved', 'closed'],
  priority: ['high', 'medium', 'low'],
  category: String,
  department: ObjectId (ref: 'Department'),
  branch: ObjectId (ref: 'Branch'),
  reportedBy: ObjectId (ref: 'User'),
  createdDate: Date,
  resolvedDate: Date,
  workOrderNumber: String,
  images: [String],
  upvotes: Number,
  comments: Number,
  media: [{ type: String, uri: String, name: String }]
}
```

### User Model
```javascript
{
  name: String,
  phone: String (unique),
  citizenId: String (unique),
  dob: Date,
  location: String,
  gender: ['male', 'female', 'other'],
  email: String (unique),
  isActive: Boolean,
  lastLogin: Date
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## File Upload

The API supports uploading various file types:
- **Images**: jpeg, jpg, png, gif
- **Videos**: mp4, avi, mov
- **Audio**: mp3, wav, m4a
- **Documents**: pdf, doc, docx, txt

Maximum file size: 10MB
Maximum files per request: 10

## Error Handling

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## Development

### Running in Development Mode
```bash
npm run dev
```

### Environment Variables
Make sure to set up all required environment variables in your `.env` file.

### Database Connection
The application will automatically connect to MongoDB using the connection string in your environment variables.

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a production MongoDB instance
3. Set up proper JWT secrets
4. Configure email service
5. Set up file storage (consider using cloud storage for production)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC License
