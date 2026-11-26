import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = location.pathname === '/';
  const isApproved = profile?.status === 'approved';
  const canApprove =
    isApproved && ['batch_rep', 'office_bearer', 'super_admin'].includes(profile?.role);
  const isAdmin = isApproved && ['office_bearer', 'super_admin'].includes(profile?.role);

  const handleSignOut = async () => {
    setMenuOpen(false);
    await signOut();
    navigate('/');
  };

  return (
    <div className="app-shell">
      {/* Top Identity Strip */}
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
          <Link to="/" className="navbar-brand">
            <img src="/assets/logo/Logo.jpg" alt="JNV Palair Logo" className="navbar-logo" />
            <div className="navbar-brand-text">
              <span className="navbar-title">Jawahar Navodaya Vidyalaya</span>
              <span className="navbar-subtitle">Palair – Alumni Association</span>
            </div>
          </Link>

          <nav className="royal-nav-links" aria-label="Main Navigation">
            <Link
              to="/about"
              className={`royal-nav-link ${location.pathname === '/about' ? 'active' : ''}`}
            >
              About
            </Link>
            {isHome ? (
              <a href="#events" className="royal-nav-link">
                Events
              </a>
            ) : (
              <Link
                to="/events"
                className={`royal-nav-link ${location.pathname === '/events' ? 'active' : ''}`}
              >
                Events
              </Link>
            )}
            <Link
              to="/announcements"
              className={`royal-nav-link ${location.pathname === '/announcements' ? 'active' : ''}`}
            >
              Announcements
            </Link>
            {isHome ? (
              <>
                <a href="#gallery" className="royal-nav-link">
                  Gallery
                </a>
                <a href="#contact" className="royal-nav-link">
                  Contact Us
                </a>
              </>
            ) : (
              <Link to="/#contact" className="royal-nav-link">
                Contact Us
              </Link>
            )}
          </nav>

          {/* Auth-Aware Members Portal Navigation */}
          <div className="navbar-right-actions members-menu-wrap">
            {!user ? (
              <Link
                to="/login"
                className="members-top-btn"
                aria-label="Members Portal Sign In"
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
              </Link>
            ) : (
              <>
                <button
                  type="button"
                  className="members-top-btn"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  aria-expanded={menuOpen}
                  aria-label="Members Menu"
                >
                  <span className="members-avatar-ring">
                    {(profile?.full_name || user.email || 'A').charAt(0).toUpperCase()}
                  </span>
                  <span className="members-top-label">
                    {profile?.full_name?.split(' ')[0] || 'Member'}
                  </span>
                </button>
                {menuOpen && (
                  <div className="members-dropdown" role="menu">
                    {isApproved && (
                      <Link to="/directory" onClick={() => setMenuOpen(false)}>
                        Alumni Directory
                      </Link>
                    )}
                    <Link
                      to={profile ? '/profile' : '/onboarding'}
                      onClick={() => setMenuOpen(false)}
                    >
                      {profile ? 'My Profile' : 'Complete Onboarding'}
                    </Link>
                    {profile?.status === 'pending' && (
                      <Link to="/pending" onClick={() => setMenuOpen(false)}>
                        Verification Status
                      </Link>
                    )}
                    {canApprove && (
                      <Link to="/approvals" onClick={() => setMenuOpen(false)}>
                        Approval Queue
                      </Link>
                    )}
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setMenuOpen(false)}>
                        Committee Admin
                      </Link>
                    )}
                    <button type="button" onClick={handleSignOut}>
                      Sign Out
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {children}

      {/* Bottom Royal Navy Pillars Banner */}
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
            <Link to="/login" className="btn-gold-pill">
              Join the JNVP Alumni Association Today &rarr;
            </Link>
          </div>
        </div>

        <div className="footer-copyright-bar">
          <span>
            &copy; {new Date().getFullYear()} Jawahar Navodaya Vidyalaya Palair – Alumni
            Association. All rights reserved.
          </span>
          <div className="footer-quick-links">
            <Link to="/about">About</Link>
            <Link to="/events">Events</Link>
            <Link to="/announcements">Announcements</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
