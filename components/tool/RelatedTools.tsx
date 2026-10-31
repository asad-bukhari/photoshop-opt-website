import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ToolIcon } from './ToolIcon';
import { getRelatedTools, getToolById, toolHref } from '@/lib/data/tools';

export function RelatedTools({ toolId }: { toolId: string }) {
  const tool = getToolById(toolId);
  if (!tool) return null;

  const related = getRelatedTools(tool);
  if (related.length === 0) return null;

  return (
    <section aria-labelledby="related-tools-title" className="space-y-4">
      <h2 id="related-tools-title" className="font-display text-2xl font-bold tracking-tight text-ink">
        Related tools
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {related.map((item) => (
          <li key={item.id}>
            <Link
              href={toolHref(item)}
              className="flex min-h-11 items-center gap-3 rounded-xl border border-line bg-paper-2 p-4 transition-colors hover:border-doc/40"
            >
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-doc-soft text-doc">
                <ToolIcon name={item.icon} className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-base font-bold text-ink">{item.name}</span>
                <span className="mt-0.5 block text-sm leading-relaxed text-ink-soft">{item.description}</span>
              </span>
              <ArrowRight className="h-4 w-4 flex-shrink-0 text-doc" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
