const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./chat.db', (err) => {
  if (err) {
    console.error('❌ ไม่สามารถเชื่อมต่อกับฐานข้อมูล:', err.message);
  } else {
    console.log('✅ เชื่อมต่อฐานข้อมูล SQLite สำเร็จ');
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT CHECK(role IN ('admin', 'user'))
    )
  `);
  db.run(`
    INSERT OR IGNORE INTO users (
      username, password, role
    ) VALUES (
      'admin',
      'password',
      'admin'
    );
  `);

  db.run(`
    INSERT OR IGNORE INTO users (
      username, password, role
    ) VALUES (
      'user',
      'password',
      'user'
    );
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS channels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      channel_id INTEGER,
      content TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(channel_id) REFERENCES channels(id)
    )
  `);
});

module.exports = db;
