'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';
import { Home, Image, Printer, Lock } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { ScaleRuler } from './CornerMarks';

const NAV_ITEMS = [
  { href: '/', label: 'Overview', mono: 'HOME', icon: Home },
  { href: '/image-opt', label: 'image-optimation', mono: 'IMAGE-OPT', icon: Image },
  { href: '/cnic-opt', label: 'cnic-copy-print-opt', mono: 'CNIC-PRINT', icon: Printer }
] as const;

interface HeaderProps {
  onOpenSecurity: () => void;
}

export function Header({ onOpenSecurity }: HeaderProps) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 w-full border-b border-line dark:border-rule bg-paper/95 dark:bg-ink/95 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-doc font-display text-base font-black text-white shadow-sm transition-colors group-hover:bg-doc-bright">
            P
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="font-display text-base font-bold tracking-tight text-ink dark:text-paper">
                Zaibi Tools
              </span>
              <span className="rounded border border-gold/40 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-gold">
                Proprietary
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-soft dark:text-rule">
              <ScaleRuler segments={6} className="text-gold" />
              <span>Image & CNIC Optimization Suite</span>
            </div>
          </div>
        </Link>

        {/* Primary nav — job sheet index */}
        <nav className="hidden items-center lg:flex" aria-label="Primary">
          {NAV_ITEMS.map((item, i) => {
            const active = isActive(item.href);
            return (
              <Fragment key={item.href}>
                {i > 0 && <span className="h-4 w-px bg-line dark:bg-rule" />}
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-widest transition-colors ${
                    active
                      ? 'text-doc dark:text-doc-bright'
                      : 'text-ink-soft dark:text-rule hover:text-ink dark:hover:text-paper'
                  }`}
                >
                  {item.mono}
                  {active && <span className="absolute inset-x-4 -bottom-px h-0.5 bg-gold" />}
                </Link>
              </Fragment>
            );
          })}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-line px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-widest text-doc dark:border-rule dark:text-doc-bright md:flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-doc opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-doc" />
            </span>
            All Systems Active
          </div>

          <button
            onClick={onOpenSecurity}
            className="rounded-lg p-2 text-ink-soft transition-colors hover:bg-paper-3 hover:text-ink dark:text-rule dark:hover:bg-ink-3 dark:hover:text-paper"
            title="Privacy & security protocols"
            aria-label="View privacy and security protocols"
          >
            <Lock className="h-4 w-4" />
          </button>

          <ThemeToggle />
        </div>
      </div>

      {/* Mobile sub-nav */}
      <nav className="flex items-center justify-around border-t border-line bg-paper-2/80 px-2 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest dark:border-rule dark:bg-ink-2/80 lg:hidden" aria-label="Primary mobile">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 ${
                active ? 'text-doc dark:text-doc-bright' : 'text-ink-soft dark:text-rule'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.mono.split('-')[0]}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
