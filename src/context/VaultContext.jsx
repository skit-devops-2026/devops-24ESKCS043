import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { api, setToken, getToken, formatCurrency, fileToBase64, MAX_UPLOAD_BYTES, CURRENCIES } from '../api';

const VaultContext = createContext();

const PUBLIC_VIEWS = ['landing', 'login', 'register'];
const ADMIN_ALLOWED_SHARED = ['settings', 'product-details'];

const DEFAULT_SETTINGS = {
  currency: 'USD',
  dateFormat: 'MMM DD, YYYY',
  notify7Days: true,
  notify15Days: true,
  notify30Days: true,
  emailDigest: true,
};

const parseHash = () => {
  const hash = window.location.hash.replace('#/', '').replace('#', '');
  return hash || 'landing';
};

export function VaultProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const [products, setProducts] = useState([]);
  const [rawCategories, setRawCategories] = useState([]);
  const [serviceRecords, setServiceRecords] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [users, setUsers] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  const [currentView, setCurrentView] = useState(parseHash());
  const [selectedProductId, setSelectedProductId] = useState(() => {
    try { return sessionStorage.getItem('wv_selected_product'); } catch { return null; }
  });
  useEffect(() => {
    try {
      if (selectedProductId) sessionStorage.setItem('wv_selected_product', selectedProductId);
    } catch { /* ignore */ }
  }, [selectedProductId]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewDoc, setPreviewDoc] = useState(null);
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('wv_theme') || 'light'; } catch { return 'light'; }
  });
  const [toasts, setToasts] = useState([]);

  const isAdmin = currentUser?.role === 'Admin';

  // ---------- helpers ----------
  const notify = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3800);
  }, []);

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const navigate = useCallback((view, params = {}) => {
    if (params.productId) setSelectedProductId(params.productId);
    if (params.editProductId) setEditingProductId(params.editProductId);
    else if (view === 'add-product') setEditingProductId(null);
    setCurrentView(view);
    window.location.hash = `#/${view}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Turns an API failure into a toast; logs the user out if the session is gone
  const logoutRef = useRef(() => {});
  const handleError = useCallback((err) => {
    notify(err.message || 'Something went wrong', 'error');
    if (err.status === 401) logoutRef.current(true);
  }, [notify]);

  // ---------- data loading ----------
  const loadData = useCallback(async (user) => {
    setDataLoading(true);
    try {
      const calls = [api('/products'), api('/categories'), api('/documents'), api('/service-records')];
      if (user.role === 'Admin') calls.push(api('/users'));
      const [p, c, d, s, u] = await Promise.all(calls);
      setProducts(p || []);
      setRawCategories(c || []);
      setDocuments(d || []);
      setServiceRecords(s || []);
      setUsers(u || []);
    } catch (err) {
      handleError(err);
    } finally {
      setDataLoading(false);
    }
  }, [handleError]);

  const clearData = () => {
    setProducts([]);
    setRawCategories([]);
    setDocuments([]);
    setServiceRecords([]);
    setUsers([]);
  };

  // Restore session from the stored JWT on page load
  useEffect(() => {
    (async () => {
      if (getToken()) {
        try {
          const me = await api('/users/me');
          setCurrentUser(me);
          await loadData(me);
        } catch {
          setToken(null);
        }
      }
      setAuthReady(true);
    })();
    // Remove data left behind by the old browser-only version of the app
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith('wv_') && k !== 'wv_theme')
        .forEach((k) => localStorage.removeItem(k));
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try { localStorage.setItem('wv_theme', theme); } catch { /* ignore */ }
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const onHash = () => {
      setCurrentView(parseHash());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // ---------- route guard ----------
  // Logged-out users only see public pages; regular users can never open
  // admin pages; the admin stays inside the admin console.
  useEffect(() => {
    if (!authReady) return;
    if (!currentUser) {
      if (!PUBLIC_VIEWS.includes(currentView)) navigate('login');
      return;
    }
    if (PUBLIC_VIEWS.includes(currentView) && currentView !== 'landing') {
      navigate(isAdmin ? 'admin-dashboard' : 'dashboard');
      return;
    }
    if (!isAdmin && currentView.startsWith('admin-')) {
      navigate('dashboard');
      return;
    }
    if (isAdmin && currentView !== 'landing' && !currentView.startsWith('admin-')
      && !ADMIN_ALLOWED_SHARED.includes(currentView)) {
      navigate('admin-dashboard');
    }
  }, [authReady, currentUser, currentView, isAdmin, navigate]);

  // ---------- derived data ----------
  const settings = useMemo(() => ({
    ...DEFAULT_SETTINGS,
    ...(currentUser?.settings || {}),
    fullName: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
  }), [currentUser]);

  const currency = settings.currency;

  // Attach each product's own documents & service history
  const productsWithRelations = useMemo(() => products.map((p) => ({
    ...p,
    documents: documents.filter((d) => d.productId === p.id),
    serviceHistory: serviceRecords.filter((s) => s.productId === p.id),
  })), [products, documents, serviceRecords]);

  const categories = useMemo(() => rawCategories.map((c) => ({
    ...c,
    count: products.filter((p) => (p.category || '').toLowerCase() === c.name.toLowerCase()).length,
  })), [rawCategories, products]);

  /** Format an amount. Users: always their account currency. Admin: the product's own currency. */
  const formatMoney = useCallback(
    (amount, cur) => formatCurrency(amount, cur || currency),
    [currency]
  );

  /** Sum of items' prices, grouped by currency (admin sees users with different currencies) */
  const formatTotal = useCallback((items, field = 'price') => {
    const totals = {};
    items.forEach((i) => {
      const c = i.currency || currency;
      totals[c] = (totals[c] || 0) + (parseFloat(i[field]) || 0);
    });
    const keys = Object.keys(totals);
    if (keys.length === 0) return formatCurrency(0, currency);
    return keys.map((c) => formatCurrency(totals[c], c)).join(' + ');
  }, [currency]);

  // ---------- auth ----------
  const login = async (email, password) => {
    const { token, user } = await api('/users/login', { method: 'POST', body: { email, password } });
    setToken(token);
    setCurrentUser(user);
    notify(`Welcome, ${user.name}!`, 'success');
    navigate(user.role === 'Admin' ? 'admin-dashboard' : 'dashboard');
    loadData(user);
  };

  const register = async ({ name, email, password }) => {
    const { token, user } = await api('/users/register', { method: 'POST', body: { name, email, password } });
    setToken(token);
    setCurrentUser(user);
    notify(`Account created — welcome, ${user.name}!`, 'success');
    navigate('dashboard');
    loadData(user);
  };

  const logout = (expired = false) => {
    setToken(null);
    setCurrentUser(null);
    clearData();
    setPreviewDoc(null);
    notify(expired ? 'Your session has ended. Please log in again.' : 'You have been logged out safely.', 'info');
    navigate('login');
  };
  logoutRef.current = logout;

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    notify(`Switched to ${theme === 'light' ? 'Dark' : 'Light'} mode`, 'info');
  };

  // ---------- products ----------
  const addProduct = async (productData, files = []) => {
    try {
      const product = await api('/products', { method: 'POST', body: productData });
      setProducts((prev) => [product, ...prev]);
      for (const f of files) {
        // eslint-disable-next-line no-await-in-loop
        await uploadDocument({ productId: product.id, file: f.file, name: f.name, type: f.type }, { silent: true });
      }
      notify(`"${product.name}" added successfully to your vault!`, 'success');
      return product.id;
    } catch (err) {
      handleError(err);
      return null;
    }
  };

  const updateProduct = async (id, updatedData, files = []) => {
    try {
      const product = await api(`/products/${id}`, { method: 'PATCH', body: updatedData });
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...product } : p)));
      setDocuments((prev) => prev.map((d) => (d.productId === id ? { ...d, productName: product.name } : d)));
      setServiceRecords((prev) => prev.map((s) => (s.productId === id ? { ...s, productName: product.name } : s)));
      for (const f of files) {
        // eslint-disable-next-line no-await-in-loop
        await uploadDocument({ productId: id, file: f.file, name: f.name, type: f.type }, { silent: true });
      }
      notify(`Product "${product.name}" updated successfully.`, 'success');
      return true;
    } catch (err) {
      handleError(err);
      return false;
    }
  };

  const deleteProduct = async (id) => {
    const p = products.find((prod) => prod.id === id);
    try {
      await api(`/products/${id}`, { method: 'DELETE' });
      setProducts((prev) => prev.filter((prod) => prod.id !== id));
      setDocuments((prev) => prev.filter((d) => d.productId !== id));
      setServiceRecords((prev) => prev.filter((s) => s.productId !== id));
      if (isAdmin) setUsers((prev) => prev.map((u) => (u.id === p?.userId ? { ...u, productsCount: Math.max(0, (u.productsCount || 1) - 1) } : u)));
      notify(`"${p?.name || 'Product'}" has been removed.`, 'info');
    } catch (err) {
      handleError(err);
    }
  };

  // ---------- service records ----------
  const addServiceRecord = async (record) => {
    try {
      const saved = await api('/service-records', { method: 'POST', body: record });
      setServiceRecords((prev) => [saved, ...prev]);
      notify('Service record logged successfully.', 'success');
      return true;
    } catch (err) {
      handleError(err);
      return false;
    }
  };

  // ---------- documents ----------
  /** Upload a real file. { productId, file: File, name?, type? } */
  const uploadDocument = async ({ productId, file, name, type }, { silent = false } = {}) => {
    if (!file) { notify('Please choose a file to upload.', 'error'); return null; }
    if (file.size > MAX_UPLOAD_BYTES) { notify(`"${file.name}" is larger than 10 MB.`, 'error'); return null; }
    try {
      const dataBase64 = await fileToBase64(file);
      const doc = await api('/documents', {
        method: 'POST',
        body: {
          productId,
          name: name || file.name,
          type,
          mimeType: file.type || guessMime(file.name),
          dataBase64,
        },
      });
      setDocuments((prev) => [doc, ...prev]);
      if (!silent) notify(`Document "${doc.name}" uploaded to vault.`, 'success');
      return doc;
    } catch (err) {
      handleError(err);
      return null;
    }
  };

  const deleteDocument = async (id) => {
    try {
      await api(`/documents/${id}`, { method: 'DELETE' });
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      if (previewDoc?.id === id) setPreviewDoc(null);
      notify('Document deleted.', 'info');
    } catch (err) {
      handleError(err);
    }
  };

  /** Fetch the stored file as a Blob (auth header attached) */
  const fetchDocumentBlob = async (doc) => {
    const res = await api(`/documents/${doc.id}/file`, { raw: true });
    return res.blob();
  };

  const downloadDocument = async (doc) => {
    try {
      const blob = await fetchDocumentBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (err) {
      handleError(err);
    }
  };

  // ---------- admin: users ----------
  const toggleUserStatus = async (userId) => {
    const u = users.find((x) => x.id === userId);
    if (!u) return;
    const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
    try {
      await api(`/users/${userId}`, { method: 'PATCH', body: { status: nextStatus } });
      setUsers((prev) => prev.map((x) => (x.id === userId ? { ...x, status: nextStatus } : x)));
      notify(`${u.name} is now ${nextStatus}.`, 'info');
    } catch (err) {
      handleError(err);
    }
  };

  const createUserAccount = async ({ name, email, password }) => {
    try {
      const u = await api('/users', { method: 'POST', body: { name, email, password } });
      setUsers((prev) => [...prev, u]);
      notify(`Account created for ${u.name}.`, 'success');
      return true;
    } catch (err) {
      handleError(err);
      return false;
    }
  };

  const deleteUserAccount = async (userId) => {
    try {
      await api(`/users/${userId}`, { method: 'DELETE' });
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setProducts((prev) => prev.filter((p) => p.userId !== userId));
      setDocuments((prev) => prev.filter((d) => d.userId !== userId));
      setServiceRecords((prev) => prev.filter((s) => s.userId !== userId));
      notify('User account and all their data deleted.', 'info');
    } catch (err) {
      handleError(err);
    }
  };

  // ---------- admin: categories ----------
  const addCategory = async (cat) => {
    try {
      const saved = await api('/categories', { method: 'POST', body: cat });
      setRawCategories((prev) => [...prev, saved]);
      notify(`New category "${saved.name}" created.`, 'success');
    } catch (err) {
      handleError(err);
    }
  };

  const deleteCategory = async (catId) => {
    try {
      await api(`/categories/${catId}`, { method: 'DELETE' });
      setRawCategories((prev) => prev.filter((c) => c.id !== catId));
      notify('Category removed.', 'info');
    } catch (err) {
      handleError(err);
    }
  };

  // ---------- profile ----------
  const updateUserSettings = async ({ fullName, email, phone, ...prefs }) => {
    try {
      const me = await api('/users/me', {
        method: 'PATCH',
        body: { name: fullName, email, phone, settings: prefs },
      });
      const currencyChanged = me.settings.currency !== currentUser.settings?.currency;
      setCurrentUser(me);
      if (currencyChanged) {
        setProducts((prev) => prev.map((p) => (p.userId === me.id ? { ...p, currency: me.settings.currency } : p)));
      }
      notify('Settings and preferences saved successfully!', 'success');
      return true;
    } catch (err) {
      handleError(err);
      return false;
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await api('/users/me/password', { method: 'POST', body: { currentPassword, newPassword } });
      notify('Password changed successfully! Use the new password next time you log in.', 'success');
      return true;
    } catch (err) {
      // a wrong current password is a 400, not an expired session
      notify(err.message, 'error');
      return false;
    }
  };

  return (
    <VaultContext.Provider
      value={{
        products: productsWithRelations,
        categories,
        serviceRecords,
        documents,
        users,
        settings,
        currency,
        currencySymbol: (CURRENCIES[currency] || CURRENCIES.USD).symbol,
        currentUser,
        isAdmin,
        authReady,
        dataLoading,
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
        formatMoney,
        formatTotal,
        addProduct,
        updateProduct,
        deleteProduct,
        addServiceRecord,
        uploadDocument,
        deleteDocument,
        fetchDocumentBlob,
        downloadDocument,
        toggleUserStatus,
        createUserAccount,
        deleteUserAccount,
        addCategory,
        deleteCategory,
        updateUserSettings,
        changePassword,
        login,
        register,
        logout,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
}

function guessMime(name = '') {
  const ext = name.split('.').pop().toLowerCase();
  return {
    pdf: 'application/pdf', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
    webp: 'image/webp', gif: 'image/gif', txt: 'text/plain',
  }[ext] || 'application/octet-stream';
}

export const useVault = () => useContext(VaultContext);
