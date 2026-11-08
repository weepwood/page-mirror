import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import DocsActions from './DocsActions.jsx';
import DocsPagination, { DocsPaginationButtons } from './DocsPagination.jsx';

export const GUIDE_PATHS = new Set([
  '/components/introduction',
  '/components/installation',
  '/components/mcp',
]);

/**
 * Parse only checked-in guide snapshots. Move the repeated interactive header
 * and pagination to React, preserving nested article content in the original
 * order and retaining the source classes on main/article/body.
 */
export function parseGuideSnapshot(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const main = doc.querySelector('main');
  const article = main?.querySelector(':scope > article');
  const header = article?.querySelector(':scope > header');
  const title = header?.querySelector('h1')?.textContent?.trim();
  if (!main || !article || !header || !title) throw new Error('Unsupported guide snapshot');

  const description = header.querySelector('p')?.textContent?.trim() || '';
  header.remove();
  const pagination = article.querySelector('nav[aria-label="Docs pagination"]');
  if (pagination) {
    const mount = doc.createElement('div');
    mount.setAttribute('data-react-docs-pagination', '');
    pagination.replaceWith(mount);
  }
  return {
    title,
    description,
    mainClass: main.getAttribute('class') || '',
    articleClass: article.getAttribute('class') || '',
    bodyHtml: article.innerHTML,
    pagination: Boolean(pagination),
  };
}

export default function GuidePage({ page, pathname, snapshotRef }) {
  const articleRef = useRef(null);
  const [paginationHost, setPaginationHost] = useState(null);
  const model = useMemo(() => parseGuideSnapshot(page.html), [page.html]);

  useLayoutEffect(() => {
    setPaginationHost(snapshotRef.current?.querySelector('[data-react-docs-pagination]') || null);
    return () => setPaginationHost(null);
  }, [model, snapshotRef]);

  return (
    <main className={model.mainClass}>
      <article ref={articleRef} className={model.articleClass}>
        <header className="border-b border-border/60 pb-8">
          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">{model.title}</h1>
            <div className="shrink-0">
              <div className="flex items-center gap-2">
                <DocsActions articleRef={articleRef} pathname={pathname} title={model.title} />
                <DocsPaginationButtons pathname={pathname} />
              </div>
            </div>
          </div>
          {model.description && <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">{model.description}</p>}
        </header>
        <div ref={snapshotRef} style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: model.bodyHtml }} />
        {paginationHost && model.pagination && createPortal(<DocsPagination pathname={pathname} />, paginationHost)}
      </article>
    </main>
  );
}
