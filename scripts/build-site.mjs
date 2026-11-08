import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { execFileSync, execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { loadSources, root } from './mirror-config.mjs';
import { shouldPublish } from './site-assets.mjs';
import { buildSitemap, resolveHomepage } from './sitemap.mjs';

const out = resolve(root, '.site-build');
const registryPath = resolve(root, 'sites/registry.json');
const sources = new Map(loadSources().map(item => [item.slug, item]));
const registry = JSON.parse(readFileSync(registryPath, 'utf8'));

const onlyArg = process.argv.slice(2).find(arg => arg.startsWith('--only='));
const only = onlyArg ? onlyArg.slice('--only='.length).split(',').filter(Boolean) : null;
if (only) {
  if (!only.length) throw new Error('--only 需要至少一个站点 slug');
  for (const slug of only) {
    if (!registry.sites.some(site => site.slug === slug)) throw new Error('未知站点 slug：' + slug);
  }
}

function copyStatic(source, dest) {
  cpSync(source, dest, { recursive: true, filter: path => shouldPublish(source, path) });
}
// Windows resolves npm through npm.cmd, which execFileSync cannot spawn directly.
function runNpm(args, cwd) {
  if (process.platform === 'win32') {
    execSync(['npm', ...args].join(' '), { cwd, stdio: 'inherit', shell: true });
  } else {
    execFileSync('npm', args, { cwd, stdio: 'inherit' });
  }
}
function rewriteLocalAssetUrls(siteRoot) {
  function visit(dir) {
    for (const ent of readdirSync(dir, { withFileTypes: true })) {
      const abs = join(dir, ent.name);
      if (ent.isDirectory()) { visit(abs); continue; }
      if (!ent.isFile()) continue;
      const ext = extname(abs).toLowerCase();
      if (!['.html', '.htm', '.css'].includes(ext)) continue;
      const input = readFileSync(abs, 'utf8');
      let output = input;
      if (ext === '.html' || ext === '.htm') {
        output = output.replace(/\b(src|href|poster)=(["'])\/(?!\/)([^"'?#]+)([^"']*)\2/gi, (all, attr, q, path, extra) => {
          if (!existsSync(join(siteRoot, path))) return all;
          const prefix = relative(dirname(abs), siteRoot).split(sep).join('/');
          const dest = (prefix ? prefix + '/' : './') + path + extra;
          return attr + '=' + q + dest + q;
        });
      } else {
        output = output.replace(/url\(\s*(["']?)\/(?!\/)([^)'"]+)\1\s*\)/gi, (all, q, path) => {
          if (!existsSync(join(siteRoot, path))) return all;
          let p = relative(dirname(abs), join(siteRoot, path)).split(sep).join('/');
          if (!p.startsWith('.')) p = './' + p;
          return 'url(' + q + p + q + ')';
        });
      }
      if (output !== input) writeFileSync(abs, output);
    }
  }
  visit(siteRoot);
}

// Full builds wipe the output; targeted builds keep the other sites intact.
if (!only) rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, 'sites'), { recursive: true });
// Root-level Pages assets: a custom 404, crawler hints, a static favicon and the
// sitemap generated from the registry (never maintained by hand).
for (const file of ['index.html', '404.html', 'robots.txt', 'favicon.svg']) {
  cpSync(resolve(root, file), join(out, file));
}
const homepage = resolveHomepage(root);
const sitemap = buildSitemap(registry, homepage);
writeFileSync(join(out, 'sitemap.xml'), sitemap);
cpSync(registryPath, join(out, 'sites/registry.json'));
writeFileSync(join(out, '.nojekyll'), '');

let built = 0;
for (const site of registry.sites) {
  if (only && !only.includes(site.slug)) continue;
  const path = resolve(root, 'sites', site.slug);
  if (!existsSync(path)) throw new Error('站点目录不存在：' + site.slug);
  const dest = join(out, 'sites', site.slug);
  rmSync(dest, { recursive: true, force: true });
  const source = sources.get(site.slug);
  if (source?.kind === 'vite') {
    // Skip a full reinstall when node_modules already matches the lockfile.
    // CI runners always start clean, so they still run npm ci (served by the npm cache).
    const lockPath = join(path, 'package-lock.json');
    const stampPath = join(path, 'node_modules', '.page-mirror-lock');
    const lockHash = existsSync(lockPath)
      ? createHash('sha256').update(readFileSync(lockPath)).digest('hex')
      : 'no-lock';
    const installed = existsSync(join(path, 'node_modules')) && existsSync(stampPath) &&
      readFileSync(stampPath, 'utf8') === lockHash;
    if (!installed) {
      runNpm(['ci', '--ignore-scripts', '--no-audit', '--no-fund'], path);
      mkdirSync(join(path, 'node_modules'), { recursive: true });
      writeFileSync(stampPath, lockHash);
    }
    runNpm(['run', 'build'], path);
    if (!existsSync(join(path, 'dist/index.html'))) throw new Error('Vite 产物缺少 index.html：' + site.slug);
    cpSync(join(path, 'dist'), dest, { recursive: true });
  } else {
    copyStatic(path, dest);
    rewriteLocalAssetUrls(dest);
  }
  if (!existsSync(join(dest, 'index.html'))) throw new Error('站点缺少 index.html：' + site.slug);
  built++;
}

const missing = only ? registry.sites.filter(site => !existsSync(join(out, 'sites', site.slug, 'index.html'))) : [];
console.log(`部署目录已生成：${out}；本次构建 ${built}/${registry.sites.length} 个站点` + (only ? `（--only=${only.join(',')}）` : '（全量）'));
console.log(`sitemap.xml：${registry.sites.length + 1} 个 URL（根目录 + ${registry.sites.length} 个站点），base=${homepage}`);
if (missing.length) {
  console.warn(`注意：另有 ${missing.length} 个站点未包含在当前产物中，部署前请运行不带 --only 的全量构建。`);
}
