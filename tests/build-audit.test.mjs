import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  formatBytes, formatBuildAudit, hygieneIssue, scanBuildAssets, REQUIRED_ROOT_FILES,
} from '../scripts/audit-build.mjs';

const FIXTURE = Buffer.alloc(5000, 7);

/** Build a miniature .site-build/ so the audit can be tested without a real build. */
function makeBuild(root, opts = {}) {
  const sites = opts.sites ?? ['alpha', 'beta'];
  const sitemapSites = opts.sitemapSites ?? sites;
  const registry = opts.registry ?? sites;
  for (const file of ['index.html', '404.html', 'robots.txt', 'favicon.svg', '.nojekyll']) {
    writeFileSync(join(root, file), file);
  }
  mkdirSync(join(root, 'sites'), { recursive: true });
  writeFileSync(join(root, 'sites/registry.json'), JSON.stringify({
    sites: registry.map(slug => ({ slug, previewPath: `sites/${slug}/` })),
  }));
  const locs = ['https://weepwood.github.io/page-mirror/',
    ...sitemapSites.map(slug => `https://weepwood.github.io/page-mirror/sites/${slug}/`)];
  writeFileSync(join(root, 'sitemap.xml'),
    '<urlset>' + locs.map(loc => `<url><loc>${loc}</loc></url>`).join('') + '</urlset>');
  for (const slug of sites) {
    const dir = join(root, 'sites', slug);
    mkdirSync(join(dir, 'assets'), { recursive: true });
    writeFileSync(join(dir, 'index.html'), '<html></html>');
    writeFileSync(join(dir, 'assets', 'shared.bin'), FIXTURE);
  }
  if (opts.omit) rmSync(join(root, opts.omit), { recursive: true, force: true });
  for (const item of opts.extra ?? []) {
    const path = join(root, item.path);
    mkdirSync(join(path, '..'), { recursive: true });
    writeFileSync(path, item.content ?? 'x');
  }
  return root;
}

function withBuild(t, opts) {
  const dir = mkdtempSync(join(tmpdir(), 'pm-build-audit-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return makeBuild(dir, opts);
}

test('发布卫生规则区分合法资源与内部文件', () => {
  assert.equal(hygieneIssue('.nojekyll'), null);
  assert.equal(hygieneIssue('sites/alpha/index.html'), null);
  assert.equal(hygieneIssue('sites/alpha/assets/app.js'), null);
  assert.equal(hygieneIssue('sites/alpha/_next/static/chunk.js'), null);
  assert.match(hygieneIssue('sites/alpha/package.json'), /内部文件/);
  assert.match(hygieneIssue('sites/alpha/reference/index.html'), /禁止发布的目录/);
  assert.match(hygieneIssue('sites/alpha/app.js.map'), /文件类型/);
  assert.match(hygieneIssue('sites/alpha/.env'), /隐藏文件/);
  assert.equal(formatBytes(512), '512 B');
  assert.equal(formatBytes(2048), '2.0 KB');
  assert.equal(formatBytes(2 * 1024 * 1024), '2.0 MB');
  assert.ok(REQUIRED_ROOT_FILES.includes('sitemap.xml'));
});

test('完整产物通过门禁，并识别重复内容与逐站点体积', t => {
  const result = scanBuildAssets(withBuild(t));
  assert.deepEqual(result.errors, []);
  assert.equal(result.totals.sites, 2);
  assert.equal(result.checks.availableSlugs.length, 2);
  assert.equal(result.checks.sitemapSlugs.length, 2);
  assert.ok(result.duplicates.length >= 1, '两份 shared.bin 内容相同');
  assert.equal(result.duplicates[0].count, 2);
  assert.equal(result.duplicates[0].waste, FIXTURE.length);
  assert.equal(result.sites.length, 2);
  const report = formatBuildAudit(result);
  for (const heading of ['## 汇总', '## 逐站点体积', '## 最大的文件', '## 重复内容', '## 检查结论']) {
    assert.ok(report.includes(heading), '报告缺少 ' + heading);
  }
  assert.ok(report.includes('| `alpha` |') && report.includes('错误：0'));
});

test('违规文件、缺失入口与 sitemap 偏差都会阻断门禁', t => {
  const dirty = withBuild(t, { extra: [{ path: 'sites/alpha/package.json' }] });
  assert.ok(scanBuildAssets(dirty).errors.some(error => error.includes('发布卫生')));

  const broken = withBuild(t, { omit: 'sites/beta/index.html' });
  assert.ok(scanBuildAssets(broken).errors.some(error => error.includes('缺少 index.html')));

  const stale = withBuild(t, { sitemapSites: ['alpha'] });
  assert.ok(scanBuildAssets(stale).errors.some(error => error.includes('sitemap 遗漏站点')));
  const ghost = withBuild(t, { sitemapSites: ['alpha', 'beta', 'ghost'] });
  assert.ok(scanBuildAssets(ghost).errors.some(error => error.includes('不存在的站点')));

  const missing = withBuild(t, { omit: 'robots.txt' });
  assert.ok(scanBuildAssets(missing).errors.some(error => error.includes('缺少必需文件：robots.txt')));
});

test('部分构建只提示不报错，体积阈值可覆盖', t => {
  const partial = withBuild(t, { registry: ['alpha', 'beta', 'gamma'], sitemapSites: ['alpha', 'beta'] });
  const result = scanBuildAssets(partial);
  assert.deepEqual(result.errors, []);
  assert.ok(result.warnings.some(warning => warning.includes('--only')));

  const tiny = withBuild(t, {});
  const tight = scanBuildAssets(tiny, { maxMb: 0.001 });
  assert.ok(tight.warnings.some(warning => warning.includes('超过')));
  assert.deepEqual(tight.errors, []);
});

test('产物不存在时给出可执行的错误提示', t => {
  const dir = mkdtempSync(join(tmpdir(), 'pm-build-empty-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const missing = join(dir, 'nope');
  assert.throws(() => scanBuildAssets(missing), /请先运行 npm run build/);
  assert.ok(readFileSync(join(withBuild(t), 'sitemap.xml'), 'utf8').includes('<loc>'));
});
