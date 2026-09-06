import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCmsPages, upsertCmsPage, toggleCmsPage } from '../api/cms';
import StatusBadge from '../components/StatusBadge';

const SLUG_LABELS = {
  'about-us': 'About Us',
  'privacy-policy': 'Privacy Policy',
  terms: 'Terms & Conditions',
  legal: 'Legal Information',
  faq: 'FAQ',
};

export default function CmsPage() {
  const queryClient = useQueryClient();
  const { data: pages, isLoading } = useQuery({ queryKey: ['cms-admin'], queryFn: getCmsPages });
  const [activeSlug, setActiveSlug] = useState('about-us');
  const [form, setForm] = useState({ title: { en: '' }, body: { en: '' } });
  const [saved, setSaved] = useState(false);

  const activePage = pages?.find((p) => p.slug === activeSlug);

  useEffect(() => {
    if (activePage) {
      setForm({ title: activePage.title || { en: '' }, body: activePage.body || { en: '' } });
    } else {
      setForm({ title: { en: '' }, body: { en: '' } });
    }
    setSaved(false);
  }, [activeSlug, pages]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['cms-admin'] });

  const saveMut = useMutation({
    mutationFn: () => upsertCmsPage(activeSlug, form),
    onSuccess: () => { invalidate(); setSaved(true); },
  });

  const toggleMut = useMutation({
    mutationFn: (isEnabled) => toggleCmsPage(activeSlug, isEnabled),
    onSuccess: invalidate,
  });

  return (
    <div>
      <div className="page-header">
        <h2>CMS Pages</h2>
      </div>

      <div className="tabs">
        {Object.entries(SLUG_LABELS).map(([slug, label]) => (
          <button
            key={slug}
            type="button"
            className={activeSlug === slug ? 'active' : ''}
            onClick={() => setActiveSlug(slug)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="card">
        {isLoading ? (
          <div className="empty-state">Loading...</div>
        ) : (
          <>
            <div className="page-header">
              <div>
                <StatusBadge active={activePage?.isEnabled ?? true} />
              </div>
              <button
                className="btn secondary"
                type="button"
                onClick={() => toggleMut.mutate(!(activePage?.isEnabled ?? true))}
              >
                {activePage?.isEnabled === false ? 'Enable page' : 'Disable page'}
              </button>
            </div>
            <div className="form-group">
              <label>Title (English)</label>
              <input
                value={form.title.en}
                onChange={(e) => setForm({ ...form, title: { ...form.title, en: e.target.value } })}
              />
            </div>
            <div className="form-group">
              <label>Body (English)</label>
              <textarea
                rows={14}
                value={form.body.en}
                onChange={(e) => setForm({ ...form, body: { ...form.body, en: e.target.value } })}
              />
            </div>
            <p style={{ fontSize: 13, color: 'var(--go-muted)' }}>
              Other languages (hi/mr/bn/kn/te) can be filled in via the API for full localization;
              this console currently edits the English (default) copy shown as fallback.
            </p>
            <button className="btn" type="button" onClick={() => saveMut.mutate()} disabled={saveMut.isPending}>
              Save changes
            </button>
            {saved && <span style={{ marginLeft: 12, color: 'var(--go-success)', fontSize: 14 }}>Saved.</span>}
          </>
        )}
      </div>
    </div>
  );
}
