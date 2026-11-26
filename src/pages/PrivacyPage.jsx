import React from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPage() {
  return (
    <main className="portal-page">
      <div className="portal-hero-banner">
        <div>
          <h1>Privacy Policy &amp; DPDP Act 2023 Notice</h1>
          <p>
            How the JNV Palair Khammam Alumni Association collects, protects, and lets you control
            your personal data.
          </p>
        </div>
      </div>

      <div className="portal-card">
        <h2 style={{ color: 'var(--jnv-navy-900)', marginBottom: '0.5rem' }}>
          1. Data Minimization &amp; Privacy by Default
        </h2>
        <p style={{ color: 'var(--text-body)', marginBottom: '1rem' }}>
          We collect only the details required to verify your JNVP Palair alumni status and connect
          you with fellow alumni. Your <strong>phone number, email address, and home address are hidden
          by default</strong>. You can opt in or opt out of sharing each field at any time in{' '}
          <Link to="/profile" style={{ textDecoration: 'underline', color: 'var(--jnv-navy-700)' }}>
            My Profile
          </Link>
          .
        </p>

        <h2 style={{ color: 'var(--jnv-navy-900)', marginBottom: '0.5rem' }}>
          2. Private Verification Data
        </h2>
        <p style={{ color: 'var(--text-body)', marginBottom: '1rem' }}>
          If you provide your school admission number for verification, it is strictly private and
          is <strong>never displayed in the Alumni Directory or any public page</strong>.
        </p>

        <h2 style={{ color: 'var(--jnv-navy-900)', marginBottom: '0.5rem' }}>
          3. Restricted Access &amp; Search Engine Protection
        </h2>
        <p style={{ color: 'var(--text-body)', marginBottom: '1rem' }}>
          The Alumni Directory is protected by Postgres Row Level Security (RLS) and is visible only
          to signed-in, batch-rep-approved alumni. All personal routes are disallowed from search
          engine indexing via <code>robots.txt</code>.
        </p>

        <h2 style={{ color: 'var(--jnv-navy-900)', marginBottom: '0.5rem' }}>
          4. Your Rights Under India&apos;s DPDP Act 2023
        </h2>
        <p style={{ color: 'var(--text-body)', marginBottom: '1rem' }}>
          You have the right to access, correct, or permanently erase your account and event RSVPs
          at any time using the <strong>Delete My Account</strong> button in{' '}
          <Link to="/profile" style={{ textDecoration: 'underline', color: 'var(--jnv-navy-700)' }}>
            My Profile
          </Link>
          , or by writing to <a href="mailto:jnvpkmmalumni@gmail.com">jnvpkmmalumni@gmail.com</a>.
        </p>
      </div>
    </main>
  );
}
