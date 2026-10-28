import React, { useEffect, useState } from 'react';
import { useVault } from '../context/VaultContext';
import { FileText, Download, ExternalLink, Loader2 } from 'lucide-react';
import Modal from './Modal';

// Shows the real uploaded file: PDFs and text in an embedded viewer, images inline.
export default function DocumentModal() {
  const { previewDoc, setPreviewDoc, fetchDocumentBlob, downloadDocument } = useVault();
  const [url, setUrl] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!previewDoc) return undefined;
    let objectUrl = null;
    let cancelled = false;
    setUrl(null);
    setError('');
    setLoading(true);
    fetchDocumentBlob(previewDoc)
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
      })
      .catch((err) => !cancelled && setError(err.message || 'Could not load this document'))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewDoc?.id]);

  if (!previewDoc) return null;

  const mime = previewDoc.mimeType || '';
  const isImage = mime.startsWith('image/');
  const isEmbeddable = mime === 'application/pdf' || mime.startsWith('text/');

  return (
    <Modal
      isOpen={!!previewDoc}
      onClose={() => setPreviewDoc(null)}
      title="Document Viewer"
      maxWidth="860px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div
          style={{
            background: 'var(--bg-canvas)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
            <div
              style={{
                width: '46px', height: '46px', borderRadius: 'var(--radius-md)',
                background: 'var(--primary-light)', color: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}
            >
              <FileText size={24} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', wordBreak: 'break-all' }}>
                {previewDoc.name}
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                {previewDoc.type} • {previewDoc.size} • Uploaded {previewDoc.uploadDate}
                {previewDoc.productName && <> • Product: <strong>{previewDoc.productName}</strong></>}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {url && (
              <a href={url} target="_blank" rel="noreferrer" className="wv-btn wv-btn-secondary wv-btn-sm" title="Open in new tab">
                <ExternalLink size={16} />
                <span>Open</span>
              </a>
            )}
            <button
              onClick={() => downloadDocument(previewDoc)}
              className="wv-btn wv-btn-primary wv-btn-sm"
              title="Download file"
            >
              <Download size={16} />
              <span>Download</span>
            </button>
          </div>
        </div>

        <div
          style={{
            background: 'var(--bg-canvas)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            minHeight: '360px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {loading && (
            <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Loader2 size={18} className="wv-spin" /> Loading document…
            </div>
          )}
          {error && <p style={{ color: 'var(--accent-rose)', padding: '2rem', textAlign: 'center' }}>{error}</p>}
          {url && isImage && (
            <img src={url} alt={previewDoc.name} style={{ maxWidth: '100%', maxHeight: '65vh', objectFit: 'contain' }} />
          )}
          {url && isEmbeddable && (
            <iframe title={previewDoc.name} src={url} style={{ width: '100%', height: '65vh', border: 0, background: '#fff' }} />
          )}
          {url && !isImage && !isEmbeddable && (
            <p style={{ color: 'var(--text-secondary)', padding: '2rem', textAlign: 'center' }}>
              This file type can’t be previewed in the browser. Use Download to open it.
            </p>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={() => setPreviewDoc(null)} className="wv-btn wv-btn-secondary">
            Close Viewer
          </button>
        </div>
      </div>
    </Modal>
  );
}
