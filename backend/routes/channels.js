const express = require('express');
const db = require('../database');
const router = express.Router();

router.post('/join', (req, res) => {
  const { channelId } = req.body;
  const query = `SELECT * FROM channels WHERE id = ${channelId}`;
  db.get(query, (err, row) => {
    if (row) res.json({ success: true, channel: row });
    else res.status(404).json({ success: false, message: 'Channel not found' });
  });
});

module.exports = router;
