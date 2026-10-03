import React from 'react';
import { useVault } from '../context/VaultContext';
import {
  Shield,
  LayoutDashboard,
  Package,
  FileText,
  AlertTriangle,
  Wrench,
  BarChart3,
  Settings,
  Users,
  Tag,
  FileSpreadsheet,
  ArrowRightLeft,
  Sparkles,
  LogOut,
  X
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { currentView, navigate, currentUser, switchRole, logout, products } = useVault();

  const isAdmin = currentUser.role === 'Admin' || currentView.startsWith('admin-');

  // Count expiring soon products (within 30 days)
  const expiringCount = products.filter((p) => p.status === 'expiring').length;

  const handleNav = (view) => {
    navigate(view);
    if (onClose) onClose();
  };

  return (
    <aside className={`wv-sidebar ${isOpen ? 'open' : ''}`}>
      {/* Sidebar Header */}
      <div className="wv-sidebar-header">
        <div className="wv-brand" onClick={() => handleNav(isAdmin ? 'admin-dashboard' : 'dashboard')} style={{ cursor: 'pointer' }}>
          <div className="wv-brand-icon">
            <Shield size={20} />
          </div>
          <div>
            <span>WarrantyVault</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="wv-sidebar-badge">
            {isAdmin ? 'ADMIN' : 'USER'}
          </span>
          <button
            onClick={onClose}
            className="wv-sidebar-toggle-btn"
            style={{ display: isOpen ? 'inline-flex' : 'none' }}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="wv-sidebar-nav">
        {!isAdmin ? (
          <>
            <span className="wv-nav-label">User Vault</span>

            <button
              onClick={() => handleNav('dashboard')}
              className={`wv-nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
            >
              <div className="wv-nav-item-left">
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </div>
            </button>

            <button
              onClick={() => handleNav('products')}
              className={`wv-nav-item ${currentView === 'products' || currentView === 'product-details' ? 'active' : ''}`}
            >
              <div className="wv-nav-item-left">
                <Package size={18} />
                <span>My Products</span>
              </div>
              <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{products.length}</span>
            </button>

            <button
              onClick={() => handleNav('documents')}
              className={`wv-nav-item ${currentView === 'documents' ? 'active' : ''}`}
            >
              <div className="wv-nav-item-left">
                <FileText size={18} />
                <span>Documents</span>
              </div>
            </button>

            <button
              onClick={() => handleNav('expiring')}
              className={`wv-nav-item ${currentView === 'expiring' ? 'active' : ''}`}
            >
              <div className="wv-nav-item-left">
                <AlertTriangle size={18} />
                <span>Expiring Soon</span>
              </div>
              {expiringCount > 0 && <span className="wv-nav-pill">{expiringCount}</span>}
            </button>

            <button
              onClick={() => handleNav('service-history')}
              className={`wv-nav-item ${currentView === 'service-history' ? 'active' : ''}`}
            >
              <div className="wv-nav-item-left">
                <Wrench size={18} />
                <span>Service History</span>
              </div>
            </button>

            <button
              onClick={() => handleNav('analytics')}
              className={`wv-nav-item ${currentView === 'analytics' ? 'active' : ''}`}
            >
              <div className="wv-nav-item-left">
                <BarChart3 size={18} />
                <span>Analytics</span>
              </div>
            </button>

            <button
              onClick={() => handleNav('settings')}
              className={`wv-nav-item ${currentView === 'settings' ? 'active' : ''}`}
            >
              <div className="wv-nav-item-left">
                <Settings size={18} />
                <span>Settings</span>
              </div>
            </button>
          </>
        ) : (
          <>
            <span className="wv-nav-label">System Administration</span>

            <button
              onClick={() => handleNav('admin-dashboard')}
              className={`wv-nav-item ${currentView === 'admin-dashboard' ? 'active' : ''}`}
            >
              <div className="wv-nav-item-left">
                <LayoutDashboard size={18} />
                <span>Overview</span>
              </div>
            </button>

            <button
              onClick={() => handleNav('admin-products')}
              className={`wv-nav-item ${currentView === 'admin-products' ? 'active' : ''}`}
            >
              <div className="wv-nav-item-left">
                <Package size={18} />
                <span>All Products</span>
              </div>
            </button>

            <button
              onClick={() => handleNav('admin-users')}
              className={`wv-nav-item ${currentView === 'admin-users' ? 'active' : ''}`}
            >
              <div className="wv-nav-item-left">
                <Users size={18} />
                <span>User Management</span>
              </div>
            </button>

            <button
              onClick={() => handleNav('admin-categories')}
              className={`wv-nav-item ${currentView === 'admin-categories' ? 'active' : ''}`}
            >
              <div className="wv-nav-item-left">
                <Tag size={18} />
                <span>Categories</span>
              </div>
            </button>

            <button
              onClick={() => handleNav('admin-reports')}
              className={`wv-nav-item ${currentView === 'admin-reports' ? 'active' : ''}`}
            >
              <div className="wv-nav-item-left">
                <FileSpreadsheet size={18} />
                <span>Reports & Audits</span>
              </div>
            </button>
          </>
        )}
      </nav>

      {/* Switch Portal & Logout Footer */}
      <div className="wv-sidebar-footer">
        <button
          onClick={() => switchRole(isAdmin ? 'User' : 'Admin')}
          className="wv-btn wv-btn-secondary wv-btn-sm"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <ArrowRightLeft size={15} />
          <span>Switch to {isAdmin ? 'User Portal' : 'Admin Mode'}</span>
        </button>

        <button
          onClick={logout}
          className="wv-nav-item"
          style={{ padding: '0.5rem 0.75rem', justifyContent: 'flex-start', color: '#f87171' }}
        >
          <LogOut size={16} />
          <span style={{ marginLeft: '0.75rem' }}>Logout</span>
        </button>
      </div>
    </aside>
  );
}
