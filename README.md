# 🚀 Progree Backend Development Internship

**Complete Implementation of All 4 Tasks + React Frontend**

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/imanf4425-creator/Progree_internship)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)

---

## 📋 **Project Overview**

This repository contains complete implementations of all 4 backend development tasks assigned during the Progree internship, along with a **full-featured React frontend** for testing and demonstration.

### ✅ **All Tasks Completed:**

1. **Task 1:** LinkedIn Announcement (Professional Post)
2. **Task 2:** RESTful CRUD API with SQL Database
3. **Task 3:** Real-Time WebSocket Chat with Redis
4. **Task 4:** Microservice Architecture with JWT & RBAC

---

## ⚡ **Quick Start**

### **Prerequisites:**
- Node.js v18 or higher
- npm (comes with Node.js)
- Git

### **Installation:**

```bash
# Clone the repository
git clone https://github.com/imanf4425-creator/Progree_internship.git
cd Progree_internship

# Install dependencies for all tasks
cd task-2-rest-api-crud && npm install && cd ..
cd task-3-websocket-chat && npm install && cd ..
cd task-4-microservice-rbac && npm install && cd ..
cd frontend && npm install && cd ..
```

### **Start All Services:**

**Windows:**
```bash
START_EVERYTHING.bat
```

**Manual Start (All Platforms):**
```bash
# Terminal 1 - Task 2 REST API
cd task-2-rest-api-crud
npm start

# Terminal 2 - Task 3 WebSocket Chat
cd task-3-websocket-chat
npm start

# Terminal 3 - Task 4 Auth Service
cd task-4-microservice-rbac
node services/auth-service.js

# Terminal 4 - Task 4 API Service
cd task-4-microservice-rbac
node services/api-service.js

# Terminal 5 - React Frontend
cd frontend
PORT=3001 npm start
```

### **Access the Frontend:**
Open your browser: **http://localhost:3001**

---

## 🎯 **Features**

### **React Frontend Dashboard**

#### 1️⃣ **Users Management** (`/users`)
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Form validation
- ✅ Real-time table updates
- ✅ Beautiful responsive UI
- 🔗 Connected to **Task 2 REST API**

#### 2️⃣ **Products Management** (`/products`)
- ✅ Complete product lifecycle management
- ✅ Price and stock tracking
- ✅ Search and filter capabilities
- ✅ Edit and delete actions
- 🔗 Connected to **Task 2 REST API**

#### 3️⃣ **Real-Time Chat** (`/chat`)
- ✅ Live messaging with Socket.io
- ✅ Multiple chat channels (general, random, tech)
- ✅ Online users sidebar
- ✅ Typing indicators
- ✅ Auto-scrolling chat window
- 🔗 Connected to **Task 3 WebSocket Server**

#### 4️⃣ **Authentication & RBAC** (`/auth`)
- ✅ Login & Registration
- ✅ JWT token-based authentication
- ✅ Role-Based Access Control (User, Moderator, Admin)
- ✅ Test API endpoints by role
- ✅ Permission validation demo
- 🔗 Connected to **Task 4 Microservice**

---

## 🏗️ **Architecture**

### **Task 2: REST API CRUD** (Port 3000)
```
📦 task-2-rest-api-crud/
├── server.js          # Express server
├── routes.js          # API routes
├── database.js        # SQLite database setup
├── middleware.js      # CORS & error handling
└── test.js           # API tests
```

**Endpoints:**
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

**Tech Stack:** Express.js, SQLite, CORS

---

### **Task 3: WebSocket Chat** (Port 4000)
```
📦 task-3-websocket-chat/
├── server.js          # Socket.io server
├── redis-client.js    # Redis pub/sub
├── logger.js          # Chat logging
└── chat-logs.txt     # Message logs
```

**Events:**
- `join` - User joins room
- `message` - Send/receive messages
- `user-joined` - Someone joined notification
- `user-left` - Someone left notification
- `online-count` - Active users count
- `typing` - Typing indicator

**Tech Stack:** Socket.io, Redis, Express

---

### **Task 4: Microservice RBAC** (Ports 5001-5002)
```
📦 task-4-microservice-rbac/
├── services/
│   ├── auth-service.js   # JWT authentication (Port 5001)
│   ├── api-service.js    # Protected API (Port 5002)
│   └── worker-service.js # Background worker
├── middleware/
│   └── auth.js           # JWT verification
├── config/
│   └── roles.js          # Role permissions
└── utils/
    └── message-queue.js  # RabbitMQ helper
```

**Auth Service Endpoints (5001):**
- `POST /login` - User login
- `POST /register` - User registration

**API Service Endpoints (5002):**
- `GET /public` - Public data (no auth)
- `GET /user-data` - User role required
- `GET /moderator-data` - Moderator role required
- `GET /admin-data` - Admin role only

