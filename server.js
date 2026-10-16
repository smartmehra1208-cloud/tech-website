const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 5000;

// Vercel Serverless File System Paths
const DB_SEED_PATH = path.join(__dirname, 'data', 'db.json');
const TMP_DB_PATH = path.join('/tmp', 'db.json');
const UPLOADS_DIR = process.env.VERCEL
  ? path.join('/tmp', 'uploads')
  : path.join(__dirname, 'public', 'uploads');

// Ensure uploads folder exists
try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch (e) {
  // Silent fallback in read-only environment
}

// Multer storage for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const safeName = Date.now() + '-' + Math.round(Math.random() * 1e6) + ext;
    cb(null, safeName);
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// High-Performance Middleware
app.use(compression({
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));

// Security & Performance Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Optimized Static Assets with HTTP Caching
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1h',
  etag: true,
  lastModified: true
}));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    memoryUsageMB: Math.round(process.memoryUsage().rss / 1024 / 1024)
  });
});

// Helper functions for DB (Vercel-compatible)
function getDBPath() {
  if (process.env.VERCEL) {
    try {
      if (!fs.existsSync(TMP_DB_PATH)) {
        if (fs.existsSync(DB_SEED_PATH)) {
          const seed = fs.readFileSync(DB_SEED_PATH, 'utf-8');
          fs.writeFileSync(TMP_DB_PATH, seed, 'utf-8');
        }
      }
      return TMP_DB_PATH;
    } catch (err) {
      return DB_SEED_PATH;
    }
  }
  return DB_SEED_PATH;
}

function readDB() {
  try {
    const dbFile = getDBPath();
    const raw = fs.readFileSync(dbFile, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    try {
      const fallback = fs.readFileSync(DB_SEED_PATH, 'utf-8');
      return JSON.parse(fallback);
    } catch (e) {
      console.error('Error reading db.json:', err);
      return { settings: {}, projects: [], catalog: [], inquiries: [], testimonials: [] };
    }
  }
}

function writeDB(data) {
  try {
    const dbFile = getDBPath();
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.warn('Write to db skipped (read-only environment):', err.message);
    return true; // Never crash on serverless
  }
}

// Admin Auth Middleware (simple token / secret verification)
function requireAdmin(req, res, next) {
  const token = req.headers['x-admin-token'] || req.query.token;
  const db = readDB();
  const validPass = db.settings.adminPassword || 'admin123';
  if (token === validPass || token === 'admin-authenticated-session') {
    return next();
  }
  return res.status(401).json({ success: false, error: 'Unauthorized: Invalid Admin Credentials' });
}

// ======================== API ROUTES ========================

// 1. Settings & Config
app.get('/api/settings', (req, res) => {
  const db = readDB();
  const { adminPassword, ...publicSettings } = db.settings || {};
  res.json({ success: true, settings: publicSettings });
});

app.post('/api/settings', requireAdmin, (req, res) => {
  const db = readDB();
  db.settings = { ...db.settings, ...req.body };
  writeDB(db);
  const { adminPassword, ...publicSettings } = db.settings;
  res.json({ success: true, message: 'Settings updated successfully', settings: publicSettings });
});

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  const db = readDB();
  const currentPassword = db.settings.adminPassword || 'admin123';
  if (password === currentPassword) {
    res.json({ success: true, token: 'admin-authenticated-session', message: 'Logged in successfully' });
  } else {
    res.status(401).json({ success: false, message: 'Incorrect password! Default is admin123' });
  }
});

// Admin Verify Token
app.get('/api/admin/verify', requireAdmin, (req, res) => {
  res.json({ success: true, message: 'Admin session valid' });
});

// 2. Stats Summary
app.get('/api/stats', (req, res) => {
  const db = readDB();
  res.json({
    success: true,
    stats: {
      totalProjects: (db.projects || []).length,
      totalCatalog: (db.catalog || []).length,
      totalInquiries: (db.inquiries || []).length,
      newInquiries: (db.inquiries || []).filter(i => i.status === 'New').length,
      totalTestimonials: (db.testimonials || []).length,
      projectsCompleted: db.settings.projectsCompleted || 180,
      happyClients: db.settings.happyClients || 95,
      productsListed: db.settings.productsListed || '500K+',
      supportHours: db.settings.supportHours || '24/7'
    }
  });
});

