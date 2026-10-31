'use client';

import type { ReactNode } from 'react';
import { Download, Printer } from 'lucide-react';

interface ResultActionsProps {
  onDownload?: () => void;
  onPrint?: () => void;
  downloadLabel?: string;
  printLabel?: string;
  disabled?: boolean;
  children?: ReactNode;
}

export function ResultActions({
  onDownload,
  onPrint,
  downloadLabel = 'Download',
  printLabel = 'Print',
  disabled = false,
  children
}: ResultActionsProps) {
  if (!onDownload && !onPrint && !children) return null;

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      {onDownload && (
        <button
          type="button"
          onClick={onDownload}
          disabled={disabled}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-doc px-5 text-base font-semibold text-white transition-colors hover:bg-doc-bright disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          {downloadLabel}
        </button>
      )}
      {onPrint && (
        <button
          type="button"
          onClick={onPrint}
          disabled={disabled}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-line bg-paper-2 px-5 text-base font-semibold text-ink transition-colors hover:bg-paper-3 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Printer className="h-4 w-4" />
          {printLabel}
        </button>
      )}
      {children}
    </div>
  );
}
