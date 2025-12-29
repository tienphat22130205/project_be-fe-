import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function verifyProfileUpdate() {
    try {
        // 1. Register a new user
        const email = `test.user.${Date.now()}@example.com`;
        const password = 'password123';
        console.log(`Creating user: ${email}`);

        const registerRes = await axios.post(`${API_URL}/auth/register`, {
            email,
            password,
            fullName: 'Test User',
        });

        const { accessToken, user } = registerRes.data.data;
        console.log('User created, ID:', user._id);

        // 2. Update profile with new fields
        console.log('Updating profile...');
        const updateData = {
            fullName: 'Updated Name',
            gender: 'Nam',
            address: '123 Test St, Test City',
            taxId: 'TAX123456',
            dateOfBirth: '1990-01-01',
        };

        const updateRes = await axios.put(
            `${API_URL}/auth/profile`,
            updateData,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        );

        const updatedUser = updateRes.data.data.user;

        // 3. Verify fields
        console.log('Verifying updates...');
        let passed = true;

        if (updatedUser.fullName !== updateData.fullName) {
            console.error(`Mismatch: fullName. Expected ${updateData.fullName}, got ${updatedUser.fullName}`);
            passed = false;
        }
        if (updatedUser.gender !== updateData.gender) {
            console.error(`Mismatch: gender. Expected ${updateData.gender}, got ${updatedUser.gender}`);
            passed = false;
        }
        if (updatedUser.address !== updateData.address) {
            console.error(`Mismatch: address. Expected ${updateData.address}, got ${updatedUser.address}`);
            passed = false;
        }
        if (updatedUser.taxId !== updateData.taxId) {
            console.error(`Mismatch: taxId. Expected ${updateData.taxId}, got ${updatedUser.taxId}`);
            passed = false;
        }
        if (!updatedUser.dateOfBirth.startsWith('1990-01-01')) { // Basic date check
            console.error(`Mismatch: dateOfBirth. Expected to start with 1990-01-01, got ${updatedUser.dateOfBirth}`);
            passed = false;
        }

        if (passed) {
            console.log('SUCCESS: Profile update verification passed!');
        } else {
            console.log('FAILURE: Profile update verification failed.');
        }

    } catch (error: any) {
        console.error('Error during verification:', error.response?.data || error.message);
    }
}

verifyProfileUpdate();
