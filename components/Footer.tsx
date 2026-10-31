'use client';

import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { ToolIcon } from './tool/ToolIcon';
import { getNavTools, toolHref } from '@/lib/data/tools';

interface FooterProps {
  onOpenSecurity: () => void;
}

export function Footer({ onOpenSecurity }: FooterProps) {
  return (
    <footer className="border-t border-line bg-paper-2 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div className="col-span-2 space-y-3 sm:col-span-1">
            <Link href="/" className="flex min-h-11 items-center gap-2" aria-label="Zaibi Tools home">
              <span
                aria-hidden
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-doc font-display text-sm font-black text-white"
              >
                Z
              </span>
              <span className="font-display text-sm font-bold tracking-tight text-ink">Zaibi Tools</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-ink-soft">
              Free browser tools for images, photos, PDFs and CNIC copies. Your files stay on your device.
            </p>
            <p className="text-xs text-ink-soft">Not affiliated with NADRA.</p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink">Tools</h2>
            <ul className="mt-2">
              {getNavTools().map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={toolHref(tool)}
                    className="flex min-h-11 items-center gap-2 text-sm text-ink-soft transition-colors hover:text-doc"
                  >
                    <ToolIcon name={tool.icon} className="h-4 w-4 text-doc" />
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink">Site</h2>
            <ul className="mt-2">
              <li>
                <button
                  onClick={onOpenSecurity}
                  className="flex min-h-11 items-center gap-2 text-left text-sm text-ink-soft transition-colors hover:text-doc"
                >
                  <ShieldCheck className="h-4 w-4 text-doc" />
                  How we handle files
                </button>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="flex min-h-11 items-center text-sm text-ink-soft transition-colors hover:text-doc"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="flex min-h-11 items-center text-sm text-ink-soft transition-colors hover:text-doc"
                >
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-line pt-4 text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Zaibi Tools. Free to use.</p>
          <p>Your selected files are processed in your browser.</p>
        </div>
      </div>
    </footer>
  );
}
