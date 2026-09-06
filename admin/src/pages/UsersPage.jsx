import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUsers, createUser, updateUser } from '../api/users';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';

const ROLES = ['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER', 'SUPPORT'];

const EMPTY_FORM = { name: '', email: '', password: '', role: 'SUPPORT', isActive: true };

export default function UsersPage() {
  const queryClient = useQueryClient();
  const { data: users, isLoading } = useQuery({ queryKey: ['users-admin'], queryFn: getUsers });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['users-admin'] });

  const createMut = useMutation({ mutationFn: createUser, onSuccess: () => { invalidate(); closeModal(); } });
  const updateMut = useMutation({
    mutationFn: ({ id, payload }) => updateUser(id, payload),
    onSuccess: () => { invalidate(); closeModal(); },
  });

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError('');
    setModalOpen(true);
  }

  function openEdit(user) {
    setEditing(user);
    setForm({ name: user.name, email: user.email, password: '', role: user.role, isActive: user.isActive });
    setError('');
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (editing) {
      const payload = { name: form.name, role: form.role, isActive: form.isActive };
      if (form.password) payload.password = form.password;
      updateMut.mutate({ id: editing.id, payload }, {
        onError: (err) => setError(err.response?.data?.message || 'Failed to update user'),
      });
    } else {
      createMut.mutate(form, {
        onError: (err) => setError(err.response?.data?.message || 'Failed to create user'),
      });
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Admin Users</h2>
        <button className="btn" onClick={openCreate} type="button">+ Add Admin User</button>
      </div>
      <p style={{ color: 'var(--go-muted)', fontSize: 14, marginTop: -12 }}>
        Roles: SUPER_ADMIN (full access), ADMIN (manage content and config), CONTENT_MANAGER (services/products/CMS only), SUPPORT (contact submissions and read-only views).
      </p>

      <div className="card">
        {isLoading ? (
          <div className="empty-state">Loading...</div>
        ) : !users?.length ? (
          <div className="empty-state">No admin users yet.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className="badge status">{u.role}</span></td>
                  <td><StatusBadge active={u.isActive} /></td>
                  <td>{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : 'Never'}</td>
                  <td className="actions-cell">
                    <button className="icon-btn" onClick={() => openEdit(u)} type="button">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit Admin User' : 'Add Admin User'} onClose={closeModal}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                disabled={!!editing}
                required
              />
            </div>
            <div className="form-group">
              <label>{editing ? 'New Password (leave blank to keep current)' : 'Password'}</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required={!editing}
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            {editing && (
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    style={{ width: 'auto', marginRight: 8 }}
                  />
                  Active
                </label>
              </div>
            )}
            {error && <div className="error-text">{error}</div>}
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button className="btn" type="submit" disabled={createMut.isPending || updateMut.isPending}>Save</button>
              <button className="btn secondary" type="button" onClick={closeModal}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
