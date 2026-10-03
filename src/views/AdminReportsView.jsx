import React, { useState } from 'react';
import { useVault } from '../context/VaultContext';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Filter,
  CheckCircle2,
  FileText,
  DollarSign,
  Package,
} from 'lucide-react';

export default function AdminReportsView() {
  const { products, users, serviceRecords, notify } = useVault();

  const [reportType, setReportType] = useState('full-catalog');
  const [dateRange, setDateRange] = useState('all-time');

  const totalValue = products.reduce((acc, p) => acc + (parseFloat(p.price) || 0), 0);
  const totalServiceSpend = serviceRecords.reduce((acc, s) => acc + (parseFloat(s.cost) || 0), 0);

  const handleExportCSV = () => {
    // Generate CSV content from products
    const headers = ['ID', 'Name', 'Brand', 'Category', 'Purchase Date', 'Expiry Date', 'Price', 'Status', 'Serial Number'];
    const rows = products.map((p) => [
      p.id,
      `"${p.name}"`,
      `"${p.brand}"`,
      p.category,
      p.purchaseDate,
      p.expiryDate,
      p.price,
      p.status,
      p.serialNumber,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `WarrantyVault_Audit_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notify('Audit CSV file generated and downloaded successfully.', 'success');
  };

  const handleExportJSON = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      products,
      users,
      serviceRecords,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `WarrantyVault_Complete_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notify('Full JSON vault backup exported.', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="wv-content">
      {/* Header */}
      <div className="wv-page-header">
        <div>
          <h1 className="wv-page-title">Reports & Audit Generator</h1>
          <p className="wv-page-subtitle">
            Generate compliance reports, export financial portfolio data, and back up system records.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handlePrint}
            className="wv-btn wv-btn-secondary"
          >
            <Printer size={16} />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="wv-btn wv-btn-primary"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Control Panel Card */}
      <div className="wv-card">
        <div className="wv-card-header">
          <h3 className="wv-card-title">
            <Filter size={20} color="var(--primary)" />
            <span>Report Configuration Parameters</span>
          </h3>
        </div>
        <div className="wv-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', alignItems: 'flex-end' }}>
            <div className="wv-form-group" style={{ marginBottom: 0 }}>
              <label className="wv-form-label">Report Category</label>
              <select
                className="wv-select"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="full-catalog">Comprehensive Product & Warranty Audit</option>
                <option value="expiry-risk">Expiring Coverage Risk Summary</option>
                <option value="service-costs">Maintenance & Service Cost Log</option>
                <option value="users">User Accounts & Vault Health</option>
              </select>
            </div>

            <div className="wv-form-group" style={{ marginBottom: 0 }}>
              <label className="wv-form-label">Date Horizon</label>
              <select
                className="wv-select"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="all-time">All Registered Records</option>
                <option value="last-30">Last 30 Days Activity</option>
                <option value="last-90">Last 90 Days</option>
                <option value="year-to-date">Current Fiscal Year</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={handleExportJSON}
                className="wv-btn wv-btn-secondary"
                style={{ width: '100%' }}
              >
                <Download size={15} />
                <span>Export Raw JSON</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Summary Report Display */}
      <div className="wv-card">
        <div className="wv-card-header">
          <h3 className="wv-card-title">
            <FileSpreadsheet size={20} color="var(--accent-emerald)" />
            <span>Report Preview: Comprehensive System Audit</span>
          </h3>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>
            Generated on {new Date().toLocaleDateString()}
          </span>
        </div>

        <div className="wv-card-body">
          {/* Summary Strip */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              padding: '1.25rem',
              background: 'var(--bg-canvas)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '1.5rem',
            }}
          >
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>
                Catalog Count
              </span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {products.length} Products
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>
                Cumulative Value
              </span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                ${totalValue.toLocaleString()}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>
                Logged Service Bills
              </span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                ${totalServiceSpend.toLocaleString()}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>
                Account Base
              </span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {users.length} Users
              </div>
            </div>
          </div>

          {/* Audit Rows */}
          <div className="wv-table-wrapper">
            <table className="wv-table">
              <thead>
                <tr>
                  <th>Product Details</th>
                  <th>Category</th>
                  <th>Serial Number</th>
                  <th>Purchase Date</th>
                  <th>Expiry Date</th>
                  <th>Value</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong style={{ color: 'var(--text-primary)' }}>{item.name}</strong>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)' }}>{item.brand}</div>
                    </td>
                    <td>{item.category}</td>
                    <td>
                      <code style={{ fontSize: '0.82rem', color: 'var(--primary)' }}>{item.serialNumber}</code>
                    </td>
                    <td>{item.purchaseDate}</td>
                    <td>
                      <strong>{item.expiryDate}</strong>
                    </td>
                    <td>${item.price}</td>
                    <td>
                      <span className={`wv-badge wv-badge-${item.status}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