**Tech Stack:** Express.js, JWT, RabbitMQ, Docker-ready

---

### **React Frontend** (Port 3001)
```
📦 frontend/
├── src/
│   ├── pages/
│   │   ├── HomePage.js        # Landing page
│   │   ├── UsersPage.js       # Task 2 Users CRUD
│   │   ├── ProductsPage.js    # Task 2 Products CRUD
│   │   ├── ChatPage.js        # Task 3 WebSocket Chat
│   │   └── AuthPage.js        # Task 4 Auth & RBAC
│   ├── App.js                 # Router setup
│   └── index.js               # Entry point
└── public/
    └── index.html
```

**Tech Stack:** React 18, React Router DOM, Socket.io Client, Axios

---

## 🧪 **Testing**

### **Test Accounts (Task 4):**
| Username | Password | Role      | Access Level |
|----------|----------|-----------|--------------|
| `admin`  | `pass123`| Admin     | Full access to all endpoints |
| `mod`    | `pass123`| Moderator | User + Moderator data |
| `user`   | `pass123`| User      | User data only |

### **API Testing:**

**Using cURL:**
```bash
# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","age":25}'

# Login
curl -X POST http://localhost:5001/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"pass123"}'

# Access protected endpoint
curl http://localhost:5002/admin-data \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📊 **Database Schema**

### **Task 2 - SQLite:**

**Users Table:**
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  age INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Products Table:**
```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  stock INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔒 **Security Features**

- ✅ JWT token-based authentication
- ✅ Role-Based Access Control (RBAC)
- ✅ Password hashing (bcrypt recommended for production)
- ✅ CORS configuration
- ✅ Input validation
- ✅ SQL injection prevention (parameterized queries)
- ✅ Error handling middleware

---

## 📖 **Documentation**

- **[HOW_TO_USE_FRONTEND.md](./HOW_TO_USE_FRONTEND.md)** - Detailed frontend guide
- **[FRONTEND_COMPLETE.txt](./FRONTEND_COMPLETE.txt)** - Quick reference
- **[BACKEND_TASKS_STATUS.txt](./BACKEND_TASKS_STATUS.txt)** - Backend verification report

---

## 🛠️ **Technologies Used**

### **Backend:**
- Node.js & Express.js
- SQLite (Task 2 database)
- Socket.io (Real-time WebSocket)
- Redis (Pub/Sub messaging)
- JWT (Authentication)
- RabbitMQ (Message queue)
- Docker (Containerization)

### **Frontend:**
- React 18
- React Router DOM
- Socket.io Client
- Axios (HTTP client)
- Modern CSS with animations

---

## 📁 **Project Structure**
```
Progree_internship/
├── task-1-linkedin-announcement/  # Professional LinkedIn post
├── task-2-rest-api-crud/         # REST API with SQLite
├── task-3-websocket-chat/        # Real-time chat with Redis
├── task-4-microservice-rbac/     # Microservice with JWT + RBAC
├── frontend/                     # React frontend
├── START_EVERYTHING.bat          # Windows startup script
├── INSTALL_ALL.bat              # Dependency installer
└── README.md                    # This file
```

---

## 🚀 **Deployment**

### **Production Recommendations:**

1. **Environment Variables:**
   - Use `.env` files for secrets
   - Never commit sensitive data

2. **Database:**
   - Migrate to PostgreSQL/MySQL for production
   - Set up proper backups

3. **Redis:**
   - Use managed Redis (AWS ElastiCache, Redis Labs)

4. **Security:**
   - Enable HTTPS
   - Use strong JWT secrets
   - Implement rate limiting
   - Add helmet.js for security headers

5. **Monitoring:**
   - Set up logging (Winston, Morgan)
   - Add health check endpoints
   - Use PM2 for process management

---

## 🤝 **Contributing**

This is an internship project. Feel free to fork and experiment!

---

## 📝 **License**

MIT License - Free to use for learning and demonstration purposes.

---

## 👨‍💻 **Author**

**Progree Internship Candidate**
- GitHub: [@imanf4425-creator](https://github.com/imanf4425-creator)
- Repository: [Progree_internship](https://github.com/imanf4425-creator/Progree_internship)

---

## 🎉 **Acknowledgments**

Special thanks to **Progree** for providing this opportunity to demonstrate full-stack development skills!

---

## 📞 **Support**

For issues or questions:
1. Check [HOW_TO_USE_FRONTEND.md](./HOW_TO_USE_FRONTEND.md)
2. Review [BACKEND_TASKS_STATUS.txt](./BACKEND_TASKS_STATUS.txt)
3. Open an issue on GitHub

---

**⭐ If you found this helpful, please star the repository!**
