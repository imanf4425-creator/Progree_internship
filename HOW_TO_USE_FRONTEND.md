# 🎨 React Frontend Guide

## ⚡ Quick Start

### Step 1: Start All Services
Double-click: `START_EVERYTHING.bat`

This launches:
- Task 2 REST API → Port 3000
- Task 3 WebSocket Chat → Port 4000
- Task 4 Auth Service → Port 5001
- Task 4 API Service → Port 5002
- React Frontend → Port 3001

### Step 2: Open Browser
Navigate to: **http://localhost:3001**

---

## 🧭 Frontend Pages

### 1️⃣ Users Management (`/users`)
**Tests Task 2 - REST API CRUD**

#### Features:
- ➕ Create new users (name, email, age)
- ✏️ Edit existing users
- 🗑️ Delete users
- 📋 View all users in table
- 🔄 Real-time refresh

#### How to Use:
1. Fill the form at top (Name & Email required)
2. Click "Create User"
3. User appears in table below
4. Click ✏️ to edit or 🗑️ to delete

---

### 2️⃣ Products Management (`/products`)
**Tests Task 2 - REST API CRUD**

#### Features:
- ➕ Create products (name, description, price, stock)
- ✏️ Edit product details
- 🗑️ Delete products
- 💰 Price formatting in rupees
- 📊 Stock tracking (in-stock/out-of-stock)

#### How to Use:
1. Fill product form (Name & Price required)
2. Click "Create Product"
3. Product appears in table
4. Edit or delete using action buttons

---

### 3️⃣ Real-Time Chat (`/chat`)
**Tests Task 3 - WebSocket Communication**

#### Features:
- 💬 Real-time messaging with Socket.io
- 🔴 Live online user count
- 📢 Multiple channels (general, random, tech)
- 👥 Online users sidebar
- 📝 Chat logs saved automatically

#### How to Use:
1. Enter your username
2. Click "Connect to Chat"
3. Select a channel (#general, #random, #tech)
4. Type and send messages
5. See other users online in sidebar

---

### 4️⃣ Authentication & RBAC (`/auth`)
**Tests Task 4 - Microservice with JWT & RBAC**

#### Features:
- 🔐 Login with JWT authentication
- 📝 Register new users
- 👑 Role-based access (User, Moderator, Admin)
- 🧪 Test API endpoints by role
- 🔒 Permission-based access control

#### Test Accounts:
- **admin** / pass123 → Full access (all endpoints)
- **mod** / pass123 → Moderate access (user + moderator data)
- **user** / pass123 → Basic access (user data only)

#### How to Use:
1. Login with one of the test accounts
2. See your role and permissions
3. Test different API endpoints:
   - 🌐 Public Data (no auth required)
   - 👤 User Data (requires user role)
   - 🛡️ Moderator Data (requires moderator role)
   - 👑 Admin Data (requires admin role)
4. See which endpoints your role can access

---

## 🔗 API Endpoints

### Task 2 - REST API (Port 3000)
```
GET    /api/users          - Get all users
POST   /api/users          - Create user
PUT    /api/users/:id      - Update user
DELETE /api/users/:id      - Delete user

GET    /api/products       - Get all products
POST   /api/products       - Create product
PUT    /api/products/:id   - Update product
DELETE /api/products/:id   - Delete product
```

### Task 3 - WebSocket (Port 4000)
```
WebSocket Events:
- join              → Join chat room
- message           → Send message
- user-joined       → Someone joined
- user-left         → Someone left
- online-count      → Get online users
```

### Task 4 - Microservice (Ports 5001-5002)
```
Auth Service (5001):
POST /login         → Login with username/password
POST /register      → Register new user

API Service (5002):
GET  /public        → Public data (no auth)
GET  /user-data     → User data (requires token)
GET  /moderator-data → Moderator data (mod+ only)
GET  /admin-data    → Admin data (admin only)
```

---

## 🛠️ Troubleshooting

### Frontend not loading?
1. Check if all services are running (5 cmd windows should be open)
2. Make sure port 3001 is not used by another app
3. Try closing all and running `START_EVERYTHING.bat` again

### API requests failing?
1. Verify backend services are running
2. Check browser console for CORS errors
3. Make sure correct ports are used (3000, 4000, 5001, 5002)

### Chat not connecting?
1. Ensure Task 3 server is running on port 4000
2. Check if Redis is running (optional for basic chat)
3. Try refreshing the page

### Authentication not working?
1. Clear browser localStorage: `localStorage.clear()`
2. Try registering a new user
3. Check if Auth Service (port 5001) is running

---

## 📦 Technologies Used

### Frontend:
- ⚛️ React 18
- 🧭 React Router DOM (multi-page navigation)
- 🔌 Socket.io Client (real-time chat)
- 📡 Axios (HTTP requests)
- 🎨 Custom CSS (responsive design)

### Backend:
- 🟢 Node.js + Express
- 🗄️ SQLite (Task 2 database)
- 🔌 Socket.io (Task 3 WebSocket)
- 🔴 Redis (Task 3 pub/sub)
- 🔐 JWT (Task 4 authentication)
- 🐰 RabbitMQ (Task 4 message queue)

---

## ✅ Features Checklist

### Task 2 - REST API ✅
- [x] Users CRUD with frontend
- [x] Products CRUD with frontend
- [x] SQLite database
- [x] Error handling
- [x] CORS enabled

### Task 3 - WebSocket Chat ✅
- [x] Real-time messaging
- [x] Multiple channels
- [x] Online users tracking
- [x] Redis pub/sub
- [x] Chat logging

### Task 4 - Microservice RBAC ✅
- [x] JWT authentication
- [x] Role-based access control
- [x] Multiple user roles
- [x] Protected endpoints
- [x] Frontend testing interface

---

## 🎉 That's It!

All 4 tasks are fully functional with a complete React frontend for easy testing!

**Main URL:** http://localhost:3001

Enjoy testing! 🚀
