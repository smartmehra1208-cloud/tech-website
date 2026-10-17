/**
 * KIORA TECH — Advanced Dynamic Client Engine
 * Handles particles, animations, dynamic REST API fetching, calculator, chatbot, and modals
 */

// Fallback seed data in case site is loaded directly via file:// without server running
const FALLBACK_DATA = {
  settings: {
    whatsapp: "919219461302",
    phone: "+91 92194 61302",
    email: "kioratech12@gmail.com",
    address: "D-463, LDA Colony, Near Spring Dale College, Kanpur Road, Lucknow - 226012, UP",
    instagram: "https://www.instagram.com/kiora.tech/#",
    instagramHandle: "@kiora.tech",
    companyName: "KioraTech"
  },
  projects: [
    {
      id: "proj-live-1",
      title: "Organic Sanjeevani Roots — Ayurvedic D2C E-Commerce Store",
      category: "web",
      categoryLabel: "Live Client Website",
      client: "Organic Sanjeevani Roots (Lucknow)",
      description: "100% Pure Herbal & Ayurvedic Superfoods D2C storefront. Features sub-second mobile loading, direct WhatsApp 1-click checkout, product catalog (Moringa powder, Himalayan Sea Buckthorn juice, Ashwagandha roots, Desi Ghee cookies), and rich Ayurvedic schema SEO.",
      result: "Sub-1s Mobile Speed & Instant WhatsApp Ordering",
      tags: ["Live Client Website", "Ayurvedic D2C Store", "WhatsApp Checkout", "Speed 99+", "Schema SEO"],
      liveUrl: "https://organicsanjeevaniroots.com/",
      featured: true,
      image: "https://www.organicsanjeevaniroots.com/images/moringa-powder-front.jpg",
      caseStudy: {
        problem: "Client needed a clean, chemical-free herbal superfoods storefront with instant mobile purchasing and zero technical bloat for their Lucknow wellness brand.",
        solution: "Built a custom lightweight responsive web store with zero render-blocking assets, streamlined 1-click WhatsApp order integration, and rich Ayurvedic wellness schema markup.",
        metrics: [
          "Sub-1 second page load speed across mobile devices",
          "Direct WhatsApp inquiries and order conversions",
          "100% Google SEO indexing with verified rich snippets"
        ]
      }
    },
    {
      id: "proj-live-2",
      title: "Kiyan Export — Global B2B Herbal Manufacturer & Bulk Exporter",
      category: "web",
      categoryLabel: "Live Client Website",
      client: "Kiyan Export & Herbal Manufacturing (Est. 2014)",
      description: "Enterprise wholesale manufacturing & bulk export portal for certified organic Shilajit, Ashwagandha, and botanical extracts. Features tiered volume discounts, Google Ads conversion tracking, automated RFQ inquiry engine, and international buyer catalog.",
      result: "High-Converting Global B2B Export Portal",
      tags: ["Live Client Website", "B2B Export Portal", "Google Ads Conversion", "OEM Private Label", "Fast Loading"],
      liveUrl: "https://kiyanexports.com/",
      featured: true,
      image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80",
      caseStudy: {
        problem: "Established exporter needed a high-credibility international B2B digital portal to attract foreign importers from USA, Europe & UAE and handle bulk OEM private label inquiries.",
        solution: "Engineered a robust, fast-loading B2B export website with tiered wholesale pricing specs, ISO/GMP certification trust badges, automated quote request forms, and Google Ads call tracking.",
        metrics: [
          "International bulk buyer inquiries generated from USA, UAE & Europe",
          "Integrated Google Ads call and form conversion tracking",
          "Tiered wholesale price calculation and instant RFQ system"
        ]
      }
    },
    {
      id: "proj-live-3",
      title: "Shopify D2C Store — Custom Theme & High-Converting Checkout",
      category: "web",
      categoryLabel: "Shopify & E-Commerce",
      client: "Aura Lifestyle D2C Brand",
      description: "Custom Shopify storefront designed and developed from scratch. Features Liquid theme customization, Razorpay payment gateway integration, automated abandoned cart recovery, mobile-first product filters, and 1.2s checkout speed.",
      result: "+340% Mobile Checkout Conversions",
      tags: ["Shopify Plus", "Liquid Customization", "Razorpay Gateway", "Mobile-First UX", "Abandoned Cart Engine"],
      liveUrl: "https://organicsanjeevaniroots.com/",
      featured: true,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
      caseStudy: {
        problem: "Client experienced high checkout drop-offs and poor mobile navigation on standard Shopify templates.",
        solution: "Engineered a bespoke lightweight Shopify theme with custom product variants, 1-click buy, and automated WhatsApp order alerts.",
        metrics: [
          "Checkout abandonment dropped by 42%",
          "Page speed increased by 3.5x",
          "₹48 Lakhs monthly sales achieved in 4 months"
        ]
      }
    }
  ],
  catalog: [
    {
      id: "cat-1",
      name: "Starter Website Package",
      category: "Web Design",
      price: 14999,
      billingType: "One-time",
      badge: "Startup Special",
      deliveryDays: "4 - 7 Days",
      features: [
        "1 to 5 Fully Responsive Custom Pages",
        "High-Speed Mobile & Desktop UI",
        "WhatsApp Direct Chat Button Integration",
        "Interactive Lead Contact Form with Email Alert",
        "Free SSL Certificate & Security Setup",
        "Basic On-Page SEO & Google Search Console indexing"
      ]
    },
    {
      id: "cat-2",
      name: "Business Growth Website",
      category: "Web Design",
      price: 29999,
      billingType: "One-time",
      badge: "Most Popular",
      deliveryDays: "7 - 10 Days",
      features: [
        "Up to 10 Custom Designed Pages",
        "Sleek Glassmorphic 3D & Micro-Animations",
        "Dynamic Portfolio & Live Projects Showcase",
        "Google Analytics 4 & Meta Pixel Setup",
        "Advanced SEO Architecture & Speed 95+"
      ]
    },
    {
      id: "cat-3",
      name: "Shopify D2C Store Setup",
      category: "Shopify & E-Commerce",
      price: 34999,
      billingType: "One-time",
      badge: "Trending D2C",
      deliveryDays: "7 - 10 Days",
      features: [
        "Complete Shopify Store Setup & Custom Domain",
        "Premium Theme Customization & Mobile UX",
        "Payment Gateways: Razorpay, Cashfree & COD",
        "Cataloging & Product Variant Setup (Up to 30 Products)",
        "Automated Abandoned Cart Recovery Funnel",
        "WhatsApp Direct Order Alert & Customer Chat"
      ]
    },
    {
      id: "cat-4",
      name: "Custom E-Commerce & Portal",
      category: "Web Design",
      price: 54999,
      billingType: "One-time",
      badge: "Enterprise Grade",
      deliveryDays: "2 - 3 Weeks",
      features: [
        "Unlimited Products Catalog & Categories",
        "Razorpay, Stripe & Cash-on-Delivery Setup",
        "Full Admin CMS & Inventory Dashboard",
        "Customer Login, Wishlist & Order Tracking",
        "Automated WhatsApp & Email Order Alerts",
        "Abandoned Cart Recovery System"
      ]
    },
    {
      id: "cat-5",
      name: "Amazon & Flipkart Seller Handling",
      category: "Marketplace Management",
      price: 17999,
      billingType: "Per Month",
      badge: "High Demand",
      deliveryDays: "Ongoing Monthly",
      features: [
        "Seller Central & Flipkart KYC / Onboarding",
        "High-Converting SEO Product Listings (Title, Bullets, Keywords)",
        "A+ EBC Graphic Design & Brand Store Setup",
        "Daily Order Processing & Dispatch Management",
        "Amazon & Flipkart Sponsored PPC Ad Optimization",
        "SAFE-T & Unclaimed Returns Recovery"
      ]
    },
    {
      id: "cat-6",
      name: "Performance SEO & Google Dominance",
      category: "Digital Marketing",
      price: 16999,
      billingType: "Per Month",
      badge: "Proven Results",
      deliveryDays: "Ongoing Monthly",
      features: [
        "Complete Technical Website Audit & Error Fixing",
        "In-depth Commercial Keyword Research (High Intent)",
        "On-Page Optimization (Titles, Meta, H-tags, Schema)",
        "High-Authority Contextual Backlinks Creation",
        "Google Business Profile (GMB) Local SEO Optimization",
        "Transparent Monthly Ranking & Traffic Reports"
      ]
    },
    {
      id: "cat-7",
      name: "Social Media Growth & Creative Branding",
      category: "Social Media",
      price: 15999,
      billingType: "Per Month",
      badge: "Viral Strategy",
      deliveryDays: "Ongoing Monthly",
      features: [
        "15 High-Quality Graphic Posts + Carousel Designs",
        "8 Custom Video Reels / Shorts with Scripting & Hooks",
        "High-Converting Ad Copy & Hashtag Strategy",
        "Meta Ads Setup for Targeted Leads & Inquiries",
        "Community Management & DM Comment Responses",
        "Monthly Growth Analytics & Engagement Breakdown"
      ]
    }
  ],
  testimonials: [
    {
      id: "test-1",
      name: "Rahul Singhania",
      role: "Founder, Urban Living Essentials",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      text: "KioraTech ne hamari website aur Amazon seller account dono sambhale. Pehle hamari sales ₹1.5L par ruki hui thi, unke A+ content aur PPC strategy ke baad sales 3.5x badh kar ₹6L+ monthly ho gayi! Team bohot dedicated hai."
    },
    {
      id: "test-2",
      name: "Neha Kapoor",
      role: "Creative Director, Aurelia Boutique",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      text: "SEO ke baad hamari boutique Google par 'Designer Dresses Delhi' par pehle page par aa gayi. Har din 15 se 20 organic leads aati hain bina ads par paise kharch kiye. Highly satisfied with their results!"
    },
    {
      id: "test-3",
      name: "Amit Vardhan",
      role: "Managing Director, FastLogix Solutions",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      text: "The custom logistics web portal KioraTech built for us is world-class. It automated our entire consignment tracking and reduced support calls by 75%. Inka communication aur delivery timeline 100% on point tha."
    }
  ]
};

