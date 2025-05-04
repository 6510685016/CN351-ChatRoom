# Chat

โปรเจคนี้คือ Real-time chat web application ที่มีไว้สำหรับให้ user และ admin สามารถส่งและรับข้อความหากันแบบ Real-time และ admin สามารถสร้าง channel สำหรับพูดคุยใหม่ได้แต่ application นี้มีช่องโหว่บางอย่างที่จะอธิบายไว้ด้านล่าง
** โปรเจคแอปเพื่อการศึกษา Web security เท่านั้น

---

## Tech Stack
- React.js (Frontend)
- Node.js + Express + WebSocket (Backend)
- SQLite (Database)
- Docker + Docker Compose

---

## Starting App

### 1. Clone and Setup
```bash
git clone https://github.com/6510685016/CN351-ChatRoom ChatRoom
```

### 2. Start Application
```bash
cd ChatRoom
docker compose up -d
```

### 3. สามารถใช้งานได้ผ่าน
- Web App: http://localhost:3000
- Server: http://localhost:3001

### 4. Stop Application
```bash
docker compose down
```

---
## user and admin
### admin 
- username : admin
- password : password

### user
- username : user1
- password : password

### user2
- username : user2
- password : password

---