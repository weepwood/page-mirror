import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { root } from '../scripts/mirror-config.mjs';
import { buildSitemap, resolveHomepage, xmlEscape } from '../scripts/sitemap.mjs';
import { classifyRef, formatReport, scanBuild } from '../scripts/audit-links.mjs';

const read = file => readFileSync(resolve(root, file), 'utf8');
const homepage = JSON.parse(read('package.json')).homepage;

test('首页保留发布与可访问性契约', () => {
  const html = read('index.html');
  for (const id of ['sites', 'summary', 'search', 'sort', 'filters']) {
    assert.ok(html.includes('id="' + id + '"'), '缺少 #' + id);
  }
  assert.ok(html.includes('aria-live="polite"'), '计数需要 live region');
  assert.ok(!/class="grid"[^>]*aria-live/.test(html), '卡片网格不应整块朗读');
  for (const token of ['prefers-reduced-motion', 'focus-visible', 'class="skip"', 'rel="canonical"', 'og:title', 'kindLabels', 'tagHtml']) {
    assert.ok(html.includes(token), '缺少 ' + token);
  }
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  assert.doesNotThrow(() => new Function(script), '内联脚本必须可解析');
  const renderBody = script.slice(script.indexOf('function render(){'), script.indexOf("filters.addEventListener"));
  assert.ok(renderBody.includes('syncFilters()'), 'render 应同步筛选状态');
  assert.ok(!renderBody.includes('buildFilters'), 'render 不得重建筛选按钮，否则键盘焦点丢失');
});

