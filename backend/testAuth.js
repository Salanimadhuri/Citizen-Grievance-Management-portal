const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAuth() {
  console.log('🧪 Testing Authentication System...\n');

  try {
    // Test 1: Register a new user
    console.log('1️⃣ Testing Registration...');
    const registerData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      phone: '9876543210',
      password: 'password123',
      role: 'citizen'
    };

    const registerResponse = await axios.post(`${API_URL}/auth/register`, registerData);
    console.log('✅ Registration successful!');
    console.log('Token:', registerResponse.data.token.substring(0, 20) + '...');
    console.log('User:', registerResponse.data.name, '-', registerResponse.data.role);

    // Test 2: Login with the registered user
    console.log('\n2️⃣ Testing Login...');
    const loginData = {
      email: registerData.email,
      password: registerData.password
    };

    const loginResponse = await axios.post(`${API_URL}/auth/login`, loginData);
    console.log('✅ Login successful!');
    console.log('Token:', loginResponse.data.token.substring(0, 20) + '...');
    console.log('User:', loginResponse.data.name, '-', loginResponse.data.role);

    // Test 3: Test with wrong password
    console.log('\n3️⃣ Testing Wrong Password...');
    try {
      await axios.post(`${API_URL}/auth/login`, {
        email: registerData.email,
        password: 'wrongpassword'
      });
      console.log('❌ Should have failed!');
    } catch (error) {
      console.log('✅ Correctly rejected:', error.response.data.message);
    }

    console.log('\n✅ All authentication tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAuth();
