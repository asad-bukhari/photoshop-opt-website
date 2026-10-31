import { ShieldCheck } from 'lucide-react';
import type { ToolEntry } from '@/lib/types';
import { TOOL_CATEGORY_LABELS } from '@/lib/data/tools';

export function ToolHero({ tool }: { tool: ToolEntry }) {
  return (
    <header className="space-y-4">
      <p className="font-mono text-xs uppercase tracking-widest text-doc">{TOOL_CATEGORY_LABELS[tool.category]}</p>
      <h1 className="max-w-3xl font-display text-3xl font-black leading-tight tracking-tight text-ink sm:text-4xl">
        {tool.h1}
      </h1>
      <p className="max-w-2xl text-base leading-relaxed text-ink-soft">{tool.intro}</p>
      <p className="flex max-w-2xl items-start gap-2 rounded-xl border border-doc/20 bg-doc-soft px-4 py-3 text-sm leading-relaxed text-ink-soft">
        <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-doc" />
        <span>Your files stay on your device. The site uses analytics and ads.</span>
      </p>
    </header>
  );
}
