import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
const base = 'http://127.0.0.1:5173';

async function visit(path, title) {
  await page.goto(base + '/#' + path, { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { level: 1, name: title }).waitFor();
  assert.equal(await page.getByRole('heading', { level: 1 }).count(), 1, title);
}

try {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);

  // React guide header, inline page actions, pagination portal.
  await visit('/components/introduction', 'Introduction');
  await page.getByRole('button', { name: 'Copy Page' }).click();
  await page.getByRole('button', { name: 'Copy Page' }).getByText('Copied').waitFor();
  await page.getByRole('button', { name: 'Open in an AI assistant' }).click();
  assert.equal(await page.getByRole('menuitem').count(), 4);
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('menuitem').count(), 0);
  await page.getByRole('link', { name: 'Next page: Installation' }).click();
  await page.getByRole('heading', { level: 1, name: 'Installation' }).waitFor();
  assert.equal(await page.getByRole('navigation', { name: 'Docs pagination' }).count(), 1);

  // Four large categories + one additional category must render React cards.
  for (const [slug, title, count] of [
    ['ai', 'AI Chat and Agent UI Components for React', 12],
    ['webgl', 'WebGL Shader Backgrounds for React', 21],
    ['media', 'Media and Card Components for React', 28],
    ['controls', 'Animated React Controls: Pickers, Inputs, and Menus', 24],
    ['footers', 'Animated Footers for React', 3],
  ]) {
    await visit('/components/' + slug, title);
    assert.equal(await page.locator('main a.group').count(), count, slug + ' cards');
    assert.equal(await page.getByRole('heading', { name: 'FAQ', exact: true }).count(), 1);
  }

  // Command palette keyboard navigation and component detail fallback.
  await visit('/components/introduction', 'Introduction');
  await page.keyboard.press('Control+k');
  const search = page.getByRole('combobox', { name: 'Search pages and components' });
  await search.fill('photo stack');
  await page.getByRole('option', { name: 'Photo Stack' }).waitFor();
  await search.press('Enter');
  await page.getByRole('heading', { level: 1, name: 'Photo Stack' }).waitFor();

  // Theme is React-owned, persists between route changes and reloads.
  const before = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  await page.getByRole('button', { name: before ? 'Switch to light theme' : 'Switch to dark theme' }).click();
  await page.reload();
  assert.equal(await page.evaluate(() => document.documentElement.classList.contains('dark')), !before);

  // Mobile navigation drawer must close when a page is selected.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.locator('aside[aria-hidden="false"]').waitFor();
  await page.locator('#docs-sidebar').getByRole('link', { name: 'AI', exact: true }).click();
  await page.getByRole('heading', { level: 1, name: 'AI Chat and Agent UI Components for React' }).waitFor();
  await page.locator('aside[aria-hidden="true"]').waitFor();
  assert.deepEqual(errors, [], 'Uncaught browser errors');
  console.log('Browser smoke: guides, Copy Page, AI, pagination, categories, search, theme, mobile passed.');
} finally {
  await browser.close();
}
