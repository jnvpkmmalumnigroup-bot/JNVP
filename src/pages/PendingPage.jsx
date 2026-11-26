import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PendingPage() {
  const { profile } = useAuth();

  return (
    <main className="portal-page">
      <div className="portal-card portal-card-narrow" style={{ textAlign: 'center' }}>
        <span className="portal-badge">Verification Pending</span>
        <h1 style={{ marginTop: '0.85rem', marginBottom: '0.5rem', color: 'var(--jnv-navy-900)' }}>
          Your Profile Is Under Batch-Rep Review
        </h1>
        <p style={{ color: 'var(--text-body)', marginBottom: '1.25rem' }}>
          Thank you{profile?.full_name ? `, ${profile.full_name}` : ''}! Your Batch{' '}
          <strong>{profile?.batch_year || ''}</strong> Representative verifies every alumnus to keep
          the directory trusted and private.
        </p>

        <div className="portal-alert portal-alert-info" style={{ textAlign: 'left' }}>
          <strong>What happens next?</strong>
          <ul style={{ marginLeft: '1.2rem', marginTop: '0.4rem' }}>
            <li>Your batch rep typically reviews requests within 24–48 hours.</li>
            <li>Once approved, you gain access to the searchable Alumni Directory &amp; Event RSVPs.</li>
            <li>You can update your privacy settings or erase your account anytime from My Profile.</li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/profile" className="btn-navy-pill">
            Manage My Profile
          </Link>
          <Link to="/" className="btn-gold-pill">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
