const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'basketly.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        db.serialize(() => {
            // Create Users Table
            db.run(`CREATE TABLE IF NOT EXISTS Users (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE,
                password_hash TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);

            // Create Baskets Table
            db.run(`CREATE TABLE IF NOT EXISTS Baskets (
                id TEXT PRIMARY KEY,
                user_id TEXT,
                name TEXT DEFAULT 'Home Basket',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES Users(id)
            )`);

            // Create Basket Items Table
            db.run(`CREATE TABLE IF NOT EXISTS BasketItems (
                id TEXT PRIMARY KEY,
                basket_id TEXT,
                product_name TEXT,
                quantity REAL,
                unit TEXT,
                FOREIGN KEY (basket_id) REFERENCES Baskets(id) ON DELETE CASCADE
            )`);
        });
    }
});

module.exports = db;
