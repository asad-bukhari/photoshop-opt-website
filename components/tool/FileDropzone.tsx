'use client';

import { useId, useState } from 'react';
import type { ClipboardEvent, DragEvent } from 'react';
import { Upload } from 'lucide-react';
import { formatBytes } from '@/lib/utils/format';

interface FileDropzoneProps {
  onFiles: (files: File[]) => void;
  accept?: string[];
  multiple?: boolean;
  maxSizeBytes?: number;
  title?: string;
  hint?: string;
  disabled?: boolean;
  className?: string;
}

function matchesAccept(file: File, accept: string[]): boolean {
  if (accept.length === 0) return true;
  if (!file.type) return true;
  return accept.some((type) => {
    if (type.endsWith('/*')) return file.type.startsWith(type.slice(0, -1));
    return file.type === type;
  });
}

export function FileDropzone({
  onFiles,
  accept = [],
  multiple = true,
  maxSizeBytes,
  title = 'Add files',
  hint = 'Drag and drop files here, or tap to choose.',
  disabled = false,
  className
}: FileDropzoneProps) {
  const inputId = useId();
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const deliver = (incoming: File[]) => {
    if (disabled || incoming.length === 0) return;

    const wrongType = incoming.filter((file) => !matchesAccept(file, accept));
    const tooLarge = maxSizeBytes
      ? incoming.filter((file) => matchesAccept(file, accept) && file.size > maxSizeBytes)
      : [];
    const valid = incoming.filter(
      (file) => matchesAccept(file, accept) && (!maxSizeBytes || file.size <= maxSizeBytes)
    );

    if (tooLarge.length > 0) {
      setError(`${tooLarge[0].name} is larger than ${formatBytes(maxSizeBytes ?? 0)}.`);
    } else if (wrongType.length > 0 && valid.length === 0) {
      setError('That file type is not supported.');
    } else if (wrongType.length > 0) {
      setError('Some files were skipped because their type is not supported.');
    } else {
      setError(null);
    }

    if (valid.length > 0) onFiles(valid);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    deliver(Array.from(event.dataTransfer.files));
  };

  const handlePaste = (event: ClipboardEvent<HTMLLabelElement>) => {
    const pasted = Array.from(event.clipboardData.files);
    if (pasted.length === 0) return;
    event.preventDefault();
    deliver(pasted);
  };

  return (
    <div className={className}>
      <label
        htmlFor={inputId}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onPaste={handlePaste}
        aria-disabled={disabled}
        className={`block cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-colors focus-within:ring-2 focus-within:ring-gold focus-within:ring-offset-2 focus-within:ring-offset-paper sm:p-8 ${
          disabled
            ? 'cursor-not-allowed border-line bg-paper-3 opacity-60'
            : dragging
              ? 'border-doc bg-doc-soft'
              : 'border-doc/30 bg-doc-soft/60 hover:border-doc/60 hover:bg-doc-soft'
        }`}
      >
        <input
          id={inputId}
          type="file"
          multiple={multiple}
          disabled={disabled}
          accept={accept.length > 0 ? accept.join(',') : undefined}
          onChange={(event) => {
            deliver(Array.from(event.target.files ?? []));
            event.target.value = '';
          }}
          className="sr-only"
        />
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-paper-2 text-doc">
          <Upload className="h-7 w-7" />
        </span>
        <span className="mt-3 block font-display text-lg font-bold text-ink">{title}</span>
        <span className="mt-1 block text-sm leading-relaxed text-ink-soft">{hint}</span>
      </label>
      {error && (
        <p role="alert" className="mt-2 rounded-xl border border-stamp/30 bg-stamp/5 px-4 py-3 text-sm text-stamp">
          {error}
        </p>
      )}
    </div>
  );
}
