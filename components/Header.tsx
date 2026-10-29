'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Menu, ShieldCheck, X } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/image-opt', label: 'Image Compressor' },
  { href: '/cnic-opt', label: 'CNIC Photocopy' }
] as const;

interface HeaderProps {
  onOpenSecurity: () => void;
}

export function Header({ onOpenSecurity }: HeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper-2/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-h-11 items-center gap-2.5" aria-label="Zaibi Tools home">
          <span
            aria-hidden
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-doc font-display text-base font-black text-white"
          >
            Z
          </span>
          <span className="font-display text-base font-bold tracking-tight text-ink">Zaibi Tools</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors ${
                  active ? 'bg-doc-soft text-doc' : 'text-ink-soft hover:bg-paper-3 hover:text-ink'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <button
            onClick={onOpenSecurity}
            className="hidden min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-3 hover:text-ink lg:flex"
          >
            <ShieldCheck className="h-4 w-4" />
            How we handle files
          </button>
          <button
            ref={menuButtonRef}
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-ink transition-colors hover:bg-paper-3 lg:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`absolute inset-x-0 top-full border-b border-line bg-paper-2 shadow-sm lg:hidden ${
          menuOpen ? 'block' : 'hidden'
        }`}
      >
        <nav className="mx-auto max-w-6xl px-3 py-2" aria-label="Mobile">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={`flex min-h-11 items-center rounded-lg px-3 text-base font-medium ${
                      active ? 'bg-doc-soft text-doc' : 'text-ink hover:bg-paper-3'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenSecurity();
                }}
                className="flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-left text-base font-medium text-ink hover:bg-paper-3"
              >
                <ShieldCheck className="h-4 w-4 text-doc" />
                How we handle files
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
