'use client';

import { useState } from 'react';
import { CheckCircle2, FileText, Scissors, ShieldCheck, Trash2 } from 'lucide-react';
import type { PdfSplitResult } from '@/lib/types';
import { formatBytes } from '@/lib/utils/format';
import { downloadBlob } from '@/lib/utils/download';
import { extractPdfPages, inspectPdfFile, parsePageRanges, splitPdfEveryN } from '@/lib/utils/pdfTools';
import { FileDropzone } from './tool/FileDropzone';
import { ResultActions } from './tool/ResultActions';

type SplitMode = 'extract' | 'chunks';

interface SplitFile {
  file: File;
  pageCount: number;
}

export function SplitPdfTool() {
  const [source, setSource] = useState<SplitFile | null>(null);
  const [mode, setMode] = useState<SplitMode>('extract');
  const [rangeInput, setRangeInput] = useState('');
  const [pagesPerFile, setPagesPerFile] = useState(2);
  const [results, setResults] = useState<PdfSplitResult[]>([]);
  const [isInspecting, setIsInspecting] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsed = source ? parsePageRanges(rangeInput, source.pageCount) : { pages: [], errors: [] };
  const chunkCount = source ? Math.ceil(source.pageCount / Math.max(1, pagesPerFile)) : 0;
  const canExtract = Boolean(source && parsed.pages.length > 0 && parsed.errors.length === 0);
  const canChunk = Boolean(
    source && Number.isInteger(pagesPerFile) && pagesPerFile >= 1 && pagesPerFile <= source.pageCount
  );

  const handleFiles = async (incoming: File[]) => {
    const file = incoming[0];
    if (!file) return;

    setIsInspecting(true);
    setError(null);
    setResults([]);

    try {
      const info = await inspectPdfFile(file);
      if (info.encrypted) {
        setError(`${file.name} is protected. Remove the password in the app that created it, then try again.`);
        setSource(null);
        return;
      }

      setSource({ file, pageCount: info.pageCount });
      setRangeInput('');
      setPagesPerFile(Math.min(2, Math.max(1, info.pageCount)));
    } catch (inspectError) {
      setError(inspectError instanceof Error ? inspectError.message : 'The PDF could not be read.');
      setSource(null);
    } finally {
      setIsInspecting(false);
    }
  };

  const resetSource = () => {
    setSource(null);
    setRangeInput('');
    setPagesPerFile(2);
    setResults([]);
    setError(null);
  };

  const handleExtract = async () => {
    if (!source || !canExtract || isWorking) return;

    setIsWorking(true);
    setError(null);
    setResults([]);

    try {
      const result = await extractPdfPages(source.file, parsed.pages);
      setResults([result]);
    } catch (extractError) {
      setError(extractError instanceof Error ? extractError.message : 'The pages could not be extracted.');
    } finally {
      setIsWorking(false);
    }
  };

  const handleSplit = async () => {
    if (!source || !canChunk || isWorking) return;

    setIsWorking(true);
    setError(null);
    setResults([]);

    try {
      const parts = await splitPdfEveryN(source.file, pagesPerFile);
      setResults(parts);
    } catch (splitError) {
      setError(splitError instanceof Error ? splitError.message : 'The PDF could not be split.');
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <div className="space-y-6">
      {!source && (
        <FileDropzone
          onFiles={handleFiles}
          accept={['application/pdf']}
          multiple={false}
          title={isInspecting ? 'Reading PDF...' : 'Add a PDF to split'}
          hint="Drag and drop one PDF here, or tap to choose. Password-protected PDFs are skipped."
          disabled={isInspecting}
        />
      )}

      {error && (
        <p role="alert" className="rounded-xl border border-stamp/30 bg-stamp/5 px-4 py-3 text-sm text-stamp">
          {error}
        </p>
      )}

      {source ? (
        <div className="grid gap-5 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            <section className="rounded-2xl border border-line bg-paper-2 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
                <div className="flex min-w-0 items-center gap-2">
                  <FileText className="h-4 w-4 flex-shrink-0 text-doc" />
                  <h2 className="truncate font-display text-base font-bold text-ink">{source.file.name}</h2>
                </div>
                <button
                  type="button"
                  onClick={resetSource}
                  disabled={isWorking}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-3 hover:text-stamp disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>
              <p className="mt-2 font-mono text-xs text-ink-soft">
                {source.pageCount} {source.pageCount === 1 ? 'page' : 'pages'} · {formatBytes(source.file.size)}
              </p>
            </section>

            <section className="space-y-4 rounded-2xl border border-line bg-paper-2 p-4 sm:p-5">
              <h2 className="font-display text-base font-bold text-ink">Split mode</h2>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('extract');
                    setResults([]);
                  }}
                  aria-pressed={mode === 'extract'}
                  className={`min-h-11 rounded-lg border px-3 text-sm font-semibold transition-colors ${
                    mode === 'extract'
                      ? 'border-doc bg-doc-soft text-doc'
                      : 'border-line bg-paper-3 text-ink-soft hover:bg-paper-2 hover:text-ink'
                  }`}
                >
                  Extract pages
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('chunks');
                    setResults([]);
                  }}
                  aria-pressed={mode === 'chunks'}
                  className={`min-h-11 rounded-lg border px-3 text-sm font-semibold transition-colors ${
                    mode === 'chunks'
                      ? 'border-doc bg-doc-soft text-doc'
                      : 'border-line bg-paper-3 text-ink-soft hover:bg-paper-2 hover:text-ink'
                  }`}
                >
                  Split every N pages
                </button>
              </div>

              {mode === 'extract' ? (
                <div className="space-y-2">
                  <label htmlFor="page-ranges" className="text-sm font-medium text-ink">
                    Pages to extract
                  </label>
                  <input
                    id="page-ranges"
                    type="text"
                    value={rangeInput}
                    onChange={(event) => {
                      setRangeInput(event.target.value);
                      setResults([]);
                    }}
                    placeholder="1-3, 5, 8-10"
                    className="min-h-11 w-full rounded-lg border border-line bg-paper-3 px-3 text-base text-ink focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <p className="text-xs leading-relaxed text-ink-soft">
                    Use commas and ranges, for example 1-3, 5. Duplicates are removed. Pages are written in the order
                    you enter them.
                  </p>
                  {rangeInput.trim() && parsed.errors.length > 0 && (
                    <ul className="space-y-1 rounded-xl border border-stamp/30 bg-stamp/5 px-3 py-2 text-xs text-stamp">
                      {parsed.errors.map((message) => (
                        <li key={message}>{message}</li>
                      ))}
                    </ul>
                  )}
                  {parsed.pages.length > 0 && parsed.errors.length === 0 && (
                    <p className="font-mono text-xs text-doc">
                      {parsed.pages.length} {parsed.pages.length === 1 ? 'page' : 'pages'} selected
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <label htmlFor="pages-per-file" className="text-sm font-medium text-ink">
                    Pages per file
                  </label>
                  <input
                    id="pages-per-file"
                    type="number"
                    min="1"
                    max={source.pageCount}
                    step="1"
                    inputMode="numeric"
                    value={pagesPerFile}
                    onChange={(event) => {
                      setPagesPerFile(Number(event.target.value) || 1);
                      setResults([]);
                    }}
                    className="min-h-11 w-full rounded-lg border border-line bg-paper-3 px-3 text-base text-ink focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <p className="text-xs leading-relaxed text-ink-soft">
                    {canChunk
                      ? `This creates ${chunkCount} ${chunkCount === 1 ? 'file' : 'files'}. Each downloads on its own; this version does not make a ZIP.`
                      : 'Enter a number from 1 to the PDF page count.'}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={mode === 'extract' ? handleExtract : handleSplit}
                disabled={isWorking || (mode === 'extract' ? !canExtract : !canChunk)}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-doc px-4 text-base font-semibold text-white transition-colors hover:bg-doc-bright disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isWorking ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Working...
                  </>
                ) : (
                  <>
                    <Scissors className="h-4 w-4" />
                    {mode === 'extract' ? 'Extract selected pages' : 'Split PDF'}
                  </>
                )}
              </button>
            </section>
          </div>

          <aside className="space-y-4 lg:col-span-5">
            <section className="space-y-3 rounded-2xl border border-line bg-paper-2 p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-doc" />
                <h2 className="font-display text-base font-bold text-ink">Results</h2>
              </div>

              {results.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs leading-relaxed text-ink-soft">
                    Download each file separately. This version does not create a ZIP.
                  </p>
                  <ul className="space-y-2">
                    {results.map((result) => (
                      <li key={result.name} className="rounded-xl border border-line bg-paper-3 p-3">
                        <p className="break-all text-sm font-semibold text-ink">{result.name}</p>
                        <p className="mt-1 font-mono text-xs text-ink-soft">
                          {result.pageCount} {result.pageCount === 1 ? 'page' : 'pages'} · {formatBytes(result.bytes)}
                        </p>
                        <div className="mt-3">
                          <ResultActions
                            onDownload={() => downloadBlob(result.blob, result.name)}
                            downloadLabel="Download"
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-ink-soft">The extracted or split files will appear here.</p>
              )}
            </section>

            <div className="flex items-start gap-2 rounded-xl border border-line bg-paper-3 p-3 text-xs leading-relaxed text-ink-soft">
              <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-doc" />
              <span>Your PDF is read and split in this browser. It is not uploaded.</span>
            </div>

            <div className="rounded-2xl border border-line bg-paper-3 p-4 text-xs leading-relaxed text-ink-soft">
              <p className="font-semibold text-ink">Limits</p>
              <p className="mt-1">
                The original PDF is not changed. Password-protected files are skipped, there are no page thumbnails,
                and the output is not compressed. Multiple files download one at a time.
              </p>
            </div>
          </aside>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-line bg-paper-2 px-4 py-6 text-center text-sm text-ink-soft">
          Add one PDF to extract pages or split it into smaller files.
        </p>
      )}
    </div>
  );
}
