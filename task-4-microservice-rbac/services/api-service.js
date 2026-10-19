require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { authenticateToken, requirePermission, requireRole } = require('../middleware/auth');
const { PERMISSIONS, ROLES } = require('../config/roles');
const { connectQueue, publishMessage } = require('../utils/message-queue');

const app = express();
const PORT = process.env.API_PORT || 5002;

app.use(cors());
app.use(bodyParser.json());

// Initialize message queue
connectQueue().catch(console.error);

// In-memory data store
const dataStore = [];
let dataIdCounter = 1;

// Public endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'API Service',
    endpoints: {
      'GET /public': 'Public endpoint (no auth)',
      'GET /data': 'Get all data (requires auth)',
      'POST /data': 'Create data (requires write permission)',
      'DELETE /data/:id': 'Delete data (requires delete permission)',
      'GET /admin': 'Admin only endpoint',
      'POST /process': 'Queue async task (requires auth)'
    }
  });
});

// Public endpoint (no authentication required)
app.get('/public', (req, res) => {
  res.json({
    message: 'This is a public endpoint, no authentication required',
    timestamp: new Date().toISOString()
  });
});

// Read data (requires authentication and read permission)
app.get('/data', authenticateToken, requirePermission(PERMISSIONS.READ_DATA), (req, res) => {
  res.json({
    data: dataStore,
    count: dataStore.length,
    user: req.user.username,
    role: req.user.role
  });
});

// Create data (requires authentication and write permission)
app.post('/data', authenticateToken, requirePermission(PERMISSIONS.WRITE_DATA), async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  const newData = {
    id: dataIdCounter++,
    content,
    createdBy: req.user.username,
    createdAt: new Date().toISOString()
  };

  dataStore.push(newData);

  // Publish to message queue for async processing
  await publishMessage({
    type: 'DATA_CREATED',
    payload: newData,
    timestamp: new Date().toISOString()
  });

  res.status(201).json({
    message: 'Data created successfully',
    data: newData
  });
});

// Delete data (requires authentication and delete permission)
app.delete('/data/:id', authenticateToken, requirePermission(PERMISSIONS.DELETE_DATA), async (req, res) => {
  const id = parseInt(req.params.id);
  const index = dataStore.findIndex(d => d.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Data not found' });
  }

  const deleted = dataStore.splice(index, 1)[0];

  // Publish to message queue
  await publishMessage({
    type: 'DATA_DELETED',
    payload: { id, deletedBy: req.user.username },
    timestamp: new Date().toISOString()
  });

  res.json({
    message: 'Data deleted successfully',
    deleted
  });
});

// Admin only endpoint
app.get('/admin', authenticateToken, requireRole(ROLES.ADMIN), (req, res) => {
  res.json({
    message: 'Welcome admin!',
    totalData: dataStore.length,
    systemInfo: {
      uptime: process.uptime(),
      memory: process.memoryUsage()
    }
  });
});

// Queue async task
app.post('/process', authenticateToken, async (req, res) => {
  const { taskType, data } = req.body;

  if (!taskType) {
    return res.status(400).json({ error: 'Task type is required' });
  }

  const task = {
    type: taskType,
    payload: data,
    requestedBy: req.user.username,
    timestamp: new Date().toISOString()
  };

  await publishMessage(task);

  res.json({
    message: 'Task queued for processing',
    task
  });
});

// User info endpoint
app.get('/me', authenticateToken, (req, res) => {
  res.json({
    user: req.user
  });
});

app.listen(PORT, () => {
  console.log(`✓ API Service running on port ${PORT}`);
});
