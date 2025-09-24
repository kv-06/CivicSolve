// test-frontend-api.js
// Test script to verify frontend API calls work

const API_BASE_URL = 'http://localhost:3000/api';

// Test GET request
async function testGetComplaints() {
  try {
    console.log('Testing GET /api/complaints...');
    const response = await fetch(`${API_BASE_URL}/complaints`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'http://localhost:8081'
      },
      mode: 'cors',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ GET /api/complaints SUCCESS');
    console.log('Response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('❌ GET /api/complaints FAILED:', error.message);
    throw error;
  }
}

// Test POST request
async function testPostComplaint() {
  try {
    console.log('Testing POST /api/complaints...');
    const complaintData = {
      title: "Frontend Test Issue",
      description: "This is a test issue from frontend",
      category: "Road & Transport",
      location: "Test Location",
      coordinates: {
        latitude: 12.9716,
        longitude: 77.5946
      },
      priority: "medium"
    };

    const response = await fetch(`${API_BASE_URL}/complaints`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'http://localhost:8081'
      },
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify(complaintData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('✅ POST /api/complaints SUCCESS');
    console.log('Response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('❌ POST /api/complaints FAILED:', error.message);
    throw error;
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Frontend API Tests...\n');
  
  try {
    await testGetComplaints();
    console.log('');
    await testPostComplaint();
    console.log('\n🎉 All tests passed! Frontend API integration is working.');
  } catch (error) {
    console.error('\n💥 Tests failed:', error.message);
    process.exit(1);
  }
}

runTests();
