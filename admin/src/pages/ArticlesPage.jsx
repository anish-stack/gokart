import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} from '../api/articles';

import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import RichTextEditor from '../components/RichTextEditor';

/* =========================================================
   LANGUAGES
========================================================= */

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'mr', label: 'मराठी' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'te', label: 'తెలుగు' },
];

/* =========================================================
   EMPTY FORM
========================================================= */

const EMPTY_FORM = {
  title: { en: '', hi: '', mr: '', bn: '', kn: '', te: '' },
  summary: { en: '', hi: '', mr: '', bn: '', kn: '', te: '' },
  body: { en: '', hi: '', mr: '', bn: '', kn: '', te: '' },
  imageFile: null,
  coverImage: '',
  author: 'GO! Track Express',
  tags: '',
  sortOrder: 0,
  isPublished: true,
};

/* =========================================================
   CONVERT FORM TO FORMDATA
========================================================= */

function toFormData(form) {
  const formData = new FormData();

  formData.append('title', JSON.stringify(form.title));
  formData.append('summary', JSON.stringify(form.summary));
  formData.append('body', JSON.stringify(form.body));

  formData.append('author', form.author || 'GO! Track Express');
  formData.append('sortOrder', String(form.sortOrder ?? 0));
  formData.append('isPublished', String(Boolean(form.isPublished)));

  const parsedTags = String(form.tags || '')
    .split(',')
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);

  formData.append('tags', JSON.stringify(parsedTags));

  if (form.imageFile) {
    formData.append('image', form.imageFile);
  }

  return formData;
}

/* =========================================================
   NORMALIZE TRANSLATED DATA
========================================================= */

function normalizeTranslations(value) {
  if (!value) {
    return { en: '', hi: '', mr: '', bn: '', kn: '', te: '' };
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return {
        en: parsed?.en || '',
        hi: parsed?.hi || '',
        mr: parsed?.mr || '',
        bn: parsed?.bn || '',
        kn: parsed?.kn || '',
        te: parsed?.te || '',
      };
    } catch (error) {
      return { en: value, hi: '', mr: '', bn: '', kn: '', te: '' };
    }
  }

  return {
    en: value.en || '',
    hi: value.hi || '',
    mr: value.mr || '',
    bn: value.bn || '',
    kn: value.kn || '',
    te: value.te || '',
  };
}

/* =========================================================
   COMPONENT
========================================================= */

