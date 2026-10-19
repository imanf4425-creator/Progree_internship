# Progree - Backend Development Platform

Complete implementation of 4 backend development internship tasks with React frontend.

## 🚀 Quick Start

### Option 1: Automatic Setup (Windows)
```bash
# Install all dependencies
INSTALL_ALL.bat

# Start all services
START_ALL_SERVICES.bat
```

### Option 2: Manual Setup

#### Install Dependencies
```bash
# Task 2: REST API
cd task-2-rest-api-crud
npm install

# Task 3: WebSocket Chat
cd ../task-3-websocket-chat
npm install

# Task 4: Microservice RBAC
cd ../task-4-microservice-rbac
npm install

# Frontend
cd ../frontend
npm install
```

#### Start Services

**Terminal 1: REST API Server**
```bash
cd task-2-rest-api-crud
npm start
# Runs on http://localhost:3000
```

**Terminal 2: WebSocket Chat**
```bash
cd task-3-websocket-chat
npm start
# Runs on http://localhost:4000
```

**Terminal 3: Auth Service**
```bash
cd task-4-microservice-rbac
npm run auth
# Runs on http://localhost:5001
```

**Terminal 4: API Service**
```bash
cd task-4-microservice-rbac
npm run api
# Runs on http://localhost:5002
```

**Terminal 5: Worker Service**
```bash
cd task-4-microservice-rbac
npm run worker
# Runs on http://localhost:5003
```

**Terminal 6: React Frontend**
```bash
cd frontend
npm start
# Runs on http://localhost:3000 (or 3001 if 3000 is busy)
```

## 📁 Project Structure

```
Progree/
├── task-1-linkedin-announcement/    # LinkedIn post instructions
├── task-2-rest-api-crud/           # REST API with SQLite
├── task-3-websocket-chat/          # Real-time chat with Socket.io
├── task-4-microservice-rbac/       # JWT + RBAC microservices
├── frontend/                        # React frontend application
├── START_ALL_SERVICES.bat          # Auto-start all services
├── INSTALL_ALL.bat                 # Auto-install dependencies
└── PROJECT_SUMMARY.txt             # Detailed documentation
```

## 🎯 Tasks Completed

### ✅ Task 1: LinkedIn Announcement
- Professional announcement template
- Internship acceptance post
- Location: `task-1-linkedin-announcement/`

### ✅ Task 2: REST API CRUD (Port 3000)
- **Backend:** Node.js + Express + SQLite
- **Features:**
  - User management (CRUD)
  - Product management (CRUD)
  - Data validation
  - Error handling
- **Frontend Pages:**
  - Users Management
  - Products Management

### ✅ Task 3: WebSocket Chat (Port 4000)
- **Backend:** Socket.io + Express + Redis (with fallback)
- **Features:**
  - Real-time messaging
  - Multiple channels (general, random, tech)
  - User presence tracking
  - Message logging
- **Frontend:**
  - Live chat interface
  - Channel switching
  - Online users list

### ✅ Task 4: Microservice RBAC (Ports 5001-5003)
- **Backend:** 3 Microservices
  - Auth Service (5001): JWT authentication
  - API Service (5002): Protected endpoints
  - Worker Service (5003): Background tasks
- **Features:**
  - JWT tokens
  - Role-Based Access Control (Admin, User, Guest)
  - Permission enforcement
  - RabbitMQ message queue (with fallback)
- **Frontend:**
  - Login/Register
  - Role-based UI
  - API testing interface

## 🌐 Frontend Routes

- **/** - Home page with platform overview
- **/users** - User management (Task 2)
- **/products** - Product management (Task 2)
- **/chat** - Real-time chat (Task 3)
- **/auth** - Authentication & API testing (Task 4)

## 🔐 Default Test Accounts

For Task 4 authentication:
- **Admin:** admin / admin123
- **User:** user / user123
- **Guest:** guest / guest123

## 🛠️ Technology Stack