// Global App State
let APP_STATE = {
  projects: [],
  catalog: [],
  testimonials: [],
  settings: FALLBACK_DATA.settings,
  currentCategory: 'all',
  searchQuery: '',
  testimonialIndex: 0,
  isHindi: false
};

// ================== INIT APPLICATION ==================
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initTyping();
  initTheme();
  initScrollEffects();
  initPackageTabs();
  initFaqAccordion();
  initPriceCalculator();
  initChatbot();
  initContactForm();
  loadDataFromServer();
  setupLanguageToggle();
});

// ================== 1. PARTICLES & CANVAS ==================
function initParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let width, height;

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const isMobile = window.innerWidth < 768;
  const count = isMobile ? 24 : 55;
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 1.8 + 1
    });
  }

  let mouse = { x: -1000, y: -1000 };
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }, { passive: true });

  // Pause render loop when hero is offscreen to save battery & CPU
  let isHeroVisible = true;
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      isHeroVisible = entries[0].isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(canvas);
  }

  function render() {
    if (!isHeroVisible) {
      setTimeout(() => requestAnimationFrame(render), 250);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.fillStyle = '#4bbdbd';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      // Connect near particles
      for (let j = i + 1; j < particles.length; j++) {
        let q = particles[j];
        let dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 115) {
          ctx.strokeStyle = `rgba(75, 189, 189, ${(1 - dist / 115) * 0.3})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }

      // Mouse magnet lines
      if (!isMobile) {
        let mDist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (mDist < 150) {
          ctx.strokeStyle = `rgba(0, 240, 255, ${(1 - mDist / 150) * 0.55})`;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(render);
  }
  render();
}

// ================== 2. TYPEWRITER EFFECT ==================
function initTyping() {
  const el = document.getElementById('hero-typed-text');
  if (!el) return;

  const words = [
    "High-Performance Websites & Web Apps",
    "Amazon & Flipkart E-Commerce Scale",
    "Page #1 Google Organic SEO & Leads",
    "High-ROAS Meta & Google Ad Campaigns",
    "Viral Social Media Growth & Branding"
  ];

  let wordIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function type() {
    const current = words[wordIdx];
    el.textContent = current.substring(0, charIdx);

    let speed = isDeleting ? 30 : 65;

    if (!isDeleting && charIdx === current.length) {
      speed = 1800; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      wordIdx = (wordIdx + 1) % words.length;
      speed = 400;
    } else {
      charIdx += isDeleting ? -1 : 1;
    }

    setTimeout(type, speed);
  }
  type();
}

// ================== 3. THEME MANAGEMENT ==================
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('kiora_theme') || 'dark';

  root.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('kiora_theme', next);
      updateThemeIcon(next);
    });
  }
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('theme-icon');
  if (!icon) return;
  icon.textContent = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
}

// ================== 4. SCROLL & CURSOR GLOW ==================
function initScrollEffects() {
  const progressBar = document.getElementById('scroll-progress');
  const glow = document.getElementById('cursor-glow');
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  // Throttled RAF scroll progress indicator
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollTotal > 0 ? (window.scrollY / scrollTotal) * 100 : 0;
        if (progressBar) progressBar.style.width = `${progress}%`;
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  // GPU-accelerated RAF cursor tracking
  let mouseTicking = false;
  window.addEventListener('mousemove', (e) => {
    if (!mouseTicking && glow) {
      const clientX = e.clientX;
      const clientY = e.clientY;
      requestAnimationFrame(() => {
        glow.style.transform = `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%)`;
        mouseTicking = false;
      });
      mouseTicking = true;
    }
  }, { passive: true });

  // Mobile drawer navigation with outside click handler
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('active');
    });

    // Close nav on nav-item click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('active'));
    });

    // Close mobile nav on outside click
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileBtn.contains(e.target)) {
        navLinks.classList.remove('active');
      }
    });
  }

  // Keyboard accessibility: Escape key closes any active modal or menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (typeof closeProjectModal === 'function') closeProjectModal();
      if (typeof closeSuccessModal === 'function') closeSuccessModal();
      if (navLinks) navLinks.classList.remove('active');
      const chatBox = document.getElementById('chatbot-box');
      if (chatBox) chatBox.classList.remove('active');
    }
  });

  // IntersectionObserver for counters & reveals
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        const counters = entry.target.querySelectorAll('[data-target]');
        counters.forEach(c => animateCounter(c));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = +el.getAttribute('data-target');
  const suffix = el.getAttribute('data-suffix') || '';
  let count = 0;
  const step = Math.ceil(target / 45);

  const timer = setInterval(() => {
    count += step;
    if (count >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = count + suffix;
    }
  }, 35);
}

// ================== 5. FETCH DATA FROM SERVER ==================
async function loadDataFromServer() {
  try {
    // 1. Fetch settings
    const setRes = await fetch('/api/settings').catch(() => null);
    if (setRes && setRes.ok) {
      const setData = await setRes.json();
      if (setData.settings) {
        APP_STATE.settings = { ...APP_STATE.settings, ...setData.settings };
        updateContactLinks(APP_STATE.settings);
      }
    } else {
      updateContactLinks(FALLBACK_DATA.settings);
    }

    // 2. Fetch projects
    const projRes = await fetch('/api/projects').catch(() => null);
    if (projRes && projRes.ok) {
      const projData = await projRes.json();
      APP_STATE.projects = projData.projects || [];
    } else {
      APP_STATE.projects = FALLBACK_DATA.projects;
    }
    renderProjects(APP_STATE.projects);

    // 3. Fetch catalog
    const catRes = await fetch('/api/catalog').catch(() => null);
    if (catRes && catRes.ok) {
      const catData = await catRes.json();
      APP_STATE.catalog = catData.catalog || [];
    } else {
      APP_STATE.catalog = FALLBACK_DATA.catalog;
    }
    renderCatalog(APP_STATE.catalog);

    // 4. Fetch testimonials
    const testRes = await fetch('/api/testimonials').catch(() => null);
    if (testRes && testRes.ok) {
      const testData = await testRes.json();
      APP_STATE.testimonials = testData.testimonials || [];
    } else {
      APP_STATE.testimonials = FALLBACK_DATA.testimonials;
    }
    renderTestimonials(APP_STATE.testimonials);

  } catch (err) {
    console.warn('Backend server not reachable, using offline state:', err);
    APP_STATE.projects = FALLBACK_DATA.projects;
    APP_STATE.catalog = FALLBACK_DATA.catalog;
    APP_STATE.testimonials = FALLBACK_DATA.testimonials;
    renderProjects(APP_STATE.projects);
    renderCatalog(APP_STATE.catalog);
    renderTestimonials(APP_STATE.testimonials);
  }

  setupPortfolioFilters();
}

function updateContactLinks(settings) {
  const num = settings.whatsapp || '919219461302';
  document.querySelectorAll('.dynamic-whatsapp-link').forEach(link => {
    link.href = `https://wa.me/${num}?text=${encodeURIComponent('Hi KioraTech, I want to discuss a website project for my business.')}`;
  });
  document.querySelectorAll('.dynamic-phone-text').forEach(p => p.textContent = settings.phone || '+91 92194 61302');
  document.querySelectorAll('.dynamic-email-text').forEach(e => e.textContent = settings.email || 'kioratech12@gmail.com');
  document.querySelectorAll('.dynamic-address-text').forEach(a => a.textContent = settings.address || 'D-463, LDA Colony, Near Spring Dale College, Kanpur Road, Lucknow - 226012, UP');
  
  const insta = settings.instagram || 'https://www.instagram.com/kiora.tech/#';
  document.querySelectorAll('.dynamic-instagram-link').forEach(link => {
    link.href = insta;
  });
}

