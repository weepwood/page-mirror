import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadSources, root } from '../scripts/mirror-config.mjs';

test('镜像源清单不含私有仓库或重复目标', () => {
  const sources = loadSources();
  assert.ok(sources.length > 0);
  assert.equal(new Set(sources.map(s => s.slug)).size, sources.length);
  for (const site of sources) {
    assert.match(site.repository, /^weepwood\/[a-z0-9._-]+-mirror$/i);
    assert.ok(['static', 'vite'].includes(site.kind));
  }
});

test('已登记的迁移项具备可追溯源信息', () => {
  const registry = JSON.parse(readFileSync(resolve(root, 'sites/registry.json'), 'utf8'));
  for (const site of registry.sites) {
    if (!site.sourceRepository) continue;
    const dir = resolve(root, 'sites', site.slug);
    const marker = JSON.parse(readFileSync(resolve(dir, 'MIRROR-IMPORT.json'), 'utf8'));
    assert.equal(marker.repository, site.sourceRepository);
    assert.ok(existsSync(resolve(dir, 'index.html')));
    assert.match(marker.commit, /^[0-9a-f]{40}$/i);
  }
});

test('不同站点拥有隔离路径', () => {
  const registry = JSON.parse(readFileSync(resolve(root, 'sites/registry.json'), 'utf8'));
  const paths = registry.sites.map(x => x.previewPath);
  assert.equal(new Set(paths).size, paths.length);
  for (const site of registry.sites) {
    assert.equal(site.previewPath, 'sites/' + site.slug + '/');
  }
});
