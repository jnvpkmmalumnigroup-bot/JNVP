import React from 'react';
import { OFFICE_BEARERS } from '../data/seedData';

export default function AboutPage() {
  return (
    <main className="portal-page">
      <div className="portal-hero-banner">
        <div>
          <h1>About JNVP Palair Alumni Association</h1>
          <p>
            Connecting generations of Jawahar Navodaya Vidyalaya, Palair (Khammam) alumni since
            1991 — fostering mentorship, student welfare, and lifelong Navodayan camaraderie.
          </p>
        </div>
        <img
          src="/assets/logo/Alumni_25_Logo.jpg"
          alt="JNVP Silver Jubilee Alumni Emblem"
          style={{ width: 88, height: 88, borderRadius: 14, objectFit: 'cover', border: '2px solid #f5b82e' }}
        />
      </div>

      <section className="portal-card">
        <h2 style={{ color: 'var(--jnv-navy-900)', marginBottom: '0.75rem' }}>
          Official Governance &amp; Documents
        </h2>
        <p style={{ color: 'var(--text-body)', marginBottom: '1.15rem' }}>
          The JNV Palair Khammam Alumni Association is a registered alumni body governed by its
          elected Executive Committee and Batch Representatives.
        </p>
        <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
          <a
            href="/assets/gallery/BYE-LAWS OF ALUMNI.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold-pill"
          >
            View Association Bye-Laws (PDF) ↗
          </a>
          <a
            href="/assets/gallery/Registration_certificate.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-navy-pill"
          >
            View Registration Certificate (PDF) ↗
          </a>
        </div>
      </section>

      <section className="portal-card">
        <h2 style={{ color: 'var(--jnv-navy-900)', marginBottom: '1rem' }}>Office Bearers</h2>
        <div className="portal-grid-3">
          {OFFICE_BEARERS.map((bearer) => (
            <article key={bearer.role} className="directory-card">
              <img
                src={bearer.photo}
                alt={bearer.name}
                style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 10 }}
              />
              <span className="portal-badge" style={{ alignSelf: 'flex-start', marginTop: '0.35rem' }}>
                {bearer.role}
              </span>
              <h3>{bearer.name}</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-body)' }}>{bearer.bio}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
