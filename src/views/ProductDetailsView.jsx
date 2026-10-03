import React, { useState } from 'react';
import { useVault } from '../context/VaultContext';
import {
  ArrowLeft,
  Edit,
  Trash2,
  ShieldCheck,
  Calendar,
  DollarSign,
  Tag,
  Building,
  Hash,
  FileText,
  Clock,
  Wrench,
  Download,
  Eye,
  Plus,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import Modal from '../components/Modal';

export default function ProductDetailsView() {
  const {
    products,
    selectedProductId,
    navigate,
    deleteProduct,
    addServiceRecord,
    addDocument,
    setPreviewDoc,
    notify,
  } = useVault();

  // Find selected product
  const product = products.find((p) => p.id === selectedProductId) || products[0];

  // Modals state
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showDocUploadModal, setShowDocUploadModal] = useState(false);

  // Form states for service record modal
  const [serviceCenter, setServiceCenter] = useState('');
  const [serviceIssue, setServiceIssue] = useState('');
  const [serviceCost, setServiceCost] = useState('0');
  const [serviceStatus, setServiceStatus] = useState('Completed');

  // Form state for doc upload modal
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('Receipt');

  if (!product) {
    return (
      <div className="wv-content" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <h2>Product not found</h2>
        <button onClick={() => navigate('products')} className="wv-btn wv-btn-primary" style={{ marginTop: '1rem' }}>
          Back to My Products
        </button>
      </div>
    );
  }

  // Days remaining calculation
  const now = new Date();
  const expiry = new Date(product.expiryDate);
  const days = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
  const isExpiring = product.status === 'expiring';
  const isExpired = product.status === 'expired';

  // Handle service record submit
  const handleServiceSubmit = (e) => {
    e.preventDefault();
    if (!serviceIssue.trim()) {
      notify('Please describe the service issue.', 'error');
      return;
    }

    addServiceRecord({
      productId: product.id,
      productName: product.name,
      date: new Date().toISOString().split('T')[0],
      center: serviceCenter || 'Brand Official Service Center',
      issue: serviceIssue,
      cost: parseFloat(serviceCost) || 0,
      status: serviceStatus,
    });

    setShowServiceModal(false);
    setServiceCenter('');
    setServiceIssue('');
    setServiceCost('0');
  };

  // Handle doc upload submit
  const handleDocSubmit = (e) => {
    e.preventDefault();
    if (!docName.trim()) {
      notify('Please provide a document title.', 'error');
      return;
    }

    addDocument({
      productId: product.id,
      productName: product.name,
      name: docName.endsWith('.pdf') ? docName : `${docName}.pdf`,
      type: docType,
      size: '1.4 MB',
    });

    setShowDocUploadModal(false);
    setDocName('');
  };

  const handleClaimSubmit = (e) => {
    e.preventDefault();
    notify(`Claim request generated for ${product.name}! Support reference #CLM-${Math.floor(100000 + Math.random() * 900000)} created.`, 'success');
    setShowClaimModal(false);
  };

  return (
    <div className="wv-content">
      {/* Top Navigation & Action Header */}
      <div className="wv-page-header">
        <div>
          <button
            onClick={() => navigate('products')}
            className="wv-btn wv-btn-secondary wv-btn-sm"
            style={{ marginBottom: '0.75rem' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Products</span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h1 className="wv-page-title" style={{ marginBottom: 0 }}>
              {product.name}
            </h1>
            <span className={`wv-badge wv-badge-${product.status}`}>
              {isExpiring ? 'Expiring Soon' : isExpired ? 'Expired' : 'Active Warranty'}
            </span>
          </div>
          <p className="wv-page-subtitle">
            {product.brand} • Category: <strong>{product.category}</strong> • Serial: {product.serialNumber}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('add-product', { editProductId: product.id })}
            className="wv-btn wv-btn-secondary"
          >
            <Edit size={16} />
            <span>Edit Item</span>
          </button>
          <button
            onClick={() => {
              deleteProduct(product.id);
              navigate('products');
            }}
            className="wv-btn wv-btn-danger"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Left Column: Specifications & Documents */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Specifications Card */}
          <div className="wv-card" style={{ marginBottom: 0 }}>
            <div className="wv-card-header">
              <h3 className="wv-card-title">
                <ShieldCheck size={20} color="var(--primary)" />
                <span>Product Specifications & Details</span>
              </h3>
            </div>
            <div className="wv-card-body">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                    Brand / Manufacturer
                  </span>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{product.brand}</strong>
                </div>

                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                    Model Number
                  </span>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{product.model || 'Standard Edition'}</strong>
                </div>

                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                    Serial Number (S/N)
                  </span>
                  <code style={{ fontSize: '0.95rem', color: 'var(--primary)', fontWeight: 600 }}>{product.serialNumber}</code>
                </div>

                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                    Purchase Date
                  </span>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{product.purchaseDate}</strong>
                </div>

                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                    Retailer / Store
                  </span>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{product.retailer || 'Authorized Retailer'}</strong>
                </div>

                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                    Purchase Price
                  </span>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    ${product.price} {product.currency || 'USD'}
                  </strong>
                </div>

                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                    Invoice / Receipt Ref
                  </span>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{product.invoiceNumber || 'INV-PENDING'}</strong>
                </div>

                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                    Warranty Horizon
                  </span>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    {product.warrantyMonths} Months Coverage
                  </strong>
                </div>
              </div>

              {product.notes && (
                <div
                  style={{
                    marginTop: '1.5rem',
                    paddingTop: '1.25rem',
                    borderTop: '1px solid var(--border-subtle)',
                  }}
                >
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                    Coverage Notes & Terms
                  </span>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                    {product.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Attached Documents Vault for this product */}
          <div className="wv-card" style={{ marginBottom: 0 }}>
            <div className="wv-card-header">
              <h3 className="wv-card-title">
                <FileText size={20} color="var(--primary)" />
                <span>Invoices & Proof of Purchase ({product.documents ? product.documents.length : 0})</span>
              </h3>
              <button
                onClick={() => setShowDocUploadModal(true)}
                className="wv-btn wv-btn-secondary wv-btn-sm"
              >
                <Plus size={15} />
                <span>Upload Document</span>
              </button>
            </div>

            <div className="wv-card-body">
              {!product.documents || product.documents.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)' }}>
                  <FileText size={36} color="var(--text-tertiary)" style={{ margin: '0 auto 0.5rem' }} />
                  <p style={{ fontSize: '0.92rem' }}>No receipts or warranty cards attached yet.</p>
                  <button
                    onClick={() => setShowDocUploadModal(true)}
                    className="wv-btn wv-btn-secondary wv-btn-sm"
                    style={{ marginTop: '0.75rem' }}
                  >
                    Attach First Document
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                  {product.documents.map((doc) => (
                    <div
                      key={doc.id}
                      style={{
                        background: 'var(--bg-canvas)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--primary-light)',
                            color: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <FileText size={18} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <strong
                            style={{
                              fontSize: '0.88rem',
                              color: 'var(--text-primary)',
                              display: 'block',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {doc.name}
                          </strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                            {doc.type} • {doc.size || '1.2 MB'}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
                        <button
                          onClick={() => setPreviewDoc({ ...doc, productName: product.name })}
                          className="wv-btn wv-btn-secondary wv-btn-sm"
                          title="Preview document"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => notify(`Downloading "${doc.name}"...`, 'info')}
                          className="wv-btn wv-btn-secondary wv-btn-sm"
                          title="Download document"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Service & Repair History Timeline */}
          <div className="wv-card" style={{ marginBottom: 0 }}>
            <div className="wv-card-header">
              <h3 className="wv-card-title">
                <Wrench size={20} color="var(--primary)" />
                <span>Service & Maintenance Records ({product.serviceHistory ? product.serviceHistory.length : 0})</span>
              </h3>
              <button
                onClick={() => setShowServiceModal(true)}
                className="wv-btn wv-btn-secondary wv-btn-sm"
              >
                <Plus size={15} />
                <span>Log Service Record</span>
              </button>
            </div>

            <div className="wv-card-body">
              {!product.serviceHistory || product.serviceHistory.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)' }}>
                  <Wrench size={36} color="var(--text-tertiary)" style={{ margin: '0 auto 0.5rem' }} />
                  <p style={{ fontSize: '0.92rem' }}>No maintenance or service center visits recorded yet.</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '0.2rem' }}>
                    Keep track of routine inspections, screen replacements, or oil changes here.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {product.serviceHistory.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-canvas)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <strong style={{ fontSize: '0.94rem', color: 'var(--text-primary)' }}>
                            {item.issue}
                          </strong>
                          <span
                            className="wv-badge"
                            style={{
                              background: item.status === 'Completed' ? 'var(--status-active-bg)' : 'var(--status-expiring-bg)',
                              color: item.status === 'Completed' ? 'var(--status-active-text)' : 'var(--status-expiring-text)',
                            }}
                          >
                            {item.status}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                          Service Center: <strong>{item.center}</strong> • Date: {item.date}
                        </p>
                        {item.notes && (
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '0.3rem' }}>
                            {item.notes}
                          </p>
                        )}
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'block' }}>
                          OUT-OF-POCKET
                        </span>
                        <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                          {item.cost > 0 ? `$${item.cost}` : 'Free (Warranty)'}
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Warranty Countdown Gauge & Claim Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Warranty Status Countdown Card */}
          <div className="wv-card" style={{ marginBottom: 0 }}>
            <div className="wv-card-header">
              <h3 className="wv-card-title">
                <Clock size={18} color="var(--primary)" />
                <span>Warranty Timeline</span>
              </h3>
            </div>
            <div className="wv-card-body" style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  margin: '0 auto 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isExpired ? 'var(--status-expired-bg)' : isExpiring ? 'var(--status-expiring-bg)' : 'var(--status-active-bg)',
                  border: `3px solid ${isExpired ? 'var(--status-expired-border)' : isExpiring ? 'var(--status-expiring-border)' : 'var(--status-active-border)'}`,
                  color: isExpired ? 'var(--accent-rose)' : isExpiring ? 'var(--accent-amber)' : 'var(--accent-emerald)',
                }}
              >
                {isExpired ? <AlertTriangle size={42} /> : <ShieldCheck size={42} />}
              </div>

              <h4 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {days <= 0 ? 'Coverage Expired' : `${days} Days Left`}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem', marginBottom: '1.5rem' }}>
                Expiration Target: <strong>{product.expiryDate}</strong>
              </p>

              {/* Progress gauge */}
              <div className="wv-gauge-bar" style={{ height: '8px', marginBottom: '1.5rem' }}>
                <div
                  className={`wv-gauge-fill ${product.status}`}
                  style={{ width: `${Math.max(5, Math.min(100, Math.round((Math.max(0, days) / 730) * 100)))}%` }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <button
                  onClick={() => setShowClaimModal(true)}
                  className="wv-btn wv-btn-primary"
                  style={{ width: '100%' }}
                >
                  <ShieldCheck size={16} />
                  <span>File Warranty Claim</span>
                </button>
                <button
                  onClick={() => notify(`Initiating warranty extension quote with ${product.brand}...`, 'info')}
                  className="wv-btn wv-btn-secondary"
                  style={{ width: '100%' }}
                >
                  <span>Request Warranty Extension</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Help Card */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
            }}
          >
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <HelpCircle size={18} color="var(--primary)" />
              <span>Need Help Claiming?</span>
            </h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Most manufacturers require your official invoice reference (<strong>{product.invoiceNumber || 'INV-APL'}</strong>) and device serial number (<strong>{product.serialNumber}</strong>). Both are backed up here.
            </p>
          </div>
        </div>
      </div>

      {/* Claim Warranty Modal */}
      <Modal
        isOpen={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        title="File Warranty Claim"
        maxWidth="500px"
      >
        <form onSubmit={handleClaimSubmit}>
          <div style={{ marginBottom: '1.25rem', padding: '0.85rem', background: 'var(--bg-canvas)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>
              CLAIMING FOR
            </span>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{product.name}</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              S/N: {product.serialNumber} • Valid until {product.expiryDate}
            </p>
          </div>

          <div className="wv-form-group">
            <label className="wv-form-label">Nature of Defect / Hardware Issue</label>
            <textarea
              required
              rows={3}
              className="wv-textarea"
              placeholder="e.g. Screen flickering when charged, fan motor rattling, battery drain..."
            />
          </div>

          <div className="wv-form-group">
            <label className="wv-form-label">Preferred Fulfillment</label>
            <select className="wv-select">
              <option>Authorized Service Center Walk-in</option>
              <option>Free Mail-in Repair Box</option>
              <option>On-Site Technician Dispatch</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setShowClaimModal(false)}
              className="wv-btn wv-btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="wv-btn wv-btn-primary">
              Submit Official Claim
            </button>
          </div>
        </form>
      </Modal>

      {/* Log Service Modal */}
      <Modal
        isOpen={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        title="Log Maintenance or Repair Record"
        maxWidth="500px"
      >
        <form onSubmit={handleServiceSubmit}>
          <div className="wv-form-group">
            <label className="wv-form-label">Service Center / Technician</label>
            <input
              type="text"
              required
              className="wv-input"
              placeholder="e.g. Official Apple Genius Bar, Dell Hub, Local Authorized Tech"
              value={serviceCenter}
              onChange={(e) => setServiceCenter(e.target.value)}
            />
          </div>

          <div className="wv-form-group">
            <label className="wv-form-label">Service / Repair Description</label>
            <input
              type="text"
              required
              className="wv-input"
              placeholder="e.g. Replaced display glass, cleaned cooling fans, firmware reinstall"
              value={serviceIssue}
              onChange={(e) => setServiceIssue(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="wv-form-group">
              <label className="wv-form-label">Out-of-Pocket Cost ($)</label>
              <input
                type="number"
                min="0"
                className="wv-input"
                value={serviceCost}
                onChange={(e) => setServiceCost(e.target.value)}
              />
            </div>
            <div className="wv-form-group">
              <label className="wv-form-label">Status</label>
              <select
                className="wv-select"
                value={serviceStatus}
                onChange={(e) => setServiceStatus(e.target.value)}
              >
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Replaced">Replaced</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setShowServiceModal(false)}
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

      {/* Upload Document Modal */}
      <Modal
        isOpen={showDocUploadModal}
        onClose={() => setShowDocUploadModal(false)}
        title="Upload Receipt or Warranty Card"
        maxWidth="480px"
      >
        <form onSubmit={handleDocSubmit}>
          <div className="wv-form-group">
            <label className="wv-form-label">Document Title</label>
            <input
              type="text"
              required
              className="wv-input"
              placeholder="e.g. Official_Tax_Invoice_2025"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
            />
          </div>

          <div className="wv-form-group">
            <label className="wv-form-label">Document Classification</label>
            <select
              className="wv-select"
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
            >
              <option value="Receipt">Tax Invoice / Receipt</option>
              <option value="Warranty Card">Official Warranty Certificate</option>
              <option value="Service Invoice">Repair / Service Bill</option>
              <option value="Manual">User Manual & Diagram</option>
            </select>
          </div>

          <div
            style={{
              border: '2px dashed var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '2rem 1.5rem',
              textAlign: 'center',
              background: 'var(--bg-canvas)',
              marginBottom: '1.25rem',
              cursor: 'pointer',
            }}
          >
            <FileText size={32} color="var(--primary)" style={{ margin: '0 auto 0.5rem' }} />
            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Click to select or drag PDF / Image receipt here
            </p>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
              Supported: PDF, PNG, JPG up to 25MB
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setShowDocUploadModal(false)}
              className="wv-btn wv-btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="wv-btn wv-btn-primary">
              Attach to Vault
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