// 3. File Upload
app.post('/api/upload', requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No image uploaded' });
  }
  const fileUrl = '/uploads/' + req.file.filename;
  res.json({ success: true, url: fileUrl, filename: req.file.filename });
});

// 4. Projects API
app.get('/api/projects', (req, res) => {
  const db = readDB();
  let projects = db.projects || [];
  const { category, search } = req.query;

  if (category && category !== 'all') {
    projects = projects.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    projects = projects.filter(p =>
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.client && p.client.toLowerCase().includes(q)) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  res.json({ success: true, count: projects.length, projects });
});

app.get('/api/projects/:id', (req, res) => {
  const db = readDB();
  const project = (db.projects || []).find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ success: false, error: 'Project not found' });
  res.json({ success: true, project });
});

app.post('/api/projects', requireAdmin, (req, res) => {
  const db = readDB();
  const { title, category, categoryLabel, client, description, result, tags, liveUrl, featured, image, caseStudy } = req.body;

  if (!title || !description) {
    return res.status(400).json({ success: false, error: 'Title and description are required' });
  }

  const newProject = {
    id: 'proj-' + Date.now(),
    title,
    category: category || 'web',
    categoryLabel: categoryLabel || 'Web & Apps',
    client: client || 'Private Client',
    description,
    result: result || 'Successful Launch',
    tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(s => s.trim()).filter(Boolean) : []),
    liveUrl: liveUrl || '#',
    featured: Boolean(featured),
    image: image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    caseStudy: caseStudy || {
      problem: 'Client required scalable digital presence to boost revenue.',
      solution: 'Custom engineered solution designed & developed by KioraTech.',
      metrics: ['100% on-time milestone delivery', 'High conversion rate improvement']
    },
    createdAt: new Date().toISOString()
  };

  db.projects.unshift(newProject);
  writeDB(db);
  res.status(201).json({ success: true, message: 'Project added successfully', project: newProject });
});

app.put('/api/projects/:id', requireAdmin, (req, res) => {
  const db = readDB();
  const index = (db.projects || []).findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Project not found' });

  const existing = db.projects[index];
  const tags = req.body.tags;
  const parsedTags = Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(s => s.trim()).filter(Boolean) : existing.tags);

  db.projects[index] = {
    ...existing,
    ...req.body,
    id: existing.id,
    tags: parsedTags,
    updatedAt: new Date().toISOString()
  };

  writeDB(db);
  res.json({ success: true, message: 'Project updated successfully', project: db.projects[index] });
});

app.delete('/api/projects/:id', requireAdmin, (req, res) => {
  const db = readDB();
  const initialCount = db.projects.length;
  db.projects = db.projects.filter(p => p.id !== req.params.id);
  if (db.projects.length === initialCount) {
    return res.status(404).json({ success: false, error: 'Project not found' });
  }
  writeDB(db);
  res.json({ success: true, message: 'Project deleted successfully' });
});

// 5. Catalog & Services API
app.get('/api/catalog', (req, res) => {
  const db = readDB();
  res.json({ success: true, catalog: db.catalog || [] });
});

app.post('/api/catalog', requireAdmin, (req, res) => {
  const db = readDB();
  const { name, category, price, billingType, badge, deliveryDays, description, features } = req.body;

  if (!name || price === undefined) {
    return res.status(400).json({ success: false, error: 'Package Name and Price are required' });
  }

  const parsedFeatures = Array.isArray(features) ? features : (typeof features === 'string' ? features.split('\n').map(s => s.trim()).filter(Boolean) : []);

  const newItem = {
    id: 'cat-' + Date.now(),
    name,
    category: category || 'General',
    price: Number(price) || 0,
    billingType: billingType || 'One-time',
    badge: badge || 'New',
    deliveryDays: deliveryDays || '3-5 Days',
    description: description || '',
    features: parsedFeatures,
    createdAt: new Date().toISOString()
  };

  db.catalog.push(newItem);
  writeDB(db);
  res.status(201).json({ success: true, message: 'Catalog package added successfully', item: newItem });
});

app.put('/api/catalog/:id', requireAdmin, (req, res) => {
  const db = readDB();
  const index = (db.catalog || []).findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Catalog item not found' });

  const existing = db.catalog[index];
  const features = req.body.features;
  const parsedFeatures = Array.isArray(features) ? features : (typeof features === 'string' ? features.split('\n').map(s => s.trim()).filter(Boolean) : existing.features);

  db.catalog[index] = {
    ...existing,
    ...req.body,
    id: existing.id,
    price: Number(req.body.price) || existing.price,
    features: parsedFeatures,
    updatedAt: new Date().toISOString()
  };

  writeDB(db);
  res.json({ success: true, message: 'Catalog package updated', item: db.catalog[index] });
});

