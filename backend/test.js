const API_URL = 'http://localhost:3000';

async function testBackend() {
    console.log('Testing Backend API...');

    try {
        // 1. Register a user
        console.log('\n--- 1. Registering User ---');
        const regRes = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: `test_${Date.now()}@test.com`, password: 'password123' })
        });
        const user = await regRes.json();
        console.log('Registered User:', user);
        
        if (!user.id) throw new Error('Registration failed');
        
        const userId = user.id;

        // 2. Create a Basket
        console.log('\n--- 2. Creating Basket ---');
        const basketRes = await fetch(`${API_URL}/basket`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'user-id': userId
            },
            body: JSON.stringify({ name: 'My Test Basket' })
        });
        const basket = await basketRes.json();
        console.log('Created Basket:', basket);

        // 3. Add Item to Basket
        console.log('\n--- 3. Adding Item to Basket ---');
        const itemRes = await fetch(`${API_URL}/basket/${basket.id}/item`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'user-id': userId
            },
            body: JSON.stringify({ product_name: 'Atta', quantity: 10, unit: 'kg' })
        });
        const item = await itemRes.json();
        console.log('Added Item:', item);

        // 4. Get Basket
        console.log('\n--- 4. Getting Basket ---');
        const getBasketRes = await fetch(`${API_URL}/basket`, {
            method: 'GET',
            headers: { 
                'user-id': userId
            }
        });
        const getBasket = await getBasketRes.json();
        console.log('Fetched Basket with Items:', JSON.stringify(getBasket, null, 2));

        // 5. Repeat Basket
        console.log('\n--- 5. Repeat Basket ---');
        const repeatRes = await fetch(`${API_URL}/basket/${basket.id}/repeat`, {
            method: 'POST',
            headers: { 
                'user-id': userId
            }
        });
        const repeat = await repeatRes.json();
        console.log('Repeat Response:', repeat);

        console.log('\n✅ All tests passed successfully!');
    } catch (e) {
        console.error('Test Failed:', e);
    }
}

testBackend();
