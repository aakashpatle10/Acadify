// Test script to verify QR generation endpoint
// This script tests the authentication and QR generation flow

const API_URL = 'http://localhost:9000';

async function testQRGeneration() {
    console.log('🧪 Testing QR Generation Endpoint\n');

    // Step 1: Login as a teacher
    console.log('Step 1: Logging in as teacher...');
    try {
        const loginResponse = await fetch(`${API_URL}/api/teacher/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'teacher@test.com', // Update with actual test teacher email
                password: 'Test@123' // Update with actual password
            })
        });

        const loginData = await loginResponse.json();

        if (!loginResponse.ok) {
            console.error('❌ Login failed:', loginData);
            console.log('\n⚠️  Please update the email and password in this test script with valid teacher credentials');
            return;
        }

        console.log('✅ Login successful');
        const token = loginData.token;
        console.log('Token:', token.substring(0, 20) + '...\n');

        // Step 2: Generate QR code
        console.log('Step 2: Generating QR code...');
        const qrResponse = await fetch(`${API_URL}/api/qr/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                timetableId: '507f1f77bcf86cd799439011', // Dummy timetable ID - update with real one
                expiresInSeconds: 30
            })
        });

        const qrData = await qrResponse.json();

        if (!qrResponse.ok) {
            console.error('❌ QR Generation failed:', qrData);
            if (qrData.message === 'User not authenticated') {
                console.log('\n🔍 This was the original error! Let\'s check if it\'s fixed...');
            }
            return;
        }

        console.log('✅ QR Generation successful!');
        console.log('Session ID:', qrData.sessionId);
        console.log('Expires At:', qrData.expiresAt);
        console.log('\n🎉 Test passed! The authentication issue is fixed.');

    } catch (error) {
        console.error('❌ Test failed with error:', error.message);
    }
}

// Run the test
testQRGeneration();
