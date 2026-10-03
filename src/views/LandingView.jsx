import React, { useState } from 'react';
import { useVault } from '../context/VaultContext';
import {
  Shield,
  ArrowRight,
  FileCheck,
  BellRing,
  FolderArchive,
  BarChart,
  Lock,
  Sparkles,
  ChevronRight,
  CheckCircle,
  HelpCircle,
  Laptop,
  Smartphone,
  Tv,
  Star,
  Zap,
} from 'lucide-react';

export default function LandingView() {
  const { navigate, theme, toggleTheme } = useVault();
  const [activeFaq, setActiveFaq] = useState(null);

  // Interactive Quick Calculator state
  const [calcCost, setCalcCost] = useState(1200);
  const [calcYears, setCalcYears] = useState(2);
  const savedAnnual = Math.round(calcCost * 0.22);

  const faqs = [
    {
      q: 'How does Warranty Vault help protect my purchases?',
      a: 'Warranty Vault keeps all your purchase invoices, digital warranty cards, and serial numbers safely organized in one place, notifying you weeks before coverage expires so you never miss a free claim or repair window.',
    },
    {
      q: 'Can I upload photos of physical paper receipts?',
      a: 'Yes! You can attach PDFs, camera photos, or scanned receipts directly to any registered item. All files are indexed and can be viewed or printed in one click.',
    },
    {
      q: 'Is there an Admin panel for team or household multi-user management?',
      a: 'Absolutely! Warranty Vault features an enterprise-grade Admin mode with category customization, user privileges, system audit logs, and analytics export.',
    },
    {
      q: 'What happens when a warranty is about to expire?',
      a: 'You get automated alerts via the in-app notification center (and customizable email reminder options in settings) at 30 days, 15 days, and 7 days prior to expiry.',
    },
  ];

  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Public Header */}
      <nav className="wv-landing-nav">
        <div
          className="wv-brand"
          onClick={() => navigate('landing')}
          style={{ cursor: 'pointer' }}
        >
          <div className="wv-brand-icon">
            <Shield size={22} />
          </div>
          <span style={{ color: 'var(--text-primary)' }}>WarrantyVault</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <a
            href="#features"
            style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-secondary)' }}
          >
            Features
          </a>
          <a
            href="#calculator"
            style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-secondary)' }}
          >
            Value Calculator
          </a>
          <a
            href="#faqs"
            style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-secondary)' }}
          >
            FAQs
          </a>

          <button
            onClick={() => navigate('login')}
            className="wv-btn wv-btn-secondary wv-btn-sm"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('dashboard')}
            className="wv-btn wv-btn-primary wv-btn-sm"
          >
            <span>Live Demo</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="wv-hero-section">
        <div className="wv-hero-badge">
          <Sparkles size={16} />
          <span>Next-Generation Asset & Warranty Protection</span>
        </div>

        <h1 className="wv-hero-title">
          Never Lose Track of Your Product Warranties Again
        </h1>

        <p className="wv-hero-desc">
          The ultimate intelligent vault to catalog all your purchases, receipts, warranty certificates, and service logs in one place. Receive instant expiry reminders before your rights expire.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('dashboard')}
            className="wv-btn wv-btn-primary"
            style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}
          >
            <Zap size={18} />
            <span>Open User Dashboard Demo</span>
          </button>
          <button
            onClick={() => navigate('admin-dashboard')}
            className="wv-btn wv-btn-secondary"
            style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}
          >
            <Lock size={18} />
            <span>Explore Admin Console</span>
          </button>
        </div>

        {/* Live Metrics Ticker Banner */}
        <div
          style={{
            marginTop: '3.5rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.5rem 2.5rem',
            boxShadow: 'var(--shadow-lg)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            textAlign: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)' }}>$450K+</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Warranty Value Saved
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>99.8%</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Claim Success Rate
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-amber)' }}>14,200+</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Receipts Safely Vaulted
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>0 Days</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Forgotten Expiries
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section id="features" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Why Thousands Choose WarrantyVault
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '0.5rem' }}>
            Built with modern technology for lightning-fast item lookup, automated countdowns, and document backups.
          </p>
        </div>

        <div className="wv-features-grid">
          <div className="wv-feature-card">
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <FileCheck size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.6rem' }}>
              Receipt & Card Storage
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Attach photos, invoices, and certificates to any product. Never hunt through drawer piles when asking for a repair.
            </p>
          </div>

          <div className="wv-feature-card">
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--status-expiring-bg)',
                color: 'var(--accent-amber)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <BellRing size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.6rem' }}>
              Automated Expiry Alerts
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Receive proactive reminders before your free coverage lapses. File a free repair or request extended plans easily.
            </p>
          </div>

          <div className="wv-feature-card">
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--status-active-bg)',
                color: 'var(--accent-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <FolderArchive size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.6rem' }}>
              Service & Repair History
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Log all service center visits, component replacements, costs, and technician notes with full audit trails.
            </p>
          </div>

          <div className="wv-feature-card">
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(6, 182, 212, 0.1)',
                color: 'var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <BarChart size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.6rem' }}>
              Expenditure Analytics
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Analyze your asset values, category distributions, in-warranty ratios, and projected warranty renewals.
            </p>
          </div>

          <div className="wv-feature-card">
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(244, 63, 94, 0.1)',
                color: 'var(--accent-rose)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <Lock size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.6rem' }}>
              Role-Based Admin Portal
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              SuperAdmin controls to oversee organization catalogs, manage users, customize category templates, and export reports.
            </p>
          </div>

          <div className="wv-feature-card">
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <Sparkles size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.6rem' }}>
              Real-time Local & Cloud Sync
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Immediate offline-ready updates with zero data loss. Instantaneous table searching and live reactive filtering.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Value Calculator Widget */}
      <section id="calculator" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Interactive Value Calculator
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--text-primary)' }}>
            See How Much WarrantyVault Can Save You
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '2.5rem' }}>
            Most households waste over 20% of their tech and appliance investments because of missed warranty claims.
          </p>

          <div
            style={{
              background: 'var(--bg-canvas)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              padding: '2.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2.5rem',
              textAlign: 'left',
              alignItems: 'center',
            }}
          >
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Approximate Total Value of Your Gadgets & Appliances: <strong>${calcCost}</strong>
              </label>
              <input
                type="range"
                min="300"
                max="10000"
                step="100"
                value={calcCost}
                onChange={(e) => setCalcCost(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '0.3rem' }}>
                <span>$300</span>
                <span>$5,000</span>
                <span>$10,000+</span>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  Average Warranty Horizon: <strong>{calcYears} Years</strong>
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[1, 2, 3, 5].map((yr) => (
                    <button
                      key={yr}
                      onClick={() => setCalcYears(yr)}
                      className={`wv-btn wv-btn-sm ${calcYears === yr ? 'wv-btn-primary' : 'wv-btn-secondary'}`}
                    >
                      {yr} {yr === 1 ? 'Year' : 'Years'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'var(--primary-gradient)',
                color: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                textAlign: 'center',
                boxShadow: 'var(--shadow-glow)',
              }}
            >
              <span style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.9 }}>
                ESTIMATED WARRANTY VALUE RECOVERED
              </span>
              <div style={{ fontSize: '3rem', fontWeight: 800, margin: '0.5rem 0' }}>
                ${savedAnnual}
              </div>
              <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                By timely claiming manufacturer repairs and avoiding unnecessary out-of-pocket replacements.
              </p>
              <button
                onClick={() => navigate('dashboard')}
                className="wv-btn wv-btn-secondary"
                style={{ marginTop: '1.25rem', width: '100%', background: '#ffffff', color: 'var(--primary)' }}
              >
                Start Vaulting Today Free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faqs" style={{ maxWidth: '840px', margin: '0 auto', padding: '5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Everything you need to know about WarrantyVault.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                transition: 'var(--transition)',
              }}
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                style={{
                  width: '100%',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: 'var(--text-primary)',
                }}
              >
                <span>{faq.q}</span>
                <ChevronRight
                  size={18}
                  style={{
                    transform: activeFaq === idx ? 'rotate(90deg)' : 'none',
                    transition: 'var(--transition)',
                    color: 'var(--text-tertiary)',
                  }}
                />
              </button>
              {activeFaq === idx && (
                <div
                  style={{
                    padding: '0 1.5rem 1.25rem',
                    color: 'var(--text-secondary)',
                    fontSize: '0.94rem',
                    lineHeight: 1.6,
                  }}
                >
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          marginTop: 'auto',
          background: 'var(--bg-sidebar)',
          color: '#94a3b8',
          padding: '3rem 2rem 2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="wv-brand-icon" style={{ width: '32px', height: '32px' }}>
              <Shield size={18} />
            </div>
            <strong style={{ color: '#ffffff', fontSize: '1.1rem' }}>WarrantyVault</strong>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>• React 19 Frontend</span>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.88rem' }}>
            <button
              onClick={() => navigate('dashboard')}
              style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}
            >
              User Portal
            </button>
            <button
              onClick={() => navigate('admin-dashboard')}
              style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}
            >
              Admin Portal
            </button>
            <button
              onClick={() => navigate('login')}
              style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}
            >
              Sign In
            </button>
          </div>
        </div>

        <div
          style={{
            maxWidth: '1200px',
            margin: '2rem auto 0',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            fontSize: '0.82rem',
            textAlign: 'center',
            color: '#64748b',
          }}
        >
          &copy; 2026 WarrantyVault. Designed and crafted for modern digital asset & warranty management.
        </div>
      </footer>
    </div>
  );
}
