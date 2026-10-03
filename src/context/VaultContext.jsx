import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_USERS,
  INITIAL_SERVICE_RECORDS,
  INITIAL_DOCUMENTS,
  INITIAL_SETTINGS,
} from '../data/initialData';

const VaultContext = createContext();

export function VaultProvider({ children }) {
  // --- LocalStorage persistence helper ---
  const loadLocal = (key, fallback) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch (e) {
      return fallback;
    }
  };

  const [products, setProducts] = useState(() => loadLocal('wv_products', INITIAL_PRODUCTS));
  const [categories, setCategories] = useState(() => loadLocal('wv_categories', INITIAL_CATEGORIES));
  const [serviceRecords, setServiceRecords] = useState(() => loadLocal('wv_service', INITIAL_SERVICE_RECORDS));
  const [documents, setDocuments] = useState(() => loadLocal('wv_documents', INITIAL_DOCUMENTS));
  const [users, setUsers] = useState(() => loadLocal('wv_users', INITIAL_USERS));
  const [settings, setSettings] = useState(() => loadLocal('wv_settings', INITIAL_SETTINGS));

  const [currentUser, setCurrentUser] = useState(() => {
    return loadLocal('wv_current_user', {
      id: 'usr-1',
      name: 'John Doe',
      email: 'john@warrantyvault.io',
      role: 'User',
      plan: 'Premium Account',
    });
  });

  // Routing state
  const parseHash = () => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    if (!hash) return 'landing';
    return hash;
  };

  const [currentView, setCurrentView] = useState(parseHash());
  const [selectedProductId, setSelectedProductId] = useState('prod-1');
  const [editingProductId, setEditingProductId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewDoc, setPreviewDoc] = useState(null);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('wv_theme') || (settings.darkMode ? 'dark' : 'light');
  });

  // Toast alert system
  const [toasts, setToasts] = useState([]);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('wv_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('wv_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('wv_service', JSON.stringify(serviceRecords));
  }, [serviceRecords]);

  useEffect(() => {
    localStorage.setItem('wv_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('wv_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('wv_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('wv_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('wv_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Listen to hash change for browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const view = parseHash();
      setCurrentView(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (view, params = {}) => {
    if (params.productId) setSelectedProductId(params.productId);
    if (params.editProductId) setEditingProductId(params.editProductId);
    setCurrentView(view);
    window.location.hash = `#/${view}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const notify = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    notify(`Switched to ${theme === 'light' ? 'Dark' : 'Light'} mode`, 'info');
  };

  // --- CRUD Functions ---
  const addProduct = (productData) => {
    const newId = `prod-${Date.now()}`;
    const product = {
      ...productData,
      id: newId,
      documents: productData.documents || [],
      serviceHistory: productData.serviceHistory || [],
    };

    // Calculate status dynamically
    const now = new Date();
    const expiry = new Date(product.expiryDate);
    const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    let status = 'active';
    if (diffDays <= 0) status = 'expired';
    else if (diffDays <= 30) status = 'expiring';
    product.status = status;

    setProducts((prev) => [product, ...prev]);

    // Also update category count
    setCategories((prev) =>
      prev.map((cat) =>
        cat.name.toLowerCase() === product.category.toLowerCase()
          ? { ...cat, count: cat.count + 1 }
          : cat
      )
    );

    // If documents were uploaded in form, register them in global documents vault
    if (product.documents && product.documents.length > 0) {
      const newDocs = product.documents.map((d) => ({
        ...d,
        productId: newId,
        productName: product.name,
      }));
      setDocuments((prev) => [...newDocs, ...prev]);
    }

    notify(`"${product.name}" added successfully to your vault!`, 'success');
    return newId;
  };

  const updateProduct = (id, updatedData) => {
    const now = new Date();
    const expiry = new Date(updatedData.expiryDate);
    const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    let status = 'active';
    if (diffDays <= 0) status = 'expired';
    else if (diffDays <= 30) status = 'expiring';

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedData, status } : p))
    );
    notify(`Product "${updatedData.name || 'item'}" updated successfully.`, 'success');
  };

  const deleteProduct = (id) => {
    const p = products.find((prod) => prod.id === id);
    setProducts((prev) => prev.filter((prod) => prod.id !== id));
    setDocuments((prev) => prev.filter((d) => d.productId !== id));
    setServiceRecords((prev) => prev.filter((s) => s.productId !== id));

    if (p) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.name.toLowerCase() === p.category.toLowerCase()
            ? { ...cat, count: Math.max(0, cat.count - 1) }
            : cat
        )
      );
      notify(`"${p.name}" has been removed from your vault.`, 'info');
    }
  };

  const addServiceRecord = (record) => {
    const newRecord = {
      ...record,
      id: `srv-${Date.now()}`,
      cost: parseFloat(record.cost) || 0,
    };
    setServiceRecords((prev) => [newRecord, ...prev]);

    // Also link to product
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === record.productId) {
          return {
            ...prod,
            serviceHistory: [newRecord, ...(prod.serviceHistory || [])],
          };
        }
        return prod;
      })
    );

    notify('Service record logged successfully.', 'success');
  };

  const addDocument = (doc) => {
    const newDoc = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0],
    };
    setDocuments((prev) => [newDoc, ...prev]);

    // Attach to product
    if (doc.productId) {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === doc.productId) {
            return {
              ...p,
              documents: [newDoc, ...(p.documents || [])],
            };
          }
          return p;
        })
      );
    }

    notify(`Document "${doc.name}" uploaded to vault.`, 'success');
  };

  const deleteDocument = (id) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    notify('Document deleted.', 'info');
  };

  const toggleUserStatus = (userId) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
          notify(`User ${u.name} status updated to ${nextStatus}`, 'info');
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const updateUserRole = (userId, newRole) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          notify(`User ${u.name} role changed to ${newRole}`, 'info');
          return { ...u, role: newRole };
        }
        return u;
      })
    );
  };

  const addCategory = (cat) => {
    const newCat = {
      ...cat,
      id: `cat-${Date.now()}`,
      count: 0,
      defaultWarrantyMonths: parseInt(cat.defaultWarrantyMonths) || 12,
    };
    setCategories((prev) => [...prev, newCat]);
    notify(`New category "${cat.name}" created.`, 'success');
  };

  const deleteCategory = (catId) => {
    setCategories((prev) => prev.filter((c) => c.id !== catId));
    notify('Category removed.', 'info');
  };

  const updateUserSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    if (newSettings.fullName || newSettings.email) {
      setCurrentUser((prev) => ({
        ...prev,
        name: newSettings.fullName || prev.name,
        email: newSettings.email || prev.email,
      }));
    }
    notify('Settings and preferences saved successfully!', 'success');
  };

  const login = (email, role = 'User') => {
    const foundUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    const userToSet = foundUser || {
      id: `usr-${Date.now()}`,
      name: role === 'Admin' ? 'System Administrator' : 'John Doe',
      email: email || (role === 'Admin' ? 'admin@warrantyvault.io' : 'john@warrantyvault.io'),
      role: role,
      plan: role === 'Admin' ? 'Enterprise SuperAdmin' : 'Premium Account',
    };

    setCurrentUser(userToSet);
    notify(`Welcome back, ${userToSet.name}!`, 'success');

    if (role === 'Admin' || userToSet.role === 'Admin') {
      navigate('admin-dashboard');
    } else {
      navigate('dashboard');
    }
  };

  const logout = () => {
    notify('You have been logged out safely.', 'info');
    navigate('landing');
  };

  const switchRole = (newRole) => {
    if (newRole === 'Admin') {
      setCurrentUser({
        id: 'usr-5',
        name: 'System Administrator',
        email: 'admin@warrantyvault.io',
        role: 'Admin',
        plan: 'Enterprise SuperAdmin',
      });
      notify('Switched to Admin Mode', 'info');
      navigate('admin-dashboard');
    } else {
      setCurrentUser({
        id: 'usr-1',
        name: 'John Doe',
        email: 'john@warrantyvault.io',
        role: 'User',
        plan: 'Premium Account',
      });
      notify('Switched to User Mode', 'info');
      navigate('dashboard');
    }
  };

  const resetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setServiceRecords(INITIAL_SERVICE_RECORDS);
    setDocuments(INITIAL_DOCUMENTS);
    setUsers(INITIAL_USERS);
    setSettings(INITIAL_SETTINGS);
    setCurrentUser({
      id: 'usr-1',
      name: 'John Doe',
      email: 'john@warrantyvault.io',
      role: 'User',
      plan: 'Premium Account',
    });
    localStorage.clear();
    notify('All data reset to initial demo configuration!', 'info');
    navigate('dashboard');
  };

  return (
    <VaultContext.Provider
      value={{
        products,
        categories,
        serviceRecords,
        documents,
        users,
        settings,
        currentUser,
        currentView,
        selectedProductId,
        editingProductId,
        searchQuery,
        previewDoc,
        theme,
        toasts,
        navigate,
        notify,
        removeToast,
        toggleTheme,
        setSelectedProductId,
        setEditingProductId,
        setSearchQuery,
        setPreviewDoc,
        addProduct,
        updateProduct,
        deleteProduct,
        addServiceRecord,
        addDocument,
        deleteDocument,
        toggleUserStatus,
        updateUserRole,
        addCategory,
        deleteCategory,
        updateUserSettings,
        login,
        logout,
        switchRole,
        resetToDefaults,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
}

export const useVault = () => useContext(VaultContext);
