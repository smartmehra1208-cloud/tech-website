/**
 * KIORA TECH — Admin CMS Control Center Engine
 * Full REST API Integration for Projects, Catalog, Leads, and Config
 */

const ADMIN_STATE = {
  token: localStorage.getItem('kiora_admin_token') || '',
  currentTab: 'dashboard',
  projects: [],
  catalog: [],
  inquiries: [],
  testimonials: [],
  settings: {}
};

document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  setupNavigation();
});

// ================== AUTHENTICATION ==================
function initAuth() {
  const authScreen = document.getElementById('auth-screen');
  const loginForm = document.getElementById('admin-login-form');

  if (ADMIN_STATE.token) {
    verifySession();
  } else {
    if (authScreen) authScreen.style.display = 'flex';
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const pass = document.getElementById('admin-pass-input').value;
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: pass })
        });
        const data = await res.json();
        if (data.success) {
          ADMIN_STATE.token = data.token;
          localStorage.setItem('kiora_admin_token', data.token);
          if (authScreen) authScreen.style.display = 'none';
          loadAdminData();
        } else {
          alert(data.message || 'Incorrect passcode!');
        }
      } catch (err) {
        alert('Server connection error. Ensure node server.js is running.');
      }
    });
  }
}

async function verifySession() {
  try {
    const res = await fetch('/api/admin/verify', {
      headers: { 'x-admin-token': ADMIN_STATE.token }
    });
    if (res.ok) {
      const authScreen = document.getElementById('auth-screen');
      if (authScreen) authScreen.style.display = 'none';
      loadAdminData();
    } else {
      logout();
    }
  } catch (err) {
    // If server offline, allow local view
    const authScreen = document.getElementById('auth-screen');
    if (authScreen) authScreen.style.display = 'none';
    loadAdminData();
  }
}

window.logout = function() {
  localStorage.removeItem('kiora_admin_token');
  ADMIN_STATE.token = '';
  location.reload();
};

// ================== NAVIGATION TABS ==================
function setupNavigation() {
  const navItems = document.querySelectorAll('.admin-nav-item');
  const panes = document.querySelectorAll('.admin-tab-pane');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.getAttribute('data-tab');
      navItems.forEach(n => n.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      item.classList.add('active');
      const pane = document.getElementById(`tab-${target}`);
      if (pane) pane.classList.add('active');
      ADMIN_STATE.currentTab = target;

      const titleEl = document.getElementById('admin-page-title');
      if (titleEl) {
        const map = {
          dashboard: 'Overview & Statistics',
          projects: 'Projects & Portfolio Manager',
          catalog: 'Services & Pricing Packages',
          inquiries: 'Inbound Leads & Quote Requests',
          testimonials: 'Client Reviews & Case Feedback',
          settings: 'System & WhatsApp Configuration'
        };
        titleEl.textContent = map[target] || 'Dashboard';
      }
    });
  });
}

// ================== LOAD ALL DATA ==================
async function loadAdminData() {
  await Promise.all([
    fetchStats(),
    fetchProjects(),
    fetchCatalog(),
    fetchInquiries(),
    fetchTestimonials(),
    fetchSettings()
  ]);
}

// 1. Stats
async function fetchStats() {
  try {
    const res = await fetch('/api/stats');
    const data = await res.json();
    if (data.success) {
      document.getElementById('kpi-projects').textContent = data.stats.totalProjects;
      document.getElementById('kpi-catalog').textContent = data.stats.totalCatalog;
      document.getElementById('kpi-inquiries').textContent = data.stats.totalInquiries;
      document.getElementById('kpi-testimonials').textContent = data.stats.totalTestimonials;
      
      const badge = document.getElementById('inquiries-badge');
      if (badge) badge.textContent = data.stats.newInquiries || data.stats.totalInquiries;
    }
  } catch (err) {
    console.error('Error fetching stats:', err);
  }
}

