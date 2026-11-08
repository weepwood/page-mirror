// Google homepage 1:1 static mirror + reverse proxy
// Local assets under /_m/ are served from disk; everything else is proxied to https://www.google.com
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const ASSETS = path.join(ROOT, '_m');
const UPSTREAM = 'www.google.com';

const MIME = {
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.html': 'text/html; charset=utf-8',
};

// simple in-memory cookie jar shared across requests (single-user mirror)
let cookieJar = [];
function parseSetCookie(setCookies) {
  if (!setCookies) return;
  const arr = Array.isArray(setCookies) ? setCookies : [setCookies];
  for (const sc of arr) {
    const first = sc.split(';')[0];
    const idx = first.indexOf('=');
    if (idx < 0) continue;
    const name = first.slice(0, idx).trim();
    const val = first.slice(idx + 1).trim();
    cookieJar = cookieJar.filter(c => c.split('=')[0] !== name);
    cookieJar.push(name + '=' + val);
  }
}
function cookieHeader() { return cookieJar.join('; '); }

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function serveLocal(res, filePath, status) {
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, buf) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('Not found'); return; }
    res.writeHead(status || 200, { 'Content-Type': type, 'Cache-Control': 'public, max-age=3600' });
    res.end(buf);
  });
}

function proxy(req, res, targetPath, targetQuery) {
  const headers = {
    'Host': UPSTREAM,
    'User-Agent': UA,
    'Accept': req.headers['accept'] || '*/*',
    'Accept-Language': req.headers['accept-language'] || 'en-US,en;q=0.9',
    'Referer': 'https://www.google.com/',
  };
  const cookie = cookieHeader();
  if (cookie) headers['Cookie'] = cookie;
  if (req.headers['accept-encoding']) headers['Accept-Encoding'] = req.headers['accept-encoding'];

  const options = {
    hostname: UPSTREAM,
    path: targetPath + (targetQuery || ''),
    method: req.method,
    headers,
  };
  const p = https.request(options, (up) => {
    parseSetCookie(up.headers['set-cookie']);
    const outHeaders = {};
    for (const k of Object.keys(up.headers)) {
      const lk = k.toLowerCase();
      // strip headers that would break the mirror / enforce cross-origin restrictions
      if (['content-security-policy', 'content-security-policy-report-only', 'x-frame-options',
           'cross-origin-opener-policy', 'cross-origin-resource-policy', 'content-security-policy-report-only',
           'strict-transport-security', 'expect-ct', 'report-to', 'timing-allow-origin'].includes(lk)) continue;
      outHeaders[k] = up.headers[k];
    }
    // ensure JS modules served with correct type
    const ct = (up.headers['content-type'] || '').toLowerCase();
    if (ct.includes('javascript') || targetPath.endsWith('.js')) outHeaders['Content-Type'] = 'text/javascript; charset=utf-8';
    res.writeHead(up.statusCode, outHeaders);
    up.pipe(res);
  });
  p.on('error', (e) => {
    res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Proxy error: ' + e.message);
  });
  req.pipe(p);
}

const server = http.createServer((req, res) => {
  const parsed = new URL(req.url, 'http://localhost');
  const p = decodeURIComponent(parsed.pathname);
  const q = parsed.search;

  if (p === '/' || p === '/index.html') {
    return serveLocal(res, path.join(ROOT, 'index.html'));
  }
  if (p.startsWith('/_m/')) {
    const fp = path.join(ASSETS, p.slice('/_m/'.length));
    // prevent path traversal
    if (fp.startsWith(ASSETS)) return serveLocal(res, fp);
    res.writeHead(403); return res.end('Forbidden');
  }
  // everything else -> proxy to google
  return proxy(req, res, p, q);
});

// pick a free port
const net = require('net');
function findPort(start, cb) {
  const srv = net.createServer();
  srv.once('error', () => findPort(start + 1, cb));
  srv.once('listening', () => { srv.close(() => cb(start)); });
  srv.listen(start, '127.0.0.1');
}
findPort(8080, (port) => {
  server.listen(port, '127.0.0.1', () => {
    console.log('MIRROR_SERVER_PORT=' + port);
    console.log('Google mirror running at http://127.0.0.1:' + port + '/');
  });
});
