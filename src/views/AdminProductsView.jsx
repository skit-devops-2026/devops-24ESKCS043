import React, { useState } from 'react';
import { useVault } from '../context/VaultContext';
import {
  Package,
  Search,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Trash2,
  ShieldCheck,
} from 'lucide-react';

export default function AdminProductsView() {
  const { products, categories, navigate, deleteProduct, notify } = useVault();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.serialNumber.toLowerCase().includes(search.toLowerCase());

    const matchesCat = !categoryFilter || p.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  const toggleVerify = (productName) => {
    notify(`Manufacturer authenticity badge verified for "${productName}".`, 'success');
  };

  return (
    <div className="wv-content">
      {/* Header */}
      <div className="wv-page-header">
        <div>
          <h1 className="wv-page-title">Global Product Catalog</h1>
          <p className="wv-page-subtitle">
            Audit and verify hardware registries, serial numbers, and warranty authenticity across all users.
          </p>
        </div>
      </div>

      {/* Toolbar */}
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
        }}
      >
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '280px' }}>
            <input
              type="text"
              placeholder="Search serial, brand, item..."
              className="wv-input"
              style={{ paddingLeft: '2.2rem', fontSize: '0.88rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search
              size={16}
              color="var(--text-tertiary)"
              style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>

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
        </div>

        <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
          Catalog inventory: {filteredProducts.length} items
        </span>
      </div>

      {/* Product Inventory Table */}
      <div className="wv-card">
        <div className="wv-table-wrapper">
          <table className="wv-table">
            <thead>
              <tr>
                <th>Hardware Item</th>
                <th>Category</th>
                <th>Serial Number</th>
                <th>Purchase Horizon</th>
                <th>Coverage Expiry</th>
                <th>Verification</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    No products found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong style={{ color: 'var(--text-primary)', display: 'block' }}>{item.name}</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>{item.brand} • ${item.price}</span>
                    </td>
                    <td>
                      <span
                        style={{
                          background: 'var(--bg-canvas)',
                          border: '1px solid var(--border-subtle)',
                          padding: '0.2rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.82rem',
                        }}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td>
                      <code style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>{item.serialNumber}</code>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem' }}>{item.purchaseDate}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{item.expiryDate}</span>
                    </td>
                    <td>
                      <button
                        onClick={() => toggleVerify(item.name)}
                        className="wv-btn wv-btn-secondary wv-btn-sm"
                        style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)' }}
                      >
                        <ShieldCheck size={14} />
                        <span>Verified</span>
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <button
                          onClick={() => navigate('product-details', { productId: item.id })}
                          className="wv-btn wv-btn-secondary wv-btn-sm"
                          title="Inspect product"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => deleteProduct(item.id)}
                          className="wv-btn wv-btn-danger wv-btn-sm"
                          title="Purge item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
