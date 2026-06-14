const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Auth Endpoints
app.post('/register', (req, res) => {
    const { email, password } = req.body;
    const id = uuidv4();
    // In a real app, hash password here.
    const password_hash = password; // Mocked
    
    db.run(`INSERT INTO Users (id, email, password_hash) VALUES (?, ?, ?)`, [id, email, password_hash], function(err) {
        if (err) {
            return res.status(400).json({ error: 'User already exists or invalid data' });
        }
        res.json({ id, email });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT id, email FROM Users WHERE email = ? AND password_hash = ?`, [email, password], (err, row) => {
        if (err || !row) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.json({ id: row.id, email: row.email });
    });
});

// Mocked Auth Middleware for simplicity in MVP: expects user_id in headers
const authMiddleware = (req, res, next) => {
    const userId = req.headers['user-id'];
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    req.userId = userId;
    next();
};

// Basket Endpoints
app.get('/basket', authMiddleware, (req, res) => {
    db.get(`SELECT * FROM Baskets WHERE user_id = ?`, [req.userId], (err, basket) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!basket) return res.json(null);

        db.all(`SELECT * FROM BasketItems WHERE basket_id = ?`, [basket.id], (err, items) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ ...basket, items });
        });
    });
});

app.post('/basket', authMiddleware, (req, res) => {
    const { name } = req.body;
    const basketId = uuidv4();
    const basketName = name || 'Home Basket';

    db.run(`INSERT INTO Baskets (id, user_id, name) VALUES (?, ?, ?)`, [basketId, req.userId, basketName], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: basketId, user_id: req.userId, name: basketName, items: [] });
    });
});

app.put('/basket/:id', authMiddleware, (req, res) => {
    const { name } = req.body;
    const basketId = req.params.id;

    db.run(`UPDATE Baskets SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?`, [name, basketId, req.userId], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.delete('/basket/:id', authMiddleware, (req, res) => {
    const basketId = req.params.id;
    db.run(`DELETE FROM Baskets WHERE id = ? AND user_id = ?`, [basketId, req.userId], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// Item Endpoints
app.post('/basket/:id/item', authMiddleware, (req, res) => {
    const basketId = req.params.id;
    const { product_name, quantity, unit } = req.body;
    const itemId = uuidv4();

    db.run(`INSERT INTO BasketItems (id, basket_id, product_name, quantity, unit) VALUES (?, ?, ?, ?, ?)`, 
    [itemId, basketId, product_name, quantity, unit], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: itemId, basket_id: basketId, product_name, quantity, unit });
    });
});

app.put('/item/:id', authMiddleware, (req, res) => {
    const itemId = req.params.id;
    const { product_name, quantity, unit } = req.body;

    db.run(`UPDATE BasketItems SET product_name = ?, quantity = ?, unit = ? WHERE id = ?`, 
    [product_name, quantity, unit, itemId], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.delete('/item/:id', authMiddleware, (req, res) => {
    const itemId = req.params.id;
    db.run(`DELETE FROM BasketItems WHERE id = ?`, [itemId], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// Repeat Action
app.post('/basket/:id/repeat', authMiddleware, (req, res) => {
    // In a real app, this would trigger an order or add to cart.
    // For MVP, just return success.
    res.json({ success: true, message: "Your basket is ready to reorder." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
