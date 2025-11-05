// Simple test script for authentication endpoints
const BASE_URL = 'http://localhost:3000';

async function testSignup() {
  console.log('\n🔵 Testing Signup...');
  
  const testUser = {
    fullName: 'Abderrahmane Raquibi',
    email: `Abderrahmaneraquibi@gmail.com`, // Unique email
    password: '@@12raquibi',
    confirmPassword: '@@12raquibi'
  };

  try {
    const response = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Signup successful!');
      console.log('User:', data.user);
      return testUser;
    } else {
      console.log('❌ Signup failed:', data.error);
      return null;
    }
  } catch (error) {
    console.log('❌ Signup error:', error.message);
    return null;
  }
}

async function testSignin(email, password) {
  console.log('\n🔵 Testing Signin...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Signin successful!');
      console.log('User:', data.user);
      return true;
    } else {
      console.log('❌ Signin failed:', data.error);
      return false;
    }
  } catch (error) {
    console.log('❌ Signin error:', error.message);
    return false;
  }
}

async function testInvalidSignin() {
  console.log('\n🔵 Testing Invalid Signin...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: 'wrong@example.com', 
        password: 'wrongpassword' 
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.log('✅ Invalid signin correctly rejected:', data.error);
      return true;
    } else {
      console.log('❌ Invalid signin should have failed!');
      return false;
    }
  } catch (error) {
    console.log('❌ Test error:', error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting Authentication Tests...');
  console.log('Base URL:', BASE_URL);
  
  // Wait a bit for server to be ready
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test 1: Signup
  const testUser = await testSignup();
  
  if (testUser) {
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Test 2: Signin with created user
    await testSignin(testUser.email, testUser.password);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Test 3: Invalid signin
    await testInvalidSignin();
  }
  
  console.log('\n✨ Tests completed!\n');
}

runTests();
