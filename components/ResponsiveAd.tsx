'use client';

import { useEffect, useState } from 'react';
import { AdBanner } from './AdBanner';
import { ADS } from '@/lib/data/ads';

interface ResponsiveAdProps {
  className?: string;
  lazy?: boolean;
}

export function ResponsiveAd({ className, lazy }: ResponsiveAdProps) {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  if (isDesktop === null) {
    return <div className="h-[250px] w-full md:h-[90px]" aria-hidden />;
  }

  const ad = isDesktop ? ADS.leaderboard : ADS.mediumRectangle;
  return <AdBanner width={ad.width} height={ad.height} adKey={ad.key} className={className} lazy={lazy} />;
}
