import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function AdminPage() {
  const { token, profile } = useAuth();
  const [auditLogs, setAuditLogs] = useState([]);
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumUrl, setAlbumUrl] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const isAdmin =
    profile?.status === 'approved' && ['office_bearer', 'super_admin'].includes(profile?.role);

  useEffect(() => {
    if (!token || !isAdmin) return;
    api
      .getAuditLogs(token)
      .then((logs) => setAuditLogs(logs || []))
      .catch(() => {});
  }, [token, isAdmin]);

  const handleAddAlbum = async (e) => {
    e.preventDefault();
    try {
      await api.createGallery(token, { title: albumTitle, album_url: albumUrl });
      setAlbumTitle('');
      setAlbumUrl('');
      setStatusMsg('Google Photos album linked.');
    } catch (err) {
      setStatusMsg(err.message || 'Could not add album.');
    }
  };

  if (!isAdmin) {
    return (
      <main className="portal-page">
        <div className="portal-card portal-card-narrow">
          <h1>Committee Admin Only</h1>
          <p>This console is restricted to Office Bearers and Super Admins.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="portal-page">
      <div className="portal-hero-banner">
        <div>
          <h1>Executive Committee Admin</h1>
          <p>Manage events, announcements, Google Photos albums, and review audit logs.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <Link to="/approvals" className="btn-gold-pill btn-sm">
            Approval Queue
          </Link>
          <Link to="/events" className="btn-navy-outline">
            Events Editor
          </Link>
          <Link to="/announcements" className="btn-navy-outline">
            Announcements Editor
          </Link>
        </div>
      </div>

      {statusMsg && <div className="portal-alert portal-alert-success">{statusMsg}</div>}

      <section className="portal-card">
        <h2 style={{ color: 'var(--jnv-navy-900)', marginBottom: '0.75rem' }}>
          Link External Google Photos Album
        </h2>
        <form onSubmit={handleAddAlbum} className="portal-grid-3">
          <input
            aria-label="Album Title"
            className="portal-input"
            placeholder="Album Title"
            value={albumTitle}
            onChange={(e) => setAlbumTitle(e.target.value)}
            required
          />
          <input
            aria-label="Google Photos URL"
            type="url"
            className="portal-input"
            placeholder="https://photos.app.goo.gl/..."
            value={albumUrl}
            onChange={(e) => setAlbumUrl(e.target.value)}
            required
          />
          <button type="submit" className="btn-gold-pill">
            Add Album Link
          </button>
        </form>
      </section>

      <section className="portal-card">
        <h2 style={{ color: 'var(--jnv-navy-900)', marginBottom: '0.75rem' }}>Recent Audit Log</h2>
        {auditLogs.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No audit entries recorded yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {auditLogs.map((entry) => (
              <li key={entry.id} className="portal-toggle-row">
                <span>
                  <strong>{entry.action}</strong> on {entry.target_type} ({entry.target_id})
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {new Date(entry.created_at).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
