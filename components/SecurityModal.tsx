'use client';

import { ShieldCheck, Lock, EyeOff, FileCode } from 'lucide-react';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SecurityModal({ isOpen, onClose }: SecurityModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-md" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg space-y-6 rounded-2xl border border-rule bg-ink-2 p-6 text-white shadow-2xl animate-scale-up">
        <div className="flex items-center justify-between border-b border-rule pb-4">
          <div className="flex items-center gap-2 text-doc-bright">
            <ShieldCheck className="h-5 w-5" />
            <h3 className="font-display text-base font-bold text-white">Security & Data Protection Protocols</h3>
          </div>
          <button onClick={onClose} className="text-rule transition-colors hover:text-white" aria-label="Close">
            ✕
          </button>
        </div>

        <div className="space-y-4 text-xs text-paper/80">
          <div className="flex gap-3 rounded-xl border border-rule bg-ink-3 p-3.5">
            <Lock className="mt-0.5 h-5 w-5 flex-shrink-0 text-doc-bright" />
            <div>
              <h4 className="mb-0.5 font-bold text-white">Zero-Server File Retention Guarantee</h4>
              <p className="leading-relaxed text-paper/60">
                All image compression  and CNIC document stitching execute inside
                client-side HTML5 Canvas. Your identity documents never touch external storage.
              </p>
            </div>
          </div>

          <div className="flex gap-3 rounded-xl border border-rule bg-ink-3 p-3.5">
            <EyeOff className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold" />
            <div>
              <h4 className="mb-0.5 font-bold text-white">EXIF GPS Location Privacy Stripper</h4>
              <p className="leading-relaxed text-paper/60">
                Source metadata tags (including camera serial numbers, smartphone GPS coordinates, and timestamp headers)
                are automatically stripped prior to image export.
              </p>
            </div>
          </div>

          <div className="flex gap-3 rounded-xl border border-rule bg-ink-3 p-3.5">
            <FileCode className="mt-0.5 h-5 w-5 flex-shrink-0 text-stamp" />
            <div>
              <h4 className="mb-0.5 font-bold text-white">Automated Malicious Payload Scanner</h4>
              <p className="leading-relaxed text-paper/60">
                Input buffers undergo strict MIME header validation and binary buffer inspection to neutralize embedded
                script injections or malicious image exploits.
              </p>
            </div>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={onClose}
              className="rounded-xl bg-doc px-6 py-2.5 text-xs font-bold text-white transition-colors hover:bg-doc-bright"
            >
              Acknowledge Protection Protocols
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
