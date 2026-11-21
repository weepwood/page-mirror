import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { rewriteAstroAssetUrls } from '../scripts/rewrite-astro-urls.mjs';

test('Astro hydration modules and inline fonts use their own site base', () => {
  const root = mkdtempSync(join(tmpdir(), 'mirror-astro-'));
  try {
    mkdirSync(join(root, '_astro'));
    const html = '<astro-island component-url="/_astro/Hero.js" renderer-url="/_astro/client.js"></astro-island><style>@font-face{src:url("/_astro/fonts/font.woff2")}</style><a href="https://example.com/_astro/file.js">external</a>';
    const actual = rewriteAstroAssetUrls(html, root, join(root, 'index.html'));
    assert.match(actual, /component-url="\.\/_astro\/Hero\.js"/);
    assert.match(actual, /renderer-url="\.\/_astro\/client\.js"/);
    assert.match(actual, /url\("\.\/_astro\/fonts\/font\.woff2"\)/);
    assert.match(actual, /https:\/\/example\.com\/_astro\/file\.js/);
    const nested = rewriteAstroAssetUrls('<astro-island component-url="/_astro/Hero.js">', root, join(root, 'nested', 'index.html'));
    assert.match(nested, /component-url="\.\.\/_astro\/Hero\.js"/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('non-Astro mirrors retain their original HTML', () => {
  const root = mkdtempSync(join(tmpdir(), 'mirror-plain-'));
  try {
    const html = '<a href="/_astro/not-a-local-asset.js">link</a>';
    assert.equal(rewriteAstroAssetUrls(html, root, join(root, 'index.html')), html);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
