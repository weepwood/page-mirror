const http = require("http");
const fs = require("fs");
const path = require("path");
const net = require("net");

const ROOT = __dirname;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".json": "application/json; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".glb": "model/gltf-binary",
  ".dds": "application/octet-stream",
  ".srt": "text/plain",
  ".txt": "text/plain",
};

function findFreePort(cb) {
  const srv = net.createServer();
  srv.listen(0, "127.0.0.1", () => {
    const port = srv.address().port;
    srv.close(() => cb(port));
  });
}

function serve(req, res) {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/") urlPath = "/index.html";
  // Prevent path traversal
  const filePath = path.normalize(path.join(ROOT, urlPath));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // SPA fallback: for client-side routes (no file extension, not an asset),
      // serve index.html so React Router can handle them.
      const hasExt = path.extname(urlPath) !== "";
      const isAsset = urlPath.startsWith("/assets/");
      if (!hasExt && !isAsset && !urlPath.startsWith("/api/")) {
        const indexPath = path.join(ROOT, "index.html");
        fs.readFile(indexPath, (e2, htmlData) => {
          if (e2) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            return res.end("Not found: " + urlPath);
          }
          res.writeHead(200, { "Content-Type": MIME[".html"] });
          return res.end(htmlData);
        });
        return;
      }
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end("Not found: " + urlPath);
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    res.end(data);
  });
}

findFreePort((port) => {
  const server = http.createServer(serve);
  server.listen(port, "127.0.0.1", () => {
    console.log("SERVING_ON_" + port);
  });
});
