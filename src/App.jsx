import React, { useState, useEffect } from 'react';
import './App.css';

const EVENTS_DATA = [
  {
    id: 'alumni-meet-2025',
    title: 'JNVP Palair Alumni Meet',
    category: 'Flagship Meet',
    monthShort: 'DEC',
    dayNum: '06',
    date: 'Dec 06, 2025',
    time: '10:00 AM',
    location: 'JNV Palair Campus',
    description: "Let's come together and relive the memories! Grand annual reunion celebrating generations of Navodayan camaraderie.",
    image: '/assets/gallery/Alumni_Invitation.jpg',
    featured: true
  },
  {
    id: 'health-camp',
    title: 'Alumni Medical & Health Camp',
    category: 'Community Service',
    monthShort: 'DEC',
    dayNum: '06',
    date: 'Dec 06, 2025',
    time: '10:00 AM',
    location: 'Admission Block, Palair Campus',
    description: 'Comprehensive health checkups and specialist consultations organized by alumni doctors for students and staff.',
    image: '/assets/gallery/Event_HealthCamp.jpg',
    featured: false
  },
  {
    id: 'sports-meet',
    title: 'Inter-Batch Sports Meet',
    category: 'Athletics',
    monthShort: 'DEC',
    dayNum: '06',
    date: 'Dec 06, 2025',
    time: '10:00 AM',
    location: 'School Grounds',
    description: 'Friendly yet spirited volleyball, cricket, and athletics matches across batches on our iconic school grounds.',
    image: '/assets/gallery/Event_Sports.jpg',
    featured: false
  },
  {
    id: 'zumba-session',
    title: 'Morning Fitness & Zumba',
    category: 'Wellness',
    monthShort: 'DEC',
    dayNum: '06',
    date: 'Dec 06, 2025',
    time: '10:00 AM',
    location: 'Football Ground',
    description: 'High-energy group Zumba and wellness session bringing alumni families together on the football field.',
    image: '/assets/gallery/Event_Zumba.jpg',
    featured: false
  },
  {
    id: 'career-guidance',
    title: 'Career Guidance & Mentorship',
    category: 'Mentorship',
    monthShort: 'DEC',
    dayNum: '06',
    date: 'Dec 06, 2025',
    time: '06:00 PM',
    location: 'MP Hall, JNV Palair',
    description: 'Interactive career panels and guidance sessions by senior alumni across civil services, medicine, engineering, and arts.',
    image: '/assets/gallery/Event_Career.jpg',
    featured: false
  },
  {
    id: 'cultural-night',
    title: 'Grand Cultural Programme',
    category: 'Cultural',
    monthShort: 'DEC',
    dayNum: '06',
    date: 'Dec 06, 2025',
    time: '06:00 PM',
    location: 'Grand Dais',
    description: 'An unforgettable evening of music, dance performances, nostalgic stories, and alumni felicitations.',
    image: '/assets/gallery/Event_Cultural.jpg',
    featured: false
  },
  {
    id: 'campus-run',
    title: 'JNVP Heritage Campus Run',
    category: 'Athletics',
    monthShort: 'DEC',
    dayNum: '07',
    date: 'Dec 07, 2025',
    time: '07:00 AM',
    location: 'JNV Campus Trail',
    description: 'Sunrise solidarity marathon around the scenic Palair campus pathways celebrating fitness and unity.',
    image: '/assets/gallery/Event_CampusRun.jpg',
    featured: false
  }
];

