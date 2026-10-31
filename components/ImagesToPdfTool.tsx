'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  FileText,
  GripVertical,
  RotateCw,
  ShieldCheck,
  Trash2
} from 'lucide-react';
import type {
  PdfBuildOptions,
  PdfBuildResult,
  PdfImageQuality,
  PdfMargin,
  PdfOrientation,
  PdfPageSize,
  PdfRotation
} from '@/lib/types';
import { formatBytes } from '@/lib/utils/format';
import { downloadBlob } from '@/lib/utils/download';
import { createObjectUrl, revokeObjectUrl, revokeObjectUrls } from '@/lib/utils/objectUrls';
import { buildImagesPdf, getJpegQuality, nextRotation } from '@/lib/utils/imagesToPdf';
import { FileDropzone } from './tool/FileDropzone';
import { ResultActions } from './tool/ResultActions';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

const PAGE_SIZE_LABELS: Record<PdfPageSize, string> = {
  a4: 'A4',
  letter: 'Letter',
  legal: 'Legal',
  fit: 'Fit to image'
};

const ORIENTATION_LABELS: Record<PdfOrientation, string> = {
  auto: 'Auto',
  portrait: 'Portrait',
  landscape: 'Landscape'
};

const MARGIN_LABELS: Record<PdfMargin, string> = {
  none: 'None',
  small: 'Small',
  normal: 'Normal'
};

const QUALITY_LABELS: Record<PdfImageQuality, string> = {
  original: 'Original',
  high: 'High',
  small: 'Small'
};

interface PdfItem {
  id: string;
  file: File;
  rotation: PdfRotation;
  previewUrl: string;
}

const DEFAULT_OPTIONS: PdfBuildOptions = {
  pageSize: 'a4',
  orientation: 'auto',
  margin: 'normal',
  quality: 'high'
};

