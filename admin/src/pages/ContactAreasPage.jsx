import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getContactAreas, createContactArea, updateContactArea, deleteContactArea } from '../api/contactAreas';
import Modal from '../components/Modal';

const EMPTY_FORM = {
  matchType: 'pincode',
  pincode: '',
  pincodeRangeStart: '',
  pincodeRangeEnd: '',
  city: '',
  state: '',
  country: 'India',
  contactName: '',
  phone: '',
  email: '',
  whatsapp: '',
  address: '',
  workingHours: '',
  priority: 0,
  isActive: true,
};

export default function ContactAreasPage() {
  const queryClient = useQueryClient();
  const { data: areas, isLoading } = useQuery({ queryKey: ['contact-areas-admin'], queryFn: getContactAreas });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['contact-areas-admin'] });
  const createMut = useMutation({ mutationFn: createContactArea, onSuccess: () => { invalidate(); closeModal(); } });
  const updateMut = useMutation({
    mutationFn: ({ id, payload }) => updateContactArea(id, payload),
    onSuccess: () => { invalidate(); closeModal(); },
  });
  const deleteMut = useMutation({ mutationFn: deleteContactArea, onSuccess: invalidate });

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError('');
    setModalOpen(true);
  }

  function openEdit(area) {
    setEditing(area);
    setForm({ ...EMPTY_FORM, ...area });
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
      onError: (err) => setError(err.response?.data?.message || 'Failed to save contact area'),
    });
  }

  return (
    <div>
      <div className="page-header">
        <h2>Contact Areas</h2>
        <button className="btn" onClick={openCreate} type="button">+ Add Contact Area</button>
      </div>
      <p style={{ color: 'var(--go-muted)', fontSize: 14, marginTop: -12 }}>
        Priority when resolving support contact by pincode: exact pincode → pincode range → city → state → country → default.
      </p>

      <div className="card">
        {isLoading ? (
          <div className="empty-state">Loading...</div>
        ) : !areas?.length ? (
          <div className="empty-state">No contact areas configured yet.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Match</th>
                <th>Region</th>
                <th>Contact</th>
                <th>Phone</th>
                <th>Priority</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {areas.map((a) => (
                <tr key={a._id}>
                  <td><span className="badge status">{a.matchType}</span></td>
                  <td>{a.pincode || a.city || a.state || a.country || '—'}</td>
                  <td>{a.contactName}</td>
                  <td>{a.phone}</td>
                  <td>{a.priority}</td>
                  <td className="actions-cell">
                    <button className="icon-btn" onClick={() => openEdit(a)} type="button">Edit</button>
                    <button
                      className="icon-btn"
                      type="button"
                      onClick={() => window.confirm('Delete this contact area?') && deleteMut.mutate(a._id)}
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
        <Modal title={editing ? 'Edit Contact Area' : 'Add Contact Area'} onClose={closeModal}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Match Type</label>
              <select value={form.matchType} onChange={(e) => setForm({ ...form, matchType: e.target.value })}>
                <option value="pincode">Exact pincode</option>
                <option value="pincode_range">Pincode range</option>
                <option value="city">City</option>
                <option value="state">State</option>
                <option value="country">Country</option>
                <option value="default">Default (fallback)</option>
              </select>
            </div>

            {form.matchType === 'pincode' && (
              <div className="form-group">
                <label>Pincode</label>
                <input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} required />
              </div>
            )}

            {form.matchType === 'pincode_range' && (
              <div className="form-row">
                <div className="form-group">
                  <label>Range Start</label>
                  <input value={form.pincodeRangeStart} onChange={(e) => setForm({ ...form, pincodeRangeStart: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Range End</label>
                  <input value={form.pincodeRangeEnd} onChange={(e) => setForm({ ...form, pincodeRangeEnd: e.target.value })} required />
                </div>
              </div>
            )}

            {form.matchType === 'city' && (
              <div className="form-group">
                <label>City</label>
                <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
              </div>
            )}

            {form.matchType === 'state' && (
              <div className="form-group">
                <label>State</label>
                <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required />
              </div>
            )}

            {form.matchType === 'country' && (
              <div className="form-group">
                <label>Country</label>
                <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} required />
              </div>
            )}

            <div className="form-group">
              <label>Contact Name</label>
              <input value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label>WhatsApp</label>
                <input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>Email</label>
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Working Hours</label>
                <input value={form.workingHours} onChange={(e) => setForm({ ...form, workingHours: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <input type="number" value={form.priority} onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })} />
              </div>
            </div>
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
