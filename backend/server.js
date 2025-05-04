const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const http = require('http');
const db = require('./db/db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
const authRoutes = require('./routes/auth');
const channelRoutes = require('./routes/channels');
app.use('/auth', authRoutes);
app.use('/channels', channelRoutes);

// WebSocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  ws.on('message', (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw);
    } catch (err) {
      console.error('Invalid JSON received:', raw);
      return;
    }

    const { channel_id, user_id, username, content } = msg;
    const timestamp = new Date().toISOString();

    db.run(
      `INSERT INTO messages (channel_id, user_id, content) VALUES (?, ?, ?)`,
      [channel_id, user_id, content],
      (err) => {
        if (err) {
          console.error('Failed to insert message:', err.message);
          return;
        }

        const broadcastMsg = {
          channel_id,
          user_id,
          username,
          content,
          timestamp
        };

        // Broadcast to all clients except sender (optional)
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN && client !== ws) {
            client.send(JSON.stringify(broadcastMsg));
          }
        });
      }
    );
  });
});

server.listen(3001, () => console.log('Backend running on http://localhost:3001'));
