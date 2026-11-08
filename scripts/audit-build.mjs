import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { root } from './mirror-config.mjs';

const REPORT_PATH = resolve(root, 'docs/build-audit.md');
const DUP_MIN_BYTES = 4096;          // tiny files are not worth hashing
const LARGE_FILE_BYTES = 25 * 1024 * 1024;
const DEFAULT_MAX_MB = 400;

/** Root-level assets that must exist in a deployable Pages build. */
export const REQUIRED_ROOT_FILES = [
  'index.html', '404.html', 'robots.txt', 'favicon.svg',
  'sitemap.xml', 'sites/registry.json', '.nojekyll',
];

const FORBIDDEN_DIRS = new Set([
  'node_modules', 'reference', 'docs', 'tests', 'scripts', 'coverage',
  'dist', 'out', '.next', '.git', '.cache', '.turbo',
]);
const FORBIDDEN_EXACT = new Set([
  'MIRROR-IMPORT.json', 'package.json', 'package-lock.json',
  'snapshot-status.json', 'tsconfig.json', 'components.json',
  'netlify.toml', 'vercel.json', 'AGENTS.md', 'CLAUDE.md', 'README.md',
]);
const FORBIDDEN_EXT = /\.(?:map|env|pem|key|p12|pfx|log|md|tsx?|jsx|py|sh|bat|ps1)$/i;

export function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 / 1024).toFixed(1) + ' MB';
}

/** Why a published path is a hygiene violation, or null when it is legitimate. */
export function hygieneIssue(rel) {
  const parts = rel.split('/');
  const name = parts.at(-1);
  const dir = parts.slice(0, -1).find(part => FORBIDDEN_DIRS.has(part));
  if (dir) return '禁止发布的目录 ' + dir + '/';
  const dot = parts.find(part => part.startsWith('.') && part !== '.nojekyll');
  if (dot) return '隐藏文件/目录 ' + dot;
  if (FORBIDDEN_EXACT.has(name)) return '内部文件 ' + name;
  if (FORBIDDEN_EXT.test(name)) return '不应发布的文件类型 ' + name;
  return null;
}

function collect(dir, base, out) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name);
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) { collect(abs, base, out); continue; }
    if (!entry.isFile()) continue;
    out.push({ path: relative(base, abs).split(sep).join('/'), abs, size: statSync(abs).size });
  }
}

function siteOf(rel) {
  const match = /^sites\/([^/]+)\//.exec(rel);
  return match ? match[1] : '(root)';
}

/**
 * Read-only inspection of the actual Pages output: size, duplicates, required
 * assets, publish hygiene and sitemap/registry consistency. Never modifies it.
 */
