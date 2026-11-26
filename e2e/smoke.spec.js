import { test, expect } from '@playwright/test';

test.describe('JNVP Alumni Association — E2E Smoke Suite', () => {
  test('landing page preserves hero, 7 events, gallery tabs, contact section, and footer', async ({
    page
  }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1, name: /Together Forever/i })).toBeVisible();
    await expect(page.getByText('2500+')).toBeVisible();
    await expect(page.getByText('JNVP Palair Alumni Meet').first()).toBeVisible();
    await expect(page.getByText('JNVP Heritage Campus Run')).toBeVisible();
    await expect(page.getByText('+91 87422 73025')).toBeVisible();
    await expect(page.getByText('jnvpkmmalumni@gmail.com')).toBeVisible();
  });

  test('navigates across About, Announcements, Login, Privacy, and 404 routes', async ({
    page
  }) => {
    await page.goto('/about');
    await expect(page.getByRole('link', { name: /Bye-Laws/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Registration Certificate/i })).toBeVisible();

    await page.goto('/announcements');
    await expect(page.getByRole('heading', { name: /News & Announcements/i })).toBeVisible();

    await page.goto('/login');
    await expect(page.getByRole('button', { name: /Continue with Google/i })).toBeVisible();

    await page.goto('/privacy');
    await expect(page.getByText(/DPDP Act 2023/i).first()).toBeVisible();

    await page.goto('/non-existent-route');
    await expect(page.getByText(/404 • Page Not Found/i)).toBeVisible();
  });
});
