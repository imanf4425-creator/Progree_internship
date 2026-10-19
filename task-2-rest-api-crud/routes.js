const express = require('express');
const { db } = require('./database');
const { validateUser, validateProduct } = require('./middleware');

const router = express.Router();

// ============= USER ROUTES =============

// CREATE - Add new user
router.post('/users', validateUser, (req, res) => {
  const { name, email, age } = req.body;
  const query = 'INSERT INTO users (name, email, age) VALUES (?, ?, ?)';
  
  db.run(query, [name, email, age || null], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'Email already exists' });
      }
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ 
      message: 'User created successfully', 
      id: this.lastID 
    });
  });
});

// READ - Get all users
router.get('/users', (req, res) => {
  const query = 'SELECT * FROM users ORDER BY created_at DESC';
  
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ users: rows, count: rows.length });
  });
});

// READ - Get user by ID
router.get('/users/:id', (req, res) => {
  const query = 'SELECT * FROM users WHERE id = ?';
  
  db.get(query, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(row);
  });
});

// UPDATE - Update user
router.put('/users/:id', validateUser, (req, res) => {
  const { name, email, age } = req.body;
  const query = 'UPDATE users SET name = ?, email = ?, age = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
  
  db.run(query, [name, email, age || null, req.params.id], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'Email already exists' });
      }
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User updated successfully' });
  });
});

// DELETE - Delete user
router.delete('/users/:id', (req, res) => {
  const query = 'DELETE FROM users WHERE id = ?';
  
  db.run(query, [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  });
});

// ============= PRODUCT ROUTES =============

// CREATE - Add new product
router.post('/products', validateProduct, (req, res) => {
  const { name, description, price, stock } = req.body;
  const query = 'INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)';
  
  db.run(query, [name, description || null, price, stock || 0], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ 
      message: 'Product created successfully', 
      id: this.lastID 
    });
  });
});

// READ - Get all products
router.get('/products', (req, res) => {
  const query = 'SELECT * FROM products ORDER BY created_at DESC';
  
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ products: rows, count: rows.length });
  });
});

// READ - Get product by ID
router.get('/products/:id', (req, res) => {
  const query = 'SELECT * FROM products WHERE id = ?';
  
  db.get(query, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(row);
  });
});

// UPDATE - Update product
router.put('/products/:id', validateProduct, (req, res) => {
  const { name, description, price, stock } = req.body;
  const query = 'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
  
  db.run(query, [name, description || null, price, stock || 0, req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product updated successfully' });
  });
});

// DELETE - Delete product
router.delete('/products/:id', (req, res) => {
  const query = 'DELETE FROM products WHERE id = ?';
  
  db.run(query, [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  });
});

module.exports = router;
