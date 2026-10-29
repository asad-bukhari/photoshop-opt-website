import { CornerMarks } from './CornerMarks';

interface LegalPageProps {
  title: string;
  updated: string;
  children: React.ReactNode;
}

export function LegalPage({ title, updated, children }: LegalPageProps) {
  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-line bg-paper-2 p-6 shadow-sm md:p-8">
        <CornerMarks className="text-rule" />
        <p className="font-mono text-xs uppercase tracking-widest text-doc">Legal — Zaibi Tools</p>
        <h1 className="mt-3 font-display text-2xl font-black tracking-tight text-ink md:text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-ink-soft">Last updated: {updated}</p>
      </header>

      <div className="space-y-4 rounded-2xl border border-line bg-paper-2 p-6 text-base leading-relaxed text-ink-soft shadow-sm md:p-8 [&_a]:font-semibold [&_a]:text-doc [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-doc-bright [&_h2]:pt-2 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc">
        {children}
      </div>
    </article>
  );
}
