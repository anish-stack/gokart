import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getServices, createService, updateService, deleteService } from '../api/services';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';

const EMPTY_FORM = {
  title: { en: '' },
  description: { en: '' },
  buttonText: { en: 'Learn more' },
  externalUrl: 'https://example.com',
  sortOrder: 0,
  isActive: true,
};

export default function ServicesPage() {
  const queryClient = useQueryClient();
  const { data: services, isLoading } = useQuery({ queryKey: ['services-admin'], queryFn: getServices });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['services-admin'] });

  const createMut = useMutation({ mutationFn: createService, onSuccess: () => { invalidate(); closeModal(); } });
  const updateMut = useMutation({
    mutationFn: ({ id, payload }) => updateService(id, payload),
    onSuccess: () => { invalidate(); closeModal(); },
  });
  const deleteMut = useMutation({ mutationFn: deleteService, onSuccess: invalidate });

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError('');
    setModalOpen(true);
  }

  function openEdit(service) {
    setEditing(service);
    setForm({
      title: service.title || { en: '' },
      description: service.description || { en: '' },
      buttonText: service.buttonText || { en: 'Learn more' },
      externalUrl: service.externalUrl,
      sortOrder: service.sortOrder,
      isActive: service.isActive,
    });
    setError('');
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const mutation = editing ? updateMut : createMut;
    const payload = editing ? { id: editing._id, payload: form } : form;
    mutation.mutate(payload, {
      onError: (err) => setError(err.response?.data?.message || 'Failed to save service'),
    });
  }

  return (
    <div>
      <div className="page-header">
        <h2>Services</h2>
        <button className="btn" onClick={openCreate} type="button">+ Add Service</button>
      </div>

      <div className="card">
        {isLoading ? (
          <div className="empty-state">Loading...</div>
        ) : !services?.length ? (
          <div className="empty-state">No services yet. Add your first one.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>External URL</th>
                <th>Sort</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s._id}>
                  <td>{s.title?.en}</td>
                  <td>{s.externalUrl}</td>
                  <td>{s.sortOrder}</td>
                  <td><StatusBadge active={s.isActive} /></td>
                  <td className="actions-cell">
                    <button className="icon-btn" onClick={() => openEdit(s)} type="button">Edit</button>
                    <button
                      className="icon-btn"
                      type="button"
                      onClick={() => window.confirm('Delete this service?') && deleteMut.mutate(s._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit Service' : 'Add Service'} onClose={closeModal}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title (English)</label>
              <input
                value={form.title.en}
                onChange={(e) => setForm({ ...form, title: { ...form.title, en: e.target.value } })}
                required
              />
            </div>
            <div className="form-group">
              <label>Description (English)</label>
              <textarea
                rows={3}
                value={form.description.en}
                onChange={(e) => setForm({ ...form, description: { ...form.description, en: e.target.value } })}
                required
              />
            </div>
            <div className="form-group">
              <label>Button Text (English)</label>
              <input
                value={form.buttonText.en}
                onChange={(e) => setForm({ ...form, buttonText: { ...form.buttonText, en: e.target.value } })}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>External URL</label>
                <input
                  value={form.externalUrl}
                  onChange={(e) => setForm({ ...form, externalUrl: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Sort Order</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  style={{ width: 'auto', marginRight: 8 }}
                />
                Active (visible in app)
              </label>
            </div>
            {error && <div className="error-text">{error}</div>}
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button className="btn" type="submit" disabled={createMut.isPending || updateMut.isPending}>
                Save
              </button>
              <button className="btn secondary" type="button" onClick={closeModal}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
