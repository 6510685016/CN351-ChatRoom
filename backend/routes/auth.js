const express = require('express');
const db = require('../database');
const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  db.get(query, (err, row) => {
    if (row) res.json({ success: true, user: row });
    else res.status(401).json({ success: false, message: 'Invalid credentials' });
  });
});

router.post('/register', (req, res) => {
  const { username, password } = req.body;
  db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, password], function (err) {
    if (err) res.status(400).json({ success: false, message: err.message });
    else res.json({ success: true, user: { id: this.lastID, username } });
  });
});

module.exports = router;
