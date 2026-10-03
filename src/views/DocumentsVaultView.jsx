import React, { useState } from 'react';
import { useVault } from '../context/VaultContext';
import {
  FileText,
  Plus,
  Search,
  Eye,
  Download,
  Trash2,
  FileCheck,
  Tag,
  Shield,
} from 'lucide-react';
import Modal from '../components/Modal';

export default function DocumentsVaultView() {
  const {
    documents,
    products,
    addDocument,
    deleteDocument,
    setPreviewDoc,
    notify,
  } = useVault();

  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload Form states
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('Receipt');

  const filteredDocs = documents.filter((doc) => {
    const matchesTab = activeTab === 'All' || doc.type === activeTab;
    const matchesSearch =
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      (doc.productName && doc.productName.toLowerCase().includes(search.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!docName.trim()) {
      notify('Please enter a document title.', 'error');
      return;
    }

    const prod = products.find((p) => p.id === selectedProductId) || { id: 'prod-general', name: 'General Vault Item' };

    addDocument({
      productId: prod.id,
      productName: prod.name,
      name: docName.endsWith('.pdf') ? docName : `${docName}.pdf`,
      type: docType,
      size: '1.8 MB',
    });

    setShowUploadModal(false);
    setDocName('');
  };

  return (
    <div className="wv-content">
      {/* Page Header */}
      <div className="wv-page-header">
        <div>
          <h1 className="wv-page-title">Digital Document Vault</h1>
          <p className="wv-page-subtitle">
            Securely encrypted bills, tax receipts, warranty cards, and repair certificates.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="wv-btn wv-btn-primary"
        >
          <Plus size={18} />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Tabs and Search Bar */}
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
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {['All', 'Receipt', 'Warranty Card', 'Invoice'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`wv-btn wv-btn-sm ${activeTab === tab ? 'wv-btn-primary' : 'wv-btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              {tab === 'All' ? 'All Files' : `${tab}s`}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '260px' }}>
          <input
            type="text"
            placeholder="Search documents or items..."
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
      </div>

      {/* Document Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {filteredDocs.length === 0 ? (
          <div
            className="wv-card"
            style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem' }}
          >
            <FileText size={48} color="var(--text-tertiary)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              No Documents in this Category
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
              Upload an invoice or proof of purchase to keep your claims compliant.
            </p>
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <div
              key={doc.id}
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
                      width: '46px',
                      height: '46px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FileText size={24} />
                  </div>
                  <span
                    style={{
                      background: 'var(--bg-canvas)',
                      border: '1px solid var(--border-subtle)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    {doc.type}
                  </span>
                </div>

                <h4
                  onClick={() => setPreviewDoc(doc)}
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={doc.name}
                >
                  {doc.name}
                </h4>

                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                  Product: <strong>{doc.productName || 'General Asset'}</strong>
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-tertiary)', marginTop: '1rem' }}>
                  <span>Size: {doc.size || '1.2 MB'}</span>
                  <span>Uploaded: {doc.uploadDate || 'Active'}</span>
                </div>
              </div>

              <div
                style={{
                  padding: '0.85rem 1.5rem',
                  background: 'var(--bg-canvas)',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <button
                  onClick={() => setPreviewDoc(doc)}
                  className="wv-btn wv-btn-secondary wv-btn-sm"
                >
                  <Eye size={14} />
                  <span>Preview</span>
                </button>

                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button
                    onClick={() => notify(`Downloading "${doc.name}"...`, 'info')}
                    className="wv-btn wv-btn-secondary wv-btn-sm"
                    title="Download document"
                  >
                    <Download size={14} />
                  </button>
                  <button
                    onClick={() => deleteDocument(doc.id)}
                    className="wv-btn wv-btn-danger wv-btn-sm"
                    title="Delete document"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Receipt or Document to Vault"
        maxWidth="500px"
      >
        <form onSubmit={handleUploadSubmit}>
          <div className="wv-form-group">
            <label className="wv-form-label">Link to Product</label>
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
            <label className="wv-form-label">Document Name</label>
            <input
              type="text"
              required
              className="wv-input"
              placeholder="e.g. BestBuy_Invoice_Receipt"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
            />
          </div>

          <div className="wv-form-group">
            <label className="wv-form-label">Classification Type</label>
            <select
              className="wv-select"
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
            >
              <option value="Receipt">Tax Invoice / Receipt</option>
              <option value="Warranty Card">Warranty Certificate</option>
              <option value="Service Invoice">Repair / Maintenance Bill</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setShowUploadModal(false)}
              className="wv-btn wv-btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="wv-btn wv-btn-primary">
              Upload to Vault
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
