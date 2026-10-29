'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Check,
  ChevronDown,
  Download,
  Eye,
  FileDown,
  FileText,
  Lock,
  Printer,
  RefreshCw,
  Sliders,
  Sparkles,
  Trash2,
  Upload
} from 'lucide-react';
import { CnicFilterMode, CnicLayoutPreset, CnicPaperSize, CnicPrintOptions } from '@/lib/types';
import { CNIC_WATERMARK_PRESETS } from '@/lib/data/initialData';
import { generateCnicPrintCanvas } from '@/lib/utils/cnicOptimizer';
import { ResponsiveAd } from './ResponsiveAd';

const DEFAULT_OPTIONS: CnicPrintOptions = {
  paperSize: 'a4',
  layout: 'standard-top-bottom',
  filter: 'original',
  watermarkText: '',
  enableWatermark: false,
  watermarkOpacity: 0.18,
  customScale: 1.0,
  brightness: 10,
  contrast: 30,
  sharpness: 50,
  borderGrid: true,
  dateStamp: true
};

const PAPER_SIZE_MM: Record<CnicPaperSize, { w: number; h: number }> = {
  a4: { w: 210, h: 297 },
  letter: { w: 215.9, h: 279.4 },
  legal: { w: 215.9, h: 355.6 },
  '3r': { w: 88.9, h: 127 }
};

const PAPER_LABELS: Record<CnicPaperSize, string> = {
  a4: 'A4',
  letter: 'Letter',
  legal: 'Legal',
  '3r': '3R'
};

const LAYOUT_OPTIONS: { id: CnicLayoutPreset; label: string }[] = [
  { id: 'standard-top-bottom', label: 'Centered stacked' },
  { id: 'side-by-side', label: 'Side by side' },
  { id: 'dual-copy-a4', label: 'Dual copy (2 sets)' },
  { id: 'quad-copy-a4', label: 'Quad copy (4 sets)' },
  { id: 'pakistani-style', label: 'Pakistani grid' }
];

const FILTER_OPTIONS: { id: CnicFilterMode; label: string }[] = [
  { id: 'original', label: 'Original' },
  { id: 'high-contrast-bw', label: 'B&W scan' },
  { id: 'grayscale', label: 'Grayscale' },
  { id: 'enhanced', label: 'Color boost' }
];

function loadJsPdfLibrary(): Promise<any> {
  return new Promise((resolve, reject) => {
    const win = window as any;
    if (win.jspdf?.jsPDF) {
      resolve(win.jspdf.jsPDF);
      return;
    }

    const existing = document.querySelector('script[src*="jspdf.umd.min.js"]') as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve(win.jspdf.jsPDF), { once: true });
      existing.addEventListener('error', () => reject(new Error('Failed to load PDF library')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.async = true;
    script.onload = () => resolve(win.jspdf?.jsPDF);
    script.onerror = () => reject(new Error('Failed to load PDF library'));
    document.head.appendChild(script);
  });
}

function canvasToJpegDataUrl(dataUrl: string, quality = 0.92): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext('2d')!.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', quality));
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () => reject(new Error('Failed to read sheet image'));
    img.src = dataUrl;
  });
}

