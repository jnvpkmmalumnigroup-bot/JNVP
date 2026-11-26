const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');

async function request(path, { method = 'GET', token = null, body = null } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  if (!response.ok) {
    let detail = `Request failed (${response.status})`;
    try {
      const errData = await response.json();
      if (errData?.detail) {
        detail = typeof errData.detail === 'string' ? errData.detail : JSON.stringify(errData.detail);
      }
    } catch {
      // ignore non-JSON error body
    }
    const err = new Error(detail);
    err.status = response.status;
    throw err;
  }

  return response.json();
}

export const api = {
  health: () => request('/health'),

  // Profiles
  getMyProfile: (token) => request('/api/profiles/me', { token }),
  upsertMyProfile: (token, payload) =>
    request('/api/profiles/me', { method: 'PUT', token, body: payload }),
  deleteMyAccount: (token) => request('/api/profiles/me', { method: 'DELETE', token }),

  // Directory
  searchDirectory: (token, params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') qs.set(k, String(v));
    });
    const suffix = qs.toString() ? `?${qs.toString()}` : '';
    return request(`/api/directory${suffix}`, { token });
  },

  // Approvals
  getPendingApprovals: (token) => request('/api/approvals/pending', { token }),
  decideApproval: (token, profileId, status, reason = '') =>
    request(`/api/approvals/${profileId}`, {
      method: 'POST',
      token,
      body: { status, reason: reason || null }
    }),

  // Events & RSVPs
  getEvents: () => request('/api/events'),
  getMyRsvps: (token) => request('/api/events/my-rsvps', { token }),
  rsvpEvent: (token, eventId, guestCount, notes = '') =>
    request(`/api/events/${eventId}/rsvp`, {
      method: 'POST',
      token,
      body: { guest_count: Number(guestCount), notes: notes || null }
    }),
  cancelRsvp: (token, eventId) =>
    request(`/api/events/${eventId}/rsvp`, { method: 'DELETE', token }),
  createEvent: (token, payload) =>
    request('/api/admin/events', { method: 'POST', token, body: payload }),
  deleteEvent: (token, eventId) =>
    request(`/api/admin/events/${eventId}`, { method: 'DELETE', token }),

  // Announcements (Posts)
  getPosts: () => request('/api/posts'),
  createPost: (token, payload) =>
    request('/api/admin/posts', { method: 'POST', token, body: payload }),
  deletePost: (token, postId) =>
    request(`/api/admin/posts/${postId}`, { method: 'DELETE', token }),

  // Galleries
  getGalleries: () => request('/api/galleries'),
  createGallery: (token, payload) =>
    request('/api/admin/galleries', { method: 'POST', token, body: payload }),
  deleteGallery: (token, galleryId) =>
    request(`/api/admin/galleries/${galleryId}`, { method: 'DELETE', token }),

  // Contact
  submitContact: (payload) => request('/api/contact', { method: 'POST', body: payload }),

  // Admin
  getAuditLogs: (token) => request('/api/admin/audit-logs', { token })
};
