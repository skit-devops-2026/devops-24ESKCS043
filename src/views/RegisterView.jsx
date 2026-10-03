import React, { useState } from 'react';
import { useVault } from '../context/VaultContext';
import { Shield, Lock, Mail, User, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function RegisterView() {
  const { navigate, notify, login } = useVault();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Compute password strength
  const getPasswordStrength = () => {
    if (!password) return { score: 0, text: 'Empty', color: 'var(--border-subtle)' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { score: 1, text: 'Weak', color: 'var(--accent-rose)' };
    if (score <= 3) return { score: 2, text: 'Medium', color: 'var(--accent-amber)' };
    return { score: 3, text: 'Strong', color: 'var(--accent-emerald)' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      notify('Passwords do not match. Please verify.', 'error');
      return;
    }

    if (password.length < 6) {
      notify('Password should be at least 6 characters long.', 'error');
      return;
    }

    notify(`Account successfully created for ${fullName}!`, 'success');
    login(email, 'User');
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
          maxWidth: '500px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
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
            Create Your Vault
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.35rem' }}>
            Store receipts, track warranties, and claim on time.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="wv-form-group">
            <label className="wv-form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                className="wv-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <User
                size={18}
                color="var(--text-tertiary)"
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <div className="wv-form-group">
            <label className="wv-form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                className="wv-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="john@example.com"
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
            <label className="wv-form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                className="wv-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Choose a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock
                size={18}
                color="var(--text-tertiary)"
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '4px', height: '4px', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ flex: 1, background: strength.score >= 1 ? strength.color : 'var(--border-subtle)' }} />
                  <div style={{ flex: 1, background: strength.score >= 2 ? strength.color : 'var(--border-subtle)' }} />
                  <div style={{ flex: 1, background: strength.score >= 3 ? strength.color : 'var(--border-subtle)' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '0.25rem', color: 'var(--text-secondary)' }}>
                  <span>Strength: <strong style={{ color: strength.color }}>{strength.text}</strong></span>
                  <span>Use 8+ chars & mixed symbols</span>
                </div>
              </div>
            )}
          </div>

          <div className="wv-form-group">
            <label className="wv-form-label">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                className="wv-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              id="terms"
              required
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
            <label htmlFor="terms" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              I agree to the Terms of Service & Privacy Policy
            </label>
          </div>

          <button
            type="submit"
            className="wv-btn wv-btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
          >
            <span>Create Free Vault</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('login')}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
          >
            Sign In Here
          </button>
        </div>
      </div>
    </div>
  );
}
