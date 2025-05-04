const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const http = require('http');
const db = require('./database');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const authRoutes = require('./routes/auth');
const channelRoutes = require('./routes/channels');
app.use('/api/auth', authRoutes);
app.use('/api/channels', channelRoutes);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = {};

wss.on('connection', (ws) => {
  ws.on('message', (raw) => {
    const msg = JSON.parse(raw);
    const { channel_id, username, content } = msg;
    db.run(`INSERT INTO messages (channel_id, user_id, content) VALUES (?, ?, ?)`,
      [channel_id, msg.user_id, content]);

    // Broadcast to all
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(msg));
      }
    });
  });
});

server.listen(3001, () => console.log('Backend running on http://localhost:3001'));
