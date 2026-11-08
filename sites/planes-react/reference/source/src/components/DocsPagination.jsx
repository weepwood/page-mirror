import { Link } from 'react-router-dom';
import navGroups from '../../public/nav.json';

const guidePaths = navGroups.find((group) => group.href === '/components')?.items || [];

export function getGuideNeighbors(pathname) {
  const index = guidePaths.findIndex((item) => item.href === pathname);
  if (index < 0) return { previous: null, next: null };
  return {
    previous: index > 0 ? guidePaths[index - 1] : null,
    next: index < guidePaths.length - 1 ? guidePaths[index + 1] : null,
  };
}

const ARROW_CLS = 'size-3.5';
function Arrow({ forward }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={ARROW_CLS} aria-hidden="true">
      {forward ? <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></> : <><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></>}
    </svg>
  );
}

export function DocsPaginationButtons({ pathname }) {
  const { previous, next } = getGuideNeighbors(pathname);
  return (
    <span className="inline-flex items-center gap-1 rounded-xl bg-secondary p-1.5">
      {[{ page: previous, forward: false }, { page: next, forward: true }].map(({ page, forward }) =>
        page ? (
          <Link key={forward ? 'next' : 'previous'} to={page.href} aria-label={`${forward ? 'Next' : 'Previous'} page: ${page.label}`}
            className="inline-flex size-8 items-center justify-center rounded-md bg-surface-overlay text-foreground/60 shadow-sm transition-[color,transform] duration-150 hover:text-foreground active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Arrow forward={forward} />
          </Link>
        ) : <span key={forward ? 'next' : 'previous'} aria-hidden="true" className="inline-flex size-8 items-center justify-center rounded-md text-foreground/25"><Arrow forward={forward} /></span>
      )}
    </span>
  );
}

export default function DocsPagination({ pathname }) {
  const { previous, next } = getGuideNeighbors(pathname);
  return (
    <nav aria-label="Docs pagination" className="flex items-center justify-between">
      {previous
        ? <Link to={previous.href} className="group inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground">
            <Arrow forward={false} />{previous.label}
          </Link>
        : <span />}
      {next
        ? <Link to={next.href} className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground transition-colors hover:text-foreground/80">
            {next.label}<Arrow forward />
          </Link>
        : <span />}
    </nav>
  );
}
