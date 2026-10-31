'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Check,
  Move,
  RotateCcw,
  ShieldCheck,
  Sliders,
  Trash2,
  ZoomIn
} from 'lucide-react';
import type {
  PhotoResizeFormat,
  PhotoResizeResult,
  PhotoResizeSettings,
  PhotoResizeUnit
} from '@/lib/types';
import {
  DEFAULT_PHOTO_RESIZE_SETTINGS,
  PHOTO_RESIZE_PRESETS,
  PHOTO_RESIZE_UNIT_LABELS,
  getPhotoResizePreset
} from '@/lib/data/photoResizer';
import { buildFilename, formatBytes } from '@/lib/utils/format';
import { downloadDataUrl } from '@/lib/utils/download';
import { loadImageFile } from '@/lib/utils/loadImage';
import {
  convertUnitValue,
  evaluateSizeTarget,
  getOutputSize,
  renderPhotoCanvas,
  resizePhotoImage,
  validateOutputSize
} from '@/lib/utils/photoResizer';
import { FileDropzone } from './tool/FileDropzone';
import { ResultActions } from './tool/ResultActions';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

const FORMAT_LABELS: Record<PhotoResizeFormat, string> = {
  jpeg: 'JPG',
  png: 'PNG',
  webp: 'WebP'
};

