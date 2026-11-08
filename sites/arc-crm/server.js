const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const ROOT = __dirname;
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 0;

const MIME = {
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.jsx': 'text/javascript; charset=utf-8',
  '.ts': 'text/javascript; charset=utf-8',
  '.tsx': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
};

function sendFile(res, filePath, status) {
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || 'application/octet-stream';
  const data = fs.readFileSync(filePath);
  res.writeHead(status || 200, {
    'Content-Type': type,
    'Content-Length': data.length,
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(data);
}

function notFound(res, msg) {
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(msg || '404 Not Found');
}

function resolveStatic(reqPath) {
  // strip query
  let p = reqPath.split('?')[0];
  if (p.endsWith('/')) p += 'index.html';
  // prevent traversal
  const safe = path.normalize(p).replace(/^(\.\.[\/\\])+/, '');
  let full = path.join(ROOT, safe);
  if (!full.startsWith(ROOT)) return null;
  if (fs.existsSync(full) && fs.statSync(full).isDirectory()) {
    const idx = path.join(full, 'index.html');
    if (fs.existsSync(idx)) return idx;
  }
  if (fs.existsSync(full) && fs.statSync(full).isFile()) return full;
  // try .html append (Next.js style route without extension)
  if (!path.extname(full)) {
    const htmlTry = full + '.html';
    if (fs.existsSync(htmlTry)) return htmlTry;
  }
  return null;
}

const server = http.createServer((req, res) => {
  try {
    const parsed = url.parse(req.url, true);
    const reqPath = decodeURIComponent(parsed.pathname);

    // /_next/image proxy -> local /media file
    if (reqPath === '/_next/image') {
      const target = parsed.query.url;
      if (!target) return notFound(res, 'missing url');
      const decoded = decodeURIComponent(target);
      const local = path.join(ROOT, decoded);
      if (fs.existsSync(local) && fs.statSync(local).isFile()) {
        return sendFile(res, local);
      }
      return notFound(res, 'image not found: ' + decoded);
    }

    // Special routes
    if (reqPath === '/' || reqPath === '/templates/arc-crm/live' || reqPath === '/templates/arc-crm/live/') {
      return sendFile(res, path.join(ROOT, 'index.html'));
    }
    if (reqPath === '/templates/arc-crm/preview' || reqPath === '/templates/arc-crm/preview/') {
      return sendFile(res, path.join(ROOT, 'templates', 'arc-crm', 'preview', 'index.html'));
    }
    if (reqPath === '/templates/arc-crm' || reqPath.startsWith('/templates/arc-crm?')) {
      return sendFile(res, path.join(ROOT, 'index.html'));
    }

  const file = resolveStatic(reqPath);
  if (file) return sendFile(res, file);

  // fallback: try the raw (undecoded) path for any still-encoded refs
  const rawFile = resolveStatic(parsed.pathname);
  if (rawFile) return sendFile(res, rawFile);

  return notFound(res, '404: ' + reqPath);
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('500 ' + e.message);
  }
});

// Find a free port if PORT=0
if (PORT === 0) {
  const probe = http.createServer();
  probe.listen(0, '127.0.0.1', () => {
    const port = probe.address().port;
    probe.close(() => {
      server.listen(port, '127.0.0.1', () => {
        console.log('SERVER_READY ' + port);
      });
    });
  });
} else {
  server.listen(PORT, '127.0.0.1', () => {
    console.log('SERVER_READY ' + PORT);
  });
}
