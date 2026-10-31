import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { ResponsiveAd } from './ResponsiveAd';
import { FaqList } from './FaqList';
import { ToolIcon } from './tool/ToolIcon';
import { FAQ_ITEMS } from '@/lib/data/initialData';
import { getLiveToolCategories, getLiveTools, toolHref } from '@/lib/data/tools';

const POPULAR_TASKS = [
  { href: '/image-compressor#compress-jpg', label: 'Compress an image to 20KB' },
  { href: '/image-compressor#compress-jpg', label: 'Compress an image to 50KB' },
  { href: '/image-compressor#compress-jpg', label: 'Compress an image to 100KB' },
  { href: '/photo-signature-resizer', label: 'Resize a photo to 300x400' },
  { href: '/photo-signature-resizer', label: 'Resize a signature to 200x230' },
  { href: '/cnic-photocopy#how-to-print-cnic', label: 'Print CNIC front and back on A4' },
  { href: '/cnic-photocopy#cnic-pdf', label: 'Make a CNIC photocopy PDF' },
  { href: '/image-compressor#convert-formats', label: 'Convert PNG to WebP' }
] as const;

const STEPS = [
  'Choose a tool.',
  'Add your files. The tool reads them in your browser.',
  'Download the result, or print the CNIC sheet at 100% scale.'
] as const;

export function HomeHub() {
  const liveTools = getLiveTools();
  const primaryTool = liveTools[0];
  const secondaryTool = liveTools[1];

  return (
    <div className="space-y-10">
      <section
        aria-labelledby="home-title"
        className="rounded-2xl border border-line bg-paper-2 p-5 sm:p-8 lg:p-10"
      >
        <p className="font-mono text-xs uppercase tracking-widest text-doc">Zaibi Tools</p>
        <h1
          id="home-title"
          className="mt-3 max-w-3xl font-display text-3xl font-black leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl"
        >
          Compress images, resize photos and print CNIC copies in your browser
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft">
          Zaibi Tools has free browser tools for image compression, exact-size photo and signature resizing, and
          CNIC print sheets. Your files stay on your device.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {primaryTool && (
            <Link
              href={toolHref(primaryTool)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-doc px-5 text-base font-semibold text-white transition-colors hover:bg-doc-bright"
            >
              {primaryTool.actionLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
          {secondaryTool && (
            <Link
              href={toolHref(secondaryTool)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-line bg-paper-2 px-5 text-base font-semibold text-ink transition-colors hover:bg-paper-3"
            >
              {secondaryTool.actionLabel}
            </Link>
          )}
        </div>
      </section>

      <section aria-labelledby="tools-title" className="space-y-6">
        <h2 id="tools-title" className="font-display text-2xl font-bold tracking-tight text-ink">
          Tools
        </h2>
        {getLiveToolCategories().map((group) => (
          <div key={group.category} className="space-y-3">
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-gold">{group.label}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {group.tools.map((tool) => (
                <article
                  key={tool.id}
                  className="flex flex-col rounded-2xl border border-line bg-paper-2 p-5 transition-colors hover:border-doc/40 sm:p-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-doc-soft text-doc">
                      <ToolIcon name={tool.icon} className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-mono text-xs uppercase tracking-widest text-doc">{tool.name}</p>
                      <h4 className="mt-1 font-display text-lg font-bold text-ink">{tool.h1}</h4>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-ink-soft">{tool.description}</p>
                  <ul className="mt-4 space-y-2 text-sm text-ink-soft">
                    {tool.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-doc" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={toolHref(tool)}
                    className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-doc px-4 text-base font-semibold text-white transition-colors hover:bg-doc-bright"
                  >
                    {tool.actionLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section aria-labelledby="tasks-title" className="space-y-4">
        <h2 id="tasks-title" className="font-display text-2xl font-bold tracking-tight text-ink">
          Popular tasks
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR_TASKS.map((task) => (
            <li key={`${task.href}-${task.label}`}>
              <Link
                href={task.href}
                className="flex min-h-11 items-center justify-between gap-3 rounded-xl border border-line bg-paper-2 px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-doc/40 hover:text-doc"
              >
                {task.label}
                <ArrowRight className="h-4 w-4 flex-shrink-0 text-doc" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <ResponsiveAd />

      <section aria-labelledby="how-title" className="space-y-4">
        <h2 id="how-title" className="font-display text-2xl font-bold tracking-tight text-ink">
          How it works
        </h2>
        <ol className="grid gap-3 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step} className="rounded-xl border border-line bg-paper-2 p-4">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-gold">
                Step {index + 1}
              </span>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="privacy-title" className="rounded-xl border border-doc/20 bg-doc-soft p-5 sm:p-6">
        <h2 id="privacy-title" className="font-display text-xl font-bold text-ink">
          Your files stay in your browser
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          The tools read and process your files with the HTML5 Canvas API in this browser. They do not upload your
          selected files to a server. The site loads Google Analytics and third-party ads.
        </p>
      </section>

      <section aria-labelledby="faq-title" className="space-y-4">
        <h2 id="faq-title" className="font-display text-2xl font-bold tracking-tight text-ink">
          Frequently asked questions
        </h2>
        <FaqList items={FAQ_ITEMS} />
      </section>
    </div>
  );
}
