import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getLiveTools, toolHref } from '@/lib/data/tools';

export function SizeLandingLinks({ currentSlug }: { currentSlug?: string }) {
  const pages = getLiveTools().filter((tool) => tool.kind === 'landing' && tool.slug !== currentSlug);

  if (pages.length === 0) return null;

  return (
    <section aria-labelledby="size-pages-title" className="scroll-mt-24 space-y-3">
      <h2 id="size-pages-title">Other KB targets</h2>
      <ul className="grid gap-2 sm:grid-cols-3">
        {pages.map((page) => (
          <li key={page.id}>
            <Link
              href={toolHref(page)}
              className="flex min-h-11 items-center justify-between gap-2 rounded-xl border border-line bg-paper-2 px-4 py-3 text-sm font-semibold text-ink transition-colors hover:border-doc/40 hover:text-doc"
            >
              {page.name}
              <ArrowRight className="h-4 w-4 flex-shrink-0 text-doc" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