export function scanBuildAssets(buildRoot, options = {}) {
  if (!existsSync(buildRoot)) {
    throw new Error('未找到构建产物，请先运行 npm run build：' + buildRoot);
  }
  const maxBytes = (options.maxMb ?? DEFAULT_MAX_MB) * 1024 * 1024;
  const files = [];
  collect(buildRoot, buildRoot, files);
  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
  const errors = [];
  const warnings = [];

  for (const required of REQUIRED_ROOT_FILES) {
    if (!existsSync(join(buildRoot, required))) errors.push('缺少必需文件：' + required);
  }

  const hygiene = files
    .map(file => ({ path: file.path, reason: hygieneIssue(file.path) }))
    .filter(item => item.reason);
  if (hygiene.length) {
    errors.push(`发布卫生：${hygiene.length} 个不应发布的文件（例：${hygiene.slice(0, 3).map(item => item.path).join('、')}）`);
  }

  // Every site directory in the output must be a working entry point.
  const sitesRoot = join(buildRoot, 'sites');
  const available = new Set();
  if (!existsSync(sitesRoot)) {
    errors.push('产物缺少 sites/ 目录');
  } else {
    for (const entry of readdirSync(sitesRoot, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      if (existsSync(join(sitesRoot, entry.name, 'index.html'))) available.add(entry.name);
      else errors.push('站点目录缺少 index.html：sites/' + entry.name + '/');
    }
  }

  // The sitemap is generated from the output itself, so any divergence is a bug.
  const sitemapPath = join(buildRoot, 'sitemap.xml');
  const sitemapSlugs = new Set();
  if (existsSync(sitemapPath)) {
    const xml = readFileSync(sitemapPath, 'utf8');
    for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const slug = /\/sites\/([^/]+)\//.exec(match[1])?.[1];
      if (slug) sitemapSlugs.add(slug);
    }
  }
  const missingInSitemap = [...available].filter(slug => !sitemapSlugs.has(slug));
  const extraInSitemap = [...sitemapSlugs].filter(slug => !available.has(slug));
  if (missingInSitemap.length) errors.push('sitemap 遗漏站点：' + missingInSitemap.join('、'));
  if (extraInSitemap.length) errors.push('sitemap 收录了不存在的站点：' + extraInSitemap.join('、'));

  let registered = [];
  try {
    registered = JSON.parse(readFileSync(join(buildRoot, 'sites/registry.json'), 'utf8')).sites || [];
  } catch {
    errors.push('sites/registry.json 无法解析');
  }
  const unbuilt = registered.map(site => site.slug).filter(slug => !available.has(slug));
  const unregistered = [...available].filter(slug => !registered.some(site => site.slug === slug));
  if (unbuilt.length) warnings.push(`产物缺少 ${unbuilt.length} 个已登记站点（可能是 --only 构建）：${unbuilt.join('、')}`);
  if (unregistered.length) warnings.push('产物中存在未登记站点：' + unregistered.join('、'));

  const bySite = new Map();
  for (const file of files) {
    const slug = siteOf(file.path);
    const bucket = bySite.get(slug) || { files: 0, bytes: 0 };
    bucket.files++;
    bucket.bytes += file.size;
    bySite.set(slug, bucket);
  }
  const sites = [...bySite.entries()]
    .filter(([slug]) => slug !== '(root)')
    .map(([slug, stat]) => ({ slug, ...stat }))
    .sort((a, b) => b.bytes - a.bytes || a.slug.localeCompare(b.slug));
  const largest = [...files]
    .sort((a, b) => b.size - a.size)
    .slice(0, 10)
    .map(file => ({ path: file.path, bytes: file.size }));

  const byHash = new Map();
  for (const file of files) {
    if (file.size < DUP_MIN_BYTES) continue;
    const hash = createHash('sha256').update(readFileSync(file.abs)).digest('hex');
    const group = byHash.get(hash) || { hash, bytes: file.size, paths: [] };
    group.paths.push(file.path);
    byHash.set(hash, group);
  }
  const duplicates = [...byHash.values()]
    .filter(group => group.paths.length > 1)
    .map(group => ({ ...group, count: group.paths.length, waste: group.bytes * (group.paths.length - 1) }))
    .sort((a, b) => b.waste - a.waste || a.paths[0].localeCompare(b.paths[0]));
  const duplicateBytes = duplicates.reduce((sum, group) => sum + group.waste, 0);
  if (duplicateBytes > 20 * 1024 * 1024) {
    warnings.push(`重复内容占用 ${formatBytes(duplicateBytes)}；镜像按站点独立，不自动合并`);
  }
  if (totalBytes > maxBytes) {
    warnings.push(`产物总体积 ${formatBytes(totalBytes)} 超过 ${options.maxMb ?? DEFAULT_MAX_MB} MB 阈值`);
  }
  for (const file of largest.filter(item => item.bytes > LARGE_FILE_BYTES).slice(0, 3)) {
    warnings.push(`超大文件 ${file.path}（${formatBytes(file.bytes)}）`);
  }

  return {
    root: buildRoot,
    totals: {
      files: files.length,
      bytes: totalBytes,
      rootBytes: bySite.get('(root)')?.bytes || 0,
      sites: available.size,
      duplicateGroups: duplicates.length,
      duplicateBytes,
      maxMb: options.maxMb ?? DEFAULT_MAX_MB,
    },
    sites,
    largest,
    duplicates: duplicates.slice(0, 10),
    checks: {
      required: REQUIRED_ROOT_FILES.filter(file => !existsSync(join(buildRoot, file))),
      hygiene: hygiene.slice(0, 20),
      sitemapSlugs: [...sitemapSlugs].sort(),
      availableSlugs: [...available].sort(),
    },
    errors,
    warnings,
  };
}

