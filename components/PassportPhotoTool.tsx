'use client';

import { useEffect, useRef, useState } from 'react';
import { FileText, Image as ImageIcon, ShieldCheck, Sliders, Trash2, ZoomIn } from 'lucide-react';
import type { PassportPhotoPresetId, PassportSheetSettings } from '@/lib/types';
import {
  DEFAULT_PASSPORT_SETTINGS,
  PASSPORT_PAPERS,
  PASSPORT_PHOTO_PRESETS,
  getPassportPhotoPreset
} from '@/lib/data/passportSheet';
import { loadImageFile } from '@/lib/utils/loadImage';
import { downloadBlob } from '@/lib/utils/download';
import { printSheetMm } from '@/lib/utils/printSheet';
import {
  createPassportPdf,
  getPassportGrid,
  renderPassportSheet,
  renderPassportWithFallback,
  resolveCopies
} from '@/lib/utils/passportSheet';
import { FileDropzone } from './tool/FileDropzone';
import { ResultActions } from './tool/ResultActions';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const PREVIEW_DPI = 150;

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('The sheet could not be encoded on this device.'))),
      type,
      quality
    );
  });
}

export function PassportPhotoTool() {
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [settings, setSettings] = useState<PassportSheetSettings>(DEFAULT_PASSPORT_SETTINGS);
  const [isLoading, setIsLoading] = useState(false);
  const [exporting, setExporting] = useState<'png' | 'pdf' | 'print' | null>(null);
  const [fallbackDpi, setFallbackDpi] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const paper = PASSPORT_PAPERS[settings.paperSize];
  const grid = getPassportGrid(settings);
  const copies = resolveCopies(settings, grid.capacity);

  const handleFiles = async (incoming: File[]) => {
    const nextFile = incoming[0];
    if (!nextFile) return;

    setIsLoading(true);
    setError(null);
    setFallbackDpi(null);

    try {
      const nextImage = await loadImageFile(nextFile);
      setFile(nextFile);
      setImage(nextImage);
      setSettings((previous) => ({ ...previous, zoom: 1 }));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'The photo could not be opened.');
      setFile(null);
      setImage(null);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setImage(null);
    setSettings(DEFAULT_PASSPORT_SETTINGS);
    setError(null);
    setFallbackDpi(null);
    setExporting(null);
  };

  useEffect(() => {
    if (!image) return;
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    try {
      const rendered = renderPassportSheet(image, settings, PREVIEW_DPI);
      canvas.width = rendered.canvas.width;
      canvas.height = rendered.canvas.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(rendered.canvas, 0, 0);
      setError(null);
    } catch (renderError) {
      setError(renderError instanceof Error ? renderError.message : 'The sheet preview could not be drawn.');
    }
  }, [image, settings]);

  const exportSheet = (mode: 'png' | 'pdf' | 'print') => {
    if (!image) return;

    setExporting(mode);
    setError(null);

    window.setTimeout(async () => {
      try {
        const rendered = renderPassportWithFallback(image, settings);
        setFallbackDpi(rendered.dpi < 300 ? rendered.dpi : null);

        if (mode === 'png') {
          const blob = await canvasToBlob(rendered.canvas, 'image/png');
          downloadBlob(blob, 'passport-photo-sheet.png');
        } else if (mode === 'pdf') {
          const dataUrl = rendered.canvas.toDataURL('image/jpeg', 0.92);
          const blob = await createPassportPdf(dataUrl, paper.widthMm, paper.heightMm);
          downloadBlob(blob, 'passport-photo-sheet.pdf');
        } else {
          const dataUrl = rendered.canvas.toDataURL('image/jpeg', 0.95);
          const opened = printSheetMm(
            dataUrl,
            paper.widthMm,
            paper.heightMm,
            1,
            'Passport photo sheet - Zaibi Tools'
          );
          if (!opened) {
            setError('Your browser blocked the print window. Allow pop-ups and try again.');
          }
        }
      } catch (exportError) {
        setError(exportError instanceof Error ? exportError.message : 'The sheet could not be exported.');
      } finally {
        setExporting(null);
      }
    }, 20);
  };

  const handlePresetChange = (value: string) => {
    if (value === 'custom') {
      setSettings((previous) => ({ ...previous, photoPresetId: 'custom' }));
      return;
    }
    const preset = getPassportPhotoPreset(value as PassportPhotoPresetId);
    if (!preset) return;
    setSettings((previous) => ({
      ...previous,
      photoPresetId: preset.id,
      photoWidthMm: preset.widthMm,
      photoHeightMm: preset.heightMm
    }));
  };


  return (
    <div className="space-y-6">
      {!image && (
        <FileDropzone
          onFiles={handleFiles}
          accept={ACCEPTED_TYPES}
          multiple={false}
          title={isLoading ? 'Opening photo...' : 'Add a passport photo'}
          hint="Drag and drop one photo here, or tap to choose. Use a photo with a plain background and the face centred."
          disabled={isLoading}
        />
      )}

      {error && (
        <p role="alert" className="rounded-xl border border-stamp/30 bg-stamp/5 px-4 py-3 text-sm text-stamp">
          {error}
        </p>
      )}

      {image ? (
        <div className="grid gap-5 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            <section aria-labelledby="sheet-preview-title" className="rounded-2xl border border-line bg-paper-2 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-doc" />
                  <h2 id="sheet-preview-title" className="font-display text-base font-bold text-ink">
                    Sheet preview
                  </h2>
                </div>
                <span className="font-mono text-xs text-ink-soft">
                  {paper.label} · {copies} {copies === 1 ? 'photo' : 'photos'}
                </span>
              </div>

              <div className="mt-3 flex min-h-[240px] items-center justify-center overflow-hidden rounded-xl border border-line bg-paper-3 p-3">
                <canvas
                  ref={previewCanvasRef}
                  role="img"
                  aria-label={`Preview of ${copies} passport photos on ${paper.label}`}
                  className="max-h-[60vh] w-auto max-w-full rounded-sm bg-white shadow-sm"
                />
              </div>

              <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                Preview at {PREVIEW_DPI} DPI. The download and print versions are rendered at 300 DPI, or 200 DPI if the
                larger canvas fails on this device.
              </p>
            </section>
          </div>

          <aside className="space-y-4 lg:col-span-5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-doc" />
                <h2 className="font-display text-base font-bold text-ink">Sheet settings</h2>
              </div>
              <button
                type="button"
                onClick={reset}
                disabled={exporting !== null}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-3 hover:text-stamp disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            </div>

            <section className="space-y-4 rounded-2xl border border-line bg-paper-2 p-4 sm:p-5">
              <div className="space-y-1">
                <label htmlFor="photo-preset" className="text-sm font-medium text-ink">
                  Photo size
                </label>
                <select
                  id="photo-preset"
                  value={settings.photoPresetId}
                  onChange={(event) => handlePresetChange(event.target.value)}
                  className="min-h-11 w-full rounded-lg border border-line bg-paper-3 px-3 text-base text-ink focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  {PASSPORT_PHOTO_PRESETS.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.label}
                    </option>
                  ))}
                  <option value="custom">Custom size</option>
                </select>
              </div>

              {settings.photoPresetId === 'custom' ? (
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label htmlFor="photo-width-mm" className="text-sm font-medium text-ink">
                      Width (mm)
                    </label>
                    <input
                      id="photo-width-mm"
                      type="number"
                      min="5"
                      max="100"
                      step="0.1"
                      inputMode="decimal"
                      value={settings.photoWidthMm}
                      onChange={(event) =>
                        setSettings((previous) => ({
                          ...previous,
                          photoPresetId: 'custom',
                          photoWidthMm: Math.max(0, Number(event.target.value) || 0)
                        }))
                      }
                      className="min-h-11 w-full rounded-lg border border-line bg-paper-3 px-3 text-base text-ink focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="photo-height-mm" className="text-sm font-medium text-ink">
                      Height (mm)
                    </label>
                    <input
                      id="photo-height-mm"
                      type="number"
                      min="5"
                      max="100"
                      step="0.1"
                      inputMode="decimal"
                      value={settings.photoHeightMm}
                      onChange={(event) =>
                        setSettings((previous) => ({
                          ...previous,
                          photoPresetId: 'custom',
                          photoHeightMm: Math.max(0, Number(event.target.value) || 0)
                        }))
                      }
                      className="min-h-11 w-full rounded-lg border border-line bg-paper-3 px-3 text-base text-ink focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-xs leading-relaxed text-ink-soft">
                  {getPassportPhotoPreset(settings.photoPresetId)?.note}
                </p>
              )}

              <div className="space-y-1">
                <label htmlFor="paper-size" className="text-sm font-medium text-ink">
                  Paper
                </label>
                <select
                  id="paper-size"
                  value={settings.paperSize}
                  onChange={(event) =>
                    setSettings((previous) => ({
                      ...previous,
                      paperSize: event.target.value as PassportSheetSettings['paperSize']
                    }))
                  }
                  className="min-h-11 w-full rounded-lg border border-line bg-paper-3 px-3 text-base text-ink focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  {(Object.keys(PASSPORT_PAPERS) as PassportSheetSettings['paperSize'][]).map((size) => (
                    <option key={size} value={size}>
                      {PASSPORT_PAPERS[size].label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="copies-mode" className="text-sm font-medium text-ink">
                  Copies
                </label>
                <select
                  id="copies-mode"
                  value={settings.copiesMode}
                  onChange={(event) =>
                    setSettings((previous) => ({
                      ...previous,
                      copiesMode: event.target.value as PassportSheetSettings['copiesMode']
                    }))
                  }
                  className="min-h-11 w-full rounded-lg border border-line bg-paper-3 px-3 text-base text-ink focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <option value="auto">Fill the sheet ({grid.capacity})</option>
                  <option value="custom">Choose a number</option>
                </select>
                {settings.copiesMode === 'custom' && (
                  <input
                    type="number"
                    min="1"
                    max={Math.max(1, grid.capacity)}
                    step="1"
                    inputMode="numeric"
                    value={settings.copies}
                    onChange={(event) =>
                      setSettings((previous) => ({
                        ...previous,
                        copies: Math.max(1, Math.round(Number(event.target.value) || 1))
                      }))
                    }
                    aria-label="Number of copies"
                    className="mt-2 min-h-11 w-full rounded-lg border border-line bg-paper-3 px-3 text-base text-ink focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                )}
                <p className="text-xs leading-relaxed text-ink-soft">
                  {grid.capacity > 0
                    ? `Fits ${grid.capacity} photos in ${grid.rows} row${grid.rows === 1 ? '' : 's'} of ${grid.columns}.`
                    : 'This photo does not fit with the current paper, gap and margin.'}
                </p>
              </div>

              <div className="space-y-1">
                <label htmlFor="sheet-gap" className="flex items-center justify-between text-sm font-medium text-ink">
                  <span>Gap between photos</span>
                  <span className="font-mono text-xs text-ink-soft">{settings.gapMm} mm</span>
                </label>
                <input
                  id="sheet-gap"
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={settings.gapMm}
                  onChange={(event) =>
                    setSettings((previous) => ({ ...previous, gapMm: Number(event.target.value) }))
                  }
                  className="min-h-11 w-full accent-doc"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="sheet-margin" className="flex items-center justify-between text-sm font-medium text-ink">
                  <span>Page margin</span>
                  <span className="font-mono text-xs text-ink-soft">{settings.marginMm} mm</span>
                </label>
                <input
                  id="sheet-margin"
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={settings.marginMm}
                  onChange={(event) =>
                    setSettings((previous) => ({ ...previous, marginMm: Number(event.target.value) }))
                  }
                  className="min-h-11 w-full accent-doc"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="sheet-zoom" className="flex items-center justify-between text-sm font-medium text-ink">
                  <span className="flex items-center gap-2">
                    <ZoomIn className="h-4 w-4 text-doc" />
                    Photo zoom
                  </span>
                  <span className="font-mono text-xs text-ink-soft">{settings.zoom.toFixed(2)}x</span>
                </label>
                <input
                  id="sheet-zoom"
                  type="range"
                  min="1"
                  max="2"
                  step="0.05"
                  value={settings.zoom}
                  onChange={(event) =>
                    setSettings((previous) => ({ ...previous, zoom: Number(event.target.value) }))
                  }
                  className="min-h-11 w-full accent-doc"
                />
                <p className="text-xs leading-relaxed text-ink-soft">
                  The photo is centre-cropped to fill the frame. Zoom in for a tighter crop.
                </p>
              </div>

              <label className="flex min-h-11 items-center gap-3 text-sm font-medium text-ink">
                <input
                  type="checkbox"
                  checked={settings.cutLines}
                  onChange={(event) =>
                    setSettings((previous) => ({ ...previous, cutLines: event.target.checked }))
                  }
                  className="h-5 w-5 rounded border-line accent-doc"
                />
                Add thin cut lines
              </label>
            </section>

            <section className="space-y-3 rounded-2xl border border-line bg-paper-2 p-4 sm:p-5">
              <ResultActions
                onDownload={() => exportSheet('png')}
                downloadLabel="Download PNG"
                onPrint={() => exportSheet('print')}
                printLabel="Print sheet"
                disabled={exporting !== null || copies === 0}
              >
                <button
                  type="button"
                  onClick={() => exportSheet('pdf')}
                  disabled={exporting !== null || copies === 0}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-line bg-paper-2 px-5 text-base font-semibold text-ink transition-colors hover:bg-paper-3 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FileText className="h-4 w-4" />
                  Download PDF
                </button>
              </ResultActions>

              <p className="text-xs leading-relaxed text-ink-soft">
                Print at 100% scale or actual size. The PDF page matches {paper.label}. PNG and PDF exports use{' '}
                {fallbackDpi ? `${fallbackDpi} DPI because the 300 DPI canvas failed` : '300 DPI'}.
              </p>

              <div className="flex items-start gap-2 rounded-xl border border-line bg-paper-3 p-3 text-xs leading-relaxed text-ink-soft">
                <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-doc" />
                <span>Your photo is read and arranged in this browser. It is not uploaded.</span>
              </div>
            </section>

            <div className="rounded-2xl border border-line bg-paper-3 p-4 text-xs leading-relaxed text-ink-soft">
              <p className="font-semibold text-ink">Limits</p>
              <p className="mt-1">
                The tool does not remove or replace the background. Use a plain, light background and keep the head
                centred. It does not straighten a tilted photo. Print at 100% and measure one photo before printing a
                full sheet.
              </p>
            </div>
          </aside>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-line bg-paper-2 px-4 py-6 text-center text-sm text-ink-soft">
          Add a photo to see how many copies fit on the sheet.
        </p>
      )}
    </div>
  );
}
