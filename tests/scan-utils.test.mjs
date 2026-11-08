import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { collectHtml, formatBytes, toPosix, walkFiles } from '../scripts/scan-utils.mjs';

function fixture(t) {
  const dir = mkdtempSync(join(tmpdir(), 'pm-scan-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  mkdirSync(join(dir, 'nested'), { recursive: true });
  writeFileSync(join(dir, 'a.html'), '<html></html>');
  writeFileSync(join(dir, 'b.htm'), '<html></html>');
  writeFileSync(join(dir, 'c.js'), 'const x = 1;');
  writeFileSync(join(dir, 'nested', 'd.html'), '<html></html>');
  writeFileSync(join(dir, 'nested', 'e.css'), 'body{}');
  return dir;
}

test('walkFiles 递归收集文件、POSIX 相对路径与体积', t => {
  const dir = fixture(t);
  const files = [];
  walkFiles(dir, file => files.push(file));
  assert.deepEqual(files.map(file => file.rel).sort(), [
    'a.html', 'b.htm', 'c.js', 'nested/d.html', 'nested/e.css',
  ]);
  const contents = {
    'a.html': '<html></html>', 'b.htm': '<html></html>', 'c.js': 'const x = 1;',
    'nested/d.html': '<html></html>', 'nested/e.css': 'body{}',
  };
  for (const file of files) {
    assert.ok(!file.rel.includes('\\'), '相对路径必须使用正斜杠');
    assert.ok(file.abs.startsWith(dir));
    assert.equal(file.size, Buffer.byteLength(contents[file.rel]));
  }
  assert.equal(toPosix('docs\\build-audit.md'), 'docs/build-audit.md');
});

test('collectHtml 只访问 HTML 文件，且复用同一遍历规则', t => {
  const dir = fixture(t);
  const html = [];
  collectHtml(dir, file => html.push(file.rel));
  assert.deepEqual(html.sort(), ['a.html', 'b.htm', 'nested/d.html']);
});

test('符号链接不会被跟随（能力受限时跳过该断言）', t => {
  const dir = fixture(t);
  try {
    symlinkSync(join(dir, 'a.html'), join(dir, 'linked.html'));
  } catch {
    return; // Windows without developer mode cannot create symlinks.
  }
  const files = [];
  walkFiles(dir, file => files.push(file.rel));
  assert.ok(!files.includes('linked.html'), '符号链接必须跳过');
});

test('formatBytes 覆盖 B / KB / MB 三档', () => {
  assert.equal(formatBytes(512), '512 B');
  assert.equal(formatBytes(2048), '2.0 KB');
  assert.equal(formatBytes(5 * 1024 * 1024), '5.0 MB');
  assert.equal(formatBytes(0), '0 B');
});
