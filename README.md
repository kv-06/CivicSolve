# CivicSolve - Civic Problem Reporting System 🏛️

A comprehensive civic problem reporting and management system built with React Native (Expo) frontend and Node.js/Express/MongoDB backend. Citizens can report civic issues, track their progress, and engage with local authorities through a modern, user-friendly interface.

## 🌟 Features

### Frontend (React Native/Expo)
- **📱 Cross-platform** - iOS, Android, and Web support
- **🗺️ Interactive Maps** - Location-based issue reporting
- **📸 Media Upload** - Photos, videos, audio, and documents
- **🔍 Advanced Search** - Filter by category, status, priority
- **📊 Dashboard** - Statistics and progress tracking
- **💬 Real-time Chat** - Communication with authorities
- **🌙 Modern UI** - Clean, responsive design

### Backend (Node.js/Express/MongoDB)
- **🔐 JWT Authentication** - Secure user management
- **📡 RESTful API** - Well-structured endpoints
- **📁 File Upload** - Multi-format media support
- **📧 Email Notifications** - Status update alerts
- **📈 Analytics** - Comprehensive reporting
- **🔍 Full-text Search** - Advanced filtering capabilities
- **🛡️ Security** - CORS, validation, and error handling

## 🏗️ Architecture

### MVC Structure
```
Frontend (React Native/Expo)
├── app/                    # Screens and navigation
├── components/             # Reusable UI components
└── utils/                  # API services and utilities

Backend (Node.js/Express)
├── models/                 # MongoDB schemas (User, Complaint)
├── views/                  # API responses (JSON)
├── controllers/            # Business logic
├── routes/                 # API endpoints
├── middleware/             # Authentication, validation
└── services/               # External services (email, etc.)
```

### Database Models
- **Complaint Model**: Issue tracking with status, priority, location
- **User Model**: Citizen profiles with authentication
- **Department/Branch**: Authority management (extensible)

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account or local MongoDB
- Expo CLI (`npm install -g @expo/cli`)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd CivicSolve

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Backend Setup
```bash
cd backend

# Configure environment
cp env.example .env
# Edit .env with your MongoDB URI and other settings

# Start backend server
npm run dev
```

### 3. Frontend Setup
```bash
# Start Expo development server
npm start

# Run on specific platforms
npm run android  # Android
npm run ios      # iOS
npm run web      # Web
```

## 📱 Screens Overview

### 1. **Home Screen** (`app/(tabs)/index.tsx`)
- Interactive map with issue hotspots
- Quick access to reporting
- Statistics overview

### 2. **Discover Screen** (`app/(tabs)/discover.tsx`)
- Browse all reported issues
- Advanced filtering and search
- Category-based organization

### 3. **Report Screen** (`app/(tabs)/report.tsx`)
- Create new issue reports
- Media attachment support
- Location capture

### 4. **My Issues Screen** (`app/(tabs)/my-issues.tsx`)
- Personal issue tracking
- Status updates
- Progress monitoring

### 5. **Profile Screen** (`app/(tabs)/profile.tsx`)
- User profile management
- Settings and preferences

## 🔧 API Endpoints

### Complaints
- `GET /api/complaints` - List all complaints
- `POST /api/complaints` - Create new complaint
- `GET /api/complaints/:id` - Get complaint details
- `PATCH /api/complaints/:id/status` - Update status
- `POST /api/complaints/:id/upvote` - Support issue

### Users
- `POST /api/users/register` - User registration
- `GET /api/users/profile` - Get user profile
- `PATCH /api/users/profile` - Update profile
- `GET /api/users/dashboard` - Dashboard data

### File Upload
- `POST /api/upload` - Single file upload
- `POST /api/upload/multiple` - Multiple files
- `DELETE /api/upload/:filename` - Delete file

## 🗄️ Database Schema

### Complaint Schema
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
  reportedBy: ObjectId (ref: 'User'),
  createdDate: Date,
  media: [{ type: String, uri: String, name: String }],
  upvotes: Number
}
```

### User Schema
```javascript
{
  name: String,
  phone: String (unique),
  citizenId: String (unique),
  email: String (unique),
  location: String,
  gender: ['male', 'female', 'other'],
  dob: Date
}
```

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev  # Development with auto-restart
npm start    # Production mode
```

### Frontend Development
```bash
npm start    # Expo development server
npm run android  # Android emulator
npm run ios      # iOS simulator
npm run web      # Web browser
```

### API Testing
```bash
# Health check
curl http://localhost:3000/health

# Get complaints
curl http://localhost:3000/api/complaints

# Get statistics
curl http://localhost:3000/api/complaints/stats
```

## 📦 Dependencies

### Frontend
- **Expo** - React Native framework
- **Expo Router** - File-based navigation
- **React Native** - Mobile app framework
- **Expo Location** - GPS services
- **Expo Image Picker** - Camera/gallery access
- **Expo AV** - Audio recording

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Multer** - File upload handling
- **Nodemailer** - Email notifications

## 🚀 Deployment

### Backend Deployment
1. Set up production MongoDB
2. Configure environment variables
3. Use PM2 for process management
4. Set up reverse proxy (Nginx)

### Frontend Deployment
1. Build for production: `expo build`
2. Deploy to app stores
3. Deploy web version to hosting service

## 📄 Documentation

- [Complete Setup Guide](SETUP.md) - Detailed installation instructions
- [Backend API Documentation](backend/README.md) - API reference
- [Frontend Components](components/) - UI component documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For issues and questions:
- Check the [Setup Guide](SETUP.md)
- Review the troubleshooting section
- Create an issue on GitHub

---

**Built with ❤️ for better civic engagement and community development.**
