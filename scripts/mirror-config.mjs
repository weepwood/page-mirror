import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const sourcesPath = resolve(root, 'sites/mirror-sources.json');
export const validSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function loadSources() {
  const manifest = JSON.parse(readFileSync(sourcesPath, 'utf8'));
  if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.sources)) {
    throw new Error('mirror-sources.json 需要 schemaVersion=1 和 sources 数组');
  }
  const slugs = new Set();
  const repositories = new Set();
  for (const item of manifest.sources) {
    if (!item || typeof item !== 'object' ||
        typeof item.slug !== 'string' || !validSlug.test(item.slug) ||
        typeof item.repository !== 'string' ||
        !/^weepwood\/[a-zA-Z0-9._-]+-mirror$/i.test(item.repository) ||
        !['static', 'vite'].includes(item.kind) ||
        !/^[\w./-]+$/.test(item.branch || '') ||
        (item.branch || '').includes('..') ||
        !item.name || !item.description) {
      throw new Error('镜像源字段无效：' + JSON.stringify(item));
    }
    const url = new URL(item.sourceUrl);
    if (!['https:', 'http:'].includes(url.protocol)) {
      throw new Error('源网站必须为 HTTP(S)：' + item.slug);
    }
    if (slugs.has(item.slug) || repositories.has(item.repository.toLowerCase())) {
      throw new Error('镜像源 slug 或 repository 重复：' + item.slug);
    }
    slugs.add(item.slug);
    repositories.add(item.repository.toLowerCase());
  }
  return manifest.sources;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const sources = loadSources();
  console.log('镜像源配置校验通过：' + sources.length + ' 个公开仓库待迁移/已登记。');
}
