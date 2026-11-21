import { existsSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';

/**
 * Rebase local Astro build assets that appear outside src/href (notably
 * component-url, renderer-url and inline @font-face declarations).
 * Only rewrite when this site actually contains an _astro directory.
 */
export function rewriteAstroAssetUrls(html, siteRoot, htmlFile) {
  if (!existsSync(join(siteRoot, '_astro'))) return html;
  const parent = relative(dirname(htmlFile), siteRoot).split(sep).join('/');
  const prefix = (parent ? parent + '/' : './') + '_astro/';
  return html.replace(/(["'(])\/_astro\//g, '$1' + prefix);
}