export function CnicOptTool() {
  const [frontFile, setFrontFile] = useState<File | string | null>(null);
  const [backFile, setBackFile] = useState<File | string | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [options, setOptions] = useState<CnicPrintOptions>(DEFAULT_OPTIONS);

  const hasAnyImage = Boolean(frontFile || backFile);
  const paperLabel = PAPER_LABELS[options.paperSize];
  const activeLayout = LAYOUT_OPTIONS.find((item) => item.id === options.layout)?.label ?? 'Layout';
  const activeFilter = FILTER_OPTIONS.find((item) => item.id === options.filter)?.label ?? 'Original';

  const frontPreviewUrl = useMemo(
    () => (frontFile instanceof File ? URL.createObjectURL(frontFile) : frontFile),
    [frontFile]
  );
  const backPreviewUrl = useMemo(
    () => (backFile instanceof File ? URL.createObjectURL(backFile) : backFile),
    [backFile]
  );

  useEffect(() => {
    if (!(frontFile instanceof File) || !frontPreviewUrl) return;
    return () => URL.revokeObjectURL(frontPreviewUrl);
  }, [frontFile, frontPreviewUrl]);

  useEffect(() => {
    if (!(backFile instanceof File) || !backPreviewUrl) return;
    return () => URL.revokeObjectURL(backPreviewUrl);
  }, [backFile, backPreviewUrl]);

  useEffect(() => {
    let isMounted = true;

    async function updatePreview() {
      setIsGenerating(true);
      try {
        const result = await generateCnicPrintCanvas(frontFile, backFile, options);
        if (isMounted) {
          setPreviewDataUrl(result.dataUrl);
        }
      } catch (error) {
        console.error('Failed to generate CNIC print preview:', error);
        if (isMounted) {
          setActionMessage('The image could not be opened. Try a JPG or PNG file.');
        }
      } finally {
        if (isMounted) setIsGenerating(false);
      }
    }

    updatePreview();

    return () => {
      isMounted = false;
    };
  }, [frontFile, backFile, options]);

  const handleLoadSampleCards = () => {
    const frontCanvas = document.createElement('canvas');
    frontCanvas.width = 600;
    frontCanvas.height = 380;
    const frontContext = frontCanvas.getContext('2d')!;

    frontContext.fillStyle = '#E0F2FE';
    frontContext.fillRect(0, 0, 600, 380);
    frontContext.strokeStyle = '#0369A1';
    frontContext.lineWidth = 4;
    frontContext.strokeRect(8, 8, 584, 364);

    frontContext.fillStyle = '#0F172A';
    frontContext.font = 'bold 20px sans-serif';
    frontContext.fillText('SAMPLE ID CARD', 140, 50);
    frontContext.font = 'bold 15px sans-serif';
    frontContext.fillStyle = '#0369A1';
    frontContext.fillText('NOT A REAL DOCUMENT', 140, 78);

    frontContext.fillStyle = '#94A3B8';
    frontContext.fillRect(25, 105, 100, 120);
    frontContext.fillStyle = '#FFFFFF';
    frontContext.font = '12px sans-serif';
    frontContext.fillText('PHOTO', 55, 170);

    frontContext.fillStyle = '#0F172A';
    frontContext.font = 'bold 14px sans-serif';
    frontContext.fillText('Name: SAMPLE NAME', 140, 120);
    frontContext.fillText('Identity No: 00000-0000000-0', 140, 150);
    frontContext.fillText('Date of Birth: 01.01.2000', 140, 180);
    frontContext.fillText('Sample card for the demo only', 140, 210);

    frontContext.fillStyle = '#15803D';
    frontContext.beginPath();
    frontContext.arc(520, 50, 25, 0, Math.PI * 2);
    frontContext.fill();

    setFrontFile(frontCanvas.toDataURL('image/png'));

    const backCanvas = document.createElement('canvas');
    backCanvas.width = 600;
    backCanvas.height = 380;
    const backContext = backCanvas.getContext('2d')!;

    backContext.fillStyle = '#FEF3C7';
    backContext.fillRect(0, 0, 600, 380);
    backContext.strokeStyle = '#D97706';
    backContext.lineWidth = 4;
    backContext.strokeRect(8, 8, 584, 364);

    backContext.fillStyle = '#0F172A';
    backContext.font = 'bold 16px sans-serif';
    backContext.fillText('SAMPLE ADDRESS', 25, 45);
    backContext.font = '13px sans-serif';
    backContext.fillText('Sample House, Sample Street, Sample City', 25, 80);
    backContext.fillText('Sample card for the demo only', 25, 110);

    backContext.fillStyle = '#000000';
    for (let x = 25; x < 550; x += 6) {
      const width = Math.random() > 0.5 ? 3 : 1;
      backContext.fillRect(x, 150, width, 60);
    }

    backContext.fillStyle = '#B45309';
    backContext.font = 'bold 14px sans-serif';
    backContext.fillText('Sample expiry: 2035 | Sample issue: 2025', 25, 250);

    setBackFile(backCanvas.toDataURL('image/png'));
    setActionMessage(null);
  };

  const handleClearImages = () => {
    setFrontFile(null);
    setBackFile(null);
    setActionMessage(null);
  };

  const handlePrintDocument = async () => {
    if (!previewDataUrl || !hasAnyImage) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setActionMessage('Your browser blocked the print window. Allow pop-ups and try again.');
      return;
    }

    setActionMessage(null);
    const { w, h } = PAPER_SIZE_MM[options.paperSize];

    const pageCount = options.layout === 'pakistani-style' ? 2 : 1;
    const pages = Array.from(
      { length: pageCount },
      () => `<div class="page"><img src="${previewDataUrl}" alt="CNIC print sheet" /></div>`
    ).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>CNIC print sheet - Zaibi Tools</title>
          <style>
            html, body { margin: 0; padding: 0; background: #fff; }
            .page {
              width: ${w}mm;
              height: ${h}mm;
              display: flex;
              align-items: center;
              justify-content: center;
              page-break-after: always;
              break-after: page;
              overflow: hidden;
            }
            .page:last-child { page-break-after: auto; break-after: auto; }
            .page img { width: 100%; height: 100%; object-fit: contain; }
            @page { size: ${w}mm ${h}mm; margin: 0; }
          </style>
        </head>
        <body>
          ${pages}
        </body>
      </html>
    `);
    printWindow.document.close();

    const images = printWindow.document.images;
    if (images.length === 0) {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
      return;
    }

    let ready = 0;
    Array.from(images).forEach((img) => {
      const finish = () => {
        ready++;
        if (ready === images.length) {
          printWindow.focus();
          printWindow.print();
          printWindow.close();
        }
      };
      if (img.complete) finish();
      else {
        img.onload = finish;
        img.onerror = finish;
      }
    });
  };

  const handleDownloadPdf = async () => {
    if (!previewDataUrl || !hasAnyImage) return;

    setActionMessage(null);
    setIsGenerating(true);
    try {
      const jsPDF = await loadJsPdfLibrary();
      if (!jsPDF) {
        throw new Error('The PDF library could not be loaded. Check your connection and try again.');
      }

      const jpegDataUrl = await canvasToJpegDataUrl(previewDataUrl);
      const { w, h } = PAPER_SIZE_MM[options.paperSize];

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [w, h] });
      pdf.addImage(jpegDataUrl, 'JPEG', 0, 0, w, h, undefined, 'FAST');

      if (options.layout === 'pakistani-style') {
        pdf.addPage([w, h], 'portrait');
        pdf.addImage(jpegDataUrl, 'JPEG', 0, 0, w, h, undefined, 'FAST');
      }

      pdf.save(`CNIC_Print_${options.paperSize}_${options.layout}.pdf`);
    } catch (error) {
      console.error('Failed to generate CNIC PDF:', error);
      setActionMessage(
        error instanceof Error ? error.message : 'The PDF could not be generated. Check your connection and try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadSheet = () => {
    if (!previewDataUrl || !hasAnyImage) return;
    setActionMessage(null);

    const anchor = document.createElement('a');
    anchor.href = previewDataUrl;
    anchor.download = `CNIC_Print_${options.paperSize}_${options.layout}.png`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="font-mono text-xs uppercase tracking-widest text-doc">CNIC photocopy</p>
        <h1 className="max-w-3xl font-display text-3xl font-black leading-tight tracking-tight text-ink sm:text-4xl">
          Print CNIC front and back on one A4 page
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-ink-soft">
          Upload a photo or scan of each side. The tool places both sides on a card-sized sheet, lets you adjust the
          layout and filter, and exports a print-ready PDF or PNG.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-5">
          <section aria-labelledby="upload-title" className="rounded-2xl border border-line bg-paper-2 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-doc" />
                <h2 id="upload-title" className="font-display text-base font-bold text-ink">
                  Add the card images
                </h2>
              </div>
              <div className="flex items-center gap-1">
                {hasAnyImage && (
                  <button
                    type="button"
                    onClick={handleClearImages}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-3 hover:text-stamp"
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleLoadSampleCards}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-line bg-paper-2 px-3 text-sm font-semibold text-doc transition-colors hover:bg-paper-3"
                >
                  <Sparkles className="h-4 w-4" />
                  Load sample
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <label className="group flex min-h-32 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-line bg-paper-3/50 p-3 text-center transition-colors hover:border-doc focus-within:ring-2 focus-within:ring-gold focus-within:ring-offset-2 focus-within:ring-offset-paper">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      setFrontFile(file);
                      setActionMessage(null);
                    }
                    event.target.value = '';
                  }}
                  className="sr-only"
                />
                {frontPreviewUrl ? (
                  <>
                    <img
                      src={frontPreviewUrl}
                      alt="Selected front side of the ID card"
                      className="h-20 w-full rounded-lg border border-line object-contain"
                    />
                    <span className="mt-1 flex items-center gap-1 text-xs font-bold text-doc">
                      <Check className="h-3 w-3" /> Front added
                    </span>
                  </>
                ) : (
                  <>
                    <Upload className="mb-1 h-6 w-6 text-ink-soft group-hover:text-doc" />
                    <span className="text-sm font-semibold text-ink">Front of card</span>
                    <span className="text-xs text-ink-soft">Tap to choose</span>
                  </>
                )}
              </label>

              <label className="group flex min-h-32 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-line bg-paper-3/50 p-3 text-center transition-colors hover:border-gold focus-within:ring-2 focus-within:ring-gold focus-within:ring-offset-2 focus-within:ring-offset-paper">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      setBackFile(file);
                      setActionMessage(null);
                    }
                    event.target.value = '';
                  }}
                  className="sr-only"
                />
                {backPreviewUrl ? (
                  <>
                    <img
                      src={backPreviewUrl}
                      alt="Selected back side of the ID card"
                      className="h-20 w-full rounded-lg border border-line object-contain"
                    />
                    <span className="mt-1 flex items-center gap-1 text-xs font-bold text-gold">
                      <Check className="h-3 w-3" /> Back added
                    </span>
                  </>
                ) : (
                  <>
                    <Upload className="mb-1 h-6 w-6 text-ink-soft group-hover:text-gold" />
                    <span className="text-sm font-semibold text-ink">Back of card</span>
                    <span className="text-xs text-ink-soft">Tap to choose</span>
                  </>
                )}
              </label>
            </div>
          </section>

          <details className="group rounded-2xl border border-line bg-paper-2">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 p-4 [&::-webkit-details-marker]:hidden">
              <span className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-doc" />
                <span className="font-display text-base font-bold text-ink">Print settings</span>
              </span>
              <span className="flex items-center gap-2 text-xs text-ink-soft">
                <span className="hidden truncate sm:inline">
                  {paperLabel} · {activeLayout} · {activeFilter}
                </span>
                <ChevronDown className="h-4 w-4 flex-shrink-0 transition-transform group-open:rotate-180" />
              </span>
            </summary>

            <div className="space-y-5 border-t border-line p-4">
              <fieldset className="space-y-2">
                <legend className="text-sm font-medium text-ink">Layout</legend>
                <div className="grid grid-cols-2 gap-2">
                  {LAYOUT_OPTIONS.map((layout) => (
                    <button
                      key={layout.id}
                      type="button"
                      onClick={() => setOptions({ ...options, layout: layout.id })}
                      aria-pressed={options.layout === layout.id}
                      className={`min-h-11 rounded-lg border px-3 text-left text-sm font-medium transition-colors ${
                        options.layout === layout.id
                          ? 'border-doc bg-doc-soft text-doc'
                          : 'border-line text-ink-soft hover:border-doc/40 hover:text-ink'
                      }`}
                    >
                      {layout.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="space-y-2">
                <legend className="text-sm font-medium text-ink">Filter</legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {FILTER_OPTIONS.map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setOptions({ ...options, filter: filter.id })}
                      aria-pressed={options.filter === filter.id}
                      className={`min-h-11 rounded-lg border text-sm font-medium transition-colors ${
                        options.filter === filter.id
                          ? 'border-doc bg-doc text-white'
                          : 'border-line text-ink-soft hover:border-doc/40 hover:text-ink'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="paper-size" className="text-sm font-medium text-ink">
                    Paper size
                  </label>
                  <select
                    id="paper-size"
                    value={options.paperSize}
                    onChange={(event) => setOptions({ ...options, paperSize: event.target.value as CnicPaperSize })}
                    className="min-h-11 w-full rounded-lg border border-line bg-paper-3 px-3 text-base text-ink focus:outline-none focus:ring-2 focus:ring-gold"
                  >
                    <option value="a4">A4</option>
                    <option value="letter">US Letter</option>
                    <option value="legal">Legal</option>
                    <option value="3r">3R photo paper</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm font-medium text-ink">
                    <label htmlFor="card-scale">Card scale</label>
                    <span className="font-mono text-sm font-bold text-doc">
                      {Math.round(options.customScale * 100)}%
                    </span>
                  </div>
                  <div className="flex min-h-11 items-center">
                    <input
                      id="card-scale"
                      type="range"
                      min="0.7"
                      max="1.3"
                      step="0.05"
                      value={options.customScale}
                      onChange={(event) => setOptions({ ...options, customScale: parseFloat(event.target.value) })}
                      className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-paper-3 accent-doc"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 border-t border-line pt-4">
                <label className="flex min-h-11 cursor-pointer items-center justify-between gap-3">
                  <span className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-gold" />
                    <span className="text-sm font-medium text-ink">Purpose watermark</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={options.enableWatermark}
                    onChange={(event) => {
                      const enabled = event.target.checked;
                      setOptions({
                        ...options,
                        enableWatermark: enabled,
                        watermarkText:
                          enabled && !options.watermarkText ? CNIC_WATERMARK_PRESETS[0] : options.watermarkText
                      });
                    }}
                    className="h-5 w-5 rounded accent-doc"
                  />
                </label>

                {options.enableWatermark && (
                  <div className="space-y-3 rounded-xl border border-line bg-paper-3 p-3">
                    <select
                      value={options.watermarkText}
                      onChange={(event) => setOptions({ ...options, watermarkText: event.target.value })}
                      aria-label="Watermark text"
                      className="min-h-11 w-full rounded-lg border border-line bg-paper-2 px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-gold"
                    >
                      {CNIC_WATERMARK_PRESETS.map((watermark) => (
                        <option key={watermark} value={watermark}>
                          {watermark}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center justify-between gap-3 text-sm text-ink-soft">
                      <label htmlFor="watermark-opacity">Opacity</label>
                      <input
                        id="watermark-opacity"
                        type="range"
                        min="0.05"
                        max="0.4"
                        step="0.05"
                        value={options.watermarkOpacity}
                        onChange={(event) =>
                          setOptions({ ...options, watermarkOpacity: parseFloat(event.target.value) })
                        }
                        className="h-2 w-32 cursor-pointer accent-gold"
                      />
                    </div>
                    <p className="text-xs leading-relaxed text-ink-soft">
                      A visible label discourages casual reuse, but it does not prevent copying.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </details>
        </div>

        <div className="space-y-4 lg:col-span-7">
          <section aria-labelledby="preview-title" className="rounded-2xl border border-line bg-paper-2 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-gold" />
                <h2 id="preview-title" className="font-display text-base font-bold text-ink">
                  {paperLabel} print preview
                </h2>
              </div>
              <span className="rounded-full border border-line px-2.5 py-0.5 font-mono text-xs font-bold uppercase tracking-widest text-ink-soft">
                {paperLabel} · 150 DPI
              </span>
            </div>

            <div className="relative mt-3 flex min-h-[240px] max-h-[60vh] w-full items-center justify-center overflow-hidden rounded-lg border border-line bg-white p-2">
              {isGenerating && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-paper-2/90 text-doc backdrop-blur-sm">
                  <RefreshCw className="h-8 w-8 animate-spin" />
                  <span className="font-mono text-xs font-bold">Rendering the sheet...</span>
                </div>
              )}

              {previewDataUrl ? (
                <img
                  src={previewDataUrl}
                  alt={`Preview of the ${paperLabel} sheet with the front and back of the ID card`}
                  className="max-h-[55vh] w-auto max-w-full object-contain"
                />
              ) : (
                <p className="text-sm text-ink-soft">The print sheet will appear here.</p>
              )}

              {!hasAnyImage && (
                <p className="pointer-events-none absolute inset-x-3 bottom-3 rounded-lg bg-paper-2/95 px-3 py-2 text-center text-xs text-ink-soft">
                  Add the front and back, or load the sample.
                </p>
              )}
            </div>

            <p className="mt-2 text-xs leading-relaxed text-ink-soft">
              Print at 100% scale, not &quot;fit to page&quot;. Check the card size with a ruler before submitting.
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handlePrintDocument}
                disabled={!hasAnyImage || isGenerating}
                className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-doc px-4 text-base font-semibold text-white transition-colors hover:bg-doc-bright disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Printer className="h-4 w-4" />
                Print
              </button>

              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={!hasAnyImage || isGenerating}
                className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-gold px-4 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FileDown className="h-4 w-4" />
                Download PDF
              </button>

              <button
                type="button"
                onClick={handleDownloadSheet}
                disabled={!hasAnyImage || isGenerating}
                className="col-span-2 flex min-h-12 items-center justify-center gap-2 rounded-lg border border-line bg-paper-2 px-4 text-base font-semibold text-ink transition-colors hover:bg-paper-3 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download className="h-4 w-4 text-doc" />
                Download PNG
              </button>
            </div>

            {options.layout === 'pakistani-style' && (
              <p className="mt-2 text-center text-xs text-ink-soft">The PDF has two pages: the sheet and a duplicate.</p>
            )}

            {actionMessage && (
              <p role="alert" className="mt-3 rounded-lg border border-stamp/30 bg-stamp/5 px-3 py-2 text-sm text-stamp">
                {actionMessage}
              </p>
            )}
          </section>
        </div>
      </div>

      <ResponsiveAd />
    </div>
  );
}