test('全局发布页面齐备且 URL 与 homepage 一致', () => {
  const notFound = read('404.html');
  assert.ok(notFound.includes('content="noindex"'), '404 页不应被索引');
  // GitHub Pages returns 404.html for ANY missing path, so relative URLs resolve
  // against the requested path and break. All internal links must be absolute.
  const base = new URL(homepage).pathname;
  for (const href of [base + 'favicon.svg', 'href="' + base + '"', 'href="' + base + '#sites"']) {
    assert.ok(notFound.includes(href), '404 页缺少绝对路径：' + href);
  }
  assert.ok(!/href="\.\//.test(notFound), '404 页不得使用相对路径');
  assert.ok(read('robots.txt').includes('Sitemap: ' + homepage + 'sitemap.xml'));
  const svg = read('favicon.svg');
  assert.ok(svg.includes('xmlns="http://www.w3.org/2000/svg"') && svg.includes('viewBox'));
  const index = read('index.html');
  assert.ok(index.includes('rel="canonical" href="' + homepage + '"'));
  assert.ok(index.includes('og:url" content="' + homepage + '"'));
});

test('构建脚本发布全局页面与 sitemap', () => {
  const source = read('scripts/build-site.mjs');
  for (const file of ['404.html', 'robots.txt', 'favicon.svg', 'sitemap.xml', 'buildSitemap']) {
    assert.ok(source.includes(file), '构建脚本缺少 ' + file);
  }
  const workflow = read('.github/workflows/pages.yml');
  for (const file of ['404.html', 'robots.txt', 'favicon.svg']) {
    assert.ok(workflow.includes("- '" + file + "'"), 'pages.yml 未监听 ' + file);
  }
});

test('sitemap 由 registry 生成、可复现且正确转义', () => {
  const registry = JSON.parse(read('sites/registry.json'));
  const xml = buildSitemap(registry, homepage);
  assert.equal((xml.match(/<url>/g) || []).length, registry.sites.length + 1);
  assert.ok(xml.includes('<loc>' + homepage + '</loc>'));
  for (const site of registry.sites) {
    assert.ok(xml.includes('<loc>' + homepage + site.previewPath + '</loc>'), site.slug);
  }
  assert.equal(xmlEscape('a&b<c>"\''), 'a&amp;b&lt;c&gt;&quot;&apos;');
  assert.equal(buildSitemap(registry, homepage), xml, '输出不应依赖当前时间');
  assert.equal(resolveHomepage(root), homepage);
  assert.throws(() => resolveHomepage(root, { homepage: 'http://example.com/site/' }));
  assert.throws(() => resolveHomepage(root, { homepage: 'https://example.com/site' }));
});

test('链接扫描区分站内路由、缺失资源与内联脚本字符串', t => {
  const tmp = mkdtempSync(join(tmpdir(), 'pm-links-'));
  t.after(() => rmSync(tmp, { recursive: true, force: true }));
  const site = join(tmp, 'sites', 'demo');
  mkdirSync(join(site, 'assets'), { recursive: true });
  mkdirSync(join(site, '_next', '[id]'), { recursive: true });
  writeFileSync(join(site, 'assets', 'a.css'), '');
  writeFileSync(join(site, '_next', '[id]', 'page.js'), '');
  writeFileSync(join(site, 'index.html'), [
    '<a href="/docs/guide">guide</a>',
    '<link rel="stylesheet" href="/missing.css">',
    '<script src="/assets/a.css"></script>',
    '<img src="assets/a.css" alt="">',
    '<script>var fake = \'href="not-a-real-file.png"\';</script>',
  ].join('\n'));

  assert.equal(classifyRef('demo', '/_next/%5Bid%5D/page.js', tmp), 'own', 'URL 编码路径视为可解析');
  assert.equal(classifyRef('demo', '/page-mirror/sites/demo/p/2/', tmp), 'route', '前缀已适配但目标未收录');
  const result = scanBuild(tmp);
  const found = result.sites.find(s => s.slug === 'demo');
  assert.equal(found.counts.route, 1);
  assert.equal(found.counts['missing-asset'], 1);
  assert.equal(found.counts.fixable, 1, 'script src 的属性应被统计');
  assert.equal(found.missingLocal.length, 0, '脚本内字符串不应算作缺失资源');
  const report = formatReport(result, { sites: [{ slug: 'demo', status: 'review' }] });
  assert.ok(report.includes('| `demo` | review |') && report.includes('## 逐站结果'));
});

test('sitemap 只收录产物中真实存在的站点', () => {
  const registry = JSON.parse(read('sites/registry.json'));
  const first = registry.sites[0];
  const xml = buildSitemap(registry, homepage, new Set([first.slug]));
  assert.equal((xml.match(/<url>/g) || []).length, 2, '根目录 + 1 个已构建站点');
  assert.ok(xml.includes('<loc>' + homepage + first.previewPath + '</loc>'));
  assert.equal((buildSitemap(registry, homepage, new Set()).match(/<url>/g) || []).length, 1);
  const source = read('scripts/build-site.mjs');
  assert.ok(source.includes('buildSitemap(registry, homepage, availableSlugs)'), '构建脚本必须按产物生成 sitemap');
  assert.ok(source.indexOf('availableSlugs') > source.indexOf('for (const site of registry.sites)'), 'sitemap 必须在站点循环之后生成');
});

test('首页目录状态可分享且支持类型筛选', () => {
  const html = read('index.html');
  assert.ok(html.includes('id="kind"'), '缺少类型筛选控件');
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  for (const token of ['readUrlState', 'writeUrlState', 'URLSearchParams', 'validKind',
    "p.set('q'", "p.set('status'", "p.set('kind'", "p.set('sort'", 'popstate', 'kindFilter']) {
    assert.ok(script.includes(token), '首页脚本缺少 ' + token);
  }
  assert.doesNotThrow(() => new Function(script), '内联脚本必须可解析');
});

test('部署并发组隔离 PR，且采集链路显式调度发布', () => {
  const pages = read('.github/workflows/pages.yml');
  assert.match(pages, /group: pages-\$\{\{ github\.ref \}\}/, 'PR 不得与 main 共用并发组');
  assert.match(pages, /cancel-in-progress: false/, '部署不得被中途取消');

  for (const file of ['.github/workflows/capture-weread.yml', '.github/workflows/sync-mirrors.yml']) {
    const workflow = read(file);
    assert.ok(workflow.includes('changed=true') && workflow.includes('changed=false'), file + ' 缺少变更输出');
    assert.match(workflow, /if: steps\.(?:snapshot|import)\.outputs\.changed == 'true'/, file + ' 必须仅在有变更时部署');
    assert.ok(workflow.includes('gh workflow run pages.yml --ref main'), file + ' 缺少显式部署调度');
  }
  const capture = read('.github/workflows/capture-weread.yml');
  assert.ok(capture.includes('actions: write'), '调度工作流需要 actions: write');
  assert.ok(capture.includes('npm run validate && npm test'), '采集工作流应运行完整校验');
});
