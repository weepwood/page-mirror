/* Shared data helpers for the static documentation snapshots. */
let navPromise = null;
const asset = (path) => (import.meta.env?.BASE_URL || '/') + path;

export function slugFile(pathname) {
  const parts = String(pathname).split('/').filter(Boolean);
  if (!parts.length || parts.some((part) => !/^[a-z0-9-]+$/i.test(part))) {
    throw new Error('Invalid documentation path');
  }
  return parts.join('__');
}

export function loadNav() {
  if (!navPromise) {
    navPromise = fetch(asset('nav.json'))
      .then((response) => {
        if (!response.ok) throw new Error('Navigation HTTP ' + response.status);
        return response.json();
      })
      .then((groups) => {
        if (!Array.isArray(groups) || !groups.every((group) => Array.isArray(group.items))) {
          throw new Error('Malformed navigation data');
        }
        return groups;
      })
      .catch((error) => {
        navPromise = null; // Allow the user to retry after a transient failure.
        throw error;
      });
  }
  return navPromise;
}

export async function loadPage(pathname) {
  const response = await fetch(asset('pages/' + slugFile(pathname) + '.json'));
  if (!response.ok) throw new Error('Page HTTP ' + response.status);
  const page = await response.json();
  if (!page || typeof page.html !== 'string' || typeof page.title !== 'string') {
    throw new Error('Malformed page data');
  }
  return page;
}

/* href -> /thumbs/<slug>.webp for sidebar links that have a thumbnail */
export function thumbMap(nav) {
  const map = new Map();
  for (const group of nav) {
    const put = (item) => {
      const match = (item.href || '').match(/^\/components\/([a-z0-9-]+)$/);
      if (match && item.thumb) map.set(item.href, asset('thumbs/' + match[1] + '.webp'));
    };
    put(group);
    group.items.forEach(put);
  }
  return map;
}

export const NAVIGATE_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Components', href: '/components' },
  { label: 'Introduction', href: '/components/introduction' },
  { label: 'Installation', href: '/components/installation' },
  { label: 'MCP', href: '/components/mcp' },
  { label: 'Logins', href: '/components/logins' },
  { label: 'Heroes', href: '/components/heroes' },
  { label: 'Footers', href: '/components/footers' },
  { label: 'Pro', href: '/#pricing' },
  { label: 'Activate a license', href: '/setup' },
  { label: 'Contact support', href: 'mailto:support@useplanes.com' },
  { label: 'Follow on X', href: 'https://x.com/ashishgogula' },
];

export const AI_BASES = [
  { label: 'Open in Claude', url: 'https://claude.ai/new?q=' },
  { label: 'Open in ChatGPT', url: 'https://chatgpt.com/?hints=search&q=' },
  { label: 'Open in v0', url: 'https://v0.app/?q=' },
  { label: 'Open in Cursor', url: 'https://cursor.com/link/prompt?text=' },
];

export function buildPrompt(pathname, pageTitle) {
  const name = pageTitle || 'docs';
  return (
    `Read https://useplanes.com${pathname === '/components' ? '/components' : pathname}.md — the ${name} page from the docs for Planes, ` +
    'an animated React component library built with Motion and Tailwind CSS, installed via the shadcn registry. ' +
    'The full docs index is at https://useplanes.com/llms.txt, in case I ask about other pages or components. ' +
    'Help me understand and use what’s on this page: be ready to explain concepts, show usage examples, and help debug my code against it.'
  );
}
