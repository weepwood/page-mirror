import { readFileSync, writeFileSync } from 'node:fs';
import { loadSources, sourcesPath, validSlug } from './mirror-config.mjs';

const args = Object.fromEntries(process.argv.slice(2).filter(x => x.startsWith('--')).map(x => {
  const position = x.indexOf('=');
  return [x.slice(2, position < 0 ? undefined : position), position < 0 ? '' : x.slice(position + 1)];
}));
const { slug, repo, name, sourceUrl } = args;
const kind = args.kind || 'static';
const branch = args.branch || 'main';
if (!validSlug.test(slug || '') || !repo || !name || !sourceUrl ||
    !['static', 'vite'].includes(kind)) {
  throw new Error('用法：node scripts/add-mirror.mjs --slug=demo --repo=weepwood/demo-mirror --name=Demo --sourceUrl=https://example.com/ [--kind=vite] [--branch=main]');
}
const sources = loadSources();
if (sources.some(s => s.slug === slug || s.repository.toLowerCase() === repo.toLowerCase())) {
  throw new Error('该 slug 或仓库已经登记');
}
const manifest = JSON.parse(readFileSync(sourcesPath, 'utf8'));
manifest.sources.push({
  slug, repository: repo, branch, kind, name, sourceUrl,
  description: args.description || ('从 ' + repo + ' 导入的静态站点，尚待完整验收。')
});
writeFileSync(sourcesPath, JSON.stringify(manifest, null, 2) + '\n');
console.log('已登记 ' + slug + '。提交 mirror-sources.json 后，GitHub Actions 将完成首次导入。');
