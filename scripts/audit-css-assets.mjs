import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { root } from './mirror-config.mjs';

// Only CSS url() values, never arbitrary JS strings, routes or HTML links.
const URL_REF = /url\(\s*(?:(["'])(.*?)\1|([^)"']*))\s*\)/gi;
const STYLE_BLOCK = /<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi;
const STYLE_ATTRIBUTE = /\bstyle\s*=\s*(["'])([\s\S]*?)\1/gi;
const CSS_COMMENT = /\/\*[\s\S]*?\*\//g;
const ASSET_EXT = /\.(?:css|js|png|jpe?g|svg|webp|avif|gif|ico|woff2?|ttf|otf|eot|wasm|glb|bin|dds|ktx2?|mp4|webm|mp3)$/i;

function inside(parent, child) { return child.startsWith(parent + sep) || child === parent; }
function splitUrl(value) {
  const raw = value.trim();
  if (!raw || /^(?:data:|blob:|https?:|\/\/|#)/i.test(raw) || raw.startsWith('var(')) return null;
  const clean = raw.split(/[?#]/)[0];
  try { return decodeURIComponent(clean); } catch { return clean; }
}
function collect(dir, visit) {
  for (const item of readdirSync(dir,{withFileTypes:true})) {
    const path=join(dir,item.name);
    if (item.isDirectory()) collect(path,visit);
    else if (item.isFile() && ['.html','.htm','.css'].includes(extname(path).toLowerCase())) visit(path);
  }
}
function urls(css) {
  return [...css.replace(CSS_COMMENT,'').matchAll(URL_REF)].map(match=>match[2]??match[3]).filter(Boolean);
}

/** Read-only inspection of CSS resources in the exact publish output. */
export function scanCssAssets(buildRoot) {
  const sitesRoot=join(buildRoot,'sites');
  if (!existsSync(sitesRoot)) throw Error('缺少构建产物 sites/，请先运行 npm run build');
  const sites=[];
  for (const entry of readdirSync(sitesRoot,{withFileTypes:true})) {
    if (!entry.isDirectory()) continue;
    const siteRoot=join(sitesRoot,entry.name);
    const problems=[];
    let references=0,scannedFiles=0;
    collect(siteRoot, file=>{
      scannedFiles++;
      const source=readFileSync(file,'utf8');
      const ext=extname(file).toLowerCase();
      let values=[];
      if (ext==='.css') values=urls(source);
      else {
        for (const match of source.matchAll(STYLE_BLOCK)) values.push(...urls(match[1]));
        for (const match of source.matchAll(STYLE_ATTRIBUTE)) values.push(...urls(match[2]));
      }
      for (const value of values) {
        const path=splitUrl(value);
        if (!path) continue;
        references++;
        const target=path.startsWith('/') ? resolve(siteRoot,path.slice(1)) : resolve(dirname(file),path);
        if (!inside(siteRoot,target)) continue;
        if (!existsSync(target)) {
          // Root paths may represent upstream dynamic endpoints or un-captured
          // resources; report as findings but don't silently rewrite them.
          const category=path.startsWith('/') ? 'root-missing' : 'relative-missing';
          problems.push({file:relative(buildRoot,file).replaceAll('\\','/'),url:value,category});
        } else if (path.startsWith('/')) {
          problems.push({file:relative(buildRoot,file).replaceAll('\\','/'),url:value,category:'root-fixable'});
        }
      }
    });
    sites.push({slug:entry.name,scannedFiles,references,problems});
  }
  sites.sort((a,b)=>a.slug.localeCompare(b.slug));
  return {sites,totals:{
    sites:sites.length,
    scannedFiles:sites.reduce((n,s)=>n+s.scannedFiles,0),
    references:sites.reduce((n,s)=>n+s.references,0),
    rootFixable:sites.reduce((n,s)=>n+s.problems.filter(p=>p.category==='root-fixable').length,0),
    missingRelative:sites.reduce((n,s)=>n+s.problems.filter(p=>p.category==='relative-missing').length,0),
    missingRoot:sites.reduce((n,s)=>n+s.problems.filter(p=>p.category==='root-missing').length,0)
  }};
}
export function formatCssReport(result) {
  const t=result.totals;
  const lines=[
    '# 镜像 CSS 资源健康报告','',
    '> 从实际发布产物中扫描 CSS 文件、HTML 内联 style 与 style 属性，不修改镜像。','',
    `扫描 ${t.sites} 个站点 / ${t.scannedFiles} 个文件，CSS URL ${t.references} 条。根路径可修复 ${t.rootFixable}，缺失相对资源 ${t.missingRelative}，缺失根路径资源 ${t.missingRoot}。`,'',
    '| 站点 | 可修复根路径 | 缺失相对资源 | 缺失根路径资源 |','| --- | ---: | ---: | ---: |'
  ];
  for (const site of result.sites) {
    const count=category=>site.problems.filter(p=>p.category===category).length;
    lines.push(`| \`${site.slug}\` | ${count('root-fixable')} | ${count('relative-missing')} | ${count('root-missing')} |`);
  }
  lines.push('','## 问题示例','');
  for (const site of result.sites.filter(s=>s.problems.length)) {
    lines.push(`### ${site.slug}`,'');
    for(const item of site.problems.slice(0,10))lines.push(`- ${item.category}: \`${item.url}\` — \`${item.file}\``);
    lines.push('');
  }
  lines.push('动态脚本生成的 URL、HTTP 资源状态、浏览器 CSP/CORS 与 iframe 行为不在此静态报告覆盖范围。','');
  return lines.join('\n');
}

if (process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const report=scanCssAssets(resolve(root,'.site-build'));
  if (process.argv.includes('--json'))console.log(JSON.stringify(report,null,2));
  else if (process.argv.includes('--check')) {
    console.log(`CSS 资源：${report.totals.references} 处引用，${report.totals.rootFixable} 处可修复根路径，${report.totals.missingRelative} 处缺失相对资源`);
    // Existing third-party snapshots can be incomplete. Fail only on path
    // mistakes we can deterministically fix from files present in the build.
    if (report.totals.rootFixable)process.exitCode=1;
  } else console.log(formatCssReport(report));
}