export function formatBuildAudit(result) {
  const t = result.totals;
  const lines = [
    '# 发布产物体检',
    '',
    '> 自动生成，请勿手工编辑。运行 `npm run audit:build` 重新生成（需先 `npm run build`）；`-- --check` 为只读门禁。',
    '',
    '本报告只读取 `.site-build/`（真正部署到 GitHub Pages 的产物），不修改任何镜像 HTML。',
    '',
    '## 汇总',
    '',
    '| 指标 | 数值 |',
    '| --- | ---: |',
    `| 文件总数 | ${t.files} |`,
    `| 产物总体积 | ${formatBytes(t.bytes)} |`,
    `| 根目录文件体积 | ${formatBytes(t.rootBytes)} |`,
    `| 已发布站点 | ${t.sites} |`,
    `| 重复内容分组 | ${t.duplicateGroups} |`,
    `| 重复内容可复用空间 | ${formatBytes(t.duplicateBytes)} |`,
    `| 体积告警阈值 | ${t.maxMb} MB |`,
    '',
    '## 逐站点体积',
    '',
    '| 站点 | 文件 | 体积 |',
    '| --- | ---: | ---: |',
    ...result.sites.map(site => `| \`${site.slug}\` | ${site.files} | ${formatBytes(site.bytes)} |`),
    '',
    '## 最大的文件',
    '',
    '| 文件 | 体积 |',
    '| --- | ---: |',
    ...result.largest.map(file => `| \`${file.path}\` | ${formatBytes(file.bytes)} |`),
    '',
    '## 重复内容（按可复用空间排序）',
    '',
  ];
  if (!result.duplicates.length) {
    lines.push('未发现内容完全相同的较大文件。', '');
  } else {
    lines.push('| 份数 | 单份体积 | 可复用空间 | 路径 |', '| ---: | ---: | ---: | --- |');
    for (const group of result.duplicates) {
      lines.push(`| ${group.count} | ${formatBytes(group.bytes)} | ${formatBytes(group.waste)} | ${group.paths.slice(0, 3).map(path => '`' + path + '`').join('、')}${group.paths.length > 3 ? ' 等' : ''} |`);
    }
    lines.push('');
  }
  lines.push(
    '## 检查结论',
    '',
    `- 必需文件：${result.checks.required.length ? '缺失 ' + result.checks.required.join('、') : '齐备'}`,
    `- 发布卫生：${result.checks.hygiene.length ? result.checks.hygiene.length + ' 项异常' : '无违规文件'}`,
    `- sitemap：${result.checks.sitemapSlugs.length} 个站点 URL / 产物 ${result.checks.availableSlugs.length} 个站点`,
    `- 错误：${result.errors.length}`,
    `- 提示：${result.warnings.length}`,
    '',
  );
  if (result.errors.length) {
    lines.push('### 错误', '', ...result.errors.map(item => '- ' + item), '');
  }
  if (result.warnings.length) {
    lines.push('### 提示', '', ...result.warnings.map(item => '- ' + item), '');
  }
  lines.push(
    '## 说明与处置',
    '',
    '- **错误**会阻断 `--check`（CI 门禁）：必需文件缺失、发布卫生违规、站点缺入口、sitemap 与产物不一致。',
    '- **提示**不阻断部署：部分构建（`--only`）本就会缺少站点，重复资源与体积只是优化线索。',
    '- 重复内容多为各镜像自带的同一份字体/脚本/贴图。按项目决议，镜像保持 1:1 独立，不在构建期合并或改写。',
    '- 与 [链接审计](link-audit.md)、[第三方外链审计](external-assets.md) 配合阅读：本报告管产物构成与发布卫生，后两者管路径与对外请求。',
    '',
  );
  return lines.join('\n');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const maxArg = process.argv.find(arg => arg.startsWith('--max-mb='));
  const options = maxArg ? { maxMb: Number(maxArg.slice('--max-mb='.length)) } : {};
  const result = scanBuildAssets(resolve(root, '.site-build'), options);
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(result, null, 2));
  } else if (process.argv.includes('--check')) {
    const head = `产物体检：${result.totals.files} 个文件 / ${formatBytes(result.totals.bytes)} / ${result.totals.sites} 个站点`;
    if (result.errors.length) {
      console.error(head + `；发现 ${result.errors.length} 个错误：`);
      for (const error of result.errors) console.error('  - ' + error);
      process.exitCode = 1;
    } else {
      console.log(head + `；通过（${result.warnings.length} 条提示）`);
      for (const warning of result.warnings) console.log('  · ' + warning);
    }
  } else {
    mkdirSync(dirname(REPORT_PATH), { recursive: true });
    writeFileSync(REPORT_PATH, formatBuildAudit(result));
    console.log(`产物体检完成：${result.totals.files} 个文件 / ${formatBytes(result.totals.bytes)} / ${result.totals.sites} 个站点；错误 ${result.errors.length}，提示 ${result.warnings.length}`);
    console.log(`  重复内容 ${result.totals.duplicateGroups} 组 / ${formatBytes(result.totals.duplicateBytes)}；报告已写入：${relative(root, REPORT_PATH).split(sep).join('/')}`);
  }
}
