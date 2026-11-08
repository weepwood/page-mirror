import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSearchResults, moveSelection, normalizeSearch } from '../src/lib/search.js';

const groups = [
  { label: 'Media', items: [
    { label: 'Photo Stack', href: '/components/photo-stack' },
    { label: 'Apple Music Card', href: '/components/apple-music-card' },
  ] },
  { label: 'Controls', items: [{ label: 'Search Box', href: '/components/search-box' }] },
];
const quick = [{ label: 'Introduction', href: '/components/introduction' }];

test('searches label or route, case-insensitively', () => {
  assert.equal(buildSearchResults(groups, quick, 'PHOTO')[0].label, 'Photo Stack');
  assert.equal(buildSearchResults(groups, quick, 'apple-music')[0].label, 'Apple Music Card');
  assert.equal(buildSearchResults(groups, quick, 'zz').length, 0);
  assert.equal(normalizeSearch(' ＡＢＣ '), 'abc');
});

test('deduplicates quick links ahead of group links', () => {
  const result = buildSearchResults(groups, [{ label: 'Photo Stack', href: '/components/photo-stack' }], '');
  assert.equal(result.filter((item) => item.href === '/components/photo-stack').length, 1);
  assert.equal(result[0].group, 'Navigate');
});

test('arrow navigation wraps and empty results do not underflow', () => {
  assert.equal(moveSelection(2, 3, 'ArrowDown'), 0);
  assert.equal(moveSelection(0, 3, 'ArrowUp'), 2);
  assert.equal(moveSelection(0, 3, 'End'), 2);
  assert.equal(moveSelection(2, 3, 'Home'), 0);
  assert.equal(moveSelection(0, 0, 'ArrowUp'), 0);
});
