import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve, sep } from 'node:path';

export const STATUSES = new Set(['planned', 'building', 'review', 'completed', 'paused']);
// snapshot = copied static snapshot, build = built locally before import,
// source = built at deploy time, original = maintained directly in this repo.
export const KINDS = new Set(['snapshot', 'build', 'source', 'original']);
const TAG = /^[a-z0-9][a-z0-9.+-]*$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SOURCE_REPO = /^weepwood\/[A-Za-z0-9._-]+$/;
const SHA = /^[0-9a-f]{40}$/i;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

function insideRoot(root, path) {
  const absolute = resolve(root, path);
  return absolute === root || absolute.startsWith(root + sep);
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Single source of truth for registry validation.
 * Returns a list of human-readable errors; an empty list means valid.
 */
export function collectRegistryErrors(data, root) {
  const errors = [];
  const fail = message => errors.push(message);

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    fail('registry.json 必须是对象');
    return errors;
  }
  if (data.schemaVersion !== 1) fail('schemaVersion 必须为 1');
  if (!Array.isArray(data.sites)) {
    fail('sites 必须是数组');
    return errors;
  }

  const seen = new Set();
  for (const [index, site] of data.sites.entries()) {
    const label = site?.slug || `index ${index}`;
    if (!site || typeof site !== 'object' || Array.isArray(site)) {
      fail(`[${label}] 必须是对象`);
      continue;
    }
    if (typeof site.slug !== 'string' || !SLUG.test(site.slug)) {
      fail(`[${label}] slug 仅允许小写字母、数字和连字符`);
      continue;
    }
    if (seen.has(site.slug)) fail(`[${label}] slug 重复`);
    seen.add(site.slug);

    for (const field of ['name', 'description']) {
      if (!isNonEmptyString(site[field])) fail(`[${label}] ${field} 不能为空`);
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
    if (!STATUSES.has(site.status)) {
      fail(`[${label}] status 必须是 ${[...STATUSES].join(', ')} 之一`);
    }
    if (!KINDS.has(site.kind)) {
      fail(`[${label}] kind 必须是 ${[...KINDS].join(', ')} 之一`);
    }
    if (!Array.isArray(site.tags) || site.tags.length < 1 || site.tags.length > 4 ||
        site.tags.some(tag => typeof tag !== 'string' || tag.length > 24 || !TAG.test(tag)) ||
        new Set(site.tags).size !== site.tags.length) {
      fail(`[${label}] tags 需为 1-4 个不重复的小写标签（字母、数字与 . + -）`);
    }
    if (site.updatedAt && !DATE.test(site.updatedAt)) {
      fail(`[${label}] updatedAt 应使用 YYYY-MM-DD 格式`);
    }

    const siteDir = `sites/${site.slug}`;
    const absoluteDir = resolve(root, siteDir);
    if (!insideRoot(root, siteDir) || !existsSync(absoluteDir) || !statSync(absoluteDir).isDirectory()) {
      fail(`[${label}] 站点目录不存在：${siteDir}`);
    } else if (!existsSync(resolve(absoluteDir, 'index.html'))) {
      fail(`[${label}] 站点缺少 index.html：${siteDir}`);
    }

    if (site.previewPath !== undefined && site.previewPath !== `${siteDir}/`) {
      fail(`[${label}] previewPath 必须是 ${siteDir}/`);
    }
    const readme = site.readme || `${siteDir}/README.md`;
    if (!isNonEmptyString(readme) || !readme.startsWith(`${siteDir}/`) ||
        /^(?:[a-z]+:|\/|\\)/i.test(readme) || !insideRoot(root, readme) || !existsSync(resolve(root, readme))) {
      fail(`[${label}] readme 必须是 ${siteDir}/ 下存在的文件`);
    }

    if (site.sourceRepository !== undefined) {
      if (!SOURCE_REPO.test(site.sourceRepository)) {
        fail(`[${label}] sourceRepository 格式无效`);
      }
      const markerPath = resolve(root, siteDir, 'MIRROR-IMPORT.json');
      if (!existsSync(markerPath)) {
        fail(`[${label}] 缺少 MIRROR-IMPORT.json`);
      } else {
        let marker;
        try {
          marker = JSON.parse(readFileSync(markerPath, 'utf8'));
        } catch {
          fail(`[${label}] MIRROR-IMPORT.json 不是有效 JSON`);
        }
        if (marker) {
          if (marker.repository !== site.sourceRepository) fail(`[${label}] 导入来源与 sourceRepository 不一致`);
          if (!SHA.test(marker.commit || '')) fail(`[${label}] 导入记录缺少有效的原提交 SHA`);
          if (!DATE.test(marker.importedAt || '')) fail(`[${label}] 导入记录缺少有效日期`);
        }
      }
    }
  }
  return errors;
}
