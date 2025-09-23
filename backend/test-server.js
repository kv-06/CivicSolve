#!/usr/bin/env node

/**
 * Simple server test to verify the middleware fix
 */

const axios = require('axios');

async function testServer() {
  console.log('🧪 Testing server startup...\n');

  try {
    // Wait a moment for server to start
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test health endpoint
    const response = await axios.get('http://localhost:3000/health');
    console.log('✅ Server is running!');
    console.log('   Status:', response.data.message);
    console.log('   Uptime:', response.data.uptime, 'seconds');
    console.log('');

    // Test complaints endpoint
    const complaintsResponse = await axios.get('http://localhost:3000/api/complaints');
    console.log('✅ Complaints API is working!');
    console.log('   Found', complaintsResponse.data.data.length, 'complaints');
    console.log('');

    console.log('🎉 All tests passed! The middleware fix worked.');

  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Server is not running. Please start it with: npm run dev');
    } else {
      console.error('❌ Test failed:', error.message);
    }
    process.exit(1);
  }
}

// Run test
if (require.main === module) {
  testServer();
}

module.exports = { testServer };