// 2. Projects
async function fetchProjects() {
  try {
    const res = await fetch('/api/projects');
    const data = await res.json();
    if (data.success) {
      ADMIN_STATE.projects = data.projects;
      renderAdminProjects(data.projects);
    }
  } catch (err) {
    console.error('Error fetching projects:', err);
  }
}

function renderAdminProjects(projects) {
  const tbody = document.getElementById('projects-table-body');
  if (!tbody) return;

  if (projects.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--admin-muted);">No projects added yet. Click "+ Add New Project" to add one!</td></tr>`;
    return;
  }

  tbody.innerHTML = projects.map(p => `
    <tr>
      <td>
        <img src="${p.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'}" style="width: 52px; height: 38px; border-radius: 4px; object-fit: cover;">
      </td>
      <td>
        <strong style="color: #fff;">${escapeHtml(p.title)}</strong><br>
        <small style="color: var(--admin-muted);">${escapeHtml(p.client || 'Client')}</small>
      </td>
      <td>
        <span class="badge-status badge-contacted">${escapeHtml(p.categoryLabel || p.category)}</span>
      </td>
      <td>
        <span style="color: var(--teal-400); font-weight: 600;">${escapeHtml(p.result || '-')}</span>
      </td>
      <td>
        <span class="badge-status ${p.featured ? 'badge-new' : 'badge-closed'}">${p.featured ? '★ Featured' : 'Standard'}</span>
      </td>
      <td>
        <div style="display: flex; gap: 8px;">
          <button class="btn-admin btn-admin-secondary" onclick="openEditProjectModal('${p.id}')">Edit</button>
          <button class="btn-admin btn-admin-danger" onclick="deleteProject('${p.id}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// 3. Catalog
async function fetchCatalog() {
  try {
    const res = await fetch('/api/catalog');
    const data = await res.json();
    if (data.success) {
      ADMIN_STATE.catalog = data.catalog;
      renderAdminCatalog(data.catalog);
    }
  } catch (err) {
    console.error('Error fetching catalog:', err);
  }
}

function renderAdminCatalog(items) {
  const tbody = document.getElementById('catalog-table-body');
  if (!tbody) return;

  tbody.innerHTML = items.map(c => `
    <tr>
      <td>
        <strong style="color: #fff;">${escapeHtml(c.name)}</strong><br>
        <small class="badge-status badge-progress" style="margin-top: 4px;">${escapeHtml(c.badge || 'Plan')}</small>
      </td>
      <td>${escapeHtml(c.category)}</td>
      <td>
        <strong style="color: var(--cyan-bright); font-size: 1.05rem;">₹${Number(c.price).toLocaleString('en-IN')}</strong>
        <small style="color: var(--admin-muted);">/${escapeHtml(c.billingType || 'One-time')}</small>
      </td>
      <td>${escapeHtml(c.deliveryDays || '3-5 Days')}</td>
      <td>${(c.features || []).length} items</td>
      <td>
        <div style="display: flex; gap: 8px;">
          <button class="btn-admin btn-admin-secondary" onclick="openEditCatalogModal('${c.id}')">Edit</button>
          <button class="btn-admin btn-admin-danger" onclick="deleteCatalogItem('${c.id}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// 4. Inquiries / Leads
async function fetchInquiries() {
  try {
    const res = await fetch('/api/inquiries', {
      headers: { 'x-admin-token': ADMIN_STATE.token }
    });
    const data = await res.json();
    if (data.success) {
      ADMIN_STATE.inquiries = data.inquiries;
      renderAdminInquiries(data.inquiries);
      renderDashboardRecentLeads(data.inquiries.slice(0, 5));
    }
  } catch (err) {
    console.error('Error fetching inquiries:', err);
  }
}

function renderAdminInquiries(inquiries) {
  const tbody = document.getElementById('inquiries-table-body');
  if (!tbody) return;

  if (inquiries.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--admin-muted);">No inquiries yet. Submissions from the website will appear here in real time!</td></tr>`;
    return;
  }

  tbody.innerHTML = inquiries.map(i => {
    const cleanPhone = (i.phone || '').replace(/[^0-9]/g, '');
    const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi ${i.name}, thank you for contacting KioraTech regarding ${i.service}. How can we assist you today?`)}` : '#';

    let badgeClass = 'badge-new';
    if (i.status === 'In Progress') badgeClass = 'badge-progress';
    else if (i.status === 'Contacted') badgeClass = 'badge-contacted';
    else if (i.status === 'Archived') badgeClass = 'badge-closed';

    return `
      <tr>
        <td><strong>${escapeHtml(i.name)}</strong><br><small style="color: var(--admin-muted);">${new Date(i.createdAt).toLocaleDateString()}</small></td>
        <td>
          <a href="tel:${escapeHtml(i.phone)}" style="color: var(--cyan-bright); text-decoration: none; font-weight: 600;">${escapeHtml(i.phone)}</a><br>
          <small style="color: var(--admin-muted);">${escapeHtml(i.email || '-')}</small>
        </td>
        <td>${escapeHtml(i.service)}</td>
        <td><strong style="color: var(--teal-400);">${escapeHtml(i.budget || 'Flexible')}</strong></td>
        <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeHtml(i.message)}">
          ${escapeHtml(i.message || 'No description')}
        </td>
        <td>
          <select onchange="updateInquiryStatus('${i.id}', this.value)" class="admin-form-select" style="padding: 4px 8px; font-size: 0.78rem;">
            <option value="New" ${i.status === 'New' ? 'selected' : ''}>New</option>
            <option value="In Progress" ${i.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option value="Contacted" ${i.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
            <option value="Archived" ${i.status === 'Archived' ? 'selected' : ''}>Archived</option>
          </select>
        </td>
        <td>
          <div style="display: flex; gap: 6px;">
            ${cleanPhone ? `<a href="${waUrl}" target="_blank" class="btn-admin btn-admin-whatsapp" title="WhatsApp Lead">💬 Chat</a>` : ''}
            <button class="btn-admin btn-admin-danger" onclick="deleteInquiry('${i.id}')" title="Delete">✕</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function renderDashboardRecentLeads(leads) {
  const container = document.getElementById('recent-leads-list');
  if (!container) return;

  if (leads.length === 0) {
    container.innerHTML = `<div style="padding: 20px; color: var(--admin-muted); text-align: center;">No inquiries recorded yet.</div>`;
    return;
  }

  container.innerHTML = leads.map(l => `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid rgba(75,189,189,0.1);">
      <div>
        <strong style="color: #fff;">${escapeHtml(l.name)}</strong>
        <div style="font-size: 0.82rem; color: var(--admin-muted);">${escapeHtml(l.service)} • ${escapeHtml(l.phone)}</div>
      </div>
      <div>
        <span class="badge-status badge-new">${escapeHtml(l.status || 'New')}</span>
      </div>
    </div>
  `).join('');
}

window.updateInquiryStatus = async function(id, status) {
  try {
    await fetch(`/api/inquiries/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': ADMIN_STATE.token
      },
      body: JSON.stringify({ status })
    });
    fetchStats();
  } catch (err) {
    alert('Failed to update status');
  }
};

