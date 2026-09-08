import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="font-mono text-[10px] uppercase tracking-widest text-stamp">Error 404</div>
      <h2 className="font-display text-xl font-bold text-ink dark:text-paper">This page was not found.</h2>
      <p className="max-w-md text-sm text-ink-soft dark:text-rule">
        The sheet you requested does not exist on this portal.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-doc px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-doc-bright"
      >
        Back to overview
      </Link>
    </div>
  );
}
