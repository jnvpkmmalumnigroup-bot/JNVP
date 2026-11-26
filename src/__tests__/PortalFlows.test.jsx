import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { AppRoutes } from '../App';

function renderAt(route, initialAuth = null) {
  return render(
    <AuthProvider initialAuth={initialAuth}>
      <MemoryRouter initialEntries={[route]}>
        <AppRoutes />
      </MemoryRouter>
    </AuthProvider>
  );
}

const APPROVED_AUTH = {
  session: { access_token: 'tok-approved', user: { id: 'u1', email: 'ananya@jnvp.org' } },
  profile: {
    id: 'u1',
    full_name: 'Ananya Reddy',
    email: 'ananya@jnvp.org',
    batch_year: 2006,
    house: 'Aravali',
    city: 'Hyderabad',
    profession: 'Doctor',
    role: 'member',
    status: 'approved',
    visibility: { show_phone: false, show_email: false, show_address: false }
  }
};

const BATCH_REP_AUTH = {
  session: { access_token: 'tok-rep', user: { id: 'rep1', email: 'rep@jnvp.org' } },
  profile: {
    id: 'rep1',
    full_name: 'Batch 2006 Rep',
    batch_year: 2006,
    role: 'batch_rep',
    status: 'approved',
    assigned_batches: [2006]
  }
};

describe('JNVP Portal Flows (Auth, Onboarding, Directory, Approvals, Events, About, Privacy)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders /login with Google OAuth primary and Magic Link fallback', async () => {
    const user = userEvent.setup();
    renderAt('/login');

    expect(screen.getByRole('button', { name: /Continue with Google/i })).toBeInTheDocument();
    await user.type(screen.getByLabelText(/Email Address/i), 'alumnus@jnvp.org');
    await user.click(screen.getByRole('button', { name: /Send Magic Link/i }));
    expect(await screen.findByText(/alumnus@jnvp.org/i)).toBeInTheDocument();
  });

  it('enforces multi-step onboarding with default-OFF visibility and mandatory DPDP consent', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          id: 'u-new',
          full_name: 'Dinesh Pallepogu',
          batch_year: 2006,
          status: 'pending',
          role: 'member'
        })
      })
    );

    renderAt('/onboarding', {
      session: { access_token: 'tok-new', user: { id: 'u-new', email: 'dinesh@jnvp.org' } },
      profile: null
    });

    await user.type(screen.getByLabelText(/Full Name/i), 'Dinesh Pallepogu');
    await user.click(screen.getByRole('button', { name: /Next: Career/i }));
    await user.type(screen.getByLabelText(/Current City/i), 'Hyderabad');
    await user.click(screen.getByRole('button', { name: /Next: Privacy Controls/i }));

    // Phone & Email hidden by default
    expect(screen.getByLabelText(/Show my Phone Number/i)).not.toBeChecked();
    expect(screen.getByLabelText(/Show my Email Address/i)).not.toBeChecked();

    // Submitting without consent shows validation error
    await user.click(screen.getByRole('button', { name: /Submit for Batch-Rep Verification/i }));
    expect(screen.getByText(/must accept the DPDP Act 2023/i)).toBeInTheDocument();

    // Accept consent and submit -> redirects to /pending
    await user.click(screen.getByLabelText(/Accept DPDP Privacy Consent/i));
    await user.click(screen.getByRole('button', { name: /Submit for Batch-Rep Verification/i }));
    expect(await screen.findByText(/Your Profile Is Under Batch-Rep Review/i)).toBeInTheDocument();
  });

  it('supports DPDP Delete My Account confirmation on /profile', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'deleted' })
    });
    vi.stubGlobal('fetch', fetchMock);

    renderAt('/profile', APPROVED_AUTH);

    await user.click(screen.getByRole('button', { name: /^Delete My Account$/i }));
    expect(screen.getByText(/Are you sure/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Yes, Permanently Delete My Account/i }));

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/profiles/me'),
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('renders /directory for approved members with masked contact details and blocks logged-out users', async () => {
    renderAt('/directory');
    expect(screen.getByText(/visible only to signed-in, approved alumni/i)).toBeInTheDocument();

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          total: 1,
          page: 1,
          page_size: 12,
          items: [
            {
              id: 'u2',
              full_name: 'Karthik Rao',
              batch_year: 2006,
              house: 'Nilgiri',
              city: 'Bengaluru',
              country: 'India',
              profession: 'Software Engineer',
              phone: null,
              email: null
            }
          ]
        })
      })
    );

    renderAt('/directory', APPROVED_AUTH);
    expect(await screen.findByText('Karthik Rao')).toBeInTheDocument();
    expect(screen.getByText(/Contact details hidden by member/i)).toBeInTheDocument();
  });

  it('allows batch rep to approve pending profiles in /approvals', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [
            {
              id: 'p-1',
              full_name: 'Suresh Babu',
              batch_year: 2006,
              house: 'Shivalik',
              city: 'Khammam',
              admission_no: 'ADM-2006-99'
            }
          ]
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: 'p-1', status: 'approved' })
        })
    );

    renderAt('/approvals', BATCH_REP_AUTH);
    expect(await screen.findByText('Suresh Babu')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /^Approve$/i }));
    expect(await screen.findByText(/Profile approved and logged/i)).toBeInTheDocument();
    expect(screen.queryByText('Suresh Babu')).not.toBeInTheDocument();
  });

  it('renders /about with Bye-Laws & Registration Certificate PDFs, /announcements, /privacy, and /404', () => {
    const { unmount } = renderAt('/about');
    expect(screen.getByRole('link', { name: /Bye-Laws/i })).toHaveAttribute(
      'href',
      '/assets/gallery/BYE-LAWS OF ALUMNI.pdf'
    );
    expect(screen.getByRole('link', { name: /Registration Certificate/i })).toHaveAttribute(
      'href',
      '/assets/gallery/Registration_certificate.pdf'
    );
    unmount();

    const { unmount: unmountAnn } = renderAt('/announcements');
    expect(screen.getByRole('heading', { name: /News & Announcements/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Join WhatsApp Channel/i })).toBeInTheDocument();
    unmountAnn();

    const { unmount: unmountPriv } = renderAt('/privacy');
    expect(screen.getByRole('heading', { name: /Privacy Policy & DPDP Act 2023/i })).toBeInTheDocument();
    unmountPriv();

    renderAt('/some-nonexistent-page');
    expect(screen.getByText(/404 • Page Not Found/i)).toBeInTheDocument();
  });
});
