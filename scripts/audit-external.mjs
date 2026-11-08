import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { root } from './mirror-config.mjs';
import { collectHtml, toPosix } from './scan-utils.mjs';

const REPORT_PATH = resolve(root, 'docs/external-assets.md');

/** Hosts that receive analytics / marketing data rather than just serving assets. */
const TRACKER_HOST = /(?:googletagmanager\.com|google-analytics\.com|analytics\.google\.com|doubleclick\.net|connect\.facebook\.net|bat\.bing\.com|static\.hotjar\.com|clarity\.ms|cdn\.segment\.com|snap\.licdn\.com|hm\.baidu\.com|s4\.cnzz\.com|plausible\.io|adsbygoogle|ads-twitter\.com|analytics\.twitter\.com|mixpanel\.com|amplitude\.com)/i;
const EXTERNAL = /^(?:https?:)?\/\//i;
const SCRIPT_TAG = /<script\b[^>]*>/gi;
const LINK_TAG = /<link\b[^>]*>/gi;
const INLINE_SCRIPT = /<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi;
const ABSOLUTE_URL = /(?:https?:)?\/\/[^\s"'<>()]+/gi;
const ANALYTICS_ID = /\b(?:G-[A-Z0-9]{6,}|GTM-[A-Z0-9]{4,}|UA-\d{4,}-\d+)\b/g;
const REQUESTING_REL = /^(?:stylesheet|preload|preconnect|dns-prefetch|icon|modulepreload)$/i;

function attr(tag, name) {
  const match = new RegExp('\\b' + name + '=(["\'])([^"\']+)\\1', 'i').exec(tag);
  return match ? match[2] : '';
}

export function hostOf(url) {
  try {
    return new URL(url.startsWith('//') ? 'https:' + url : url).hostname;
  } catch {
    return '(unknown)';
  }
}

/** `tracker` hosts collect visit data; everything else is a runtime CDN asset. */
export function classifyExternal(url) {
  return TRACKER_HOST.test(url) ? 'tracker' : 'cdn';
}

/**
 * Inventory every request a published mirror page makes to a third-party host.
 * Only tag attributes and inline script literals are inspected; the mirrored
 * markup itself is never modified.
 */
export function scanExternal(buildRoot) {
  const sitesRoot = join(buildRoot, 'sites');
  if (!existsSync(sitesRoot)) throw new Error('未找到构建产物，请先运行 npm run build：' + sitesRoot);
  const sites = [];
  for (const slug of readdirSync(sitesRoot).sort()) {
    const dir = join(sitesRoot, slug);
    if (!existsSync(join(dir, 'index.html'))) continue;
    const urls = new Map();
    const ids = new Set();
    let htmlFiles = 0;
    const add = (url, source) => {
      if (!EXTERNAL.test(url)) return;
      const clean = url.replace(/[.,;]+$/, '');
      const key = clean + '|' + source;
      if (!urls.has(key)) {
        urls.set(key, { url: clean, host: hostOf(clean), source, type: classifyExternal(clean) });
      }
    };
    collectHtml(dir, file => {
      htmlFiles++;
      const text = readFileSync(file.abs, 'utf8');
      for (const tag of text.matchAll(SCRIPT_TAG)) add(attr(tag[0], 'src'), 'script');
      for (const tag of text.matchAll(LINK_TAG)) {
        const rel = attr(tag[0], 'rel');
        if (REQUESTING_REL.test(rel)) add(attr(tag[0], 'href'), 'link');
      }
      for (const block of text.matchAll(INLINE_SCRIPT)) {
        for (const url of block[1].matchAll(ABSOLUTE_URL)) {
          if (TRACKER_HOST.test(url[0])) add(url[0], 'inline');
        }
      }
      // Real GA/GTM ids always contain digits; this filters lookalikes such as
      // the custom element name G-SCROLLING-CAROUSEL in Google's inline bundle.
      for (const id of text.matchAll(ANALYTICS_ID)) if (/\d/.test(id[0])) ids.add(id[0]);
    });
    sites.push({ slug, htmlFiles, urls: [...urls.values()], ids: [...ids].sort() });
  }
  const all = sites.flatMap(site => site.urls);
  return {
    sites,
    totals: {
      htmlFiles: sites.reduce((sum, site) => sum + site.htmlFiles, 0),
      sitesWithExternal: sites.filter(site => site.urls.length).length,
      externalRefs: all.length,
      trackerRefs: all.filter(item => item.type === 'tracker').length,
      cdnRefs: all.filter(item => item.type === 'cdn').length,
      hosts: new Set(all.map(item => item.host)).size,
      analyticsIds: new Set(sites.flatMap(site => site.ids)).size,
    },
  };
}

export function formatExternalReport(result) {
  const t = result.totals;
  const lines = [
    '# 第三方外链资源审计',
    '',
    '> 自动生成，请勿手工编辑。运行 `npm run audit:external` 重新生成（需先 `npm run build`）。',
    '',
    '本报告登记**已发布镜像 HTML 会向第三方域名发起的请求**。按项目决议，镜像 HTML 保持 1:1 原样，这里只登记、不拦截、不改写。',
    '',
    '## 汇总',
    '',
    '| 指标 | 数值 |',
    '| --- | ---: |',
    `| 扫描 HTML 文件 | ${t.htmlFiles} |`,
    `| 存在外链的站点 | ${t.sitesWithExternal} / ${result.sites.length} |`,
    `| 外部引用（按 URL + 来源去重） | ${t.externalRefs} |`,
    `| ├ 追踪 / 分析类 | ${t.trackerRefs} |`,
    `| └ 运行时 CDN 类 | ${t.cdnRefs} |`,
    `| 涉及的第三方域名 | ${t.hosts} |`,
    `| 快照中残留的原站统计 ID | ${t.analyticsIds} |`,
    '',
    '## 逐站明细',
    '',
    '| 站点 | 类型 | 引用 | 原站统计 ID |',
    '| --- | --- | --- | --- |',
  ];
  for (const site of result.sites) {
    if (!site.urls.length && !site.ids.length) continue;
    const trackers = site.urls.filter(item => item.type === 'tracker').length;
    const label = trackers ? `追踪 ${trackers} · CDN ${site.urls.length - trackers}` : `CDN ${site.urls.length}`;
    lines.push(`| \`${site.slug}\` | ${label} | ${site.urls.length} | ${site.ids.map(id => '`' + id + '`').join('、') || '—'} |`);
  }
  lines.push('', '## 外部引用清单', '');
  for (const site of result.sites) {
    if (!site.urls.length) continue;
    lines.push(`### \`${site.slug}\``, '');
    for (const item of site.urls.sort((a, b) => a.url.localeCompare(b.url))) {
      lines.push(`- \`${item.type === 'tracker' ? '追踪' : 'CDN'}\` · ${item.source} · \`${item.host}\` — ${item.url}`);
    }
    lines.push('');
  }
  lines.push(
    '## 说明与处置',
    '',
    '- **追踪类**：访问公开镜像时，浏览器会向原站所有的统计服务发起请求（携带当前页面 referrer）。ID 属于原站，不是本项目配置。',
    '- **CDN 类**：这些脚本是页面运行时的实际依赖；移除会破坏 1:1 保真，因此保留。',
    '- 本报告是**登记基线**，不是验收结论。若后续决定阻断外链，应逐站评估并单独记录，不在构建期统一改写镜像 HTML。',
    '- 与 [链接审计](link-audit.md) 配合阅读：后者统计路径可用性，本报告统计对外请求。',
    '',
  );
  return lines.join('\n');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = scanExternal(resolve(root, '.site-build'));
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    mkdirSync(dirname(REPORT_PATH), { recursive: true });
    writeFileSync(REPORT_PATH, formatExternalReport(result));
    const t = result.totals;
    console.log(`外链审计完成：${result.sites.length} 个站点 / ${t.htmlFiles} 个 HTML / ${t.externalRefs} 处外部引用（追踪 ${t.trackerRefs}、CDN ${t.cdnRefs}）`);
    console.log(`  涉及 ${t.hosts} 个域名，${t.analyticsIds} 个原站统计 ID；报告已写入：${toPosix(relative(root, REPORT_PATH))}`);
  }
}
