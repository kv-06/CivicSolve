# CivicSolve - Complete Setup Guide

This guide will help you set up the complete CivicSolve application with both frontend (React Native/Expo) and backend (Node.js/Express/MongoDB) components.

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **MongoDB Atlas account** (for cloud database) or **MongoDB** (for local database)
- **Expo CLI** - Install with `npm install -g @expo/cli`
- **Git** - [Download here](https://git-scm.com/)

## Project Structure

```
CivicSolve/
├── app/                    # React Native frontend (Expo Router)
├── components/             # Reusable React components
├── utils/                  # Utility functions and API services
├── backend/                # Node.js/Express backend
│   ├── config/            # Database configuration
│   ├── controllers/       # Business logic controllers
│   ├── middleware/        # Express middleware
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── services/         # Service layer
│   └── uploads/          # File upload directory
└── README.md
```

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
```bash
# Copy the environment template
cp env.example .env

# Edit the .env file with your configuration
nano .env  # or use your preferred editor
```

Update the `.env` file with your settings:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb+srv://mongo_user:sih%4025@cluster0.hrprsrf.mongodb.net/test?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration (Optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@civicsolve.com

# Frontend URL
FRONTEND_URL=http://localhost:19006
```

### 4. Start the Backend Server
```bash
# Development mode (with auto-restart)
npm run dev

# Or production mode
npm start

# Or use the custom start script
node start.js
```

The backend server will start on `http://localhost:3000`

### 5. Verify Backend is Running
Visit `http://localhost:3000/health` in your browser. You should see:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 123.456
}
```

## Frontend Setup

### 1. Navigate to Root Directory
```bash
cd ..  # Go back to the root directory
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Expo Development Server
```bash
# Start the development server
npm start

# Or start for specific platforms
npm run android  # For Android
npm run ios      # For iOS
npm run web      # For web
```

### 4. Run on Device/Emulator
- **Android**: Use the Expo Go app or Android emulator
- **iOS**: Use the Expo Go app or iOS simulator
- **Web**: Opens automatically in your browser

## Database Setup

### Option 1: MongoDB Atlas (Cloud - Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update the `MONGO_URI` in your `.env` file

### Option 2: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Update `MONGO_URI` to `mongodb://localhost:27017/civicsolve`

## API Configuration

The frontend is configured to use the backend API. You can switch between mock data and real API by modifying the `USE_MOCK_API` flag in `utils/apiService.js`:

```javascript
const USE_MOCK_API = true; // Set to false to use real API
```

## Testing the Application

### 1. Backend API Testing
Test the API endpoints using curl or Postman:

```bash
# Health check
curl http://localhost:3000/health

# Get all complaints
curl http://localhost:3000/api/complaints

# Get complaint statistics
curl http://localhost:3000/api/complaints/stats
```

### 2. Frontend Testing
1. Open the app on your device/emulator
2. Navigate through different screens:
   - **Home**: Overview and map
   - **Discover**: Browse all issues
   - **Report**: Create new issues
   - **My Issues**: View your reported issues
   - **Profile**: User profile management

## Features Overview

### Backend Features
- ✅ **RESTful API** with Express.js
- ✅ **MongoDB** database with Mongoose ODM
- ✅ **JWT Authentication** for secure access
- ✅ **File Upload** support for images, videos, audio, documents
- ✅ **Email Notifications** for status updates
- ✅ **Search & Filtering** with advanced queries
- ✅ **Statistics & Reporting** for dashboard
- ✅ **Error Handling** and validation
- ✅ **CORS** enabled for frontend integration

### Frontend Features
- ✅ **React Native** with Expo
- ✅ **Expo Router** for navigation
- ✅ **Modern UI** with responsive design
- ✅ **File Upload** with camera and gallery support
- ✅ **Location Services** for GPS coordinates
- ✅ **Search & Filter** functionality
- ✅ **Real-time Updates** with refresh controls
- ✅ **Cross-platform** support (iOS, Android, Web)

## Troubleshooting

### Common Issues

1. **Backend won't start**
   - Check if port 3000 is available
   - Verify MongoDB connection string
   - Check environment variables

2. **Frontend can't connect to backend**
   - Ensure backend is running on port 3000
   - Check CORS configuration
   - Verify API base URL in frontend

3. **Database connection issues**
   - Verify MongoDB URI
   - Check network connectivity
   - Ensure database user has proper permissions

4. **File upload issues**
   - Check file size limits (10MB max)
   - Verify file type restrictions
   - Ensure uploads directory exists

### Logs and Debugging

**Backend logs:**
```bash
# Check server logs
npm run dev  # Shows detailed logs

# Check specific error logs
tail -f logs/error.log  # If logging to file
```

**Frontend logs:**
- Use Expo DevTools for debugging
- Check browser console for web version
- Use React Native Debugger for advanced debugging

## Production Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Use a production MongoDB instance
3. Set up proper JWT secrets
4. Configure email service
5. Use a process manager like PM2
6. Set up reverse proxy with Nginx

### Frontend Deployment
1. Build for production: `expo build`
2. Deploy to app stores (iOS/Android)
3. Deploy web version to hosting service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and questions:
- Check the troubleshooting section
- Review the API documentation
- Create an issue on GitHub

## License

This project is licensed under the ISC License.
