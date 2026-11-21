import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { rewriteInlineStyleAssetUrls } from '../scripts/rewrite-inline-assets.mjs';

test('HTML 内联字体及背景资源使用 Pages 子路径，而非域名根路径', () => {
  const root = mkdtempSync(join(tmpdir(), 'page-mirror-inline-'));
  try {
    mkdirSync(join(root, '_m'));
    writeFileSync(join(root, '_m', 'font.woff2'), 'font');
    const input = '<style>@font-face{src:url(/_m/font.woff2)}.a{background:url("/_m/font.woff2?v=1")}'+
      '.b{background:url(/missing.svg)}.c{background:url(https://cdn.test/a.png)}</style>'+
      '<script>const path="url(/_m/font.woff2)"</script>';
    const output = rewriteInlineStyleAssetUrls(input, root, join(root, 'index.html'));
    assert.match(output, /url\(\.\/_m\/font\.woff2\)/);
    assert.match(output, /url\("\.\/_m\/font\.woff2\?v=1"\)/);
    assert.match(output, /url\(\/missing\.svg\)/);
    assert.match(output, /url\(https:\/\/cdn\.test\/a\.png\)/);
    assert.match(output, /<script>const path="url\(\/_m\/font\.woff2\)"<\/script>/);
    assert.equal(rewriteInlineStyleAssetUrls(output, root, join(root, 'index.html')), output);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('嵌套 HTML 正确计算相对资源路径', () => {
  const root = mkdtempSync(join(tmpdir(), 'page-mirror-nested-'));
  try {
    mkdirSync(join(root, 'assets'));
    writeFileSync(join(root, 'assets', 'image.png'), 'image');
    const nested = join(root, 'nested', 'index.html');
    const output = rewriteInlineStyleAssetUrls('<style>.x{background:url(/assets/image.png)}</style>', root, nested);
    assert.match(output, /url\(\.\.\/assets\/image\.png\)/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
