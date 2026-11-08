import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { classifyExternal, formatExternalReport, hostOf, scanExternal } from '../scripts/audit-external.mjs';

test('外部 URL 分类与主机名解析', () => {
  assert.equal(classifyExternal('https://www.googletagmanager.com/gtag/js?id=G-ABC12345'), 'tracker');
  assert.equal(classifyExternal('https://static.ads-twitter.com/'), 'tracker');
  assert.equal(classifyExternal('https://cdn.jsdelivr.net/npm/x.js'), 'cdn');
  assert.equal(hostOf('//fonts.googleapis.com/css2'), 'fonts.googleapis.com');
  assert.equal(hostOf('not-a-url'), '(unknown)');
});

test('扫描只统计会发起请求的外部引用，并过滤误报统计 ID', t => {
  const tmp = mkdtempSync(join(tmpdir(), 'pm-external-'));
  t.after(() => rmSync(tmp, { recursive: true, force: true }));
  const site = join(tmp, 'sites', 'demo');
  mkdirSync(site, { recursive: true });
  writeFileSync(join(site, 'index.html'), [
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter">',
    '<link rel="canonical" href="https://example.com/must-not-count">',
    '<script src="https://cdn.jsdelivr.net/npm/x.js"></script>',
    '<script src="https://www.googletagmanager.com/gtag/js?id=G-RPD4HWL84Z"></script>',
    '<script>var el="G-SCROLLING-CAROUSEL", u="https://www.googletagmanager.com/gtag/js";</script>',
    '<script src="./local.js"></script>',
  ].join('\n'));

  const result = scanExternal(tmp);
  const demo = result.sites.find(entry => entry.slug === 'demo');
  assert.equal(result.totals.externalRefs, 4, 'canonical 与本地脚本不应计入');
  assert.equal(result.totals.trackerRefs, 2, '外部 GTM 脚本 + 内联 GTM 字符串');
  assert.equal(result.totals.cdnRefs, 2);
  assert.deepEqual(demo.ids, ['G-RPD4HWL84Z'], 'G-SCROLLING-CAROUSEL 是误报');
  assert.ok(!result.sites.some(entry => entry.urls.some(u => u.url.includes('example.com'))));

  const report = formatExternalReport(result);
  assert.ok(report.includes('| `demo` |') && report.includes('googletagmanager.com'));
  assert.ok(report.includes('不拦截、不改写'), '报告必须声明只登记不改镜像');
});

test('缺少构建产物时给出明确错误', () => {
  assert.throws(() => scanExternal(join(tmpdir(), 'pm-definitely-missing-' + Date.now())), /未找到构建产物/);
});
