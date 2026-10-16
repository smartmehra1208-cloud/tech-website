# 🚀 KioraTech — We Build, You Rule
### Official Digital Agency, E-Commerce Scaling & Dynamic Web Platform

KioraTech is a complete, production-grade technology platform built with modern HTML5, CSS3 Glassmorphism, Vanilla JavaScript, Node.js, and an Express REST API with zero-config JSON database persistence.

---

## 🌟 Key Features

### 🖥️ Client Website (`http://localhost:5000`)
1. **Interactive Constellation Canvas**: Particle node background reacting to mouse movement.
2. **Dynamic Hero Section**: 
   - Animated typewriter headline switching between core agency specialties.
   - 3D floating showcase card featuring the official KioraTech brand logo and live growth indicators (+340% sales velocity).
3. **Services Hub (6 Core Pillars)**:
   - Web & Mobile App Development
   - Amazon & Flipkart Complete Seller Account Handling
   - SEO & Organic Google Top #1 Rankings
   - Social Media & Viral Reels / Creative Branding
   - Shopify & D2C E-Commerce Stores
   - Custom Enterprise Portals & Automations
4. **Interactive Web Packages Switcher**:
   - Tabbed view for Starter (₹14,999), Business (₹29,999), and Enterprise (₹54,999).
5. **Dynamic Projects & Portfolio (Live from Server)**:
   - Category filtering chips (All, Web & Apps, Amazon & Flipkart, SEO, Social).
   - Real-time search bar.
   - Interactive Case Study modal dialogs detailing Problem, Strategy, and Business Results.
6. **Dynamic Services & Pricing Catalog (Live from Server)**:
   - Automatically synchronizes with the server CMS.
7. **Interactive Live Project Cost & ROI Estimator**:
   - Clients configure website scope, marketplace management, SEO, and add-ons in real time.
   - Instant calculation with discount comparison and **1-click WhatsApp Quotation generator**.
8. **Client Testimonials Slider**:
   - Verified founder reviews with star ratings and photos.
9. **5-Step Execution Workflow**:
   - Discovery → Wireframe → Build → QA Launch → Continuous Scale.
10. **Interactive FAQ Accordion**:
    - Detailed answers for timelines, Amazon onboarding, SEO timeframes, and source code ownership.
11. **Lead Generation & Contact System**:
    - Direct submission to the server database.
    - Generates unique ticket tracking IDs (e.g. `KT-8492`) with 1-click continuation on WhatsApp.
12. **Smart KioraBot (Virtual AI Consultant)**:
    - Interactive chat assistant with quick prompt buttons and lead-capture capability.
13. **Dual Themes & Bilingual Support**:
    - Dark Obsidian Mode / Snow Light Mode (persisted in `localStorage`).
    - English / Hindi language toggle (`🌐 हिंदी`).

---

## ⚙️ Server Admin CMS Panel (`http://localhost:5000/admin`)

Manage every single part of the website live from the server:
- **Default Passcode**: `admin123` (can be changed anytime in Settings).
- **Dashboard Overview**: Live KPI counters of projects, catalog packages, customer leads, and reviews.
- **Projects Manager**:
  - Add new case studies with title, category, metrics, screenshots (URL or direct file upload), tags, and problem/solution notes.
  - Edit or delete any project with instant live sync.
- **Services Catalog Manager**:
  - Add, edit, or delete service packages, update pricing, delivery times, and features.
- **Inbound Leads & CRM**:
  - View every inquiry submitted through the website contact form, calculator, or chatbot.
  - Change lead status (`New`, `In Progress`, `Contacted`, `Archived`).
  - **1-Click WhatsApp Chat Button**: Open direct WhatsApp conversation with the customer.
- **Testimonials Manager**:
  - Add or remove client reviews.
- **Site & WhatsApp Configuration**:
  - Update your company WhatsApp number, phone, email, and office address. All WhatsApp buttons on the site update automatically!

---

## 🚀 How to Run the Website

### Start Server:
```bash
npm start
```
Or:
```bash
node server.js
```

### Access URLs:
- **Main Website**: [http://localhost:5000](http://localhost:5000)
- **Admin CMS Dashboard**: [http://localhost:5000/admin](http://localhost:5000/admin)
- **Admin Passcode**: `admin123`

---

## 📁 Project Directory Structure
```
kIORA TECH/
├── package.json               # Dependencies (express, cors, multer)
├── server.js                  # Express REST API & static server
├── README.md                  # Project documentation
├── data/
│   └── db.json                # Server database (projects, catalog, leads, config)
└── public/
    ├── index.html             # Client Website
    ├── admin.html             # Admin CMS Panel
    ├── css/
    │   ├── style.css          # Website styling (Dark/Light mode, animations)
    │   └── admin.css          # Admin panel styling
    ├── js/
    │   ├── main.js            # Frontend interactivity, API sync, calculator, chatbot
    │   └── admin.js           # Admin CMS CRUD controller
    ├── images/
    │   └── logo.png           # Official KioraTech logo
    └── uploads/               # Uploaded project images & media
```
