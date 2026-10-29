'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('OptiPack runtime error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="font-mono text-[10px] uppercase tracking-widest text-stamp">Error</div>
      <h2 className="font-display text-xl font-bold text-ink ">Something went wrong rendering this sheet.</h2>
      <p className="max-w-md text-sm text-ink-soft ">Try again, or reload the page. Your files never left this device.</p>
      <button
        onClick={reset}
        className="rounded-lg bg-doc px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-doc-bright"
      >
        Try again
      </button>
    </div>
  );
}
