import React, { useState } from 'react';
import { useVault } from '../context/VaultContext';
import {
  Settings,
  User,
  Bell,
  Globe,
  Moon,
  Sun,
  Lock,
  RotateCcw,
  Save,
  CheckCircle2,
} from 'lucide-react';

export default function SettingsView() {
  const {
    settings,
    updateUserSettings,
    theme,
    toggleTheme,
    resetToDefaults,
    notify,
  } = useVault();

  const [fullName, setFullName] = useState(settings.fullName || 'John Doe');
  const [email, setEmail] = useState(settings.email || 'john@warrantyvault.io');
  const [phone, setPhone] = useState(settings.phone || '+1 (555) 382-9012');
  const [currency, setCurrency] = useState(settings.currency || 'USD');
  const [notify30, setNotify30] = useState(settings.notify30Days ?? true);
  const [notify15, setNotify15] = useState(settings.notify15Days ?? true);
  const [notify7, setNotify7] = useState(settings.notify7Days ?? true);
  const [emailDigest, setEmailDigest] = useState(settings.emailDigest ?? true);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUserSettings({
      fullName,
      email,
      phone,
      currency,
      notify30Days: notify30,
      notify15Days: notify15,
      notify7Days: notify7,
      emailDigest,
    });
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!currentPassword) {
      notify('Please enter your current password.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      notify('New passwords do not match.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      notify('Password should have at least 6 characters.', 'error');
      return;
    }
    notify('Password changed successfully!', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="wv-content" style={{ maxWidth: '900px' }}>
      {/* Page Header */}
      <div className="wv-page-header">
        <div>
          <h1 className="wv-page-title">User Settings & Preferences</h1>
          <p className="wv-page-subtitle">
            Configure your notifications, currencies, security, and theme preferences.
          </p>
        </div>
      </div>

      {/* Profile & Notifications Form */}
      <form onSubmit={handleSaveProfile}>
        {/* Profile Card */}
        <div className="wv-card">
          <div className="wv-card-header">
            <h3 className="wv-card-title">
              <User size={20} color="var(--primary)" />
              <span>Personal Profile</span>
            </h3>
          </div>
          <div className="wv-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              <div className="wv-form-group">
                <label className="wv-form-label">Full Name</label>
                <input
                  type="text"
                  required
                  className="wv-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="wv-form-group">
                <label className="wv-form-label">Email Address</label>
                <input
                  type="email"
                  required
                  className="wv-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="wv-form-group">
                <label className="wv-form-label">Phone Number</label>
                <input
                  type="tel"
                  className="wv-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="wv-form-group">
                <label className="wv-form-label">Default Currency</label>
                <select
                  className="wv-select"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="CAD">CAD ($)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications & Expiry Reminders */}
        <div className="wv-card">
          <div className="wv-card-header">
            <h3 className="wv-card-title">
              <Bell size={20} color="var(--accent-amber)" />
              <span>Warranty Expiry Notifications</span>
            </h3>
          </div>
          <div className="wv-card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={notify30}
                  onChange={(e) => setNotify30(e.target.checked)}
                  style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }}
                />
                <div>
                  <strong style={{ fontSize: '0.94rem', color: 'var(--text-primary)', display: 'block' }}>
                    30-Day Early Warning Email
                  </strong>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Dispatches a heads-up email one month before warranty expiration.
                  </span>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={notify15}
                  onChange={(e) => setNotify15(e.target.checked)}
                  style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }}
                />
                <div>
                  <strong style={{ fontSize: '0.94rem', color: 'var(--text-primary)', display: 'block' }}>
                    15-Day Mid Warning
                  </strong>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Sends a reminder to file pending repair issues.
                  </span>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={notify7}
                  onChange={(e) => setNotify7(e.target.checked)}
                  style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }}
                />
                <div>
                  <strong style={{ fontSize: '0.94rem', color: 'var(--text-primary)', display: 'block' }}>
                    7-Day Final Expiry Alert
                  </strong>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Urgent notice for last chance to request warranty repair.
                  </span>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={emailDigest}
                  onChange={(e) => setEmailDigest(e.target.checked)}
                  style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }}
                />
                <div>
                  <strong style={{ fontSize: '0.94rem', color: 'var(--text-primary)', display: 'block' }}>
                    Weekly Vault Status Digest
                  </strong>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Receive a compact Sunday report with overall asset health.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="wv-card">
          <div className="wv-card-header">
            <h3 className="wv-card-title">
              {theme === 'dark' ? <Moon size={20} color="var(--primary)" /> : <Sun size={20} color="var(--accent-amber)" />}
              <span>Interface Theme</span>
            </h3>
          </div>
          <div className="wv-card-body">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  Current Theme: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </strong>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Choose between high-contrast dark theme or clean white canvas.
                </p>
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                className="wv-btn wv-btn-secondary"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                <span>Switch to {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2.5rem' }}>
          <button
            type="submit"
            className="wv-btn wv-btn-primary"
            style={{ padding: '0.75rem 2rem' }}
          >
            <Save size={18} />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>

      {/* Password Change Card */}
      <div className="wv-card">
        <div className="wv-card-header">
          <h3 className="wv-card-title">
            <Lock size={20} color="var(--accent-rose)" />
            <span>Change Security Password</span>
          </h3>
        </div>
        <div className="wv-card-body">
          <form onSubmit={handlePasswordChange}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div className="wv-form-group">
                <label className="wv-form-label">Current Password</label>
                <input
                  type="password"
                  required
                  className="wv-input"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="wv-form-group">
                <label className="wv-form-label">New Password</label>
                <input
                  type="password"
                  required
                  className="wv-input"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="wv-form-group">
                <label className="wv-form-label">Confirm New Password</label>
                <input
                  type="password"
                  required
                  className="wv-input"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="submit" className="wv-btn wv-btn-secondary">
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Reset Demo Data Card */}
      <div
        style={{
          background: 'var(--status-expired-bg)',
          border: '1px solid var(--status-expired-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '3rem',
        }}
      >
        <div>
          <strong style={{ fontSize: '1rem', color: 'var(--accent-rose)' }}>
            Reset Demo Environment
          </strong>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Want to start over with pristine sample products, documents, and service logs?
          </p>
        </div>

        <button
          onClick={resetToDefaults}
          className="wv-btn wv-btn-danger"
        >
          <RotateCcw size={16} />
          <span>Reset All Mock Data</span>
        </button>
      </div>
    </div>
  );
}
