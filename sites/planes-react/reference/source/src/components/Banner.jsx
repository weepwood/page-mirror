/**
 * The announcement banner is now ordinary React markup, not part of the
 * captured HTML document. Keep its classes to preserve the source layout.
 */
export default function Banner() {
  return (
    <a
      data-launch-banner="true"
      className="planes-banner-scallop group/banner dark fixed top-0 z-[60] flex h-[var(--banner-h)] w-full items-center justify-center gap-2 overflow-hidden bg-primary px-4 pb-1.5 text-[12px] tracking-[-0.01em] text-primary-foreground/80 transition-colors hover:text-primary-foreground"
      href="https://useplanes.com/#pricing"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-primary-foreground/70" />
      <span className="font-medium text-primary-foreground">Get everything for $99, lifetime</span>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="size-3.5 shrink-0 transition-transform duration-500 group-hover/banner:rotate-45"
        aria-hidden="true">
        <path d="M7 7h10v10" /><path d="M7 17 17 7" />
      </svg>
    </a>
  );
}
