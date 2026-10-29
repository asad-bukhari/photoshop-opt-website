'use client';

import { useCallback, useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { SecurityModal } from './SecurityModal';

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [securityOpen, setSecurityOpen] = useState(false);
  const openSecurity = useCallback(() => setSecurityOpen(true), []);
  const closeSecurity = useCallback(() => setSecurityOpen(false), []);

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:border focus:border-line focus:bg-paper-2 focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-ink focus:shadow-lg"
      >
        Skip to content
      </a>
      <Header onOpenSecurity={openSecurity} />
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {children}
      </main>
      <Footer onOpenSecurity={openSecurity} />
      <SecurityModal isOpen={securityOpen} onClose={closeSecurity} />
    </div>
  );
}
