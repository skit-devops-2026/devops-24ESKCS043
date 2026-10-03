import React, { useState } from 'react';
import { useVault } from '../context/VaultContext';
import {
  Wrench,
  Plus,
  DollarSign,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Package,
} from 'lucide-react';
import Modal from '../components/Modal';

export default function ServiceHistoryView() {
  const { serviceRecords, products, addServiceRecord, notify } = useVault();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Modal form states
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [center, setCenter] = useState('');
  const [issue, setIssue] = useState('');
  const [cost, setCost] = useState('0');
  const [status, setStatus] = useState('Completed');
  const [notes, setNotes] = useState('');

  // Metrics
  const totalRepairs = serviceRecords.length;
  const totalCost = serviceRecords.reduce((acc, r) => acc + (parseFloat(r.cost) || 0), 0);
  const freeRepairs = serviceRecords.filter((r) => !r.cost || r.cost === 0).length;

  // Filter records
  const filteredRecords = serviceRecords.filter((rec) => {
    return (
      rec.productName.toLowerCase().includes(search.toLowerCase()) ||
      rec.issue.toLowerCase().includes(search.toLowerCase()) ||
      rec.center.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === selectedProductId) || { id: 'prod-unknown', name: 'Item' };

    addServiceRecord({
      productId: prod.id,
      productName: prod.name,
      date: new Date().toISOString().split('T')[0],
      center: center || 'Authorized Tech Hub',
      issue,
      cost: parseFloat(cost) || 0,
      status,
      notes,
    });

    setShowModal(false);
    setIssue('');
    setCost('0');
    setNotes('');
  };

  return (
    <div className="wv-content">
      {/* Page Header */}
      <div className="wv-page-header">
        <div>
          <h1 className="wv-page-title">Service & Repair History</h1>
          <p className="wv-page-subtitle">
            Log, track, and audit maintenance visits, spare part replacements, and service costs.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="wv-btn wv-btn-primary"
        >
          <Plus size={18} />
          <span>Log New Service</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="wv-stats-grid">
        <div className="wv-stat-card primary">
          <div className="wv-stat-icon primary">
            <Wrench size={26} />
          </div>
          <div>
            <div className="wv-stat-label">Total Services</div>
            <div className="wv-stat-number">{totalRepairs}</div>
          </div>
        </div>

        <div className="wv-stat-card success">
          <div className="wv-stat-icon success">
            <CheckCircle2 size={26} />
          </div>
          <div>
            <div className="wv-stat-label">Free Warranty Repairs</div>
            <div className="wv-stat-number">{freeRepairs}</div>
          </div>
        </div>

        <div className="wv-stat-card warning">
          <div className="wv-stat-icon warning">
            <DollarSign size={26} />
          </div>
          <div>
            <div className="wv-stat-label">Out-of-Pocket Spend</div>
            <div className="wv-stat-number">${totalCost}</div>
          </div>
        </div>
      </div>

      {/* Table Toolbar */}
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
        <div style={{ position: 'relative', width: '280px' }}>
          <input
            type="text"
            placeholder="Search service logs..."
            className="wv-input"
            style={{ paddingLeft: '2.2rem' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search
            size={16}
            color="var(--text-tertiary)"
            style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }}
          />
        </div>

        <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
          Showing {filteredRecords.length} records
        </span>
      </div>

      {/* Service Table */}
      <div className="wv-card">
        <div className="wv-table-wrapper">
          <table className="wv-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Service Center</th>
                <th>Diagnosis & Work Performed</th>
                <th>Service Date</th>
                <th>Cost</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    No service records found.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong style={{ color: 'var(--text-primary)', fontSize: '0.94rem' }}>
                        {item.productName}
                      </strong>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                        {item.center}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                        {item.issue}
                      </div>
                      {item.notes && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                          {item.notes}
                        </div>
                      )}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.88rem' }}>{item.date}</span>
                    </td>
                    <td>
                      <strong style={{ color: item.cost > 0 ? 'var(--text-primary)' : 'var(--accent-emerald)' }}>
                        {item.cost > 0 ? `$${item.cost}` : 'Free (Warranty)'}
                      </strong>
                    </td>
                    <td>
                      <span
                        className="wv-badge"
                        style={{
                          background: item.status === 'Completed' ? 'var(--status-active-bg)' : 'var(--status-expiring-bg)',
                          color: item.status === 'Completed' ? 'var(--status-active-text)' : 'var(--status-expiring-text)',
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Service Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Log Maintenance or Service Center Visit"
        maxWidth="520px"
      >
        <form onSubmit={handleSubmit}>
          <div className="wv-form-group">
            <label className="wv-form-label">Related Product</label>
            <select
              className="wv-select"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.brand})
                </option>
              ))}
            </select>
          </div>

          <div className="wv-form-group">
            <label className="wv-form-label">Service Center / Repair Shop</label>
            <input
              type="text"
              required
              className="wv-input"
              placeholder="e.g. Official Apple Care Hub, Best Buy Geek Squad"
              value={center}
              onChange={(e) => setCenter(e.target.value)}
            />
          </div>

          <div className="wv-form-group">
            <label className="wv-form-label">Work Done / Defect Description</label>
            <input
              type="text"
              required
              className="wv-input"
              placeholder="e.g. Battery replacement under warranty, thermal paste repasting"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="wv-form-group">
              <label className="wv-form-label">Charged Cost ($)</label>
              <input
                type="number"
                min="0"
                className="wv-input"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              />
            </div>

            <div className="wv-form-group">
              <label className="wv-form-label">Status</label>
              <select
                className="wv-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Replaced">Item Replaced</option>
              </select>
            </div>
          </div>

          <div className="wv-form-group">
            <label className="wv-form-label">Technician Notes</label>
            <textarea
              rows={2}
              className="wv-textarea"
              placeholder="Additional comments or warranty advice..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
              Save Service Entry
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
