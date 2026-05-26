const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');

const app = express();
const db = new sqlite3.Database('orders.db');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({ secret: 'key', resave: false, saveUninitialized: true }));

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        login TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        address TEXT NOT NULL,
        contact TEXT NOT NULL,
        service_type TEXT NOT NULL,
        desired_date TEXT NOT NULL,
        desired_time TEXT NOT NULL,
        payment_type TEXT NOT NULL,
        status TEXT DEFAULT 'Новая заявка',
        cancel_reason TEXT,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);
});

app.post('/api/register', (req, res) => {
    const { login, password, name, phone, email } = req.body;
    if (!login || !password || !name || !phone || !email) {
        return res.json({ success: false });
    }
    db.run('INSERT INTO users (login, password, name, phone, email) VALUES (?, ?, ?, ?, ?)',
        [login, password, name, phone, email],
        function(err) {
            if (err) {
                return res.json({ success: false });
            }
            res.json({ success: true });
        }
    );
});

app.post('/api/login', (req, res) => {
    const { login, password } = req.body;
    if (login === 'adminka' && password === 'password') {
        req.session.user = { role: 'admin', name: 'Администратор' };
        return res.json({ success: true, role: 'admin' });
    }
    db.get('SELECT * FROM users WHERE login = ? AND password = ?', [login, password], (err, user) => {
        if (!user) {
            return res.json({ success: false });
        }
        req.session.user = { id: user.id, role: 'user', name: user.name };
        res.json({ success: true, role: 'user' });
    });
});

app.post('/api/logout', (req, res) => {
    req.session.user = null;
    res.json({ success: true });
});

app.post('/api/add', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'user') {
        return res.json({ success: false });
    }
    const { address, contact, service_type, desired_date, desired_time, payment_type } = req.body;
    db.run('INSERT INTO orders (user_id, address, contact, service_type, desired_date, desired_time, payment_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [req.session.user.id, address, contact, service_type, desired_date, desired_time, payment_type],
        function(err) {
            if (err){
                return res.json({ success: false });
            }
            res.json({ success: true });
        }
    );
});

app.get('/api/orders', (req, res) => {
    if (!req.session.user) return res.json({ success: false });

    let query;
    let params = [];

    if (req.session.user.role === 'admin') {
        query = `SELECT orders.*, users.name as user_name FROM orders JOIN users ON orders.user_id = users.id ORDER BY orders.id DESC`;
    } else {
        query = 'SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC';
        params = [req.session.user.id];
    }

    db.all(query, params, (err, orders) => {
        if (err) {
            return res.json({ success: false });
        }
        res.json({ orders: orders, role: req.session.user.role });
    });
});

app.post('/api/status', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.json({ success: false });
    }
    const { id, status, cancel_reason } = req.body;
    db.run('UPDATE orders SET status = ?, cancel_reason = ? WHERE id = ?',
        [status, cancel_reason || null, id],
        function(err) {
            if (err) {
                return res.json({ success: false });
            }
            res.json({ success: true });
        }
    );
});

app.listen(3000, () => console.log('http://localhost:3000'));