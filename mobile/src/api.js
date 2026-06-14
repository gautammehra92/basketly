const API_URL = 'http://localhost:3000'; // Change to computer's local IP for physical device testing, e.g., 'http://192.168.1.5:3000'

export const loginUser = async (email, password) => {
    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
};

export const registerUser = async (email, password) => {
    const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error('Registration failed');
    return res.json();
};

export const getBasket = async (userId) => {
    const res = await fetch(`${API_URL}/basket`, {
        headers: { 'user-id': userId }
    });
    if (!res.ok) throw new Error('Failed to fetch basket');
    return res.json();
};

export const createBasket = async (userId, name) => {
    const res = await fetch(`${API_URL}/basket`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'user-id': userId },
        body: JSON.stringify({ name })
    });
    if (!res.ok) throw new Error('Failed to create basket');
    return res.json();
};

export const addItemToBasket = async (userId, basketId, item) => {
    const res = await fetch(`${API_URL}/basket/${basketId}/item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'user-id': userId },
        body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error('Failed to add item');
    return res.json();
};

export const repeatBasket = async (userId, basketId) => {
    const res = await fetch(`${API_URL}/basket/${basketId}/repeat`, {
        method: 'POST',
        headers: { 'user-id': userId }
    });
    if (!res.ok) throw new Error('Failed to repeat basket');
    return res.json();
};
