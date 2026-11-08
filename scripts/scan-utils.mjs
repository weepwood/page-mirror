import { readdirSync, statSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';

const HTML_EXT = /\.html?$/i;

/** Normalise a filesystem path to forward slashes for reports and URLs. */
export function toPosix(path) {
  return path.split(sep).join('/');
}

export function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 / 1024).toFixed(1) + ' MB';
}

/**
 * Single traversal primitive for every build audit. Symlinks are skipped: a
 * published build must never read outside its own tree. The visitor receives
 * { abs, rel, name, size }, where `rel` is POSIX-style and relative to `dir`.
 */
export function walkFiles(dir, visitor) {
  const base = resolve(dir);
  function visit(current, prefix) {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const abs = join(current, entry.name);
      const rel = prefix ? prefix + '/' + entry.name : entry.name;
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) { visit(abs, rel); continue; }
      if (!entry.isFile()) continue;
      visitor({ abs, rel, name: entry.name, size: statSync(abs).size });
    }
  }
  visit(base, '');
}

/** Visit every HTML file below `dir` using the same traversal rules. */
export function collectHtml(dir, visitor) {
  walkFiles(dir, file => { if (HTML_EXT.test(file.name)) visitor(file); });
}
