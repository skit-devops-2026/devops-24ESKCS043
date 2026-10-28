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
  const { users, products, categories, documents, navigate, formatMoney, formatTotal } = useVault();
  const regularUsers = users.filter((u) => u.role !== 'Admin');
  const recentUsers = [...regularUsers].sort((a, b) => (b.joinedDate || '').localeCompare(a.joinedDate || '')).slice(0, 5);

  const totalCatalogValue = products.reduce((acc, p) => acc + (parseFloat(p.price) || 0), 0);
  const activeUsers = regularUsers.filter((u) => u.status === 'Active').length;

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
            <div className="wv-stat-label">Registered Users</div>
            <div className="wv-stat-number">{regularUsers.length}</div>
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
            <div className="wv-stat-number">{formatTotal(products)}</div>
          </div>
        </div>

        <div className="wv-stat-card primary">
          <div className="wv-stat-icon primary">
            <Activity size={26} />
          </div>
          <div>
            <div className="wv-stat-label">Active Users</div>
            <div className="wv-stat-number" style={{ color: 'var(--accent-emerald)' }}>{activeUsers}</div>
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
                <span>Newest Users ({regularUsers.length} total)</span>
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
                    <th>Documents</th>
                    <th>Status</th>
                    <th>Products</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.length === 0 && (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No users have registered yet.</td></tr>
                  )}
                  {recentUsers.map((u) => (
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
                        <strong>{u.documentsCount || 0}</strong>
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
                <span>Latest Products (All Users)</span>
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
                    <th>Owner</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 && (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No products have been added yet.</td></tr>
                  )}
                  {products.slice(0, 5).map((p) => (
                    <tr key={p.id}>
                      <td>
                        <strong style={{ color: 'var(--text-primary)' }}>{p.name}</strong>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)' }}>{p.brand}</div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem' }}>{p.ownerName}</span>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>{p.ownerEmail}</div>
                      </td>
                      <td>{p.category}</td>
                      <td>{formatMoney(p.price, p.currency)}</td>
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
                  <span style={{ color: 'var(--text-secondary)' }}>Expiring Within 30 Days:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{products.filter((p) => p.status === 'expiring').length} Products</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Documents Stored:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{documents.length} Files</strong>
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
                👥 Manage User Accounts
              </button>
              <button
                onClick={() => navigate('admin-products')}
                className="wv-btn wv-btn-secondary wv-btn-sm"
                style={{ justifyContent: 'flex-start' }}
              >
                📦 Browse All Products
              </button>
              <button
                onClick={() => navigate('admin-reports')}
                className="wv-btn wv-btn-secondary wv-btn-sm"
                style={{ justifyContent: 'flex-start' }}
              >
                📑 Export Audit Data (CSV/JSON)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
