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

// Safe JSON Error Handling (Prevents crash on malformed payload)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ success: false, error: 'Invalid JSON payload received' });
  }
  next(err);
});

// Static Assets with Instant Refresh (zero stale cache for instant client updates)
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: 0,
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

// ==================== 8. SMART AI CHATBOT API ====================
function generateSmartLocalReply(message, settings) {
  const text = (message || '').toLowerCase().trim();
  const phone = settings.phone || '+91 92194 61302';
  const whatsapp = settings.whatsapp || '919219461302';
  const email = settings.email || 'kioratech12@gmail.com';
  const address = settings.address || 'D-463, LDA Colony, Near Spring Dale College, Kanpur Road, Lucknow - 226012, UP';

  // 1. Phone number detected (10 digits)
  const phoneMatch = text.match(/\b[6-9]\d{9}\b/);
  if (phoneMatch) {
    try {
      const db = readDB();
      db.inquiries = db.inquiries || [];
      db.inquiries.unshift({
        id: 'inq-bot-' + Date.now().toString().slice(-5),
        name: 'Chatbot Visitor',
        phone: phoneMatch[0],
        email: '',
        service: 'Captured via KioraBot Chat',
        budget: 'Flexible',
        message: 'Lead captured from conversation: "' + message + '"',
        status: 'New',
        source: 'KioraBot AI',
        createdAt: new Date().toISOString()
      });
      writeDB(db);
    } catch (e) {}

    return `Dhanyawad! 🙏 Aapka number **${phoneMatch[0]}** hamare technical consultant ko forward ho gaya hai. Hum 30 minute ke andar aapse connect karenge.\n\nYa aap turant WhatsApp par direct message bhej sakte hain: https://wa.me/${whatsapp}`;
  }

  // 2. Greetings
  if (text.match(/^(hi|hello|hey|namaste|hlo|helo|pranam|good morning|good evening|kaise ho|kya haal|kya hal)/i)) {
    return `Namaste! 🙏 Main KioraBot hu — KioraTech ("We Build, You Rule") ka AI assistant.\n\nHum high-speed bespoke websites aur Shopify D2C stores banate hain sirf **4 se 7 din** me!\n\nAapko kis type ki website ya project ke baare me jankari chahiye?`;
  }

  // 3. Pricing / Cost / Kitna / Rates / Package
  if (text.match(/(price|pricing|cost|charge|kitna|rate|budget|package|fees|kitne me|kitne ka)/i)) {
    return `KioraTech ke transparent packages:\n\n💻 **Starter Website:** ₹14,999 (4-7 Din me launch, 5 pages, SSL, WhatsApp Integration, Speed 95+)\n🚀 **Business Growth Platform:** ₹29,999 (Glassmorphic 3D, advanced On-Page SEO, Analytics)\n🛍️ **Shopify D2C Store Setup:** ₹29,999 - ₹34,999 (Liquid Theme, Razorpay/COD, Cart Recovery Funnel)\n📱 **Social Media & Reels Branding:** ₹12,999/month (@kiora.tech)\n\nAap apne business ka name aur requirement batayein, hum best offer quote denge!`;
  }

  // 4. Delivery Time / Timeline / Kitne din
  if (text.match(/(din|days|time|turnaround|kab tak|duration|timeline|kitna time|delivery)/i)) {
    return `⚡ Hamari delivery timeline **4 se 7 din** (4–7 Days) hai!\n\nHum clean architecture aur sub-1.5s ultra fast speed ke sath complete ready website launch karke dete hain. Urgent requirements ke liye WhatsApp par connect karein: https://wa.me/${whatsapp}`;
  }

  // 5. Live Projects / Portfolio / Work / Client / Sample
  if (text.match(/(portfolio|work|client|sample|live|example|project|kaam|dekho|dikhao|organicsanjeevani|kiyan)/i)) {
    return `Hamare real live verified projects check karein:\n\n🌿 **Organic Sanjeevani Roots**\n👉 https://organicsanjeevaniroots.com/\n(100% Ayurvedic D2C Store with 1-click WhatsApp checkout & rich schema SEO)\n\n📦 **Kiyan Export & Manufacturing**\n👉 https://kiyanexports.com/\n(Global B2B Herbal Wholesale Exporter, Est. 2014, with Google Ads tracking)\n\n🛍️ **Shopify D2C Lifestyle Store**\n(+340% checkout conversions with Razorpay & COD)\n\nAap bhi apne business ke liye aisi live website chahte hain?`;
  }

  // 6. Shopify / Ecommerce / D2C / Online Dukan
  if (text.match(/(shopify|ecommerce|e-commerce|store|dukan|cart|sell online|products|d2c)/i)) {
    return `🛍️ Hum high-converting **Shopify & Custom D2C Stores** develop karte hain!\n\n✓ Custom Liquid Theme Setup & Branding\n✓ Razorpay, PhonePe, UPI & Cash on Delivery (COD)\n✓ WhatsApp 1-Click Direct Order Alerts\n✓ Abandoned Cart Recovery Funnel\n\nLive example: https://organicsanjeevaniroots.com/\nQuotation ke liye apna number share karein!`;
  }

  // 7. SEO / Google Ranking
  if (text.match(/(seo|google|rank|traffic|keyword|search console|gmb)/i)) {
    return `🎯 Hamara **Website Speed & Local Google Presence** package (Starting ₹9,999):\n\n✓ 90+ Google PageSpeed Core Web Vitals Optimization\n✓ Google Business Profile (GMB) Local Map Pack Ranking\n✓ Local Search Intent Schema Markup\n✓ Click-to-call & WhatsApp lead sync\n\nIsse local buyers Google par search karke directly aapko call karte hain!`;
  }

  // 8. Social Media / Instagram / Reels
  if (text.match(/(instagram|insta|reel|social media|branding|video|followers|post)/i)) {
    return `📸 Hamara official Instagram channel hai **@kiora.tech**!\nLink: https://www.instagram.com/kiora.tech/#\n\nHum provide karte hain:\n✓ Aesthetic Feed Grids & Carousel Designs\n✓ Viral Video Reel Scripting, Hooks & Voiceovers\n✓ Inbound WhatsApp & DM Lead funnels\nStarting at ₹12,999/month!`;
  }

  // 9. Location / Address / Office / Lucknow
  if (text.match(/(address|location|office|kahan|kanpur road|lucknow|city|meet)/i)) {
    return `📍 **KioraTech Official Address:**\n${address}\n\n📞 Phone: ${phone}\n💬 WhatsApp: https://wa.me/${whatsapp}\n✉️ Email: ${email}\n\nAap office visit ke liye time schedule kar sakte hain ya online call arrange kar sakte hain!`;
  }

  // 10. Contact / Call / Number / WhatsApp
  if (text.match(/(contact|phone|call|whatsapp|number|talk|connect|mail|email)/i)) {
    return `KioraTech Team se sampark karein:\n\n📱 Call/WhatsApp: ${phone}\n💬 Instant Chat: https://wa.me/${whatsapp}\n✉️ Email: ${email}\n📸 Instagram: @kiora.tech (https://www.instagram.com/kiora.tech/#)\n\nAap apna phone number bhi yahan chhod sakte hain, hum call kar lenge!`;
  }

  // 11. Technology / Stack
  if (text.match(/(tech|technology|stack|node|react|code|wordpress|hosting)/i)) {
    return `💻 Hum enterprise modern tech stack use karte hain:\n\n✓ Node.js, Express, Next.js, React\n✓ Shopify Liquid & Custom Headless Storefronts\n✓ Cloudflare CDN, AWS, Vercel Serverless\n✓ Sub-1.5 second loading speed with 95+ Core Web Vitals score!`;
  }

  // Default Fallback
  return `KioraTech ("We Build, You Rule") me aapka swagat hai! 🙏\n\nHum high-speed business websites aur Shopify stores banate hain sirf **4 se 7 din** me (Starting ₹14,999).\n\nAapki requirement ke liye humse direct connect karein:\n📱 Call/WhatsApp: ${phone}\n💬 WhatsApp: https://wa.me/${whatsapp}\n\nYa apna 10-digit phone number yahan type karein, hamari team aapse turant connect karegi!`;
}

