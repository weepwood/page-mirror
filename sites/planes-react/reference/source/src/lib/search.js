/**
 * Pure command-palette helpers. Navigation items remain data-only so they can
 * be tested without a browser or React runtime.
 */
export function normalizeSearch(value = '') {
  return String(value).normalize('NFKC').toLocaleLowerCase().trim();
}

export function buildSearchResults(groups = [], quickLinks = [], term = '') {
  const query = normalizeSearch(term);
  const results = [];
  const seen = new Set();
  const add = (item, group) => {
    if (!item || typeof item.label !== 'string' || typeof item.href !== 'string') return;
    const href = item.href;
    if (seen.has(href)) return;
    if (query && !normalizeSearch(item.label + ' ' + href).includes(query)) return;
    seen.add(href);
    results.push({ label: item.label, href, group });
  };
  for (const item of quickLinks) add(item, 'Navigate');
  for (const group of groups) {
    if (!Array.isArray(group.items)) continue;
    for (const item of group.items) add(item, group.label || 'Components');
  }
  return results;
}

export function moveSelection(current, length, key) {
  if (!length) return 0;
  if (key === 'Home') return 0;
  if (key === 'End') return length - 1;
  if (key === 'ArrowDown') return (current + 1 + length) % length;
  if (key === 'ArrowUp') return (current - 1 + length) % length;
  return Math.max(0, Math.min(current, length - 1));
}
