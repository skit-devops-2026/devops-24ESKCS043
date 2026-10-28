import React, { useRef, useState } from 'react';
import { FileText, UploadCloud, X } from 'lucide-react';
import { ACCEPTED_FILE_TYPES, MAX_UPLOAD_BYTES } from '../api';

const fmtSize = (b) => (b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / (1024 * 1024)).toFixed(1)} MB`);

/** Click-or-drag file picker for a single real file. */
export default function FileDropzone({ file, onChange, onError }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const accept = (f) => {
    if (!f) return;
    if (f.size > MAX_UPLOAD_BYTES) {
      onError?.(`"${f.name}" is larger than 10 MB.`);
      return;
    }
    onChange(f);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        accept(e.dataTransfer.files?.[0]);
      }}
      style={{
        border: `2px dashed ${dragging ? 'var(--primary)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-md)',
        padding: file ? '1rem 1.25rem' : '2rem 1.5rem',
        textAlign: 'center',
        background: 'var(--bg-canvas)',
        marginBottom: '1.25rem',
        cursor: 'pointer',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_FILE_TYPES}
        style={{ display: 'none' }}
        data-testid="doc-file-input"
        onChange={(e) => { accept(e.target.files?.[0]); e.target.value = ''; }}
      />
      {file ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
            <FileText size={22} color="var(--primary)" style={{ flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {file.name}
              </strong>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>{fmtSize(file.size)} • click to change</span>
            </div>
          </div>
          <button
            type="button"
            className="wv-btn wv-btn-secondary wv-btn-sm"
            onClick={(e) => { e.stopPropagation(); onChange(null); }}
            aria-label="Remove file"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <>
          <UploadCloud size={32} color="var(--primary)" style={{ margin: '0 auto 0.5rem' }} />
          <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Click to select or drag a PDF / image here
          </p>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
            Supported: PDF, PNG, JPG, WEBP, GIF, TXT — up to 10 MB
          </span>
        </>
      )}
    </div>
  );
}
