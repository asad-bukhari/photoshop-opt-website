'use client';

import { useState } from 'react';
import { ArrowDown, ArrowUp, CheckCircle2, Layers, ShieldCheck, Trash2 } from 'lucide-react';
import type { PdfMergeResult } from '@/lib/types';
import { formatBytes } from '@/lib/utils/format';
import { downloadBlob } from '@/lib/utils/download';
import { inspectPdfFile, mergePdfFiles } from '@/lib/utils/pdfTools';
import { FileDropzone } from './tool/FileDropzone';
import { ResultActions } from './tool/ResultActions';

interface MergeItem {
  id: string;
  file: File;
  pageCount: number;
}

export function MergePdfTool() {
  const [items, setItems] = useState<MergeItem[]>([]);
  const [isInspecting, setIsInspecting] = useState(false);
  const [isMerging, setIsMerging] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [result, setResult] = useState<PdfMergeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const totalPages = items.reduce((sum, item) => sum + item.pageCount, 0);
  const totalBytes = items.reduce((sum, item) => sum + item.file.size, 0);

  const handleFiles = async (incoming: File[]) => {
    if (incoming.length === 0) return;

    setIsInspecting(true);
    setError(null);
    const accepted: MergeItem[] = [];
    const problems: string[] = [];

    for (const file of incoming) {
      try {
        const info = await inspectPdfFile(file);
        if (info.encrypted) {
          problems.push(`${file.name} is protected and was skipped.`);
          continue;
        }
        accepted.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          file,
          pageCount: info.pageCount
        });
      } catch (inspectError) {
        problems.push(inspectError instanceof Error ? inspectError.message : `${file.name} could not be read.`);
      }
    }

    if (accepted.length > 0) {
      setItems((previous) => [...previous, ...accepted]);
      setResult(null);
    }
    if (problems.length > 0) setError(problems.join(' '));
    setIsInspecting(false);
  };

  const moveItem = (id: string, direction: -1 | 1) => {
    setItems((previous) => {
      const index = previous.findIndex((item) => item.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= previous.length) return previous;
      const next = [...previous];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setResult(null);
  };

  const removeItem = (id: string) => {
    setItems((previous) => previous.filter((item) => item.id !== id));
    setResult(null);
  };

  const clearAll = () => {
    setItems([]);
    setResult(null);
    setError(null);
    setProgress(null);
  };

  const handleMerge = async () => {
    if (items.length === 0 || isMerging) return;

    setIsMerging(true);
    setError(null);
    setResult(null);
    setProgress({ done: 0, total: items.length });

    try {
      const merged = await mergePdfFiles(
        items.map((item) => item.file),
        (done, total) => setProgress({ done, total })
      );
      setResult(merged);
    } catch (mergeError) {
      setError(mergeError instanceof Error ? mergeError.message : 'The PDFs could not be merged.');
    } finally {
      setIsMerging(false);
      setProgress(null);
    }
  };

  const downloadResult = () => {
    if (result) downloadBlob(result.blob, 'merged.pdf');
  };

  return (
    <div className="space-y-6">
      <FileDropzone
        onFiles={handleFiles}
        accept={['application/pdf']}
        multiple
        title={isInspecting ? 'Reading PDFs...' : 'Add PDF files'}
        hint="Drag and drop PDFs here, or tap to choose. Password-protected PDFs are skipped."
        disabled={isInspecting || isMerging}
      />

      {error && (
        <p role="alert" className="rounded-xl border border-stamp/30 bg-stamp/5 px-4 py-3 text-sm text-stamp">
          {error}
        </p>
      )}

      {items.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-12">
          <section aria-labelledby="merge-files-title" className="space-y-4 rounded-2xl border border-line bg-paper-2 p-4 sm:p-5 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-doc" />
                <h2 id="merge-files-title" className="font-display text-base font-bold text-ink">
                  PDFs to merge ({items.length})
                </h2>
              </div>
              <button
                type="button"
                onClick={clearAll}
                disabled={isMerging}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-3 hover:text-stamp disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                Clear all
              </button>
            </div>

            <p className="text-xs leading-relaxed text-ink-soft">
              Pages are added in this list order. Use the up and down buttons to reorder. This version shows page counts
              instead of thumbnails.
            </p>

            <ol className="space-y-2">
              {items.map((item, index) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-paper-3/50 p-3"
                >
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-doc-soft font-mono text-xs font-bold text-doc">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink">{item.file.name}</span>
                    <span className="mt-0.5 block font-mono text-xs text-ink-soft">
                      {item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'} · {formatBytes(item.file.size)}
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveItem(item.id, -1)}
                      disabled={index === 0 || isMerging}
                      aria-label={`Move ${item.file.name} up`}
                      className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-paper-2 hover:text-doc disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(item.id, 1)}
                      disabled={index === items.length - 1 || isMerging}
                      aria-label={`Move ${item.file.name} down`}
                      className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-paper-2 hover:text-doc disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      disabled={isMerging}
                      aria-label={`Remove ${item.file.name}`}
                      className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-paper-2 hover:text-stamp disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <aside className="space-y-4 lg:col-span-5">
            <section className="space-y-4 rounded-2xl border border-line bg-paper-2 p-4 sm:p-5">
              <h2 className="font-display text-base font-bold text-ink">Merge summary</h2>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-line bg-paper-3 p-3">
                  <dt className="font-mono text-xs uppercase tracking-wider text-ink-soft">Files</dt>
                  <dd className="mt-1 font-display text-xl font-black text-ink">{items.length}</dd>
                </div>
                <div className="rounded-xl border border-line bg-paper-3 p-3">
                  <dt className="font-mono text-xs uppercase tracking-wider text-ink-soft">Pages</dt>
                  <dd className="mt-1 font-display text-xl font-black text-ink">{totalPages}</dd>
                </div>
              </dl>
              <p className="font-mono text-xs text-ink-soft">Input size: {formatBytes(totalBytes)}</p>

              <button
                type="button"
                onClick={handleMerge}
                disabled={isMerging || items.length === 0}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-doc px-4 text-base font-semibold text-white transition-colors hover:bg-doc-bright disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isMerging ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {progress ? `Merging ${progress.done} of ${progress.total}...` : 'Merging...'}
                  </>
                ) : (
                  <>
                    <Layers className="h-4 w-4" />
                    Merge {items.length === 1 ? '1 PDF' : `${items.length} PDFs`}
                  </>
                )}
              </button>

              <p role="status" className="sr-only">
                {isMerging && progress ? `Merging file ${progress.done} of ${progress.total}` : ''}
              </p>

              {result && (
                <div className="space-y-3 rounded-xl border border-doc/20 bg-doc-soft p-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <CheckCircle2 className="h-4 w-4 text-doc" />
                    Merged PDF ready
                  </div>
                  <p className="font-mono text-xs text-ink-soft">
                    {result.pageCount} {result.pageCount === 1 ? 'page' : 'pages'} · {formatBytes(result.bytes)}
                  </p>
                  <ResultActions onDownload={downloadResult} downloadLabel="Download merged PDF" />
                </div>
              )}
            </section>

            <div className="flex items-start gap-2 rounded-xl border border-line bg-paper-3 p-3 text-xs leading-relaxed text-ink-soft">
              <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-doc" />
              <span>Your PDFs are read and merged in this browser. They are not uploaded.</span>
            </div>

            <div className="rounded-2xl border border-line bg-paper-3 p-4 text-xs leading-relaxed text-ink-soft">
              <p className="font-semibold text-ink">Limits</p>
              <p className="mt-1">
                Password-protected PDFs are skipped; the tool does not remove passwords. It does not compress the
                output, add bookmarks or show page thumbnails. Very large files can be slow on a phone.
              </p>
            </div>
          </aside>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-line bg-paper-2 px-4 py-6 text-center text-sm text-ink-soft">
          Add two or more PDFs to join them. Files are merged in the order shown.
        </p>
      )}
    </div>
  );
}
