'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { AdBanner } from './AdBanner';
import { ADS } from '@/lib/data/ads';

export function StickyMobileAd() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const ad = ADS.mobileBanner;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center border-t border-line bg-paper/95 px-2 py-1 backdrop-blur-md   md:hidden">
      <button
        onClick={() => setVisible(false)}
        aria-label="Close advertisement"
        className="absolute -top-7 right-2 flex h-6 w-6 items-center justify-center rounded-full border border-line bg-paper text-ink-soft shadow "
      >
        <X className="h-3.5 w-3.5" />
      </button>
      <AdBanner width={ad.width} height={ad.height} adKey={ad.key} showLabel={false} />
    </div>
  );
}
