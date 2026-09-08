export function CornerMarks({ className = '' }: { className?: string }) {
  return (
    <span aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
      <span className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2" />
      <span className="absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2" />
      <span className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2" />
      <span className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2" />
    </span>
  );
}

export function ScaleRuler({ segments = 12, className = '' }: { segments?: number; className?: string }) {
  return (
    <span aria-hidden className={`flex items-end gap-[3px] ${className}`}>
      {Array.from({ length: segments }).map((_, i) => (
        <span key={i} className={`w-px bg-current ${i % 5 === 0 ? 'h-2.5' : 'h-1.5'}`} />
      ))}
    </span>
  );
}
