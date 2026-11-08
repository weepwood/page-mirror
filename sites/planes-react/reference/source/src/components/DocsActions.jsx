import { useEffect, useRef, useState } from 'react';
import { AI_BASES, buildPrompt } from '../lib/data.js';

const arrow = 'size-3.5';

async function writeClipboard(text) {
  if (!text) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const input = document.createElement('textarea');
    input.value = text;
    input.style.position = 'fixed';
    input.style.left = '-9999px';
    document.body.appendChild(input);
    input.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch { /* clipboard denied */ }
    input.remove();
    return copied;
  }
}

/** Fully React-owned Copy Page and AI popover. No document.createElement menus. */
export default function DocsActions({ articleRef, pathname, title }) {
  const [copyStatus, setCopyStatus] = useState('idle');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const timerRef = useRef(null);
  const prompt = buildPrompt(pathname, title);

  useEffect(() => {
    setMenuOpen(false);
    setCopyStatus('idle');
    clearTimeout(timerRef.current);
    return () => clearTimeout(timerRef.current);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const close = (event) => {
      if (!menuRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const key = (event) => { if (event.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', key);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', key);
    };
  }, [menuOpen]);

  const copy = async () => {
    const text = articleRef.current?.innerText?.trim() || '';
    const success = await writeClipboard(text);
    setCopyStatus(success ? 'copied' : 'failed');
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopyStatus('idle'), 1800);
  };

  return (
    <div className="inline-flex items-center gap-1 rounded-xl bg-secondary p-1.5">
      <div ref={menuRef} className="relative inline-flex h-8 items-center rounded-md bg-surface-overlay shadow-sm">
        <button type="button" onClick={copy} aria-label="Copy Page"
          className="inline-flex h-8 items-center gap-1.5 rounded-l-md pl-2.5 pr-2 text-[13px] font-medium whitespace-nowrap text-foreground transition-[color,transform] duration-150 hover:text-foreground/80 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:pl-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className={arrow} aria-hidden="true">
            {copyStatus === 'copied'
              ? <path d="M5 12.5l4.5 4.5L19 7.5" strokeWidth="2.5" className="text-emerald-500" />
              : <><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /><rect x="8" y="8" width="14" height="14" rx="2" /></>}
          </svg>
          <span aria-hidden="true" className="hidden sm:inline">{copyStatus === 'copied' ? 'Copied' : copyStatus === 'failed' ? 'Copy failed' : 'Copy Page'}</span>
        </button>
        <span aria-live="polite" className="sr-only">
          {copyStatus === 'copied' ? 'Page copied to clipboard' : copyStatus === 'failed' ? 'Unable to copy page' : ''}
        </span>
        <span aria-hidden="true" className="h-4 w-px bg-border/70" />
        <button type="button" onClick={() => setMenuOpen((open) => !open)}
          aria-label="Open in an AI assistant" aria-haspopup="menu" aria-expanded={menuOpen}
          className="inline-flex h-8 items-center rounded-r-md px-1.5 text-foreground/60 transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`size-3.5 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        {menuOpen && (
          <div role="menu" className="absolute left-0 top-full z-30 mt-2 w-44 origin-top-left rounded-lg border border-border/60 bg-surface-overlay p-1 shadow-lg sm:right-0 sm:left-auto sm:origin-top-right">
            {AI_BASES.map((assistant) => (
              <a key={assistant.label} role="menuitem" target="_blank" rel="noopener noreferrer"
                href={assistant.url + encodeURIComponent(prompt)} onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-[13px] text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground">
                {assistant.label}
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
