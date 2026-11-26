import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="portal-page">
      <div className="portal-card portal-card-narrow" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <span className="portal-badge">404 • Page Not Found</span>
        <h1 style={{ fontSize: '2.2rem', margin: '0.85rem 0 0.5rem', color: 'var(--jnv-navy-900)' }}>
          We Couldn&apos;t Find That Page
        </h1>
        <p style={{ color: 'var(--text-body)', marginBottom: '1.5rem' }}>
          The link may have moved or is only available to verified JNVP Palair alumni.
        </p>
        <Link to="/" className="btn-gold-pill">
          Return to JNVP Alumni Home &rarr;
        </Link>
      </div>
    </main>
  );
}
