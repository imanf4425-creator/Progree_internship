require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { ROLES, getRolePermissions } = require('../config/roles');

const app = express();
const PORT = process.env.AUTH_PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '1h';

app.use(cors());
app.use(bodyParser.json());

// In-memory user database (in production, use a real database)
const users = [
  {
    id: 1,
    username: 'admin',
    password: bcrypt.hashSync('admin123', 10),
    role: ROLES.ADMIN,
    email: 'admin@example.com'
  },
  {
    id: 2,
    username: 'user',
    password: bcrypt.hashSync('user123', 10),
    role: ROLES.USER,
    email: 'user@example.com'
  },
  {
    id: 3,
    username: 'guest',
    password: bcrypt.hashSync('guest123', 10),
    role: ROLES.GUEST,
    email: 'guest@example.com'
  }
];

// Register new user
app.post('/register', async (req, res) => {
  try {
    const { username, password, email, role } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Username, password, and email are required' });
    }

    // Check if user exists
    if (users.find(u => u.username === username)) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: users.length + 1,
      username,
      password: hashedPassword,
      email,
      role: role || ROLES.USER
    };

    users.push(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        permissions: getRolePermissions(user.role)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify token
app.post('/verify', (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({
      valid: true,
      user: decoded
    });
  } catch (error) {
    res.status(401).json({
      valid: false,
      error: 'Invalid or expired token'
    });
  }
});

// Get all users (for testing)
app.get('/users', (req, res) => {
  res.json({
    users: users.map(u => ({
      id: u.id,
      username: u.username,
      email: u.email,
      role: u.role
    }))
  });
});

app.get('/', (req, res) => {
  res.json({
    service: 'Authentication Service',
    endpoints: {
      'POST /register': 'Register new user',
      'POST /login': 'Login and get JWT token',
      'POST /verify': 'Verify JWT token',
      'GET /users': 'Get all users'
    },
    defaultUsers: [
      { username: 'admin', password: 'admin123', role: 'admin' },
      { username: 'user', password: 'user123', role: 'user' },
      { username: 'guest', password: 'guest123', role: 'guest' }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`✓ Auth Service running on port ${PORT}`);
  console.log(`✓ Default users available: admin/admin123, user/user123, guest/guest123`);
});