window.deleteInquiry = async function(id) {
  if (!confirm('Are you sure you want to delete this lead?')) return;
  try {
    await fetch(`/api/inquiries/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': ADMIN_STATE.token }
    });
    fetchInquiries();
    fetchStats();
  } catch (err) {
    alert('Failed to delete inquiry');
  }
};

// 5. Testimonials
async function fetchTestimonials() {
  try {
    const res = await fetch('/api/testimonials');
    const data = await res.json();
    if (data.success) {
      ADMIN_STATE.testimonials = data.testimonials;
      renderAdminTestimonials(data.testimonials);
    }
  } catch (err) {
    console.error('Error fetching testimonials:', err);
  }
}

function renderAdminTestimonials(testimonials) {
  const container = document.getElementById('testimonials-admin-list');
  if (!container) return;

  container.innerHTML = testimonials.map(t => `
    <div style="background: #0d1624; border: 1px solid var(--admin-card-border); border-radius: var(--radius-md); padding: 18px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
      <div style="display: flex; gap: 14px; align-items: center;">
        <img src="${t.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover;">
        <div>
          <strong style="color: #fff;">${escapeHtml(t.name)}</strong>
          <span style="color: #fbbf24; margin-left: 8px;">★★★★★</span>
          <div style="font-size: 0.8rem; color: var(--admin-muted);">${escapeHtml(t.role)}</div>
          <p style="font-size: 0.86rem; color: var(--admin-text); margin-top: 4px;">“${escapeHtml(t.text)}”</p>
        </div>
      </div>
      <div>
        <button class="btn-admin btn-admin-danger" onclick="deleteTestimonial('${t.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

window.deleteTestimonial = async function(id) {
  if (!confirm('Delete this client testimonial?')) return;
  try {
    await fetch(`/api/testimonials/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': ADMIN_STATE.token }
    });
    fetchTestimonials();
    fetchStats();
  } catch (err) {
    alert('Failed to delete testimonial');
  }
};

// 6. Settings
async function fetchSettings() {
  try {
    const res = await fetch('/api/settings');
    const data = await res.json();
    if (data.success && data.settings) {
      ADMIN_STATE.settings = data.settings;
      const s = data.settings;
      if (document.getElementById('set-company-name')) document.getElementById('set-company-name').value = s.companyName || 'KioraTech';
      if (document.getElementById('set-whatsapp')) document.getElementById('set-whatsapp').value = s.whatsapp || '919219461302';
      if (document.getElementById('set-phone')) document.getElementById('set-phone').value = s.phone || '+91 92194 61302';
      if (document.getElementById('set-email')) document.getElementById('set-email').value = s.email || 'kioratech12@gmail.com';
      if (document.getElementById('set-address')) document.getElementById('set-address').value = s.address || 'D-463, LDA Colony, Near Spring Dale College, Kanpur Road, Lucknow - 226012, UP';
      if (document.getElementById('set-projects-done')) document.getElementById('set-projects-done').value = s.projectsCompleted || 180;
      if (document.getElementById('set-happy-clients')) document.getElementById('set-happy-clients').value = s.happyClients || 95;
      if (document.getElementById('set-gemini-key')) document.getElementById('set-gemini-key').value = s.geminiApiKey || '';
      if (document.getElementById('set-openai-key')) document.getElementById('set-openai-key').value = s.openaiApiKey || '';
    }
  } catch (err) {
    console.error('Error fetching settings:', err);
  }
}

window.saveSettings = async function(e) {
  if (e) e.preventDefault();
  const payload = {
    companyName: document.getElementById('set-company-name').value,
    whatsapp: document.getElementById('set-whatsapp').value,
    phone: document.getElementById('set-phone').value,
    email: document.getElementById('set-email').value,
    address: document.getElementById('set-address').value,
    projectsCompleted: +document.getElementById('set-projects-done').value || 180,
    happyClients: +document.getElementById('set-happy-clients').value || 95,
    geminiApiKey: document.getElementById('set-gemini-key')?.value?.trim() || '',
    openaiApiKey: document.getElementById('set-openai-key')?.value?.trim() || ''
  };

  const newPass = document.getElementById('set-admin-pass')?.value;
  if (newPass && newPass.trim()) {
    payload.adminPassword = newPass.trim();
  }

  try {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': ADMIN_STATE.token
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      alert('Settings updated successfully! Changes are live on the website.');
    } else {
      alert('Error updating settings');
    }
  } catch (err) {
    alert('Failed to save settings to server');
  }
};

// ================== PROJECT CRUD MODALS ==================
window.openAddProjectModal = function() {
  const modal = document.getElementById('project-crud-modal');
  const form = document.getElementById('project-crud-form');
  if (form) form.reset();
  document.getElementById('proj-form-id').value = '';
  document.getElementById('proj-modal-title').textContent = 'Add New Project';
  if (modal) modal.classList.add('active');
};

window.openEditProjectModal = function(id) {
  const p = ADMIN_STATE.projects.find(item => item.id === id);
  if (!p) return;

  document.getElementById('proj-form-id').value = p.id;
  document.getElementById('proj-modal-title').textContent = 'Edit Project';
  document.getElementById('proj-form-title').value = p.title || '';
  document.getElementById('proj-form-client').value = p.client || '';
  document.getElementById('proj-form-category').value = p.category || 'web';
  document.getElementById('proj-form-label').value = p.categoryLabel || 'Web & Apps';
  document.getElementById('proj-form-result').value = p.result || '';
  document.getElementById('proj-form-desc').value = p.description || '';
  document.getElementById('proj-form-tags').value = (p.tags || []).join(', ');
  document.getElementById('proj-form-live').value = p.liveUrl || '';
  document.getElementById('proj-form-image').value = p.image || '';
  document.getElementById('proj-form-featured').checked = Boolean(p.featured);

  const cs = p.caseStudy || {};
  document.getElementById('proj-form-problem').value = cs.problem || '';
  document.getElementById('proj-form-solution').value = cs.solution || '';
  document.getElementById('proj-form-metrics').value = (cs.metrics || []).join('\n');

  const modal = document.getElementById('project-crud-modal');
  if (modal) modal.classList.add('active');
};

window.closeProjectCrudModal = function() {
  const modal = document.getElementById('project-crud-modal');
  if (modal) modal.classList.remove('active');
};

window.saveProjectForm = async function(e) {
  e.preventDefault();
  const id = document.getElementById('proj-form-id').value;
  const isEdit = Boolean(id);

  let imageUrl = document.getElementById('proj-form-image').value.trim();

  // If a file was chosen, upload it first
  const fileInput = document.getElementById('proj-form-file');
  if (fileInput && fileInput.files && fileInput.files[0]) {
    const formData = new FormData();
    formData.append('image', fileInput.files[0]);
    try {
      const upRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'x-admin-token': ADMIN_STATE.token },
        body: formData
      });
      const upData = await upRes.json();
      if (upData.success && upData.url) {
        imageUrl = upData.url;
      }
    } catch (err) {
      console.warn('Image upload error:', err);
    }
  }

  const payload = {
    title: document.getElementById('proj-form-title').value.trim(),
    client: document.getElementById('proj-form-client').value.trim(),
    category: document.getElementById('proj-form-category').value,
    categoryLabel: document.getElementById('proj-form-label').value.trim(),
    result: document.getElementById('proj-form-result').value.trim(),
    description: document.getElementById('proj-form-desc').value.trim(),
    tags: document.getElementById('proj-form-tags').value.split(',').map(s => s.trim()).filter(Boolean),
    liveUrl: document.getElementById('proj-form-live').value.trim() || '#',
    image: imageUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    featured: document.getElementById('proj-form-featured').checked,
    caseStudy: {
      problem: document.getElementById('proj-form-problem').value.trim(),
      solution: document.getElementById('proj-form-solution').value.trim(),
      metrics: document.getElementById('proj-form-metrics').value.split('\n').map(s => s.trim()).filter(Boolean)
    }
  };

  try {
    const url = isEdit ? `/api/projects/${id}` : '/api/projects';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': ADMIN_STATE.token
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      closeProjectCrudModal();
      fetchProjects();
      fetchStats();
      alert(isEdit ? 'Project updated successfully!' : 'New project added to portfolio!');
    } else {
      alert(data.error || 'Failed to save project');
    }
  } catch (err) {
    alert('Server error saving project');
  }
};

window.deleteProject = async function(id) {
  if (!confirm('Are you sure you want to permanently delete this project?')) return;
  try {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': ADMIN_STATE.token }
    });
    const data = await res.json();
    if (data.success) {
      fetchProjects();
      fetchStats();
    }
  } catch (err) {
    alert('Error deleting project');
  }
};

// ================== CATALOG CRUD MODALS ==================
window.openAddCatalogModal = function() {
  const form = document.getElementById('catalog-crud-form');
  if (form) form.reset();
  document.getElementById('cat-form-id').value = '';
  document.getElementById('cat-modal-title').textContent = 'Add Catalog Package';
  const modal = document.getElementById('catalog-crud-modal');
  if (modal) modal.classList.add('active');
};

window.openEditCatalogModal = function(id) {
  const c = ADMIN_STATE.catalog.find(item => item.id === id);
  if (!c) return;

  document.getElementById('cat-form-id').value = c.id;
  document.getElementById('cat-modal-title').textContent = 'Edit Catalog Package';
  document.getElementById('cat-form-name').value = c.name || '';
  document.getElementById('cat-form-category').value = c.category || 'Web Design';
  document.getElementById('cat-form-price').value = c.price || 0;
  document.getElementById('cat-form-billing').value = c.billingType || 'One-time';
  document.getElementById('cat-form-badge').value = c.badge || '';
  document.getElementById('cat-form-days').value = c.deliveryDays || '';
  document.getElementById('cat-form-desc').value = c.description || '';
  document.getElementById('cat-form-features').value = (c.features || []).join('\n');

  const modal = document.getElementById('catalog-crud-modal');
  if (modal) modal.classList.add('active');
};

window.closeCatalogCrudModal = function() {
  const modal = document.getElementById('catalog-crud-modal');
  if (modal) modal.classList.remove('active');
};

window.saveCatalogForm = async function(e) {
  e.preventDefault();
  const id = document.getElementById('cat-form-id').value;
  const isEdit = Boolean(id);

  const payload = {
    name: document.getElementById('cat-form-name').value.trim(),
    category: document.getElementById('cat-form-category').value.trim(),
    price: Number(document.getElementById('cat-form-price').value) || 0,
    billingType: document.getElementById('cat-form-billing').value.trim(),
    badge: document.getElementById('cat-form-badge').value.trim() || 'Popular',
    deliveryDays: document.getElementById('cat-form-days').value.trim() || '3-5 Days',
    description: document.getElementById('cat-form-desc').value.trim(),
    features: document.getElementById('cat-form-features').value.split('\n').map(s => s.trim()).filter(Boolean)
  };

  try {
    const url = isEdit ? `/api/catalog/${id}` : '/api/catalog';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': ADMIN_STATE.token
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      closeCatalogCrudModal();
      fetchCatalog();
      fetchStats();
      alert(isEdit ? 'Package updated!' : 'Package added to catalog!');
    } else {
      alert(data.error || 'Failed to save catalog item');
    }
  } catch (err) {
    alert('Server error saving package');
  }
};

window.deleteCatalogItem = async function(id) {
  if (!confirm('Are you sure you want to delete this service package?')) return;
  try {
    await fetch(`/api/catalog/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': ADMIN_STATE.token }
    });
    fetchCatalog();
    fetchStats();
  } catch (err) {
    alert('Failed to delete package');
  }
};

// ================== TESTIMONIAL ADD MODAL ==================
window.openAddTestimonialModal = function() {
  const modal = document.getElementById('test-modal');
  if (modal) modal.classList.add('active');
};
window.closeTestModal = function() {
  const modal = document.getElementById('test-modal');
  if (modal) modal.classList.remove('active');
};
window.saveTestimonialForm = async function(e) {
  e.preventDefault();
  const payload = {
    name: document.getElementById('test-form-name').value.trim(),
    role: document.getElementById('test-form-role').value.trim(),
    company: document.getElementById('test-form-company').value.trim(),
    rating: +document.getElementById('test-form-rating').value || 5,
    avatar: document.getElementById('test-form-avatar').value.trim(),
    text: document.getElementById('test-form-text').value.trim()
  };

  try {
    const res = await fetch('/api/testimonials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': ADMIN_STATE.token
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      closeTestModal();
      fetchTestimonials();
      fetchStats();
      alert('Review added successfully!');
    }
  } catch (err) {
    alert('Server error');
  }
};

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