app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ success: false, error: 'Message is required' });
  }

  const db = readDB();
  const settings = db.settings || {};
  const geminiKey = process.env.GEMINI_API_KEY || settings.geminiApiKey || '';
  const openaiKey = process.env.OPENAI_API_KEY || settings.openaiApiKey || '';

  // 1. If Gemini API Key is configured, use Gemini 1.5 Flash
  if (geminiKey) {
    try {
      const systemInstruction = `You are KioraBot, the official smart AI assistant of KioraTech ("We Build, You Rule").
KioraTech is a full-service web development and digital agency based in Lucknow, India.
Website: http://localhost:5000 / https://kioratech.vercel.app
Instagram: @kiora.tech (https://www.instagram.com/kiora.tech/#)
Phone/WhatsApp: +91 92194 61302
Email: kioratech12@gmail.com
Address: D-463, LDA Colony, Near Spring Dale College, Kanpur Road, Lucknow - 226012, UP
Turnaround: All starter websites and Shopify stores are delivered in 4 to 7 days (4–7 din).
Key Services:
- Custom Web & App Development: starting ₹14,999
- Shopify D2C Store Setup: starting ₹29,999
- Social Media & Reels Branding: starting ₹12,999/mo
- Website Speed & Local Google SEO: starting ₹9,999
Verified Live Client Websites built by KioraTech:
1. Organic Sanjeevani Roots (organicsanjeevaniroots.com) - Herbal & Ayurvedic Superfoods D2C store with 1-click WhatsApp checkout.
2. Kiyan Export (kiyanexports.com) - Global B2B Herbal & Botanical wholesale exporter (Est. 2014) with quote engine.
Personality: Warm, energetic, polite, professional. Respond in natural Hindi, Hinglish, or English depending on user greeting. Provide helpful, crisp answers with emojis and bullet points. Always invite them to connect on WhatsApp (+91 92194 61302) or share their 10-digit number.`;

      const contents = [];
      if (Array.isArray(history)) {
        history.slice(-6).forEach(h => {
          contents.push({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.content || '' }]
          });
        });
      }
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 350
          }
        })
      });

      if (geminiRes.ok) {
        const geminiData = await geminiRes.json();
        const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return res.json({ success: true, reply: text, provider: 'gemini' });
        }
      }
    } catch (apiErr) {
      console.warn('Gemini API call failed, falling back to local NLP engine:', apiErr.message);
    }
  }

  // 2. If OpenAI Key is configured
  if (openaiKey) {
    try {
      const messages = [
        {
          role: 'system',
          content: `You are KioraBot, the official smart assistant of KioraTech ("We Build, You Rule") in Lucknow, India. Deliver websites in 4-7 days. Web starting ₹14,999, Shopify D2C starting ₹29,999. Live clients: organicsanjeevaniroots.com, kiyanexports.com. WhatsApp/Phone: +91 92194 61302. Address: D-463, LDA Colony, Near Spring Dale College, Kanpur Road, Lucknow. Instagram: @kiora.tech. Keep answers crisp and friendly in natural Hindi/Hinglish.`
        }
      ];
      if (Array.isArray(history)) {
        history.slice(-4).forEach(h => {
          messages.push({ role: h.role === 'user' ? 'user' : 'assistant', content: h.content });
        });
      }
      messages.push({ role: 'user', content: message });

      const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          max_tokens: 350,
          temperature: 0.7
        })
      });

      if (openaiRes.ok) {
        const openData = await openaiRes.json();
        const text = openData?.choices?.[0]?.message?.content;
        if (text) {
          return res.json({ success: true, reply: text, provider: 'openai' });
        }
      }
    } catch (apiErr) {
      console.warn('OpenAI API call failed, falling back to local NLP engine:', apiErr.message);
    }
  }

  // 3. Instant Smart Local NLP Fallback Engine
  const reply = generateSmartLocalReply(message, settings);
  res.json({ success: true, reply, provider: 'local-nlp' });
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