const FIT_LABELS = {
  fill: 'Fill (crop)',
  fit: 'Fit (white border)',
  stretch: 'Stretch'
} as const;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function PhotoResizeTool() {
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [settings, setSettings] = useState<PhotoResizeSettings>(DEFAULT_PHOTO_RESIZE_SETTINGS);
  const [result, setResult] = useState<PhotoResizeResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEncoding, setIsEncoding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const dragRef = useRef<{ x: number; y: number; offsetX: number; offsetY: number; width: number; height: number } | null>(
    null
  );

  const output = getOutputSize(settings);
  const outputError = validateOutputSize(output.width, output.height);
  const rangeError =
    settings.minKB > 0 && settings.minKB >= settings.targetKB
      ? 'The minimum KB must be lower than the maximum KB.'
      : null;
  const validationError = outputError ?? rangeError;
  const preset = getPhotoResizePreset(settings.presetId);
  const sizeTarget = result ? evaluateSizeTarget(result.bytes, settings.targetKB, settings.minKB, settings.format) : null;

  const handleFiles = async (incoming: File[]) => {
    const nextFile = incoming[0];
    if (!nextFile) return;

    setError(null);
    setIsLoading(true);
    setResult(null);

    try {
      const nextImage = await loadImageFile(nextFile);
      setFile(nextFile);
      setImage(nextImage);
      setSettings((previous) => ({ ...previous, zoom: 1, offsetX: 0, offsetY: 0 }));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'The image could not be opened.');
      setFile(null);
      setImage(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setImage(null);
    setResult(null);
    setError(null);
    setSettings(DEFAULT_PHOTO_RESIZE_SETTINGS);
  };

  const handlePresetChange = (value: string) => {
    if (value === 'custom') {
      setSettings((previous) => ({ ...previous, presetId: 'custom' }));
      return;
    }

    const nextPreset = getPhotoResizePreset(value as PhotoResizeSettings['presetId']);
    if (!nextPreset) return;

    setSettings((previous) => ({
      ...previous,
      presetId: nextPreset.id,
      width: nextPreset.width,
      height: nextPreset.height,
      unit: nextPreset.unit,
      dpi: nextPreset.dpi,
      zoom: 1,
      offsetX: 0,
      offsetY: 0
    }));
  };

  const handleUnitChange = (unit: PhotoResizeUnit) => {
    setSettings((previous) => ({
      ...previous,
      presetId: 'custom',
      unit,
      width: convertUnitValue(previous.width, previous.unit, unit, previous.dpi),
      height: convertUnitValue(previous.height, previous.unit, unit, previous.dpi)
    }));
  };

  useEffect(() => {
    if (!image || validationError) {
      setResult(null);
      setIsEncoding(false);
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setIsEncoding(true);
      try {
        const nextResult = await resizePhotoImage(image, settings);
        if (!cancelled) {
          setResult(nextResult);
          setError(null);
        }
      } catch (resizeError) {
        if (!cancelled) {
          setError(resizeError instanceof Error ? resizeError.message : 'The image could not be resized.');
        }
      } finally {
        if (!cancelled) setIsEncoding(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [image, settings, validationError]);

  useEffect(() => {
    if (!image || validationError) return;
    const target = previewCanvasRef.current;
    if (!target) return;

    try {
      const rendered = renderPhotoCanvas(image, settings, 720);
      target.width = rendered.width;
      target.height = rendered.height;
      const ctx = target.getContext('2d');
      ctx?.drawImage(rendered, 0, 0);
    } catch (previewError) {
      setError(previewError instanceof Error ? previewError.message : 'The preview could not be drawn.');
    }
  }, [image, settings, validationError]);

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (settings.fit !== 'fill') return;
    const rect = event.currentTarget.getBoundingClientRect();
    dragRef.current = {
      x: event.clientX,
      y: event.clientY,
      offsetX: settings.offsetX,
      offsetY: settings.offsetY,
      width: rect.width,
      height: rect.height
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const deltaX = (event.clientX - drag.x) / drag.width;
    const deltaY = (event.clientY - drag.y) / drag.height;
    setSettings((previous) => ({
      ...previous,
      offsetX: clamp(drag.offsetX - deltaX * 2, -1, 1),
      offsetY: clamp(drag.offsetY - deltaY * 2, -1, 1)
    }));
  };

  const handlePointerEnd = () => {
    dragRef.current = null;
  };

  const extension = settings.format === 'jpeg' ? 'jpg' : settings.format;
  const downloadName = buildFilename(
    file?.name ?? 'photo',
    `${output.width}x${output.height}_${settings.targetKB}kb`,
    extension
  );

  return (
    <div className="space-y-6">
      {!image && (
        <FileDropzone
          onFiles={handleFiles}
          accept={ACCEPTED_TYPES}
          multiple={false}
          title={isLoading ? 'Opening image...' : 'Add a photo or signature'}
          hint="Drag and drop one image here, or tap to choose. JPG, PNG, WebP and AVIF input."
          disabled={isLoading}
        />
      )}

      {error && (
        <p role="alert" className="rounded-xl border border-stamp/30 bg-stamp/5 px-4 py-3 text-sm text-stamp">
          {error}
        </p>
      )}

      {image && (
        <div className="grid gap-5 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            <section aria-labelledby="crop-title" className="rounded-2xl border border-line bg-paper-2 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
                <div className="flex items-center gap-2">
                  <Move className="h-4 w-4 text-gold" />
                  <h2 id="crop-title" className="font-display text-base font-bold text-ink">
                    Crop preview
                  </h2>
                </div>
                <span className="font-mono text-xs text-ink-soft">
                  {output.width} x {output.height} px
                </span>
              </div>

              <div className="mt-3 flex min-h-[240px] items-center justify-center overflow-hidden rounded-xl border border-line bg-paper-3 p-3">
                <canvas
                  ref={previewCanvasRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerEnd}
                  onPointerCancel={handlePointerEnd}
                  role="img"
                  aria-label="Resized image preview. Drag to reposition the crop."
                  className={`max-h-[55vh] w-auto max-w-full rounded-sm bg-white shadow-sm ${
                    settings.fit === 'fill' ? 'cursor-grab touch-none active:cursor-grabbing' : ''
                  }`}
                />
              </div>

              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="zoom" className="flex items-center gap-2 text-sm font-medium text-ink">
                    <ZoomIn className="h-4 w-4 text-doc" />
                    Zoom
                  </label>
                  <span className="font-mono text-xs text-ink-soft">{settings.zoom.toFixed(2)}x</span>
                </div>
                <input
                  id="zoom"
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  value={settings.zoom}
                  disabled={settings.fit !== 'fill'}
                  onChange={(event) =>
                    setSettings((previous) => ({ ...previous, zoom: Number(event.target.value) }))
                  }
                  className="min-h-11 w-full accent-doc disabled:opacity-50"
                />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs leading-relaxed text-ink-soft">
                    {settings.fit === 'fill'
                      ? 'Drag the preview to reposition the crop. The zoom slider tightens the crop.'
                      : 'Zoom and drag apply to Fill mode only.'}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setSettings((previous) => ({ ...previous, zoom: 1, offsetX: 0, offsetY: 0 }))
                    }
                    disabled={settings.fit !== 'fill'}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-3 hover:text-doc disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset crop
                  </button>
                </div>
              </div>
            </section>

            <section aria-labelledby="result-title" className="rounded-2xl border border-line bg-paper-2 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-doc" />
                  <h2 id="result-title" className="font-display text-base font-bold text-ink">
                    Result
                  </h2>
                </div>
                {isEncoding && <span className="font-mono text-xs text-ink-soft">Updating...</span>}
              </div>

              {validationError ? (
                <p className="mt-3 rounded-xl border border-stamp/30 bg-stamp/5 px-4 py-3 text-sm text-stamp">
                  {validationError}
                </p>
              ) : result && sizeTarget ? (
                <div className="mt-3 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <img
                      src={result.dataUrl}
                      alt="Resized result preview"
                      className="max-h-40 w-auto rounded-lg border border-line bg-white object-contain"
                    />
                    <div className="min-w-0 space-y-1 text-sm">
                      <p className="font-mono text-xs text-ink-soft">
                        {result.width} x {result.height} px
                      </p>
                      <p className="font-display text-xl font-black text-ink">{formatBytes(result.bytes)}</p>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          sizeTarget.status === 'ok'
                            ? 'bg-doc-soft text-doc'
                            : sizeTarget.status === 'ignored'
                              ? 'bg-gold-soft text-gold'
                              : 'bg-stamp/10 text-stamp'
                        }`}
                      >
                        {sizeTarget.status === 'ok'
                          ? 'Within target'
                          : sizeTarget.status === 'ignored'
                            ? 'Target ignored'
                            : sizeTarget.status === 'over'
                              ? 'Over target'
                              : 'Below minimum'}
                      </span>
                    </div>
                  </div>

                  <p
                    className={`text-xs leading-relaxed ${
                      sizeTarget.status === 'ok' || sizeTarget.status === 'ignored' ? 'text-ink-soft' : 'text-stamp'
                    }`}
                  >
                    {sizeTarget.message}
                  </p>

                  <ResultActions
                    onDownload={() => downloadDataUrl(result.dataUrl, downloadName)}
                    downloadLabel="Download image"
                    disabled={isEncoding}
                  />
                  <p className="break-all font-mono text-xs text-ink-soft">{downloadName}</p>
                </div>
              ) : (
                <p className="mt-3 text-sm text-ink-soft">The resized image will appear here.</p>
              )}
            </section>
          </div>

          <aside className="space-y-4 lg:col-span-5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-doc" />
                <h2 className="font-display text-base font-bold text-ink">Resize settings</h2>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-3 hover:text-stamp"
              >
                <Trash2 className="h-4 w-4" />
                Remove image
              </button>
            </div>

            <section className="space-y-4 rounded-2xl border border-line bg-paper-2 p-4 sm:p-5">
              <div className="space-y-2">
                <label htmlFor="preset" className="text-sm font-medium text-ink">
                  Size preset
                </label>
                <select
                  id="preset"
                  value={settings.presetId}
                  onChange={(event) => handlePresetChange(event.target.value)}
                  className="min-h-11 w-full rounded-lg border border-line bg-paper-3 px-3 text-base text-ink focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  {PHOTO_RESIZE_PRESETS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                  <option value="custom">Custom size</option>
                </select>
                <p className="text-xs leading-relaxed text-ink-soft">
                  {preset
                    ? preset.note
                    : 'Common sizes; check the exact rule on your form. Enter a custom size below.'}
                </p>
              </div>

              {settings.presetId === 'custom' ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label htmlFor="photo-width" className="text-sm font-medium text-ink">
                        Width
                      </label>
                      <input
                        id="photo-width"
                        type="number"
                        min="0"
                        step="any"
                        inputMode="decimal"
                        value={settings.width}
                        onChange={(event) =>
                          setSettings((previous) => ({
                            ...previous,
                            presetId: 'custom',
                            width: Math.max(0, Number(event.target.value) || 0)
                          }))
                        }
                        className="min-h-11 w-full rounded-lg border border-line bg-paper-3 px-3 text-base text-ink focus:outline-none focus:ring-2 focus:ring-gold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="photo-height" className="text-sm font-medium text-ink">
                        Height
                      </label>
                      <input
                        id="photo-height"
                        type="number"
                        min="0"
                        step="any"
                        inputMode="decimal"
                        value={settings.height}
                        onChange={(event) =>
                          setSettings((previous) => ({
                            ...previous,
                            presetId: 'custom',
                            height: Math.max(0, Number(event.target.value) || 0)
                          }))
                        }
                        className="min-h-11 w-full rounded-lg border border-line bg-paper-3 px-3 text-base text-ink focus:outline-none focus:ring-2 focus:ring-gold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label htmlFor="photo-unit" className="text-sm font-medium text-ink">
                        Unit
                      </label>
                      <select
                        id="photo-unit"
                        value={settings.unit}
                        onChange={(event) => handleUnitChange(event.target.value as PhotoResizeUnit)}
                        className="min-h-11 w-full rounded-lg border border-line bg-paper-3 px-3 text-base text-ink focus:outline-none focus:ring-2 focus:ring-gold"
                      >
                        {(Object.keys(PHOTO_RESIZE_UNIT_LABELS) as PhotoResizeUnit[]).map((unit) => (
                          <option key={unit} value={unit}>
                            {PHOTO_RESIZE_UNIT_LABELS[unit]}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="photo-dpi" className="text-sm font-medium text-ink">
                        DPI
                      </label>
                      <input
                        id="photo-dpi"
                        type="number"
                        min="72"
                        max="600"
                        step="1"
                        inputMode="numeric"
                        value={settings.dpi}
                        disabled={settings.unit === 'px'}
                        onChange={(event) =>
                          setSettings((previous) => ({
                            ...previous,
                            presetId: 'custom',
                            dpi: clamp(Math.round(Number(event.target.value) || 72), 72, 600)
                          }))
                        }
                        className="min-h-11 w-full rounded-lg border border-line bg-paper-3 px-3 text-base text-ink focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <p className="font-mono text-xs text-ink-soft">
                    Output: {output.width} x {output.height} px
                  </p>
                </div>
              ) : (
                <p className="font-mono text-xs text-ink-soft">
                  Output: {output.width} x {output.height} px at {settings.dpi} DPI
                </p>
              )}
            </section>

            <section className="space-y-3 rounded-2xl border border-line bg-paper-2 p-4 sm:p-5">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label htmlFor="target-kb" className="text-sm font-medium text-ink">
                    Maximum KB
                  </label>
                  <input
                    id="target-kb"
                    type="number"
                    min="1"
                    max="10240"
                    step="1"
                    inputMode="numeric"
                    value={settings.targetKB}
                    onChange={(event) =>
                      setSettings((previous) => ({
                        ...previous,
                        targetKB: clamp(Math.round(Number(event.target.value) || 1), 1, 10240)
                      }))
                    }
                    className="min-h-11 w-full rounded-lg border border-line bg-paper-3 px-3 text-base text-ink focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="min-kb" className="text-sm font-medium text-ink">
                    Minimum KB
                  </label>
                  <input
                    id="min-kb"
                    type="number"
                    min="0"
                    max="10240"
                    step="1"
                    inputMode="numeric"
                    value={settings.minKB}
                    onChange={(event) =>
                      setSettings((previous) => ({
                        ...previous,
                        minKB: clamp(Math.round(Number(event.target.value) || 0), 0, 10240)
                      }))
                    }
                    className="min-h-11 w-full rounded-lg border border-line bg-paper-3 px-3 text-base text-ink focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>
              <p className="text-xs leading-relaxed text-ink-soft">
                Set minimum to 0 to skip it. The tool never pads the file to reach a minimum.
              </p>

              <fieldset className="space-y-2">
                <legend className="text-sm font-medium text-ink">Output format</legend>
                <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-line bg-paper-3 p-1">
                  {(Object.keys(FORMAT_LABELS) as PhotoResizeFormat[]).map((format) => (
                    <button
                      key={format}
                      type="button"
                      onClick={() => setSettings((previous) => ({ ...previous, format }))}
                      aria-pressed={settings.format === format}
                      className={`min-h-11 rounded-lg text-sm font-bold uppercase transition-colors ${
                        settings.format === format
                          ? 'bg-doc text-white'
                          : 'text-ink-soft hover:bg-paper-2 hover:text-ink'
                      }`}
                    >
                      {FORMAT_LABELS[format]}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="space-y-2">
                <legend className="text-sm font-medium text-ink">Fit mode</legend>
                <div className="grid grid-cols-3 gap-1.5">
                  {(Object.keys(FIT_LABELS) as PhotoResizeSettings['fit'][]).map((fit) => (
                    <button
                      key={fit}
                      type="button"
                      onClick={() => setSettings((previous) => ({ ...previous, fit }))}
                      aria-pressed={settings.fit === fit}
                      className={`min-h-11 rounded-lg border px-2 text-xs font-semibold transition-colors ${
                        settings.fit === fit
                          ? 'border-doc bg-doc-soft text-doc'
                          : 'border-line bg-paper-3 text-ink-soft hover:bg-paper-2 hover:text-ink'
                      }`}
                    >
                      {FIT_LABELS[fit]}
                    </button>
                  ))}
                </div>
                {settings.fit === 'stretch' && (
                  <p className="text-xs leading-relaxed text-stamp">
                    Stretch changes the aspect ratio and can distort faces or signatures.
                  </p>
                )}
              </fieldset>

              <div className="flex items-start gap-2 rounded-xl border border-line bg-paper-3 p-3 text-xs leading-relaxed text-ink-soft">
                <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-doc" />
                <span>Your image is read and resized in this browser. It is not uploaded.</span>
              </div>
            </section>

            <section className="space-y-4 rounded-2xl border border-line bg-paper-2 p-4 sm:p-5">
              <label className="flex min-h-11 items-center gap-3 text-sm font-medium text-ink">
                <input
                  type="checkbox"
                  checked={settings.addLabel}
                  onChange={(event) =>
                    setSettings((previous) => ({ ...previous, addLabel: event.target.checked }))
                  }
                  className="h-5 w-5 rounded border-line accent-doc"
                />
                Add a name and date strip
              </label>

              {settings.addLabel && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label htmlFor="label-name" className="text-sm font-medium text-ink">
                      Name
                    </label>
                    <input
                      id="label-name"
                      type="text"
                      value={settings.labelName}
                      onChange={(event) =>
                        setSettings((previous) => ({ ...previous, labelName: event.target.value }))
                      }
                      placeholder="Name on the form"
                      className="min-h-11 w-full rounded-lg border border-line bg-paper-3 px-3 text-base text-ink focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="label-date" className="text-sm font-medium text-ink">
                      Date
                    </label>
                    <input
                      id="label-date"
                      type="text"
                      value={settings.labelDate}
                      onChange={(event) =>
                        setSettings((previous) => ({ ...previous, labelDate: event.target.value }))
                      }
                      placeholder="Date"
                      className="min-h-11 w-full rounded-lg border border-line bg-paper-3 px-3 text-base text-ink focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="strip-height" className="flex items-center justify-between text-sm font-medium text-ink">
                      <span>Strip height</span>
                      <span className="font-mono text-xs text-ink-soft">{settings.labelStripPercent}%</span>
                    </label>
                    <input
                      id="strip-height"
                      type="range"
                      min="10"
                      max="30"
                      step="1"
                      value={settings.labelStripPercent}
                      onChange={(event) =>
                        setSettings((previous) => ({
                          ...previous,
                          labelStripPercent: Number(event.target.value)
                        }))
                      }
                      className="min-h-11 w-full accent-doc"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="strip-font" className="flex items-center justify-between text-sm font-medium text-ink">
                      <span>Text size</span>
                      <span className="font-mono text-xs text-ink-soft">{settings.labelFontPercent}%</span>
                    </label>
                    <input
                      id="strip-font"
                      type="range"
                      min="30"
                      max="70"
                      step="1"
                      value={settings.labelFontPercent}
                      onChange={(event) =>
                        setSettings((previous) => ({
                          ...previous,
                          labelFontPercent: Number(event.target.value)
                        }))
                      }
                      className="min-h-11 w-full accent-doc"
                    />
                  </div>
                </div>
              )}
            </section>

            <div className="rounded-2xl border border-line bg-paper-3 p-4 text-xs leading-relaxed text-ink-soft">
              <p className="font-semibold text-ink">Limits</p>
              <p className="mt-1">
                The exported file keeps the pixel size but does not store DPI metadata. Upload forms check pixels and
                file size; printing at a physical size depends on your print app.
              </p>
              <p className="mt-2">
                Transparent areas become white. The tool does not remove a background, so use a signature photo with a
                plain white background.
              </p>
            </div>
          </aside>
        </div>
      )}

      {!image && !error && (
        <p className="rounded-xl border border-dashed border-line bg-paper-2 px-4 py-6 text-center text-sm text-ink-soft">
          Add an image to see the crop preview and size result.
        </p>
      )}
    </div>
  );
}
