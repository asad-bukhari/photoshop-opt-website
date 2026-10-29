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

  const frameClass = `flex min-h-[286px] w-full items-center justify-center md:min-h-[126px] ${className ?? ''}`;

  if (isDesktop === null) {
    return <div className={frameClass} aria-hidden />;
  }

  const ad = isDesktop ? ADS.leaderboard : ADS.mediumRectangle;
  return (
    <div className={frameClass}>
      <AdBanner width={ad.width} height={ad.height} adKey={ad.key} lazy={lazy} />
    </div>
  );
}
