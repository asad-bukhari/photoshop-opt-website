'use client';

import React, { useState, useEffect } from 'react';
import {
  Printer,
  Upload,
  Download,
  FileDown,
  ShieldCheck,
  Sparkles,
  Sliders,
  Check,
  Eye,
  Lock,
  FileText,
  RefreshCw
} from 'lucide-react';
import { CnicPrintOptions, CnicPaperSize, CnicLayoutPreset, CnicFilterMode } from '@/lib/types';
import { CNIC_WATERMARK_PRESETS, REPO_INFO } from '@/lib/data/initialData';
import { generateCnicPrintCanvas } from '@/lib/utils/cnicOptimizer';
import { CornerMarks, ScaleRuler } from './CornerMarks';
import { AdBanner } from './AdBanner';
import { ResponsiveAd } from './ResponsiveAd';
import { ADS } from '@/lib/data/ads';

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
      } catch (err) {
        reject(err);
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
  const [options, setOptions] = useState<CnicPrintOptions>(DEFAULT_OPTIONS);

  useEffect(() => {
    let isMounted = true;

    async function updatePreview() {
      setIsGenerating(true);
      try {
        const result = await generateCnicPrintCanvas(frontFile, backFile, options);
        if (isMounted) {
          setPreviewDataUrl(result.dataUrl);
        }
      } catch (err) {
        console.error('Failed to generate CNIC print preview:', err);
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
    const fctx = frontCanvas.getContext('2d')!;

    fctx.fillStyle = '#E0F2FE';
    fctx.fillRect(0, 0, 600, 380);
    fctx.strokeStyle = '#0284C7';
    fctx.lineWidth = 4;
    fctx.strokeRect(8, 8, 584, 364);

    fctx.fillStyle = '#0F172A';
    fctx.font = 'bold 20px sans-serif';
    fctx.fillText('ISLAMIC REPUBLIC OF PAKISTAN', 130, 45);
    fctx.font = 'bold 16px sans-serif';
    fctx.fillStyle = '#0369A1';
    fctx.fillText('National Identity Card (CNIC)', 130, 72);

    fctx.fillStyle = '#94A3B8';
    fctx.fillRect(25, 100, 100, 120);
    fctx.fillStyle = '#FFFFFF';
    fctx.font = '12px sans-serif';
    fctx.fillText('PHOTO', 55, 165);

    fctx.fillStyle = '#0F172A';
    fctx.font = 'bold 14px sans-serif';
    fctx.fillText('Name: ASAD BUKHARI', 140, 115);
    fctx.fillText('Father Name: SYED BUKHARI', 140, 145);
    fctx.fillText('Identity No: 61101-1234567-9', 140, 185);
    fctx.fillText('Date of Birth: 15.08.1995', 140, 215);

    fctx.fillStyle = '#15803D';
    fctx.beginPath();
    fctx.arc(520, 50, 25, 0, Math.PI * 2);
    fctx.fill();

    setFrontFile(frontCanvas.toDataURL('image/png'));

    const backCanvas = document.createElement('canvas');
    backCanvas.width = 600;
    backCanvas.height = 380;
    const bctx = backCanvas.getContext('2d')!;

    bctx.fillStyle = '#FEF3C7';
    bctx.fillRect(0, 0, 600, 380);
    bctx.strokeStyle = '#D97706';
    bctx.lineWidth = 4;
    bctx.strokeRect(8, 8, 584, 364);

    bctx.fillStyle = '#0F172A';
    bctx.font = 'bold 16px sans-serif';
    bctx.fillText('Address / Residence Details:', 25, 45);
    bctx.font = '13px sans-serif';
    bctx.fillText('House No. 104, Sector F-8/3, Islamabad, Pakistan', 25, 80);
    bctx.fillText('Tracking ID: 890214-9981-CNIC', 25, 110);

    bctx.fillStyle = '#000000';
    for (let x = 25; x < 550; x += 6) {
      const w = Math.random() > 0.5 ? 3 : 1;
      bctx.fillRect(x, 150, w, 60);
    }

    bctx.fillStyle = '#B45309';
    bctx.font = 'bold 14px sans-serif';
    bctx.fillText('Valid Upto: 2035 | Issue Date: 2025', 25, 250);

    setBackFile(backCanvas.toDataURL('image/png'));
  };

  const handlePrintDocument = async () => {
    if (!previewDataUrl) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const { w, h } = PAPER_SIZE_MM[options.paperSize];

    const pageCount = options.layout === 'pakistani-style' ? 2 : 1;
    const pages = Array.from(
      { length: pageCount },
      () => `<div class="page"><img src="${previewDataUrl}" alt="CNIC sheet" /></div>`
    ).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>CNIC Print Sheet - cnic-copy-print-opt</title>
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
    if (!previewDataUrl) return;

    setIsGenerating(true);
    try {
      const jsPDF = await loadJsPdfLibrary();
      if (!jsPDF) {
        throw new Error('PDF library is not available. Check your connection and try again.');
      }

      const jpegDataUrl = await canvasToJpegDataUrl(previewDataUrl);
      const { w, h } = PAPER_SIZE_MM[options.paperSize];

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [w, h] });
      pdf.addImage(jpegDataUrl, 'JPEG', 0, 0, w, h, undefined, 'FAST');

      if (options.layout === 'pakistani-style') {
        pdf.addPage([w, h], 'portrait');
        pdf.addImage(jpegDataUrl, 'JPEG', 0, 0, w, h, undefined, 'FAST');
      }

      pdf.save(`CNIC_Optimized_Print_${options.paperSize}_${options.layout}.pdf`);
    } catch (err) {
      console.error('Failed to generate CNIC PDF:', err);
      alert(err instanceof Error ? err.message : 'Failed to generate PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadSheet = () => {
    if (!previewDataUrl) return;
    const a = document.createElement('a');
    a.href = previewDataUrl;
    a.download = `CNIC_Optimized_Print_${options.paperSize}_${options.layout}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Job sheet header */}
      <section className="relative overflow-hidden rounded-2xl border border-rule bg-ink-2 p-6 text-paper shadow-2xl md:p-8">
        <CornerMarks className="text-gold" />
        <div className="absolute -right-5 top-1/2 hidden -translate-y-1/2 rotate-[-8deg] rounded border-2 border-stamp/40 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-stamp/70 lg:block">
          Official Use Only
        </div>

        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest">
              <span className="flex items-center gap-1 rounded border border-doc/40 bg-ink-3 px-2 py-1 font-bold text-doc-bright">
                <ShieldCheck className="h-3.5 w-3.5 text-doc-bright" />
                cnic-copy-print-opt engine
              </span>
              <span className="text-rule">{REPO_INFO.cnicOpt.version}</span>
            </div>
            <h1 className="font-display text-2xl font-black tracking-tight md:text-3xl">
              CNIC & ID document front + back A4 print layout optimizer
            </h1>
            <p className="text-sm leading-relaxed text-paper/70">
              Align identity card front and back photos onto a 1:1 true-size A4 sheet with anti-photocopy watermarks
              and high-contrast ink-saving document filters.
            </p>
          </div>

          <div className="flex flex-shrink-0 items-center gap-2 rounded-lg border border-rule bg-ink-3 px-3 py-2 font-mono text-[10px] font-medium text-paper/80">
            <ShieldCheck className="h-4 w-4 text-doc-bright" />
            <span>{REPO_INFO.cnicOpt.fullName}</span>
          </div>
        </div>
      </section>

      <ResponsiveAd />

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Upload & controls */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-2xl border border-line bg-paper-2 p-6 shadow-sm dark:border-rule dark:bg-ink-2 dark:shadow-xl">
            <div className="flex items-center justify-between border-b border-line pb-3 dark:border-rule">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-doc dark:text-doc-bright" />
                <h3 className="font-display text-sm font-bold text-ink dark:text-paper">Identity card upload</h3>
              </div>
              <button
                onClick={handleLoadSampleCards}
                className="flex items-center gap-1 rounded-lg border border-doc/30 bg-doc/10 px-2.5 py-1 text-xs font-semibold text-doc transition-colors hover:bg-doc/20 dark:text-doc-bright"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Load sample CNIC
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <label className="group relative flex min-h-[120px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-line p-4 text-center transition-all hover:border-doc bg-paper-3/50 dark:border-rule dark:bg-ink-3/50 dark:hover:border-doc">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && setFrontFile(e.target.files[0])}
                  className="hidden"
                />
                {frontFile ? (
                  <div className="flex w-full flex-col items-center">
                    <img
                      src={frontFile instanceof File ? URL.createObjectURL(frontFile) : frontFile}
                      alt="Front"
                      className="h-16 w-full rounded-lg border border-line object-contain dark:border-rule"
                    />
                    <span className="mt-1 flex items-center gap-1 text-[10px] font-bold text-doc dark:text-doc-bright">
                      <Check className="h-3 w-3" /> Front loaded
                    </span>
                  </div>
                ) : (
                  <>
                    <Upload className="mb-1 h-6 w-6 text-ink-soft group-hover:text-doc dark:text-rule" />
                    <span className="text-xs font-semibold text-ink dark:text-paper">CNIC FRONT</span>
                    <span className="text-[10px] text-ink-soft dark:text-rule">Upload image</span>
                  </>
                )}
              </label>

              <label className="group relative flex min-h-[120px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-line p-4 text-center transition-all hover:border-gold bg-paper-3/50 dark:border-rule dark:bg-ink-3/50 dark:hover:border-gold">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && setBackFile(e.target.files[0])}
                  className="hidden"
                />
                {backFile ? (
                  <div className="flex w-full flex-col items-center">
                    <img
                      src={backFile instanceof File ? URL.createObjectURL(backFile) : backFile}
                      alt="Back"
                      className="h-16 w-full rounded-lg border border-line object-contain dark:border-rule"
                    />
                    <span className="mt-1 flex items-center gap-1 text-[10px] font-bold text-gold">
                      <Check className="h-3 w-3" /> Back loaded
                    </span>
                  </div>
                ) : (
                  <>
                    <Upload className="mb-1 h-6 w-6 text-ink-soft group-hover:text-gold dark:text-rule" />
                    <span className="text-xs font-semibold text-ink dark:text-paper">CNIC BACK</span>
                    <span className="text-[10px] text-ink-soft dark:text-rule">Upload image</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="space-y-5 rounded-2xl border border-line bg-paper-2 p-6 shadow-sm dark:border-rule dark:bg-ink-2 dark:shadow-xl">
            <div className="flex items-center gap-2 border-b border-line pb-3 dark:border-rule">
              <Sliders className="h-4 w-4 text-doc dark:text-doc-bright" />
              <h3 className="font-display text-sm font-bold text-ink dark:text-paper">Print sheet layout</h3>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[10px] font-semibold uppercase tracking-widest text-ink-soft dark:text-rule">
                Card positioning preset
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'standard-top-bottom', label: 'Centered stacked (top/bottom)' },
                  { id: 'side-by-side', label: 'Side-by-side horizontal' },
                  { id: 'dual-copy-a4', label: 'Dual copy (2 sets / sheet)' },
                  { id: 'quad-copy-a4', label: 'Quad copy (4 sets / sheet)' },
                  { id: 'pakistani-style', label: 'Pakistani print (grid)' }
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setOptions({ ...options, layout: l.id as CnicLayoutPreset })}
                    className={`rounded-xl border p-2.5 text-left text-xs font-medium transition-all ${
                      options.layout === l.id
                        ? 'border-doc bg-doc/10 font-semibold text-doc dark:text-doc-bright'
                        : 'border-line text-ink-soft hover:border-doc/50 dark:border-rule dark:text-rule'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[10px] font-semibold uppercase tracking-widest text-ink-soft dark:text-rule">
                Document scan mode filter
              </label>
              <div className="grid grid-cols-4 gap-1.5 rounded-xl border border-line bg-paper-3 p-1 dark:border-rule dark:bg-ink-3">
                {[
                  { id: 'original', label: 'Original' },
                  { id: 'high-contrast-bw', label: 'B&W scan' },
                  { id: 'grayscale', label: 'Grayscale' },
                  { id: 'enhanced', label: 'Color boost' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setOptions({ ...options, filter: f.id as CnicFilterMode })}
                    className={`rounded-lg py-1.5 text-[11px] font-semibold transition-all ${
                      options.filter === f.id
                        ? 'bg-doc text-white shadow-md'
                        : 'text-ink-soft hover:text-ink dark:text-rule dark:hover:text-paper'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="font-mono text-[10px] font-semibold uppercase tracking-widest text-ink-soft dark:text-rule">
                  Paper size
                </label>
                <select
                  value={options.paperSize}
                  onChange={(e) => setOptions({ ...options, paperSize: e.target.value as CnicPaperSize })}
                  className="mt-1 w-full rounded-xl border border-line bg-paper-3 px-3 py-2 text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-gold dark:border-rule dark:bg-ink-3 dark:text-paper"
                >
                  <option value="a4">Standard A4 sheet</option>
                  <option value="letter">US letter</option>
                  <option value="legal">Legal sheet</option>
                  <option value="3r">3R photo paper</option>
                </select>
              </div>

              <div>
                <label className="font-mono text-[10px] font-semibold uppercase tracking-widest text-ink-soft dark:text-rule">
                  Scale calibration
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="range"
                    min="0.7"
                    max="1.3"
                    step="0.05"
                    value={options.customScale}
                    onChange={(e) => setOptions({ ...options, customScale: parseFloat(e.target.value) })}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-paper-3 accent-doc dark:bg-ink-3"
                  />
                  <span className="font-mono text-xs font-bold text-doc dark:text-doc-bright">
                    {Math.round(options.customScale * 100)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 border-t border-line pt-3 dark:border-rule">
              <label className="flex cursor-pointer items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-gold" />
                  <span className="text-xs font-bold text-ink dark:text-paper">Anti-photocopy watermark</span>
                </div>
                <input
                  type="checkbox"
                  checked={options.enableWatermark}
                  onChange={(e) => {
                    const enabled = e.target.checked;
                    setOptions({
                      ...options,
                      enableWatermark: enabled,
                      watermarkText: enabled && !options.watermarkText ? CNIC_WATERMARK_PRESETS[0] : options.watermarkText
                    });
                  }}
                  className="h-4 w-4 rounded accent-doc"
                />
              </label>

              {options.enableWatermark && (
                <div className="space-y-2 rounded-xl border border-line bg-paper-3 p-3 dark:border-rule dark:bg-ink-3">
                  <select
                    value={options.watermarkText}
                    onChange={(e) => setOptions({ ...options, watermarkText: e.target.value })}
                    className="w-full rounded-xl border border-line bg-paper-2 px-3 py-1.5 text-xs font-medium text-ink dark:border-rule dark:bg-ink-2 dark:text-paper"
                  >
                    {CNIC_WATERMARK_PRESETS.map((wm) => (
                      <option key={wm} value={wm}>
                        {wm}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-ink-soft dark:text-rule">
                    <span>Watermark opacity:</span>
                    <input
                      type="range"
                      min="0.05"
                      max="0.4"
                      step="0.05"
                      value={options.watermarkOpacity}
                      onChange={(e) => setOptions({ ...options, watermarkOpacity: parseFloat(e.target.value) })}
                      className="w-24 cursor-pointer accent-gold"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live preview & actions */}
        <div className="space-y-4 lg:col-span-7">
          <div className="space-y-4 rounded-2xl border border-rule bg-ink-2 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-rule pb-3">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-gold" />
                <h3 className="font-display text-sm font-bold text-white">Live 1:1 print sheet preview</h3>
              </div>
              <span className="rounded-full border border-rule px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-paper/70">
                {options.paperSize} @ 150 DPI
              </span>
            </div>

            <div className="relative flex h-[520px] w-full items-center justify-center overflow-auto rounded-xl border border-rule bg-ink-3 p-4 shadow-inner">
              {isGenerating && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-ink/80 text-doc-bright backdrop-blur-sm">
                  <RefreshCw className="h-8 w-8 animate-spin" />
                  <span className="font-mono text-xs font-bold">Rendering document sheet...</span>
                </div>
              )}

              {previewDataUrl ? (
                <img
                  src={previewDataUrl}
                  alt="A4 CNIC print sheet"
                  className="max-h-full rounded border border-line object-contain shadow-2xl dark:border-rule"
                />
              ) : (
                <div className="space-y-3 text-center text-xs text-paper/60">
                  <p>Upload CNIC front & back, or click &quot;Load sample CNIC&quot; to generate the print layout.</p>
                  <ScaleRuler segments={10} className="mx-auto justify-center text-gold" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handlePrintDocument}
                disabled={!previewDataUrl}
                className="flex items-center justify-center gap-2 rounded-xl bg-doc py-3.5 text-sm font-bold text-white shadow-lg shadow-doc/25 transition-all hover:bg-doc-bright disabled:opacity-50"
              >
                <Printer className="h-4 w-4" />
                Print now
              </button>

              <button
                onClick={handleDownloadPdf}
                disabled={!previewDataUrl || isGenerating}
                className="flex items-center justify-center gap-2 rounded-xl bg-gold py-3.5 text-sm font-bold text-ink shadow-lg shadow-gold/25 transition-all hover:opacity-90 disabled:opacity-50"
              >
                <FileDown className="h-4 w-4" />
                Download PDF{options.layout === 'pakistani-style' ? ' (2 pages)' : ''}
              </button>

              <button
                onClick={handleDownloadSheet}
                disabled={!previewDataUrl}
                className="col-span-2 flex items-center justify-center gap-2 rounded-xl border border-rule bg-ink-3 py-3 text-sm font-bold text-white transition-all hover:bg-ink-4 disabled:opacity-50"
              >
                <Download className="h-4 w-4 text-doc-bright" />
                Download PNG
              </button>
            </div>

            {options.layout === 'pakistani-style' && (
              <p className="pt-2 text-center font-mono text-[10px] font-semibold uppercase tracking-widest text-paper/60">
                PDF prints 2 pages: original sheet + one duplicate
              </p>
            )}
          </div>
        </div>
      </div>

      <AdBanner width={ADS.mediumRectangle.width} height={ADS.mediumRectangle.height} adKey={ADS.mediumRectangle.key} />
    </div>
  );
}