const HIGHLIGHT_PHOTOS = [
  {
    id: 'h1',
    title: 'JNV Palair Main Academic Block',
    category: 'Photos',
    src: '/assets/gallery/Photo_1.jpg'
  },
  {
    id: 'h2',
    title: 'Alumni Reunion Grand Gathering',
    category: 'Memories',
    src: '/assets/gallery/Photo_2.jpg'
  },
  {
    id: 'h3',
    title: 'Batchmates Together Forever',
    category: 'Memories',
    src: '/assets/gallery/Photo_3.jpg'
  },
  {
    id: 'h4',
    title: 'Grand Alumni Assembly',
    category: 'Photos',
    src: '/assets/gallery/Photo_4.jpg'
  },
  {
    id: 'h5',
    title: 'Evening Stage & Celebrations',
    category: 'Memories',
    src: '/assets/gallery/Photo_5.jpg'
  },
  {
    id: 'h6',
    title: '14th Batch Alumni Group',
    category: 'Memories',
    src: '/assets/gallery/alumni_group_14.JPG'
  },
  {
    id: 'h7',
    title: 'Community Feast (Khana)',
    category: 'Photos',
    src: '/assets/gallery/Event_Khana.jpg'
  },
  {
    id: 'h8',
    title: 'Cultural Evening Performances',
    category: 'Photos',
    src: '/assets/gallery/Event_Cultural.jpg'
  }
];

const DRIVE_ARCHIVES = {
  'Day 1 • 06 Dec 2025': [
    { name: 'Inauguration', folderId: '1DMK6s6V19S-iP6qnYNCoK_cGQoTRh05X' },
    { name: 'Registration', folderId: '1OuJxvZL5oYs4dMbp9QWo7-WkbRmFVKbL' },
    { name: 'Torch Flame', folderId: '1kwqM8FxQ7T84mVui00lgeylOOnrO0-A4' },
    { name: 'Cultural', folderId: '1T5ITTT9xsJGe7RIl-qGbVdja-ISAkn8l' },
    { name: 'Group Dances', folderId: '1nXqbHlQnOelC0OTZmVmh612qiA15lQNk' },
    { name: 'Outdoor Games', folderId: '1aseAYboA9H5WwbHTsWAMQFZlxFP-UsJ1' },
    { name: 'Indoor', folderId: '1HLXOH6Pn3ufJlgy8JMJ4ohnKrEtp3bvH' },
    { name: 'Jemalaiah Collection', folderId: '1hcMQo4RKNRkDX28ons8J7nHgmY0lKAng' },
    { name: 'Mahiteja Collection', folderId: '10_GkOJMIVrtRpyDCDfE_OMH6mVjZ09hP' }
  ],
  'Day 2 • 07 Dec 2025': [
    { name: 'Association Inauguration', folderId: '18oBNQu0Bp6_DM_T5oEZVbrFwOv5UOXs0' },
    { name: 'Stage Program', folderId: '1jmdlc_zDyDzu8CR3mwZPQ8069mRAITWQ' },
    { name: 'Zumba Session', folderId: '1r6Ur0bLDFqwxy-JaK1rExEJJpo_RtPHb' }
  ]
};

const GDRIVE_API_KEY = 'AIzaSyDkingmUoYbP6aS34PP7dbaI61f5lM3fl0';

