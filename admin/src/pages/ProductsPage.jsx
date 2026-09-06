import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/products';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';

const EMPTY_FORM = {
  name: { en: '' },
  description: { en: '' },
  image: 'https://example.com/images/placeholder.jpg',
  price: 0,
  currency: 'INR',
  externalUrl: 'https://example.com',
  sortOrder: 0,
  isActive: true,
};

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const { data: products, isLoading } = useQuery({ queryKey: ['products-admin'], queryFn: getProducts });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['products-admin'] });

  const createMut = useMutation({ mutationFn: createProduct, onSuccess: () => { invalidate(); closeModal(); } });
  const updateMut = useMutation({
    mutationFn: ({ id, payload }) => updateProduct(id, payload),
    onSuccess: () => { invalidate(); closeModal(); },
  });
  const deleteMut = useMutation({ mutationFn: deleteProduct, onSuccess: invalidate });

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError('');
    setModalOpen(true);
  }

  function openEdit(product) {
    setEditing(product);
    setForm({
      name: product.name || { en: '' },
      description: product.description || { en: '' },
      image: product.image,
      price: product.price,
      currency: product.currency,
      externalUrl: product.externalUrl,
      sortOrder: product.sortOrder,
      isActive: product.isActive,
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
      onError: (err) => setError(err.response?.data?.message || 'Failed to save product'),
    });
  }

  return (
    <div>
      <div className="page-header">
        <h2>Products</h2>
        <button className="btn" onClick={openCreate} type="button">+ Add Product</button>
      </div>

      <div className="card">
        {isLoading ? (
          <div className="empty-state">Loading...</div>
        ) : !products?.length ? (
          <div className="empty-state">No products yet. Add your first one.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Sort</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>{p.name?.en}</td>
                  <td>{p.currency} {p.price}</td>
                  <td>{p.sortOrder}</td>
                  <td><StatusBadge active={p.isActive} /></td>
                  <td className="actions-cell">
                    <button className="icon-btn" onClick={() => openEdit(p)} type="button">Edit</button>
                    <button
                      className="icon-btn"
                      type="button"
                      onClick={() => window.confirm('Delete this product?') && deleteMut.mutate(p._id)}
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
        <Modal title={editing ? 'Edit Product' : 'Add Product'} onClose={closeModal}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name (English)</label>
              <input
                value={form.name.en}
                onChange={(e) => setForm({ ...form, name: { ...form.name, en: e.target.value } })}
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
              <label>Image URL</label>
              <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label>Currency</label>
                <input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>External URL</label>
                <input value={form.externalUrl} onChange={(e) => setForm({ ...form, externalUrl: e.target.value })} />
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
