'use client';

import { useEffect, useRef, useState } from 'react';
import { Crop, RotateCcw, RotateCw, ShieldCheck, Trash2 } from 'lucide-react';
import type { CropPercent, ImageConvertFormat, ImageRotation } from '@/lib/types';
import { loadImageFile } from '@/lib/utils/loadImage';
import { buildFilename, formatBytes } from '@/lib/utils/format';
import { downloadBlob } from '@/lib/utils/download';
import { clampQuality, getConvertExtension } from '@/lib/utils/imageConvert';
import { exportCropRotate, renderCropRotate } from '@/lib/utils/cropRotate';
import { FileDropzone } from './tool/FileDropzone';
import { ResultActions } from './tool/ResultActions';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const PREVIEW_MAX_PX = 900;
const DEFAULT_CROP: CropPercent = { left: 0, right: 0, top: 0, bottom: 0 };

const FORMAT_LABELS: Record<ImageConvertFormat, string> = {
  jpeg: 'JPG',
  png: 'PNG',
  webp: 'WebP'
};

interface CropResult {
  blob: Blob;
  width: number;
  height: number;
}

export function CropRotateTool() {
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<CropPercent>(DEFAULT_CROP);
  const [rotation, setRotation] = useState<ImageRotation>(0);
  const [format, setFormat] = useState<ImageConvertFormat>('jpeg');
  const [quality, setQuality] = useState(0.9);
  const [result, setResult] = useState<CropResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEncoding, setIsEncoding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleFiles = async (incoming: File[]) => {
    const nextFile = incoming[0];
    if (!nextFile) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setCrop(DEFAULT_CROP);
    setRotation(0);

    try {
      const nextImage = await loadImageFile(nextFile);
      setFile(nextFile);
      setImage(nextImage);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'The image could not be opened.');
      setFile(null);
      setImage(null);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setImage(null);
    setCrop(DEFAULT_CROP);
    setRotation(0);
    setFormat('jpeg');
    setQuality(0.9);
    setResult(null);
    setError(null);
  };

  useEffect(() => {
    if (!image) return;
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    const timer = window.setTimeout(() => {
      try {
        const rendered = renderCropRotate(image, crop, rotation, PREVIEW_MAX_PX);
        canvas.width = rendered.width;
        canvas.height = rendered.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(rendered, 0, 0);
        setError(null);
      } catch (previewError) {
        setError(previewError instanceof Error ? previewError.message : 'The preview could not be drawn.');
      }
    }, 120);

    return () => window.clearTimeout(timer);
  }, [image, crop, rotation]);

  useEffect(() => {
    if (!image) {
      setResult(null);
      setIsEncoding(false);
      return;
    }

    let cancelled = false;
    setIsEncoding(true);
    const timer = window.setTimeout(async () => {
      try {
        const exported = await exportCropRotate(image, crop, rotation, format, quality);
        if (!cancelled) {
          setResult(exported);
          setError(null);
        }
      } catch (encodeError) {
        if (!cancelled) {
          setError(encodeError instanceof Error ? encodeError.message : 'The image could not be exported.');
        }
      } finally {
        if (!cancelled) setIsEncoding(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [image, crop, rotation, format, quality]);

  const updateCrop = (side: keyof CropPercent, value: number) => {
    setCrop((previous) => ({ ...previous, [side]: value }));
  };

  const downloadName = file
    ? buildFilename(file.name, 'cropped', getConvertExtension(format))
    : `cropped.${getConvertExtension(format)}`;

  return (
    <div className="space-y-6">
      {!file && (
        <FileDropzone
          onFiles={handleFiles}
          accept={ACCEPTED_TYPES}
          multiple={false}
          title={isLoading ? 'Opening image...' : 'Add an image'}
          hint="Drag and drop one JPG, PNG, WebP or AVIF image, or tap to choose."
          disabled={isLoading}
        />
      )}

      {error && (
        <p role="alert" className="rounded-xl border border-stamp/30 bg-stamp/5 px-4 py-3 text-sm text-stamp">
          {error}
        </p>
      )}

      {file && image ? (
        <div className="grid gap-5 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            <section className="rounded-2xl border border-line bg-paper-2 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
                <div className="flex items-center gap-2">
                  <Crop className="h-4 w-4 text-doc" />
                  <h2 className="font-display text-base font-bold text-ink">Crop and rotate preview</h2>
                </div>
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-3 hover:text-stamp"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>

              <div className="mt-3 flex min-h-[260px] items-center justify-center overflow-hidden rounded-xl border border-line bg-paper-3 p-3">
                <canvas
                  ref={previewCanvasRef}
                  role="img"
                  aria-label="Crop and rotate preview"
                  className="max-h-[60vh] w-auto max-w-full rounded-sm bg-white shadow-sm"
                />
              </div>

              <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                The preview is capped at {PREVIEW_MAX_PX} px. The download keeps the crop at the source resolution.
              </p>
            </section>
          </div>

          <aside className="space-y-4 lg:col-span-5">
            <section className="space-y-4 rounded-2xl border border-line bg-paper-2 p-4 sm:p-5">
              <h2 className="font-display text-base font-bold text-ink">Crop and rotate</h2>

              <button
                type="button"
                onClick={() => setRotation((previous) => ((previous + 90) % 360) as ImageRotation)}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line bg-paper-3 px-3 text-sm font-semibold text-ink transition-colors hover:bg-paper-2"
              >
                <RotateCw className="h-4 w-4" />
                Rotate 90°
              </button>

              <div className="space-y-3">
                {(['left', 'right', 'top', 'bottom'] as const).map((side) => (
                  <div key={side} className="space-y-1">
                    <label htmlFor={`crop-${side}`} className="flex items-center justify-between text-xs font-medium capitalize text-ink-soft">
                      <span>{side}</span>
                      <span className="font-mono">{crop[side]}%</span>
                    </label>
                    <input
                      id={`crop-${side}`}
                      type="range"
                      min="0"
                      max="40"
                      step="1"
                      value={crop[side]}
                      onChange={(event) => updateCrop(side, Number(event.target.value))}
                      className="min-h-11 w-full accent-doc"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setCrop(DEFAULT_CROP)}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-3 hover:text-doc"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset crop
                </button>
              </div>
            </section>

            <section className="space-y-4 rounded-2xl border border-line bg-paper-2 p-4 sm:p-5">
              <h2 className="font-display text-base font-bold text-ink">Output</h2>

              <fieldset className="space-y-2">
                <legend className="text-sm font-medium text-ink">Format</legend>
                <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-line bg-paper-3 p-1">
                  {(Object.keys(FORMAT_LABELS) as ImageConvertFormat[]).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormat(value)}
                      aria-pressed={format === value}
                      className={`min-h-11 rounded-lg text-sm font-bold uppercase transition-colors ${
                        format === value
                          ? 'bg-doc text-white'
                          : 'text-ink-soft hover:bg-paper-2 hover:text-ink'
                      }`}
                    >
                      {FORMAT_LABELS[value]}
                    </button>
                  ))}
                </div>
              </fieldset>

              {format !== 'png' ? (
                <div className="space-y-1">
                  <label htmlFor="crop-quality" className="flex items-center justify-between text-sm font-medium text-ink">
                    <span>Quality</span>
                    <span className="font-mono text-xs text-ink-soft">{Math.round(quality * 100)}%</span>
                  </label>
                  <input
                    id="crop-quality"
                    type="range"
                    min="0.3"
                    max="1"
                    step="0.05"
                    value={quality}
                    onChange={(event) => setQuality(clampQuality(Number(event.target.value)))}
                    className="min-h-11 w-full accent-doc"
                  />
                </div>
              ) : (
                <p className="text-xs leading-relaxed text-ink-soft">PNG is lossless and ignores the quality slider.</p>
              )}

              <div className="rounded-xl border border-line bg-paper-3 p-3">
                <p className="text-xs text-ink-soft">
                  Original: <strong className="text-ink">{image.width} x {image.height} px</strong> · {formatBytes(file.size)}
                </p>
                <p className="mt-1 text-xs text-ink-soft">
                  Output: {result ? `${result.width} x ${result.height} px · ${formatBytes(result.blob.size)}` : 'Preparing...'}
                </p>
                <p className="mt-1 break-all font-mono text-xs text-ink-soft">{downloadName}</p>
              </div>

              <ResultActions
                onDownload={() => result && downloadBlob(result.blob, downloadName)}
                downloadLabel={`Download ${FORMAT_LABELS[format]}`}
                disabled={!result || isEncoding}
              />

              <div className="flex items-start gap-2 rounded-xl border border-line bg-paper-3 p-3 text-xs leading-relaxed text-ink-soft">
                <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-doc" />
                <span>Your image is read, cropped and encoded in this browser. It is not uploaded.</span>
              </div>
            </section>

            <div className="rounded-2xl border border-line bg-paper-3 p-4 text-xs leading-relaxed text-ink-soft">
              <p className="font-semibold text-ink">Limits</p>
              <p className="mt-1">
                Cropping removes pixels permanently in the downloaded file; keep the original. JPG turns transparency
                white. Very large photos can use a lot of memory during export.
              </p>
            </div>
          </aside>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-line bg-paper-2 px-4 py-6 text-center text-sm text-ink-soft">
          Add an image to crop and rotate it.
        </p>
      )}
    </div>
  );
}
