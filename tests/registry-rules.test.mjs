import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectRegistryErrors, STATUSES, KINDS } from '../scripts/registry-rules.mjs';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const GOOD_MARKER = {
  repository: 'weepwood/demo-mirror', branch: 'main',
  commit: 'a'.repeat(40), importedAt: '2026-11-08', kind: 'static',
};

function setup({ site = {}, index = true, readme = true, marker } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'pm-registry-'));
  const entry = {
    slug: 'demo', name: 'Demo', description: 'Demo site',
    sourceUrl: 'https://example.com/', status: 'review',
    previewPath: 'sites/demo/', readme: 'sites/demo/README.md',
    updatedAt: '2026-11-08', kind: 'snapshot', tags: ['static-html'], ...site,
  };
  const dir = join(root, 'sites', entry.slug);
  mkdirSync(dir, { recursive: true });
  if (index) writeFileSync(join(dir, 'index.html'), '');
  if (readme) writeFileSync(join(dir, 'README.md'), '');
  if (marker) writeFileSync(join(dir, 'MIRROR-IMPORT.json'), typeof marker === 'string' ? marker : JSON.stringify(marker));
  return { root, data: { schemaVersion: 1, sites: [entry] }, cleanup: () => rmSync(root, { recursive: true, force: true }) };
}

function expectError(options, fragment) {
  const { root, data, cleanup } = setup(options);
  const errors = collectRegistryErrors(data, root);
  cleanup();
  assert.ok(errors.some(message => message.includes(fragment)), `应捕获「${fragment}」，实际：${errors.join(' | ')}`);
}

test('真实仓库的站点清单通过统一规则', () => {
  const data = JSON.parse(readFileSync(resolve(projectRoot, 'sites/registry.json'), 'utf8'));
  assert.deepEqual(collectRegistryErrors(data, projectRoot), []);
});

test('合法的构造清单没有错误', t => {
  const { root, data, cleanup } = setup();
  t.after(cleanup);
  assert.deepEqual(collectRegistryErrors(data, root), []);
});

test('合法清单带来源记录时没有错误', t => {
  const { root, data, cleanup } = setup({ site: { sourceRepository: GOOD_MARKER.repository }, marker: GOOD_MARKER });
  t.after(cleanup);
  assert.deepEqual(collectRegistryErrors(data, root), []);
});

test('结构错误：schemaVersion 与 sites 类型', t => {
  const { root, cleanup } = setup();
  t.after(cleanup);
  assert.ok(collectRegistryErrors({ schemaVersion: 2, sites: [] }, root).some(e => e.includes('schemaVersion')));
  assert.ok(collectRegistryErrors({ schemaVersion: 1, sites: {} }, root).some(e => e.includes('sites 必须是数组')));
});

test('拒绝重复 slug、非法状态、非法 URL 与错误日期', () => {
  const { root, data, cleanup } = setup();
  data.sites.push({ ...data.sites[0] });
  data.sites[0].status = 'done';
  data.sites[0].sourceUrl = 'ftp://example.com/';
  data.sites[0].updatedAt = '2026/11/08';
  const errors = collectRegistryErrors(data, root);
  cleanup();
  assert.ok(errors.some(e => e.includes('slug 重复')));
  assert.ok(errors.some(e => e.includes('status')));
  assert.ok(errors.some(e => e.includes('sourceUrl')));
  assert.ok(errors.some(e => e.includes('updatedAt')));
});

test('拒绝不一致的 previewPath、越界 readme 与缺失 index.html', () => {
  expectError({ site: { previewPath: 'sites/other/' } }, 'previewPath');
  expectError({ site: { readme: 'sites/other/README.md' } }, 'readme');
  expectError({ index: false }, '缺少 index.html');
  expectError({ readme: false }, 'readme');
});

test('导入记录缺失或不一致会被捕获', () => {
  expectError({ site: { sourceRepository: GOOD_MARKER.repository } }, '缺少 MIRROR-IMPORT.json');
  expectError({ site: { sourceRepository: 'weepwood/other-mirror' }, marker: GOOD_MARKER }, '不一致');
  expectError({ site: { sourceRepository: GOOD_MARKER.repository }, marker: { ...GOOD_MARKER, commit: 'deadbeef' } }, 'SHA');
  expectError({ site: { sourceRepository: GOOD_MARKER.repository }, marker: '{bad json' }, '不是有效 JSON');
});

test('状态与分类枚举覆盖全部合法值', () => {
  assert.deepEqual([...STATUSES].sort(), ['building', 'completed', 'paused', 'planned', 'review']);
  assert.deepEqual([...KINDS].sort(), ['build', 'original', 'snapshot', 'source']);
});

test('拒绝非法 kind 与不合规 tags', () => {
  expectError({ site: { kind: 'mirror' } }, 'kind');
  expectError({ site: { tags: [] } }, 'tags');
  expectError({ site: { tags: ['a', 'a'] } }, 'tags');
  expectError({ site: { tags: ['Bad Tag'] } }, 'tags');
  expectError({ site: { tags: ['a', 'b', 'c', 'd', 'e'] } }, 'tags');
});

test('真实仓库每个站点都带分类与标签', () => {
  const data = JSON.parse(readFileSync(resolve(projectRoot, 'sites/registry.json'), 'utf8'));
  for (const site of data.sites) {
    assert.ok(KINDS.has(site.kind), site.slug + ' 缺少合法 kind');
    assert.ok(Array.isArray(site.tags) && site.tags.length > 0, site.slug + ' 缺少 tags');
  }
});
