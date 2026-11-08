import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { slugFile, thumbMap, buildPrompt } from '../src/lib/data.js';

test('page slugs map to static filenames', () => {
  assert.equal(slugFile('/components/introduction'), 'components__introduction');
  assert.equal(slugFile('/setup'), 'setup');
  assert.throws(() => slugFile('/components/../private'));
  assert.throws(() => slugFile('/components/hello?x=1'));
  assert.throws(() => slugFile('/'));
});

test('all documentation navigation entries point to bundled snapshots', () => {
  const nav = JSON.parse(readFileSync(new URL('../public/nav.json', import.meta.url), 'utf8'));
  const files = new Set(readdirSync(new URL('../public/pages/', import.meta.url)));
  const missing = nav.flatMap((group) => [group, ...group.items])
    .filter((item) => item.href.startsWith('/components/') || item.href === '/components')
    .filter((item) => !files.has(slugFile(item.href) + '.json'));
  assert.deepEqual(missing.map((item) => item.href), []);
});

test('thumb map includes only declared thumbnails and AI prompt uses route', () => {
  const map = thumbMap([{ href: '/components/ai', items: [
    { href: '/components/ai-chat', thumb: true },
    { href: '/components/mcp', thumb: false },
  ] }]);
  assert.equal(map.get('/components/ai-chat'), '/thumbs/ai-chat.webp');
  assert.equal(map.has('/components/mcp'), false);
  assert.match(buildPrompt('/components/ai-chat', 'AI Chat'), /ai-chat\.md/);
});
