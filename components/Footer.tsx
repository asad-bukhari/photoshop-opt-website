'use client';

import Link from 'next/link';
import { Image, Printer, ShieldCheck } from 'lucide-react';

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
              Free browser tools to compress images and put the front and back of a CNIC on one A4 page.
            </p>
            <p className="text-xs text-ink-soft">Not affiliated with NADRA.</p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink">Tools</h2>
            <ul className="mt-2">
              <li>
                <Link
                  href="/image-opt"
                  className="flex min-h-11 items-center gap-2 text-sm text-ink-soft transition-colors hover:text-doc"
                >
                  <Image className="h-4 w-4 text-doc" />
                  Image Compressor
                </Link>
              </li>
              <li>
                <Link
                  href="/cnic-opt"
                  className="flex min-h-11 items-center gap-2 text-sm text-ink-soft transition-colors hover:text-doc"
                >
                  <Printer className="h-4 w-4 text-doc" />
                  CNIC Photocopy
                </Link>
              </li>
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
