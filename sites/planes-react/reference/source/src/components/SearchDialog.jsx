import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadNav, NAVIGATE_ITEMS } from '../lib/data.js';
import { buildSearchResults, moveSelection } from '../lib/search.js';

function SearchOption({ item, id, selected, onSelect, onGo }) {
  return (
    <a
      id={id}
      href={item.href}
      role="option"
      aria-selected={selected}
      onMouseEnter={onSelect}
      onClick={(event) => { event.preventDefault(); onGo(item.href); }}
      className={`mx-1 block rounded-lg px-3 py-2.5 text-[13px] outline-none transition-colors
        ${selected ? 'bg-zinc-100 text-zinc-950 dark:bg-zinc-800 dark:text-zinc-50' : 'text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800'}
        focus-visible:ring-2 focus-visible:ring-indigo-500`}
    >
      <span className="block truncate">{item.label}</span>
    </a>
  );
}

export default function SearchDialog({ open, onClose }) {
  const navigate = useNavigate();
  const [nav, setNav] = useState([]);
  const [navError, setNavError] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const id = useId().replace(/:/g, '');
  const listId = `commands-${id}`;

  useEffect(() => {
    let active = true;
    loadNav().then((data) => { if (active) setNav(data); })
      .catch(() => { if (active) setNavError(true); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const previouslyFocused = document.activeElement;
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      cancelAnimationFrame(frame);
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
  }, [open]);

  const results = useMemo(
    () => buildSearchResults(nav, NAVIGATE_ITEMS, query),
    [nav, query]
  );
  const safeIndex = Math.min(selectedIndex, Math.max(results.length - 1, 0));
  const activeId = results.length ? `${listId}-option-${safeIndex}` : undefined;

  useEffect(() => {
    if (!open || !activeId) return;
    const selected = document.getElementById(activeId);
    if (selected && listRef.current?.contains(selected)) {
      selected.scrollIntoView({ block: 'nearest' });
    }
  }, [open, activeId]);

  const go = (href) => {
    onClose();
    if (/^(https?:|mailto:)/i.test(href)) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else if (href.startsWith('/#')) {
      window.open('https://useplanes.com' + href, '_blank', 'noopener,noreferrer');
    } else {
      navigate(href === '/' ? '/components/introduction' : href);
    }
  };

  const onKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
    } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      setSelectedIndex((index) => moveSelection(index, results.length, event.key));
    } else if (event.key === 'Enter' && results.length) {
      event.preventDefault();
      go(results[safeIndex].href);
    } else if (event.key === 'Tab') {
      // Input and result links are deliberately inside one modal; keep keyboard
      // users from reaching the document behind the overlay.
      const focusable = Array.from(event.currentTarget.querySelectorAll('input, a[href], button:not([disabled])'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  if (!open) return null;

  let lastGroup = '';
  return (
    <div
      role="presentation"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
      className="pointer-events-auto fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto overscroll-contain bg-black/30 p-4 pt-[12dvh] backdrop-blur-sm dark:bg-black/60 sm:items-center sm:pt-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search pages and components"
        onKeyDown={onKeyDown}
        className="w-full max-w-lg rounded-3xl border border-zinc-200 bg-zinc-100 p-2 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
      >
        <div className="flex items-center gap-3 px-3 py-2">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true" className="shrink-0 text-zinc-500">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.34-4.34" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-label="Search pages and components"
            aria-autocomplete="list"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={activeId}
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="go"
            placeholder="Search pages, components..."
            value={query}
            onChange={(event) => { setQuery(event.target.value); setSelectedIndex(0); }}
            className="w-full min-w-0 bg-transparent text-base text-zinc-950 outline-none placeholder:text-zinc-500 dark:text-zinc-50"
          />
          <kbd className="rounded border border-zinc-300 px-1.5 py-0.5 text-[11px] text-zinc-500 dark:border-zinc-700">Esc</kbd>
        </div>
        <div className="mt-1 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div id={listId} ref={listRef} role="listbox" aria-label="Search results" className="max-h-[45dvh] overflow-y-auto overscroll-contain p-1">
            {results.map((item, index) => {
              const showHeading = item.group !== lastGroup;
              lastGroup = item.group;
              return (
                <div key={item.href}>
                  {showHeading && <div className="px-3 pb-1 pt-3 text-xs font-medium text-zinc-500 dark:text-zinc-400">{item.group}</div>}
                  <SearchOption
                    item={item}
                    id={`${listId}-option-${index}`}
                    selected={index === safeIndex}
                    onSelect={() => setSelectedIndex(index)}
                    onGo={go}
                  />
                </div>
              );
            })}
            {!results.length && <p role="status" className="px-3 py-7 text-center text-sm text-zinc-500">No matching pages.</p>}
            {navError && <p role="status" className="px-3 py-2 text-xs text-amber-600">Component index unavailable. Quick links are still available.</p>}
          </div>
          <div className="flex justify-between border-t border-zinc-200 px-4 py-2 text-[11px] text-zinc-500 dark:border-zinc-800">
            <span>{results.length} results</span>
            <span>↑ ↓ Navigate · ↵ Open</span>
          </div>
        </div>
      </div>
    </div>
  );
}
