'use client';

import { useEffect, useId, useRef } from 'react';
import { BarChart3, EyeOff, Lock, ShieldCheck, X } from 'lucide-react';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function SecurityModal({ isOpen, onClose }: SecurityModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    previousFocus.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) return;

      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-line bg-paper-2 p-5 text-ink shadow-xl sm:rounded-2xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-3 border-b border-line pb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-doc" />
            <h2 id={titleId} className="font-display text-lg font-bold text-ink">
              How we handle your files
            </h2>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-paper-3 hover:text-ink"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3 text-sm text-ink-soft">
          <div className="rounded-xl border border-line bg-paper-3 p-4">
            <h3 className="flex items-center gap-2 font-semibold text-ink">
              <Lock className="h-4 w-4 text-doc" />
              Your files stay in your browser
            </h3>
            <p className="mt-1 leading-relaxed">
              The image and CNIC tools read your files with the HTML5 Canvas API in this browser. The tool does not
              upload them to a server.
            </p>
          </div>

          <div className="rounded-xl border border-line bg-paper-3 p-4">
            <h3 className="flex items-center gap-2 font-semibold text-ink">
              <EyeOff className="h-4 w-4 text-gold" />
              EXIF location data is removed
            </h3>
            <p className="mt-1 leading-relaxed">
              Re-encoding through Canvas drops EXIF metadata such as GPS coordinates, camera model and timestamps.
            </p>
          </div>

          <div className="rounded-xl border border-line bg-paper-3 p-4">
            <h3 className="flex items-center gap-2 font-semibold text-ink">
              <BarChart3 className="h-4 w-4 text-ink-soft" />
              Analytics and ads
            </h3>
            <p className="mt-1 leading-relaxed">
              The site loads Google Analytics and third-party advertisements. They are separate from the files you
              choose in the tools.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-5 flex min-h-11 w-full items-center justify-center rounded-lg bg-doc px-5 text-base font-semibold text-white transition-colors hover:bg-doc-bright"
        >
          Close
        </button>
      </div>
    </div>
  );
}
