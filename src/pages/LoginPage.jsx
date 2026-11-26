import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { signInWithGoogle, signInWithMagicLink } = useAuth();
  const [email, setEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleGoogle = async () => {
    setErrorMessage('');
    setStatusMessage('');
    const res = await signInWithGoogle();
    if (res?.error) {
      setErrorMessage(res.error.message || 'Google sign-in failed.');
    } else if (res?.message) {
      setStatusMessage(res.message);
    }
  };

  const handleMagicLink = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    setErrorMessage('');
    setStatusMessage('');
    const res = await signInWithMagicLink(email.trim());
    setSubmitting(false);
    if (res?.error) {
      setErrorMessage(res.error.message || 'Could not send magic link.');
    } else {
      setStatusMessage(
        res?.message || `Sign-in magic link sent to ${email.trim()}. Check your inbox!`
      );
    }
  };

  return (
    <main className="portal-page">
      <div className="portal-card portal-card-narrow">
        <span className="portal-badge">Verified Alumni Access</span>
        <h1 style={{ marginTop: '0.75rem', marginBottom: '0.4rem', color: 'var(--jnv-navy-900)' }}>
          Sign In / Join JNVP Alumni
        </h1>
        <p style={{ color: 'var(--text-body)', marginBottom: '1.5rem' }}>
          Sign in with Google (recommended — instant, zero email quota used) or request a one-time
          Magic Link.
        </p>

        {errorMessage && <div className="portal-alert portal-alert-error">{errorMessage}</div>}
        {statusMessage && <div className="portal-alert portal-alert-success">{statusMessage}</div>}

        <button type="button" className="btn-google" onClick={handleGoogle}>
          <span>G</span> Continue with Google (Recommended)
        </button>

        <div
          style={{
            textAlign: 'center',
            margin: '1.25rem 0',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            fontWeight: 600
          }}
        >
          — or sign in with Magic Link —
        </div>

        <form onSubmit={handleMagicLink}>
          <div className="portal-field">
            <label htmlFor="magicEmail">Email Address</label>
            <input
              id="magicEmail"
              type="email"
              className="portal-input"
              placeholder="alumni@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-gold-pill btn-full" disabled={submitting}>
            {submitting ? 'Sending Magic Link...' : 'Send Magic Link →'}
          </button>
        </form>

        <p style={{ marginTop: '1.25rem', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
          New alumni complete a quick profile reviewed by their Batch Representative. Read our{' '}
          <Link to="/privacy" style={{ color: 'var(--jnv-navy-700)', textDecoration: 'underline' }}>
            DPDP Act 2023 Privacy Notice
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
