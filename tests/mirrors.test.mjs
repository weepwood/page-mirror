import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadSources, root } from '../scripts/mirror-config.mjs';
import { collectRegistryErrors, STATUSES } from '../scripts/registry-rules.mjs';

const readRegistry = () => JSON.parse(readFileSync(resolve(root, 'sites/registry.json'), 'utf8'));

test('镜像源清单不含私有仓库或重复目标', () => {
  const sources = loadSources();
  assert.ok(sources.length > 0);
  assert.equal(new Set(sources.map(s => s.slug)).size, sources.length);
  for (const site of sources) {
    assert.match(site.repository, /^weepwood\/[a-z0-9._-]+-mirror$/i);
    assert.ok(['static', 'vite'].includes(site.kind));
  }
});

test('站点清单通过统一校验规则（含来源记录一致性）', () => {
  assert.deepEqual(collectRegistryErrors(readRegistry(), root), []);
});

test('不同站点拥有隔离路径且状态合法', () => {
  const sites = readRegistry().sites;
  const paths = sites.map(x => x.previewPath);
  assert.equal(new Set(paths).size, paths.length);
  for (const site of sites) {
    assert.equal(site.previewPath, 'sites/' + site.slug + '/');
    assert.ok(STATUSES.has(site.status));
  }
});