export default function ArticlesPage() {
  const queryClient = useQueryClient();

  const { data: articles, isLoading } = useQuery({
    queryKey: ['articles-admin'],
    queryFn: getArticles,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [activeLanguage, setActiveLanguage] = useState('en');
  const [error, setError] = useState('');

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['articles-admin'] });
  };

  const createMut = useMutation({
    mutationFn: (formData) => createArticle(formData),
    onSuccess: () => {
      invalidate();
      closeModal();
    },
    onError: (err) => {
      setError(err?.response?.data?.message || 'Failed to create article');
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, payload }) => updateArticle(id, payload),
    onSuccess: () => {
      invalidate();
      closeModal();
    },
    onError: (err) => {
      setError(err?.response?.data?.message || 'Failed to update article');
    },
  });

  const deleteMut = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => invalidate(),
    onError: (err) => {
      alert(err?.response?.data?.message || 'Failed to delete article');
    },
  });

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setActiveLanguage('en');
    setError('');
    setModalOpen(true);
  }

  function openEdit(article) {
    setEditing(article);
    setForm({
      title: normalizeTranslations(article.title),
      summary: normalizeTranslations(article.summary),
      body: normalizeTranslations(article.body),
      imageFile: null,
      coverImage: article.coverImage || '',
      author: article.author || 'GO! Track Express',
      tags: Array.isArray(article.tags) ? article.tags.join(', ') : '',
      sortOrder: article.sortOrder ?? 0,
      isPublished: article.isPublished ?? true,
    });
    setActiveLanguage('en');
    setError('');
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setError('');
  }

  function updateTranslation(field, language, value) {
    setForm((prev) => ({
      ...prev,
      [field]: { ...prev[field], [language]: value },
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.title.en.trim()) {
      setError('English title is required.');
      setActiveLanguage('en');
      return;
    }

    if (!form.body.en.trim()) {
      setError('English body is required.');
      setActiveLanguage('en');
      return;
    }

    const payload = toFormData(form);

    if (editing) {
      updateMut.mutate({ id: editing._id, payload });
    } else {
      createMut.mutate(payload);
    }
  }

  if (isLoading) {
    return (
      <div>
        <div className="page-header">
          <h2>Articles</h2>
          <button className="btn" type="button" onClick={openCreate}>+ Add Article</button>
        </div>
        <div className="card">
          <div className="empty-state">Loading...</div>
        </div>
      </div>
    );
  }

  const currentLanguage = LANGUAGES.find((l) => l.code === activeLanguage);
  
  // Determine preview source URL (Local file object takes precedence over existing server cover image)
  const previewImageSource = form.imageFile 
    ? URL.createObjectURL(form.imageFile) 
    : form.coverImage;

  return (
    <div>
      <div className="page-header">
        <h2>Articles</h2>
        <button className="btn" onClick={openCreate} type="button">+ Add Article</button>
      </div>

      <div className="card">
        {!articles?.length ? (
          <div className="empty-state">No articles yet. Add your first one.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Tags</th>
                <th>Sort</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article._id}>
                  <td>{article.title?.en || 'Untitled'}</td>
                  <td>{article.author || 'GO! Track Express'}</td>
                  <td>{(article.tags || []).join(', ')}</td>
                  <td>{article.sortOrder}</td>
                  <td><StatusBadge active={article.isPublished} /></td>
                  <td className="actions-cell">
                    <button className="icon-btn" type="button" onClick={() => openEdit(article)}>Edit</button>
                    <button
                      className="icon-btn"
                      type="button"
                      disabled={deleteMut.isPending}
                      onClick={() => {
                        if (window.confirm('Delete this article?')) {
                          deleteMut.mutate(article._id);
                        }
                      }}
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
        <Modal title={editing ? 'Edit Article' : 'Add Article'} onClose={closeModal} wide>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            
            {/* Language Tabs */}
            <div className="language-tabs">
              {LANGUAGES.map((language) => {
                const hasTitle = form.title?.[language.code]?.trim();
                const hasBody = form.body?.[language.code]?.trim();
                const hasContent = hasTitle || hasBody;

                return (
                  <button
                    key={language.code}
                    type="button"
                    className={activeLanguage === language.code ? 'language-tab active' : 'language-tab'}
                    onClick={() => setActiveLanguage(language.code)}
                  >
                    {language.label}
                    {language.code !== 'en' && hasContent && (
                      <span style={{ marginLeft: 5 }}>✓</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div style={{ background: '#f5f7fa', border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 12px', marginBottom: 20, fontSize: 13, color: '#4b5563' }}>
              Editing content in <strong>{currentLanguage?.label}</strong>
              {activeLanguage === 'en' && <span> — English title and body are required.</span>}
            </div>

            {/* Title */}
            <div className="form-group">
              <label>Title ({currentLanguage?.label})</label>
              <input
                value={form.title?.[activeLanguage] || ''}
                onChange={(e) => updateTranslation('title', activeLanguage, e.target.value)}
                required={activeLanguage === 'en'}
                placeholder={`Enter title in ${currentLanguage?.label}`}
              />
            </div>

            {/* Summary */}
            <div className="form-group">
              <label>Summary ({currentLanguage?.label})</label>
              <textarea
                rows={3}
                value={form.summary?.[activeLanguage] || ''}
                onChange={(e) => updateTranslation('summary', activeLanguage, e.target.value)}
                placeholder={`Enter summary in ${currentLanguage?.label}`}
              />
            </div>

            {/* Body */}
            <div className="form-group">
              <label>Body ({currentLanguage?.label}) — HTML content</label>
              <RichTextEditor
                key={activeLanguage}
                value={form.body?.[activeLanguage] || ''}
                onChange={(html) => updateTranslation('body', activeLanguage, html)}
                placeholder={`Write or paste article content in ${currentLanguage?.label}...`}
              />
            </div>

            {/* Cover Image Upload & Preview Section */}
            <div className="form-group">
              <label>Cover Image</label>
              
              {/* Preview Box */}
              {previewImageSource ? (
                <div style={{ position: 'relative', width: '100%', height: 160, marginBottom: 12, borderRadius: 8, overflow: 'hidden', border: '1px solid #ddd', background: '#f9f9f9' }}>
                  <img 
                    src={previewImageSource} 
                    alt="Cover Preview" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, imageFile: null, coverImage: '' }))}
                    style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px', fontSize: 11, cursor: 'pointer' }}
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div style={{ width: '100%', height: 80, marginBottom: 12, borderRadius: 8, border: '2px dashed #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: 13, background: '#fafafa' }}>
                  No image selected
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setForm((prev) => ({ ...prev, imageFile: file }));
                }}
              />
            </div>

            {/* Author & Sort Order */}
            <div className="form-row">
              <div className="form-group">
                <label>Author</label>
                <input
                  value={form.author}
                  onChange={(e) => setForm((prev) => ({ ...prev, author: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label>Sort Order</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm((prev) => ({ ...prev, sortOrder: Number(e.target.value) }))}
                />
              </div>
            </div>

            {/* Tags */}
            <div className="form-group">
              <label>Tags (comma-separated)</label>
              <input
                value={form.tags}
                onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
                placeholder="logistics, tips, shipment, tracking"
              />
            </div>

            {/* Published Checkbox */}
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setForm((prev) => ({ ...prev, isPublished: e.target.checked }))}
                  style={{ width: 'auto', marginRight: 8 }}
                />
                Published (visible in app)
              </label>
            </div>

            {error && <div className="error-text" style={{ marginTop: 10, marginBottom: 10 }}>{error}</div>}

            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button className="btn" type="submit" disabled={createMut.isPending || updateMut.isPending}>
                {createMut.isPending || updateMut.isPending ? 'Saving...' : 'Save'}
              </button>
              <button className="btn secondary" type="button" onClick={closeModal} disabled={createMut.isPending || updateMut.isPending}>
                Cancel
              </button>
            </div>

          </form>
        </Modal>
      )}
    </div>
  );
}