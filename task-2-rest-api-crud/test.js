const http = require('http');

const BASE_URL = 'http://localhost:3000';
let userId, productId;

// Helper function for HTTP requests
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

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

// Test runner
async function runTests() {
  console.log('🚀 Starting CRUD API Tests...\n');
  
  try {
    // Test 1: Create User
    console.log('✓ TEST 1: Create User');
    const createUser = await makeRequest('POST', '/api/users', {
      name: 'John Doe',
      email: 'john@example.com',
      age: 25
    });
    console.log(`  Status: ${createUser.status}`);
    console.log(`  Response:`, createUser.data);
    userId = createUser.data.id;
    console.log('');

    // Test 2: Get All Users
    console.log('✓ TEST 2: Get All Users');
    const getAllUsers = await makeRequest('GET', '/api/users');
    console.log(`  Status: ${getAllUsers.status}`);
    console.log(`  Count: ${getAllUsers.data.count} users`);
    console.log('');

    // Test 3: Get User by ID
    console.log('✓ TEST 3: Get User by ID');
    const getUser = await makeRequest('GET', `/api/users/${userId}`);
    console.log(`  Status: ${getUser.status}`);
    console.log(`  User:`, getUser.data);
    console.log('');

    // Test 4: Update User
    console.log('✓ TEST 4: Update User');
    const updateUser = await makeRequest('PUT', `/api/users/${userId}`, {
      name: 'John Updated',
      email: 'john.updated@example.com',
      age: 26
    });
    console.log(`  Status: ${updateUser.status}`);
    console.log(`  Response:`, updateUser.data);
    console.log('');

    // Test 5: Create Product
    console.log('✓ TEST 5: Create Product');
    const createProduct = await makeRequest('POST', '/api/products', {
      name: 'Laptop',
      description: 'High-performance laptop',
      price: 999.99,
      stock: 50
    });
    console.log(`  Status: ${createProduct.status}`);
    console.log(`  Response:`, createProduct.data);
    productId = createProduct.data.id;
    console.log('');

    // Test 6: Get All Products
    console.log('✓ TEST 6: Get All Products');
    const getAllProducts = await makeRequest('GET', '/api/products');
    console.log(`  Status: ${getAllProducts.status}`);
    console.log(`  Count: ${getAllProducts.data.count} products`);
    console.log('');

    // Test 7: Update Product
    console.log('✓ TEST 7: Update Product');
    const updateProduct = await makeRequest('PUT', `/api/products/${productId}`, {
      name: 'Gaming Laptop',
      description: 'High-performance gaming laptop',
      price: 1299.99,
      stock: 30
    });
    console.log(`  Status: ${updateProduct.status}`);
    console.log(`  Response:`, updateProduct.data);
    console.log('');

    // Test 8: Validation Test - Invalid Email
    console.log('✓ TEST 8: Validation - Invalid Email');
    const invalidEmail = await makeRequest('POST', '/api/users', {
      name: 'Test User',
      email: 'invalid-email'
    });
    console.log(`  Status: ${invalidEmail.status} (should be 400)`);
    console.log(`  Response:`, invalidEmail.data);
    console.log('');

    // Test 9: Validation Test - Missing Required Field
    console.log('✓ TEST 9: Validation - Missing Price');
    const missingPrice = await makeRequest('POST', '/api/products', {
      name: 'Test Product'
    });
    console.log(`  Status: ${missingPrice.status} (should be 400)`);
    console.log(`  Response:`, missingPrice.data);
    console.log('');

    // Test 10: Delete Product
    console.log('✓ TEST 10: Delete Product');
    const deleteProduct = await makeRequest('DELETE', `/api/products/${productId}`);
    console.log(`  Status: ${deleteProduct.status}`);
    console.log(`  Response:`, deleteProduct.data);
    console.log('');

    // Test 11: Delete User
    console.log('✓ TEST 11: Delete User');
    const deleteUser = await makeRequest('DELETE', `/api/users/${userId}`);
    console.log(`  Status: ${deleteUser.status}`);
    console.log(`  Response:`, deleteUser.data);
    console.log('');

    console.log('✅ All tests completed successfully!\n');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Wait for server to be ready
setTimeout(() => {
  runTests();
}, 2000);