// ================== 6. RENDER PROJECTS & FILTER ==================
function renderProjects(projects) {
  const container = document.getElementById('projects-container');
  if (!container) return;

  if (projects.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 50px 20px; color: var(--text-muted);">
        <i style="font-size: 2.5rem; display: block; margin-bottom: 12px;">🔍</i>
        <h3>No projects found in this category</h3>
        <p>Try selecting 'All' or searching a different term.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = projects.map(p => {
    const isLive = p.categoryLabel && p.categoryLabel.toLowerCase().includes('live');
    const hasLiveUrl = p.liveUrl && p.liveUrl !== '#' && p.liveUrl.startsWith('http');

    return `
      <div class="project-card animate-card ${isLive ? 'live-client-card' : ''}" data-category="${p.category}">
        <div class="project-card-image">
          <img src="${p.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'}" alt="${escapeHtml(p.title)}" loading="lazy" decoding="async" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';">
          ${isLive 
            ? `<span class="project-card-badge" style="background: rgba(16, 185, 129, 0.25); border-color: #10b981; color: #34d399; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;">
                <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#10b981;box-shadow:0 0 8px #10b981;"></span> LIVE CLIENT SITE
               </span>`
            : `<span class="project-card-badge">${escapeHtml(p.categoryLabel || p.category)}</span>`
          }
          <span class="project-card-metric">${escapeHtml(p.result || 'Top Performer')}</span>
        </div>
        <div class="project-card-body">
          <div>
            <h3>${escapeHtml(p.title)}</h3>
            <div class="project-client-name">Client: ${escapeHtml(p.client || 'Partner Brand')}</div>
            <p>${escapeHtml(p.description)}</p>
            <div class="project-tags">
              ${(p.tags || []).map(t => `<span class="project-tag ${t.includes('Live') ? 'tag-live' : ''}">${escapeHtml(t)}</span>`).join('')}
            </div>
          </div>
          <div class="project-card-actions">
            <button class="btn btn-secondary btn-sm" onclick="openProjectModal('${p.id}')">
              <span>Case Study</span> <i>→</i>
            </button>
            <a href="${p.liveUrl || '#'}" target="_blank" rel="noopener" class="btn btn-sm ${hasLiveUrl ? 'btn-live-launch' : 'btn-primary'}" style="flex-grow: 1;">
              <span>${hasLiveUrl ? '🚀 Visit Live Website' : 'Live Demo'}</span> <i>↗</i>
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function setupPortfolioFilters() {
  const chips = document.querySelectorAll('.filter-chip');
  const searchInput = document.getElementById('portfolio-search-input');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      APP_STATE.currentCategory = chip.getAttribute('data-filter') || 'all';
      filterAndRenderProjects();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      APP_STATE.searchQuery = e.target.value.toLowerCase().trim();
      filterAndRenderProjects();
    });
  }
}

function filterAndRenderProjects() {
  let list = APP_STATE.projects;

  if (APP_STATE.currentCategory !== 'all') {
    list = list.filter(p => p.category.toLowerCase() === APP_STATE.currentCategory.toLowerCase());
  }

  if (APP_STATE.searchQuery) {
    const q = APP_STATE.searchQuery;
    list = list.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.client && p.client.toLowerCase().includes(q)) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  renderProjects(list);
}

// Case Study Modal
window.openProjectModal = function(id) {
  const project = APP_STATE.projects.find(p => p.id === id);
  if (!project) return;

  const modal = document.getElementById('project-modal');
  const content = document.getElementById('project-modal-content');
  if (!modal || !content) return;

  const cs = project.caseStudy || {
    problem: "Needed a scalable digital infrastructure to acquire more customers.",
    solution: "Engineered by KioraTech with optimized performance and user experience.",
    metrics: ["100% on-time delivery", "Significant ROI boost"]
  };

  content.innerHTML = `
    <div style="margin-bottom: 20px;">
      <span class="project-card-badge" style="position: static; margin-bottom: 10px; display: inline-block;">
        ${escapeHtml(project.categoryLabel || project.category)}
      </span>
      <h2 style="font-family: var(--font-heading); font-size: 1.8rem; margin-bottom: 6px;">${escapeHtml(project.title)}</h2>
      <div style="color: var(--teal-400); font-weight: 600;">Client: ${escapeHtml(project.client || 'Enterprise Client')}</div>
    </div>
    
    <div style="border-radius: var(--radius-md); overflow: hidden; margin-bottom: 24px; max-height: 280px;">
      <img src="${project.image}" alt="${escapeHtml(project.title)}" style="width: 100%; height: 100%; object-fit: cover;">
    </div>

    <div style="display: grid; gap: 16px; margin-bottom: 24px;">
      <div style="background: var(--bg-card); padding: 18px; border-radius: var(--radius-md); border-left: 4px solid #ef4444;">
        <h4 style="color: #f87171; margin-bottom: 6px; font-size: 0.95rem;">⚡ The Challenge / Problem:</h4>
        <p style="font-size: 0.92rem; color: var(--text-secondary);">${escapeHtml(cs.problem)}</p>
      </div>

      <div style="background: var(--bg-card); padding: 18px; border-radius: var(--radius-md); border-left: 4px solid var(--teal-400);">
        <h4 style="color: var(--teal-300); margin-bottom: 6px; font-size: 0.95rem;">💡 KioraTech Strategy & Execution:</h4>
        <p style="font-size: 0.92rem; color: var(--text-secondary);">${escapeHtml(cs.solution)}</p>
      </div>

      <div style="background: var(--bg-card); padding: 18px; border-radius: var(--radius-md); border-left: 4px solid #10b981;">
        <h4 style="color: #34d399; margin-bottom: 8px; font-size: 0.95rem;">📈 Key Business Impact & Results:</h4>
        <ul style="padding-left: 20px; font-size: 0.9rem; color: var(--text-secondary);">
          ${(cs.metrics || []).map(m => `<li style="margin-bottom: 4px;">${escapeHtml(m)}</li>`).join('')}
        </ul>
      </div>
    </div>

    <div style="display: flex; gap: 14px; justify-content: flex-end; border-top: 1px solid var(--border-subtle); padding-top: 18px;">
      <button class="btn btn-secondary" onclick="closeProjectModal()">Close</button>
      <a href="https://wa.me/${APP_STATE.settings.whatsapp}?text=${encodeURIComponent(`Hi KioraTech, I saw your case study '${project.title}' and want similar results for my brand.`)}" target="_blank" class="btn btn-primary">
        Discuss Similar Project ↗
      </a>
    </div>
  `;

  modal.classList.add('active');
};

window.closeProjectModal = function() {
  const modal = document.getElementById('project-modal');
  if (modal) modal.classList.remove('active');
};

// ================== 7. RENDER CATALOG ==================
function renderCatalog(catalogItems) {
  const container = document.getElementById('catalog-container');
  if (!container) return;

  container.innerHTML = catalogItems.map((item, idx) => `
    <div class="catalog-card ${idx === 1 ? 'featured-card' : ''}">
      <div>
        <span class="catalog-badge-pill">${escapeHtml(item.badge || 'Recommended')}</span>
        <h3>${escapeHtml(item.name)}</h3>
        <div class="cat-category">${escapeHtml(item.category)}</div>
        <div class="catalog-price-wrap">
          <span class="currency">₹</span>
          <span class="amount">${Number(item.price).toLocaleString('en-IN')}</span>
          <span class="period">/${escapeHtml(item.billingType || 'One-time')}</span>
        </div>
        <div class="catalog-delivery">
          <i>⏱</i> <span>Delivery: <strong>${escapeHtml(item.deliveryDays || '3-5 Days')}</strong></span>
        </div>
        <ul class="catalog-features-list">
          ${(item.features || []).map(f => `<li>${escapeHtml(f)}</li>`).join('')}
        </ul>
      </div>
      <div>
        <a href="#contact" onclick="selectServiceForContact('${escapeHtml(item.name)}')" class="btn ${idx === 1 ? 'btn-primary' : 'btn-secondary'}" style="width: 100%;">
          <span>Choose Package</span> <i>→</i>
        </a>
      </div>
    </div>
  `).join('');
}

window.selectServiceForContact = function(serviceName) {
  const select = document.getElementById('contact-service-select');
  if (select) {
    let found = false;
    for (let opt of select.options) {
      if (opt.value.toLowerCase().includes(serviceName.toLowerCase()) || serviceName.toLowerCase().includes(opt.value.toLowerCase())) {
        opt.selected = true;
        found = true;
        break;
      }
    }
    if (!found) {
      const newOpt = new Option(serviceName, serviceName, true, true);
      select.add(newOpt);
    }
  }
};

// ================== 8. WEB PACKAGES TABS ==================
function initPackageTabs() {
  const tabBtns = document.querySelectorAll('.pkg-tab-btn');
  const panes = document.querySelectorAll('.pkg-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });
}

// ================== 9. INTERACTIVE QUOTE / PRICE CALCULATOR ==================
function initPriceCalculator() {
  let websitePrice = 14999;
  let marketplacePrice = 0;
  let seoPrice = 0;
  let addOnPrice = 0;

  const websiteRadios = document.querySelectorAll('.calc-web-opt');
  const mktRadios = document.querySelectorAll('.calc-mkt-opt');
  const seoRadios = document.querySelectorAll('.calc-seo-opt');
  const addOnChecks = document.querySelectorAll('.calc-addon-check');

  function calculate() {
    let total = websitePrice + marketplacePrice + seoPrice + addOnPrice;
    let original = Math.round(total * 1.25); // Show 20% discount comparison

    const totalEl = document.getElementById('calc-total-amount');
    const originalEl = document.getElementById('calc-original-amount');
    const timeEl = document.getElementById('calc-delivery-time');

    if (totalEl) totalEl.textContent = '₹' + total.toLocaleString('en-IN');
    if (originalEl) originalEl.textContent = '₹' + original.toLocaleString('en-IN');

    // Estimate timeline
    let timeline = "5 - 7 Days";
    if (total > 60000) timeline = "2 - 3 Weeks";
    else if (total > 30000) timeline = "10 - 14 Days";
    if (timeEl) timeEl.textContent = timeline;

    // Update WhatsApp quote link
    const waBtn = document.getElementById('calc-whatsapp-btn');
    if (waBtn) {
      const msg = `Hi KioraTech, I generated an instant estimate on your website:\n- Estimated Price: ₹${total.toLocaleString('en-IN')}\n- Estimated Timeline: ${timeline}\nPlease confirm feasibility and share next steps!`;
      waBtn.href = `https://wa.me/${APP_STATE.settings.whatsapp}?text=${encodeURIComponent(msg)}`;
    }
  }

  websiteRadios.forEach(card => {
    card.addEventListener('click', () => {
      websiteRadios.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      websitePrice = +card.getAttribute('data-price');
      calculate();
    });
  });

  mktRadios.forEach(card => {
    card.addEventListener('click', () => {
      mktRadios.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      marketplacePrice = +card.getAttribute('data-price');
      calculate();
    });
  });

  seoRadios.forEach(card => {
    card.addEventListener('click', () => {
      seoRadios.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      seoPrice = +card.getAttribute('data-price');
      calculate();
    });
  });

  addOnChecks.forEach(check => {
    check.addEventListener('click', () => {
      check.classList.toggle('active');
      addOnPrice = 0;
      document.querySelectorAll('.calc-addon-check.active').forEach(c => {
        addOnPrice += +c.getAttribute('data-price');
      });
      calculate();
    });
  });

  calculate();
}

// ================== 10. TESTIMONIALS SLIDER ==================
function renderTestimonials(testimonials) {
  const container = document.getElementById('testimonials-container');
  const dotsContainer = document.getElementById('test-dots-container');
  if (!container || testimonials.length === 0) return;

  function showSlide(index) {
    const item = testimonials[index];
    container.innerHTML = `
      <div class="testimonial-card-single animate-card">
        <div class="test-stars">★★★★★</div>
        <p class="test-quote">“${escapeHtml(item.text)}”</p>
        <div class="test-author-info">
          <img src="${item.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}" alt="${escapeHtml(item.name)}" class="test-author-img">
          <div class="test-author-text">
            <div class="test-author-name">${escapeHtml(item.name)}</div>
            <div class="test-author-role">${escapeHtml(item.role || 'Verified Business Owner')}</div>
          </div>
        </div>
      </div>
    `;

    if (dotsContainer) {
      dotsContainer.innerHTML = testimonials.map((_, i) => `
        <div class="test-dot ${i === index ? 'active' : ''}" onclick="goToTestimonial(${i})"></div>
      `).join('');
    }
  }

  window.goToTestimonial = function(idx) {
    APP_STATE.testimonialIndex = idx;
    showSlide(idx);
  };

  showSlide(0);

  // Auto rotate every 6 seconds
  setInterval(() => {
    APP_STATE.testimonialIndex = (APP_STATE.testimonialIndex + 1) % testimonials.length;
    showSlide(APP_STATE.testimonialIndex);
  }, 6000);
}

// ================== 11. FAQ ACCORDION ==================
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const q = item.querySelector('.faq-question');
    if (q) {
      q.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        items.forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    }
  });
}