app.delete('/api/catalog/:id', requireAdmin, (req, res) => {
  const db = readDB();
  const initialCount = db.catalog.length;
  db.catalog = db.catalog.filter(c => c.id !== req.params.id);
  if (db.catalog.length === initialCount) {
    return res.status(404).json({ success: false, error: 'Catalog item not found' });
  }
  writeDB(db);
  res.json({ success: true, message: 'Catalog item deleted successfully' });
});

// 6. Inquiries / Leads API
app.get('/api/inquiries', requireAdmin, (req, res) => {
  const db = readDB();
  res.json({ success: true, count: (db.inquiries || []).length, inquiries: db.inquiries || [] });
});

app.post('/api/inquiries', (req, res) => {
  const db = readDB();
  const { name, email, phone, service, budget, message, source } = req.body;

  if (!name || (!phone && !email)) {
    return res.status(400).json({ success: false, error: 'Name and either Phone or Email are required' });
  }

  const newInquiry = {
    id: 'inq-' + Date.now().toString().slice(-6),
    name,
    email: email || '',
    phone: phone || '',
    service: service || 'General Inquiry',
    budget: budget || 'Flexible',
    message: message || '',
    status: 'New',
    source: source || 'Website Contact Form',
    createdAt: new Date().toISOString()
  };

  db.inquiries = db.inquiries || [];
  db.inquiries.unshift(newInquiry);
  writeDB(db);

  res.status(201).json({
    success: true,
    message: 'Inquiry submitted successfully! Our senior consultant will connect with you within 30 minutes.',
    inquiryId: newInquiry.id,
    inquiry: newInquiry
  });
});

app.patch('/api/inquiries/:id/status', requireAdmin, (req, res) => {
  const db = readDB();
  const inq = (db.inquiries || []).find(i => i.id === req.params.id);
  if (!inq) return res.status(404).json({ success: false, error: 'Inquiry not found' });

  inq.status = req.body.status || inq.status;
  writeDB(db);
  res.json({ success: true, message: 'Status updated', inquiry: inq });
});

app.delete('/api/inquiries/:id', requireAdmin, (req, res) => {
  const db = readDB();
  const initialCount = db.inquiries.length;
  db.inquiries = db.inquiries.filter(i => i.id !== req.params.id);
  if (db.inquiries.length === initialCount) {
    return res.status(404).json({ success: false, error: 'Inquiry not found' });
  }
  writeDB(db);
  res.json({ success: true, message: 'Inquiry deleted' });
});

// 7. Testimonials API
app.get('/api/testimonials', (req, res) => {
  const db = readDB();
  res.json({ success: true, testimonials: db.testimonials || [] });
});

app.post('/api/testimonials', requireAdmin, (req, res) => {
  const db = readDB();
  const { name, role, company, rating, avatar, text, verified, projectCategory } = req.body;

  if (!name || !text) {
    return res.status(400).json({ success: false, error: 'Name and testimonial text are required' });
  }

  const newTestimonial = {
    id: 'test-' + Date.now(),
    name,
    role: role || 'Client',
    company: company || '',
    rating: Number(rating) || 5,
    avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    text,
    verified: verified !== false,
    projectCategory: projectCategory || 'General',
    createdAt: new Date().toISOString()
  };

  db.testimonials = db.testimonials || [];
  db.testimonials.push(newTestimonial);
  writeDB(db);
  res.status(201).json({ success: true, message: 'Testimonial added', testimonial: newTestimonial });
});

app.delete('/api/testimonials/:id', requireAdmin, (req, res) => {
  const db = readDB();
  db.testimonials = (db.testimonials || []).filter(t => t.id !== req.params.id);
  writeDB(db);
  res.json({ success: true, message: 'Testimonial removed' });
});

// Admin Panel route shortcut
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Export app for Vercel Serverless Function
module.exports = app;

// Start Server locally if not running on Vercel
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 KioraTech High-Performance Server is live!`);
    console.log(`🌐 Website URL:  http://localhost:${PORT}`);
    console.log(`⚡ Admin CMS:    http://localhost:${PORT}/admin`);
    console.log(`🔑 Default Admin Passcode: admin123`);
    console.log(`=======================================================`);
  });
}
