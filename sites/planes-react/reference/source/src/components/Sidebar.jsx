import { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import navGroups from '../../public/nav.json';
import { thumbMap } from '../lib/data.js';

const ITEM_BASE = 'group relative flex items-center gap-2 pr-4 text-[13px] transition-colors h-[30px]';
const STEM = 'absolute left-0 top-[15px] h-px transition-[width,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]';
const LABEL = 'flex min-w-0 items-center gap-1.5 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]';
const NAV_MASK = 'linear-gradient(to bottom, transparent, black 70px, black calc(100% - 0px), transparent)';
const thumbPaths = thumbMap(navGroups);

function SidebarLink({ item, heading, onNavigate, onPreview, onLeave }) {
  return (
    <NavLink
      to={item.href}
      end
      onClick={onNavigate}
      onMouseEnter={(event) => onPreview(event.currentTarget, item.href)}
      onMouseLeave={onLeave}
      className={({ isActive }) =>
        `${ITEM_BASE} ${isActive
          ? 'text-indigo-600 dark:text-indigo-400'
          : heading ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`
      }
    >
      {({ isActive }) => (
        <>
          <span aria-hidden="true" className="relative ml-3 h-full w-8 shrink-0">
            <span className={`${STEM} ${isActive
              ? 'w-10 bg-indigo-600 dark:bg-indigo-400'
              : heading ? 'w-6 bg-foreground' : 'w-0 bg-transparent group-hover:w-8 group-hover:bg-foreground/50'}`} />
          </span>
          <span className={`${LABEL} ${isActive ? 'translate-x-3' : ''}`} style={{ marginLeft: 0 }}>
            <span className="truncate">{item.label}</span>
            {item.isNew && <span className="shrink-0 text-[9px] leading-none text-muted-foreground">New</span>}
          </span>
        </>
      )}
    </NavLink>
  );
}

/** Navigation is rendered once and survives page-route updates. */
export default function Sidebar({ open, mobile, onNavigate }) {
  const [preview, setPreview] = useState(null);
  const asideRef = useRef(null);
  useEffect(() => {
    // React 18 does not serialize the boolean inert HTML attribute reliably.
    // Use the native DOM property to prevent tabbing into an off-canvas nav.
    if (asideRef.current) asideRef.current.inert = !open;
    if (!open) setPreview(null);
  }, [open]);
  const allLinks = useMemo(() => navGroups.map((group) => [group, ...group.items]), []);

  const onPreview = (anchor, href) => {
    if (mobile || !open) return;
    const src = thumbPaths.get(href);
    if (!src) { setPreview(null); return; }
    const rect = anchor.getBoundingClientRect();
    const height = 168;
    const top = Math.min(
      Math.max(Math.round(rect.y + rect.height / 2), 36 + height / 2 + 8),
      window.innerHeight - height / 2 - 8
    );
    setPreview({ src, top });
  };
  const closePreview = () => setPreview(null);
  const navigate = () => { closePreview(); onNavigate(); };

  return (
    <>
      <aside
        ref={asideRef}
        id="docs-sidebar"
        className="fixed bottom-0 left-0 top-[var(--banner-h)] z-30 block p-4 pr-0 md:block"
        style={{ width: 300, transform: open ? 'translateX(0)' : 'translateX(-300px)' }}
        aria-hidden={!open}
        onMouseLeave={closePreview}
      >
        <div className="h-full overflow-hidden rounded-[24px] bg-background shadow-[0_2px_24px_-12px_rgba(0,0,0,0.25)]">
          <div className="relative flex h-full min-h-0 flex-1 flex-col">
            <div className="relative min-h-0 flex-1">
              <nav aria-label="Component documentation" className="h-full overflow-y-auto custom-scrollbar pb-24" style={{ maskImage: NAV_MASK }}>
                <div className="h-24" aria-hidden="true" />
                <div className="bg-[repeating-linear-gradient(to_bottom,var(--border)_0_1px,transparent_1px_10px)] bg-[length:24px_30px] bg-[position:12px_15px] bg-repeat-y bg-local">
                  {allLinks.map(([group, ...items], index) => (
                    <div key={group.href}>
                      {index > 0 && <div className="h-[30px]" aria-hidden="true" />}
                      <SidebarLink item={group} heading onNavigate={navigate} onPreview={onPreview} onLeave={closePreview} />
                      {items.map((item) =>
                        <SidebarLink key={item.href} item={item} onNavigate={navigate} onPreview={onPreview} onLeave={closePreview} />
                      )}
                    </div>
                  ))}
                </div>
              </nav>
            </div>
          </div>
        </div>
      </aside>
      {preview && open && !mobile && (
        <div className="pointer-events-none fixed z-40 hidden w-[280px] -translate-y-1/2 md:block" style={{ left: 298, top: preview.top }}>
          <div className="overflow-hidden rounded-2xl border border-border/60 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.55)]">
            <img src={preview.src} alt="" className="block w-full" />
          </div>
        </div>
      )}
    </>
  );
}
