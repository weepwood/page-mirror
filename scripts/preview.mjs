import http from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { root } from './mirror-config.mjs';
import { resolveHomepage } from './sitemap.mjs';

export const DEFAULT_PORT = 4173;

export const MIME = {
  '.html': 'text/html; charset=utf-8', '.htm': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.cjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.map': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp',
  '.avif': 'image/avif', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
  '.otf': 'font/otf', '.eot': 'application/vnd.ms-fontobject',
  '.mp3': 'audio/mpeg', '.mp4': 'video/mp4', '.webm': 'video/webm',
  '.ogg': 'audio/ogg', '.wasm': 'application/wasm',
  '.pdf': 'application/pdf', '.glb': 'model/gltf-binary',
  '.webmanifest': 'application/manifest+json',
};

function inside(parent, child) {
  return child === parent || child.startsWith(parent + sep);
}

/**
 * Serve `.site-build/` exactly the way GitHub Pages serves a project site:
 * everything lives under the homepage subpath, and any missing path falls back
 * to the custom 404.html (with a real 404 status). No third-party dependency.
 */
export function createPreviewServer(buildRoot, options = {}) {
  const base = options.base ?? new URL(resolveHomepage(root)).pathname;
  const notFound = options.notFound ?? join(buildRoot, '404.html');
  return http.createServer((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8', 'Allow': 'GET, HEAD' });
      res.end('Method Not Allowed');
      return;
    }
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
    } catch {
      res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Bad Request');
      return;
    }
    if (!pathname.startsWith(base)) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
      return;
    }
    let rel = pathname.slice(base.length).replace(/^\/+/, '');
    if (!rel || rel.endsWith('/')) rel += 'index.html';
    const target = resolve(buildRoot, rel);
    if (!inside(buildRoot, target)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Forbidden');
      return;
    }
    let file = target;
    let status = 200;
    if (!existsSync(file) || !statSync(file).isFile()) {
      file = notFound;
      status = 404;
    }
    if (!existsSync(file) || !statSync(file).isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
      return;
    }
    const stat = statSync(file);
    res.writeHead(status, {
      'Content-Type': MIME[extname(file).toLowerCase()] || 'application/octet-stream',
      'Content-Length': stat.size,
      'Cache-Control': 'no-store',
    });
    if (req.method === 'HEAD') { res.end(); return; }
    createReadStream(file).pipe(res);
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const buildRoot = resolve(root, '.site-build');
  if (!existsSync(join(buildRoot, 'index.html'))) {
    console.error('未找到构建产物，请先运行 npm run build');
    process.exitCode = 1;
  } else {
    const portArg = process.argv.find(arg => arg.startsWith('--port='));
    const port = portArg ? Number(portArg.slice('--port='.length)) : DEFAULT_PORT;
    if (!Number.isInteger(port) || port < 0 || port > 65535) {
      console.error('--port 需要 0-65535 之间的整数');
      process.exitCode = 1;
    } else {
      const base = new URL(resolveHomepage(root)).pathname;
      const server = createPreviewServer(buildRoot, { base });
      server.on('error', error => {
        console.error('预览服务启动失败：' + error.message);
        process.exitCode = 1;
      });
      server.listen(port, '127.0.0.1', () => {
        const actual = server.address().port;
        console.log(`Page Mirror 预览：http://127.0.0.1:${actual}${base}`);
        console.log(`  根目录 ${buildRoot} · 缺失路径回退 404.html · Ctrl+C 停止`);
      });
      for (const signal of ['SIGINT', 'SIGTERM']) {
        process.on(signal, () => server.close(() => process.exit(0)));
      }
    }
  }
}
