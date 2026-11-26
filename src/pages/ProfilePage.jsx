import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { token, profile, setProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const [city, setCity] = useState(profile?.city || '');
  const [profession, setProfession] = useState(profile?.profession || '');
  const [company, setCompany] = useState(profile?.company || '');
  const [visibility, setVisibility] = useState(
    profile?.visibility || {
      show_phone: false,
      show_email: false,
      show_address: false,
      show_company: true,
      show_city: true,
      show_bio: true
    }
  );

  if (!profile) {
    return (
      <main className="portal-page">
        <div className="portal-card portal-card-narrow">
          <h1>No Profile Found</h1>
          <p>Please sign in and complete onboarding first.</p>
        </div>
      </main>
    );
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErrorMsg('');
    setStatusMsg('');
    try {
      const updated = await api.upsertMyProfile(token, {
        full_name: profile.full_name,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        batch_year: profile.batch_year,
        house: profile.house,
        admission_no: profile.admission_no,
        city,
        country: profile.country || 'India',
        profession,
        company,
        bio: profile.bio,
        visibility,
        consent_accepted: true
      });
      setProfile(updated);
      setStatusMsg('Profile & privacy settings saved.');
    } catch (err) {
      setErrorMsg(err.message || 'Could not update profile.');
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteAccount = async () => {
    setBusy(true);
    setErrorMsg('');
    try {
      await api.deleteMyAccount(token);
      await signOut();
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message || 'Could not delete account.');
      setBusy(false);
    }
  };

  return (
    <main className="portal-page">
      <div className="portal-card portal-card-narrow">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h1 style={{ color: 'var(--jnv-navy-900)' }}>{profile.full_name}</h1>
          <span
            className={`portal-badge ${
              profile.status === 'approved' ? 'portal-badge-success' : 'portal-badge-navy'
            }`}
          >
            {profile.status.toUpperCase()} • {profile.role}
          </span>
        </div>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Batch {profile.batch_year} {profile.house ? `• ${profile.house} House` : ''}
        </p>

        {statusMsg && <div className="portal-alert portal-alert-success">{statusMsg}</div>}
        {errorMsg && <div className="portal-alert portal-alert-error">{errorMsg}</div>}

        <form onSubmit={handleSave}>
          <div className="portal-field">
            <label htmlFor="profileCity">City</label>
            <input
              id="profileCity"
              className="portal-input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="portal-grid-2">
            <div className="portal-field">
              <label htmlFor="profileProfession">Profession</label>
              <input
                id="profileProfession"
                className="portal-input"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
              />
            </div>
            <div className="portal-field">
              <label htmlFor="profileCompany">Company</label>
              <input
                id="profileCompany"
                className="portal-input"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
          </div>

          <h3 style={{ margin: '1rem 0 0.6rem', color: 'var(--jnv-navy-900)' }}>
            Directory Visibility
          </h3>
          {[
            ['show_phone', 'Show Phone Number'],
            ['show_email', 'Show Email Address'],
            ['show_address', 'Show Address']
          ].map(([key, label]) => (
            <label key={key} className="portal-toggle-row">
              <span>{label}</span>
              <input
                type="checkbox"
                checked={Boolean(visibility[key])}
                onChange={() => setVisibility((v) => ({ ...v, [key]: !v[key] }))}
              />
            </label>
          ))}

          <button type="submit" className="btn-gold-pill" disabled={busy}>
            {busy ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        <hr style={{ margin: '2rem 0 1.25rem', border: 'none', borderTop: '1px solid var(--jnv-border)' }} />

        <section aria-label="DPDP Account Erasure">
          <h3 style={{ color: '#9e1c1c', marginBottom: '0.4rem' }}>
            Data Privacy &amp; Right to Erasure (DPDP Act 2023)
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-body)', marginBottom: '0.85rem' }}>
            Permanently delete your alumni profile and all event RSVPs from our database.
          </p>

          {!showDeleteConfirm ? (
            <button
              type="button"
              className="btn-danger-outline"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete My Account
            </button>
          ) : (
            <div className="portal-alert portal-alert-error">
              <p style={{ marginBottom: '0.75rem' }}>
                <strong>Are you sure?</strong> This permanently erases your profile and RSVPs.
              </p>
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <button
                  type="button"
                  className="btn-danger-outline"
                  disabled={busy}
                  onClick={handleDeleteAccount}
                >
                  Yes, Permanently Delete My Account
                </button>
                <button
                  type="button"
                  className="btn-navy-pill"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
