/**
 * 微信读书公开首页原站 DOM 镜像采集。
 * 仅记录游客可见内容，不采集 Cookie、账号、付费章节，不移植原站 JS。
 */
import { chromium } from 'playwright';
import { createHash } from 'node:crypto';
import { mkdir, writeFile, readdir, rm } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const source = 'https://weread.qq.com/';
const dest = resolve('sites/weread');
const assets = join(dest, 'assets');
const MAX_TOTAL = 50 * 1024 * 1024;
const MAX_EACH = 3 * 1024 * 1024;
const saved = new Map();
const pending = [];
let total = 0;
const resourceType = mime => /^(image\/(?:png|jpeg|webp|gif|svg\+xml|avif)|text\/css|font\/|application\/(?:font|x-font|vnd\.ms-fontobject|octet-stream))/i.test(mime);
const fromWeread = url => {
  try {
    const host = new URL(url).hostname;
    return host === 'weread.qq.com' || host.endsWith('.weread.qq.com') ||
      host.endsWith('.gtimg.cn') || host.endsWith('.qpic.cn');
  } catch { return false; }
};
const extension = (mime, url) => {
  if (mime.includes('css')) return '.css';
  if (mime.includes('svg')) return '.svg';
  if (mime.includes('png')) return '.png';
  if (mime.includes('jpeg')) return '.jpg';
  if (mime.includes('webp')) return '.webp';
  if (mime.includes('gif')) return '.gif';
  if (mime.includes('avif')) return '.avif';
  if (mime.includes('woff2') || url.includes('.woff2')) return '.woff2';
  if (mime.includes('woff') || url.includes('.woff')) return '.woff';
  if (mime.includes('ttf') || url.includes('.ttf')) return '.ttf';
  return '.bin';
};
await mkdir(assets, {recursive:true});
for(const entry of await readdir(assets)){
  if(/^[0-9a-f]{18}\.[a-z0-9]+$/.test(entry)) await rm(join(assets,entry));
}
const browser = await chromium.launch({ headless:true, args:['--no-sandbox','--disable-dev-shm-usage'] });
const context = await browser.newContext({
  viewport:{width:1440,height:900}, deviceScaleFactor:1,
  locale:'zh-CN', timezoneId:'Asia/Shanghai', colorScheme:'light'
});
const page = await context.newPage();
page.on('response', response => {
  pending.push((async () => {
    const url = response.url();
    if(!fromWeread(url) || response.status() >= 400 || saved.has(url) || saved.size >= 700) return;
    const headers = await response.allHeaders();
    const mime = (headers['content-type'] || '').split(';')[0].trim().toLowerCase();
    if(!resourceType(mime) || Number(headers['content-length'] || 0) > MAX_EACH) return;
    const bytes = await response.body();
    if(!bytes.length || bytes.length > MAX_EACH || total + bytes.length > MAX_TOTAL) return;
    const name = createHash('sha256').update(url).digest('hex').slice(0,18) + extension(mime,url);
    saved.set(url,{mime,bytes,name});
    total += bytes.length;
  })().catch(err => console.warn('资源采集跳过:',err.message)));
});
try {
  const navigation = await page.goto(source,{waitUntil:'domcontentloaded',timeout:60000});
  if(!navigation?.ok()) throw new Error('原站 HTTP 状态异常: ' + navigation?.status());
  await page.waitForTimeout(5500);
  for(let i=0;i<18;i++){
    await page.evaluate(() => window.scrollBy(0, 680));
    await page.waitForTimeout(260);
    if(await page.evaluate(() => window.scrollY + innerHeight >= document.documentElement.scrollHeight-20)) break;
  }
  await page.evaluate(() => window.scrollTo(0,0));
  await page.evaluate(() => document.fonts?.ready).catch(()=>{});
  await page.waitForTimeout(1200);
  const text = await page.locator('body').innerText();
  if(!text.includes('大家都在看') && !text.includes('榜单')){
    throw new Error('没有检测到微信读书首页正文：可能被原站访问限制拦截，不能将错误页当作镜像。');
  }
  const reference = resolve('weread-reference');
  await mkdir(reference,{recursive:true});
  await page.screenshot({path:join(reference,'desktop-1440.png'),fullPage:true,animations:'disabled'});
  const mobile = await browser.newPage({viewport:{width:390,height:844},locale:'zh-CN'});
  try {
    await mobile.goto(source,{waitUntil:'domcontentloaded',timeout:60000});
    await mobile.waitForTimeout(2500);
    await mobile.screenshot({path:join(reference,'mobile-390.png'),fullPage:true,animations:'disabled'});
  } catch(e){ console.warn('移动端截图暂不可用:',e.message); }
  finally { await mobile.close(); }
  await Promise.allSettled(pending);
  const mapping = Object.fromEntries([...saved].map(([url,item]) => [url,item.name]));
  for(const [url,item] of saved){
    if(item.mime !== 'text/css'){
      await writeFile(join(assets,item.name),item.bytes);
      continue;
    }
    const css = item.bytes.toString('utf8').replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi,(match,quote,raw)=>{
      if(/^(data:|blob:|#)/i.test(raw)) return match;
      try {
        const absolute = new URL(raw,url).href;
        return 'url("' + (mapping[absolute] ? './'+mapping[absolute] : absolute) + '")';
      } catch {return match;}
    });
    await writeFile(join(assets,item.name),css);
  }
  const html = await page.evaluate(map => {
    const root = document.documentElement.cloneNode(true);
    const absolute = value => {try{return new URL(value,location.href).href;}catch{return value;}};
    const file = value => {
      const url = absolute(value);
      return map[url] ? './assets/' + map[url] : url;
    };
    root.querySelectorAll('script,iframe,noscript,base,meta[http-equiv="Content-Security-Policy"]')
      .forEach(el => el.remove());
    for(const el of root.querySelectorAll('*')){
      for(const attribute of [...el.attributes]) if(attribute.name.startsWith('on')) el.removeAttribute(attribute.name);
      if(el.hasAttribute('style')){
        el.setAttribute('style',el.getAttribute('style').replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi,
          (match,quote,url) => 'url("'+file(url)+'")'));
      }
    }
    for(const el of root.querySelectorAll('link[href]')) el.setAttribute('href',file(el.getAttribute('href')));
    for(const el of root.querySelectorAll('[src],[poster]')){
      for(const attr of ['src','poster']){
        if(el.hasAttribute(attr) && !/^(data:|blob:)/.test(el.getAttribute(attr)))
          el.setAttribute(attr,file(el.getAttribute(attr)));
      }
    }
    for(const el of root.querySelectorAll('[srcset]')){
      const current = el.getAttribute('srcset');
      if(current.includes('data:')) continue;
      el.setAttribute('srcset',current.split(',').map(part=>{
        const [url,...size] = part.trim().split(/\s+/);
        return file(url) + (size.length?' '+size.join(' '):'');
      }).join(', '));
    }
    for(const a of root.querySelectorAll('a[href]')){
      const href = a.getAttribute('href');
      a.setAttribute('href',/^javascript:/i.test(href)?'https://weread.qq.com/':href.startsWith('#')?href:absolute(href));
    }
    // 表单不会将用户提供的个人信息提交到这个复刻站点。
    for(const form of root.querySelectorAll('form')){
      form.setAttribute('action','https://weread.qq.com/');
      form.setAttribute('method','get');
    }
    const marker=document.createElement('meta');
    marker.name='mirror-source';
    marker.content='非官方静态视觉镜像，仅供研究；所有登录均应在 weread.qq.com 完成';
    root.querySelector('head')?.append(marker);
    return '<!doctype html>\n'+root.outerHTML;
  },mapping);
  const helper = [
    '<script>',
    'document.addEventListener("click",function(e){',
    '  const t=e.target.closest("button,[role=button],span,div");if(!t)return;',
    '  const s=(t.textContent||"").trim();',
    '  if((s==="登录"||s==="扫码登录")&&!t.closest("a[href]")){e.preventDefault();location.assign("https://weread.qq.com/");}',
    '});',
    'document.addEventListener("keydown",function(e){',
    '  if(e.key==="Enter"&&e.target.matches("input[type=search],input[placeholder*=搜索]")){e.preventDefault();location.assign("https://weread.qq.com/");}',
    '});',
    '</script>'
  ].join('\n');
  await writeFile(join(dest,'index.html'),html.replace(/<\/body>/i,helper+'\n</body>'));
  const status={
    sourceUrl:source, capturedAt:new Date().toISOString(), title:await page.title(),
    viewport:'1440x900', scope:'公开未登录首页的原站 DOM/CSS/资源视觉快照',
    assetCount:saved.size, assetBytes:total, authentication:'只允许跳转官方域名',
    limitations:['动态数据不能保证和截图时一致','原站 JavaScript 已移除，依赖后端的交互不可用','账号书架与付费阅读内容不在镜像范围','需要人工对照原站截图验收']
  };
  await writeFile(join(dest,'snapshot-status.json'),JSON.stringify(status,null,2)+'\n');
  console.log('镜像构建成功:',JSON.stringify(status));
} finally {await browser.close();}
