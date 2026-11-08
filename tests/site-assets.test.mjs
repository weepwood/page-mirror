import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { isSensitiveName, shouldPublish, LOCAL_TOOL_SCRIPT } from '../scripts/site-assets.mjs';

const temp = mkdtempSync(join(tmpdir(), 'pm-assets-'));
const files = {
  'index.html': true,
  'index.txt': true,            // Next.js RSC payload must be published
  'site.webmanifest': true,
  'assets/hero.png': true,
  'assets/app.css': true,
  'assets/shots-xP4pPuRW.js': true, // real hashed asset, not a local helper
  'data/feed.json': true,
  'MIRROR-IMPORT.json': false,
  'package.json': false,
  'package-lock.json': false,
  'README.md': false,
  'netlify.toml': false,
  'server.js': false,
  'server.mjs': false,
  'serve.js': false,
  'shot.js': false,
  'shot2.js': false,
  'verify.js': false,
  'discover.js': false,
  'capture.js': false,
  '.env': false,
  '.npmrc': false,
  'credentials.json': false,
  'private.key': false,
  'bundle.js.map': false,
  'crawl.py': false,
  'reference/source/app.js': false,
  'docs/notes.json': false,
  'node_modules/pkg/index.js': false,
  '.hidden/logo.png': false,
  'tests/fixture.json': false,
};

for (const [rel, expected] of Object.entries(files)) {
  const absolute = join(temp, rel);
  mkdirSync(dirname(absolute), { recursive: true });
  writeFileSync(absolute, '');
}

test('发布过滤：浏览器资源保留，内部文件排除', () => {
  for (const [rel, expected] of Object.entries(files)) {
    assert.equal(shouldPublish(temp, join(temp, rel)), expected, rel);
  }
  rmSync(temp, { recursive: true, force: true });
});

test('发布过滤：受管目录本身也被拒绝', () => {
  const temp2 = mkdtempSync(join(tmpdir(), 'pm-assets-dirs-'));
  for (const dir of ['reference', 'docs', 'node_modules', 'tests', 'scripts']) {
    mkdirSync(join(temp2, dir), { recursive: true });
    assert.equal(shouldPublish(temp2, join(temp2, dir)), false, dir);
  }
  mkdirSync(join(temp2, 'assets'), { recursive: true });
  assert.equal(shouldPublish(temp2, join(temp2, 'assets')), true);
  rmSync(temp2, { recursive: true, force: true });
});

test('敏感文件识别覆盖凭据与密钥', () => {
  for (const name of ['.env', '.env.local', '.npmrc', '.pypirc', '.netrc', 'credentials.json',
    'serviceAccountKey.json', 'client_secret.json', 'id_rsa', 'id_ed25519',
    'server.pem', 'signing.key', 'cert.p12', 'bundle.pfx', 'ssh.ppk']) {
    assert.equal(isSensitiveName(name), true, name);
  }
  for (const name of ['index.html', 'Tokens-DWBq-DA0.js', 'feed.json', 'tokenomics.json']) {
    assert.equal(isSensitiveName(name), false, name);
  }
});

test('本地工具脚本规则不误伤站点资源', () => {
  for (const name of ['server.js', 'serve.mjs', 'shot2.js', 'verify.js']) {
    assert.match(name, LOCAL_TOOL_SCRIPT);
  }
  for (const name of ['shots-xP4pPuRW.js', 'app.js', 'main.js']) {
    assert.doesNotMatch(name, LOCAL_TOOL_SCRIPT);
  }
});
