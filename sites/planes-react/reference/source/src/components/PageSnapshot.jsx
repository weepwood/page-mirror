import CategoryPage, { getCategoryData } from './CategoryPage.jsx';
import GuidePage, { GUIDE_PATHS } from './GuidePage.jsx';

const MAIN = 'min-w-0 mx-auto max-w-5xl px-5 py-24 sm:px-8 md:px-10 lg:px-14 xl:px-16';

export default function PageSnapshot({ pathname, page, error, onRetry, snapshotRef }) {
  const category = getCategoryData(pathname);
  if (category) return <CategoryPage data={category} />;

  if (error) {
    return (
      <main className={MAIN}>
        <section role="alert" className="mx-auto max-w-xl space-y-4">
          <p className="text-sm font-medium text-indigo-500">Local documentation</p>
          <h1 className="text-2xl font-semibold">This page could not be loaded</h1>
          <p className="text-muted-foreground">The local page data may be unavailable. Try again without leaving this site.</p>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={onRetry} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
              Try again
            </button>
            <a href="https://useplanes.com/components/introduction" target="_blank" rel="noopener noreferrer"
              className="text-sm underline underline-offset-4">Original documentation</a>
          </div>
        </section>
      </main>
    );
  }

  if (!page) {
    return <main className={MAIN} aria-busy="true"><p role="status" className="text-muted-foreground">Loading page…</p></main>;
  }

  if (GUIDE_PATHS.has(pathname)) return <GuidePage page={page} pathname={pathname} snapshotRef={snapshotRef} />;

  // Component detail and remaining category snapshots will migrate in later PRs.
  return <div ref={snapshotRef} style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: page.html }} />;
}
