import React, { useState } from 'react';
import { useVault } from '../context/VaultContext';
import {
  Tag,
  Plus,
  Trash2,
  Package,
  Clock,
  Sparkles,
  Smartphone,
  Laptop,
  Refrigerator,
  Tv,
  Armchair,
  Watch,
  Car,
} from 'lucide-react';
import Modal from '../components/Modal';

export default function AdminCategoriesView() {
  const { categories, products, addCategory, deleteCategory, notify } = useVault();
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [defaultWarrantyMonths, setDefaultWarrantyMonths] = useState(24);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      notify('Category name cannot be empty.', 'error');
      return;
    }

    addCategory({
      name,
      description: description || 'User-defined warranty category schema',
      defaultWarrantyMonths: parseInt(defaultWarrantyMonths, 10) || 12,
    });

    setShowModal(false);
    setName('');
    setDescription('');
    setDefaultWarrantyMonths(24);
  };

  const getCategoryIcon = (catName) => {
    switch (catName.toLowerCase()) {
      case 'phones': return <Smartphone size={24} />;
      case 'laptops': return <Laptop size={24} />;
      case 'appliances': return <Refrigerator size={24} />;
      case 'electronics': return <Tv size={24} />;
      case 'furniture': return <Armchair size={24} />;
      case 'gadgets': return <Watch size={24} />;
      case 'automobiles': return <Car size={24} />;
      default: return <Tag size={24} />;
    }
  };

  return (
    <div className="wv-content">
      {/* Header */}
      <div className="wv-page-header">
        <div>
          <h1 className="wv-page-title">Category Management</h1>
          <p className="wv-page-subtitle">
            Configure product category taxonomies, default warranty intervals, and icon badges.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="wv-btn wv-btn-primary"
        >
          <Plus size={18} />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Category Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {categories.map((cat) => {
          const catProducts = products.filter((p) => p.category.toLowerCase() === cat.name.toLowerCase());

          return (
            <div
              key={cat.id}
              className="wv-card"
              style={{
                marginBottom: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {getCategoryIcon(cat.name)}
                  </div>

                  <span
                    style={{
                      background: 'var(--bg-canvas)',
                      border: '1px solid var(--border-subtle)',
                      padding: '0.2rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {catProducts.length} Products
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                  {cat.name}
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  {cat.description}
                </p>

                <div
                  style={{
                    background: 'var(--bg-canvas)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.65rem 0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.82rem',
                  }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>Default Warranty Target:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{cat.defaultWarrantyMonths} Months</strong>
                </div>
              </div>

              <div
                style={{
                  padding: '0.85rem 1.5rem',
                  background: 'var(--bg-canvas)',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="wv-btn wv-btn-danger wv-btn-sm"
                  title="Remove category"
                >
                  <Trash2 size={14} />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Category Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add Product Category"
        maxWidth="480px"
      >
        <form onSubmit={handleAddSubmit}>
          <div className="wv-form-group">
            <label className="wv-form-label">Category Name</label>
            <input
              type="text"
              required
              className="wv-input"
              placeholder="e.g. Smart Home, Gaming Consoles"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="wv-form-group">
            <label className="wv-form-label">Description</label>
            <input
              type="text"
              className="wv-input"
              placeholder="Brief explanation of items in this classification"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="wv-form-group">
            <label className="wv-form-label">Standard Warranty Horizon (Months)</label>
            <input
              type="number"
              min="1"
              max="120"
              className="wv-input"
              value={defaultWarrantyMonths}
              onChange={(e) => setDefaultWarrantyMonths(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="wv-btn wv-btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="wv-btn wv-btn-primary">
              Create Category
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
