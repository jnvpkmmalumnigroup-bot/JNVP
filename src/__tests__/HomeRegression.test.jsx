import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('Baseline Regression Suite — Existing JNVP Landing Page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders top identity strip, Royal Navy navbar, campus hero, and 4 stats', () => {
    render(<App />);

    expect(screen.getByText(/Connect.*Collaborate.*Contribute/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: /Together Forever/i })).toBeInTheDocument();
    expect(screen.getByText('2500+')).toBeInTheDocument();
    expect(screen.getByText('1991')).toBeInTheDocument();
    expect(screen.getByText('Across India')).toBeInTheDocument();
    expect(screen.getByText('One Family')).toBeInTheDocument();
    expect(screen.getByText('Upcoming Meet')).toBeInTheDocument();
  });

  it('renders all 7 existing events, filters by category, and opens poster lightbox', async () => {
    const user = userEvent.setup();
    render(<App />);

    const eventTitles = [
      'JNVP Palair Alumni Meet',
      'Alumni Medical & Health Camp',
      'Inter-Batch Sports Meet',
      'Morning Fitness & Zumba',
      'Career Guidance & Mentorship',
      'Grand Cultural Programme',
      'JNVP Heritage Campus Run'
    ];
    for (const title of eventTitles) {
      expect(screen.getAllByText(title).length).toBeGreaterThanOrEqual(1);
    }

    // Category filter
    await user.click(screen.getByRole('button', { name: 'Athletics' }));
    expect(screen.getByText('Inter-Batch Sports Meet')).toBeInTheDocument();
    expect(screen.getByText('JNVP Heritage Campus Run')).toBeInTheDocument();
    expect(screen.queryByText('Morning Fitness & Zumba')).not.toBeInTheDocument();

    // Open poster lightbox
    const viewButtons = screen.getAllByRole('button', { name: /View Poster/i });
    await user.click(viewButtons[0]);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: /Close preview/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders Gallery tabs (Photos, Memories, Milan 2025 Cloud Albums) with mocked Drive fetch', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          files: [
            { id: 'file-1', name: 'IMG_001.jpg', mimeType: 'image/jpeg' },
            { id: 'file-2', name: 'IMG_002.jpg', mimeType: 'image/jpeg' }
          ]
        })
      })
    );

    render(<App />);

    expect(screen.getByText('JNV Palair Main Academic Block')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Memories' }));
    expect(screen.getByText('14th Batch Alumni Group')).toBeInTheDocument();
    expect(screen.queryByText('JNV Palair Main Academic Block')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Milan 2025 Cloud Albums' }));
    expect(screen.getByRole('button', { name: /Day 1/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Day 2/i })).toBeInTheDocument();
    expect(await screen.findByAltText('IMG_001.jpg')).toBeInTheDocument();
  });

  it('renders Contact section with phone, email, address, form submission, and 4-pillar footer', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText('+91 87422 73025')).toBeInTheDocument();
    expect(screen.getByText('jnvpkmmalumni@gmail.com')).toBeInTheDocument();
    expect(screen.getByText(/Palair Village, Kusumanchi Mandal/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/Your Name/i), 'Dinesh Pallepogu');
    await user.type(screen.getByLabelText(/Batch Year/i), '2000');
    await user.type(screen.getByLabelText(/Email Address/i), 'dinesh@example.com');
    await user.type(screen.getByLabelText(/Message/i), 'Excited for the alumni meet!');
    await user.click(screen.getByRole('button', { name: /Send Message/i }));

    expect(await screen.findByText(/Thank you for reaching out/i)).toBeInTheDocument();

    // 4-pillar footer
    expect(screen.getByText('Support Our School')).toBeInTheDocument();
    expect(screen.getByText('Network with Alumni')).toBeInTheDocument();
    expect(screen.getByText('Grow Your Career')).toBeInTheDocument();
    expect(screen.getByText('Give Back')).toBeInTheDocument();
  });
});
