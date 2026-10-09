const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
db.init();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// Simple Auth token helper
const activeSessions = new Map(); // token -> userId

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    req.user = null;
    return next();
  }
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (activeSessions.has(token)) {
    const userId = activeSessions.get(token);
    req.user = db.findUserById(userId);
  } else {
    req.user = null;
  }
  next();
}

// Routes: Products
app.get('/api/products', (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sortBy } = req.query;
    const products = db.getProducts({ category, search, minPrice, maxPrice, sortBy });
    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/products/:id', (req, res) => {
  try {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    // Also attach related products
    const related = db.getProducts({ category: product.category })
      .filter(p => p.id !== product.id)
      .slice(0, 3);

    res.json({ success: true, data: { ...product, related } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Routes: Categories
app.get('/api/categories', (req, res) => {
  try {
    const categories = db.getCategories();
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Routes: Promo Coupons
const VALID_COUPONS = {
  'ALPHA10': { code: 'ALPHA10', discountPercent: 10, description: 'CodeAlpha 10% Off' },
  'WELCOME20': { code: 'WELCOME20', discountPercent: 20, description: 'Welcome 20% Off Storewide' },
  'MEGA30': { code: 'MEGA30', discountPercent: 30, description: 'VIP Flash 30% Off' },
  'MEGA500': { code: 'MEGA500', discountFixed: 500, description: 'Flat ₹500 Off' },
  'FREESHIP': { code: 'FREESHIP', discountFixed: 99, freeShipping: true, description: 'Free Express Shipping' }
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'NOVA AURA E-Commerce API is running smoothly',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    port: activePort || PORT
  });
});

app.get('/api/coupons/:code', (req, res) => {
  const code = (req.params.code || '').trim().toUpperCase();
  const coupon = VALID_COUPONS[code];
  if (!coupon) {
    return res.status(400).json({ success: false, error: 'Invalid coupon code. Try ALPHA10 or WELCOME20' });
  }
  res.json({ success: true, data: coupon });
});

// Routes: Authentication
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    }

    const user = db.createUser({ name, email, password });
    const token = 'tok_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    activeSessions.set(token, user.id);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      data: { user, token }
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const user = db.validateLogin(email, password);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const token = 'tok_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    activeSessions.set(token, user.id);

    res.json({
      success: true,
      message: 'Logged in successfully',
      data: { user, token }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Not authenticated' });
  }
  res.json({ success: true, data: req.user });
});

app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const token = authHeader.replace(/^Bearer\s+/i, '');
    activeSessions.delete(token);
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

// Routes: Orders
app.post('/api/orders', authenticateToken, (req, res) => {
  try {
    const { customer, items, pricing, paymentMethod } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ success: false, error: 'Order must contain at least one item' });
    }
    if (!customer || !customer.name || !customer.email || !customer.address) {
      return res.status(400).json({ success: false, error: 'Please provide complete customer and delivery details' });
    }

    const userId = req.user ? req.user.id : (customer.userId || null);
    const order = db.createOrder({
      userId,
      customer,
      items,
      pricing,
      paymentMethod: paymentMethod || 'Credit Card'
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/orders', authenticateToken, (req, res) => {
  try {
    const userId = req.user ? req.user.id : req.query.userId;
    const userEmail = req.user ? req.user.email : req.query.userEmail;
    const orders = db.getOrders(userId, userEmail);
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/orders/:id', (req, res) => {
  try {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fallback to index.html for any SPA routes
app.get('*', (req, res) => {
  if (/\.(css|js|png|jpg|jpeg|gif|svg|ico|json|woff2?|ttf|eot)$/i.test(req.path)) {
    return res.status(404).type('text/plain').send('Asset not found');
  }
  const publicIndex = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(publicIndex)) {
    return res.sendFile(publicIndex);
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server with fallback port if busy
let activePort = PORT;

function startServer(portToTry) {
  const server = app.listen(portToTry, () => {
    activePort = portToTry;
    console.log(`===============================================`);
    console.log(`🚀 NOVA AURA E-Commerce Server is running!`);
    console.log(`📡 URL: http://localhost:${portToTry}`);
    console.log(`🛒 API Docs & Frontend ready`);
    console.log(`===============================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const nextPort = portToTry + 1;
      console.log(`Port ${portToTry} is busy, retrying on port ${nextPort}...`);
      startServer(nextPort);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(PORT);
