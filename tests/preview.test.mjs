import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createPreviewServer, DEFAULT_PORT, MIME } from '../scripts/preview.mjs';

const BASE = '/page-mirror/';

function fixture(t) {
  const dir = mkdtempSync(join(tmpdir(), 'pm-preview-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  writeFileSync(join(dir, 'index.html'), '<title>directory</title>');
  writeFileSync(join(dir, '404.html'), '<title>custom 404</title>');
  writeFileSync(join(dir, 'robots.txt'), 'User-agent: *');
  mkdirSync(join(dir, 'sites', 'demo', 'assets'), { recursive: true });
  writeFileSync(join(dir, 'sites', 'registry.json'), '{"sites":[]}');
  writeFileSync(join(dir, 'sites', 'demo', 'index.html'), '<title>demo</title>');
  writeFileSync(join(dir, 'sites', 'demo', 'assets', 'app.js'), 'console.log(1)');
  return dir;
}

async function start(t) {
  const server = createPreviewServer(fixture(t), { base: BASE });
  await new Promise(done => server.listen(0, '127.0.0.1', done));
  // Keep-alive sockets would otherwise hold server.close() for 5 seconds.
  t.after(() => new Promise(done => { server.closeAllConnections(); server.close(done); }));
  return server.address().port;
}

function request(port, path, method = 'GET') {
  return new Promise((done, fail) => {
    const req = http.request({ host: '127.0.0.1', port, path, method, headers: { Connection: 'close' } }, res => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => done({ status: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', fail);
    req.end();
  });
}

test('预览服务按 Pages 子路径提供站点与静态资源', async t => {
  const port = await start(t);
  const home = await request(port, BASE);
  assert.equal(home.status, 200);
  assert.match(home.headers['content-type'], /text\/html/);
  assert.match(home.body, /directory/);

  const demo = await request(port, BASE + 'sites/demo/');
  assert.equal(demo.status, 200);
  assert.match(demo.body, /demo/);

  const registry = await request(port, BASE + 'sites/registry.json');
  assert.equal(registry.status, 200);
  assert.match(registry.headers['content-type'], /application\/json/);

  const script = await request(port, BASE + 'sites/demo/assets/app.js');
  assert.equal(script.status, 200);
  assert.match(script.headers['content-type'], /javascript/);

  const robots = await request(port, BASE + 'robots.txt');
  assert.equal(robots.status, 200);
  assert.match(robots.headers['content-type'], /text\/plain/);

  assert.equal(home.headers['cache-control'], 'no-store');
  assert.ok(DEFAULT_PORT > 0);
  for (const ext of ['.html', '.js', '.css', '.json', '.svg', '.glb', '.woff2']) {
    assert.ok(MIME[ext], 'MIME 缺少 ' + ext);
  }
});

test('缺失路径回退自定义 404，子路径之外不回退', async t => {
  const port = await start(t);
  const missing = await request(port, BASE + 'sites/arc-crm/nope/deep');
  assert.equal(missing.status, 404);
  assert.match(missing.body, /custom 404/);

  const outside = await request(port, '/somewhere-else/');
  assert.equal(outside.status, 404);
  assert.doesNotMatch(outside.body, /custom 404/);
});

test('目录穿越、非法编码、HEAD 与非 GET 请求都被正确处理', async t => {
  const port = await start(t);
  const traversal = await request(port, BASE + '%2e%2e%2f%2e%2e%2fpackage.json');
  assert.equal(traversal.status, 403);

  const malformed = await request(port, BASE + '%E0%A4%A');
  assert.equal(malformed.status, 400);

  const head = await request(port, BASE, 'HEAD');
  assert.equal(head.status, 200);
  assert.equal(head.body, '');
  assert.ok(Number(head.headers['content-length']) > 0);

  const post = await request(port, BASE, 'POST');
  assert.equal(post.status, 405);
  assert.equal(post.headers['allow'], 'GET, HEAD');
});