### Backend
- Node.js
- Express.js
- Socket.io
- SQLite
- Redis (optional)
- JWT (jsonwebtoken)
- bcryptjs
- RabbitMQ (optional)

### Frontend
- React 18
- React Router v6
- Axios
- Socket.io Client
- CSS3 with animations

## 📊 Features

### Backend Features
- ✅ RESTful API design
- ✅ Real-time WebSocket communication
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ Data validation & sanitization
- ✅ Error handling middleware
- ✅ Message queue integration
- ✅ Database operations (CRUD)
- ✅ File logging

### Frontend Features
- ✅ Responsive design
- ✅ Modern UI/UX
- ✅ Form validation
- ✅ Real-time updates
- ✅ Error handling
- ✅ Loading states
- ✅ Success/Error notifications
- ✅ Protected routes
- ✅ Token management

## 🧪 Testing

### Test REST API (Task 2)
```bash
cd task-2-rest-api-crud
npm test
```

### Test Microservices (Task 4)
```bash
cd task-4-microservice-rbac
npm test
```

## 📝 API Documentation

### Task 2: REST API Endpoints

**Users:**
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

**Products:**
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Task 4: Microservice Endpoints

**Auth Service (5001):**
- `POST /login` - Login user
- `POST /register` - Register new user
- `POST /verify` - Verify JWT token
- `GET /users` - Get all users

**API Service (5002):**
- `GET /public` - Public endpoint (no auth)
- `GET /data` - Get data (requires auth)
- `POST /data` - Create data (requires write permission)
- `DELETE /data/:id` - Delete data (requires delete permission)
- `GET /admin` - Admin only endpoint
- `POST /process` - Queue async task

## 🎨 Frontend Features

### Users Page
- Create, Read, Update, Delete users
- Form validation
- Error handling
- Real-time updates

### Products Page
- Full product management
- Price and stock tracking
- Search and filter
- Responsive table

### Chat Page
- Real-time messaging
- Multiple channels
- User presence
- Message history

### Auth Page
- Login/Register forms
- User profile display
- Permission visualization
- API endpoint testing
- Role-based access demo

## 🔧 Development

### Environment Variables
Create `.env` files if needed (defaults work out of the box):

**task-4-microservice-rbac/.env:**
```env
JWT_SECRET=your-secret-key
JWT_EXPIRY=1h
AUTH_PORT=5001
API_PORT=5002
WORKER_PORT=5003
RABBITMQ_URL=amqp://localhost:5672
```

## 🐳 Docker (Optional)

Task 4 includes Docker Compose configuration:

```bash
cd task-4-microservice-rbac
docker-compose up -d
```

## 📈 Performance

- REST API: Handles concurrent requests efficiently
- WebSocket: Supports multiple simultaneous users
- Microservices: Scalable architecture
- Frontend: Optimized React components

## 🔒 Security Features

- Password hashing (bcrypt)
- JWT token authentication
- CORS configuration
- Input validation
- SQL injection prevention
- XSS protection

## 🎯 Learning Outcomes

This project demonstrates:
1. Backend development fundamentals
2. RESTful API design
3. Real-time communication
4. Authentication & Authorization
5. Microservice architecture
6. Frontend-Backend integration
7. React development
8. Database operations
9. Message queues
10. Testing & debugging

## 📞 Support

For issues or questions:
1. Check the console logs in each terminal
2. Verify all ports are available
3. Ensure all dependencies are installed
4. Check network connectivity for external services

## 🎉 Success Criteria

All tasks meet the following criteria:
- ✅ Complete implementation
- ✅ Fully tested
- ✅ Professional UI/UX
- ✅ Production-ready code
- ✅ Comprehensive documentation
- ✅ Error handling
- ✅ Security best practices

## 📄 License

This project is for educational purposes as part of the Progree Backend Development Internship.

---

**Created by:** Backend Development Intern  
**Platform:** Progree  
**Date:** 2026