export function ImagesToPdfTool() {
  const [items, setItems] = useState<PdfItem[]>([]);
  const [options, setOptions] = useState<PdfBuildOptions>(DEFAULT_OPTIONS);
  const [isBuilding, setIsBuilding] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [result, setResult] = useState<PdfBuildResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const urlsRef = useRef<Set<string>>(new Set());
  const dragIdRef = useRef<string | null>(null);

  useEffect(() => {
    const urls = urlsRef.current;
    return () => {
      revokeObjectUrls(urls);
      urls.clear();
    };
  }, []);

  const markDirty = () => setResult(null);

  const handleFiles = (incoming: File[]) => {
    if (incoming.length === 0) return;

    const nextItems = incoming.map((file) => {
      const previewUrl = createObjectUrl(file);
      urlsRef.current.add(previewUrl);
      return {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        file,
        rotation: 0 as PdfRotation,
        previewUrl
      };
    });

    setItems((previous) => [...previous, ...nextItems]);
    setError(null);
    markDirty();
  };

  const removeItem = (item: PdfItem) => {
    setItems((previous) => previous.filter((entry) => entry.id !== item.id));
    revokeObjectUrl(item.previewUrl);
    urlsRef.current.delete(item.previewUrl);
    markDirty();
  };

  const clearAll = () => {
    revokeObjectUrls(urlsRef.current);
    urlsRef.current.clear();
    setItems([]);
    setResult(null);
    setError(null);
    setProgress(null);
  };

  const rotateItem = (id: string) => {
    setItems((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, rotation: nextRotation(item.rotation) } : item
      )
    );
    markDirty();
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
    markDirty();
  };

  const handleDrop = (targetId: string) => {
    const sourceId = dragIdRef.current;
    dragIdRef.current = null;
    setDraggingId(null);
    if (!sourceId || sourceId === targetId) return;

    setItems((previous) => {
      const sourceIndex = previous.findIndex((item) => item.id === sourceId);
      const targetIndex = previous.findIndex((item) => item.id === targetId);
      if (sourceIndex < 0 || targetIndex < 0) return previous;
      const next = [...previous];
      const [moved] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
    markDirty();
  };

  const updateOptions = (next: Partial<PdfBuildOptions>) => {
    setOptions((previous) => ({ ...previous, ...next }));
    markDirty();
  };

  const handleBuild = async () => {
    if (items.length === 0 || isBuilding) return;

    setIsBuilding(true);
    setError(null);
    setResult(null);
    setProgress({ done: 0, total: items.length });

    try {
      const built = await buildImagesPdf(
        items.map((item) => ({ file: item.file, rotation: item.rotation })),
        options,
        (done, total) => setProgress({ done, total })
      );
      setResult(built);
    } catch (buildError) {
      setError(buildError instanceof Error ? buildError.message : 'The PDF could not be created.');
    } finally {
      setIsBuilding(false);
      setProgress(null);
    }
  };

  const downloadResult = () => {
    if (result) downloadBlob(result.blob, `images-to-pdf-${result.pageCount}-pages.pdf`);
  };

  return (
    <div className="space-y-6">
      <FileDropzone
        onFiles={handleFiles}
        accept={ACCEPTED_TYPES}
        multiple
        title="Add images"
        hint="Drag and drop JPG, PNG, WebP or AVIF images here, or tap to choose. Add several at once."
        disabled={isBuilding}
      />

      {error && (
        <p role="alert" className="rounded-xl border border-stamp/30 bg-stamp/5 px-4 py-3 text-sm text-stamp">
          {error}
        </p>
      )}

      {items.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            <section aria-labelledby="pdf-images-title" className="rounded-2xl border border-line bg-paper-2 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-doc" />
                  <h2 id="pdf-images-title" className="font-display text-base font-bold text-ink">
                    Images in the PDF ({items.length})
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={clearAll}
                  disabled={isBuilding}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-3 hover:text-stamp disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear all
                </button>
              </div>

              <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                Drag rows to reorder on a computer, or use the up and down buttons on a phone. Each image becomes one
                PDF page in this order.
              </p>

              <ol className="mt-3 space-y-2">
                {items.map((item, index) => (
                  <li
                    key={item.id}
                    draggable={!isBuilding}
                    onDragStart={() => {
                      dragIdRef.current = item.id;
                      setDraggingId(item.id);
                    }}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => handleDrop(item.id)}
                    onDragEnd={() => {
                      dragIdRef.current = null;
                      setDraggingId(null);
                    }}
                    className={`flex flex-wrap items-center gap-3 rounded-xl border p-3 transition-colors ${
                      draggingId === item.id ? 'border-doc bg-doc-soft' : 'border-line bg-paper-3/50'
                    }`}
                  >
                    <span className="hidden cursor-grab text-ink-soft sm:block" aria-hidden>
                      <GripVertical className="h-5 w-5" />
                    </span>
                    <span className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-white">
                      <img
                        src={item.previewUrl}
                        alt={`Preview of ${item.file.name}`}
                        className="max-h-full max-w-full object-contain"
                        style={{ transform: `rotate(${item.rotation}deg)` }}
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-ink">{item.file.name}</span>
                      <span className="mt-0.5 block font-mono text-xs text-ink-soft">
                        Page {index + 1} · {formatBytes(item.file.size)}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => rotateItem(item.id)}
                        disabled={isBuilding}
                        aria-label={`Rotate ${item.file.name} 90 degrees`}
                        className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-paper-2 hover:text-doc disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <RotateCw className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem(item.id, -1)}
                        disabled={index === 0 || isBuilding}
                        aria-label={`Move ${item.file.name} up`}
                        className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-paper-2 hover:text-doc disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem(item.id, 1)}
                        disabled={index === items.length - 1 || isBuilding}
                        aria-label={`Move ${item.file.name} down`}
                        className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-paper-2 hover:text-doc disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item)}
                        disabled={isBuilding}
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
          </div>

          <aside className="space-y-4 lg:col-span-5">
            <section className="space-y-4 rounded-2xl border border-line bg-paper-2 p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-doc" />
                <h2 className="font-display text-base font-bold text-ink">PDF settings</h2>
              </div>

              <div className="space-y-1">
                <label htmlFor="pdf-page-size" className="text-sm font-medium text-ink">
                  Page size
                </label>
                <select
                  id="pdf-page-size"
                  value={options.pageSize}
                  onChange={(event) => updateOptions({ pageSize: event.target.value as PdfPageSize })}
                  className="min-h-11 w-full rounded-lg border border-line bg-paper-3 px-3 text-base text-ink focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  {(Object.keys(PAGE_SIZE_LABELS) as PdfPageSize[]).map((size) => (
                    <option key={size} value={size}>
                      {PAGE_SIZE_LABELS[size]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="pdf-orientation" className="text-sm font-medium text-ink">
                  Orientation
                </label>
                <select
                  id="pdf-orientation"
                  value={options.orientation}
                  disabled={options.pageSize === 'fit'}
                  onChange={(event) => updateOptions({ orientation: event.target.value as PdfOrientation })}
                  className="min-h-11 w-full rounded-lg border border-line bg-paper-3 px-3 text-base text-ink focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50"
                >
                  {(Object.keys(ORIENTATION_LABELS) as PdfOrientation[]).map((orientation) => (
                    <option key={orientation} value={orientation}>
                      {ORIENTATION_LABELS[orientation]}
                    </option>
                  ))}
                </select>
                <p className="text-xs leading-relaxed text-ink-soft">
                  {options.pageSize === 'fit'
                    ? 'Fit to image uses each image’s own orientation.'
                    : 'Auto turns each page to match its image.'}
                </p>
              </div>

              <div className="space-y-1">
                <label htmlFor="pdf-margin" className="text-sm font-medium text-ink">
                  Margin
                </label>
                <select
                  id="pdf-margin"
                  value={options.margin}
                  onChange={(event) => updateOptions({ margin: event.target.value as PdfMargin })}
                  className="min-h-11 w-full rounded-lg border border-line bg-paper-3 px-3 text-base text-ink focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  {(Object.keys(MARGIN_LABELS) as PdfMargin[]).map((margin) => (
                    <option key={margin} value={margin}>
                      {MARGIN_LABELS[margin]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="pdf-quality" className="text-sm font-medium text-ink">
                  Image quality
                </label>
                <select
                  id="pdf-quality"
                  value={options.quality}
                  onChange={(event) => updateOptions({ quality: event.target.value as PdfImageQuality })}
                  className="min-h-11 w-full rounded-lg border border-line bg-paper-3 px-3 text-base text-ink focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  {(Object.keys(QUALITY_LABELS) as PdfImageQuality[]).map((quality) => (
                    <option key={quality} value={quality}>
                      {QUALITY_LABELS[quality]}
                    </option>
                  ))}
                </select>
                <p className="text-xs leading-relaxed text-ink-soft">
                  Images are re-encoded as JPEG at quality {getJpegQuality(options.quality).toFixed(2)}. Original means
                  the highest quality re-encode, not the untouched source file.
                </p>
              </div>

              <button
                type="button"
                onClick={handleBuild}
                disabled={isBuilding || items.length === 0}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-doc px-4 text-base font-semibold text-white transition-colors hover:bg-doc-bright disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isBuilding ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {progress ? `Adding ${progress.done} of ${progress.total}...` : 'Building PDF...'}
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    Create PDF ({items.length} {items.length === 1 ? 'page' : 'pages'})
                  </>
                )}
              </button>

              <p role="status" className="sr-only">
                {isBuilding && progress ? `Adding image ${progress.done} of ${progress.total}` : ''}
              </p>

              {result && (
                <div className="space-y-3 rounded-xl border border-doc/20 bg-doc-soft p-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <CheckCircle2 className="h-4 w-4 text-doc" />
                    PDF ready
                  </div>
                  <p className="font-mono text-xs text-ink-soft">
                    {result.pageCount} {result.pageCount === 1 ? 'page' : 'pages'} · {formatBytes(result.bytes)}
                  </p>
                  {result.downscaledCount > 0 && (
                    <p className="text-xs leading-relaxed text-ink-soft">
                      {result.downscaledCount} {result.downscaledCount === 1 ? 'image was' : 'images were'} larger than
                      4000 px on the long side and were scaled down for memory safety.
                    </p>
                  )}
                  <ResultActions onDownload={downloadResult} downloadLabel="Download PDF" />
                </div>
              )}
            </section>

            <div className="flex items-start gap-2 rounded-xl border border-line bg-paper-3 p-3 text-xs leading-relaxed text-ink-soft">
              <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-doc" />
              <span>Your images are read and combined in this browser. They are not uploaded.</span>
            </div>

            <div className="rounded-2xl border border-line bg-paper-3 p-4 text-xs leading-relaxed text-ink-soft">
              <p className="font-semibold text-ink">Limits</p>
              <p className="mt-1">
                Images are re-encoded as JPEG, so transparent areas become white. A PDF from photos has no searchable
                text and no OCR. Very large images are capped at 4000 px on the long side.
              </p>
            </div>
          </aside>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-line bg-paper-2 px-4 py-6 text-center text-sm text-ink-soft">
          Add images to build a PDF. Each image becomes one page in the order shown.
        </p>
      )}
    </div>
  );
}
