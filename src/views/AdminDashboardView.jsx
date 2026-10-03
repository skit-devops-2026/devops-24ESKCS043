import React from 'react';
import { useVault } from '../context/VaultContext';
import {
  Users,
  Package,
  ShieldCheck,
  DollarSign,
  Activity,
  FileSpreadsheet,
  ArrowRight,
  TrendingUp,
  Server,
  CheckCircle2,
} from 'lucide-react';

export default function AdminDashboardView() {
  const { users, products, categories, navigate } = useVault();

  const totalCatalogValue = products.reduce((acc, p) => acc + (parseFloat(p.price) || 0), 0);
  const activeUsers = users.filter((u) => u.status === 'Active').length;

  return (
    <div className="wv-content">
      {/* Header */}
      <div className="wv-page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 className="wv-page-title" style={{ marginBottom: 0 }}>
              System Administrator Console
            </h1>
            <span className="wv-badge wv-badge-active">Platform Online</span>
          </div>
          <p className="wv-page-subtitle">
            System-wide user accounts, catalog tracking, category schemas, and audit logs.
          </p>
        </div>

        <button
          onClick={() => navigate('admin-reports')}
          className="wv-btn wv-btn-primary"
        >
          <FileSpreadsheet size={18} />
          <span>Generate Platform Report</span>
        </button>
      </div>

      {/* 5 System Metric Cards */}
      <div className="wv-stats-grid">
        <div className="wv-stat-card primary">
          <div className="wv-stat-icon primary">
            <Users size={26} />
          </div>
          <div>
            <div className="wv-stat-label">Total Users</div>
            <div className="wv-stat-number">{users.length}</div>
          </div>
        </div>

        <div className="wv-stat-card success">
          <div className="wv-stat-icon success">
            <Package size={26} />
          </div>
          <div>
            <div className="wv-stat-label">Cataloged Products</div>
            <div className="wv-stat-number">{products.length}</div>
          </div>
        </div>

        <div className="wv-stat-card warning">
          <div className="wv-stat-icon warning">
            <DollarSign size={26} />
          </div>
          <div>
            <div className="wv-stat-label">Total Catalog Value</div>
            <div className="wv-stat-number">${totalCatalogValue.toLocaleString()}</div>
          </div>
        </div>

        <div className="wv-stat-card primary">
          <div className="wv-stat-icon primary">
            <Activity size={26} />
          </div>
          <div>
            <div className="wv-stat-label">System Health</div>
            <div className="wv-stat-number" style={{ color: 'var(--accent-emerald)' }}>99.98%</div>
          </div>
        </div>
      </div>

      {/* 2-Column Administrative Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Left Column: Recent Users & Recent Products */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Registered Users Table */}
          <div className="wv-card" style={{ marginBottom: 0 }}>
            <div className="wv-card-header">
              <h3 className="wv-card-title">
                <Users size={20} color="var(--primary)" />
                <span>Registered Platform Users ({users.length})</span>
              </h3>
              <button
                onClick={() => navigate('admin-users')}
                className="wv-btn wv-btn-secondary wv-btn-sm"
              >
                <span>Manage Users</span>
                <ArrowRight size={14} />
              </button>
            </div>
            <div className="wv-table-wrapper">
              <table className="wv-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Plan</th>
                    <th>Status</th>
                    <th>Products</th>
                  </tr>
                </thead>
                <tbody>
                  {users.slice(0, 4).map((u) => (
                    <tr key={u.id}>
                      <td>
                        <strong style={{ color: 'var(--text-primary)', display: 'block' }}>{u.name}</strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>{u.email}</span>
                      </td>
                      <td>
                        <span
                          style={{
                            padding: '0.2rem 0.6rem',
                            borderRadius: 'var(--radius-sm)',
                            background: u.role === 'Admin' ? 'rgba(79,70,229,0.1)' : 'var(--bg-canvas)',
                            color: u.role === 'Admin' ? 'var(--primary)' : 'var(--text-secondary)',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                          }}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem' }}>{u.plan}</span>
                      </td>
                      <td>
                        <span className={`wv-badge ${u.status === 'Active' ? 'wv-badge-active' : 'wv-badge-expired'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td>
                        <strong>{u.productsCount || 0}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Catalog Audit Overview */}
          <div className="wv-card" style={{ marginBottom: 0 }}>
            <div className="wv-card-header">
              <h3 className="wv-card-title">
                <Package size={20} color="var(--accent-cyan)" />
                <span>Global Product Inventory Sample</span>
              </h3>
              <button
                onClick={() => navigate('admin-products')}
                className="wv-btn wv-btn-secondary wv-btn-sm"
              >
                <span>Full Catalog</span>
                <ArrowRight size={14} />
              </button>
            </div>
            <div className="wv-table-wrapper">
              <table className="wv-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Serial Number</th>
                    <th>Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 4).map((p) => (
                    <tr key={p.id}>
                      <td>
                        <strong style={{ color: 'var(--text-primary)' }}>{p.name}</strong>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)' }}>{p.brand}</div>
                      </td>
                      <td>{p.category}</td>
                      <td>
                        <code style={{ fontSize: '0.82rem', color: 'var(--primary)' }}>{p.serialNumber}</code>
                      </td>
                      <td>${p.price}</td>
                      <td>
                        <span className={`wv-badge wv-badge-${p.status}`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Platform Status & Category Distribution */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Server Infrastructure Health */}
          <div className="wv-card" style={{ marginBottom: 0 }}>
            <div className="wv-card-header">
              <h3 className="wv-card-title">
                <Server size={18} color="var(--accent-emerald)" />
                <span>System Infrastructure</span>
              </h3>
            </div>
            <div className="wv-card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.86rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Database Cluster:</span>
                  <span style={{ color: 'var(--accent-emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CheckCircle2 size={15} /> Healthy (Primary)
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Automated Expiry Cron:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>Daily 00:00 UTC</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Encrypted Storage:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>AES-256 Enabled</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Active Category Schemas:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{categories.length} Types</strong>
                </div>
              </div>

              <button
                onClick={() => navigate('admin-categories')}
                className="wv-btn wv-btn-secondary wv-btn-sm"
                style={{ width: '100%', marginTop: '1.25rem' }}
              >
                Configure Categories
              </button>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
            }}
          >
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Admin Shortcuts
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <button
                onClick={() => navigate('admin-users')}
                className="wv-btn wv-btn-secondary wv-btn-sm"
                style={{ justifyContent: 'flex-start' }}
              >
                👥 Add / Edit User Roles
              </button>
              <button
                onClick={() => navigate('admin-products')}
                className="wv-btn wv-btn-secondary wv-btn-sm"
                style={{ justifyContent: 'flex-start' }}
              >
                📦 Verify Warranty Authenticity
              </button>
              <button
                onClick={() => navigate('admin-reports')}
                className="wv-btn wv-btn-secondary wv-btn-sm"
                style={{ justifyContent: 'flex-start' }}
              >
                📑 Export Audit Data (CSV/JSON)
              </button>
              <button
                onClick={() => navigate('dashboard')}
                className="wv-btn wv-btn-primary wv-btn-sm"
                style={{ justifyContent: 'flex-start', marginTop: '0.5rem' }}
              >
                🛡️ Return to User Portal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
