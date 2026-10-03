import React, { useState } from 'react';
import { useVault } from '../context/VaultContext';
import {
  Package,
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  Eye,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  FileText,
  Clock,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
} from 'lucide-react';

export default function ProductsView() {
  const { products, categories, navigate, deleteProduct, searchQuery, setSearchQuery } = useVault();

  const [viewMode, setViewMode] = useState('table'); // 'grid' or 'table'
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('expiry-soonest');

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.retailer && p.retailer.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      !categoryFilter || p.category.toLowerCase() === categoryFilter.toLowerCase();

    const matchesStatus = !statusFilter || p.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'expiry-soonest') return new Date(a.expiryDate) - new Date(b.expiryDate);
    if (sortBy === 'expiry-latest') return new Date(b.expiryDate) - new Date(a.expiryDate);
    if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
    if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    return 0;
  });

  const getDaysRemaining = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diff = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="wv-content">
      {/* Page Header */}
      <div className="wv-page-header">
        <div>
          <h1 className="wv-page-title">My Registered Products</h1>
          <p className="wv-page-subtitle">
            Catalog, track, and manage warranties for all {products.length} items in your vault.
          </p>
        </div>

        <button
          onClick={() => navigate('add-product')}
          className="wv-btn wv-btn-primary"
        >
          <Plus size={18} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Control Toolbar */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem 1.25rem',
          marginBottom: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', width: '240px' }}>
            <input
              type="text"
              placeholder="Filter by name, brand..."
              className="wv-input"
              style={{ paddingLeft: '2.2rem', paddingRight: '0.5rem', fontSize: '0.88rem' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              size={16}
              color="var(--text-tertiary)"
              style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>

          {/* Category Filter */}
          <select
            className="wv-select"
            style={{ width: '160px', fontSize: '0.88rem' }}
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

          {/* Status Filter */}
          <select
            className="wv-select"
            style={{ width: '150px', fontSize: '0.88rem' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="expiring">Expiring Soon</option>
            <option value="expired">Expired</option>
          </select>

          {/* Sort By */}
          <select
            className="wv-select"
            style={{ width: '170px', fontSize: '0.88rem' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="expiry-soonest">Expiring Soonest</option>
            <option value="expiry-latest">Expiring Latest</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="name-asc">Product Name (A-Z)</option>
          </select>
        </div>

        {/* View Mode Toggle Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
            {sortedProducts.length} of {products.length} items
          </span>
          <div style={{ display: 'flex', background: 'var(--bg-canvas)', padding: '2px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setViewMode('table')}
              className={`wv-btn wv-btn-sm ${viewMode === 'table' ? 'wv-btn-secondary' : ''}`}
              style={{ padding: '0.35rem 0.6rem', border: 'none', background: viewMode === 'table' ? 'var(--bg-card)' : 'transparent' }}
              title="Table view"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`wv-btn wv-btn-sm ${viewMode === 'grid' ? 'wv-btn-secondary' : ''}`}
              style={{ padding: '0.35rem 0.6rem', border: 'none', background: viewMode === 'grid' ? 'var(--bg-card)' : 'transparent' }}
              title="Grid cards view"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* View Render */}
      {sortedProducts.length === 0 ? (
        <div
          className="wv-card"
          style={{ textAlign: 'center', padding: '4rem 2rem' }}
        >
          <Package size={48} color="var(--text-tertiary)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            No Matching Products Found
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.35rem', maxWidth: '400px', margin: '0.35rem auto 1.5rem' }}>
            Try adjusting your search keywords, category filters, or clear existing filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('');
              setStatusFilter('');
            }}
            className="wv-btn wv-btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="wv-card">
          <div className="wv-table-wrapper">
            <table className="wv-table">
              <thead>
                <tr>
                  <th>Product & Brand</th>
                  <th>Category</th>
                  <th>Purchase Date</th>
                  <th>Warranty Expiration</th>
                  <th>Retailer / Price</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map((product) => {
                  const days = getDaysRemaining(product.expiryDate);
                  const isExpiring = product.status === 'expiring';
                  const isExpired = product.status === 'expired';

                  return (
                    <tr key={product.id}>
                      <td>
                        <div
                          onClick={() => navigate('product-details', { productId: product.id })}
                          style={{ cursor: 'pointer' }}
                        >
                          <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                            {product.name}
                          </strong>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                            {product.brand} • S/N: {product.serialNumber}
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
                        <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                          {product.purchaseDate}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{product.expiryDate}</div>
                        <div
                          style={{
                            fontSize: '0.76rem',
                            fontWeight: 600,
                            color: days <= 0 ? 'var(--accent-rose)' : days <= 30 ? 'var(--accent-amber)' : 'var(--accent-emerald)',
                          }}
                        >
                          {days <= 0 ? `Lapsed ${Math.abs(days)}d ago` : `${days} days remaining`}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                          ${product.price}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                          {product.retailer || 'Retailer Store'}
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
                            title="View product details"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => navigate('add-product', { editProductId: product.id })}
                            className="wv-btn wv-btn-secondary wv-btn-sm"
                            title="Edit product"
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
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID CARDS VIEW */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {sortedProducts.map((product) => {
            const days = getDaysRemaining(product.expiryDate);
            const isExpiring = product.status === 'expiring';
            const isExpired = product.status === 'expired';

            return (
              <div
                key={product.id}
                className="wv-card"
                style={{
                  marginBottom: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'var(--transition)',
                }}
              >
                <div style={{ padding: '1.5rem', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span
                      style={{
                        background: 'var(--bg-canvas)',
                        border: '1px solid var(--border-subtle)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {product.category}
                    </span>
                    <span className={`wv-badge wv-badge-${product.status}`}>
                      {isExpiring ? 'Expiring Soon' : isExpired ? 'Expired' : 'Active'}
                    </span>
                  </div>

                  <h3
                    onClick={() => navigate('product-details', { productId: product.id })}
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {product.name}
                  </h3>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-tertiary)', marginBottom: '1.25rem' }}>
                    {product.brand} • {product.model}
                  </div>

                  {/* Warranty Countdown Gauge */}
                  <div style={{ marginBottom: '1.25rem', background: 'var(--bg-canvas)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.4rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Expires: {product.expiryDate}</span>
                      <strong style={{ color: days <= 0 ? 'var(--accent-rose)' : days <= 30 ? 'var(--accent-amber)' : 'var(--accent-emerald)' }}>
                        {days <= 0 ? 'Expired' : `${days}d left`}
                      </strong>
                    </div>
                    <div className="wv-gauge-bar">
                      <div
                        className={`wv-gauge-fill ${product.status}`}
                        style={{ width: `${Math.max(5, Math.min(100, Math.round((Math.max(0, days) / 730) * 100)))}%` }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.82rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-tertiary)', display: 'block' }}>PURCHASED</span>
                      <strong>{product.purchaseDate}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-tertiary)', display: 'block' }}>VALUE</span>
                      <strong>${product.price}</strong>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: '0.9rem 1.5rem',
                    background: 'var(--bg-canvas)',
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <FileText size={14} />
                    <span>{product.documents ? product.documents.length : 0} docs</span>
                  </span>

                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      onClick={() => navigate('product-details', { productId: product.id })}
                      className="wv-btn wv-btn-secondary wv-btn-sm"
                    >
                      <Eye size={14} />
                      <span>Details</span>
                    </button>
                    <button
                      onClick={() => navigate('add-product', { editProductId: product.id })}
                      className="wv-btn wv-btn-secondary wv-btn-sm"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="wv-btn wv-btn-danger wv-btn-sm"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
