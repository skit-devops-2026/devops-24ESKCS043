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
  const { users, toggleUserStatus, updateUserRole, notify } = useVault();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('User');
  const [newPlan, setNewPlan] = useState('Premium Plan');

  const filteredUsers = users.filter((u) => {
    return (
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      notify('Please provide name and email.', 'error');
      return;
    }

    notify(`User "${newName}" registered to platform.`, 'success');
    setShowAddModal(false);
    setNewName('');
    setNewEmail('');
  };

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
                <th>Subscription Plan</th>
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
                      <select
                        className="wv-select"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.82rem', width: 'auto' }}
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                      >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.86rem' }}>{user.plan || 'Standard'}</span>
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
                        {user.joinedDate}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`wv-btn wv-btn-sm ${user.status === 'Active' ? 'wv-btn-danger' : 'wv-btn-secondary'}`}
                        style={{ fontSize: '0.78rem' }}
                      >
                        {user.status === 'Active' ? 'Suspend' : 'Activate'}
                      </button>
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
        title="Create System User Account"
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="wv-form-group">
              <label className="wv-form-label">System Role</label>
              <select
                className="wv-select"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              >
                <option value="User">Standard User</option>
                <option value="Admin">Administrator</option>
              </select>
            </div>

            <div className="wv-form-group">
              <label className="wv-form-label">Plan</label>
              <select
                className="wv-select"
                value={newPlan}
                onChange={(e) => setNewPlan(e.target.value)}
              >
                <option value="Free Tier">Free Tier</option>
                <option value="Premium Plan">Premium Plan</option>
                <option value="Business Plus">Business Plus</option>
              </select>
            </div>
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
