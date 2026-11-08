import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const XML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' };

/** Escape a value for use inside an XML element. */
export function xmlEscape(value) {
  return String(value).replace(/[&<>"']/g, char => XML_ESCAPES[char]);
}

/** The Pages base URL lives in package.json so the build has one source of truth. */
export function resolveHomepage(root, pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'))) {
  const value = pkg.homepage;
  if (typeof value !== 'string' || !/^https:\/\/[a-z0-9.-]+\/[a-z0-9._/-]+\/$/i.test(value)) {
    throw new Error('package.json 需要以 / 结尾的 HTTPS homepage 字段');
  }
  return value;
}

/**
 * Build the Pages sitemap from the registry, not from a hand-maintained list.
 * The root entry uses the most recent registry updatedAt so the output is deterministic.
 * `availableSlugs` limits entries to sites actually present in the build output,
 * so a targeted `--only` build never advertises URLs that would 404 on Pages.
 */
export function buildSitemap(registry, homepage, availableSlugs = null) {
  if (!registry || !Array.isArray(registry.sites)) throw new Error('registry.sites 必须是数组');
  const sites = availableSlugs
    ? registry.sites.filter(site => availableSlugs.has(site.slug))
    : registry.sites;
  const dates = sites
    .map(site => site.updatedAt)
    .filter(date => /^\d{4}-\d{2}-\d{2}$/.test(date || ''))
    .sort();
  const entries = [{ loc: homepage, lastmod: dates.at(-1) }];
  for (const site of sites) {
    const path = site.previewPath || `sites/${site.slug}/`;
    entries.push({ loc: homepage + path, lastmod: site.updatedAt });
  }
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(entry => '  <url><loc>' + xmlEscape(entry.loc) + '</loc>' +
      (entry.lastmod ? '<lastmod>' + xmlEscape(entry.lastmod) + '</lastmod>' : '') +
      '</url>'),
    '</urlset>',
    '',
  ].join('\n');
}
