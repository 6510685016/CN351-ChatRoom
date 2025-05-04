const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.post('/register', (req, res) => {
  const { username, password } = req.body;
  const userRole = username === 'admin' ? 'admin' : 'user';

  const sql = `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`;
  db.run(sql, [username, password, userRole], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, username: username, role: userRole });
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;

  db.get(sql, [username, password], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    // ส่ง role กลับไปด้วย
    res.json({ id: user.id, username: user.username, role: user.role });
  });
});

module.exports = router;
