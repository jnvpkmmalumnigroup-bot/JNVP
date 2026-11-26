import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function ApprovalsPage() {
  const { token, profile } = useAuth();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const canApprove =
    profile?.status === 'approved' &&
    ['batch_rep', 'office_bearer', 'super_admin'].includes(profile?.role);

  const loadQueue = useCallback(async () => {
    if (!token || !canApprove) return;
    setLoading(true);
    setError('');
    try {
      const data = await api.getPendingApprovals(token);
      setQueue(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load approval queue.');
    } finally {
      setLoading(false);
    }
  }, [token, canApprove]);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  const handleDecision = async (profileId, decision) => {
    setFeedback('');
    setError('');
    try {
      await api.decideApproval(token, profileId, decision);
      setQueue((prev) => prev.filter((item) => item.id !== profileId));
      setFeedback(`Profile ${decision} and logged to the audit trail.`);
    } catch (err) {
      setError(err.message || 'Could not process decision.');
    }
  };

  if (!canApprove) {
    return (
      <main className="portal-page">
        <div className="portal-card portal-card-narrow">
          <h1>Restricted Area</h1>
          <p>Only approved Batch Representatives and Office Bearers can review pending profiles.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="portal-page">
      <div className="portal-hero-banner">
        <div>
          <h1>Batch-Rep Approval Queue</h1>
          <p>
            Verify alumni from your assigned batch(es). Every approval or rejection is recorded in
            the association audit log.
          </p>
        </div>
        <span className="portal-badge">{queue.length} Pending</span>
      </div>

      <div className="portal-card">
        {feedback && <div className="portal-alert portal-alert-success">{feedback}</div>}
        {error && <div className="portal-alert portal-alert-error">{error}</div>}

        {loading ? (
          <p>Loading pending applications...</p>
        ) : queue.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No pending alumni requests in your queue.</p>
        ) : (
          <div className="portal-grid-2">
            {queue.map((applicant) => (
              <article key={applicant.id} className="directory-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>{applicant.full_name}</h3>
                  <span className="portal-badge">Batch {applicant.batch_year}</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-body)' }}>
                  House: <strong>{applicant.house || 'Not specified'}</strong> • City:{' '}
                  <strong>{applicant.city || 'Not specified'}</strong>
                </p>
                {applicant.admission_no && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--jnv-navy-700)' }}>
                    Admission No (verification only): <strong>{applicant.admission_no}</strong>
                  </p>
                )}
                <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.75rem' }}>
                  <button
                    type="button"
                    className="btn-gold-pill btn-sm"
                    onClick={() => handleDecision(applicant.id, 'approved')}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="btn-danger-outline"
                    onClick={() => handleDecision(applicant.id, 'rejected')}
                  >
                    Reject
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
