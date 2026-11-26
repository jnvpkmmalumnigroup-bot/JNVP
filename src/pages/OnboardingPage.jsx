import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BATCH_YEARS, HOUSES } from '../data/seedData';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function OnboardingPage() {
  const { token, user, setProfile } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    full_name: '',
    email: user?.email || '',
    phone: '',
    address: '',
    batch_year: 2006,
    house: 'Aravali',
    admission_no: '',
    city: '',
    country: 'India',
    profession: '',
    company: '',
    bio: '',
    visibility: {
      show_phone: false,
      show_email: false,
      show_address: false,
      show_company: true,
      show_city: true,
      show_bio: true
    },
    consent_accepted: false
  });

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const toggleVisibility = (key) =>
    setForm((prev) => ({
      ...prev,
      visibility: { ...prev.visibility, [key]: !prev.visibility[key] }
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.consent_accepted) {
      setError('You must accept the DPDP Act 2023 Privacy & Consent Notice to submit your profile.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const saved = await api.upsertMyProfile(token, {
        ...form,
        batch_year: Number(form.batch_year)
      });
      setProfile(saved);
      navigate('/pending');
    } catch (err) {
      setError(err.message || 'Could not save your profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="portal-page">
      <div className="portal-card portal-card-narrow">
        <span className="portal-badge">Alumni Onboarding</span>
        <h1 style={{ marginTop: '0.6rem', marginBottom: '0.4rem', color: 'var(--jnv-navy-900)' }}>
          Complete Your Alumni Profile
        </h1>
        <p style={{ color: 'var(--text-body)', marginBottom: '1.25rem' }}>
          Your Batch Representative will verify your details before activating directory access.
        </p>

        <div className="stepper-bar" aria-label="Onboarding Steps">
          <div className={`stepper-pill ${step === 1 ? 'active' : 'done'}`}>1. Batch &amp; Identity</div>
          <div className={`stepper-pill ${step === 2 ? 'active' : step > 2 ? 'done' : ''}`}>
            2. Career &amp; City
          </div>
          <div className={`stepper-pill ${step === 3 ? 'active' : ''}`}>3. Privacy &amp; Consent</div>
        </div>

        {error && <div className="portal-alert portal-alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <div className="portal-field">
                <label htmlFor="full_name">Full Name *</label>
                <input
                  id="full_name"
                  className="portal-input"
                  value={form.full_name}
                  onChange={(e) => updateField('full_name', e.target.value)}
                  required
                />
              </div>

              <div className="portal-grid-2">
                <div className="portal-field">
                  <label htmlFor="batch_year">Batch Year *</label>
                  <select
                    id="batch_year"
                    className="portal-select"
                    value={form.batch_year}
                    onChange={(e) => updateField('batch_year', Number(e.target.value))}
                  >
                    {BATCH_YEARS.map((yr) => (
                      <option key={yr} value={yr}>
                        {yr} (Batch {yr - 1990})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="portal-field">
                  <label htmlFor="house">House</label>
                  <select
                    id="house"
                    className="portal-select"
                    value={form.house}
                    onChange={(e) => updateField('house', e.target.value)}
                  >
                    {HOUSES.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="portal-field">
                <label htmlFor="admission_no">
                  Admission Number (Private — only for batch-rep verification, never shown publicly)
                </label>
                <input
                  id="admission_no"
                  className="portal-input"
                  placeholder="Optional"
                  value={form.admission_no}
                  onChange={(e) => updateField('admission_no', e.target.value)}
                />
              </div>

              <button
                type="button"
                className="btn-gold-pill"
                onClick={() => {
                  if (!form.full_name.trim()) {
                    setError('Please enter your full name.');
                    return;
                  }
                  setError('');
                  setStep(2);
                }}
              >
                Next: Career &amp; Location &rarr;
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="portal-grid-2">
                <div className="portal-field">
                  <label htmlFor="city">Current City</label>
                  <input
                    id="city"
                    className="portal-input"
                    value={form.city}
                    onChange={(e) => updateField('city', e.target.value)}
                  />
                </div>
                <div className="portal-field">
                  <label htmlFor="country">Country</label>
                  <input
                    id="country"
                    className="portal-input"
                    value={form.country}
                    onChange={(e) => updateField('country', e.target.value)}
                  />
                </div>
              </div>

              <div className="portal-grid-2">
                <div className="portal-field">
                  <label htmlFor="profession">Profession</label>
                  <input
                    id="profession"
                    className="portal-input"
                    value={form.profession}
                    onChange={(e) => updateField('profession', e.target.value)}
                  />
                </div>
                <div className="portal-field">
                  <label htmlFor="company">Organization / Company</label>
                  <input
                    id="company"
                    className="portal-input"
                    value={form.company}
                    onChange={(e) => updateField('company', e.target.value)}
                  />
                </div>
              </div>

              <div className="portal-grid-2">
                <div className="portal-field">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    className="portal-input"
                    value={form.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                  />
                </div>
                <div className="portal-field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    className="portal-input"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                  />
                </div>
              </div>

              <div className="portal-field">
                <label htmlFor="bio">Short Bio</label>
                <textarea
                  id="bio"
                  rows="3"
                  className="portal-textarea"
                  value={form.bio}
                  onChange={(e) => updateField('bio', e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" className="btn-navy-pill" onClick={() => setStep(1)}>
                  &larr; Back
                </button>
                <button type="button" className="btn-gold-pill" onClick={() => setStep(3)}>
                  Next: Privacy Controls &rarr;
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <p style={{ marginBottom: '0.85rem', color: 'var(--text-body)', fontSize: '0.92rem' }}>
                <strong>Privacy by default:</strong> Phone, email, and address are{' '}
                <strong>hidden by default</strong>. Opt in below only for fields you wish approved
                alumni to see.
              </p>

              {[
                ['show_phone', 'Show my Phone Number in Directory'],
                ['show_email', 'Show my Email Address in Directory'],
                ['show_address', 'Show my Address in Directory'],
                ['show_city', 'Show my City in Directory'],
                ['show_company', 'Show my Company in Directory']
              ].map(([key, label]) => (
                <label key={key} className="portal-toggle-row">
                  <span>{label}</span>
                  <input
                    type="checkbox"
                    checked={form.visibility[key]}
                    onChange={() => toggleVisibility(key)}
                  />
                </label>
              ))}

              <label
                className="portal-toggle-row"
                style={{
                  marginTop: '1rem',
                  background: 'var(--jnv-gold-soft)',
                  borderColor: 'var(--jnv-gold-500)'
                }}
              >
                <span style={{ fontSize: '0.88rem' }}>
                  I consent to the JNVP Palair Alumni Association storing my profile for alumni
                  verification and directory use in accordance with India&apos;s{' '}
                  <Link to="/privacy" style={{ textDecoration: 'underline' }}>
                    DPDP Act 2023 Privacy Policy
                  </Link>
                  .
                </span>
                <input
                  type="checkbox"
                  aria-label="Accept DPDP Privacy Consent"
                  checked={form.consent_accepted}
                  onChange={(e) => updateField('consent_accepted', e.target.checked)}
                />
              </label>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn-navy-pill" onClick={() => setStep(2)}>
                  &larr; Back
                </button>
                <button type="submit" className="btn-gold-pill" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit for Batch-Rep Verification →'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </main>
  );
}
