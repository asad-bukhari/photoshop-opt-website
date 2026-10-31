import type { ToolHowToStep } from '@/lib/types';

export function HowToSteps({ steps, title = 'How it works' }: { steps: ToolHowToStep[]; title?: string }) {
  if (steps.length === 0) return null;

  return (
    <section aria-labelledby="how-it-works-title" className="space-y-4">
      <h2 id="how-it-works-title" className="font-display text-2xl font-bold tracking-tight text-ink">
        {title}
      </h2>
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li key={step.title} className="rounded-xl border border-line bg-paper-2 p-4">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-gold">Step {index + 1}</span>
            <h3 className="mt-2 font-display text-base font-bold text-ink">{step.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
