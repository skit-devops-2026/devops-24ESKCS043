import React, { useState } from 'react';
import { useVault } from '../context/VaultContext';
import {
  Users,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  Shield,
  Trash2,
  Lock,
} from 'lucide-react';
import Modal from '../components/Modal';

export default function AdminUsersView() {
  const { users, toggleUserStatus, createUserAccount, deleteUserAccount, currentUser, notify } = useVault();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const q = search.toLowerCase();
  const filteredUsers = users.filter((u) => (
    (u.name || '').toLowerCase().includes(q) ||
    (u.email || '').toLowerCase().includes(q) ||
    (u.role || '').toLowerCase().includes(q)
  ));

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      notify('Please provide name and email.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      notify('Temporary password must be at least 6 characters.', 'error');
      return;
    }
    const ok = await createUserAccount({ name: newName.trim(), email: newEmail.trim(), password: newPassword });
    if (!ok) return;
    setShowAddModal(false);
    setNewName('');
    setNewEmail('');
    setNewPassword('');
  };

  const formatJoined = (iso) => (iso ? new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—');

  return (
    <div className="wv-content">
      {/* Header */}
      <div className="wv-page-header">
        <div>
          <h1 className="wv-page-title">User Account Management</h1>
          <p className="wv-page-subtitle">
            Manage system access, assign administrative privileges, and monitor registered vaults.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="wv-btn wv-btn-primary"
        >
          <Plus size={18} />
          <span>Add New Account</span>
        </button>
      </div>

      {/* Toolbar */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem 1.25rem',
          marginBottom: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ position: 'relative', width: '280px' }}>
          <input
            type="text"
            placeholder="Search by name, email, role..."
            className="wv-input"
            style={{ paddingLeft: '2.2rem', fontSize: '0.88rem' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search
            size={16}
            color="var(--text-tertiary)"
            style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }}
          />
        </div>

        <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
          Showing {filteredUsers.length} accounts
        </span>
      </div>

      {/* Users Table */}
      <div className="wv-card">
        <div className="wv-table-wrapper">
          <table className="wv-table">
            <thead>
              <tr>
                <th>Account Holder</th>
                <th>Role</th>
                <th>Documents</th>
                <th>Status</th>
                <th>Items Vaulted</th>
                <th>Member Since</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <strong style={{ color: 'var(--text-primary)', display: 'block' }}>{user.name}</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>{user.email}</span>
                    </td>
                    <td>
                      <span className={`wv-badge ${user.role === 'Admin' ? 'wv-badge-expiring' : 'wv-badge-active'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <strong>{user.documentsCount || 0}</strong>
                    </td>
                    <td>
                      <span className={`wv-badge ${user.status === 'Active' ? 'wv-badge-active' : 'wv-badge-expired'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <strong>{user.productsCount || 0}</strong>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                        {formatJoined(user.joinedDate)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {user.id === currentUser.id ? (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>You</span>
                      ) : (
                        <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                          <button
                            onClick={() => toggleUserStatus(user.id)}
                            className={`wv-btn wv-btn-sm ${user.status === 'Active' ? 'wv-btn-danger' : 'wv-btn-secondary'}`}
                            style={{ fontSize: '0.78rem' }}
                          >
                            {user.status === 'Active' ? 'Suspend' : 'Activate'}
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete ${user.name}'s account and ALL their products and documents? This cannot be undone.`)) {
                                deleteUserAccount(user.id);
                              }
                            }}
                            className="wv-btn wv-btn-danger wv-btn-sm"
                            title="Delete account"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Create User Account"
        maxWidth="480px"
      >
        <form onSubmit={handleAddUser}>
          <div className="wv-form-group">
            <label className="wv-form-label">Full Name</label>
            <input
              type="text"
              required
              className="wv-input"
              placeholder="e.g. Alex Rivera"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>

          <div className="wv-form-group">
            <label className="wv-form-label">Email Address</label>
            <input
              type="email"
              required
              className="wv-input"
              placeholder="alex@example.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </div>

          <div className="wv-form-group">
            <label className="wv-form-label">Temporary Password</label>
            <input
              type="text"
              required
              minLength={6}
              className="wv-input"
              placeholder="At least 6 characters — share it with the user"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginTop: '0.3rem', display: 'block' }}>
              New accounts are always standard users. They can change this password from their Settings page.
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="wv-btn wv-btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="wv-btn wv-btn-primary">
              Create Account
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
