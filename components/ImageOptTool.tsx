'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  Download,
  Image as ImageIcon,
  Check,
  Sparkles,
  ShieldCheck,
  Zap,
  Sliders,
  ArrowRight,
  Trash2,
  Layers,
  Maximize2
} from 'lucide-react';
import { ImageOptimizationOptions, ProcessedImageItem, SocialPreset, ImageFormat } from '@/lib/types';
import { SOCIAL_PRESETS, REPO_INFO } from '@/lib/data/initialData';
import { processImageFile } from '@/lib/utils/imageOptimizer';
import { CornerMarks, ScaleRuler } from './CornerMarks';

const FORMAT_LABELS: Record<ImageFormat, string> = {
  jpeg: 'JPG',
  webp: 'WebP',
  png: 'PNG',
  avif: 'AVIF'
};

const DEFAULT_OPTIONS: ImageOptimizationOptions = {
  format: 'jpeg',
  targetSizeKB: 25,
  preset: 'original',
  stripExif: true,
  lossless: false
};

export function ImageOptTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [processedItems, setProcessedItems] = useState<ProcessedImageItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ProcessedImageItem | null>(null);
  const [comparisonSliderPos, setComparisonSliderPos] = useState<number>(50);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [options, setOptions] = useState<ImageOptimizationOptions>(DEFAULT_OPTIONS);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const validFiles = Array.from(e.dataTransfer.files).filter((f: File) => f.type.startsWith('image/'));
      if (validFiles.length > 0) {
        setFiles((prev) => [...prev, ...validFiles]);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const validFiles = Array.from(e.target.files).filter((f: File) => f.type.startsWith('image/'));
      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const handleReset = () => {
    setOptions({ ...DEFAULT_OPTIONS });
    setFiles([]);
    setProcessedItems([]);
    setSelectedItem(null);
    setComparisonSliderPos(50);
  };

  const handleStartProcessing = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);

    const newResults: ProcessedImageItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const result = await processImageFile(file, options);
        newResults.push(result);
      } catch (err) {
        console.error('Error optimizing image:', err);
      }
    }

    setProcessedItems((prev) => [...newResults, ...prev]);
    if (newResults.length > 0) {
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
      const ctx = canvas.getContext('2d')!;

      const grad = ctx.createLinearGradient(0, 0, 1920, 1080);
      grad.addColorStop(0, '#0C6B4F');
      grad.addColorStop(0.5, '#0B0E13');
      grad.addColorStop(1, '#C89B3C');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1920, 1080);

      ctx.fillStyle = '#F5F3EE';
      ctx.font = 'bold 72px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('image-opt-g8 Benchmark Image', 960, 500);
      ctx.font = '36px sans-serif';
      ctx.fillText('Sample 1920x1080 High-Res Asset', 960, 580);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'demo_sample_hd.jpg', { type: 'image/jpeg' });
          setFiles([file]);
        }
      }, 'image/jpeg', 0.95);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadSingle = (item: ProcessedImageItem) => {
    const a = document.createElement('a');
    a.href = item.optimizedDataUrl;
    a.download = item.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const totalSavedMb = (
    processedItems.reduce((acc, item) => acc + item.savedBytes, 0) / (1024 * 1024)
  ).toFixed(2);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Job sheet header */}
      <section className="relative overflow-hidden rounded-2xl border border-rule bg-ink-2 p-6 text-paper shadow-2xl md:p-8">
        <CornerMarks className="text-gold" />
        <div className="absolute -right-5 top-1/2 hidden -translate-y-1/2 rotate-[-8deg] rounded border-2 border-stamp/40 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-stamp/70 lg:block">
          EXIF Stripped
        </div>

        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest">
              <span className="flex items-center gap-1 rounded border border-doc/40 bg-ink-3 px-2 py-1 font-bold text-doc-bright">
                <Zap className="h-3.5 w-3.5 text-gold" />
                img-opt core engine
              </span>
              <span className="text-rule">{REPO_INFO.imageOpt.version}</span>
            </div>
            <h1 className="font-display text-2xl font-black tracking-tight md:text-3xl">
              Batch image optimization & WebP/AVIF conversion
            </h1>
            <p className="text-sm leading-relaxed text-paper/70">
              Compress JPEG, PNG, WebP & AVIF images by up to 80% directly in your browser. Strip sensitive EXIF
              location metadata and convert to responsive social presets.
            </p>
          </div>

          <div className="flex flex-shrink-0 items-center gap-2 rounded-lg border border-rule bg-ink-3 px-3 py-2 font-mono text-[10px] font-medium text-paper/80">
            <ShieldCheck className="h-4 w-4 text-doc-bright" />
            <span>{REPO_INFO.imageOpt.fullName}</span>
          </div>
        </div>
      </section>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Controls */}
        <aside className="space-y-5 rounded-2xl border border-line bg-paper-2 p-6 shadow-sm transition-colors dark:border-rule dark:bg-ink-2 dark:shadow-xl lg:col-span-4">
          <div className="flex items-center justify-between border-b border-line pb-4 dark:border-rule">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-doc dark:text-doc-bright" />
              <h3 className="font-display text-sm font-bold text-ink dark:text-paper">Optimization settings</h3>
            </div>
            <button
              onClick={handleReset}
              disabled={isProcessing}
              className="font-mono text-[10px] uppercase tracking-widest text-ink-soft transition-colors hover:text-doc disabled:cursor-not-allowed disabled:opacity-50 dark:text-rule dark:hover:text-doc-bright"
            >
              Reset
            </button>
          </div>

          <div className="space-y-2">
            <label className="font-mono text-[10px] font-semibold uppercase tracking-widest text-ink-soft dark:text-rule">
              Target output format
            </label>
            <div className="grid grid-cols-4 gap-1.5 rounded-xl border border-line bg-paper-3 p-1 dark:border-rule dark:bg-ink-3">
              {(['jpeg', 'webp', 'png', 'avif'] as ImageFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setOptions({ ...options, format: fmt })}
                  className={`rounded-lg py-1.5 font-mono text-xs font-bold uppercase transition-all ${
                    options.format === fmt
                      ? 'bg-doc text-white shadow-md'
                      : 'text-ink-soft hover:text-ink dark:text-rule dark:hover:text-paper'
                  }`}
                >
                  {FORMAT_LABELS[fmt]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest">
              <span className="font-semibold text-ink-soft dark:text-rule">Target file size</span>
              <span className="font-bold text-doc dark:text-doc-bright">{options.targetSizeKB} KB</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="10240"
                value={options.targetSizeKB}
                onChange={(e) =>
                  setOptions({ ...options, targetSizeKB: Math.max(1, Number(e.target.value) || 1) })
                }
                className="w-full rounded-xl border border-line bg-paper-3 px-3 py-2 text-xs font-bold text-ink focus:outline-none focus:ring-2 focus:ring-gold dark:border-rule dark:bg-ink-3 dark:text-paper"
              />
              <span className="flex-shrink-0 font-mono text-xs font-bold uppercase text-ink-soft dark:text-rule">
                KB
              </span>
            </div>
            <p className="text-[10px] leading-relaxed text-ink-soft dark:text-rule">
              Compression auto-tunes to hit this size; resolution shrinks if needed. PNG ignores this (lossless).
            </p>
          </div>

          <div className="space-y-2">
            <label className="font-mono text-[10px] font-semibold uppercase tracking-widest text-ink-soft dark:text-rule">
              Dimension preset
            </label>
            <select
              value={options.preset}
              onChange={(e) => setOptions({ ...options, preset: e.target.value as SocialPreset })}
              className="w-full rounded-xl border border-line bg-paper-3 px-3 py-2 text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-gold dark:border-rule dark:bg-ink-3 dark:text-paper"
            >
              {SOCIAL_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} {p.width ? `(${p.width}x${p.height})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3 border-t border-line pt-3 dark:border-rule">
            <label className="flex cursor-pointer items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-doc dark:text-doc-bright" />
                <span className="text-xs font-medium text-ink dark:text-paper">Strip EXIF GPS privacy data</span>
              </div>
              <input
                type="checkbox"
                checked={options.stripExif}
                onChange={(e) => setOptions({ ...options, stripExif: e.target.checked })}
                className="h-4 w-4 rounded accent-doc"
              />
            </label>

            <label className="flex cursor-pointer items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-gold" />
                <span className="text-xs font-medium text-ink dark:text-paper">Lossless quantization</span>
              </div>
              <input
                type="checkbox"
                checked={options.lossless}
                onChange={(e) => setOptions({ ...options, lossless: e.target.checked })}
                className="h-4 w-4 rounded accent-doc"
              />
            </label>
          </div>

          <button
            onClick={handleStartProcessing}
            disabled={files.length === 0 || isProcessing}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-doc py-3 text-sm font-bold text-white shadow-lg shadow-doc/20 transition-all hover:bg-doc-bright disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Compressing batch...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Optimize {files.length > 0 ? `(${files.length} files)` : ''}
              </>
            )}
          </button>
        </aside>

        {/* Dropzone & results */}
        <div className="space-y-6 lg:col-span-8">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="group relative cursor-pointer space-y-4 rounded-2xl border-2 border-dashed border-doc/30 bg-doc/5 p-8 text-center transition-all hover:border-doc/70 hover:bg-doc/10"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              accept="image/*"
              className="hidden"
            />

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-doc/10 text-doc transition-transform group-hover:scale-110 dark:text-doc-bright">
              <Upload className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <h4 className="font-display text-base font-bold text-ink dark:text-paper">
                Drag & drop images, or click to upload
              </h4>
              <p className="text-xs text-ink-soft dark:text-rule">
                Supports JPG, PNG, WebP, AVIF, HEIC (max 25MB per file)
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLoadDemoSample();
                }}
                className="flex items-center gap-1.5 rounded-lg bg-doc/10 px-3 py-1.5 text-xs font-semibold text-doc transition-colors hover:bg-doc/20 dark:text-doc-bright"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Load demo HD sample image
              </button>
            </div>
          </div>

          {files.length > 0 && (
            <div className="flex items-center justify-between rounded-xl border border-doc/30 bg-doc/5 px-4 py-3">
              <div className="flex items-center gap-3 text-xs text-doc dark:text-doc-bright">
                <Layers className="h-4 w-4" />
                <span>
                  <strong className="text-ink dark:text-paper">{files.length}</strong> file(s) queued for{' '}
                  <strong className="uppercase">{options.format}</strong> conversion.
                </span>
              </div>
              <button onClick={() => setFiles([])} className="flex items-center gap-1 text-xs text-ink-soft hover:text-stamp dark:text-rule">
                <Trash2 className="h-3.5 w-3.5" />
                Clear queue
              </button>
            </div>
          )}

          {selectedItem && (
            <div className="space-y-4 rounded-2xl border border-rule bg-ink-2 p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-rule pb-3">
                <div className="flex items-center gap-2">
                  <Maximize2 className="h-4 w-4 text-gold" />
                  <h4 className="font-display text-sm font-bold text-white">Visual comparison</h4>
                  <span className="font-mono text-xs text-rule">({selectedItem.name})</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-paper/60">
                    Original:{' '}
                    <strong className="text-paper/90">{(selectedItem.originalSize / 1024).toFixed(1)} KB</strong>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-rule" />
                  <span className="font-bold text-doc-bright">
                    {(selectedItem.optimizedSize / 1024).toFixed(1)} KB (-{selectedItem.savedPercentage}%)
                  </span>
                </div>
              </div>

              <div className="relative h-[320px] w-full select-none overflow-hidden rounded-xl border border-rule bg-ink-3 md:h-[400px]">
                <img src={selectedItem.optimizedDataUrl} alt="Optimized" className="absolute inset-0 h-full w-full object-contain" />

                <div
                  className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-gold shadow-2xl"
                  style={{ width: `${comparisonSliderPos}%` }}
                >
                  <img
                    src={selectedItem.originalDataUrl}
                    alt="Original"
                    className="absolute left-0 top-0 h-full w-full object-contain"
                  />
                  <div className="absolute left-3 top-3 rounded-lg bg-black/70 px-2.5 py-1 font-mono text-[10px] font-bold uppercase backdrop-blur-md">
                    Original ({selectedItem.originalWidth}x{selectedItem.originalHeight})
                  </div>
                </div>

                <div className="absolute right-3 top-3 rounded-lg bg-doc px-2.5 py-1 font-mono text-[10px] font-bold uppercase backdrop-blur-md">
                  Optimized ({selectedItem.optimizedWidth}x{selectedItem.optimizedHeight})
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={comparisonSliderPos}
                  onChange={(e) => setComparisonSliderPos(parseFloat(e.target.value))}
                  className="absolute inset-0 z-30 h-full w-full cursor-ew-resize opacity-0"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-paper/60">
                <span>Drag the slider to compare visual quality</span>
                <span>Processing time: {selectedItem.processingTimeMs}ms</span>
              </div>
            </div>
          )}

          {processedItems.length > 0 && (
            <div className="space-y-4 rounded-2xl border border-line bg-paper-2 p-6 shadow-sm dark:border-rule dark:bg-ink-2 dark:shadow-xl">
              <div className="flex items-center justify-between border-b border-line pb-3 dark:border-rule">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-doc dark:text-doc-bright" />
                  <h4 className="font-display text-sm font-bold text-ink dark:text-paper">
                    Optimized assets ({processedItems.length})
                  </h4>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-doc/30 px-3 py-1 text-xs font-semibold text-doc dark:text-doc-bright">
                  <ScaleRuler segments={6} className="text-gold" />
                  Total saved: {totalSavedMb} MB
                </div>
              </div>

              <div className="space-y-3">
                {processedItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-3.5 transition-all ${
                      selectedItem?.id === item.id
                        ? 'border-doc bg-doc/10 dark:bg-ink-3'
                        : 'border-line bg-paper-3/50 hover:border-doc/50 dark:border-rule dark:bg-ink-3/50 dark:hover:border-doc/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img
                        src={item.optimizedDataUrl}
                        alt="thumbnail"
                        className="h-12 w-12 flex-shrink-0 rounded-lg border border-line object-cover dark:border-rule"
                      />
                      <div className="truncate text-xs">
                        <div className="truncate font-semibold text-ink dark:text-paper">{item.name}</div>
                        <div className="mt-0.5 flex items-center gap-2 font-mono text-[11px] text-ink-soft dark:text-rule">
                          <span>{(item.originalSize / 1024).toFixed(1)} KB</span>
                          <span>→</span>
                          <span className="font-bold text-doc dark:text-doc-bright">
                            {(item.optimizedSize / 1024).toFixed(1)} KB
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="rounded-lg border border-doc/30 bg-doc/10 px-2.5 py-1 font-mono text-xs font-bold text-doc dark:text-doc-bright">
                        -{item.savedPercentage}%
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadSingle(item);
                        }}
                        className="rounded-xl bg-doc p-2 text-white shadow-md transition-colors hover:bg-doc-bright"
                        title="Download optimized file"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
