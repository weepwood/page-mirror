const SHADOW = 'ring-1 ring-foreground/10 shadow-[0_1px_2px_rgba(0,0,0,0.08),0_3px_8px_-3px_rgba(0,0,0,0.14)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_1px_2px_rgba(0,0,0,0.18),0_3px_8px_-3px_rgba(0,0,0,0.35)]';
const DOCK_BTN = 'inline-flex size-8 items-center justify-center rounded-md bg-surface-overlay text-foreground transition-[color,transform] duration-150 hover:text-foreground/80 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export function SidebarGlyph({ narrow = false }) {
  return (
    <span className="relative grid items-center justify-center">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path fillRule="evenodd" clipRule="evenodd"
          d="M0.32698 2.63803C0 3.27976 0 4.11984 0 5.8V10.2C0 11.8802 0 12.7202 0.32698 13.362C0.614601 13.9265 1.07354 14.3854 1.63803 14.673C2.27976 15 3.11984 15 4.8 15H11.2C12.8802 15 13.7202 15 14.362 14.673C14.9265 14.3854 15.3854 13.9265 15.673 13.362C16 12.7202 16 11.8802 16 10.2V5.8C16 4.11984 16 3.27976 15.673 2.63803C15.3854 2.07354 14.9265 1.6146 14.362 1.32698C13.7202 1 12.8802 1 11.2 1H4.8C3.11984 1 2.27976 1 1.63803 1.32698C1.07354 1.6146 0.614601 2.07354 0.32698 2.63803Z" fill="currentColor" />
      </svg>
      <span aria-hidden="true" className="absolute left-[3px] h-[10px] rounded-[1px] bg-background" style={{ width: narrow ? 1.5 : 4.5 }} />
    </span>
  );
}

export default function WorkspaceDock({ sidebarOpen, onToggleSidebar, onSearch, dark, onToggleTheme }) {
  const shortcut = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘ K' : 'Ctrl K';
  return (
    <div id="workspace-dock" className="pointer-events-none fixed inset-x-0 bottom-5 z-[70] flex flex-wrap items-center justify-center gap-2 px-4 [&:has([data-dock-preview])_[data-dock-theme]]:hidden">
      <div className="pointer-events-auto inline-flex items-center gap-1 rounded-xl bg-secondary/90 p-1.5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.35)] backdrop-blur-md">
        <button type="button" aria-label={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'} aria-controls="docs-sidebar"
          aria-expanded={sidebarOpen} onClick={onToggleSidebar} className={`${DOCK_BTN} ${SHADOW} hidden md:inline-flex`}>
          <SidebarGlyph />
        </button>
        <a href="#/components/introduction" aria-label="Documentation home" className={`${DOCK_BTN} ${SHADOW}`}>
          <span aria-hidden="true" className="block size-4 shrink-0 bg-current"
            style={{ maskImage: 'url(/icon.svg)', WebkitMaskImage: 'url(/icon.svg)', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center', maskSize: 'contain', WebkitMaskSize: 'contain' }} />
        </a>
        <button type="button" aria-label="Search (Ctrl K)" onClick={onSearch}
          className={`inline-flex h-8 items-center gap-1.5 rounded-md bg-surface-overlay px-2.5 text-foreground transition-[color,transform] duration-150 hover:text-foreground/80 active:scale-[0.97] ${SHADOW}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
            <path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" />
          </svg>
          <kbd className="hidden items-center gap-0.5 rounded border border-border px-1 py-0.5 font-mono text-[10px] leading-none text-foreground sm:inline-flex">{shortcut}</kbd>
        </button>
      </div>
      <div data-dock-theme="true" className="pointer-events-auto order-last inline-flex items-center rounded-xl bg-secondary/90 p-1.5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.35)] backdrop-blur-md">
        <button type="button" onClick={onToggleTheme} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
          className={`relative inline-flex h-8 w-8 items-center justify-center rounded-md bg-surface-overlay text-muted-foreground ${SHADOW}`}>
          {dark ? (
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z" />
            </svg>
          )}
          <span className="sr-only">Toggle theme</span>
        </button>
      </div>
    </div>
  );
}

const blurWidths = [0.5, 1, 2, 3, 5, 8, 12, 16];
/** Multi-stop backdrop blur from the static shell, expressed as React layers. */
export function BottomPageBlur() {
  return (
    <div className="bottom-page-blur pointer-events-none fixed inset-x-0 bottom-0 z-[60] hidden h-[80px] sm:block" aria-hidden="true">
      <div className="relative h-full">
        <div className="gradient-blur pointer-events-none absolute inset-x-0 z-10 !inset-0 !bottom-0 bottom-0" style={{ height: '100%' }}>
          {blurWidths.map((radius, i) => {
            const start = i * 12.5;
            const mask = i === 7
              ? `linear-gradient(to bottom, transparent ${start}%, black 100%)`
              : `linear-gradient(to bottom, transparent ${start}%, black ${start + 12.5}%, black ${start + 25}%, transparent ${start + 37.5}%)`;
            return <div key={radius} className="absolute inset-0"
              style={{ zIndex: i + 1, backdropFilter: `blur(${radius}px)`, WebkitBackdropFilter: `blur(${radius}px)`, maskImage: mask, WebkitMaskImage: mask }} />;
          })}
        </div>
      </div>
    </div>
  );
}
