import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

test('shell is composed from React components, not HTML string concatenation', () => {
  const layout = read('../src/components/Layout.jsx');
  for (const component of ['Banner', 'Sidebar', 'WorkspaceDock', 'PageSnapshot']) {
    assert.match(layout, new RegExp('<' + component + '\\b'));
  }
  assert.doesNotMatch(layout, /SHELL_A|SHELL_B|fullHtml|htmlRef/);
  assert.equal((layout.match(/dangerouslySetInnerHTML/g) || []).length, 0);
});

test('static HTML injection is limited to the page snapshot boundary', () => {
  const snapshot = read('../src/components/PageSnapshot.jsx');
  assert.match(snapshot, /dangerouslySetInnerHTML/);
  assert.match(snapshot, /display: 'contents'/);
  for (const path of ['../src/components/Banner.jsx', '../src/components/Sidebar.jsx', '../src/components/WorkspaceDock.jsx']) {
    assert.doesNotMatch(read(path), /dangerouslySetInnerHTML/);
  }
});

test('navigation retains semantic routes and accessible sidebar controls', () => {
  const layout = read('../src/components/Layout.jsx');
  assert.match(layout, /aria-controls="docs-sidebar"/);
  const sidebar = read('../src/components/Sidebar.jsx');
  assert.match(sidebar, /<NavLink/);
  assert.match(sidebar, /aria-label="Component documentation"/);
  assert.match(sidebar, /\.inert = !open/);
});
