const axios = require('axios');

async function testAPI() {
  console.log('🧪 Testing API after fixes...\n');

  try {
    // Test health endpoint
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await axios.get('http://localhost:3000/health');
    console.log('✅ Health Check:', healthResponse.data.message);
    console.log('');

    // Test complaints endpoint
    console.log('2️⃣ Testing Complaints API...');
    const complaintsResponse = await axios.get('http://localhost:3000/api/complaints');
    console.log('✅ Complaints API:', `Found ${complaintsResponse.data.data.length} complaints`);
    console.log('   Pagination:', complaintsResponse.data.pagination);
    console.log('');

    // Test stats endpoint
    console.log('3️⃣ Testing Stats API...');
    const statsResponse = await axios.get('http://localhost:3000/api/complaints/stats');
    console.log('✅ Stats API:', statsResponse.data.data.overall);
    console.log('');

    console.log('🎉 All API tests passed! The fixes worked.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

testAPI();
