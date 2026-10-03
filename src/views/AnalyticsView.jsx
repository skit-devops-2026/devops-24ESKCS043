import React from 'react';
import { useVault } from '../context/VaultContext';
import {
  BarChart3,
  DollarSign,
  ShieldCheck,
  Package,
  Calendar,
  PieChart,
  TrendingUp,
} from 'lucide-react';

export default function AnalyticsView() {
  const { products, categories, serviceRecords } = useVault();

  // Financial calculations
  const totalValue = products.reduce((acc, p) => acc + (parseFloat(p.price) || 0), 0);
  const activeProducts = products.filter((p) => p.status === 'active');
  const expiringProducts = products.filter((p) => p.status === 'expiring');
  const expiredProducts = products.filter((p) => p.status === 'expired');

  const activeValue = activeProducts.reduce((acc, p) => acc + (parseFloat(p.price) || 0), 0);
  const atRiskValue = expiringProducts.reduce((acc, p) => acc + (parseFloat(p.price) || 0), 0);
  const expiredValue = expiredProducts.reduce((acc, p) => acc + (parseFloat(p.price) || 0), 0);

  const avgWarrantyMonths = products.length
    ? Math.round(products.reduce((acc, p) => acc + (parseInt(p.warrantyMonths, 10) || 12), 0) / products.length)
    : 12;

  return (
    <div className="wv-content">
      {/* Page Header */}
      <div className="wv-page-header">
        <div>
          <h1 className="wv-page-title">Portfolio Analytics & Insights</h1>
          <p className="wv-page-subtitle">
            Visual metrics covering portfolio value, category allocation, and warranty risk exposures.
          </p>
        </div>
      </div>

      {/* 4 Big KPI Metric Cards */}
      <div className="wv-stats-grid">
        <div className="wv-stat-card primary">
          <div className="wv-stat-icon primary">
            <DollarSign size={26} />
          </div>
          <div>
            <div className="wv-stat-label">Total Vault Asset Value</div>
            <div className="wv-stat-number">${totalValue.toLocaleString()}</div>
          </div>
        </div>

        <div className="wv-stat-card success">
          <div className="wv-stat-icon success">
            <ShieldCheck size={26} />
          </div>
          <div>
            <div className="wv-stat-label">Under Active Warranty</div>
            <div className="wv-stat-number">${activeValue.toLocaleString()}</div>
          </div>
        </div>

        <div className="wv-stat-card warning">
          <div className="wv-stat-icon warning">
            <TrendingUp size={26} />
          </div>
          <div>
            <div className="wv-stat-label">At-Risk (Expiring Soon)</div>
            <div className="wv-stat-number">${atRiskValue.toLocaleString()}</div>
          </div>
        </div>

        <div className="wv-stat-card danger">
          <div className="wv-stat-icon danger">
            <Calendar size={26} />
          </div>
          <div>
            <div className="wv-stat-label">Avg Warranty Length</div>
            <div className="wv-stat-number">{avgWarrantyMonths} Mo</div>
          </div>
        </div>
      </div>

      {/* 2-Column Analytics Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '2rem' }}>
        {/* Category Asset Breakdown */}
        <div className="wv-card" style={{ marginBottom: 0 }}>
          <div className="wv-card-header">
            <h3 className="wv-card-title">
              <BarChart3 size={20} color="var(--primary)" />
              <span>Asset Value by Category</span>
            </h3>
          </div>
          <div className="wv-card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {categories.map((cat) => {
                const catProducts = products.filter((p) => p.category.toLowerCase() === cat.name.toLowerCase());
                const catValue = catProducts.reduce((acc, p) => acc + (parseFloat(p.price) || 0), 0);
                const pct = totalValue ? Math.round((catValue / totalValue) * 100) : 0;

                return (
                  <div key={cat.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cat.name}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        ${catValue.toLocaleString()} ({pct}%)
                      </span>
                    </div>
                    <div className="wv-gauge-bar" style={{ height: '8px' }}>
                      <div
                        style={{
                          height: '100%',
                          background: 'var(--primary-gradient)',
                          borderRadius: 'var(--radius-full)',
                          width: `${pct}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Warranty Health Status Ratio */}
        <div className="wv-card" style={{ marginBottom: 0 }}>
          <div className="wv-card-header">
            <h3 className="wv-card-title">
              <PieChart size={20} color="var(--accent-emerald)" />
              <span>Warranty Coverage Health Distribution</span>
            </h3>
          </div>
          <div className="wv-card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--accent-emerald)' }}>
                    🟢 Active & Safe Coverage ({activeProducts.length} items)
                  </span>
                  <strong>{products.length ? Math.round((activeProducts.length / products.length) * 100) : 0}%</strong>
                </div>
                <div className="wv-gauge-bar" style={{ height: '10px' }}>
                  <div
                    className="wv-gauge-fill active"
                    style={{ width: `${products.length ? (activeProducts.length / products.length) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--accent-amber)' }}>
                    🟡 Expiring Window (&lt; 30d) ({expiringProducts.length} items)
                  </span>
                  <strong>{products.length ? Math.round((expiringProducts.length / products.length) * 100) : 0}%</strong>
                </div>
                <div className="wv-gauge-bar" style={{ height: '10px' }}>
                  <div
                    className="wv-gauge-fill expiring"
                    style={{ width: `${products.length ? (expiringProducts.length / products.length) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--accent-rose)' }}>
                    🔴 Expired Coverage ({expiredProducts.length} items)
                  </span>
                  <strong>{products.length ? Math.round((expiredProducts.length / products.length) * 100) : 0}%</strong>
                </div>
                <div className="wv-gauge-bar" style={{ height: '10px' }}>
                  <div
                    className="wv-gauge-fill expired"
                    style={{ width: `${products.length ? (expiredProducts.length / products.length) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div
                style={{
                  background: 'var(--bg-canvas)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  marginTop: '0.5rem',
                }}
              >
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                  💡 Financial Risk Assessment
                </h4>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  You currently have <strong>${atRiskValue.toLocaleString()}</strong> of hardware nearing the end of official manufacturer guarantee. We advise checking for fan noise, battery life, or port loose connections before warranties expire.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
