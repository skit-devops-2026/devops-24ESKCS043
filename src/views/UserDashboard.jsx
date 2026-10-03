import React, { useState } from 'react';
import { useVault } from '../context/VaultContext';
import {
  Package,
  ShieldCheck,
  Clock,
  AlertOctagon,
  Plus,
  ArrowRight,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  UploadCloud,
  Wrench,
  BarChart3,
  AlertTriangle,
} from 'lucide-react';

export default function UserDashboard() {
  const {
    products,
    categories,
    navigate,
    deleteProduct,
    currentUser,
    setPreviewDoc,
  } = useVault();

  const [categoryFilter, setCategoryFilter] = useState('');

  // Calculate statistics
  const totalProducts = products.length;
  const activeCount = products.filter((p) => p.status === 'active').length;
  const expiringCount = products.filter((p) => p.status === 'expiring').length;
  const expiredCount = products.filter((p) => p.status === 'expired').length;

  // Filtered recent products
  const filteredProducts = products.filter((p) => {
    if (!categoryFilter) return true;
    return p.category.toLowerCase() === categoryFilter.toLowerCase();
  });

  const recentProducts = filteredProducts.slice(0, 5);

  return (
    <div className="wv-content">
      {/* Page Header */}
      <div className="wv-page-header">
        <div>
          <h1 className="wv-page-title">
            Welcome back, {currentUser.name.split(' ')[0]}! 👋
          </h1>
          <p className="wv-page-subtitle">
            Here is an overview of your registered product warranties, receipts, and expiring claims.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => navigate('add-product')}
            className="wv-btn wv-btn-primary"
          >
            <Plus size={18} />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="wv-stats-grid">
        <div className="wv-stat-card primary">
          <div className="wv-stat-icon primary">
            <Package size={26} />
          </div>
          <div>
            <div className="wv-stat-label">Total Products</div>
            <div className="wv-stat-number">{totalProducts}</div>
          </div>
        </div>

        <div className="wv-stat-card success">
          <div className="wv-stat-icon success">
            <ShieldCheck size={26} />
          </div>
          <div>
            <div className="wv-stat-label">Active Coverage</div>
            <div className="wv-stat-number">{activeCount}</div>
          </div>
        </div>

        <div className="wv-stat-card warning">
          <div className="wv-stat-icon warning">
            <Clock size={26} />
          </div>
          <div>
            <div className="wv-stat-label">Expiring Soon</div>
            <div className="wv-stat-number">{expiringCount}</div>
          </div>
        </div>

        <div className="wv-stat-card danger">
          <div className="wv-stat-icon danger">
            <AlertOctagon size={26} />
          </div>
          <div>
            <div className="wv-stat-label">Expired</div>
            <div className="wv-stat-number">{expiredCount}</div>
          </div>
        </div>
      </div>

      {/* Expiring Warranty Urgent Alert Banner (if any) */}
      {expiringCount > 0 && (
        <div
          style={{
            background: 'var(--status-expiring-bg)',
            border: '1px solid var(--status-expiring-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'rgba(245, 158, 11, 0.2)',
                color: 'var(--accent-amber)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={22} />
            </div>
            <div>
              <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
                Attention: You have {expiringCount} product warranty nearing expiry!
              </strong>
              <p style={{ fontSize: '0.86rem', color: 'var(--status-expiring-text)', marginTop: '0.2rem' }}>
                Renew before coverage ends or file a repair inspection while parts and labor are fully covered.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('expiring')}
            className="wv-btn wv-btn-secondary wv-btn-sm"
            style={{ borderColor: 'var(--status-expiring-border)', color: 'var(--status-expiring-text)' }}
          >
            <span>Review Expiring Items</span>
            <ArrowRight size={15} />
          </button>
        </div>
      )}

      {/* Quick Action Navigation Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <button
          onClick={() => navigate('add-product')}
          className="wv-btn wv-btn-secondary"
          style={{ padding: '1rem', justifyContent: 'flex-start', background: 'var(--bg-card)' }}
        >
          <Plus size={20} color="var(--primary)" />
          <div style={{ textAlign: 'left', marginLeft: '0.5rem' }}>
            <strong style={{ display: 'block', fontSize: '0.92rem' }}>Quick Add Item</strong>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>Register warranty & bill</span>
          </div>
        </button>

        <button
          onClick={() => navigate('documents')}
          className="wv-btn wv-btn-secondary"
          style={{ padding: '1rem', justifyContent: 'flex-start', background: 'var(--bg-card)' }}
        >
          <UploadCloud size={20} color="var(--accent-cyan)" />
          <div style={{ textAlign: 'left', marginLeft: '0.5rem' }}>
            <strong style={{ display: 'block', fontSize: '0.92rem' }}>Document Vault</strong>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>View receipts & cards</span>
          </div>
        </button>

        <button
          onClick={() => navigate('service-history')}
          className="wv-btn wv-btn-secondary"
          style={{ padding: '1rem', justifyContent: 'flex-start', background: 'var(--bg-card)' }}
        >
          <Wrench size={20} color="var(--accent-amber)" />
          <div style={{ textAlign: 'left', marginLeft: '0.5rem' }}>
            <strong style={{ display: 'block', fontSize: '0.92rem' }}>Service Log</strong>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>Track repair bills</span>
          </div>
        </button>

        <button
          onClick={() => navigate('analytics')}
          className="wv-btn wv-btn-secondary"
          style={{ padding: '1rem', justifyContent: 'flex-start', background: 'var(--bg-card)' }}
        >
          <BarChart3 size={20} color="var(--accent-emerald)" />
          <div style={{ textAlign: 'left', marginLeft: '0.5rem' }}>
            <strong style={{ display: 'block', fontSize: '0.92rem' }}>Analytics</strong>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>Portfolio breakdown</span>
          </div>
        </button>
      </div>

      {/* Main Grid: Recent Products + Category Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.75rem', alignItems: 'start' }}>
        {/* Recent Products Card */}
        <div className="wv-card" style={{ marginBottom: 0 }}>
          <div className="wv-card-header">
            <h3 className="wv-card-title">
              <Package size={20} color="var(--primary)" />
              <span>Recent Products & Warranties</span>
            </h3>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <select
                className="wv-select"
                style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => navigate('products')}
                className="wv-btn wv-btn-secondary wv-btn-sm"
              >
                <span>View All</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div className="wv-table-wrapper">
            <table className="wv-table">
              <thead>
                <tr>
                  <th>Product Details</th>
                  <th>Category</th>
                  <th>Warranty Expiry</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-secondary)' }}>
                      No products found in this category.
                    </td>
                  </tr>
                ) : (
                  recentProducts.map((product) => {
                    const isExpiring = product.status === 'expiring';
                    const isExpired = product.status === 'expired';

                    return (
                      <tr key={product.id}>
                        <td>
                          <div
                            onClick={() => navigate('product-details', { productId: product.id })}
                            style={{ cursor: 'pointer' }}
                          >
                            <strong style={{ color: 'var(--text-primary)', fontSize: '0.94rem' }}>
                              {product.name}
                            </strong>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                              {product.brand} • Serial: {product.serialNumber}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span
                            style={{
                              background: 'var(--bg-canvas)',
                              border: '1px solid var(--border-subtle)',
                              padding: '0.2rem 0.6rem',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.82rem',
                              fontWeight: 600,
                            }}
                          >
                            {product.category}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{product.expiryDate}</div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)' }}>
                            Purchased: {product.purchaseDate}
                          </div>
                        </td>
                        <td>
                          <span className={`wv-badge wv-badge-${product.status}`}>
                            {isExpiring ? 'Expiring Soon' : isExpired ? 'Expired' : 'Active'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                            <button
                              onClick={() => navigate('product-details', { productId: product.id })}
                              className="wv-btn wv-btn-secondary wv-btn-sm"
                              title="View details"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => navigate('add-product', { editProductId: product.id })}
                              className="wv-btn wv-btn-secondary wv-btn-sm"
                              title="Edit item"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => deleteProduct(product.id)}
                              className="wv-btn wv-btn-danger wv-btn-sm"
                              title="Delete item"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Category Distribution & Coverage Gauge */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Warranty Health Gauge Card */}
          <div className="wv-card" style={{ marginBottom: 0 }}>
            <div className="wv-card-header">
              <h3 className="wv-card-title">
                <ShieldCheck size={18} color="var(--accent-emerald)" />
                <span>Coverage Health</span>
              </h3>
            </div>
            <div className="wv-card-body">
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  <span>Active Protected Ratio</span>
                  <span style={{ color: 'var(--accent-emerald)' }}>
                    {totalProducts ? Math.round((activeCount / totalProducts) * 100) : 0}%
                  </span>
                </div>
                <div className="wv-gauge-bar">
                  <div
                    className="wv-gauge-fill active"
                    style={{ width: `${totalProducts ? (activeCount / totalProducts) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>🟢 In Safe Window (&gt; 30d):</span>
                  <strong>{activeCount} items</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>🟡 Expiring (within 30d):</span>
                  <strong>{expiringCount} items</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>🔴 Past Expiration:</span>
                  <strong>{expiredCount} items</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Category Distribution Card */}
          <div className="wv-card" style={{ marginBottom: 0 }}>
            <div className="wv-card-header">
              <h3 className="wv-card-title">
                <span>Categories</span>
              </h3>
              <button
                onClick={() => navigate('analytics')}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
              >
                Analytics →
              </button>
            </div>
            <div className="wv-card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                {categories.slice(0, 5).map((cat) => {
                  const catProducts = products.filter((p) => p.category.toLowerCase() === cat.name.toLowerCase());
                  const pct = totalProducts ? Math.round((catProducts.length / totalProducts) * 100) : 0;

                  return (
                    <div key={cat.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '0.3rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cat.name}</span>
                        <span style={{ color: 'var(--text-secondary)' }}>{catProducts.length} ({pct}%)</span>
                      </div>
                      <div className="wv-gauge-bar" style={{ height: '6px' }}>
                        <div
                          style={{
                            height: '100%',
                            background: 'var(--primary)',
                            borderRadius: 'var(--radius-full)',
                            width: `${pct}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
