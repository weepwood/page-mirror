import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = resolve(root, 'sites/registry.json');
const errors = [];
const statuses = new Set(['planned', 'building', 'review', 'completed', 'paused']);

function fail(message) { errors.push(message); }
function insideRoot(path) {
  const absolute = resolve(root, path);
  return absolute === root || absolute.startsWith(root + sep);
}
function checkRelativeFile(value, field, slug, required = false) {
  if (!value && !required) return;
  if (typeof value !== 'string' || !value.trim()) {
    fail(`[${slug}] ${field} 必须是非空相对路径`);
    return;
  }
  if (/^(?:[a-z]+:|\/|\\)/i.test(value) || !insideRoot(value)) {
    fail(`[${slug}] ${field} 必须是仓库内的相对路径：${value}`);
    return;
  }
  if (!existsSync(resolve(root, value))) fail(`[${slug}] ${field} 路径不存在：${value}`);
}

if (!existsSync(registryPath)) {
  console.error('找不到 sites/registry.json');
  process.exit(1);
}

let data;
try {
  data = JSON.parse(readFileSync(registryPath, 'utf8'));
} catch (error) {
  console.error('registry.json 不是有效 JSON：', error.message);
  process.exit(1);
}

if (data.schemaVersion !== 1) fail('schemaVersion 必须为 1');
if (!Array.isArray(data.sites)) fail('sites 必须是数组');

const seen = new Set();
for (const [index, site] of (Array.isArray(data.sites) ? data.sites : []).entries()) {
  const label = site?.slug || `index ${index}`;
  if (!site || typeof site !== 'object' || Array.isArray(site)) {
    fail(`[${label}] 必须是对象`);
    continue;
  }
  if (typeof site.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(site.slug)) {
    fail(`[${label}] slug 仅允许小写字母、数字和连字符`);
    continue;
  }
  if (seen.has(site.slug)) fail(`[${label}] slug 重复`);
  seen.add(site.slug);

  for (const field of ['name', 'description']) {
    if (typeof site[field] !== 'string' || !site[field].trim()) fail(`[${label}] ${field} 不能为空`);
  }
  if (typeof site.sourceUrl !== 'string') {
    fail(`[${label}] sourceUrl 必须是 URL`);
  } else {
    try {
      const url = new URL(site.sourceUrl);
      if (!['http:', 'https:'].includes(url.protocol)) fail(`[${label}] sourceUrl 仅支持 HTTP(S)`);
    } catch {
      fail(`[${label}] sourceUrl 不是有效 URL`);
    }
  }
  if (!statuses.has(site.status)) fail(`[${label}] status 必须是 ${[...statuses].join(', ')} 之一`);

  const siteDir = `sites/${site.slug}`;
  if (!insideRoot(siteDir) || !existsSync(resolve(root, siteDir)) || !statSync(resolve(root, siteDir)).isDirectory()) {
    fail(`[${label}] 站点目录不存在：${siteDir}`);
  }
  checkRelativeFile(site.previewPath || `${siteDir}/index.html`, 'previewPath', label, true);
  checkRelativeFile(site.readme || `${siteDir}/README.md`, 'readme', label, true);
  if (site.updatedAt && !/^\d{4}-\d{2}-\d{2}$/.test(site.updatedAt)) {
    fail(`[${label}] updatedAt 应使用 YYYY-MM-DD 格式`);
  }
}

if (errors.length) {
  console.error(`站点清单校验失败（${errors.length} 项）：`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`站点清单校验通过：${data.sites.length} 个站点。`);
