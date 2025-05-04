const express = require('express');
const router = express.Router();
const db = require('../db/db');

// สร้าง channel
router.post('/create', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Channel name is required' });
  }

  db.run(`INSERT INTO channels (name) VALUES (?)`, [name], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to create channel' });
    }

    res.status(201).json({ channel: { id: this.lastID, name } });
  });
});

// เข้าร่วม channel ด้วย ID
router.post('/join', (req, res) => {
  const { channelId } = req.body;
  db.get('SELECT * FROM channels WHERE id = ?', [channelId], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!row) return res.status(404).json({ error: 'Channel not found' });
    res.json({ channel: row });
  });
});

// แสดงรายการ channel ทั้งหมด
router.get('/', (req, res) => {
  db.all('SELECT * FROM channels', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

// ส่งข้อความ
router.post('/messages', (req, res) => {
  const { user_id, channel_id, content } = req.body;
  db.run(
    'INSERT INTO messages (user_id, channel_id, content) VALUES (?, ?, ?)',
    [user_id, channel_id, content],
    function (err) {
      if (err) return res.status(400).json({ error: 'Failed to send message' });
      res.json({ success: true, messageId: this.lastID });
    }
  );
});

// ดึงข้อความใน channel
router.get('/:channel_id/messages', (req, res) => {
  const { channel_id } = req.params;
  db.all(
    `SELECT messages.id, messages.content, messages.timestamp, users.username
     FROM messages
     JOIN users ON messages.user_id = users.id
     WHERE channel_id = ?
     ORDER BY timestamp ASC`,
    [channel_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Failed to get messages' });
      res.json(rows);
    }
  );
});

module.exports = router;
