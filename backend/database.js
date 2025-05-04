const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbFile = path.join(__dirname, 'chat.db');
const initScript = fs.readFileSync(path.join(__dirname, 'db/init.sql'), 'utf-8');

const db = new sqlite3.Database(dbFile);

db.serialize(() => {
  db.exec(initScript, (err) => {
    if (err) console.error('DB Init Error:', err);
    else console.log('Database initialized');
  });
});

module.exports = db;
