import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAppConfig, updateAppConfig } from '../api/appConfig';

export default function AppConfigPage() {
  const queryClient = useQueryClient();
  const { data: config, isLoading } = useQuery({ queryKey: ['app-config'], queryFn: getAppConfig });
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (config) setForm(config);
  }, [config]);

  const saveMut = useMutation({
    mutationFn: () => updateAppConfig(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-config'] });
      setSaved(true);
    },
  });

  if (isLoading || !form) return <div className="empty-state">Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h2>App Config</h2>
      </div>

      <div className="card">
        <div className="form-row">
          <div className="form-group">
            <label>App Name</label>
            <input value={form.appName} onChange={(e) => setForm({ ...form, appName: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Logo URL</label>
            <input value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Support Phone</label>
            <input value={form.supportPhone} onChange={(e) => setForm({ ...form, supportPhone: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Support Email</label>
            <input value={form.supportEmail} onChange={(e) => setForm({ ...form, supportEmail: e.target.value })} />
          </div>
        </div>
        <div className="form-group">
          <label>Website</label>
          <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Minimum App Version</label>
            <input value={form.minimumAppVersion} onChange={(e) => setForm({ ...form, minimumAppVersion: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Latest App Version</label>
            <input value={form.latestAppVersion} onChange={(e) => setForm({ ...form, latestAppVersion: e.target.value })} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>iOS Store URL</label>
            <input value={form.storeUrlIOS} onChange={(e) => setForm({ ...form, storeUrlIOS: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Android Store URL</label>
            <input value={form.storeUrlAndroid} onChange={(e) => setForm({ ...form, storeUrlAndroid: e.target.value })} />
          </div>
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={form.maintenanceMode}
              onChange={(e) => setForm({ ...form, maintenanceMode: e.target.checked })}
              style={{ width: 'auto', marginRight: 8 }}
            />
            Maintenance Mode (blocks the app with a retry screen)
          </label>
        </div>
        {form.maintenanceMode && (
          <div className="form-group">
            <label>Maintenance Message</label>
            <textarea
              rows={2}
              value={form.maintenanceMessage}
              onChange={(e) => setForm({ ...form, maintenanceMessage: e.target.value })}
            />
          </div>
        )}

        <h3>Social Links (leave blank to hide)</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Facebook</label>
            <input
              value={form.socialLinks?.facebook || ''}
              onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, facebook: e.target.value } })}
            />
          </div>
          <div className="form-group">
            <label>Instagram</label>
            <input
              value={form.socialLinks?.instagram || ''}
              onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, instagram: e.target.value } })}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Twitter / X</label>
            <input
              value={form.socialLinks?.twitter || ''}
              onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, twitter: e.target.value } })}
            />
          </div>
          <div className="form-group">
            <label>LinkedIn</label>
            <input
              value={form.socialLinks?.linkedin || ''}
              onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, linkedin: e.target.value } })}
            />
          </div>
        </div>

        <button className="btn" type="button" onClick={() => saveMut.mutate()} disabled={saveMut.isPending}>
          Save changes
        </button>
        {saved && <span style={{ marginLeft: 12, color: 'var(--go-success)', fontSize: 14 }}>Saved.</span>}
      </div>
    </div>
  );
}
