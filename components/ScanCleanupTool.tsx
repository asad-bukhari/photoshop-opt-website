'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, CheckCircle2, RotateCw, ScanLine, ShieldCheck, Trash2 } from 'lucide-react';
import type { ScanFilterMode, ScanPageSettings, ScanPdfResult, ScanRotation } from '@/lib/types';
import { formatBytes } from '@/lib/utils/format';
import { downloadBlob } from '@/lib/utils/download';
import { loadImageFile } from '@/lib/utils/loadImage';
import { createObjectUrl, revokeObjectUrl, revokeObjectUrls } from '@/lib/utils/objectUrls';
import { buildScanPdf, DEFAULT_SCAN_SETTINGS, renderScanPage } from '@/lib/utils/scanPdf';
import { FileDropzone } from './tool/FileDropzone';
import { ResultActions } from './tool/ResultActions';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const PREVIEW_DPI = 120;

const FILTER_LABELS: Record<ScanFilterMode, string> = {
  original: 'Original',
  grayscale: 'Grayscale',
  bw: 'B&W scan',
  brighten: 'Brighten'
};

interface ScanItem {
  id: string;
  file: File;
  previewUrl: string;
  settings: ScanPageSettings;
}

export function ScanCleanupTool() {
  const [items, setItems] = useState<ScanItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<HTMLImageElement | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [result, setResult] = useState<ScanPdfResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const urlsRef = useRef<Set<string>>(new Set());

  const selected = items.find((item) => item.id === selectedId) ?? items[0] ?? null;

  useEffect(() => {
    const urls = urlsRef.current;
    return () => {
      revokeObjectUrls(urls);
      urls.clear();
    };
  }, []);

  useEffect(() => {
    if (!selected) {
      setPreviewImage(null);
      return;
    }

    let cancelled = false;
    setPreviewImage(null);
    loadImageFile(selected.file)
      .then((image) => {
        if (!cancelled) setPreviewImage(image);
      })
      .catch((loadError) => {
        if (!cancelled) {
          setPreviewImage(null);
          setError(loadError instanceof Error ? loadError.message : 'The document photo could not be opened.');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selected?.file]);

  useEffect(() => {
    if (!previewImage || !selected) return;
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    const timer = window.setTimeout(() => {
      try {
        const rendered = renderScanPage(previewImage, selected.settings, PREVIEW_DPI);
        canvas.width = rendered.width;
        canvas.height = rendered.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(rendered, 0, 0);
        setError(null);
      } catch (renderError) {
        setError(renderError instanceof Error ? renderError.message : 'The preview could not be drawn.');
      }
    }, 180);

    return () => window.clearTimeout(timer);
  }, [previewImage, selected]);

  const markDirty = () => setResult(null);

  const handleFiles = (incoming: File[]) => {
    if (incoming.length === 0) return;

    const nextItems = incoming.map((file) => {
      const previewUrl = createObjectUrl(file);
      urlsRef.current.add(previewUrl);
      return {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        file,
        previewUrl,
        settings: {
          ...DEFAULT_SCAN_SETTINGS,
          crop: { ...DEFAULT_SCAN_SETTINGS.crop }
        }
      };
    });

    setItems((previous) => [...previous, ...nextItems]);
    setSelectedId((previous) => previous ?? nextItems[0].id);
    setError(null);
    markDirty();
  };

  const removeItem = (item: ScanItem) => {
    revokeObjectUrl(item.previewUrl);
    urlsRef.current.delete(item.previewUrl);
    const next = items.filter((entry) => entry.id !== item.id);
    setItems(next);
    if (selectedId === item.id || selected?.id === item.id) {
      setSelectedId(next[0]?.id ?? null);
    }
    setPreviewImage(null);
    markDirty();
  };

  const clearAll = () => {
    revokeObjectUrls(urlsRef.current);
    urlsRef.current.clear();
    setItems([]);
    setSelectedId(null);
    setPreviewImage(null);
    setResult(null);
    setError(null);
    setProgress(null);
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

  const updateSettings = (patch: Partial<ScanPageSettings>) => {
    if (!selected) return;
    setItems((previous) =>
      previous.map((item) =>
        item.id === selected.id ? { ...item, settings: { ...item.settings, ...patch } } : item
      )
    );
    markDirty();
  };

  const updateCrop = (side: 'left' | 'right' | 'top' | 'bottom', value: number) => {
    if (!selected) return;
    setItems((previous) =>
      previous.map((item) =>
        item.id === selected.id
          ? {
              ...item,
              settings: {
                ...item.settings,
                crop: { ...item.settings.crop, [side]: value }
              }
            }
          : item
      )
    );
    markDirty();
  };

  const handleBuild = async () => {
    if (items.length === 0 || isBuilding) return;

    setIsBuilding(true);
    setError(null);
    setResult(null);
    setProgress({ done: 0, total: items.length });

    try {
      const built = await buildScanPdf(
        items.map((item) => ({ file: item.file, settings: item.settings })),
        (done, total) => setProgress({ done, total })
      );
      setResult(built);
    } catch (buildError) {
      setError(buildError instanceof Error ? buildError.message : 'The scanned PDF could not be created.');
    } finally {
      setIsBuilding(false);
      setProgress(null);
    }
  };

  const downloadResult = () => {
    if (result) downloadBlob(result.blob, 'scanned-document.pdf');
  };

  return (
    <div className="space-y-6">
      <FileDropzone
        onFiles={handleFiles}
        accept={ACCEPTED_TYPES}
        multiple
        title="Add document photos"
        hint="Drag and drop one or more JPG, PNG, WebP or AVIF photos, or tap to choose. Each photo becomes one A4 page."
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
            <section aria-labelledby="scan-preview-title" className="rounded-2xl border border-line bg-paper-2 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
                <div className="flex items-center gap-2">
                  <ScanLine className="h-4 w-4 text-doc" />
                  <h2 id="scan-preview-title" className="font-display text-base font-bold text-ink">
                    Page preview
                  </h2>
                </div>
                {selected && (
                  <span className="font-mono text-xs text-ink-soft">
                    Page {items.findIndex((item) => item.id === selected.id) + 1} of {items.length}
                  </span>
                )}
              </div>

              <div className="mt-3 flex min-h-[260px] items-center justify-center overflow-hidden rounded-xl border border-line bg-paper-3 p-3">
                {previewImage ? (
                  <canvas
                    ref={previewCanvasRef}
                    role="img"
                    aria-label="Preview of the selected document page"
                    className="max-h-[60vh] w-auto max-w-full rounded-sm bg-white shadow-sm"
                  />
                ) : (
                  <p className="text-sm text-ink-soft">Opening the selected photo...</p>
                )}
              </div>

              <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                Preview at {PREVIEW_DPI} DPI. The PDF is rendered at 150 DPI on A4 pages. Crop with the sliders if the
                document does not fill the frame.
              </p>
            </section>

            <section aria-labelledby="scan-pages-title" className="rounded-2xl border border-line bg-paper-2 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
                <h2 id="scan-pages-title" className="font-display text-base font-bold text-ink">
                  Document pages ({items.length})
                </h2>
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

              <ol className="mt-3 space-y-2">
                {items.map((item, index) => (
                  <li
                    key={item.id}
                    className={`flex flex-wrap items-center gap-3 rounded-xl border p-3 transition-colors ${
                      selected?.id === item.id ? 'border-doc bg-doc-soft' : 'border-line bg-paper-3/50'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId(item.id);
                        setResult(null);
                      }}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    >
                      <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-white">
                        <img
                          src={item.previewUrl}
                          alt={`Document page ${index + 1}`}
                          className="max-h-full max-w-full object-contain"
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-ink">{item.file.name}</span>
                        <span className="mt-0.5 block font-mono text-xs text-ink-soft">
                          Page {index + 1} · {FILTER_LABELS[item.settings.filter]}
                        </span>
                      </span>
                    </button>
                    <span className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setItems((previous) =>
                            previous.map((entry) =>
                              entry.id === item.id
                                ? {
                                    ...entry,
                                    settings: {
                                      ...entry.settings,
                                      rotation: ((entry.settings.rotation + 90) % 360) as ScanRotation
                                    }
                                  }
                                : entry
                            )
                          );
                          markDirty();
                        }}
                        disabled={isBuilding}
                        aria-label={`Rotate page ${index + 1} 90 degrees`}
                        className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-paper-2 hover:text-doc disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <RotateCw className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem(item.id, -1)}
                        disabled={index === 0 || isBuilding}
                        aria-label={`Move page ${index + 1} up`}
                        className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-paper-2 hover:text-doc disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem(item.id, 1)}
                        disabled={index === items.length - 1 || isBuilding}
                        aria-label={`Move page ${index + 1} down`}
                        className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-paper-2 hover:text-doc disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item)}
                        disabled={isBuilding}
                        aria-label={`Remove page ${index + 1}`}
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
              <h2 className="font-display text-base font-bold text-ink">Clean up this page</h2>

              <fieldset className="space-y-2">
                <legend className="text-sm font-medium text-ink">Filter</legend>
                <div className="grid grid-cols-2 gap-1.5">
                  {(Object.keys(FILTER_LABELS) as ScanFilterMode[]).map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => updateSettings({ filter })}
                      aria-pressed={selected?.settings.filter === filter}
                      className={`min-h-11 rounded-lg border px-2 text-xs font-semibold transition-colors ${
                        selected?.settings.filter === filter
                          ? 'border-doc bg-doc-soft text-doc'
                          : 'border-line bg-paper-3 text-ink-soft hover:bg-paper-2 hover:text-ink'
                      }`}
                    >
                      {FILTER_LABELS[filter]}
                    </button>
                  ))}
                </div>
              </fieldset>

              <button
                type="button"
                onClick={() =>
                  selected &&
                  setItems((previous) =>
                    previous.map((item) =>
                      item.id === selected.id
                        ? {
                            ...item,
                            settings: {
                              ...item.settings,
                              rotation: ((item.settings.rotation + 90) % 360) as ScanRotation
                            }
                          }
                        : item
                    )
                  )
                }
                disabled={!selected || isBuilding}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line bg-paper-3 px-3 text-sm font-semibold text-ink transition-colors hover:bg-paper-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RotateCw className="h-4 w-4" />
                Rotate 90°
              </button>

              <div className="space-y-3">
                <p className="text-sm font-medium text-ink">Crop</p>
                {(['left', 'right', 'top', 'bottom'] as const).map((side) => (
                  <div key={side} className="space-y-1">
                    <label htmlFor={`crop-${side}`} className="flex items-center justify-between text-xs font-medium capitalize text-ink-soft">
                      <span>{side}</span>
                      <span className="font-mono">{selected?.settings.crop[side] ?? 0}%</span>
                    </label>
                    <input
                      id={`crop-${side}`}
                      type="range"
                      min="0"
                      max="40"
                      step="1"
                      value={selected?.settings.crop[side] ?? 0}
                      onChange={(event) => updateCrop(side, Number(event.target.value))}
                      className="min-h-11 w-full accent-doc"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    updateSettings({ crop: { left: 0, right: 0, top: 0, bottom: 0 } })
                  }
                  disabled={!selected || isBuilding}
                  className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-3 hover:text-doc disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Reset crop
                </button>
              </div>
            </section>

            <section className="space-y-3 rounded-2xl border border-line bg-paper-2 p-4 sm:p-5">
              <button
                type="button"
                onClick={handleBuild}
                disabled={isBuilding || items.length === 0}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-doc px-4 text-base font-semibold text-white transition-colors hover:bg-doc-bright disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isBuilding ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {progress ? `Cleaning ${progress.done} of ${progress.total}...` : 'Building PDF...'}
                  </>
                ) : (
                  <>
                    <ScanLine className="h-4 w-4" />
                    Create scanned PDF
                  </>
                )}
              </button>

              <p role="status" className="sr-only">
                {isBuilding && progress ? `Processing page ${progress.done} of ${progress.total}` : ''}
              </p>

              {result && (
                <div className="space-y-3 rounded-xl border border-doc/20 bg-doc-soft p-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <CheckCircle2 className="h-4 w-4 text-doc" />
                    Scanned PDF ready
                  </div>
                  <p className="font-mono text-xs text-ink-soft">
                    {result.pageCount} {result.pageCount === 1 ? 'page' : 'pages'} · {formatBytes(result.bytes)}
                  </p>
                  <ResultActions onDownload={downloadResult} downloadLabel="Download PDF" />
                </div>
              )}

              <div className="flex items-start gap-2 rounded-xl border border-line bg-paper-3 p-3 text-xs leading-relaxed text-ink-soft">
                <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-doc" />
                <span>Your photos are read and cleaned in this browser. They are not uploaded.</span>
              </div>
            </section>

            <div className="rounded-2xl border border-line bg-paper-3 p-4 text-xs leading-relaxed text-ink-soft">
              <p className="font-semibold text-ink">Limits</p>
              <p className="mt-1">
                There is no automatic edge detection, perspective correction or deskew. Crop and rotate each page by
                hand before exporting. The PDF has A4 image pages, no searchable text and no OCR.
              </p>
            </div>
          </aside>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-line bg-paper-2 px-4 py-6 text-center text-sm text-ink-soft">
          Add document photos to crop, rotate and filter them into one PDF.
        </p>
      )}
    </div>
  );
}
