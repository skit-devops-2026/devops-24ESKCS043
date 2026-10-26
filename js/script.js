/**
 * WarrantyVault - Client-side Interactive JavaScript
 * Beginner-friendly helper script for navigation, modal dialogs, search filtering,
 * form submission demos, and UI interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initActiveSidebarLinks();
  initMobileSidebarToggle();
  initTableSearchAndFilters();
  initModals();
  initFileUploads();
  initFormDemoHandlers();
});

/* --- 1. Highlight Active Page Link in Sidebar --- */
function initActiveSidebarLinks() {
  const currentPath = window.location.pathname;
  const sidebarLinks = document.querySelectorAll('.sidebar-menu a');

  sidebarLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.endsWith(href)) {
      link.classList.add('active');
    }
  });
}

/* --- 2. Mobile Sidebar Navigation Toggle --- */
function initMobileSidebarToggle() {
  const toggleBtn = document.querySelector('.toggle-sidebar-btn');
  const sidebar = document.querySelector('.sidebar');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('mobile-open');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 && sidebar.classList.contains('mobile-open')) {
        if (!sidebar.contains(e.target) && e.target !== toggleBtn) {
          sidebar.classList.remove('mobile-open');
        }
      }
    });
  }
}

/* --- 3. Live Table Search & Filter --- */
function initTableSearchAndFilters() {
  // Real-time text search for tables
  const searchInputs = document.querySelectorAll('[data-table-search]');
  
  searchInputs.forEach(searchInput => {
    const targetTableId = searchInput.getAttribute('data-table-search');
    const table = document.getElementById(targetTableId);
    if (!table) return;

    searchInput.addEventListener('input', () => {
      const term = searchInput.value.toLowerCase().trim();
      const rows = table.querySelectorAll('tbody tr');

      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(term)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });

  // Dropdown Category Filter
  const categoryFilters = document.querySelectorAll('[data-table-filter="category"]');
  categoryFilters.forEach(select => {
    const targetTableId = select.getAttribute('data-target');
    const table = document.getElementById(targetTableId);
    if (!table) return;

    select.addEventListener('change', () => {
      const selectedCategory = select.value.toLowerCase();
      const rows = table.querySelectorAll('tbody tr');

      rows.forEach(row => {
        const categoryCell = row.getAttribute('data-category') || row.children[1]?.textContent.toLowerCase() || '';
        if (!selectedCategory || categoryCell.toLowerCase().includes(selectedCategory)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });

  // Filter Pills (e.g. Expiring 7 / 30 / 90 Days filter)
  const pillBtns = document.querySelectorAll('.pill-btn');
  pillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.parentElement;
      parent.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterDays = btn.getAttribute('data-filter-days');
      const table = document.getElementById('expiringTable');
      if (!table || !filterDays) return;

      const rows = table.querySelectorAll('tbody tr');
      rows.forEach(row => {
        const daysAttr = parseInt(row.getAttribute('data-days') || '999', 10);
        if (filterDays === 'all' || daysAttr <= parseInt(filterDays, 10)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
}

/* --- 4. Modal Handlers --- */
function initModals() {
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const modalCloses = document.querySelectorAll('[data-modal-close]');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-modal-target');
      const modalOverlay = document.getElementById(targetId);
      if (modalOverlay) {
        modalOverlay.classList.add('active');
      }
    });
  });

  modalCloses.forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      const modalOverlay = closeBtn.closest('.modal-overlay');
      if (modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  });

  // Close overlay on background click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });
}

/* --- 5. File Upload Label Updater --- */
function initFileUploads() {
  const fileInputs = document.querySelectorAll('input[type="file"]');
  fileInputs.forEach(input => {
    input.addEventListener('change', () => {
      const box = input.closest('.file-upload-box');
      if (box && input.files.length > 0) {
        const label = box.querySelector('p');
        if (label) {
          label.textContent = `Selected File: ${input.files[0].name}`;
          label.style.fontWeight = 'bold';
          label.style.color = '#2563eb';
        }
      }
    });
  });
}

/* --- 6. Form Submission Simulation & Toast Alert --- */
function initFormDemoHandlers() {
  // Login Form Demo
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(loginForm);
      const payload = {};
      formData.forEach((value, key) => { payload[key] = value; });
      try {
        const response = await fetch('http://localhost:5000/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem('token', data.token);
          showToast('Login successful! Redirecting to Dashboard...', 'success');
          setTimeout(() => { window.location.href = 'user/dashboard.html'; }, 1000);
        } else {
          showToast(data.message || 'Login failed', 'error');
        }
      } catch (err) {
        console.error(err);
        showToast('Network error during login', 'error');
      }
    });
  }

  // Register Form Demo
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const password = document.getElementById('password')?.value;
      const confirmPassword = document.getElementById('confirmPassword')?.value;
      const username = document.getElementById('username')?.value;
      const email = document.getElementById('email')?.value;

      if (password && confirmPassword && password !== confirmPassword) {
        showToast('Passwords do not match!', 'error');
        return;
      }

      const payload = { username, password, email };
      try {
        const response = await fetch('http://localhost:5000/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem('token', data.data.token);
          showToast('Account created successfully! Redirecting to Dashboard...', 'success');
          setTimeout(() => { window.location.href = 'user/dashboard.html'; }, 1200);
        } else {
          showToast(data.error || 'Registration failed', 'error');
        }
      } catch (err) {
        console.error(err);
        showToast('Network error during registration', 'error');
      }
    });
  }
  }

  // Add Product Form Demo
  const addProductForm = document.getElementById('addProductForm');
  if (addProductForm) {
    addProductForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Product added successfully to your vault!', 'success');
      setTimeout(() => {
        window.location.href = 'products.html';
      }, 1200);
    });
  }

  // Settings Form Demo
  const settingsForm = document.getElementById('settingsForm');
  if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Settings & preferences saved successfully!', 'success');
    });
  }

  // Generic Demo Forms (e.g. Modals)
  document.querySelectorAll('.demo-submit-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const modal = form.closest('.modal-overlay');
      if (modal) modal.classList.remove('active');
      showToast('Record saved successfully!', 'success');
      form.reset();
    });
  });
}

/* --- Helper Function: Show Toast Message --- */
function showToast(message, type = 'info') {
  let toast = document.getElementById('toastAlert');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastAlert';
    toast.className = 'toast-alert';
    document.body.appendChild(toast);
  }

  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/* --- Helper Function: Delete Row Confirmation --- */
function deleteItem(btn, itemName) {
  if (confirm(`Are you sure you want to delete "${itemName}"?`)) {
    const row = btn.closest('tr') || btn.closest('.card') || btn.closest('.doc-item-card');
    if (row) {
      row.style.opacity = '0.4';
      setTimeout(() => {
        row.remove();
        showToast(`"${itemName}" deleted successfully.`, 'info');
      }, 300);
    }
  }
}