// ================== 12. CONTACT FORM SUBMISSION ==================
function initContactForm() {
  const form = document.getElementById('lead-contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : 'Submit Inquiry';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Submitting...</span>`;
    }

    const payload = {
      name: document.getElementById('contact-name')?.value.trim() || '',
      email: document.getElementById('contact-email')?.value.trim() || '',
      phone: document.getElementById('contact-phone')?.value.trim() || '',
      service: document.getElementById('contact-service-select')?.value || 'Web Designing',
      budget: document.getElementById('contact-budget-select')?.value || 'Flexible',
      message: document.getElementById('contact-message')?.value.trim() || '',
      source: 'Website Contact Form'
    };

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        showSuccessModal(data.inquiryId, payload);
        form.reset();
      } else {
        alert(data.error || 'Failed to submit inquiry. Please try WhatsApp directly.');
      }
    } catch (err) {
      // Fallback: direct to WhatsApp
      console.warn('Directing to WhatsApp due to offline server:', err);
      const waMsg = `Hi KioraTech, I am ${payload.name}.\nService: ${payload.service}\nBudget: ${payload.budget}\nMessage: ${payload.message}`;
      window.open(`https://wa.me/${APP_STATE.settings.whatsapp}?text=${encodeURIComponent(waMsg)}`, '_blank');
      form.reset();
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
  });
}

