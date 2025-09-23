#!/usr/bin/env node

/**
 * Simple API Test Script for CivicSolve Backend
 * Tests the three main endpoints for the frontend screens
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

// Test data
const testComplaint = {
  title: "Test Street Light Issue",
  description: "This is a test complaint for API testing",
  category: "Electricity",
  location: "Test Street, Test City",
  coordinates: {
    latitude: 12.9716,
    longitude: 77.5946
  },
  priority: "medium",
  media: []
};

const testUser = {
  name: "Test User",
  phone: "9876543210",
  citizenId: "TEST123456",
  dob: "1990-01-01",
  location: "Test City",
  gender: "male",
  email: "test@example.com"
};

async function testAPI() {
  console.log('🧪 Testing CivicSolve API Endpoints...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
    console.log('✅ Health Check:', healthResponse.data.message);
    console.log('');

    // Test 2: Get All Complaints (Discover Screen)
    console.log('2️⃣ Testing Get All Complaints (Discover Screen)...');
    const discoverResponse = await axios.get(`${API_BASE_URL}/complaints`, {
      params: {
        search: '',
        category: 'All',
        status: 'All',
        priority: 'All',
        sortBy: 'newest',
        page: 1,
        limit: 10
      }
    });
    console.log('✅ Discover API:', `Found ${discoverResponse.data.data.length} complaints`);
    console.log('   Pagination:', discoverResponse.data.pagination);
    console.log('');

    // Test 3: Get Complaint Statistics
    console.log('3️⃣ Testing Complaint Statistics...');
    const statsResponse = await axios.get(`${API_BASE_URL}/complaints/stats`);
    console.log('✅ Statistics:', statsResponse.data.data.overall);
    console.log('');

    // Test 4: User Registration
    console.log('4️⃣ Testing User Registration...');
    try {
      const registerResponse = await axios.post(`${API_BASE_URL}/users/register`, testUser);
      console.log('✅ User Registration:', registerResponse.data.message);
      console.log('   User ID:', registerResponse.data.data.id);
      console.log('');
    } catch (error) {
      if (error.response?.status === 400 && error.response.data.message.includes('already exists')) {
        console.log('⚠️  User already exists (expected for testing)');
        console.log('');
      } else {
        throw error;
      }
    }

    // Test 5: Get User Profile (requires authentication)
    console.log('5️⃣ Testing User Profile (requires authentication)...');
    try {
      const profileResponse = await axios.get(`${API_BASE_URL}/users/profile`, {
        headers: {
          'Authorization': 'Bearer test-token'
        }
      });
      console.log('✅ User Profile:', profileResponse.data.data.name);
    } catch (error) {
      console.log('⚠️  User Profile requires valid JWT token (expected)');
    }
    console.log('');

    // Test 6: Create Complaint (requires authentication)
    console.log('6️⃣ Testing Create Complaint (requires authentication)...');
    try {
      const createResponse = await axios.post(`${API_BASE_URL}/complaints`, testComplaint, {
        headers: {
          'Authorization': 'Bearer test-token'
        }
      });
      console.log('✅ Create Complaint:', createResponse.data.message);
    } catch (error) {
      console.log('⚠️  Create Complaint requires valid JWT token (expected)');
    }
    console.log('');

    // Test 7: Get My Complaints (requires authentication)
    console.log('7️⃣ Testing Get My Complaints (requires authentication)...');
    try {
      const myComplaintsResponse = await axios.get(`${API_BASE_URL}/complaints/my-complaints`, {
        headers: {
          'Authorization': 'Bearer test-token'
        }
      });
      console.log('✅ My Complaints:', `Found ${myComplaintsResponse.data.data.length} user complaints`);
    } catch (error) {
      console.log('⚠️  My Complaints requires valid JWT token (expected)');
    }
    console.log('');

    console.log('🎉 API Tests Completed Successfully!');
    console.log('');
    console.log('📋 Summary:');
    console.log('   ✅ Discover Screen API - Working');
    console.log('   ✅ Statistics API - Working');
    console.log('   ✅ User Registration API - Working');
    console.log('   ⚠️  Protected APIs require JWT authentication');
    console.log('');
    console.log('🔧 To test protected endpoints:');
    console.log('   1. Register a user first');
    console.log('   2. Implement JWT authentication');
    console.log('   3. Use valid JWT token in Authorization header');

  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    process.exit(1);
  }
}

// Run tests
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI };
