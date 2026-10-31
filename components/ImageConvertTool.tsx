'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, FileImage, ShieldCheck, Trash2 } from 'lucide-react';
import type { ImageConvertFormat } from '@/lib/types';
import { useObjectUrl } from '@/lib/hooks/useObjectUrl';
import { loadImageFile } from '@/lib/utils/loadImage';
import { buildFilename, formatBytes } from '@/lib/utils/format';
import { downloadBlob } from '@/lib/utils/download';
import {
  clampQuality,
  convertImageElement,
  getConvertExtension,
  type ConvertedImage
} from '@/lib/utils/imageConvert';
import { FileDropzone } from './tool/FileDropzone';
import { ResultActions } from './tool/ResultActions';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

const FORMAT_LABELS: Record<ImageConvertFormat, string> = {
  jpeg: 'JPG',
  png: 'PNG',
  webp: 'WebP'
};

export function ImageConvertTool() {
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [format, setFormat] = useState<ImageConvertFormat>('jpeg');
  const [quality, setQuality] = useState(0.9);
  const [result, setResult] = useState<ConvertedImage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previewUrl = useObjectUrl(result?.blob ?? null);

  const handleFiles = async (incoming: File[]) => {
    const nextFile = incoming[0];
    if (!nextFile) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

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
    setResult(null);
    setError(null);
    setQuality(0.9);
    setFormat('jpeg');
  };

  useEffect(() => {
    if (!image) {
      setResult(null);
      setIsConverting(false);
      return;
    }

    let cancelled = false;
    setIsConverting(true);
    const timer = window.setTimeout(async () => {
      try {
        const converted = await convertImageElement(image, format, quality);
        if (!cancelled) {
          setResult(converted);
          setError(null);
        }
      } catch (convertError) {
        if (!cancelled) {
          setError(convertError instanceof Error ? convertError.message : 'The image could not be converted.');
        }
      } finally {
        if (!cancelled) setIsConverting(false);
      }
    }, 180);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [image, format, quality]);

  const downloadName = file
    ? buildFilename(file.name, FORMAT_LABELS[format].toLowerCase(), getConvertExtension(format))
    : `converted.${getConvertExtension(format)}`;

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
                  <FileImage className="h-4 w-4 text-doc" />
                  <h2 className="font-display text-base font-bold text-ink">Output preview</h2>
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
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={`Converted ${FORMAT_LABELS[format]} preview`}
                    className="max-h-[55vh] w-auto max-w-full rounded-sm bg-white object-contain shadow-sm"
                  />
                ) : (
                  <p className="text-sm text-ink-soft">{isConverting ? 'Converting...' : 'Preparing preview...'}</p>
                )}
              </div>

              <p className="mt-2 break-all font-mono text-xs text-ink-soft">{downloadName}</p>
            </section>
          </div>

          <aside className="space-y-4 lg:col-span-5">
            <section className="space-y-4 rounded-2xl border border-line bg-paper-2 p-4 sm:p-5">
              <h2 className="font-display text-base font-bold text-ink">Converter settings</h2>

              <fieldset className="space-y-2">
                <legend className="text-sm font-medium text-ink">Output format</legend>
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
                  <label htmlFor="convert-quality" className="flex items-center justify-between text-sm font-medium text-ink">
                    <span>Quality</span>
                    <span className="font-mono text-xs text-ink-soft">{Math.round(quality * 100)}%</span>
                  </label>
                  <input
                    id="convert-quality"
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
                <p className="text-xs leading-relaxed text-ink-soft">
                  PNG is lossless and ignores the quality slider.
                </p>
              )}

              <div className="rounded-xl border border-line bg-paper-3 p-3">
                <p className="text-xs text-ink-soft">
                  Original: <strong className="text-ink">{image.width} x {image.height} px</strong> ·{' '}
                  {formatBytes(file.size)}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-ink-soft">
                  <ArrowRight className="h-3.5 w-3.5" />
                  {result ? (
                    <>
                      {FORMAT_LABELS[format]}: <strong className="text-doc">{formatBytes(result.blob.size)}</strong>
                    </>
                  ) : (
                    'Converting...'
                  )}
                </p>
              </div>

              <ResultActions
                onDownload={() => result && downloadBlob(result.blob, downloadName)}
                downloadLabel={`Download ${FORMAT_LABELS[format]}`}
                disabled={!result || isConverting}
              />

              <div className="flex items-start gap-2 rounded-xl border border-line bg-paper-3 p-3 text-xs leading-relaxed text-ink-soft">
                <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-doc" />
                <span>Your image is read and converted in this browser. It is not uploaded.</span>
              </div>
            </section>

            <div className="rounded-2xl border border-line bg-paper-3 p-4 text-xs leading-relaxed text-ink-soft">
              <p className="font-semibold text-ink">Limits</p>
              <p className="mt-1">
                JPG has no transparency, so transparent areas become white. Re-encoding drops EXIF metadata. HEIC
                input is not supported by most browsers; convert it to JPG first. This tool does not resize or crop;
                use the photo resizer or crop tool for that.
              </p>
            </div>
          </aside>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-line bg-paper-2 px-4 py-6 text-center text-sm text-ink-soft">
          Add an image to convert it to JPG, PNG or WebP.
        </p>
      )}
    </div>
  );
}
