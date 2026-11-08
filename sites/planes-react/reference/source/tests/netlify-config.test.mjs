import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

test('Netlify deploy publishes the Vite build at the root', () => {
  const toml = read('../netlify.toml');
  const pkg = JSON.parse(read('../package.json'));
  assert.match(toml, /command\s*=\s*"npm run build"/);
  assert.match(toml, /publish\s*=\s*"dist"/);
  assert.match(toml, /NODE_VERSION\s*=\s*"22"/);
  assert.match(toml, /X-Robots-Tag\s*=\s*"noindex, nofollow"/);
  assert.ok(pkg.scripts.build);
  assert.doesNotMatch(toml, /from\s*=\s*"\/\*"/);
});

test('local Netlify credentials are not tracked', () => {
  assert.match(read('../.gitignore'), /\.netlify\//);
});
