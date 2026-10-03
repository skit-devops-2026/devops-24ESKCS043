import React, { useState } from 'react';
import { useVault } from '../context/VaultContext';
import { Shield, Lock, Mail, ArrowRight, UserCheck, ShieldAlert, Sparkles } from 'lucide-react';
import Modal from '../components/Modal';

export default function LoginView() {
  const { login, navigate, notify } = useVault();
  const [email, setEmail] = useState('john@warrantyvault.io');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      notify('Please enter your email address.', 'error');
      return;
    }
    const role = email.toLowerCase().includes('admin') ? 'Admin' : 'User';
    login(email, role);
  };

  const handleDemoLogin = (role) => {
    if (role === 'Admin') {
      setEmail('admin@warrantyvault.io');
      setPassword('adminsecret');
      login('admin@warrantyvault.io', 'Admin');
    } else {
      setEmail('john@warrantyvault.io');
      setPassword('password123');
      login('john@warrantyvault.io', 'User');
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      notify('Please enter your registered email address.', 'error');
      return;
    }
    notify(`Password recovery instructions dispatched to ${forgotEmail}.`, 'success');
    setShowForgotModal(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'var(--bg-canvas)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            onClick={() => navigate('landing')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '52px',
              height: '52px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary-gradient)',
              color: '#ffffff',
              boxShadow: 'var(--shadow-glow)',
              cursor: 'pointer',
              marginBottom: '1rem',
            }}
          >
            <Shield size={28} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Welcome Back
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.35rem' }}>
            Access your secure personal warranty vault
          </p>
        </div>

        {/* 1-Click Quick Demo Login Pill Bar */}
        <div
          style={{
            background: 'var(--bg-canvas)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
            <Sparkles size={14} />
            <span>ONE-CLICK DEMO ACCESS</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleDemoLogin('User')}
              className="wv-btn wv-btn-secondary wv-btn-sm"
              style={{ fontSize: '0.82rem' }}
            >
              <UserCheck size={14} />
              <span>User Demo</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('Admin')}
              className="wv-btn wv-btn-secondary wv-btn-sm"
              style={{ fontSize: '0.82rem' }}
            >
              <ShieldAlert size={14} />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="wv-form-group">
            <label className="wv-form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                className="wv-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail
                size={18}
                color="var(--text-tertiary)"
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <div className="wv-form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label className="wv-form-label" style={{ marginBottom: 0 }}>Password</label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 600 }}
              >
                Forgot password?
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                className="wv-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock
                size={18}
                color="var(--text-tertiary)"
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
            <label htmlFor="remember" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              Keep me signed in on this computer
            </label>
          </div>

          <button
            type="submit"
            className="wv-btn wv-btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
          >
            <span>Sign In to Vault</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Don't have an account yet?{' '}
          <button
            type="button"
            onClick={() => navigate('register')}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
          >
            Create Free Account
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <button
            type="button"
            onClick={() => navigate('landing')}
            style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', fontSize: '0.82rem', cursor: 'pointer' }}
          >
            ← Return to Homepage
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Reset Password"
        maxWidth="450px"
      >
        <form onSubmit={handleForgotSubmit}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Enter your email address and we'll send a secure password reset link to your inbox.
          </p>
          <div className="wv-form-group">
            <label className="wv-form-label">Registered Email</label>
            <input
              type="email"
              required
              className="wv-input"
              placeholder="name@domain.com"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="wv-btn wv-btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="wv-btn wv-btn-primary">
              Send Instructions
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
