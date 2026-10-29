'use client';

import Link from 'next/link';
import { Shield, Lock, Code2 } from 'lucide-react';
import { ScaleRuler } from './CornerMarks';

interface FooterProps {
  onOpenSecurity: () => void;
}

export function Footer({ onOpenSecurity }: FooterProps) {
  return (
    <footer className="w-full border-t border-line bg-paper-2 text-ink-soft transition-colors ">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand & purpose */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-doc font-display text-xs font-black text-white">
                P
              </div>
              <span className="font-display text-sm font-bold tracking-tight text-ink ">
                ZAIBI TOOLS
              </span>
            </div>
            <p className="text-xs leading-relaxed">
              Proprietary suite hosting <span className="font-mono text-doc ">image optimation tool</span> and{' '}
              <span className="font-mono text-doc ">cnic-copy-print-opt</span>, developed by Asad
              Bukhari.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px]">
              <Shield className="h-3.5 w-3.5 text-doc " />
              <span>100% client-side processing</span>
            </div>
          </div>

          {/* Tools */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-ink ">
              Enterprise Tools
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link
                  href="/image-opt"
                  className="flex items-center gap-1.5 font-medium transition-colors hover:text-doc "
                >
                  <Code2 className="h-3.5 w-3.5 text-doc " />
                  Batch Image Optimizer & WebP Converter
                </Link>
              </li>
              <li>
                <Link
                  href="/cnic-opt"
                  className="flex items-center gap-1.5 font-medium transition-colors hover:text-doc "
                >
                  <Code2 className="h-3.5 w-3.5 text-doc " />
                  CNIC Print Suite
                </Link>
              </li>
            </ul>
          </div>

          {/* Security */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-ink ">Protection</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={onOpenSecurity}
                  className="flex items-center gap-1 transition-colors hover:text-ink "
                >
                  <Lock className="h-3 w-3 text-doc " />
                  Security & Data Protocols
                </button>
              </li>
            </ul>
          </div>

          {/* Zero-server guarantee */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-ink ">
              Zero-Server Security
            </h4>
            <p className="text-xs leading-relaxed">
              Your identity documents and personal images stay entirely inside your browser memory. No server uploads or
              remote file storage.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-line pt-4 text-[11px]  sm:flex-row">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold uppercase tracking-wide text-ink ">Portal Enterprise Suite</span>
            <span className="h-3 w-px bg-line " />
            <div className="flex items-center gap-1.5 font-medium text-doc ">
              <span className="h-1.5 w-1.5 rounded-full bg-doc " />
              <span>Proprietary License • Asad Bukhari</span>
            </div>
          </div>
          <div className="flex items-center gap-4 font-bold uppercase tracking-wider">
            <ScaleRuler segments={8} className="text-gold" />
            <span>Zero-Retention Privacy</span>
            <div className="flex items-center gap-1 rounded border border-doc/30 px-2 py-0.5 text-doc ">
              <Shield className="h-3 w-3" /> SSL Secure
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
