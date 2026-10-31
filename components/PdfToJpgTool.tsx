'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, FileImage, FileText, ShieldCheck, Trash2 } from 'lucide-react';
import type { PdfImageScale, PdfJpegQuality } from '@/lib/utils/pdfToJpg';
import { formatBytes } from '@/lib/utils/format';
import { downloadBlob } from '@/lib/utils/download';
import {
  getJpegQuality,
  loadPdfForImages,
  PDF_IMAGE_SCALES,
  renderPdfPageToJpeg,
  type LoadedPdf,
  type PdfPageImage
} from '@/lib/utils/pdfToJpg';
import { FileDropzone } from './tool/FileDropzone';
import { ResultActions } from './tool/ResultActions';

const QUALITY_LABELS: Record<PdfJpegQuality, string> = {
  high: 'High',
  small: 'Small'
};

export function PdfToJpgTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pdf, setPdf] = useState<LoadedPdf | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [scale, setScale] = useState<PdfImageScale>(2);
  const [quality, setQuality] = useState<PdfJpegQuality>('high');
  const [results, setResults] = useState<PdfPageImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      void pdf?.destroy();
    };
  }, [pdf]);

  const handleFiles = async (incoming: File[]) => {
    const nextFile = incoming[0];
    if (!nextFile) return;

    setIsLoading(true);
    setError(null);
    setResults([]);
    setPdf(null);
    setPageCount(0);

    try {
      const loaded = await loadPdfForImages(nextFile);
      setFile(nextFile);
      setPdf(loaded);
      setPageCount(loaded.document.numPages);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'The PDF could not be read.');
      setFile(null);
      setPdf(null);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPdf(null);
    setPageCount(0);
    setResults([]);
    setError(null);
    setProgress(null);
  };

  const markDirty = () => setResults([]);

  const handleConvert = async () => {
    if (!pdf || !file || pageCount === 0 || isConverting) return;

    setIsConverting(true);
    setError(null);
    setResults([]);
    setProgress({ done: 0, total: pageCount });

    try {
      const nextResults: PdfPageImage[] = [];
      for (let page = 1; page <= pageCount; page++) {
        const image = await renderPdfPageToJpeg(pdf.document, file.name, page, scale, quality);
        nextResults.push(image);
        setProgress({ done: page, total: pageCount });
      }
      setResults(nextResults);
    } catch (convertError) {
      setError(convertError instanceof Error ? convertError.message : 'The pages could not be rendered.');
    } finally {
      setIsConverting(false);
      setProgress(null);
    }
  };

  return (
    <div className="space-y-6">
      {!file && (
        <FileDropzone
          onFiles={handleFiles}
          accept={['application/pdf']}
          multiple={false}
          title={isLoading ? 'Reading PDF...' : 'Add a PDF'}
          hint="Drag and drop one PDF here, or tap to choose. Password-protected PDFs are skipped."
          disabled={isLoading}
        />
      )}

      {error && (
        <p role="alert" className="rounded-xl border border-stamp/30 bg-stamp/5 px-4 py-3 text-sm text-stamp">
          {error}
        </p>
      )}

      {file && pdf ? (
        <div className="grid gap-5 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            <section className="rounded-2xl border border-line bg-paper-2 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
                <div className="flex min-w-0 items-center gap-2">
                  <FileText className="h-4 w-4 flex-shrink-0 text-doc" />
                  <h2 className="truncate font-display text-base font-bold text-ink">{file.name}</h2>
                </div>
                <button
                  type="button"
                  onClick={reset}
                  disabled={isConverting}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-3 hover:text-stamp disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>
              <p className="mt-2 font-mono text-xs text-ink-soft">
                {pageCount} {pageCount === 1 ? 'page' : 'pages'} · {formatBytes(file.size)}
              </p>
            </section>

            <section className="rounded-2xl border border-line bg-paper-2 p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <FileImage className="h-4 w-4 text-doc" />
                <h2 className="font-display text-base font-bold text-ink">Page images</h2>
              </div>

              {results.length > 0 ? (
                <div className="mt-3 space-y-2">
                  <p className="text-xs leading-relaxed text-ink-soft">
                    Each page downloads separately. This version does not create a ZIP.
                  </p>
                  <ul className="space-y-2">
                    {results.map((result) => (
                      <li key={result.name} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-paper-3 p-3">
                        <div className="min-w-0">
                          <p className="break-all text-sm font-semibold text-ink">{result.name}</p>
                          <p className="mt-1 font-mono text-xs text-ink-soft">
                            Page {result.pageNumber} · {result.width} x {result.height} px · {formatBytes(result.bytes)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => downloadBlob(result.blob, result.name)}
                          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-doc px-4 text-sm font-semibold text-white transition-colors hover:bg-doc-bright"
                        >
                          Download JPG
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="mt-2 text-sm text-ink-soft">
                  Choose a scale and quality, then convert the PDF. The rendered page images will appear here.
                </p>
              )}
            </section>
          </div>

          <aside className="space-y-4 lg:col-span-5">
            <section className="space-y-4 rounded-2xl border border-line bg-paper-2 p-4 sm:p-5">
              <h2 className="font-display text-base font-bold text-ink">Image settings</h2>

              <div className="space-y-1">
                <label htmlFor="jpg-scale" className="text-sm font-medium text-ink">
                  Scale
                </label>
                <select
                  id="jpg-scale"
                  value={scale}
                  onChange={(event) => {
                    setScale(Number(event.target.value) as PdfImageScale);
                    markDirty();
                  }}
                  className="min-h-11 w-full rounded-lg border border-line bg-paper-3 px-3 text-base text-ink focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  {PDF_IMAGE_SCALES.map((value) => (
                    <option key={value} value={value}>
                      {value}x ({Math.round(72 * value)} DPI equivalent)
                    </option>
                  ))}
                </select>
                <p className="text-xs leading-relaxed text-ink-soft">
                  A larger scale gives a sharper image and a larger file. 2x is a good default for reading text.
                </p>
              </div>

              <div className="space-y-1">
                <label htmlFor="jpg-quality" className="text-sm font-medium text-ink">
                  JPEG quality
                </label>
                <select
                  id="jpg-quality"
                  value={quality}
                  onChange={(event) => {
                    setQuality(event.target.value as PdfJpegQuality);
                    markDirty();
                  }}
                  className="min-h-11 w-full rounded-lg border border-line bg-paper-3 px-3 text-base text-ink focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  {(Object.keys(QUALITY_LABELS) as PdfJpegQuality[]).map((value) => (
                    <option key={value} value={value}>
                      {QUALITY_LABELS[value]} ({getJpegQuality(value).toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleConvert}
                disabled={isConverting || pageCount === 0}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-doc px-4 text-base font-semibold text-white transition-colors hover:bg-doc-bright disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isConverting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {progress ? `Rendering page ${progress.done} of ${progress.total}...` : 'Rendering...'}
                  </>
                ) : (
                  <>
                    <FileImage className="h-4 w-4" />
                    Convert {pageCount} {pageCount === 1 ? 'page' : 'pages'}
                  </>
                )}
              </button>

              <p role="status" className="sr-only">
                {isConverting && progress ? `Rendering page ${progress.done} of ${progress.total}` : ''}
              </p>

              {results.length > 0 && (
                <div className="flex items-center gap-2 rounded-xl border border-doc/20 bg-doc-soft p-3 text-sm font-semibold text-ink">
                  <CheckCircle2 className="h-4 w-4 text-doc" />
                  {results.length} {results.length === 1 ? 'image' : 'images'} ready
                </div>
              )}
            </section>

            <div className="flex items-start gap-2 rounded-xl border border-line bg-paper-3 p-3 text-xs leading-relaxed text-ink-soft">
              <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-doc" />
              <span>Your PDF is rendered in this browser. It is not uploaded.</span>
            </div>

            <div className="rounded-2xl border border-line bg-paper-3 p-4 text-xs leading-relaxed text-ink-soft">
              <p className="font-semibold text-ink">Limits</p>
              <p className="mt-1">
                Pages become JPEG images, so text is not searchable and no OCR is performed. Protected PDFs are
                skipped, there is no ZIP download, and a PDF with many pages can use a lot of memory.
              </p>
            </div>
          </aside>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-line bg-paper-2 px-4 py-6 text-center text-sm text-ink-soft">
          Add a PDF to render its pages as JPG images.
        </p>
      )}
    </div>
  );
}
