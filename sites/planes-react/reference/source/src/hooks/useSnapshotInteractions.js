import { useEffect } from 'react';

/**
 * The remaining compatibility bridge is intentionally scoped to the static
 * article body. Copy Page, AI dropdown, pagination and category cards are
 * React-owned; only legacy links and code-snippet copy need event delegation.
 */
export default function useSnapshotInteractions(snapshotRef, page, pathname, navigate) {
  useEffect(() => {
    const root = snapshotRef.current;
    if (!page || !root) return undefined;
    let timer;

    const onClick = async (event) => {
      const link = event.target.closest('a[href]');
      if (link && root.contains(link)) {
        const href = link.getAttribute('href') || '';
        if (href.startsWith('/#')) {
          event.preventDefault();
          window.open('https://useplanes.com' + href, '_blank', 'noopener,noreferrer');
        } else if (href.startsWith('#')) {
          const targetId = decodeURIComponent(href.slice(1));
          const target = document.getElementById(targetId);
          if (target) {
            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } else if (href === '/' || /^\/(components|setup)(\/|$)/.test(href)) {
          event.preventDefault();
          navigate(href === '/' ? '/components/introduction' : href);
        }
        return;
      }

      const button = event.target.closest('button[aria-label="Copy"]');
      if (!button || !root.contains(button)) return;
      // Only copy from the code block containing this particular button.
      const block = button.closest('div')?.parentElement;
      const text = block?.querySelector('pre code')?.textContent ||
        button.closest('section')?.querySelector('pre code')?.textContent;
      if (!text) return;

      let copied = false;
      try {
        await navigator.clipboard.writeText(text);
        copied = true;
      } catch {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { copied = document.execCommand('copy'); } catch { /* clipboard disabled */ }
        ta.remove();
      }
      button.setAttribute('aria-label', copied ? 'Copied' : 'Copy failed');
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (button.isConnected) button.setAttribute('aria-label', 'Copy');
      }, 1800);
    };

    root.addEventListener('click', onClick);
    return () => {
      root.removeEventListener('click', onClick);
      clearTimeout(timer);
    };
  }, [snapshotRef, page, pathname, navigate]);
}
