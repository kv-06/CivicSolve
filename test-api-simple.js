const http = require('http');

function testAPI() {
  console.log('🧪 Testing API endpoints...\n');

  // Test /api endpoint
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`✅ /api endpoint: Status ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('   Response:', response.message);
        console.log('   Available endpoints:', Object.keys(response.endpoints));
        console.log('');
        
        // Test /api/complaints endpoint
        testComplaintsAPI();
      } catch (error) {
        console.error('   Error parsing response:', error.message);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Connection failed:', error.message);
    console.log('   Make sure the server is running on port 3000');
  });

  req.end();
}

function testComplaintsAPI() {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/complaints',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`✅ /api/complaints endpoint: Status ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        if (response.success) {
          console.log('   Found', response.data.length, 'complaints');
          console.log('   Pagination:', response.pagination);
        } else {
          console.log('   Error:', response.message);
        }
        console.log('');
        console.log('🎉 API is working correctly!');
      } catch (error) {
        console.error('   Error parsing response:', error.message);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Complaints API failed:', error.message);
  });

  req.end();
}

testAPI();
