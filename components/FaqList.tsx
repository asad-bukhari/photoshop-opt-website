interface FaqListProps {
  items: { question: string; answer: string }[];
}

export function FaqList({ items }: FaqListProps) {
  return (
    <div className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-paper-2">
      {items.map((item) => (
        <details key={item.question} className="group">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 p-4 text-base font-semibold text-ink [&::-webkit-details-marker]:hidden sm:p-5">
            <span>{item.question}</span>
            <span aria-hidden className="text-xl leading-none text-ink-soft transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="px-4 pb-4 text-sm leading-relaxed text-ink-soft sm:px-5 sm:pb-5">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
