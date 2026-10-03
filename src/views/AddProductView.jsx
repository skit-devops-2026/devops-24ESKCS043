import React, { useState, useEffect } from 'react';
import { useVault } from '../context/VaultContext';
import {
  ArrowLeft,
  Save,
  Package,
  Calendar,
  Sparkles,
  UploadCloud,
  FileText,
  DollarSign,
  Tag,
  Hash,
  Building,
  CheckCircle,
  X,
} from 'lucide-react';

export default function AddProductView() {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    editingProductId,
    setEditingProductId,
    navigate,
    notify,
  } = useVault();

  // If in edit mode, populate from existing product
  const editingProduct = editingProductId
    ? products.find((p) => p.id === editingProductId)
    : null;

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Electronics');
  const [serialNumber, setSerialNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [warrantyMonths, setWarrantyMonths] = useState(24);
  const [expiryDate, setExpiryDate] = useState('');
  const [price, setPrice] = useState('999');
  const [currency, setCurrency] = useState('USD');
  const [retailer, setRetailer] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Auto-calculate expiry date when purchaseDate or warrantyMonths changes
  useEffect(() => {
    if (purchaseDate && warrantyMonths) {
      const pDate = new Date(purchaseDate);
      pDate.setMonth(pDate.getMonth() + parseInt(warrantyMonths, 10));
      setExpiryDate(pDate.toISOString().split('T')[0]);
    }
  }, [purchaseDate, warrantyMonths]);

  // Load existing product if editing
  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name || '');
      setBrand(editingProduct.brand || '');
      setModel(editingProduct.model || '');
      setCategory(editingProduct.category || categories[0]?.name || 'Electronics');
      setSerialNumber(editingProduct.serialNumber || '');
      setPurchaseDate(editingProduct.purchaseDate || new Date().toISOString().split('T')[0]);
      setWarrantyMonths(editingProduct.warrantyMonths || 24);
      setExpiryDate(editingProduct.expiryDate || '');
      setPrice(editingProduct.price ? String(editingProduct.price) : '0');
      setCurrency(editingProduct.currency || 'USD');
      setRetailer(editingProduct.retailer || '');
      setInvoiceNumber(editingProduct.invoiceNumber || '');
      setNotes(editingProduct.notes || '');
      setUploadedFiles(editingProduct.documents || []);
    }
  }, [editingProduct, categories]);

  const generateSerialNumber = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let res = `${brand.slice(0, 3).toUpperCase() || 'VAULT'}-`;
    for (let i = 0; i < 4; i++) res += chars.charAt(Math.floor(Math.random() * chars.length));
    res += '-';
    for (let i = 0; i < 4; i++) res += chars.charAt(Math.floor(Math.random() * chars.length));
    setSerialNumber(res);
    notify('Generated unique serial number: ' + res, 'info');
  };

  const handleSimulatedFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const newDoc = {
        id: `doc-${Date.now()}`,
        name: file.name,
        type: file.name.endsWith('.pdf') ? 'Invoice' : 'Receipt',
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
      };
      setUploadedFiles((prev) => [...prev, newDoc]);
      notify(`Attached "${file.name}" to product.`, 'success');
    }
  };

  const removeUploadedFile = (docId) => {
    setUploadedFiles((prev) => prev.filter((d) => d.id !== docId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      notify('Please enter a product name.', 'error');
      return;
    }

    const payload = {
      name,
      brand,
      model,
      category,
      serialNumber: serialNumber || `SN-${Math.floor(100000 + Math.random() * 900000)}`,
      purchaseDate,
      warrantyMonths: parseInt(warrantyMonths, 10) || 12,
      expiryDate,
      price: parseFloat(price) || 0,
      currency,
      retailer,
      invoiceNumber: invoiceNumber || `INV-${Math.floor(10000 + Math.random() * 90000)}`,
      notes,
      documents: uploadedFiles,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
      setEditingProductId(null);
      navigate('product-details', { productId: editingProduct.id });
    } else {
      const newId = addProduct(payload);
      navigate('product-details', { productId: newId });
    }
  };

  return (
    <div className="wv-content" style={{ maxWidth: '960px' }}>
      {/* Header */}
      <div className="wv-page-header">
        <div>
          <button
            onClick={() => {
              setEditingProductId(null);
              navigate('products');
            }}
            className="wv-btn wv-btn-secondary wv-btn-sm"
            style={{ marginBottom: '0.75rem' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Products</span>
          </button>
          <h1 className="wv-page-title">
            {editingProduct ? 'Edit Product Warranty' : 'Add New Product to Vault'}
          </h1>
          <p className="wv-page-subtitle">
            Enter purchase details, warranty period, and attach digital bills or warranty cards.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="wv-card">
          <div className="wv-card-header">
            <h3 className="wv-card-title">
              <Package size={20} color="var(--primary)" />
              <span>1. Basic Product Information</span>
            </h3>
          </div>
          <div className="wv-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div className="wv-form-group">
                <label className="wv-form-label">Product Name *</label>
                <input
                  type="text"
                  required
                  className="wv-input"
                  placeholder="e.g. MacBook Pro 16-inch, LG OLED TV"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="wv-form-group">
                <label className="wv-form-label">Brand / Manufacturer *</label>
                <input
                  type="text"
                  required
                  className="wv-input"
                  placeholder="e.g. Apple, Sony, Samsung, Dell"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>

              <div className="wv-form-group">
                <label className="wv-form-label">Category *</label>
                <select
                  className="wv-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="wv-form-group">
                <label className="wv-form-label">Model Number / Variant</label>
                <input
                  type="text"
                  className="wv-input"
                  placeholder="e.g. M3 Max 36GB Space Black"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                />
              </div>

              <div className="wv-form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label className="wv-form-label" style={{ marginBottom: 0 }}>Serial Number (S/N)</label>
                  <button
                    type="button"
                    onClick={generateSerialNumber}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <Sparkles size={13} />
                    <span>Auto Generate</span>
                  </button>
                </div>
                <input
                  type="text"
                  className="wv-input"
                  placeholder="e.g. DX9K2014M98X"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                />
              </div>

              <div className="wv-form-group">
                <label className="wv-form-label">Purchase Price ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="wv-input"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Warranty & Expiry Tracker */}
        <div className="wv-card">
          <div className="wv-card-header">
            <h3 className="wv-card-title">
              <Calendar size={20} color="var(--accent-amber)" />
              <span>2. Warranty Duration & Expiry Schedule</span>
            </h3>
          </div>
          <div className="wv-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div className="wv-form-group">
                <label className="wv-form-label">Purchase Date *</label>
                <input
                  type="date"
                  required
                  className="wv-input"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                />
              </div>

              <div className="wv-form-group">
                <label className="wv-form-label">Warranty Duration (Months)</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    className="wv-input"
                    value={warrantyMonths}
                    onChange={(e) => setWarrantyMonths(e.target.value)}
                  />
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[12, 24, 36].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setWarrantyMonths(m)}
                        className={`wv-btn wv-btn-sm ${parseInt(warrantyMonths, 10) === m ? 'wv-btn-primary' : 'wv-btn-secondary'}`}
                      >
                        {m / 12}y
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="wv-form-group">
                <label className="wv-form-label">Calculated Expiry Date</label>
                <input
                  type="date"
                  required
                  className="wv-input"
                  style={{ background: 'var(--bg-canvas)', fontWeight: 700 }}
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>

              <div className="wv-form-group">
                <label className="wv-form-label">Retailer / Purchased From</label>
                <input
                  type="text"
                  className="wv-input"
                  placeholder="e.g. Best Buy, Amazon, Apple Store"
                  value={retailer}
                  onChange={(e) => setRetailer(e.target.value)}
                />
              </div>

              <div className="wv-form-group">
                <label className="wv-form-label">Invoice / Receipt Number</label>
                <input
                  type="text"
                  className="wv-input"
                  placeholder="e.g. INV-AMZ-2025-8812"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                />
              </div>

              <div className="wv-form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="wv-form-label">Coverage Notes / Conditions</label>
                <textarea
                  rows={2}
                  className="wv-textarea"
                  placeholder="e.g. Includes screen protection with $29 deductible, covers battery replacement under 80% capacity."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Receipt & Documents Upload */}
        <div className="wv-card">
          <div className="wv-card-header">
            <h3 className="wv-card-title">
              <UploadCloud size={20} color="var(--accent-cyan)" />
              <span>3. Digital Receipts & Warranty Cards</span>
            </h3>
          </div>
          <div className="wv-card-body">
            <label
              style={{
                display: 'block',
                border: '2px dashed var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                background: 'var(--bg-canvas)',
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
            >
              <input
                type="file"
                style={{ display: 'none' }}
                onChange={handleSimulatedFileUpload}
                accept=".pdf,image/*"
              />
              <UploadCloud size={40} color="var(--primary)" style={{ margin: '0 auto 0.75rem' }} />
              <strong style={{ fontSize: '1rem', color: 'var(--text-primary)', display: 'block' }}>
                Click to attach Receipt or Drag & Drop File
              </strong>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                Upload PDF invoices, scan photo receipts, or warranty agreements.
              </p>
            </label>

            {uploadedFiles.length > 0 && (
              <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Attached Documents ({uploadedFiles.length})
                </span>
                {uploadedFiles.map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 1rem',
                      background: 'var(--bg-canvas)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <FileText size={18} color="var(--primary)" />
                      <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>{doc.name}</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>({doc.size || '1.1 MB'})</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeUploadedFile(doc.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', padding: '4px' }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '3rem' }}>
          <button
            type="button"
            onClick={() => {
              setEditingProductId(null);
              navigate('products');
            }}
            className="wv-btn wv-btn-secondary"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="wv-btn wv-btn-primary"
            style={{ padding: '0.75rem 2rem' }}
          >
            <Save size={18} />
            <span>{editingProduct ? 'Save Changes' : 'Register to Vault'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
