import { FaqList } from '@/components/FaqList';
import type { ToolFaqItem } from '@/lib/types';

export function ToolFaq({ items, title = 'Frequently asked questions' }: { items: ToolFaqItem[]; title?: string }) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="tool-faq-title" className="space-y-4">
      <h2 id="tool-faq-title" className="font-display text-2xl font-bold tracking-tight text-ink">
        {title}
      </h2>
      <FaqList items={items} />
    </section>
  );
}
