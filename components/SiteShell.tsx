'use client';

import { useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { SecurityModal } from './SecurityModal';
import { StickyMobileAd } from './StickyMobileAd';

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [securityOpen, setSecurityOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col pb-16 md:pb-0">
      <Header onOpenSecurity={() => setSecurityOpen(true)} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      <Footer onOpenSecurity={() => setSecurityOpen(true)} />
      <SecurityModal isOpen={securityOpen} onClose={() => setSecurityOpen(false)} />
      <StickyMobileAd />
    </div>
  );
}
