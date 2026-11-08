import { lstatSync } from 'node:fs';
import { basename, relative, sep } from 'node:path';

// Directories that must never be copied out of a source mirror repository.
export const IMPORT_DENY_DIRS = new Set([
  '.git', '.github', 'node_modules', 'dist', 'out', '.next',
  '.cache', '.turbo', 'coverage', '__pycache__', '.venv',
]);

// Directories that must never be published to GitHub Pages.
export const PUBLISH_DENY_DIRS = new Set([
  '.git', '.github', 'node_modules', 'tests', 'scripts', 'reference',
  'docs', 'coverage', 'dist', 'out', '.next',
]);

const SENSITIVE_EXACT = new Set([
  '.env', '.npmrc', '.pypirc', '.netrc', '_netrc', '.htpasswd',
  'credentials.json', 'serviceAccountKey.json', 'client_secret.json',
  'id_rsa', 'id_ed25519',
]);

const SENSITIVE_PATTERN = /^(?:\.env(?:\.|$)|.*\.(?:pem|key|p12|pfx|ppk)$|client_secret.*\.json$|.*service.account.*\.json$)/i;

/** Credentials and private material that must never leave the source repository. */
export function isSensitiveName(name) {
  return SENSITIVE_EXACT.has(name) || SENSITIVE_PATTERN.test(name);
}

/** Local collection / dev-server helpers, never referenced by the mirrored pages. */
export const LOCAL_TOOL_SCRIPT = /^(?:server|serve|shot\d*|verify|validate|discover|check|crawl|download\w*|localize|fetch\w*|mirror|start|build|capture|probe)\.(?:js|mjs|cjs)$/i;

const INTERNAL_EXACT = new Set([
  'MIRROR-IMPORT.json', 'package.json', 'package-lock.json',
  'tsconfig.json', 'components.json', 'AGENTS.md', 'CLAUDE.md',
  'netlify.toml', 'vercel.json', 'README.md', 'snapshot-status.json',
]);

const PUBLISH_EXT = /\.(?:html?|css|js|mjs|json|xml|svg|png|jpe?g|webp|avif|gif|ico|woff2?|ttf|otf|eot|wasm|mp3|mp4|webm|glb|bin|txt|webmanifest|ogg|dds|srt|pdf)$/i;

/**
 * Decide whether a path inside a site directory may be published.
 * Used by build-site.mjs as a cpSync filter; also unit-tested directly.
 */
export function shouldPublish(sourceRoot, candidate) {
  const rel = relative(sourceRoot, candidate);
  const parts = rel.split(sep);
  if (parts.some(part => PUBLISH_DENY_DIRS.has(part))) return false;
  if (rel !== '' && parts.some(part => part.startsWith('.'))) return false;
  const stat = lstatSync(candidate);
  if (stat.isSymbolicLink()) return false;
  if (stat.isDirectory()) return true;
  const name = basename(candidate);
  if (INTERNAL_EXACT.has(name) || isSensitiveName(name) || LOCAL_TOOL_SCRIPT.test(name)) return false;
  return PUBLISH_EXT.test(name);
}