export default function App() {
  const [activeSection, setActiveSection] = useState('events');
  const [selectedEventCategory, setSelectedEventCategory] = useState('All');
  const [lightboxItem, setLightboxItem] = useState(null);
  const [showMembersNotice, setShowMembersNotice] = useState(false);

  // Gallery state
  const [galleryTab, setGalleryTab] = useState('photos'); // 'photos' | 'memories' | 'cloud'
  const [selectedDay, setSelectedDay] = useState('Day 1 • 06 Dec 2025');
  const [selectedFolder, setSelectedFolder] = useState(DRIVE_ARCHIVES['Day 1 • 06 Dec 2025'][0]);
  const [drivePhotos, setDrivePhotos] = useState({});
  const [loadingFolder, setLoadingFolder] = useState(false);

  // Contact form state
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Track scroll position for active navigation state
  useEffect(() => {
    const sectionIds = ['events', 'gallery', 'contact'];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
      })
      .catch(() => {
        if (!isMounted) return;
        setDrivePhotos((prev) => ({ ...prev, [folderId]: [] }));
      })
      .finally(() => {
        if (isMounted) setLoadingFolder(false);
      });

    return () => {
      isMounted = false;
    };
  }, [galleryTab, selectedFolder, drivePhotos]);

  // Close modals on Escape key
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLightboxItem(null);
        setShowMembersNotice(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const eventCategories = ['All', ...Array.from(new Set(EVENTS_DATA.map((e) => e.category)))];
  const filteredEvents =
    selectedEventCategory === 'All'
      ? EVENTS_DATA
      : EVENTS_DATA.filter((e) => e.category === selectedEventCategory);

  const featuredEvent = EVENTS_DATA[0];

  const displayedHighlightPhotos =
    galleryTab === 'memories'
      ? HIGHLIGHT_PHOTOS.filter((p) => p.category === 'Memories')
      : HIGHLIGHT_PHOTOS;

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    setSelectedFolder(DRIVE_ARCHIVES[day][0]);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => setContactSubmitted(false), 5000);
    e.target.reset();
  };

  return (
    <div className="app-shell">
      {/* Top Identity Strip (from design scheme header) */}
      <div className="top-identity-bar">
        <div className="identity-inner">
          <div className="identity-brand">
            <img src="/assets/logo/Logo.jpg" alt="JNV Emblem" className="identity-logo" />
            <div className="identity-titles">
              <strong>Jawahar Navodaya Vidyalaya</strong>
              <span>Palair – Alumni Association</span>
            </div>
          </div>

          <div className="identity-motto">
            Connect &nbsp;&bull;&nbsp; Collaborate &nbsp;&bull;&nbsp; Contribute
          </div>

          <div className="identity-ribbon">
            <span className="ribbon-gold-stripe" />
            <span className="ribbon-text">
              A Stronger Alumni Network. A Brighter Future for JNVP.
            </span>
          </div>
        </div>
      </div>

      {/* Main Royal Navy Sticky Navigation Bar */}
      <header className="royal-navbar">
        <div className="royal-navbar-inner">
          <a href="#top" className="navbar-brand">
            <img src="/assets/logo/Logo.jpg" alt="JNV Palair Logo" className="navbar-logo" />
            <div className="navbar-brand-text">
              <span className="navbar-title">Jawahar Navodaya Vidyalaya</span>
              <span className="navbar-subtitle">Palair – Alumni Association</span>
            </div>
          </a>

          <nav className="royal-nav-links" aria-label="Main Navigation">
            <a
              href="#events"
              className={`royal-nav-link ${activeSection === 'events' ? 'active' : ''}`}
              onClick={() => setActiveSection('events')}
            >
              Events
            </a>
            <a
              href="#gallery"
              className={`royal-nav-link ${activeSection === 'gallery' ? 'active' : ''}`}
              onClick={() => setActiveSection('gallery')}
            >
              Gallery
            </a>
            <a
              href="#contact"
              className={`royal-nav-link ${activeSection === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveSection('contact')}
            >
              Contact Us
            </a>
          </nav>

          {/* Top-Right Members Icon (Implementation Later) */}
          <div className="navbar-right-actions">
            <button
              type="button"
              className="members-top-btn"
              onClick={() => setShowMembersNotice(true)}
              title="Members Portal (Implementation Later)"
              aria-label="Members Portal"
            >
              <span className="members-avatar-ring">
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </span>
              <span className="members-top-label">Members</span>
            </button>
          </div>
        </div>
      </header>

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
            {/* Royal Navy Section Header Bar */}
            <div className="scheme-navy-header">
              <div>
                <h2>Events</h2>
                <p>Stay updated with alumni events, campus meets, and activities</p>
              </div>
              <a href="#contact" className="navy-header-link">
                Host / Inquire &rarr;
              </a>
            </div>

            {/* White Tab Bar with Gold Active Underline */}
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
              {/* Featured Banner Row (Matching "Events" panel in mockup) */}
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
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {featuredEvent.location} &nbsp;&bull;&nbsp; {featuredEvent.time}
                    </p>
                    <p className="featured-desc">{featuredEvent.description}</p>
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
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setLightboxItem({
                          title: featuredEvent.title,
                          subtitle: `${featuredEvent.location} • ${featuredEvent.date} at ${featuredEvent.time}`,
                          src: featuredEvent.image
                        });
                      }
                    }}
                  >
                    <img src={featuredEvent.image} alt={featuredEvent.title} />
                  </div>
                </div>
              )}

              {/* Events Grid */}
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
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setLightboxItem({
                            title: ev.title,
                            subtitle: `${ev.location} • ${ev.date} at ${ev.time}`,
                            src: ev.image
                          });
                        }
                      }}
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

            {/* White Tab Bar with Gold Active Underline (matching mockup Gallery card: Photos | Memories | Milan 2025 Cloud Albums) */}
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
            </div>

            <div className="scheme-card-body">
              {galleryTab !== 'cloud' ? (
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
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setLightboxItem({
                            title: photo.title,
                            subtitle: photo.category,
                            src: photo.src
                          });
                        }
                      }}
                    >
                      <img src={photo.src} alt={photo.title} loading="lazy" />
                      <div className="scheme-photo-caption">
                        <span>{photo.category}</span>
                        <h4>{photo.title}</h4>
                      </div>
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
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                        </svg>
                        {folder.name}
                      </button>
                    ))}
                  </div>

                  {loadingFolder ? (
                    <div className="cloud-loading-state">
                      <div className="scheme-spinner" />
                      <p>Loading photos from "{selectedFolder?.name}"...</p>
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
                    <div className="scheme-contact-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <div>
                      <span className="contact-label">Alumni Helpdesk Phone</span>
                      <h4>
                        <a href="tel:+918742273025">+91 87422 73025</a>
                      </h4>
                      <p>Available for alumni event &amp; registration assistance</p>
                    </div>
                  </div>

                  <div className="scheme-contact-box">
                    <div className="scheme-contact-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </div>
                    <div>
                      <span className="contact-label">Official Email</span>
                      <h4>
                        <a href="mailto:jnvpkmmalumni@gmail.com">jnvpkmmalumni@gmail.com</a>
                      </h4>
                      <p>Write to the association executive committee</p>
                    </div>
                  </div>

                  <div className="scheme-contact-box">
                    <div className="scheme-contact-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
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

                  <button type="submit" className="btn-gold-pill btn-full">
                    Send Message &rarr;
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Royal Navy Pillars Banner (Exact match to bottom bar of uploaded design scheme) */}
      <footer className="royal-footer">
        <div className="footer-pillars-bar">
          <div className="footer-pillar">
            <div className="pillar-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                <path d="M3 21h18" />
                <path d="M5 21V7l7-4 7 4v14" />
                <path d="M9 21v-5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v5" />
              </svg>
            </div>
            <div>
              <strong>Support Our School</strong>
              <span>Build a Better JNVP</span>
            </div>
          </div>

          <div className="footer-pillar">
            <div className="pillar-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <strong>Network with Alumni</strong>
              <span>Across the World</span>
            </div>
          </div>

          <div className="footer-pillar">
            <div className="pillar-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            </div>
            <div>
              <strong>Grow Your Career</strong>
              <span>With Alumni Support</span>
            </div>
          </div>

          <div className="footer-pillar">
            <div className="pillar-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <div>
              <strong>Give Back</strong>
              <span>For Future Generations</span>
            </div>
          </div>

          <div className="footer-cta-wrap">
            <a href="#contact" className="btn-gold-pill">
              Join the JNVP Alumni Association Today &rarr;
            </a>
          </div>
        </div>

        <div className="footer-copyright-bar">
          <span>&copy; {new Date().getFullYear()} Jawahar Navodaya Vidyalaya Palair – Alumni Association. All rights reserved.</span>
          <div className="footer-quick-links">
            <a href="#events">Events</a>
            <a href="#gallery">Gallery</a>
            <a href="#contact">Contact Us</a>
          </div>
        </div>
      </footer>

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

      {/* Top-Right Members Icon Modal (To Be Implemented Later) */}
      {showMembersNotice && (
        <div
          className="modal-backdrop"
          onClick={() => setShowMembersNotice(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="members-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="members-modal-header">
              <div className="members-modal-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3>Alumni Members Portal</h3>
            </div>
            <div className="members-modal-body">
              <p>
                The <strong>Members Dashboard, Alumni Directory, and Batch Community</strong> login
                will be connected here in the next phase of implementation.
              </p>
              <button
                type="button"
                className="btn-gold-pill"
                onClick={() => setShowMembersNotice(false)}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
