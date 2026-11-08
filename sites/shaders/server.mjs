import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';

const ROOT = process.cwd();
const ORIGIN = 'https://shaders.com';
const PORT = process.env.PORT ? Number(process.env.PORT) : 0;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.webm': 'video/webm',
};

function findFreePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.once('error', reject);
    srv.listen(0, '127.0.0.1', () => {
      const p = srv.address().port;
      srv.close(() => resolve(p));
    });
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const rawUrl = req.url || '/';
    const urlPath = decodeURIComponent(rawUrl.split('?')[0]);
    const filePath = path.join(ROOT, path.normalize(urlPath));

    // Serve local file if it exists (static-first)
    if (filePath.startsWith(ROOT) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': MIME[ext] || 'application/octet-stream',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      });
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    // Otherwise proxy to the live origin (handles API, route payloads,
    // app manifest, undownloaded images, etc.) for a true 1:1 mirror.
    const target = ORIGIN + rawUrl;
    try {
      const upstream = await fetch(target, {
        method: req.method,
        headers: { 'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0', 'Accept': req.headers['accept'] || '*/*' },
        redirect: 'follow',
      });
      const ct = upstream.headers.get('content-type') || 'application/octet-stream';
      res.writeHead(upstream.status, {
        'Content-Type': ct,
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      });
      if (upstream.body) {
        const buf = Buffer.from(await upstream.arrayBuffer());
        res.end(buf);
      } else {
        res.end();
      }
    } catch (e) {
      res.writeHead(502, { 'Content-Type': 'text/plain' });
      res.end('502 Bad Gateway proxying ' + target + ' : ' + e.message);
    }
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Server error');
  }
});

const port = await findFreePort();
server.listen(port, '127.0.0.1', () => {
  console.log('SHADERS_MIRROR_PORT=' + port);
});
