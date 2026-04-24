import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = 'http://localhost:5000/api';
const ADMIN_EMAIL = 'admin@caterking.com';
const ADMIN_PASSWORD = 'admin123';

async function testAdminAPI() {
  console.log('--- Cater King Admin API Test ---');

  try {
    // 1. Admin Login
    console.log('\n1. Testing Admin Login...');
    const loginRes = await axios.post(`${API_URL}/admin/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });

    const token = loginRes.data.token;
    console.log('✓ Login successful');
    console.log(`✓ Received token: ${token.substring(0, 20)}...`);

    const authConfig = {
      headers: { Authorization: `Bearer ${token}` }
    };

    // 2. Fetch Dashboard Stats
    console.log('\n2. Testing Dashboard Stats (Protected)...');
    const statsRes = await axios.get(`${API_URL}/admin/stats`, authConfig);
    console.log('✓ Stats fetched:', statsRes.data);

    // 3. Fetch Menu Items
    console.log('\n3. Testing Menu Fetch (Protected)...');
    const menuRes = await axios.get(`${API_URL}/admin/menu`, authConfig);
    console.log(`✓ Fetched ${menuRes.data.length} menu items`);

    // 4. Test Error Handling (Invalid Credentials)
    console.log('\n4. Testing Invalid Login...');
    try {
      await axios.post(`${API_URL}/admin/login`, {
        email: ADMIN_EMAIL,
        password: 'wrongpassword'
      });
      console.log('✗ Failed: Should have received 401');
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.log('✓ Successfully caught 401 Unauthorized');
      } else {
        throw error;
      }
    }

    console.log('\n--- All Tests Passed Successfully! ---');
  } catch (error: any) {
    console.error('\n✗ Test Failed:');
    if (error.response) {
      console.error(`  Status: ${error.response.status}`);
      console.error(`  Data: ${JSON.stringify(error.response.data)}`);
    } else {
      console.error(`  Message: ${error.message}`);
    }
    process.exit(1);
  }
}

testAdminAPI();
