import Link from 'next/link';
import { Zap, Printer, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CornerMarks, ScaleRuler } from './CornerMarks';
import { AdBanner } from './AdBanner';
import { ResponsiveAd } from './ResponsiveAd';
import { ADS } from '@/lib/data/ads';
import { REPO_INFO, FAQ_ITEMS } from '@/lib/data/initialData';

export function HomeHub() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Job sheet hero */}
      <section className="relative overflow-hidden rounded-2xl border border-rule bg-ink-2 p-8 text-paper shadow-2xl md:p-10">
        <CornerMarks className="text-gold" />
        <div className="absolute -right-6 top-1/2 hidden -translate-y-1/2 rotate-[-8deg] rounded border-2 border-stamp/50 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-stamp/80 md:block">
          Proprietary
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-widest text-rule">
          <span>JOB SHEET — Zaibi Tools</span>
          <span className="hidden sm:inline">Zero-server · 300 DPI calibration</span>
        </div>

        <h1 className="mt-6 max-w-2xl font-display text-3xl font-black leading-tight tracking-tight md:text-5xl">
          Precision document tools,
          <span className="text-doc-bright"> rendered entirely in your browser.</span>
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-paper/70">
          Batch-compress images to WebP or AVIF with GPS metadata stripped, or align your CNIC front and back onto a
          true-size A4 print sheet with anti-fraud watermarks. Files never leave this device.
        </p>

        <div className="mt-6 flex items-center gap-3 text-gold">
          <ScaleRuler segments={14} className="text-gold" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-rule">1:1 print calibration</span>
        </div>
      </section>

      <ResponsiveAd />

      {/* Tool sheets */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* image-opt-g8 */}
        <article className="group relative flex flex-col rounded-2xl border border-line bg-paper-2 p-6 shadow-sm transition-colors hover:border-gold/70 dark:border-rule dark:bg-ink-2 dark:shadow-2xl">
          <CornerMarks className="text-line opacity-70 transition-opacity group-hover:opacity-100 dark:text-rule" />

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-doc text-white shadow-sm">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-doc dark:text-doc-bright">
                  imgage optimation
                </div>
                <h3 className="font-display text-base font-bold text-ink dark:text-paper">
                  Batch Image Optimizer
                </h3>
              </div>
            </div>
            <span className="rounded border border-line px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-ink-soft dark:border-rule dark:text-rule">
              {REPO_INFO.imageOpt.version}
            </span>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-ink-soft dark:text-paper/60">
            {REPO_INFO.imageOpt.description}
          </p>

          <ul className="mt-4 space-y-1.5 text-xs text-ink-soft dark:text-paper/70">
            {REPO_INFO.imageOpt.features.slice(0, 3).map((f) => (
              <li key={f} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-doc dark:text-doc-bright" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <ScaleRuler segments={9} className="mt-5 text-gold" />

          <div className="mt-5 flex items-center justify-between border-t border-line pt-4 dark:border-rule">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft dark:text-rule">
              WebP · AVIF · JPEG · PNG
            </span>
            <Link
              href="/image-opt"
              className="inline-flex items-center gap-1.5 rounded-lg bg-doc px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-doc-bright"
            >
              Open tool <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </article>

        {/* cnic-copy-print-opt */}
        <article className="group relative flex flex-col rounded-2xl border border-line bg-paper-2 p-6 shadow-sm transition-colors hover:border-gold/70 dark:border-rule dark:bg-ink-2 dark:shadow-2xl">
          <CornerMarks className="text-line opacity-70 transition-opacity group-hover:opacity-100 dark:text-rule" />

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-doc text-white shadow-sm">
                <Printer className="h-5 w-5" />
              </div>
              <div>
                <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-doc dark:text-doc-bright">
                  cnic-print-opt
                </div>
                <h3 className="font-display text-base font-bold text-ink dark:text-paper">
                  CNIC & ID Print Suite
                </h3>
              </div>
            </div>
            <span className="rounded border border-line px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-ink-soft dark:border-rule dark:text-rule">
              {REPO_INFO.cnicOpt.version}
            </span>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-ink-soft dark:text-paper/60">
            {REPO_INFO.cnicOpt.description}
          </p>

          <ul className="mt-4 space-y-1.5 text-xs text-ink-soft dark:text-paper/70">
            {REPO_INFO.cnicOpt.features.slice(0, 3).map((f) => (
              <li key={f} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-doc dark:text-doc-bright" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <ScaleRuler segments={9} className="mt-5 text-gold" />

          <div className="mt-5 flex items-center justify-between border-t border-line pt-4 dark:border-rule">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft dark:text-rule">
              A4 · Letter · Legal
            </span>
            <Link
              href="/cnic-opt"
              className="inline-flex items-center gap-1.5 rounded-lg bg-doc px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-doc-bright"
            >
              Open tool <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </article>
      </div>

      <AdBanner width={ADS.mediumRectangle.width} height={ADS.mediumRectangle.height} adKey={ADS.mediumRectangle.key} />

      {/* FAQ sheet */}
      <section className="relative rounded-2xl border border-rule bg-ink-2 p-6 text-paper shadow-2xl sm:p-8">
        <CornerMarks className="text-gold" />
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-rule">Reference — FAQ</div>
            <h2 className="mt-1 font-display text-lg font-bold">Frequently asked questions</h2>
          </div>
          <span className="hidden rounded border border-rule px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-rule sm:block">
            Proprietary tech
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {FAQ_ITEMS.map((faq) => (
            <div key={faq.question} className="space-y-1.5 rounded-xl border border-rule bg-ink-3 p-4">
              <h4 className="text-xs font-bold text-doc-bright">{faq.question}</h4>
              <p className="text-xs leading-relaxed text-paper/60">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <ResponsiveAd />
    </div>
  );
}
