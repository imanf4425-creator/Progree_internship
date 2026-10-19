// Validation middleware for user data
const validateUser = (req, res, next) => {
  const { name, email } = req.body;
  
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      message: 'Name is required and must be a non-empty string' 
    });
  }
  
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ 
      error: 'Validation failed', 
      message: 'Email is required and must be a string' 
    });
  }
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      message: 'Invalid email format' 
    });
  }
  
  if (req.body.age !== undefined) {
    const age = parseInt(req.body.age);
    if (isNaN(age) || age < 0 || age > 150) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        message: 'Age must be a valid number between 0 and 150' 
      });
    }
    req.body.age = age;
  }
  
  next();
};

// Validation middleware for product data
const validateProduct = (req, res, next) => {
  const { name, price } = req.body;
  
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      message: 'Product name is required and must be a non-empty string' 
    });
  }
  
  if (price === undefined || price === null) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      message: 'Price is required' 
    });
  }
  
  const priceNum = parseFloat(price);
  if (isNaN(priceNum) || priceNum < 0) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      message: 'Price must be a valid positive number' 
    });
  }
  req.body.price = priceNum;
  
  if (req.body.stock !== undefined) {
    const stock = parseInt(req.body.stock);
    if (isNaN(stock) || stock < 0) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        message: 'Stock must be a valid non-negative integer' 
      });
    }
    req.body.stock = stock;
  }
  
  next();
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: err.message 
  });
};

module.exports = { validateUser, validateProduct, errorHandler };
