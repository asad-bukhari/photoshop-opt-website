import { CornerMarks } from './CornerMarks';

export function ContentSheet({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative rounded-2xl border border-line bg-paper-2 p-5 shadow-sm sm:p-8">
      <CornerMarks className="text-rule" />
      <div className="space-y-6 text-base leading-relaxed text-ink-soft [&_a]:font-semibold [&_a]:text-doc [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-doc-bright [&_h2]:scroll-mt-24 [&_h2]:pt-2 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink sm:[&_h2]:text-2xl [&_h3]:scroll-mt-24 [&_h3]:pt-1 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-ink [&_ol]:space-y-2 [&_ol_li]:ml-5 [&_ol_li]:list-decimal [&_strong]:text-ink [&_ul]:space-y-2 [&_ul_li]:ml-5 [&_ul_li]:list-disc">
        {children}
      </div>
    </section>
  );
}
