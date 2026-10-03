import React, { useState } from 'react';
import { useVault } from '../context/VaultContext';
import {
  Menu,
  Search,
  Moon,
  Sun,
  Bell,
  Plus,
  Check,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';

export default function Navbar({ onToggleSidebar }) {
  const {
    currentUser,
    searchQuery,
    setSearchQuery,
    theme,
    toggleTheme,
    navigate,
    products,
  } = useVault();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Find expiring warranties for notifications
  const expiringProducts = products.filter((p) => p.status === 'expiring');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('products');
    }
  };

  const initials = currentUser.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <header className="wv-top-nav">
      {/* Left side: Hamburger + Search */}
      <div className="wv-top-nav-left">
        <button
          className="wv-sidebar-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation"
        >
          <Menu size={20} />
        </button>

        <form onSubmit={handleSearchSubmit} className="wv-search-bar">
          <Search size={18} color="var(--text-tertiary)" />
          <input
            type="text"
            placeholder="Search products, brands, serials..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </form>
      </div>

      {/* Right side: Add Product + Theme + Notifications + User Avatar */}
      <div className="wv-top-nav-right">
        {currentUser.role !== 'Admin' && (
          <button
            onClick={() => navigate('add-product')}
            className="wv-btn wv-btn-primary wv-btn-sm"
            style={{ display: 'none', md: 'inline-flex' }}
          >
            <Plus size={16} />
            <span>Add Item</span>
          </button>
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="wv-theme-btn"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notification Bell Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="wv-theme-btn"
            style={{ position: 'relative' }}
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {expiringProducts.length > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-amber)',
                  boxShadow: '0 0 6px var(--accent-amber)',
                }}
              />
            )}
          </button>

          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                top: '50px',
                right: 0,
                width: '320px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                padding: '1rem',
                zIndex: 100,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--border-subtle)',
                  paddingBottom: '0.75rem',
                  marginBottom: '0.75rem',
                }}
              >
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Notifications ({expiringProducts.length})
                </h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Live Updates</span>
              </div>

              {expiringProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1rem 0', color: 'var(--text-secondary)' }}>
                  <p style={{ fontSize: '0.88rem' }}>🎉 All product warranties are healthy!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {expiringProducts.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        navigate('product-details', { productId: item.id });
                        setShowNotifications(false);
                      }}
                      style={{
                        padding: '0.6rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--status-expiring-bg)',
                        border: '1px solid var(--status-expiring-border)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.6rem',
                      }}
                    >
                      <AlertTriangle size={16} color="var(--accent-amber)" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                          {item.name}
                        </strong>
                        <p style={{ fontSize: '0.78rem', color: 'var(--status-expiring-text)' }}>
                          Warranty expiring on {item.expiryDate}!
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile Pill & Menu */}
        <div style={{ position: 'relative' }}>
          <div
            className="wv-user-profile-menu"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
          >
            <div className="wv-user-avatar">{initials}</div>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {currentUser.name}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                {currentUser.plan || currentUser.role}
              </span>
            </div>
            <ChevronDown size={14} color="var(--text-tertiary)" />
          </div>

          {showProfileMenu && (
            <div
              style={{
                position: 'absolute',
                top: '50px',
                right: 0,
                width: '210px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-xl)',
                padding: '0.5rem',
                zIndex: 100,
              }}
            >
              <button
                onClick={() => {
                  navigate('settings');
                  setShowProfileMenu(false);
                }}
                className="wv-nav-item"
                style={{ padding: '0.6rem 0.8rem' }}
              >
                Profile & Settings
              </button>
              <button
                onClick={() => {
                  navigate(currentUser.role === 'Admin' ? 'dashboard' : 'admin-dashboard');
                  setShowProfileMenu(false);
                }}
                className="wv-nav-item"
                style={{ padding: '0.6rem 0.8rem' }}
              >
                {currentUser.role === 'Admin' ? 'Switch to User View' : 'Admin Control Panel'}
              </button>
              <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '0.4rem 0' }} />
              <button
                onClick={() => {
                  navigate('landing');
                  setShowProfileMenu(false);
                }}
                className="wv-nav-item"
                style={{ padding: '0.6rem 0.8rem', color: 'var(--accent-rose)' }}
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
