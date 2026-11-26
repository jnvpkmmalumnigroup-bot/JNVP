import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SEED_EVENTS } from '../data/seedData';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function EventsPage() {
  const { token, profile } = useAuth();
  const [events, setEvents] = useState(SEED_EVENTS);
  const [myRsvps, setMyRsvps] = useState({});
  const [activeRsvpEvent, setActiveRsvpEvent] = useState(null);
  const [guestCount, setGuestCount] = useState(0);
  const [notes, setNotes] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const isApproved = profile?.status === 'approved';
  const isOfficeBearer =
    isApproved && ['office_bearer', 'super_admin'].includes(profile?.role);

  // Admin new event form
  const [newTitle, setNewTitle] = useState('');
  const [newVenue, setNewVenue] = useState('JNV Palair Campus');
  const [newDate, setNewDate] = useState('2026-12-06T10:00');

  useEffect(() => {
    api
      .getEvents()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setEvents(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!token || !isApproved) return;
    api
      .getMyRsvps(token)
      .then((list) => {
        const map = {};
        (list || []).forEach((r) => {
          map[r.event_id] = r;
        });
        setMyRsvps(map);
      })
      .catch(() => {});
  }, [token, isApproved]);

  const handleRsvp = async (e) => {
    e.preventDefault();
    if (!activeRsvpEvent) return;
    setErrorMsg('');
    setStatusMsg('');
    try {
      const saved = await api.rsvpEvent(token, activeRsvpEvent.id, guestCount, notes);
      setMyRsvps((prev) => ({ ...prev, [activeRsvpEvent.id]: saved }));
      setStatusMsg(`RSVP confirmed for ${activeRsvpEvent.title} (+${guestCount} guests).`);
      setActiveRsvpEvent(null);
    } catch (err) {
      setErrorMsg(err.message || 'RSVP failed.');
    }
  };

  const handleCancelRsvp = async (eventId) => {
    try {
      await api.cancelRsvp(token, eventId);
      setMyRsvps((prev) => {
        const copy = { ...prev };
        delete copy[eventId];
        return copy;
      });
      setStatusMsg('RSVP cancelled.');
    } catch (err) {
      setErrorMsg(err.message || 'Could not cancel RSVP.');
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const created = await api.createEvent(token, {
        title: newTitle,
        venue: newVenue,
        event_date: new Date(newDate).toISOString(),
        category: 'Flagship Meet'
      });
      setEvents((prev) => [created, ...prev]);
      setNewTitle('');
      setStatusMsg(`Event "${created.title}" published.`);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create event.');
    }
  };

  return (
    <main className="portal-page">
      <div className="portal-hero-banner">
        <div>
          <h1>Alumni Events &amp; RSVPs</h1>
          <p>
            Reunions, Silver Jubilee meets, health camps, and campus runs. Approved alumni can RSVP
            with family guest counts.
          </p>
        </div>
        {!isApproved && (
          <Link to="/login" className="btn-gold-pill">
            Sign In to RSVP &rarr;
          </Link>
        )}
      </div>

      {statusMsg && <div className="portal-alert portal-alert-success">{statusMsg}</div>}
      {errorMsg && <div className="portal-alert portal-alert-error">{errorMsg}</div>}

      {isOfficeBearer && (
        <section className="portal-card">
          <h2 style={{ color: 'var(--jnv-navy-900)', marginBottom: '0.85rem' }}>
            Admin Events Editor
          </h2>
          <form onSubmit={handleCreateEvent} className="portal-grid-3">
            <input
              aria-label="New event title"
              className="portal-input"
              placeholder="Event Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
            <input
              aria-label="New event venue"
              className="portal-input"
              placeholder="Venue"
              value={newVenue}
              onChange={(e) => setNewVenue(e.target.value)}
              required
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                aria-label="New event date"
                type="datetime-local"
                className="portal-input"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                required
              />
              <button type="submit" className="btn-gold-pill">
                Publish
              </button>
            </div>
          </form>
        </section>
      )}

      <div className="portal-grid-2">
        {events.map((ev) => {
          const existing = myRsvps[ev.id];
          return (
            <article key={ev.id} className="portal-card" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="portal-badge">{ev.category}</span>
                <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  {ev.date_label || ev.date} • {ev.time_label || ev.time}
                </span>
              </div>
              <h2 style={{ color: 'var(--jnv-navy-900)', marginBottom: '0.35rem' }}>{ev.title}</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--jnv-navy-700)', fontWeight: 600 }}>
                {ev.venue || ev.location}
              </p>
              <p style={{ color: 'var(--text-body)', margin: '0.6rem 0 1rem', fontSize: '0.93rem' }}>
                {ev.description}
              </p>

              {isApproved ? (
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  {existing ? (
                    <>
                      <span className="portal-badge portal-badge-success">
                        RSVP Confirmed (+{existing.guest_count} guests)
                      </span>
                      <button
                        type="button"
                        className="btn-danger-outline"
                        onClick={() => handleCancelRsvp(ev.id)}
                      >
                        Cancel RSVP
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="btn-gold-pill btn-sm"
                      onClick={() => {
                        setActiveRsvpEvent(ev);
                        setGuestCount(0);
                        setNotes('');
                      }}
                    >
                      RSVP to Event &rarr;
                    </button>
                  )}
                </div>
              ) : (
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Approved alumni membership required to RSVP.
                </span>
              )}
            </article>
          );
        })}
      </div>

      {activeRsvpEvent && (
        <div
          className="modal-backdrop"
          onClick={() => setActiveRsvpEvent(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="members-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="members-modal-header">
              <h3>RSVP: {activeRsvpEvent.title}</h3>
            </div>
            <form className="members-modal-body" onSubmit={handleRsvp}>
              <div className="portal-field">
                <label htmlFor="rsvpGuests">Additional Guests (0–10)</label>
                <input
                  id="rsvpGuests"
                  type="number"
                  min="0"
                  max="10"
                  className="portal-input"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                />
              </div>
              <div className="portal-field">
                <label htmlFor="rsvpNotes">Notes (Optional)</label>
                <input
                  id="rsvpNotes"
                  className="portal-input"
                  placeholder="Dietary or batch meetup notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'center' }}>
                <button type="submit" className="btn-gold-pill">
                  Confirm RSVP
                </button>
                <button
                  type="button"
                  className="btn-navy-pill"
                  onClick={() => setActiveRsvpEvent(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