function showSuccessModal(ticketId, payload) {
  const modal = document.getElementById('inquiry-success-modal');
  const idEl = document.getElementById('inquiry-ticket-id');
  const waBtn = document.getElementById('inquiry-whatsapp-link');

  if (idEl) idEl.textContent = ticketId || 'KT-9921';
  if (waBtn) {
    const msg = `Hi KioraTech, I just submitted an inquiry on your website (Ticket ID: ${ticketId}). Name: ${payload.name}, Service: ${payload.service}. Let's discuss details!`;
    waBtn.href = `https://wa.me/${APP_STATE.settings.whatsapp}?text=${encodeURIComponent(msg)}`;
  }

  if (modal) modal.classList.add('active');
}

window.closeSuccessModal = function() {
  const modal = document.getElementById('inquiry-success-modal');
  if (modal) modal.classList.remove('active');
};

// ================== 13. SMART KIORABOT CHATBOT ==================
function initChatbot() {
  const triggerBtn = document.getElementById('chatbot-trigger');
  const chatBox = document.getElementById('chatbot-box');
  const closeBtn = document.getElementById('chatbot-close');
  const sendBtn = document.getElementById('chat-send-btn');
  const input = document.getElementById('chat-input-text');
  const messagesDiv = document.getElementById('chat-messages');

  if (!triggerBtn || !chatBox) return;

  const chatHistory = [];

  // Toggle chatbot
  triggerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    chatBox.classList.toggle('active');
    const unreadDot = triggerBtn.querySelector('.chatbot-unread-dot');
    if (unreadDot) unreadDot.style.display = 'none';
    if (chatBox.classList.contains('active') && input) {
      setTimeout(() => input.focus(), 200);
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      chatBox.classList.remove('active');
    });
  }

  // Format message text with bold and clickable links
  function formatChatText(str) {
    if (!str) return '';
    let formatted = escapeHtml(str);
    // Bold **text**
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // URLs to links
    formatted = formatted.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener" style="color:var(--cyan-bright);text-decoration:underline;">$1</a>');
    // wa.me shorthand
    formatted = formatted.replace(/(wa\.me\/[^\s<]+)/g, '<a href="https://$1" target="_blank" rel="noopener" style="color:var(--cyan-bright);text-decoration:underline;">$1</a>');
    // Newlines
    formatted = formatted.replace(/\n/g, '<br>');
    return formatted;
  }

  function appendMsg(text, sender = 'bot') {
    const div = document.createElement('div');
    div.className = `chat-msg ${sender}`;
    div.innerHTML = formatChatText(text);
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  function showTypingIndicator() {
    removeTypingIndicator();
    const typingDiv = document.createElement('div');
    typingDiv.id = 'bot-typing-indicator';
    typingDiv.className = 'chat-msg bot typing-indicator-bubble';
    typingDiv.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
    messagesDiv.appendChild(typingDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  function removeTypingIndicator() {
    const el = document.getElementById('bot-typing-indicator');
    if (el) el.remove();
  }

  // Client-side smart fallback if backend API is unreachable
  function getClientFallbackReply(text) {
    const lower = text.toLowerCase();
    const phone = APP_STATE.settings?.phone || '+91 92194 61302';
    const whatsapp = APP_STATE.settings?.whatsapp || '919219461302';

    if (/\b[6-9]\d{9}\b/.test(lower)) {
      return `Dhanyawad! 🙏 Aapka number capture ho gaya hai. Hamare senior consultant 30 minute ke andar aapse connect karenge.\n\nYa turant WhatsApp par baat karein: https://wa.me/${whatsapp}`;
    }
    if (lower.match(/(price|pricing|cost|kitna|rate|budget|package)/i)) {
      return `KioraTech ke transparent packages:\n\n💻 **Starter Website:** ₹14,999 (4-7 Din me launch, Speed 95+, SSL)\n🚀 **Business Growth:** ₹29,999 (3D Glassmorphism, Advanced SEO)\n🛍️ **Shopify D2C Store:** ₹29,999 - ₹34,999 (Razorpay/COD, Cart Funnel)\n📱 **Instagram Branding:** ₹12,999/mo (@kiora.tech)\n\nAapko kis type ke project ka quotation chahiye?`;
    }
    if (lower.match(/(din|days|time|turnaround|kab tak|delivery)/i)) {
      return `⚡ Hamari delivery timeline **4 se 7 din** (4–7 Days) hai! Urgent requirements ke liye WhatsApp par connect karein: https://wa.me/${whatsapp}`;
    }
    if (lower.match(/(portfolio|work|client|sample|live|organicsanjeevani|kiyan)/i)) {
      return `Hamare real live verified projects check karein:\n\n🌿 **Organic Sanjeevani Roots**\n👉 https://organicsanjeevaniroots.com/\n(100% Ayurvedic D2C Store with 1-click WhatsApp checkout)\n\n📦 **Kiyan Export & Manufacturing**\n👉 https://kiyanexports.com/\n(Global B2B Wholesale Exporter, Est. 2014)\n\n🛍️ **Shopify D2C Store**\n(+340% checkout conversions)`;
    }
    if (lower.match(/(address|location|office|lucknow|kanpur road)/i)) {
      return `📍 **KioraTech Official Address:**\nD-463, LDA Colony, Near Spring Dale College, Kanpur Road, Lucknow - 226012, UP.\n\n📞 Phone: ${phone}\n💬 WhatsApp: https://wa.me/${whatsapp}`;
    }
    if (lower.match(/(contact|phone|call|whatsapp|number)/i)) {
      return `📱 Call/WhatsApp: ${phone}\n💬 Instant Chat: https://wa.me/${whatsapp}\n✉️ Email: kioratech12@gmail.com\n📸 Instagram: @kiora.tech (https://www.instagram.com/kiora.tech/#)`;
    }
    return `Namaste! 🙏 KioraTech ("We Build, You Rule") me aapka swagat hai.\n\nHum high-performance websites aur Shopify D2C stores banate hain sirf **4 se 7 din** me (Starting ₹14,999).\n\nAap apna phone number yahan type karein ya direct WhatsApp par connect karein: https://wa.me/${whatsapp}`;
  }

  async function handleSend() {
    const txt = input.value.trim();
    if (!txt) return;

    appendMsg(txt, 'user');
    input.value = '';
    showTypingIndicator();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: txt, history: chatHistory })
      });

      removeTypingIndicator();

      if (response.ok) {
        const data = await response.json();
        if (data.reply) {
          appendMsg(data.reply, 'bot');
          chatHistory.push({ role: 'user', content: txt });
          chatHistory.push({ role: 'assistant', content: data.reply });
          return;
        }
      }
      // If server returned non-ok, fall back to client logic
      const fallback = getClientFallbackReply(txt);
      appendMsg(fallback, 'bot');
    } catch (err) {
      removeTypingIndicator();
      const fallback = getClientFallbackReply(txt);
      appendMsg(fallback, 'bot');
    }
  }

  window.sendQuickPrompt = function(topic) {
    if (!chatBox.classList.contains('active')) {
      chatBox.classList.add('active');
    }
    if (input) {
      input.value = topic;
      handleSend();
    }
  };

  if (sendBtn) sendBtn.addEventListener('click', handleSend);
  if (input) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSend();
      }
    });
  }
}

