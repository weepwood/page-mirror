import { cpSync, existsSync, lstatSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join, relative, resolve, sep } from 'node:path';
import { execFileSync } from 'node:child_process';
import { loadSources, root } from './mirror-config.mjs';
import { isSensitiveName, IMPORT_DENY_DIRS } from './site-assets.mjs';

const args = process.argv.slice(2);
const only = args.find(arg => arg.startsWith('--only='))?.slice('--only='.length);
const refresh = args.includes('--refresh');
const sources = loadSources().filter(item => !only || item.slug === only);
if (!sources.length) throw new Error('找不到匹配的镜像源：' + only);

async function assertPublic(item) {
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'page-mirror-importer' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = 'Bearer ' + process.env.GITHUB_TOKEN;
  const res = await fetch('https://api.github.com/repos/' + item.repository, { headers });
  if (!res.ok) throw new Error(item.slug + ': 无法核验公开性（HTTP ' + res.status + '），拒绝导入');
  const data = await res.json();
  if (data.private !== false || data.visibility === 'private') {
    throw new Error(item.slug + ': 源仓库不是公开仓库，禁止导入公开 page-mirror');
  }
}

function git(args, cwd) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }).trim();
}
function shouldCopy(sourceRoot, candidate) {
  const rel = relative(sourceRoot, candidate);
  const parts = rel.split(sep);
  if (parts.some(part => IMPORT_DENY_DIRS.has(part))) return false;
  const name = basename(candidate);
  if (name === '.gitignore' || name === '.DS_Store' || isSensitiveName(name)) return false;
  const stat = lstatSync(candidate);
  if (stat.isSymbolicLink()) throw new Error('不允许链接文件：' + rel);
  return true;
}

const registryPath = resolve(root, 'sites/registry.json');
const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
const temp = mkdtempSync(join(tmpdir(), 'page-mirror-'));
try {
  for (const item of sources) {
    await assertPublic(item);
    const target = resolve(root, 'sites', item.slug);
    const markerPath = join(target, 'MIRROR-IMPORT.json');
    if (existsSync(target) && !existsSync(markerPath)) {
      throw new Error('目录已存在且不受导入器管理，拒绝覆盖：' + target);
    }
    if (existsSync(markerPath)) {
      const old = JSON.parse(readFileSync(markerPath, 'utf8'));
      if (old.repository !== item.repository) throw new Error('源仓库不一致，拒绝覆盖：' + item.slug);
      if (!refresh) {
        console.log('已经导入，跳过（需要更新时指定 --refresh）：' + item.slug);
        continue;
      }
    }
    const checkout = join(temp, item.slug);
    git(['clone', '--depth=1', '--single-branch', '--branch', item.branch, '--quiet',
      'https://github.com/' + item.repository + '.git', checkout], root);
    const sha = git(['rev-parse', 'HEAD'], checkout);
    const date = git(['show', '-s', '--format=%cs', 'HEAD'], checkout);
    if (existsSync(target)) rmSync(target, { recursive: true, force: true });
    mkdirSync(target, { recursive: true });
    cpSync(checkout, target, { recursive: true, force: true, filter: path => shouldCopy(checkout, path) });
    writeFileSync(markerPath, JSON.stringify({
      repository: item.repository, branch: item.branch, commit: sha, importedAt: date,
      kind: item.kind, note: '从公开仓库导入；本目录后续由 page-mirror 维护。'
    }, null, 2) + '\n');
    if (!existsSync(join(target, 'README.md'))) {
      writeFileSync(join(target, 'README.md'), '# ' + item.name + '\n\n来源：' + item.repository + '\n');
    }
    const idx = registry.sites.findIndex(site => site.slug === item.slug);
    const entry = {
      slug: item.slug, name: item.name, sourceUrl: item.sourceUrl,
      description: item.description, status: 'review',
      previewPath: 'sites/' + item.slug + '/',
      readme: 'sites/' + item.slug + '/README.md',
      updatedAt: date, sourceRepository: item.repository,
      kind: item.kind === 'vite' ? 'source' : 'snapshot',
      tags: item.kind === 'vite' ? ['vite', 'auto-imported'] : ['static-snapshot', 'auto-imported']
    };
    if (idx < 0) registry.sites.push(entry);
    else registry.sites[idx] = { ...entry, ...registry.sites[idx], updatedAt: date, sourceRepository: item.repository };
    console.log('已迁入 ' + item.repository + ' @ ' + sha.slice(0, 12) + ' → sites/' + item.slug);
  }
  registry.sites.sort((a, b) => a.slug.localeCompare(b.slug));
  writeFileSync(registryPath, JSON.stringify(registry, null, 2) + '\n');
} finally {
  rmSync(temp, { recursive: true, force: true });
}
