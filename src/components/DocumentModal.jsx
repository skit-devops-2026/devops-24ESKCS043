import React from 'react';
import { useVault } from '../context/VaultContext';
import { FileText, Download, Printer, ShieldCheck, Calendar, HardDrive } from 'lucide-react';
import Modal from './Modal';

export default function DocumentModal() {
  const { previewDoc, setPreviewDoc, notify } = useVault();

  if (!previewDoc) return null;

  const handleDownload = () => {
    notify(`Downloading "${previewDoc.name}"...`, 'info');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={!!previewDoc}
      onClose={() => setPreviewDoc(null)}
      title="Document Viewer"
      maxWidth="680px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Document Header Card */}
        <div
          style={{
            background: 'var(--bg-canvas)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {previewDoc.name}
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Associated Product: <strong>{previewDoc.productName || 'Vault Item'}</strong>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handlePrint}
              className="wv-btn wv-btn-secondary wv-btn-sm"
              title="Print document"
            >
              <Printer size={16} />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="wv-btn wv-btn-primary wv-btn-sm"
              title="Download file"
            >
              <Download size={16} />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* High-Fidelity Simulated Document Preview */}
        <div
          style={{
            background: '#ffffff',
            color: '#0f172a',
            border: '1px solid #cbd5e1',
            borderRadius: 'var(--radius-md)',
            padding: '2rem',
            minHeight: '320px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderBottom: '2px solid #e2e8f0',
              paddingBottom: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: '#4f46e5' }}>
                <ShieldCheck size={20} />
                <span>OFFICIAL WARRANTY VAULT CERTIFICATE</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                Cryptographically Verified Proof of Purchase
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                DOC REF: {previewDoc.id ? previewDoc.id.toUpperCase() : 'DOC-VERIFIED'}
              </span>
              <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Recorded: {previewDoc.uploadDate || previewDoc.date || 'Active'}
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.88rem' }}>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.78rem', display: 'block' }}>DOCUMENT TYPE</span>
              <strong>{previewDoc.type || 'Official Receipt / Warranty'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.78rem', display: 'block' }}>FILE SIZE</span>
              <strong>{previewDoc.size || '1.4 MB'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.78rem', display: 'block' }}>RETAILER / ISSUER</span>
              <strong>Verified Vendor Partner</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.78rem', display: 'block' }}>CLAIM ELIGIBILITY</span>
              <strong style={{ color: '#059669' }}>VALID & AUTHENTIC</strong>
            </div>
          </div>

          <div
            style={{
              background: '#f8fafc',
              border: '1px dashed #cbd5e1',
              borderRadius: 'var(--radius-sm)',
              padding: '1.5rem',
              textAlign: 'center',
              marginTop: '1rem',
            }}
          >
            <ShieldCheck size={40} color="#4f46e5" style={{ margin: '0 auto 0.5rem' }} />
            <h5 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Digital Document Verified & Stored</h5>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.25rem' }}>
              This record is archived securely in your encrypted personal vault. You can present this certificate or print the receipt during warranty claim fulfillment.
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button
            onClick={() => setPreviewDoc(null)}
            className="wv-btn wv-btn-secondary"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </Modal>
  );
}
