import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { root } from './mirror-config.mjs';
import { collectHtml, toPosix } from './scan-utils.mjs';

const REPORT_PATH = resolve(root, 'docs/link-audit.md');
const OWN_PREFIX = '/page-mirror/';
const ASSET = /\.(?:js|mjs|css|map|json|xml|txt|png|jpe?g|svg|webp|avif|gif|ico|woff2?|ttf|otf|eot|wasm|mp3|mp4|webm|glb|bin|webmanifest|pdf|draco|dds)$/i;
// Require attribute position so data-* attributes do not match; embedded
// script/style bodies are stripped before matching (they contain string literals).
const REF = /(?:^|\s)(?:src|href|poster|action)=["']([^"']+)["']/gi;

function stripEmbedded(text) {
  // Keep the opening tag (its src/href attributes are real references); drop
  // only the body, which is where inline string literals create false positives.
  return text
    .replace(/(<script\b[^>]*>)[\s\S]*?(<\/script\s*>)/gi, '$1$2')
    .replace(/(<style\b[^>]*>)[\s\S]*?(<\/style\s*>)/gi, '$1$2');
}

function inside(parent, child) {
  return child === parent || child.startsWith(parent + sep);
}
function unescapeRef(value) {
  return value.replace(/&amp;/g, '&');
}
function cleanPath(value) {
  const raw = value.split(/[?#]/)[0];
  try { return decodeURIComponent(raw); } catch { return raw; }
}
/** Classification of a root-absolute reference that survived the build rewrite. */
export function classifyRef(slug, ref, buildRoot) {
  const clean = cleanPath(unescapeRef(ref));
  const siteDir = resolve(buildRoot, 'sites', slug);
  const own = clean.startsWith(OWN_PREFIX);
  const target = own
    ? resolve(buildRoot, clean.slice(OWN_PREFIX.length))
    : resolve(siteDir, clean.replace(/^\//, ''));
  // A bare "/" (or the site directory itself) is a route to the original home,
  // not a resource waiting to be rewritten.
  if (clean === '/' || target === siteDir) return 'route';
  if (existsSync(target)) {
    if (own) return 'own';
    // %5Bid%5D etc. resolve on the server after URL decoding; the build rewrite
    // conservatively skips them, so they are not real breakages.
    if (/%[0-9a-f]{2}/i.test(ref)) return 'own';
    return 'fixable';
  }
  // Prefixed pagination links with no captured page are still unrecorded routes.
  if (own) return 'route';
  return ASSET.test(clean) ? 'missing-asset' : 'route';
}

/**
 * Scan the deployed build (not the source mirrors) for link health.
 * Pure function over the filesystem: safe to call from tests with a temp directory.
 */
export function scanBuild(buildRoot) {
  const sitesRoot = join(buildRoot, 'sites');
  if (!existsSync(sitesRoot)) throw new Error('未找到构建产物：' + buildRoot + '（请先运行 npm run build）');
  const sites = [];
  for (const slug of readdirSync(sitesRoot).sort()) {
    const dir = join(sitesRoot, slug);
    if (!statSync(dir).isDirectory()) continue;
    const htmlFiles = [];
    collectHtml(dir, file => htmlFiles.push(file.abs));
    const counts = { own: 0, fixable: 0, 'missing-asset': 0, route: 0 };
    const examples = {};
    const missingLocal = new Set();
    let rootRefs = 0;
    for (const file of htmlFiles) {
      const text = stripEmbedded(readFileSync(file, 'utf8'));
      for (const match of text.matchAll(REF)) {
        const ref = unescapeRef(match[1]);
        if (/^(?:https?:|mailto:|data:|javascript:|#|\/\/)/i.test(ref) || !ref.trim()) continue;
        if (ref.startsWith('/')) {
          rootRefs++;
          const kind = classifyRef(slug, ref, buildRoot);
          counts[kind]++;
          if (!examples[kind]) examples[kind] = [];
          if (examples[kind].length < 3 && !examples[kind].includes(ref)) examples[kind].push(ref);
        } else {
          const clean = cleanPath(ref);
          if (!clean) continue;
          const target = resolve(dirname(file), clean);
          if (inside(dir, target) && !existsSync(target)) missingLocal.add(ref);
        }
      }
    }
    sites.push({ slug, htmlFiles: htmlFiles.length, rootRefs, counts, examples, missingLocal: [...missingLocal] });
  }
  const totals = { own: 0, fixable: 0, 'missing-asset': 0, route: 0 };
  for (const site of sites) for (const key of Object.keys(totals)) totals[key] += site.counts[key];
  return {
    sites,
    totals,
    htmlFiles: sites.reduce((sum, s) => sum + s.htmlFiles, 0),
    rootRefs: sites.reduce((sum, s) => sum + s.rootRefs, 0),
    missingLocal: sites.reduce((sum, s) => sum + s.missingLocal.length, 0),
  };
}

function label(kind) {
  return { own: '已适配（含编码路径）', fixable: '本地存在可改', 'missing-asset': '快照缺失资源', route: '站内路由' }[kind];
}

/** Markdown report committed to the repo as the acceptance baseline. */
export function formatReport(result, registry) {
  const statusBySlug = new Map((registry?.sites || []).map(s => [s.slug, s.status]));
  const affected = result.sites.filter(s => s.rootRefs > 0);
  const lines = [
    '# 镜像链接健康报告',
    '',
    '> 由 `npm run audit:links` 生成，扫描对象是 `.site-build/`（实际发布到 GitHub Pages 的产物）。请勿手工编辑。',
    '',
    '## 口径与处置策略',
    '',
    '- 构建脚本的 `rewriteLocalAssetUrls()` 已经把**本地存在**的根绝对资源改写为相对路径；本报告统计的是改写后仍指向域名根的引用。',
    '- 项目决议：镜像 HTML 保持 1:1 原样，**不自动改写站内导航**。多数残留引用是原站路由，而快照只收录首页，因此在 `/page-mirror/sites/<slug>/` 下无法解析。',
    '- 这类差异随各站验收逐项处理，状态在此之前保持 `review`。处理流程见 [验收 SOP](acceptance.md)。',
    '',
    '## 总览',
    '',
    `| 指标 | 数量 |`,
    `| --- | ---: |`,
    `| 扫描站点 | ${result.sites.length} |`,
    `| 扫描 HTML 文件 | ${result.htmlFiles} |`,
    `| 根绝对路径引用（含重复） | ${result.rootRefs} |`,
    `| ├ 站内路由，快照未收录 | ${result.totals.route} |`,
    `| ├ 快照本身缺失的资源 | ${result.totals['missing-asset']} |`,
    `| ├ 本地存在但仍是根绝对路径 | ${result.totals.fixable} |`,
    `| └ 已适配（含 URL 编码路径） | ${result.totals.own} |`,
    `| 本地相对资源缺失 | ${result.missingLocal} |`,
    `| 存在根绝对引用的站点 | ${affected.length} |`,
    '',
    '## 逐站结果',
    '',
    '| 站点 | 状态 | HTML | 根绝对引用 | 站内路由 | 缺失资源 | 已适配 | 本地存在可改 | 本地相对资源缺失 |',
    '| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
  ];
  for (const site of result.sites) {
    const c = site.counts;
    lines.push(`| \`${site.slug}\` | ${statusBySlug.get(site.slug) || '-'} | ${site.htmlFiles} | ${site.rootRefs} | ${c.route} | ${c['missing-asset']} | ${c.own} | ${c.fixable} | ${site.missingLocal.length} |`);
  }
  lines.push('', '## 重点站点明细', '');
  for (const site of affected.sort((a, b) => b.rootRefs - a.rootRefs).slice(0, 8)) {
    lines.push(`### \`${site.slug}\`（${site.rootRefs} 处）`, '');
    for (const [kind, refs] of Object.entries(site.examples)) {
      if (!refs.length) continue;
      lines.push(`- ${label(kind)}：${refs.map(r => '`' + r + '`').join('、')}`);
    }
    if (site.missingLocal.length) {
      lines.push(`- 本地相对资源缺失：${site.missingLocal.slice(0, 3).map(r => '`' + r + '`').join('、')}`);
    }
    lines.push('');
  }
  lines.push('## 说明', '',
    '- 扫描前会移除 `<script>` / `<style>` 内容，只统计真正的 HTML 属性引用，避免把内联脚本里的字符串（如 Google 首页的 `jsaction` 数据）误判为缺失资源。',
    '- `/page-mirror/` 前缀但目标页未收录的分页链接计入「站内路由」；URL 编码路径（如 `%5Bid%5D`）计入「已适配」，因为浏览器会解码后请求，构建期保守跳过这类路径的重写。',
    '- `本地存在可改` 出现非零值时，应检查该引用是否位于 JS 动态字符串或 CSS 中；静态 HTML 属性里的本地资源已由重写逻辑覆盖。',
    '- `快照缺失资源` 属于上游快照本身不完整（例如 `google-homepage` 的 `/_m/xjs_main.css|js`），不是部署路径问题。',
    '- 站内路由未收录不影响站点首页可访问；首页可达性由 `npm run build` 与线上抽检另行验证。',
    '');
  return lines.join('\n');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const buildRoot = resolve(root, '.site-build');
  const result = scanBuild(buildRoot);
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    const registry = JSON.parse(readFileSync(resolve(root, 'sites/registry.json'), 'utf8'));
    mkdirSync(dirname(REPORT_PATH), { recursive: true });
    writeFileSync(REPORT_PATH, formatReport(result, registry));
    console.log(`链接审计完成：${result.sites.length} 个站点 / ${result.htmlFiles} 个 HTML / ${result.rootRefs} 处根绝对路径`);
    console.log(`  站内路由 ${result.totals.route} · 缺失资源 ${result.totals['missing-asset']} · 已适配 ${result.totals.own} · 本地相对资源缺失 ${result.missingLocal}`);
    console.log(`报告已写入：${toPosix(relative(root, REPORT_PATH))}`);
  }
}
