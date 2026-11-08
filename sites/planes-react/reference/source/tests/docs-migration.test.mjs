import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');
const nav = JSON.parse(read('../public/nav.json'));
const data = JSON.parse(read('../src/data/category-pages.json'));
const categories = nav.filter((group) => group.href !== '/components')
  .map((group) => group.href.split('/').pop());

test('all 12 migrated categories have complete typed descriptions, cards and FAQ data', () => {
  assert.equal(categories.length, 12);
  for (const slug of categories) {
    const group = nav.find((entry) => entry.href === '/components/' + slug);
    const entry = data[slug];
    const source = JSON.parse(read('../public/pages/components__' + slug + '.json'));
    assert.ok(group && entry && source);
    assert.ok(entry.title.length > 6);
    assert.ok(entry.description.length > 20);
    assert.match(source.html, new RegExp(entry.title.replace(/[.*+?^$\{\}()|[\]\\]/g, '\\$&')));
    assert.equal(entry.faq.length, (source.html.match(/<dt\b/g) || []).length);
    assert.ok(entry.faq.every((q) => q.question.length > 5 && q.answer.length > 10));
    const slugs = new Set(group.items.map((item) => item.href.split('/').pop()));
    assert.ok(entry.pro.every((slug) => slugs.has(slug)), 'Pro badge should belong to a card');
    assert.equal(new Set(entry.pro).size, entry.pro.length);
  }
});

test('guide source pages still contain the expected header and pagination slots', () => {
  for (const slug of ['introduction', 'installation', 'mcp']) {
    const source = JSON.parse(read('../public/pages/components__' + slug + '.json'));
    assert.match(source.html, /<main[^>]*><article/);
    assert.match(source.html, /<header[^>]*>/);
    assert.match(source.html, /aria-label="Copy Page"/);
    assert.match(source.html, /aria-label="Docs pagination"/);
  }
});

test('UI manages guide actions in React and keeps category pages out of legacy fetch', () => {
  const actions = read('../src/components/DocsActions.jsx');
  const pagination = read('../src/components/DocsPagination.jsx');
  const categoriesUi = read('../src/components/CategoryPage.jsx');
  const guide = read('../src/components/GuidePage.jsx');
  const layout = read('../src/components/Layout.jsx');
  const legacy = read('../src/hooks/useSnapshotInteractions.js');

  assert.match(actions, /navigator\.clipboard\.writeText/);
  assert.match(actions, /role="menu"/);
  assert.match(pagination, /<Link/);
  assert.match(guide, /createPortal/);
  assert.match(categoriesUi, /<CategoryCard/);
  assert.doesNotMatch(categoriesUi, /dangerouslySetInnerHTML/);
  assert.match(layout, /getCategoryData\(pathname\)/);
  assert.doesNotMatch(legacy, /AI_BASES|buildPrompt|label === 'Copy Page'|label === 'Open in an AI assistant'/);
});
