'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  Download,
  Layers,
  Maximize2,
  ShieldCheck,
  Sliders,
  Sparkles,
  Trash2,
  Upload,
  Zap
} from 'lucide-react';
import { ImageFormat, ImageOptimizationOptions, ProcessedImageItem, SocialPreset } from '@/lib/types';
import { SOCIAL_PRESETS } from '@/lib/data/initialData';
import { processImageFile } from '@/lib/utils/imageOptimizer';
import { ResponsiveAd } from './ResponsiveAd';

const FORMAT_LABELS: Record<ImageFormat, string> = {
  jpeg: 'JPG',
  webp: 'WebP',
  png: 'PNG',
  avif: 'AVIF'
};

const FORMAT_OPTIONS: ImageFormat[] = ['jpeg', 'webp', 'png'];

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

const DEFAULT_OPTIONS: ImageOptimizationOptions = {
  format: 'jpeg',
  targetSizeKB: 25,
  preset: 'original'
};

export function ImageOptTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [processedItems, setProcessedItems] = useState<ProcessedImageItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ProcessedImageItem | null>(null);
  const [comparisonSliderPos, setComparisonSliderPos] = useState<number>(50);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [options, setOptions] = useState<ImageOptimizationOptions>(DEFAULT_OPTIONS);

  const addFiles = (incoming: File[]) => {
    const validFiles = incoming.filter((file) => ACCEPTED_TYPES.includes(file.type));

    if (validFiles.length === 0) {
      setErrorMessage('Choose a JPG, PNG, WebP or AVIF image.');
      return;
    }

    if (validFiles.length < incoming.length) {
      setErrorMessage('Some files were skipped. Use JPG, PNG, WebP or AVIF images.');
    } else {
      setErrorMessage(null);
    }

    setFiles((previous) => [...previous, ...validFiles]);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      addFiles(Array.from(event.dataTransfer.files));
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      addFiles(Array.from(event.target.files));
    }
    event.target.value = '';
  };

  const handleReset = () => {
    setOptions({ ...DEFAULT_OPTIONS });
    setFiles([]);
    setProcessedItems([]);
    setSelectedItem(null);
    setComparisonSliderPos(50);
    setErrorMessage(null);
  };

  const handleStartProcessing = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const newResults: ProcessedImageItem[] = [];

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      try {
        const result = await processImageFile(file, options);
        newResults.push(result);
      } catch (error) {
        console.error('Error optimizing image:', error);
      }
    }

    if (newResults.length === 0) {
      setErrorMessage('The images could not be processed. Try a JPG, PNG or WebP file.');
    } else {
      setProcessedItems((previous) => [...newResults, ...previous]);
      setSelectedItem(newResults[0]);
    }

    setFiles([]);
    setIsProcessing(false);
  };

  const handleLoadDemoSample = async () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1920;
      canvas.height = 1080;
      const context = canvas.getContext('2d')!;

      const gradient = context.createLinearGradient(0, 0, 1920, 1080);
      gradient.addColorStop(0, '#0B6B4F');
      gradient.addColorStop(0.5, '#0F172A');
      gradient.addColorStop(1, '#8A6400');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 1920, 1080);

      context.fillStyle = '#FFFFFF';
      context.font = 'bold 72px sans-serif';
      context.textAlign = 'center';
      context.fillText('Sample image 1920 x 1080', 960, 510);
      context.font = '36px sans-serif';
      context.fillText('Use this image to try the compressor', 960, 580);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], 'demo-sample.jpg', { type: 'image/jpeg' });
            setErrorMessage(null);
            setFiles([file]);
          }
        },
        'image/jpeg',
        0.95
      );
    } catch (error) {
      console.error(error);
      setErrorMessage('The demo image could not be created.');
    }
  };

  const handleDownloadSingle = (item: ProcessedImageItem) => {
    const anchor = document.createElement('a');
    anchor.href = item.optimizedDataUrl;
    anchor.download = item.name;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const totalSavedMb = (
    processedItems.reduce((total, item) => total + item.savedBytes, 0) /
    (1024 * 1024)
  ).toFixed(2);

  return (
    <div className="space-y-8">
      <p role="status" className="sr-only">
        {isProcessing
          ? 'Compressing images'
          : processedItems.length > 0
            ? `${processedItems.length} images optimized`
            : ''}
      </p>

      <header className="space-y-3">
        <p className="font-mono text-xs uppercase tracking-widest text-doc">Image compressor</p>
        <h1 className="max-w-3xl font-display text-3xl font-black leading-tight tracking-tight text-ink sm:text-4xl">
          Compress an image to 20KB, 50KB or 100KB
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-ink-soft">
          Choose a target size, add one or more images, and download the compressed files. Processing happens in your
          browser; the tool does not upload your images.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="order-1 space-y-4 lg:order-none lg:col-span-8">
          <label
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
            className="block cursor-pointer rounded-2xl border-2 border-dashed border-doc/30 bg-doc-soft/60 p-6 text-center transition-colors hover:border-doc/60 hover:bg-doc-soft focus-within:ring-2 focus-within:ring-gold focus-within:ring-offset-2 focus-within:ring-offset-paper sm:p-8"
          >
            <input
              type="file"
              onChange={handleFileSelect}
              multiple
              accept={ACCEPTED_TYPES.join(',')}
              className="sr-only"
            />
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-paper-2 text-doc">
              <Upload className="h-7 w-7" />
            </span>
            <h2 className="mt-3 font-display text-lg font-bold text-ink">Add images</h2>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">
              Drag and drop files here, or tap to choose. JPG, PNG, WebP and AVIF input.
            </p>
            <p className="mt-2 text-xs text-ink-soft">No enforced file-size limit. Very large images may be slow on a phone.</p>
          </label>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleLoadDemoSample}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-line bg-paper-2 px-4 text-sm font-semibold text-doc transition-colors hover:bg-paper-3"
            >
              <Sparkles className="h-4 w-4" />
              Load demo image
            </button>
            <p className="text-xs text-ink-soft">JPG, PNG or WebP output. AVIF input is decoded when your browser supports it.</p>
          </div>

          {files.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-doc/20 bg-doc-soft px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-ink">
                <Layers className="h-4 w-4 text-doc" />
                <span>
                  <strong>{files.length}</strong> file(s) ready for {FORMAT_LABELS[options.format]} output.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setFiles([])}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-2 hover:text-stamp"
              >
                <Trash2 className="h-4 w-4" />
                Clear queue
              </button>
            </div>
          )}

          {errorMessage && (
            <p role="alert" className="rounded-xl border border-stamp/30 bg-stamp/5 px-4 py-3 text-sm text-stamp">
              {errorMessage}
            </p>
          )}
        </div>

        <aside className="order-2 space-y-5 rounded-2xl border border-line bg-paper-2 p-4 sm:p-5 lg:order-none lg:col-span-4 lg:row-span-2">
          <div className="flex items-center justify-between gap-3 border-b border-line pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-doc" />
              <h2 className="font-display text-base font-bold text-ink">Optimization settings</h2>
            </div>
            <button
              type="button"
              onClick={handleReset}
              disabled={isProcessing}
              className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-3 hover:text-doc disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reset
            </button>
          </div>

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-ink">Output format</legend>
            <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-line bg-paper-3 p-1">
              {FORMAT_OPTIONS.map((format) => (
                <button
                  key={format}
                  type="button"
                  onClick={() => setOptions({ ...options, format })}
                  aria-pressed={options.format === format}
                  className={`min-h-11 rounded-lg text-sm font-bold uppercase transition-colors ${
                    options.format === format
                      ? 'bg-doc text-white'
                      : 'text-ink-soft hover:bg-paper-2 hover:text-ink'
                  }`}
                >
                  {FORMAT_LABELS[format]}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="space-y-2">
            <label htmlFor="target-size" className="flex items-center justify-between text-sm font-medium text-ink">
              <span>Target file size</span>
              <span className="font-mono text-sm font-bold text-doc">{options.targetSizeKB} KB</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                id="target-size"
                type="number"
                inputMode="numeric"
                min="1"
                max="10240"
                value={options.targetSizeKB}
                onChange={(event) =>
                  setOptions({
                    ...options,
                    targetSizeKB: Math.min(10240, Math.max(1, Number(event.target.value) || 1))
                  })
                }
                className="min-h-11 w-full rounded-lg border border-line bg-paper-3 px-3 text-base font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <span className="flex-shrink-0 font-mono text-sm font-bold uppercase text-ink-soft">KB</span>
            </div>
            <p className="text-xs leading-relaxed text-ink-soft">
              The tool lowers quality and, if needed, resolution until the output fits. PNG ignores the target size.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="dimension-preset" className="text-sm font-medium text-ink">
              Dimension preset
            </label>
            <select
              id="dimension-preset"
              value={options.preset}
              onChange={(event) => setOptions({ ...options, preset: event.target.value as SocialPreset })}
              className="min-h-11 w-full rounded-lg border border-line bg-paper-3 px-3 text-base text-ink focus:outline-none focus:ring-2 focus:ring-gold"
            >
              {SOCIAL_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name} {preset.width ? `(${preset.width} x ${preset.height})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-start gap-2 rounded-xl border border-line bg-paper-3 p-3 text-xs leading-relaxed text-ink-soft">
            <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-doc" />
            <span>EXIF metadata, including GPS data, is removed automatically when the image is re-encoded.</span>
          </div>

          <button
            type="button"
            onClick={handleStartProcessing}
            disabled={files.length === 0 || isProcessing}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-doc px-4 text-base font-semibold text-white transition-colors hover:bg-doc-bright disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Compressing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Compress images{files.length > 0 ? ` (${files.length})` : ''}
              </>
            )}
          </button>
        </aside>

        <div className="order-3 space-y-4 lg:order-none lg:col-span-8">
          {selectedItem && (
            <section aria-labelledby="comparison-title" className="rounded-2xl border border-line bg-paper-2 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
                <div className="flex min-w-0 items-center gap-2">
                  <Maximize2 className="h-4 w-4 flex-shrink-0 text-gold" />
                  <h2 id="comparison-title" className="font-display text-base font-bold text-ink">
                    Visual comparison
                  </h2>
                  <span className="truncate font-mono text-xs text-ink-soft">{selectedItem.name}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-ink-soft">
                  <span>
                    Original: <strong className="text-ink">{(selectedItem.originalSize / 1024).toFixed(1)} KB</strong>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5" />
                  <span className="font-bold text-doc">
                    {(selectedItem.optimizedSize / 1024).toFixed(1)} KB ({selectedItem.savedPercentage > 0 ? `-${selectedItem.savedPercentage}%` : '0%'})
                  </span>
                </div>
              </div>

              <div className="relative mt-3 aspect-[4/3] max-h-[60vh] w-full select-none overflow-hidden rounded-xl border border-line bg-paper-3 focus-within:ring-2 focus-within:ring-gold focus-within:ring-offset-2 focus-within:ring-offset-paper sm:aspect-[16/9]">
                <img
                  src={selectedItem.optimizedDataUrl}
                  alt={`Compressed ${FORMAT_LABELS[selectedItem.format]} version of ${selectedItem.name}`}
                  className="absolute inset-0 h-full w-full object-contain"
                />

                <div
                  className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-gold"
                  style={{ width: `${comparisonSliderPos}%` }}
                >
                  <img
                    src={selectedItem.originalDataUrl}
                    alt={`Original version of ${selectedItem.name}`}
                    className="absolute left-0 top-0 h-full w-full object-contain"
                  />
                  <div className="absolute left-3 top-3 rounded-lg bg-black/70 px-2.5 py-1 font-mono text-xs font-bold uppercase text-white backdrop-blur-md">
                    Original ({selectedItem.originalWidth} x {selectedItem.originalHeight})
                  </div>
                </div>

                <div className="absolute right-3 top-3 rounded-lg bg-doc px-2.5 py-1 font-mono text-xs font-bold uppercase text-white backdrop-blur-md">
                  Compressed ({selectedItem.optimizedWidth} x {selectedItem.optimizedHeight})
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={comparisonSliderPos}
                  onChange={(event) => setComparisonSliderPos(parseFloat(event.target.value))}
                  aria-label="Drag to compare the original and compressed image"
                  className="absolute inset-0 z-30 h-full w-full cursor-ew-resize opacity-0"
                />
              </div>

              <div className="mt-2 flex flex-col gap-1 text-xs text-ink-soft sm:flex-row sm:justify-between">
                <span>Drag the slider to compare the result.</span>
                <span>Processing time: {selectedItem.processingTimeMs} ms</span>
              </div>
            </section>
          )}

          {processedItems.length > 0 && (
            <section aria-labelledby="results-title" className="space-y-3 rounded-2xl border border-line bg-paper-2 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-doc" />
                  <h2 id="results-title" className="font-display text-base font-bold text-ink">
                    Optimized images ({processedItems.length})
                  </h2>
                </div>
                <span className="rounded-full border border-doc/30 px-3 py-1 text-xs font-semibold text-doc">
                  Total saved: {totalSavedMb} MB
                </span>
              </div>

              <ul className="space-y-2">
                {processedItems.map((item) => (
                  <li
                    key={item.id}
                    className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3 transition-colors ${
                      selectedItem?.id === item.id ? 'border-doc bg-doc-soft' : 'border-line bg-paper-3/50 hover:border-doc/40'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    >
                      <img
                        src={item.optimizedDataUrl}
                        alt={`Compressed preview of ${item.name}`}
                        width={48}
                        height={48}
                        className="h-12 w-12 flex-shrink-0 rounded-lg border border-line object-cover"
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-ink">{item.name}</span>
                        <span className="mt-0.5 flex flex-wrap items-center gap-2 font-mono text-xs text-ink-soft">
                          <span>{(item.originalSize / 1024).toFixed(1)} KB</span>
                          <span aria-hidden>→</span>
                          <span className="font-bold text-doc">{(item.optimizedSize / 1024).toFixed(1)} KB</span>
                        </span>
                      </span>
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="rounded-lg border border-doc/30 bg-doc-soft px-2.5 py-1 font-mono text-xs font-bold text-doc">
                        {item.savedPercentage > 0 ? `-${item.savedPercentage}%` : '0%'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDownloadSingle(item)}
                        className="flex h-11 w-11 items-center justify-center rounded-lg bg-doc text-white transition-colors hover:bg-doc-bright"
                        aria-label={`Download ${item.name}`}
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {!selectedItem && processedItems.length === 0 && (
            <p className="rounded-xl border border-dashed border-line bg-paper-2 px-4 py-6 text-center text-sm text-ink-soft">
              Your compressed images and the comparison slider will appear here.
            </p>
          )}
        </div>
      </div>

      <ResponsiveAd />
    </div>
  );
}
