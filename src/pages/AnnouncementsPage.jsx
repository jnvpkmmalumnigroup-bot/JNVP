import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { SEED_POSTS } from '../data/seedData';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function AnnouncementsPage() {
  const { token, profile } = useAuth();
  const [posts, setPosts] = useState(SEED_POSTS);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [bodyMarkdown, setBodyMarkdown] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const isOfficeBearer =
    profile?.status === 'approved' && ['office_bearer', 'super_admin'].includes(profile?.role);

  useEffect(() => {
    api
      .getPosts()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setPosts(data);
      })
      .catch(() => {});
  }, []);

  const handlePublish = async (e) => {
    e.preventDefault();
    try {
      const created = await api.createPost(token, {
        title,
        summary,
        body_markdown: bodyMarkdown,
        pinned: false,
        published: true
      });
      setPosts((prev) => [created, ...prev]);
      setTitle('');
      setSummary('');
      setBodyMarkdown('');
      setStatusMsg('Announcement published!');
    } catch (err) {
      setStatusMsg(err.message || 'Could not publish announcement.');
    }
  };

  return (
    <main className="portal-page">
      <div className="portal-hero-banner">
        <div>
          <h1>News &amp; Announcements</h1>
          <p>
            Official updates from the JNVP Palair Alumni Association Executive Committee.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <a
            href={import.meta.env.VITE_WHATSAPP_CHANNEL_URL || 'https://whatsapp.com/channel/'}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold-pill btn-sm"
          >
            Join WhatsApp Channel ↗
          </a>
          <a
            href={import.meta.env.VITE_GOOGLE_GROUP_URL || 'https://groups.google.com/'}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-navy-outline"
          >
            Official Google Group ↗
          </a>
        </div>
      </div>

      {statusMsg && <div className="portal-alert portal-alert-success">{statusMsg}</div>}

      {isOfficeBearer && (
        <section className="portal-card">
          <h2 style={{ color: 'var(--jnv-navy-900)', marginBottom: '0.75rem' }}>
            Publish New Announcement (Markdown)
          </h2>
          <form onSubmit={handlePublish}>
            <div className="portal-field">
              <label htmlFor="postTitle">Title</label>
              <input
                id="postTitle"
                className="portal-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="portal-field">
              <label htmlFor="postSummary">Short Summary</label>
              <input
                id="postSummary"
                className="portal-input"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>
            <div className="portal-field">
              <label htmlFor="postMarkdown">Markdown Content</label>
              <textarea
                id="postMarkdown"
                rows="4"
                className="portal-textarea"
                value={bodyMarkdown}
                onChange={(e) => setBodyMarkdown(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-gold-pill">
              Publish Announcement &rarr;
            </button>
          </form>
        </section>
      )}

      {posts.map((post) => (
        <article key={post.id} className="portal-card">
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
            {post.pinned && <span className="portal-badge">Pinned</span>}
            <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              {new Date(post.published_at).toLocaleDateString()}
            </span>
          </div>
          <h2 style={{ color: 'var(--jnv-navy-900)', marginBottom: '0.45rem' }}>{post.title}</h2>
          {post.summary && (
            <p style={{ fontWeight: 500, color: 'var(--jnv-navy-700)', marginBottom: '0.85rem' }}>
              {post.summary}
            </p>
          )}
          <div className="markdown-body">
            <ReactMarkdown>{post.body_markdown}</ReactMarkdown>
          </div>
        </article>
      ))}
    </main>
  );
}
