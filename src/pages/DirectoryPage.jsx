import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BATCH_YEARS, HOUSES } from '../data/seedData';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function DirectoryPage() {
  const { token, profile } = useAuth();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const [q, setQ] = useState('');
  const [batchYear, setBatchYear] = useState('');
  const [house, setHouse] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isApproved = profile?.status === 'approved';

  useEffect(() => {
    if (!token || !isApproved) return;
    let active = true;
    setLoading(true);
    setError('');
    api
      .searchDirectory(token, {
        q,
        batch_year: batchYear,
        house,
        city,
        page,
        page_size: pageSize
      })
      .then((res) => {
        if (!active) return;
        setItems(res.items || []);
        setTotal(res.total || 0);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'Unable to load directory.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token, isApproved, q, batchYear, house, city, page]);

  if (!token) {
    return (
      <main className="portal-page">
        <div className="portal-card portal-card-narrow" style={{ textAlign: 'center' }}>
          <h1>Alumni Directory</h1>
          <p style={{ margin: '0.75rem 0 1.25rem', color: 'var(--text-body)' }}>
            The JNVP Palair Alumni Directory is private and visible only to signed-in, approved
            alumni.
          </p>
          <Link to="/login" className="btn-gold-pill">
            Sign In to Access Directory &rarr;
          </Link>
        </div>
      </main>
    );
  }

  if (!isApproved) {
    return (
      <main className="portal-page">
        <div className="portal-card portal-card-narrow" style={{ textAlign: 'center' }}>
          <h1>Approval Required</h1>
          <p style={{ margin: '0.75rem 0 1.25rem', color: 'var(--text-body)' }}>
            Your membership is currently <strong>{profile?.status || 'incomplete'}</strong>. Once
            your Batch Representative approves your profile, you will be able to search the
            directory.
          </p>
          <Link to="/pending" className="btn-navy-pill">
            View Verification Status
          </Link>
        </div>
      </main>
    );
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <main className="portal-page">
      <div className="portal-hero-banner">
        <div>
          <h1>Verified Alumni Directory</h1>
          <p>
            Search across ~2,400 JNVP Palair alumni by batch, house, city, or profession. Contact
            details are shown only when opted in by each member.
          </p>
        </div>
        <span className="portal-badge">{total} Verified Alumni</span>
      </div>

      <div className="portal-card">
        <div className="filter-toolbar">
          <input
            aria-label="Search alumni"
            className="portal-input"
            placeholder="Search by name, profession, company..."
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
          />
          <select
            aria-label="Filter by batch"
            className="portal-select"
            value={batchYear}
            onChange={(e) => {
              setPage(1);
              setBatchYear(e.target.value);
            }}
          >
            <option value="">All Batches</option>
            {BATCH_YEARS.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter by house"
            className="portal-select"
            value={house}
            onChange={(e) => {
              setPage(1);
              setHouse(e.target.value);
            }}
          >
            <option value="">All Houses</option>
            {HOUSES.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
          <input
            aria-label="Filter by city"
            className="portal-input"
            placeholder="City (e.g. Hyderabad)"
            value={city}
            onChange={(e) => {
              setPage(1);
              setCity(e.target.value);
            }}
          />
        </div>

        {error && <div className="portal-alert portal-alert-error">{error}</div>}

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading directory...</p>
        ) : items.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No verified alumni match your filters.</p>
        ) : (
          <div className="portal-grid-3">
            {items.map((person) => (
              <article key={person.id} className="directory-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>{person.full_name}</h3>
                  <span className="portal-badge-navy portal-badge">Batch {person.batch_year}</span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  {[person.house && `${person.house} House`, person.city, person.country]
                    .filter(Boolean)
                    .join(' • ')}
                </p>
                {(person.profession || person.company) && (
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-dark)', fontWeight: 500 }}>
                    {[person.profession, person.company].filter(Boolean).join(' at ')}
                  </p>
                )}
                {person.bio && (
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-body)' }}>{person.bio}</p>
                )}
                <div style={{ marginTop: '0.35rem', fontSize: '0.84rem', color: 'var(--jnv-navy-700)' }}>
                  {person.email && <div>Email: {person.email}</div>}
                  {person.phone && <div>Phone: {person.phone}</div>}
                  {!person.email && !person.phone && (
                    <span style={{ color: 'var(--text-muted)' }}>Contact details hidden by member</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn-navy-pill"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              &larr; Previous
            </button>
            <span style={{ alignSelf: 'center', fontWeight: 600 }}>
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              className="btn-navy-pill"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next &rarr;
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
