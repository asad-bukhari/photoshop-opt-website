import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-start justify-center gap-4 py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-stamp">404</p>
      <h1 className="font-display text-3xl font-black tracking-tight text-ink">Page not found</h1>
      <p className="text-base leading-relaxed text-ink-soft">
        The page you requested does not exist. Use one of the tools below, or go back to the home page.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-doc px-5 text-base font-semibold text-white transition-colors hover:bg-doc-bright"
        >
          Go to home
        </Link>
        <Link
          href="/image-compressor"
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-line bg-paper-2 px-5 text-base font-semibold text-ink transition-colors hover:bg-paper-3"
        >
          Image Compressor
        </Link>
        <Link
          href="/cnic-photocopy"
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-line bg-paper-2 px-5 text-base font-semibold text-ink transition-colors hover:bg-paper-3"
        >
          CNIC Photocopy
        </Link>
      </div>
    </div>
  );
}