// ================== 14. LANGUAGE TOGGLE (HINDI / ENGLISH) ==================
function setupLanguageToggle() {
  const langBtn = document.getElementById('lang-toggle-btn');
  if (!langBtn) return;

  const translations = [
    { selector: '.hero-badge-text', en: 'ACCEPTING NEW CLIENTS | Q4 2026 ROSTER OPEN', hi: 'नये प्रोजेक्ट्स स्वीकार्य | 2026 स्लॉट खुला है' },
    { selector: '.hero-tagline-sub', en: 'From high-speed custom websites and mobile apps to 7-figure Amazon & Flipkart seller scaling, SEO dominance, and viral social branding — KioraTech empowers your vision.', hi: 'हाई-स्पीड वेबसाइट्स और वेब ऐप्स से लेकर अमेज़न व फ्लिपकार्ट सेलर ग्रोथ, गूगल SEO और सोशल मीडिया ब्रांडिंग तक — KioraTech आपकी सफलता की कुंजी है।' },
    { selector: '#services-sec-title', en: 'Our Core Capabilities', hi: 'हमारी प्रमुख सेवाएँ' },
    { selector: '#portfolio-sec-title', en: 'Featured Portfolio & Projects', hi: 'हमारे चुनिंदा प्रोजेक्ट्स व परिणाम' },
    { selector: '#pricing-sec-title', en: 'Transparent Catalog & Pricing', hi: 'स्पष्ट पैकेज व कीमतें' },
    { selector: '#contact-sec-title', en: "Let's Build Something Exceptional", hi: 'आइए आपका प्रोजेक्ट शुरू करें' }
  ];

  translations.forEach(t => {
    const el = document.querySelector(t.selector);
    if (el) el._en = el.textContent;
  });

  langBtn.addEventListener('click', () => {
    APP_STATE.isHindi = !APP_STATE.isHindi;
    langBtn.textContent = APP_STATE.isHindi ? '🌐 English' : '🌐 हिंदी';

    translations.forEach(t => {
      const el = document.querySelector(t.selector);
      if (el) {
        el.textContent = APP_STATE.isHindi ? t.hi : el._en;
      }
    });
  });
}

// Utilities
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
