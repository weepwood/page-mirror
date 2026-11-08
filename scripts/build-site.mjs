import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { execFileSync } from 'node:child_process';
import { loadSources, root } from './mirror-config.mjs';

const out = resolve(root, '.site-build');
const sources = new Map(loadSources().map(item => [item.slug, item]));
const registry = JSON.parse(readFileSync(resolve(root, 'sites/registry.json'), 'utf8'));

function allowed(from, current) {
  const rel = relative(from, current);
  const parts = rel.split(sep);
  if (parts.some(p => ['.git', '.github', 'node_modules', 'tests', 'scripts', 'reference', 'docs', 'coverage', 'dist'].includes(p))) return false;
  if (parts.some(p => p.startsWith('.')) && rel !== '.') return false;
  if (statSync(current).isDirectory()) return true;
  return /\.(?:html?|css|js|mjs|json|xml|svg|png|jpe?g|webp|avif|gif|ico|woff2?|ttf|otf|eot|wasm|mp3|mp4|webm|glb|bin|txt|webmanifest|map|ogg|dds|srt|pdf)$/i.test(current);
}
function copyStatic(source, dest) {
  cpSync(source, dest, { recursive: true, filter: path => allowed(source, path) });
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

rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, 'sites'), { recursive: true });
cpSync(resolve(root, 'index.html'), join(out, 'index.html'));
cpSync(resolve(root, 'sites/registry.json'), join(out, 'sites/registry.json'));
writeFileSync(join(out, '.nojekyll'), '');

for (const site of registry.sites) {
  const path = resolve(root, 'sites', site.slug);
  if (!existsSync(path)) throw new Error('站点目录不存在：' + site.slug);
  const dest = join(out, 'sites', site.slug);
  const source = sources.get(site.slug);
  if (source?.kind === 'vite') {
    execFileSync('npm', ['ci', '--ignore-scripts', '--no-audit', '--no-fund'], { cwd: path, stdio: 'inherit' });
    execFileSync('npm', ['run', 'build'], { cwd: path, stdio: 'inherit' });
    if (!existsSync(join(path, 'dist/index.html'))) throw new Error('Vite 产物缺少 index.html：' + site.slug);
    cpSync(join(path, 'dist'), dest, { recursive: true });
  } else {
    copyStatic(path, dest);
    rewriteLocalAssetUrls(dest);
  }
  if (!existsSync(join(dest, 'index.html'))) throw new Error('站点缺少 index.html：' + site.slug);
}
console.log('部署目录已生成：' + out + '；站点数：' + registry.sites.length);
