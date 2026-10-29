'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('OptiPack runtime error:', error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-start justify-center gap-4 py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-stamp">Error</p>
      <h1 className="font-display text-3xl font-black tracking-tight text-ink">Something went wrong</h1>
      <p className="text-base leading-relaxed text-ink-soft">
        Try again, or reload the page. The tool did not upload your selected files.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          onClick={reset}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-doc px-5 text-base font-semibold text-white transition-colors hover:bg-doc-bright"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-line bg-paper-2 px-5 text-base font-semibold text-ink transition-colors hover:bg-paper-3"
        >
          Go to home
        </Link>
      </div>
    </div>
  );
}
