import React, { useState } from 'react';
import { useVault } from '../context/VaultContext';
import {
  AlertTriangle,
  Clock,
  ShieldAlert,
  ArrowRight,
  Eye,
  CheckCircle,
  FileText,
  PhoneCall,
  ExternalLink,
} from 'lucide-react';
import Modal from '../components/Modal';

export default function ExpiringTrackerView() {
  const { products, navigate, notify, setPreviewDoc } = useVault();
  const [filterDays, setFilterDays] = useState('30'); // '7', '30', '90', 'expired', 'all'
  const [activeClaimItem, setActiveClaimItem] = useState(null);

  const getDaysRemaining = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    return Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
  };

  const filteredItems = products.filter((p) => {
    const d = getDaysRemaining(p.expiryDate);
    if (filterDays === '7') return d > 0 && d <= 7;
    if (filterDays === '30') return d > 0 && d <= 30;
    if (filterDays === '90') return d > 0 && d <= 90;
    if (filterDays === 'expired') return d <= 0;
    return d <= 90; // 'all'
  });

  const handleClaim = (e) => {
    e.preventDefault();
    notify(`Claim ticket generated for ${activeClaimItem.name}. Reference #EXP-CLM-${Date.now().toString().slice(-6)}`, 'success');
    setActiveClaimItem(null);
  };

  return (
    <div className="wv-content">
      {/* Header */}
      <div className="wv-page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 className="wv-page-title" style={{ marginBottom: 0 }}>
              Expiring Warranties Tracker
            </h1>
            <span className="wv-badge wv-badge-expiring">Urgent Attention</span>
          </div>
          <p className="wv-page-subtitle">
            Items nearing their warranty coverage end date. Act now to request repairs or replacements before time runs out.
          </p>
        </div>
      </div>

      {/* Filter Pills */}
      <div
        style={{
          display: 'flex',
          gap: '0.6rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
        }}
      >
        {[
          { id: '7', label: 'Within 7 Days' },
          { id: '30', label: 'Within 30 Days' },
          { id: '90', label: 'Within 90 Days' },
          { id: 'expired', label: 'Already Expired' },
          { id: 'all', label: 'Show All Attention Items' },
        ].map((pill) => (
          <button
            key={pill.id}
            onClick={() => setFilterDays(pill.id)}
            className={`wv-btn ${filterDays === pill.id ? 'wv-btn-primary' : 'wv-btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '0.45rem 1.1rem', fontSize: '0.85rem' }}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Results Table */}
      <div className="wv-card">
        <div className="wv-card-header">
          <h3 className="wv-card-title">
            <AlertTriangle size={18} color="var(--accent-amber)" />
            <span>Found {filteredItems.length} Products Requiring Attention</span>
          </h3>
        </div>

        <div className="wv-table-wrapper">
          <table className="wv-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Serial Number</th>
                <th>Expiry Date</th>
                <th>Countdown</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    <CheckCircle size={36} color="var(--accent-emerald)" style={{ margin: '0 auto 0.5rem' }} />
                    <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>
                      No items matching this expiry threshold!
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginTop: '0.2rem' }}>
                      All other warranties in your vault are safely active.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const days = getDaysRemaining(item.expiryDate);
                  const isExpired = days <= 0;

                  return (
                    <tr key={item.id}>
                      <td>
                        <strong style={{ color: 'var(--text-primary)', display: 'block' }}>{item.name}</strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>{item.brand}</span>
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
                        <strong style={{ fontSize: '0.9rem' }}>{item.expiryDate}</strong>
                      </td>
                      <td>
                        <span
                          className="wv-badge"
                          style={{
                            background: isExpired ? 'var(--status-expired-bg)' : days <= 7 ? 'rgba(239,68,68,0.1)' : 'var(--status-expiring-bg)',
                            color: isExpired ? 'var(--accent-rose)' : days <= 7 ? 'var(--accent-rose)' : 'var(--status-expiring-text)',
                            borderColor: isExpired ? 'var(--status-expired-border)' : 'var(--status-expiring-border)',
                          }}
                        >
                          {isExpired ? `Expired ${Math.abs(days)}d ago` : `${days} days left`}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => setActiveClaimItem(item)}
                            className="wv-btn wv-btn-primary wv-btn-sm"
                            title="Claim service"
                          >
                            <span>Claim</span>
                          </button>
                          <button
                            onClick={() => navigate('product-details', { productId: item.id })}
                            className="wv-btn wv-btn-secondary wv-btn-sm"
                            title="View details"
                          >
                            <Eye size={14} />
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

      {/* Claim Modal */}
      {activeClaimItem && (
        <Modal
          isOpen={!!activeClaimItem}
          onClose={() => setActiveClaimItem(null)}
          title={`File Claim for ${activeClaimItem.name}`}
          maxWidth="500px"
        >
          <form onSubmit={handleClaim}>
            <div style={{ padding: '1rem', background: 'var(--bg-canvas)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Item: <strong>{activeClaimItem.name}</strong> ({activeClaimItem.brand})
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', marginTop: '0.2rem' }}>
                Serial: {activeClaimItem.serialNumber} • Expiry: {activeClaimItem.expiryDate}
              </div>
            </div>

            <div className="wv-form-group">
              <label className="wv-form-label">Symptoms / Claim Description</label>
              <textarea
                required
                rows={3}
                className="wv-textarea"
                placeholder="Describe hardware issue before warranty expiration..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setActiveClaimItem(null)}
                className="wv-btn wv-btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="wv-btn wv-btn-primary">
                Confirm Claim Dispatch
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
