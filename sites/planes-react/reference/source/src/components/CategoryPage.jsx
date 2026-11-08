import { Link } from 'react-router-dom';
import navGroups from '../../public/nav.json';
import categoryContent from '../data/category-pages.json';

export function getCategoryData(pathname) {
  const slug = pathname.match(/^\/components\/([a-z-]+)$/)?.[1];
  if (!slug || !Object.prototype.hasOwnProperty.call(categoryContent, slug)) return null;
  const group = navGroups.find((entry) => entry.href === pathname);
  return group ? { ...categoryContent[slug], group } : null;
}

function ArrowUpRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="ml-auto size-3.5 shrink-0 text-muted-foreground/30 transition-[rotate,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-45 group-hover:text-foreground"
      aria-hidden="true"><path d="M7 7h10v10" /><path d="M7 17 17 7" /></svg>
  );
}

function LockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="size-3 shrink-0 text-muted-foreground/50" aria-label="Pro">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function CategoryCard({ item, pro }) {
  const slug = item.href.split('/').pop();
  return (
    <Link to={item.href}
      className="group relative flex flex-col gap-2 rounded-2xl border border-border/60 bg-secondary/50 p-1 transition-colors hover:border-border hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-muted">
        {item.thumb && <img src={`/thumbs/${slug}.webp`} alt={`${item.label} preview`}
          width="960" height="557" loading="lazy" className="size-full object-cover" />}
      </div>
      <div className="px-1.5 pb-1">
        <div className="flex items-center gap-2">
          <h3 className="min-w-0 truncate p-1 text-[13px] font-medium text-foreground">{item.label}</h3>
          {pro && <LockIcon />}
          <ArrowUpRight />
        </div>
      </div>
    </Link>
  );
}

/** All twelve category landing pages are fully data-driven React, no HTML injection. */
export default function CategoryPage({ data }) {
  const { title, description, faq, pro, group } = data;
  const paid = new Set(pro);
  return (
    <main className="min-w-0 mx-auto max-w-5xl px-5 py-24 sm:px-8 md:px-10 lg:px-14 xl:px-16">
      <section>
        <div className="mx-auto max-w-2xl pb-10 pt-2 text-center">
          <h1 className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
          <p className="mt-3 text-[12px] text-muted-foreground/70">
            {group.items.length} components ·{' '}
            <Link to="/components" className="underline underline-offset-4 hover:text-foreground">Browse all components</Link>
          </p>
        </div>
        <h2 className="sr-only">Components</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {group.items.map((item) => (
            <CategoryCard key={item.href} item={item} pro={paid.has(item.href.split('/').pop())} />
          ))}
        </div>
        <section className="mx-auto mt-16 max-w-2xl" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-lg font-semibold tracking-[-0.02em]">FAQ</h2>
          <dl className="mt-4 space-y-5">
            {faq.map(({ question, answer }) => (
              <div key={question}>
                <dt className="text-[0.95rem] font-medium">{question}</dt>
                <dd className="mt-1 text-sm leading-6 text-muted-foreground">{answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      </section>
    </main>
  );
}
