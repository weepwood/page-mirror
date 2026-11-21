import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {scanCssAssets,formatCssReport} from '../scripts/audit-css-assets.mjs';
import {rewriteInlineStyleAssetUrls} from '../scripts/rewrite-inline-assets.mjs';

test('产物 CSS 审计区分缺失文件、外部资源和可修复根路径',t=>{
  const dir=mkdtempSync(join(tmpdir(),'mirror-css-audit-'));
  t.after(()=>rmSync(dir,{recursive:true,force:true}));
  const site=join(dir,'sites','demo');
  mkdirSync(join(site,'assets'),{recursive:true});
  writeFileSync(join(site,'assets','font.woff2'),'font');
  writeFileSync(join(site,'index.html'),
    '<style>@font-face{src:url(/assets/font.woff2)}.a{background:url(./missing.png)}</style>'+
    '<script>const foo="url(/assets/font.woff2)"</script>');
  writeFileSync(join(site,'assets','style.css'),
    '.a{background:url(https://cdn.example/logo.svg)} .b{background:url(/absent.png)}');
  const result=scanCssAssets(dir);
  assert.equal(result.totals.rootFixable,1);
  assert.equal(result.totals.missingRelative,1);
  assert.equal(result.totals.missingRoot,1);
  assert.match(formatCssReport(result),/demo/);
  const source='<style>@font-face{src:url(/assets/font.woff2)}</style>';
  const updated=rewriteInlineStyleAssetUrls(source,site,join(site,'index.html'));
  writeFileSync(join(site,'index.html'),updated);
  const rescanned=scanCssAssets(dir);
  assert.equal(rescanned.totals.rootFixable,0);
});

test('CSS 审计不把评论、data URL 或脚本字符串当成本地资源',t=>{
  const dir=mkdtempSync(join(tmpdir(),'mirror-css-safe-'));
  t.after(()=>rmSync(dir,{recursive:true,force:true}));
  const site=join(dir,'sites','demo');
  mkdirSync(site,{recursive:true});
  writeFileSync(join(site,'index.html'),
    '<style>/* url(/fake.png) */ .x{background:url(data:image/png;base64,abc)}</style>'+
    '<script>let x="url(/fake.png)"</script>');
  assert.deepEqual(scanCssAssets(dir).sites[0].problems,[]);
});
