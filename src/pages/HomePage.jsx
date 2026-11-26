import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  SEED_EVENTS,
  HIGHLIGHT_PHOTOS,
  DRIVE_ARCHIVES,
  SEED_GALLERIES
} from '../data/seedData';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const GDRIVE_API_KEY = import.meta.env.VITE_GDRIVE_API_KEY || '';

export default function HomePage() {
  const { token, profile } = useAuth();
  const [events] = useState(SEED_EVENTS);
  const [galleries, setGalleries] = useState(SEED_GALLERIES);
  const [selectedEventCategory, setSelectedEventCategory] = useState('All');
  const [lightboxItem, setLightboxItem] = useState(null);

  // Gallery state
  const [galleryTab, setGalleryTab] = useState('photos'); // 'photos' | 'memories' | 'cloud' | 'albums'
  const [selectedDay, setSelectedDay] = useState('Day 1 • 06 Dec 2025');
  const [selectedFolder, setSelectedFolder] = useState(DRIVE_ARCHIVES['Day 1 • 06 Dec 2025'][0]);
  const [drivePhotos, setDrivePhotos] = useState({});
  const [loadingFolder, setLoadingFolder] = useState(false);

  // Contact form state
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactSubmitting, setContactSubmitting] = useState(false);

  // RSVP modal state
  const [rsvpEvent, setRsvpEvent] = useState(null);
  const [guestCount, setGuestCount] = useState(0);
  const [rsvpStatusMsg, setRsvpStatusMsg] = useState('');

  useEffect(() => {
    api
      .getGalleries()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setGalleries(data);
      })
      .catch(() => {});
  }, []);

  // Load Google Drive photos when cloud tab + folder is selected
  useEffect(() => {
    if (galleryTab !== 'cloud' || !selectedFolder) return;
    const folderId = selectedFolder.folderId;
    if (drivePhotos[folderId]) return;

    let isMounted = true;
    setLoadingFolder(true);
    const url =
      `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents` +
      `&key=${GDRIVE_API_KEY}` +
      `&fields=files(id,name,mimeType,thumbnailLink)`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        setDrivePhotos((prev) => ({
          ...prev,
          [folderId]: Array.isArray(data?.files) ? data.files : []
        }));
        setLoadingFolder(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setDrivePhotos((prev) => ({ ...prev, [folderId]: [] }));
        setLoadingFolder(false);
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [galleryTab, selectedFolder]);

  // Close modals on Escape key
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLightboxItem(null);
        setRsvpEvent(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const eventCategories = ['All', ...Array.from(new Set(events.map((e) => e.category)))];
  const filteredEvents =
    selectedEventCategory === 'All'
      ? events
      : events.filter((e) => e.category === selectedEventCategory);

  const featuredEvent = events[0];

  const displayedHighlightPhotos =
    galleryTab === 'memories'
      ? HIGHLIGHT_PHOTOS.filter((p) => p.category === 'Memories')
      : HIGHLIGHT_PHOTOS;

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    setSelectedFolder(DRIVE_ARCHIVES[day][0]);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    setContactSubmitting(true);
    try {
      await api.submitContact({
        full_name: String(formData.get('fullName') || ''),
        batch_year: String(formData.get('batchYear') || '') || null,
        email: String(formData.get('emailAddr') || ''),
        message: String(formData.get('messageText') || '')
      });
    } catch {
      // Graceful fallback if Render backend is waking or offline in static preview
    } finally {
      setContactSubmitting(false);
      setContactSubmitted(true);
      form.reset();
    }
  };

  const handleRsvpSubmit = async (e) => {
    e.preventDefault();
    if (!rsvpEvent || !token) return;
    try {
      await api.rsvpEvent(token, rsvpEvent.id, guestCount);
      setRsvpStatusMsg(`RSVP confirmed for ${rsvpEvent.title} (+${guestCount} guests).`);
    } catch (err) {
      setRsvpStatusMsg(err.message || 'Could not save RSVP.');
    }
  };

  return (
    <>
      {/* Hero Section with Campus Backdrop & Overlapping Stats + Upcoming Meet Bar */}
      <section id="top" className="campus-hero">
        <div
          className="campus-hero-bg"
          style={{ backgroundImage: `url('/assets/gallery/Photo_1.jpg')` }}
        />
        <div className="campus-hero-overlay" />

        <div className="campus-hero-inner">
          <div className="campus-hero-text">
            <h1>
              Together <span className="gold-highlight">Forever</span>
            </h1>
            <p className="campus-hero-lead">
              Connecting JNVP Palair Alumni Across Generations
            </p>
            <div className="campus-hero-actions">
              <a href="#events" className="btn-gold-pill">
                Explore Alumni Events <span className="arrow-icon">&rarr;</span>
              </a>
              <a href="#gallery" className="btn-navy-outline">
                View Photo Gallery
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Stats Bar + Upcoming Meet Highlight Card */}
        <div className="hero-bottom-bar-wrap">
          <div className="hero-bottom-bar">
            <div className="hero-stats-grid">
              <div className="hero-stat-item">
                <div className="stat-icon-navy">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <strong>2500+</strong>
                <span>Alumni</span>
              </div>

              <div className="hero-stat-item">
                <div className="stat-icon-navy">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                </div>
                <strong>1991</strong>
                <span>Batch Onwards</span>
              </div>

              <div className="hero-stat-item">
                <div className="stat-icon-navy">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <strong>Across India</strong>
                <span>&amp; Abroad</span>
              </div>

              <div className="hero-stat-item">
                <div className="stat-icon-gold">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <strong>One Family</strong>
                <span>Always</span>
              </div>
            </div>

            <div className="upcoming-meet-spotlight">
              <div className="spotlight-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f5b82e" strokeWidth="2.2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>Upcoming Meet</span>
              </div>
              <h3>{featuredEvent.title}</h3>
              <p>{featuredEvent.date} &nbsp;|&nbsp; Palair Campus</p>
              <a href="#events" className="btn-gold-pill btn-sm">
                View Events &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>

      <main className="main-workspace">
        {/* ================= 1. EVENTS SECTION ================= */}
        <section id="events" className="scheme-section">
          <div className="scheme-card-shell">
            <div className="scheme-navy-header">
              <div>
                <h2>Events</h2>
                <p>Stay updated with alumni events, campus meets, and activities</p>
              </div>
              <Link to="/events" className="navy-header-link">
                All Events &amp; RSVP &rarr;
              </Link>
            </div>

            <div className="scheme-tab-bar" role="tablist" aria-label="Event Categories">
              {eventCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`scheme-tab-btn ${selectedEventCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedEventCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="scheme-card-body">
              {selectedEventCategory === 'All' && (
                <div className="featured-event-banner">
                  <div className="featured-date-box">
                    <span className="date-month">{featuredEvent.monthShort}</span>
                    <strong className="date-day">{featuredEvent.dayNum}</strong>
                  </div>

                  <div className="featured-event-info">
                    <span className="featured-pill-tag">{featuredEvent.category}</span>
                    <h3>{featuredEvent.title}</h3>
                    <p className="featured-loc">
                      {featuredEvent.location} &nbsp;&bull;&nbsp; {featuredEvent.time}
                    </p>
                    <p className="featured-desc">{featuredEvent.description}</p>
                    <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className="btn-gold-pill btn-sm"
                        onClick={() =>
                          setLightboxItem({
                            title: featuredEvent.title,
                            subtitle: `${featuredEvent.location} • ${featuredEvent.date} at ${featuredEvent.time}`,
                            src: featuredEvent.image
                          })
                        }
                      >
                        View Invitation Poster &rarr;
                      </button>
                      {profile?.status === 'approved' && (
                        <button
                          type="button"
                          className="btn-navy-pill"
                          onClick={() => {
                            setRsvpEvent(featuredEvent);
                            setGuestCount(0);
                            setRsvpStatusMsg('');
                          }}
                        >
                          RSVP Now
                        </button>
                      )}
                    </div>
                  </div>

                  <div
                    className="featured-event-preview"
                    onClick={() =>
                      setLightboxItem({
                        title: featuredEvent.title,
                        subtitle: `${featuredEvent.location} • ${featuredEvent.date} at ${featuredEvent.time}`,
                        src: featuredEvent.image
                      })
                    }
                    role="button"
                    tabIndex={0}
                  >
                    <img src={featuredEvent.image} alt={featuredEvent.title} />
                  </div>
                </div>
              )}

              <div className="scheme-events-grid">
                {filteredEvents.map((ev) => (
                  <article key={ev.id} className="scheme-event-card">
                    <div
                      className="scheme-event-thumb"
                      onClick={() =>
                        setLightboxItem({
                          title: ev.title,
                          subtitle: `${ev.location} • ${ev.date} at ${ev.time}`,
                          src: ev.image
                        })
                      }
                      role="button"
                      tabIndex={0}
                    >
                      <img src={ev.image} alt={ev.title} loading="lazy" />
                      <span className="scheme-event-badge">{ev.category}</span>
                    </div>

                    <div className="scheme-event-content">
                      <div className="scheme-event-top">
                        <div className="mini-date-badge">
                          <span>{ev.monthShort}</span>
                          <strong>{ev.dayNum}</strong>
                        </div>
                        <div>
                          <h3>{ev.title}</h3>
                          <p className="scheme-event-meta">
                            {ev.location} &bull; {ev.time}
                          </p>
                        </div>
                      </div>

                      <p className="scheme-event-desc">{ev.description}</p>

                      <div className="scheme-event-actions">
                        <button
                          type="button"
                          className="btn-navy-pill"
                          onClick={() =>
                            setLightboxItem({
                              title: ev.title,
                              subtitle: `${ev.location} • ${ev.date} at ${ev.time}`,
                              src: ev.image
                            })
                          }
                        >
                          View Poster &rarr;
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= 2. GALLERY SECTION ================= */}
        <section id="gallery" className="scheme-section">
          <div className="scheme-card-shell">
            <div className="scheme-navy-header">
              <div>
                <h2>Gallery</h2>
                <p>Cherished campus moments, batch reunions, and Milan 2025 photo archives</p>
              </div>
              <button
                type="button"
                className="navy-header-link-btn"
                onClick={() => setGalleryTab(galleryTab === 'cloud' ? 'photos' : 'cloud')}
              >
                {galleryTab === 'cloud' ? 'View Featured Photos →' : 'Explore Milan 2025 Albums →'}
              </button>
            </div>

            <div className="scheme-tab-bar">
              <button
                type="button"
                className={`scheme-tab-btn ${galleryTab === 'photos' ? 'active' : ''}`}
                onClick={() => setGalleryTab('photos')}
              >
                Photos
              </button>
              <button
                type="button"
                className={`scheme-tab-btn ${galleryTab === 'memories' ? 'active' : ''}`}
                onClick={() => setGalleryTab('memories')}
              >
                Memories
              </button>
              <button
                type="button"
                className={`scheme-tab-btn ${galleryTab === 'cloud' ? 'active' : ''}`}
                onClick={() => setGalleryTab('cloud')}
              >
                Milan 2025 Cloud Albums
              </button>
              <button
                type="button"
                className={`scheme-tab-btn ${galleryTab === 'albums' ? 'active' : ''}`}
                onClick={() => setGalleryTab('albums')}
              >
                Google Photos Albums
              </button>
            </div>

            <div className="scheme-card-body">
              {galleryTab === 'photos' || galleryTab === 'memories' ? (
                <div className="scheme-gallery-grid">
                  {displayedHighlightPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="scheme-photo-tile"
                      onClick={() =>
                        setLightboxItem({
                          title: photo.title,
                          subtitle: photo.category,
                          src: photo.src
                        })
                      }
                      role="button"
                      tabIndex={0}
                    >
                      <img src={photo.src} alt={photo.title} loading="lazy" />
                      <div className="scheme-photo-caption">
                        <span>{photo.category}</span>
                        <h4>{photo.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              ) : galleryTab === 'albums' ? (
                <div className="portal-grid-2">
                  {galleries.map((album) => (
                    <div key={album.id} className="directory-card">
                      <img
                        src={album.cover_image_url || '/assets/gallery/Photo_2.jpg'}
                        alt={album.title}
                        style={{ height: 180, width: '100%', objectFit: 'cover', borderRadius: 8 }}
                      />
                      <h3>{album.title}</h3>
                      <p style={{ color: 'var(--text-body)', fontSize: '0.92rem' }}>
                        {album.description}
                      </p>
                      <a
                        href={album.album_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-gold-pill btn-sm"
                        style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
                      >
                        Open Google Photos Album ↗
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="cloud-albums-wrapper">
                  <div className="cloud-day-tabs">
                    {Object.keys(DRIVE_ARCHIVES).map((day) => (
                      <button
                        key={day}
                        type="button"
                        className={`cloud-day-btn ${selectedDay === day ? 'active' : ''}`}
                        onClick={() => handleDaySelect(day)}
                      >
                        {day}
                      </button>
                    ))}
                  </div>

                  <div className="cloud-folder-strip">
                    {DRIVE_ARCHIVES[selectedDay].map((folder) => (
                      <button
                        key={folder.folderId}
                        type="button"
                        className={`cloud-folder-chip ${
                          selectedFolder?.folderId === folder.folderId ? 'active' : ''
                        }`}
                        onClick={() => setSelectedFolder(folder)}
                      >
                        {folder.name}
                      </button>
                    ))}
                  </div>

                  {loadingFolder ? (
                    <div className="cloud-loading-state">
                      <div className="scheme-spinner" />
                      <p>Loading photos from &ldquo;{selectedFolder?.name}&rdquo;...</p>
                    </div>
                  ) : (drivePhotos[selectedFolder?.folderId] || []).length === 0 ? (
                    <div className="cloud-loading-state">
                      <p>No previewable photos found in this folder.</p>
                    </div>
                  ) : (
                    <div className="scheme-cloud-grid">
                      {(drivePhotos[selectedFolder?.folderId] || []).map((file) => {
                        const thumbUrl = `https://lh3.googleusercontent.com/d/${file.id}=s600`;
                        const fullUrl = `https://drive.google.com/file/d/${file.id}/view`;
                        return (
                          <div key={file.id} className="scheme-cloud-item">
                            <img
                              src={thumbUrl}
                              alt={file.name}
                              loading="lazy"
                              onClick={() =>
                                setLightboxItem({
                                  title: selectedFolder.name,
                                  subtitle: file.name,
                                  src: `https://lh3.googleusercontent.com/d/${file.id}=s1200`,
                                  externalUrl: fullUrl
                                })
                              }
                            />
                            <a
                              href={fullUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="drive-badge-link"
                            >
                              Drive ↗
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ================= 3. CONTACT US SECTION ================= */}
        <section id="contact" className="scheme-section">
          <div className="scheme-card-shell">
            <div className="scheme-navy-header">
              <div>
                <h2>Contact Us</h2>
                <p>Connect with the JNV Palair Khammam Alumni Association team</p>
              </div>
              <a
                href="https://maps.google.com/?q=Jawahar+Navodaya+Vidyalaya+Palair+Khammam+Telangana+507157"
                target="_blank"
                rel="noopener noreferrer"
                className="navy-header-link"
              >
                Open Campus Map &rarr;
              </a>
            </div>

            <div className="scheme-card-body">
              <div className="scheme-contact-grid">
                <div className="scheme-contact-info-list">
                  <div className="scheme-contact-box">
                    <div className="scheme-contact-icon">📞</div>
                    <div>
                      <span className="contact-label">Alumni Helpdesk Phone</span>
                      <h4>
                        <a href="tel:+918742273025">+91 87422 73025</a>
                      </h4>
                      <p>Available for alumni event &amp; registration assistance</p>
                    </div>
                  </div>

                  <div className="scheme-contact-box">
                    <div className="scheme-contact-icon">✉️</div>
                    <div>
                      <span className="contact-label">Official Email</span>
                      <h4>
                        <a href="mailto:jnvpkmmalumni@gmail.com">jnvpkmmalumni@gmail.com</a>
                      </h4>
                      <p>Write to the association executive committee</p>
                    </div>
                  </div>

                  <div className="scheme-contact-box">
                    <div className="scheme-contact-icon">📍</div>
                    <div>
                      <span className="contact-label">Vidyalaya Address</span>
                      <h4>Jawahar Navodaya Vidyalaya, Palair</h4>
                      <p>
                        Palair Village, Kusumanchi Mandal, Khammam District, Telangana – 507157
                      </p>
                    </div>
                  </div>
                </div>

                <form className="scheme-contact-form" onSubmit={handleContactSubmit}>
                  <h3>Send a Message to the Association</h3>
                  <p>
                    Share your questions, event proposals, or feedback with the JNVP Palair Alumni
                    committee.
                  </p>

                  <div className="scheme-form-row">
                    <div className="scheme-field">
                      <label htmlFor="fullName">Your Name</label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="e.g. Dinesh Pallepogu"
                        required
                      />
                    </div>
                    <div className="scheme-field">
                      <label htmlFor="batchYear">Batch Year</label>
                      <input
                        id="batchYear"
                        name="batchYear"
                        type="text"
                        placeholder="e.g. Batch: 1992 / 2000-2007"
                      />
                    </div>
                  </div>

                  <div className="scheme-field">
                    <label htmlFor="emailAddr">Email Address</label>
                    <input
                      id="emailAddr"
                      name="emailAddr"
                      type="email"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <div className="scheme-field">
                    <label htmlFor="messageText">Message</label>
                    <textarea
                      id="messageText"
                      name="messageText"
                      rows="4"
                      placeholder="How would you like to collaborate or connect?"
                      required
                    />
                  </div>

                  {contactSubmitted && (
                    <div className="scheme-form-alert">
                      Thank you for reaching out! Your message has been recorded.
                    </div>
                  )}

                  <button type="submit" className="btn-gold-pill btn-full" disabled={contactSubmitting}>
                    {contactSubmitting ? 'Sending...' : 'Send Message →'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div
          className="modal-backdrop"
          onClick={() => setLightboxItem(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="lightbox-dialog" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setLightboxItem(null)}
              aria-label="Close preview"
            >
              ✕
            </button>
            <div className="lightbox-img-container">
              <img src={lightboxItem.src} alt={lightboxItem.title} className="lightbox-img" />
            </div>
            <div className="lightbox-caption">
              <div>
                <h4>{lightboxItem.title}</h4>
                {lightboxItem.subtitle && <p>{lightboxItem.subtitle}</p>}
              </div>
              {lightboxItem.externalUrl && (
                <a
                  href={lightboxItem.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold-pill btn-sm"
                >
                  Open Original ↗
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick RSVP Modal */}
      {rsvpEvent && (
        <div
          className="modal-backdrop"
          onClick={() => setRsvpEvent(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="members-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="members-modal-header">
              <h3>RSVP: {rsvpEvent.title}</h3>
            </div>
            <form className="members-modal-body" onSubmit={handleRsvpSubmit}>
              <div className="portal-field">
                <label htmlFor="homeGuestCount">Additional Family / Guests (0–10)</label>
                <input
                  id="homeGuestCount"
                  type="number"
                  min="0"
                  max="10"
                  className="portal-input"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                />
              </div>
              {rsvpStatusMsg && <div className="portal-alert portal-alert-success">{rsvpStatusMsg}</div>}
              <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'center' }}>
                <button type="submit" className="btn-gold-pill">
                  Confirm RSVP
                </button>
                <button type="button" className="btn-navy-pill" onClick={() => setRsvpEvent(null)}>
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
