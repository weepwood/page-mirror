import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Banner from './Banner.jsx';
import Sidebar from './Sidebar.jsx';
import WorkspaceDock, { BottomPageBlur, SidebarGlyph } from './WorkspaceDock.jsx';
import PageSnapshot from './PageSnapshot.jsx';
import SearchDialog from './SearchDialog.jsx';
import useSnapshotInteractions from '../hooks/useSnapshotInteractions.js';
import { loadPage } from '../lib/data.js';
import { getCategoryData } from './CategoryPage.jsx';

function mobileViewport() {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
}

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const scrollerRef = useRef(null);
  const snapshotRef = useRef(null);
  const [mobile, setMobile] = useState(mobileViewport);
  const [sidebarOpen, setSidebarOpen] = useState(() => !mobileViewport());
  const [searchOpen, setSearchOpen] = useState(false);
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState({ pathname: null, page: null, error: false });

  useEffect(() => {
    const matcher = window.matchMedia('(max-width: 767px)');
    const update = () => {
      setMobile(matcher.matches);
      setSidebarOpen(!matcher.matches);
    };
    matcher.addEventListener('change', update);
    return () => matcher.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    let active = true;
    setResult({ pathname, page: null, error: false });
    if (getCategoryData(pathname)) {
      // React category pages no longer request the legacy page snapshot.
      return () => { active = false; };
    }
    loadPage(pathname)
      .then((page) => { if (active) setResult({ pathname, page, error: false }); })
      .catch(() => { if (active) setResult({ pathname, page: null, error: true }); });
    return () => { active = false; };
  }, [pathname, attempt]);

  const current = result.pathname === pathname;
  const page = current ? result.page : null;
  const error = current && result.error;
  useSnapshotInteractions(snapshotRef, page, pathname, navigate);

  useEffect(() => {
    const category = getCategoryData(pathname);
    document.title = category
      ? `${category.title} — React Mirror`
      : page?.title ? `${page.title} — React Mirror` : 'Planes Docs — React Mirror';
  }, [page, pathname]);

  useEffect(() => {
    if (scrollerRef.current) scrollerRef.current.scrollTop = 0;
    if (mobile) setSidebarOpen(false);
  }, [pathname]); // No need to reset sidebar on a desktop route change.

  useEffect(() => {
    const onKey = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen((value) => !value);
      }
      if (event.key === 'Escape') {
        setSearchOpen(false);
        if (mobile) setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobile]);

  useEffect(() => {
    if (!mobile || !sidebarOpen) return undefined;
    const before = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = before; };
  }, [mobile, sidebarOpen]);

  const toggleTheme = () => {
    const next = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', next);
    setDark(next);
    try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch { /* Restricted storage */ }
  };

  return (
    <>
      <div hidden />
      <Banner />
      <div data-drawer-wrapper="true" className="min-h-dvh bg-background">
        <div data-layout="workspace" className="relative w-full text-foreground">
          <button type="button" aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={sidebarOpen} aria-controls="docs-sidebar" onClick={() => setSidebarOpen((value) => !value)}
            className="fixed left-3 top-[calc(var(--banner-h)+12px)] z-[60] inline-flex size-[42px] items-center justify-center rounded-xl text-foreground/50 transition-colors hover:text-foreground md:hidden">
            <SidebarGlyph narrow />
          </button>
          <button type="button" aria-label={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
            aria-expanded={sidebarOpen} aria-controls="docs-sidebar" onClick={() => setSidebarOpen((value) => !value)}
            className="fixed left-4 top-[calc(var(--banner-h)+35px)] z-40 hidden size-[42px] items-center justify-center rounded-xl bg-background text-foreground/50 transition-colors hover:text-foreground md:inline-flex">
            <SidebarGlyph />
            <span className="sr-only">Toggle Sidebar</span>
          </button>
          {mobile && sidebarOpen && (
            <button type="button" aria-label="Close navigation" onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm md:hidden" />
          )}
          <div className="w-full">
            <Sidebar open={sidebarOpen} mobile={mobile} onNavigate={() => { if (mobile) setSidebarOpen(false); }} />
            <div ref={scrollerRef} className="min-w-0 md:h-dvh md:overflow-y-auto md:scroll-pt-[var(--banner-h)] custom-scrollbar">
              <div className="mt-[var(--banner-h)] flex h-[66px] items-center pl-[62px] md:hidden">
                <p className="text-sm text-muted-foreground">Components</p>
              </div>
              <PageSnapshot key={pathname + ':' + attempt} pathname={pathname} page={page} error={error}
                onRetry={() => setAttempt((value) => value + 1)} snapshotRef={snapshotRef} />
            </div>
          </div>
          <WorkspaceDock sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((value) => !value)}
            onSearch={() => setSearchOpen(true)} dark={dark} onToggleTheme={toggleTheme} />
        </div>
        <BottomPageBlur />
      </div>
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
