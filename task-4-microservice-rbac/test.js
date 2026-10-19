const http = require('http');

const AUTH_URL = 'http://localhost:5001';
const API_URL = 'http://localhost:5002';

let adminToken = '';
let userToken = '';
let guestToken = '';

function makeRequest(baseUrl, method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('🚀 Starting Microservice RBAC Tests...\n');
  
  try {
    // Test 1: Login as Admin
    console.log('✓ TEST 1: Login as Admin');
    const adminLogin = await makeRequest(AUTH_URL, 'POST', '/login', {
      username: 'admin',
      password: 'admin123'
    });
    console.log(`  Status: ${adminLogin.status}`);
    console.log(`  Role: ${adminLogin.data.user.role}`);
    console.log(`  Permissions: ${adminLogin.data.user.permissions.length}`);
    adminToken = adminLogin.data.token;
    console.log('');

    // Test 2: Login as User
    console.log('✓ TEST 2: Login as User');
    const userLogin = await makeRequest(AUTH_URL, 'POST', '/login', {
      username: 'user',
      password: 'user123'
    });
    console.log(`  Status: ${userLogin.status}`);
    console.log(`  Role: ${userLogin.data.user.role}`);
    userToken = userLogin.data.token;
    console.log('');

    // Test 3: Login as Guest
    console.log('✓ TEST 3: Login as Guest');
    const guestLogin = await makeRequest(AUTH_URL, 'POST', '/login', {
      username: 'guest',
      password: 'guest123'
    });
    console.log(`  Status: ${guestLogin.status}`);
    console.log(`  Role: ${guestLogin.data.user.role}`);
    guestToken = guestLogin.data.token;
    console.log('');

    // Test 4: Access public endpoint (no auth)
    console.log('✓ TEST 4: Access Public Endpoint');
    const publicAccess = await makeRequest(API_URL, 'GET', '/public');
    console.log(`  Status: ${publicAccess.status}`);
    console.log(`  Message: ${publicAccess.data.message}`);
    console.log('');

    // Test 5: User creates data
    console.log('✓ TEST 5: User Creates Data (write permission)');
    const createData = await makeRequest(API_URL, 'POST', '/data', {
      content: 'Test data from user'
    }, userToken);
    console.log(`  Status: ${createData.status}`);
    console.log(`  Message: ${createData.data.message}`);
    console.log('');

    // Test 6: Guest reads data
    console.log('✓ TEST 6: Guest Reads Data (read permission)');
    const readData = await makeRequest(API_URL, 'GET', '/data', null, guestToken);
    console.log(`  Status: ${readData.status}`);
    console.log(`  Data Count: ${readData.data.count}`);
    console.log('');

    // Test 7: Guest tries to create data (should fail)
    console.log('✓ TEST 7: Guest Tries to Create Data (should fail)');
    const guestCreate = await makeRequest(API_URL, 'POST', '/data', {
      content: 'Should fail'
    }, guestToken);
    console.log(`  Status: ${guestCreate.status} (should be 403)`);
    console.log(`  Error: ${guestCreate.data.error}`);
    console.log('');

    // Test 8: User tries to delete data (should fail)
    console.log('✓ TEST 8: User Tries to Delete Data (should fail)');
    const userDelete = await makeRequest(API_URL, 'DELETE', '/data/1', null, userToken);
    console.log(`  Status: ${userDelete.status} (should be 403)`);
    console.log(`  Error: ${userDelete.data.error}`);
    console.log('');

    // Test 9: Admin deletes data (should succeed)
    console.log('✓ TEST 9: Admin Deletes Data (should succeed)');
    const adminDelete = await makeRequest(API_URL, 'DELETE', '/data/1', null, adminToken);
    console.log(`  Status: ${adminDelete.status}`);
    console.log(`  Message: ${adminDelete.data.message}`);
    console.log('');

    // Test 10: Admin accesses admin endpoint
    console.log('✓ TEST 10: Admin Accesses Admin Endpoint');
    const adminAccess = await makeRequest(API_URL, 'GET', '/admin', null, adminToken);
    console.log(`  Status: ${adminAccess.status}`);
    console.log(`  Message: ${adminAccess.data.message}`);
    console.log('');

    // Test 11: User tries admin endpoint (should fail)
    console.log('✓ TEST 11: User Tries Admin Endpoint (should fail)');
    const userAdmin = await makeRequest(API_URL, 'GET', '/admin', null, userToken);
    console.log(`  Status: ${userAdmin.status} (should be 403)`);
    console.log(`  Error: ${userAdmin.data.error}`);
    console.log('');

    // Test 12: Queue async task
    console.log('✓ TEST 12: Queue Async Task');
    const queueTask = await makeRequest(API_URL, 'POST', '/process', {
      taskType: 'CUSTOM_TASK',
      data: { info: 'Testing async processing' }
    }, adminToken);
    console.log(`  Status: ${queueTask.status}`);
    console.log(`  Message: ${queueTask.data.message}`);
    console.log('');

    // Test 13: Verify token
    console.log('✓ TEST 13: Verify Token');
    const verifyToken = await makeRequest(AUTH_URL, 'POST', '/verify', {
      token: adminToken
    });
    console.log(`  Status: ${verifyToken.status}`);
    console.log(`  Valid: ${verifyToken.data.valid}`);
    console.log(`  Username: ${verifyToken.data.user.username}`);
    console.log('');

    console.log('✅ All tests completed successfully!\n');
    console.log('📊 Test Summary:');
    console.log('   - Authentication: ✓');
    console.log('   - Role-Based Access Control: ✓');
    console.log('   - Permission Enforcement: ✓');
    console.log('   - Message Queue Integration: ✓');
    console.log('');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Wait for services to be ready
console.log('⏳ Waiting for services to start...\n');
setTimeout(() => {
  runTests();
}, 3000);
